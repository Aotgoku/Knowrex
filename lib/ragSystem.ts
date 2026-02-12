// ============================================
// RAG System - Retrieval Augmented Generation
// Connects vector search to Gemini chat
// Now includes Knowledge Loop FAQ integration!
// ============================================

import { searchVectors, SearchResult } from './vectorSearch';
import { searchFAQs, FAQEntry } from './knowledgeLoop';

/**
 * Source information returned with RAG results
 */
export interface RAGSource {
  documentName: string;
  chunkId: string;
  text: string;
  score: number;
  chunkIndex: number;
}

/**
 * Result from RAG processing
 */
export interface RAGResult {
  context: string;
  sources: RAGSource[];
  hasContext: boolean;
  avgConfidence: number;
  totalChunksSearched: number;
  chunksUsed: number;
}

/**
 * RAG options
 */
export interface RAGOptions {
  topK?: number;
  minScore?: number;
  maxContextLength?: number;
  documentId?: string; // Filter by specific document ID
  includeFAQs?: boolean; // Include FAQ search results (default: true)
}

/**
 * Default RAG configuration
 * Note: Semantic similarity scores are typically 20-50% for related content
 */
export const RAG_DEFAULTS = {
  topK: 20,  // Get more results for comprehensive answers
  minScore: 0.20,  // Even lower threshold to ensure we don't miss content
  maxContextLength: 30000, // Much larger context for complete answers
  includeFAQs: true, // Include FAQ search by default
};

/**
 * Relevance level classification
 * Note: Semantic similarity scores are typically 25-55% for CORRECT matches
 * This is NOT an accuracy score - it's how semantically similar the query is to the chunk
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'none';

/**
 * Get relevance level from similarity score
 * Adjusted for realistic semantic similarity scores
 */
export function getConfidenceLevel(score: number): ConfidenceLevel {
  // Semantic similarity scores: 25-35% = found, 35-50% = good match, 50%+ = excellent
  if (score >= 0.45) return 'high';      // 45%+ is excellent for semantic search
  if (score >= 0.35) return 'medium';    // 35-45% is a good match
  if (score >= 0.25) return 'low';       // 25-35% is a basic match
  return 'none';
}

/**
 * Clean up raw text from PDF/document extraction
 * Fixes common formatting issues like bullet points, line breaks, etc.
 */
export function cleanDocumentText(text: string): string {
  return text
    // Fix bullet points: "o" at start of line -> proper bullet
    .replace(/^o([A-Z])/gm, '• $1')
    .replace(/\no([A-Z])/g, '\n• $1')
    // Fix spacing around bullets
    .replace(/•([A-Za-z])/g, '• $1')
    // Fix multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Fix spacing issues
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Clean up whitespace
    .trim();
}

/**
 * Get relevance color for UI
 */
export function getConfidenceColor(level: ConfidenceLevel): string {
  switch (level) {
    case 'high': return '#22c55e'; // green - excellent match
    case 'medium': return '#3b82f6'; // blue - good match
    case 'low': return '#eab308'; // yellow - basic match (still valid!)
    case 'none': return '#ef4444'; // red - no relevant match
  }
}

/**
 * Expand a user query to improve search matching
 * This helps with broad questions like "What is the project about?"
 */
function expandQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Keywords that indicate user wants overview/summary
  const overviewPatterns = [
    /what is (the |this |your )?(project|document|file|ppt|presentation|report)/i,
    /tell me about/i,
    /explain (the |this )?/i,
    /summarize/i,
    /overview/i,
    /what('s| is) it about/i,
    /describe/i,
  ];
  
  // Check if it's an overview question
  for (const pattern of overviewPatterns) {
    if (pattern.test(query)) {
      // Add relevant terms that might appear in document sections
      return `${query} problem statement solution objective goals introduction summary overview purpose benefits feasibility technologies used technical approach`;
    }
  }
  
  // Keywords for specific sections
  const sectionMappings: { pattern: RegExp; expansion: string }[] = [
    { pattern: /tech(nology|nologies|nical)?( stack| used)?/i, expansion: 'technologies used technical approach Next.js TypeScript Gemini Pinecone frontend backend language framework database' },
    { pattern: /stack/i, expansion: 'technologies used technical approach stack framework language database' },
    { pattern: /problem/i, expansion: 'problem statement challenges issues' },
    { pattern: /solution/i, expansion: 'proposed solution approach methodology implementation' },
    { pattern: /benefit/i, expansion: 'benefits advantages value proposition' },
    { pattern: /feasibility/i, expansion: 'feasibility study viability analysis' },
    { pattern: /objective|goal/i, expansion: 'objectives goals aims targets' },
    { pattern: /feature/i, expansion: 'features functionality capabilities' },
    { pattern: /team|member/i, expansion: 'team members contributors group' },
    { pattern: /timeline|schedule/i, expansion: 'timeline schedule milestones' },
    { pattern: /cost|budget|price/i, expansion: 'cost budget pricing financial' },
    { pattern: /methodology|approach/i, expansion: 'methodology approach technical implementation' },
    { pattern: /tool|framework|library/i, expansion: 'tools technologies framework library used' },
  ];
  
  for (const mapping of sectionMappings) {
    if (mapping.pattern.test(query)) {
      return `${query} ${mapping.expansion}`;
    }
  }
  
  // For other queries, return as-is
  return query;
}

/**
 * Format context from search results
 * Includes all chunks with clear labeling for the LLM
 */
function formatContext(sources: RAGSource[], maxLength: number): string {
  let context = '';
  let currentLength = 0;
  
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const scorePercent = Math.round(source.score * 100);
    const entry = `\n--- DOCUMENT EXCERPT ${i + 1} (from "${source.documentName}", chunk ${source.chunkIndex}, ${scorePercent}% match) ---\n${source.text}\n--- END EXCERPT ${i + 1} ---\n`;
    
    if (currentLength + entry.length > maxLength) {
      // Truncate if needed
      const remaining = maxLength - currentLength;
      if (remaining > 100) {
        context += entry.substring(0, remaining) + '...';
      }
      break;
    }
    
    context += entry;
    currentLength += entry.length;
  }
  
  return context.trim();
}

/**
 * Search FAQs and convert to RAGSource format
 * FAQs are learned from human-resolved escalations
 */
async function searchFAQsForRAG(query: string): Promise<RAGSource[]> {
  try {
    const faqs = await searchFAQs(query);
    
    if (faqs.length === 0) {
      return [];
    }
    
    console.log(`[RAG] Found ${faqs.length} matching FAQs from Knowledge Loop`);
    
    // Convert FAQs to RAGSource format with high priority
    return faqs.map((faq, index) => ({
      documentName: `FAQ: ${faq.category}`,
      chunkId: faq.id,
      text: `**Question:** ${faq.question}\n\n**Answer:** ${faq.answer}`,
      score: 0.85, // High score since FAQs are human-verified answers
      chunkIndex: index
    }));
  } catch (error) {
    console.error('[RAG] FAQ search error:', error);
    return [];
  }
}

/**
 * Perform RAG - Search documents and build context
 * 
 * Flow:
 * 1. Search FAQs from Knowledge Loop (learned from escalations)
 * 2. Search vector database for relevant chunks
 * 3. Merge and prioritize results (FAQs first)
 * 4. Filter by minimum score
 * 5. Format chunks into context string
 * 6. Calculate confidence metrics
 * 7. Return context + metadata
 */
export async function performRAG(
  userQuery: string,
  options?: RAGOptions
): Promise<RAGResult> {
  const {
    topK = RAG_DEFAULTS.topK,
    minScore = RAG_DEFAULTS.minScore,
    maxContextLength = RAG_DEFAULTS.maxContextLength,
    documentId,
    includeFAQs = RAG_DEFAULTS.includeFAQs
  } = options || {};
  
  // Empty result template
  const emptyResult: RAGResult = {
    context: '',
    sources: [],
    hasContext: false,
    avgConfidence: 0,
    totalChunksSearched: 0,
    chunksUsed: 0
  };
  
  if (!userQuery.trim()) {
    return emptyResult;
  }
  
  try {
    // Expand query for better matching with document content
    const expandedQuery = expandQuery(userQuery);
    console.log('[RAG] Original query:', userQuery);
    console.log('[RAG] Expanded query:', expandedQuery);
    if (documentId) {
      console.log('[RAG] Filtering to document:', documentId);
    }
    
    // ============================================
    // STEP 1: Search FAQs from Knowledge Loop
    // These are human-verified answers from resolved escalations
    // ============================================
    let faqSources: RAGSource[] = [];
    if (includeFAQs) {
      faqSources = await searchFAQsForRAG(userQuery);
      if (faqSources.length > 0) {
        console.log(`[RAG] 🧠 Knowledge Loop: Found ${faqSources.length} relevant FAQ(s)`);
      }
    }
    
    // ============================================
    // STEP 2: Search vector database
    // ============================================
    const searchResults = await searchVectors(
      expandedQuery,
      topK,
      documentId ? { documentId } : undefined
    );
    
    console.log(`[RAG] Found ${searchResults.length} document results`);
    
    // Log the scores for debugging
    if (searchResults.length > 0) {
      console.log('[RAG] Top scores:', searchResults.slice(0, 5).map(r => 
        `${r.documentName}: ${(r.score * 100).toFixed(1)}%`
      ).join(', '));
    }
    
    // If we have FAQs but no document results, still use FAQs
    if (searchResults.length === 0 && faqSources.length > 0) {
      console.log('[RAG] Using FAQ sources only (no document matches)');
      const avgConfidence = faqSources.reduce((sum, s) => sum + s.score, 0) / faqSources.length;
      const context = formatContext(faqSources, maxContextLength);
      
      return {
        context,
        sources: faqSources,
        hasContext: true,
        avgConfidence,
        totalChunksSearched: 0,
        chunksUsed: faqSources.length
      };
    }
    
    if (searchResults.length === 0) {
      console.log('[RAG] No search results found');
      return emptyResult;
    }
    
    // Filter by minimum score
    const relevantResults = searchResults.filter(r => r.score >= minScore);
    
    console.log(`[RAG] ${relevantResults.length} results above score ${minScore}`);
    
    if (relevantResults.length === 0 && faqSources.length === 0) {
      console.log('[RAG] All results below minimum score. Best score was:', 
        (searchResults[0]?.score * 100).toFixed(1) + '%');
      return {
        ...emptyResult,
        totalChunksSearched: searchResults.length
      };
    }
    
    // ============================================
    // STEP 3: Merge FAQ and document sources
    // FAQs come first (higher priority)
    // ============================================
    const documentSources: RAGSource[] = relevantResults.map(r => ({
      documentName: r.documentName,
      chunkId: r.chunkId,
      text: r.text,
      score: r.score,
      chunkIndex: r.chunkIndex
    }));
    
    // Merge: FAQs first, then documents
    const allSources = [...faqSources, ...documentSources];
    
    // Calculate average confidence
    const avgConfidence = allSources.reduce((sum, s) => sum + s.score, 0) / allSources.length;
    
    // Format context string
    const context = formatContext(allSources, maxContextLength);
    
    console.log(`[RAG] Built context with ${allSources.length} sources (${faqSources.length} FAQs + ${documentSources.length} docs), avg confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    
    return {
      context,
      sources: allSources,
      hasContext: true,
      avgConfidence,
      totalChunksSearched: searchResults.length,
      chunksUsed: allSources.length
    };
    
  } catch (error) {
    console.error('[RAG] Error:', error);
    return emptyResult;
  }
}

/**
 * Check if RAG should be used based on query
 * Some queries might not benefit from document search
 */
export function shouldUseRAG(query: string): boolean {
  // Skip RAG for very short queries
  if (query.trim().length < 3) return false;
  
  // Skip for greetings and simple phrases
  const skipPatterns = [
    /^(hi|hello|hey|thanks|thank you|bye|goodbye)$/i,
    /^how are you/i,
    /^what'?s up/i,
  ];
  
  for (const pattern of skipPatterns) {
    if (pattern.test(query.trim())) {
      return false;
    }
  }
  
  return true;
}

/**
 * Get RAG status summary for logging/debugging
 */
export function getRAGSummary(result: RAGResult): string {
  if (!result.hasContext) {
    return 'No relevant documents found';
  }
  
  const level = getConfidenceLevel(result.avgConfidence);
  const sources = result.sources.map(s => s.documentName).filter((v, i, a) => a.indexOf(v) === i);
  
  return `Using ${result.chunksUsed} chunks from ${sources.length} document(s), ` +
         `confidence: ${(result.avgConfidence * 100).toFixed(0)}% (${level})`;
}
