import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { generateEmbeddings } from '@/lib/embeddings';
import { addVectors } from '@/lib/vectorStore';
import { saveDocument, formatFileSize } from '@/lib/fileUtils';
import { ProcessedDocument, DocumentChunk } from '@/types/document';
import { AUTH_COOKIE_NAME, deserializeSession } from '@/lib/auth';

let genAI: GoogleGenerativeAI | null = null;
function getGeminiClient() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * POST /api/analytics/knowledge-gaps/generate-doc
 * Synthesizes a corporate policy doc using Gemini and indexes vectors into Pinecone Cloud.
 * (Super Admin Only)
 */
export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Only Super Admins can synthesize documents and write to vector store.'
      }, { status: 401 });
    }

    const body = await request.json();
    const { topic, category, sampleQuestions } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Topic is required' },
        { status: 400 }
      );
    }

    const client = getGeminiClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Gemini AI service not configured' },
        { status: 500 }
      );
    }

    // 1. Synthesize document using Gemini 3.5 Flash
    const model = client.getGenerativeModel({
      model: 'gemini-3.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 3000
      }
    });

    const prompt = `You are a Senior Corporate Policy Architect and Documentation Director for Knowrex Enterprise.
A knowledge gap has been detected in our support knowledge base because multiple customers asked questions that had no documentation.

TOPIC: "${topic}"
CATEGORY: "${category || 'General Operations'}"
SAMPLE CUSTOMER QUESTIONS:
${(sampleQuestions || []).map((q: string, i: number) => `${i + 1}. "${q}"`).join('\n')}

TASK:
Write an authoritative, clear, and comprehensive company policy & FAQ document in Markdown format that fully covers all aspects of this topic.
Include:
1. Clear # Title
2. Policy Overview & Scope
3. Standard Operating Procedures / Rules / Timelines
4. Step-by-step instructions for customers
5. FAQ section directly answering each of the sample customer questions above
6. Escalation contact information

Write clean, professional Markdown. Do NOT wrap in meta-commentary like "Here is your document:". Output ONLY the raw Markdown document.`;

    const result = await model.generateContent(prompt);
    const markdownContent = result.response.text();

    // 2. Chunk the synthesized markdown
    // Split into logical sections by headers or paragraphs (approx 400-800 characters)
    const rawParagraphs = markdownContent.split(/\n\n+/).filter(p => p.trim().length > 30);
    const chunks: DocumentChunk[] = [];
    const docId = `doc-gap-${Date.now()}`;
    const cleanFilename = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`;

    let currentChunkContent = '';
    let chunkIndex = 0;

    for (const para of rawParagraphs) {
      if ((currentChunkContent + '\n\n' + para).length > 800 && currentChunkContent.length > 200) {
        chunks.push({
          id: `${docId}-chunk-${chunkIndex}`,
          content: currentChunkContent.trim(),
          index: chunkIndex,
          charCount: currentChunkContent.trim().length,
          metadata: { section: `Section ${chunkIndex + 1}` }
        });
        chunkIndex++;
        currentChunkContent = para;
      } else {
        currentChunkContent = currentChunkContent ? `${currentChunkContent}\n\n${para}` : para;
      }
    }

    if (currentChunkContent.trim()) {
      chunks.push({
        id: `${docId}-chunk-${chunkIndex}`,
        content: currentChunkContent.trim(),
        index: chunkIndex,
        charCount: currentChunkContent.trim().length,
        metadata: { section: `Section ${chunkIndex + 1}` }
      });
    }

    // 3. Generate 384-dimensional embeddings using Xenova MiniLM
    const chunksToEmbed = chunks.map(c => ({ id: c.id, content: c.content }));
    const embeddingResults = await generateEmbeddings(chunksToEmbed);

    // 4. Index vectors into Pinecone Cloud Vector Store
    const vectorsToUpsert = chunks.map((chunk) => {
      const match = embeddingResults.find(e => e.id === chunk.id);
      return {
        id: chunk.id,
        embedding: match?.embedding || [],
        metadata: {
          documentId: docId,
          documentName: cleanFilename,
          text: chunk.content,
          chunkIndex: chunk.index,
          charCount: chunk.charCount,
          category: category || 'General',
          synthesized: true
        }
      };
    });

    await addVectors(vectorsToUpsert);

    // 5. Save Document Record so it shows in /admin/documents
    const processedDoc: ProcessedDocument = {
      id: docId,
      filename: cleanFilename,
      originalName: cleanFilename,
      uploadDate: new Date().toISOString(),
      fileSize: formatFileSize(Buffer.byteLength(markdownContent, 'utf-8')),
      fileSizeBytes: Buffer.byteLength(markdownContent, 'utf-8'),
      fileType: 'md',
      status: 'complete',
      totalChunks: chunks.length,
      totalCharacters: markdownContent.length,
      chunks,
      vectorSynced: true,
      vectorCount: chunks.length,
      lastSyncDate: new Date().toISOString(),
      embeddingModel: 'all-MiniLM-L6-v2'
    };

    try {
      await saveDocument(processedDoc);
    } catch (saveErr) {
      console.warn('[AutoDoc] Notice saving JSON doc:', saveErr);
    }

    return NextResponse.json({
      success: true,
      docId,
      filename: cleanFilename,
      chunksIndexed: chunks.length,
      preview: markdownContent.substring(0, 500) + '...',
      fullContent: markdownContent,
      message: `Successfully synthesized "${cleanFilename}" and indexed ${chunks.length} vectors into Pinecone Cloud!`
    });
  } catch (error: any) {
    console.error('[AutoDoc] Generation & Indexing Error:', error);
    return NextResponse.json(
      { success: false, error: process.env.NODE_ENV === 'production' ? 'Failed to generate document' : (error?.message || 'Failed to generate document') },
      { status: 500 }
    );
  }
}
