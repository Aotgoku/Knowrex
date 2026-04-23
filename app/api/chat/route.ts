import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { performRAG, shouldUseRAG, getRAGSummary, RAGSource, cleanDocumentText } from '@/lib/ragSystem';
import { buildRAGPrompt, GENERAL_SYSTEM_PROMPT, formatContextWithSources, getCitationInstruction } from '@/lib/promptTemplates';
import { MessageSource } from '@/types/chat';
import { shouldEscalate, shouldOfferEscalation } from '@/lib/escalationSystem';
import { EscalationTriggerResult, EscalationSource } from '@/types/escalation';

// ============================================
// Gemini Chat API Route with RAG Support
// 
// This API route handles all communication with
// Google's Gemini API, with Retrieval Augmented Generation.
//
// RAG FLOW:
// 1. User sends message
// 2. Search vector database for relevant documents
// 3. If relevant chunks found → Add to prompt
// 4. Send augmented prompt to Gemini
// 5. Stream response back with sources
//
// SECURITY: The API key is stored in environment
// variables and never exposed to the frontend.
// ============================================

// Initialize the Gemini client
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Helper function to add delay (for retry logic)
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry function with exponential backoff for rate limit errors
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      const isRetryableError = 
        error?.status === 429 || 
        error?.status === 503 ||
        error?.message?.toLowerCase().includes('rate limit') ||
        error?.message?.toLowerCase().includes('quota') ||
        error?.message?.toLowerCase().includes('too many requests') ||
        error?.message?.toLowerCase().includes('503') ||
        error?.message?.toLowerCase().includes('service unavailable') ||
        error?.message?.toLowerCase().includes('high demand');
      
      if (isRetryableError && attempt < maxRetries - 1) {
        const delayMs = initialDelay * Math.pow(2, attempt);
        console.log(`API overloaded (${error?.status || 'unknown'}), retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await delay(delayMs);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

/**
 * Convert RAGSource to MessageSource for API response
 */
function toMessageSources(sources: RAGSource[]): MessageSource[] {
  return sources.map(s => ({
    documentName: s.documentName,
    chunkId: s.chunkId,
    text: s.text,
    score: s.score
  }));
}

/**
 * POST handler for chat messages with RAG support
 */
export async function POST(request: NextRequest) {
  // Variables for RAG metadata (will be sent in headers or separate response)
  let usedRAG = false;
  let sources: MessageSource[] = [];
  let confidence = 0;
  let escalationResult: EscalationTriggerResult | null = null;
  let documentsSearched = 0;
  let topMatchScore = 0;

  try {
    // Parse the request body
    const body = await request.json();
    const { 
      message, 
      history = [], 
      ragEnabled = true,  // RAG enabled by default
      minConfidence = 0.25,  // Lower threshold - semantic similarity is typically 20-50%
      selectedDocumentId  // Optional: filter to specific document
    } = body;

    // Validate the message
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('GEMINI')));
      return new Response(
        JSON.stringify({ 
          error: 'AI service is not configured. Please add your Gemini API key to .env file and restart the dev server.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get Gemini client
    const client = getGeminiClient();
    if (!client) {
      throw new Error('Failed to initialize Gemini client');
    }

    // Get the model - use stable models with fallback
    // gemini-1.5-flash is fast, stable and less overloaded than 2.5-flash
    const PRIMARY_MODEL = 'gemini-1.5-flash';
    const FALLBACK_MODEL = 'gemini-1.5-pro';
    const model = client.getGenerativeModel({ 
      model: PRIMARY_MODEL
    });
    const fallbackModel = client.getGenerativeModel({
      model: FALLBACK_MODEL
    });

    // ============================================
    // RAG: Search for relevant document context
    // ============================================
    let systemPrompt = GENERAL_SYSTEM_PROMPT;
    let noDocumentMatch = false; // Track if we found no relevant documents
    
    if (ragEnabled && shouldUseRAG(message)) {
      console.log('[Chat API] RAG enabled, searching documents...');
      if (selectedDocumentId) {
        console.log('[Chat API] Filtering to document ID:', selectedDocumentId);
      }
      
      try {
        const ragResult = await performRAG(message, {
          topK: 20,  // Search more chunks for comprehensive coverage
          minScore: minConfidence,
          documentId: selectedDocumentId  // Filter to specific document if set
        });
        
        if (ragResult.hasContext) {
          usedRAG = true;
          sources = toMessageSources(ragResult.sources);
          confidence = ragResult.avgConfidence;
          documentsSearched = ragResult.sources.length;
          topMatchScore = ragResult.sources[0]?.score || 0;
          
          // Build RAG-enhanced prompt
          const formattedContext = formatContextWithSources(ragResult.sources);
          const citationInstruction = getCitationInstruction(
            ragResult.sources.map((s: RAGSource) => s.documentName)
          );
          
          systemPrompt = buildRAGPrompt(formattedContext) + citationInstruction;
          
          console.log('[Chat API]', getRAGSummary(ragResult));
        } else {
          // NO DOCUMENTS FOUND - Don't use general knowledge!
          console.log('[Chat API] No relevant documents found - will suggest escalation');
          noDocumentMatch = true;
        }
        
        // ============================================
        // ESCALATION CHECK
        // Check if this query should be escalated to a human
        // ============================================
        escalationResult = shouldEscalate(
          message,
          confidence,
          documentsSearched,
          topMatchScore,
          sources.length
        );
        
        if (escalationResult.shouldEscalate) {
          console.log('[Chat API] Escalation triggered:', escalationResult.reason, '-', escalationResult.message);
        } else if (shouldOfferEscalation(confidence)) {
          console.log('[Chat API] Low confidence - offering escalation option:', Math.round(confidence * 100) + '%');
        }
        
      } catch (ragError) {
        console.error('[Chat API] RAG error:', ragError);
        // Continue without RAG on error
      }
    }

    // Build conversation history for Gemini
    const chatHistory = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Always start fresh with the system prompt for RAG queries
    // This ensures the document context is ALWAYS present
    if (chatHistory.length === 0) {
      chatHistory.push({
        role: 'user',
        parts: [{ text: 'Hello, I need help with information from documents.' }],
      });
      chatHistory.push({
        role: 'model',
        parts: [{ text: 'Hello! I am Knowrex, ready to help you find information from your uploaded documents. What would you like to know?' }],
      });
    }

    // Start a chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.3,  // Lower temperature for more factual responses
        maxOutputTokens: 8192,  // Increased for complete, comprehensive answers
        topP: 0.8,
      },
    });

    // BUILD THE FINAL MESSAGE TO SEND
    // If using RAG, include the FULL context in the message itself
    let augmentedMessage = message;
    
    if (usedRAG && sources.length > 0) {
      // Build detailed context with ALL the document content
      // Clean up the text for better readability
      const contextParts = sources.map((s, i) => {
        const scorePercent = Math.round(s.score * 100);
        const cleanedText = cleanDocumentText(s.text);
        return `📄 DOCUMENT EXCERPT ${i + 1} (Chunk #${s.chunkId.split('-chunk-')[1] || i}, ${scorePercent}% match, from "${s.documentName}"):\n"""\n${cleanedText}\n"""`;
      }).join('\n\n');
      
      // Create a very explicit message with context and formatting instructions
      augmentedMessage = `🚨 CRITICAL INSTRUCTION: You MUST provide a COMPLETE, DETAILED answer using ALL relevant information from the documents below.

I have provided ${sources.length} document excerpts below. READ ALL OF THEM and synthesize a comprehensive answer.

DO NOT:
- Give vague or general summaries
- Say "the document discusses" without providing the actual content
- Truncate lists or bullet points
- Skip any relevant information from ANY of the excerpts
- Stop mid-sentence or mid-list
- Mention chunk numbers (like "Chunk #1", "Chunk #5") in your answer - these are for internal reference only
- Include phrases like "according to Chunk #X" or "as stated in Chunk #Y"

DO:
- Read ALL ${sources.length} excerpts carefully
- Extract and present SPECIFIC information from each relevant excerpt
- Include ALL points, items, and details that answer the question
- If there's a list of items, list EVERY item with its full description
- Quote specific text from the documents
- Combine information from multiple excerpts if they relate to the same topic
- Use proper formatting with bullet points (•)
- Write a clean, professional answer without referencing chunk numbers

${contextParts}

---
USER QUESTION: ${message}
---

📌 RESPONSE REQUIREMENTS:
1. Start with: "According to [document name]:"
2. Provide SPECIFIC, DETAILED information from the excerpts - not vague summaries
3. DO NOT mention chunk numbers in your answer text - write naturally
4. If the excerpts contain definitions, policies, procedures, or lists - include them in full
5. Organize information clearly with headings and bullet points
6. Include ALL relevant information from ALL ${sources.length} excerpts
7. Write a clean, readable answer - the user will see source chunks separately in a "Sources" section`;
      
      // Debug: log what we're sending
      console.log('[Chat API] Sending to Gemini with RAG context:');
      console.log('[Chat API] Sources count:', sources.length);
      console.log('[Chat API] First source text preview:', sources[0]?.text?.substring(0, 200));
    }

    // ============================================
    // NO DOCUMENT MATCH - Return static response
    // Don't use Gemini's general knowledge!
    // ============================================
    if (noDocumentMatch) {
      console.log('[Chat API] No document match - returning static response');
      
      const noMatchResponse = `I couldn't find any information related to your question in our knowledge base documents.

**Your question:** "${message}"

**What you can do:**
• 🔄 Try rephrasing your question with different keywords
• 📄 Make sure the relevant document has been uploaded
• 👤 **Get help from a human expert** - Click the button below to escalate this to our support team

I can only answer questions based on the documents uploaded to our system. I don't use general knowledge to ensure you get accurate, verified information.`;

      const encoder = new TextEncoder();
      const metadata = {
        usedRAG: false,
        sources: [],
        confidence: 0,
        type: 'metadata',
        noDocumentMatch: true,
        escalation: {
          shouldEscalate: false,
          reason: 'no_document_match',
          urgency: 'medium',
          message: 'No relevant documents found for this question',
          offerEscalation: true  // Always offer escalation when no docs found
        },
        documentsSearched: 0,
        topMatchScore: 0
      };
      
      const readableStream = new ReadableStream({
        start(controller) {
          const metadataStr = `__RAG_METADATA__${JSON.stringify(metadata)}__END_METADATA__`;
          controller.enqueue(encoder.encode(metadataStr));
          controller.enqueue(encoder.encode(noMatchResponse));
          controller.close();
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }

    // Send the message and get a streaming response
    // Try primary model first, fall back to backup model on persistent 503s
    let result;
    try {
      result = await retryWithBackoff(
        async () => await chat.sendMessageStream(augmentedMessage),
        3,
        2000
      );
    } catch (primaryError: any) {
      const isOverloaded = 
        primaryError?.status === 503 ||
        primaryError?.message?.toLowerCase().includes('service unavailable') ||
        primaryError?.message?.toLowerCase().includes('high demand');
      
      if (isOverloaded) {
        console.log(`[Chat API] Primary model (${PRIMARY_MODEL}) overloaded, switching to fallback (${FALLBACK_MODEL})...`);
        const fallbackChat = fallbackModel.startChat({
          history: chatHistory,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
            topP: 0.8,
          },
        });
        result = await retryWithBackoff(
          async () => await fallbackChat.sendMessageStream(augmentedMessage),
          2,
          3000
        );
      } else {
        throw primaryError;
      }
    }

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    
    // Log what we're sending
    console.log('[Chat API] Response metadata:', { 
      usedRAG, 
      sourcesCount: sources.length, 
      confidence: (confidence * 100).toFixed(1) + '%',
      escalation: escalationResult?.shouldEscalate ? escalationResult.reason : 'none'
    });
    
    // Create a custom response format that includes both the stream and metadata
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // First, send metadata as a JSON line (now includes escalation info)
          const metadata = {
            usedRAG,
            sources,
            confidence,
            type: 'metadata',
            // Escalation data
            escalation: escalationResult ? {
              shouldEscalate: escalationResult.shouldEscalate,
              reason: escalationResult.reason,
              urgency: escalationResult.urgency,
              message: escalationResult.message,
              offerEscalation: shouldOfferEscalation(confidence)
            } : null,
            documentsSearched,
            topMatchScore
          };
          const metadataStr = `__RAG_METADATA__${JSON.stringify(metadata)}__END_METADATA__`;
          console.log('[Chat API] Sending metadata with', sources.length, 'sources, usedRAG:', usedRAG);
          controller.enqueue(encoder.encode(metadataStr));
          
          // Then stream the actual response
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (streamError) {
          console.error('Stream error:', streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-RAG-Used': usedRAG.toString(),
        'X-RAG-Confidence': confidence.toString(),
        'X-RAG-Sources-Count': sources.length.toString(),
      },
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Chat API Error:', error);
    }

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      // 503 - Model overloaded / service unavailable
      if (errorMsg.includes('503') ||
          errorMsg.includes('service unavailable') ||
          errorMsg.includes('high demand')) {
        return new Response(
          JSON.stringify({ 
            error: '⏳ The AI service is currently overloaded. Please wait a few seconds and try again.' 
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (errorMsg.includes('429') || 
          errorMsg.includes('quota') || 
          errorMsg.includes('rate limit') ||
          errorMsg.includes('too many requests')) {
        return new Response(
          JSON.stringify({ 
            error: '⚠️ Rate limit exceeded. Please wait a moment and try again.' 
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (errorMsg.includes('api key') || 
          errorMsg.includes('api_key') ||
          errorMsg.includes('401') || 
          errorMsg.includes('unauthorized')) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid API key. Please check your Gemini API configuration.' 
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while processing your request. Please try again.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Health check endpoint
export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: 'ok', 
      service: 'Knowrex Chat API',
      provider: 'Google Gemini',
      model: 'gemini-1.5-flash',
      fallbackModel: 'gemini-1.5-pro',
      features: ['streaming', 'rag', 'sources', 'model-fallback'],
      configured: !!process.env.GEMINI_API_KEY 
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
