// ============================================
// Gemini Embedding Generation
// Uses Google text-embedding-004 API (cloud, fast, no cold start)
// Output: 384 dimensions (truncated) — compatible with existing Pinecone index
// ============================================

import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';

// Gemini embedding config
export const EMBEDDING_CONFIG = {
  model: 'gemini-embedding-001',
  dimensions: 384,          // We truncate to 384 to match existing Pinecone index
  batchSize: 10,
  maxRetries: 3,
};

// Progress callback — kept for API compatibility with upload routes
export type EmbeddingProgressCallback = (progress: {
  stage: 'downloading' | 'loading' | 'embedding';
  percent: number;
  message: string;
  current?: number;
  total?: number;
}) => void;

// Lazy Gemini client
let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('[Embeddings] GEMINI_API_KEY is not set in environment variables.');
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

/**
 * Generate embedding for a single text string.
 * Returns a 384-dimensional vector (truncated from Gemini's 768-dim output).
 */
export async function generateEmbedding(
  text: string,
  _onProgress?: EmbeddingProgressCallback
): Promise<number[]> {
  const cleanText = text.trim().substring(0, 8000);
  if (!cleanText) {
    throw new Error('[Embeddings] Empty text provided for embedding.');
  }

  const client = getGeminiClient();
  const embeddingModel = client.getGenerativeModel({ model: EMBEDDING_CONFIG.model });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= EMBEDDING_CONFIG.maxRetries; attempt++) {
    try {
      const result = await embeddingModel.embedContent({
        content: { parts: [{ text: cleanText }], role: 'user' },
        // Truncate to 384 dims so existing Pinecone index (384-dim cosine) works
        taskType: TaskType.RETRIEVAL_DOCUMENT,
      });

      const fullVector = result.embedding.values; // 768 dims from Gemini
      // Truncate to 384 dims — preserves vector space compatibility
      return fullVector.slice(0, EMBEDDING_CONFIG.dimensions);

    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[Embeddings] Attempt ${attempt} failed: ${lastError.message}`);
      if (attempt < EMBEDDING_CONFIG.maxRetries) {
        await new Promise(r => setTimeout(r, 500 * attempt));
      }
    }
  }

  throw new Error(`[Embeddings] All ${EMBEDDING_CONFIG.maxRetries} attempts failed. Last error: ${lastError?.message}`);
}

/**
 * Batch generate embeddings for multiple document chunks.
 * Processes in batches and reports progress via callback.
 */
export async function generateEmbeddings(
  chunks: Array<{ id: string; content: string }>,
  onProgress?: EmbeddingProgressCallback
): Promise<Array<{ id: string; embedding: number[] }>> {
  if (chunks.length === 0) return [];

  const results: Array<{ id: string; embedding: number[] }> = [];
  const totalChunks = chunks.length;

  console.log(`[Embeddings] Processing ${totalChunks} chunks via Gemini text-embedding-004`);

  for (let i = 0; i < totalChunks; i += EMBEDDING_CONFIG.batchSize) {
    const batch = chunks.slice(i, Math.min(i + EMBEDDING_CONFIG.batchSize, totalChunks));

    for (const chunk of batch) {
      try {
        const cleanText = chunk.content.trim().substring(0, 8000);
        if (!cleanText) {
          console.warn(`[Embeddings] Skipping empty chunk: ${chunk.id}`);
          continue;
        }

        const embedding = await generateEmbedding(cleanText);
        results.push({ id: chunk.id, embedding });

      } catch (error) {
        console.error(`[Embeddings] Error processing chunk ${chunk.id}:`, error);
        // Continue with remaining chunks
      }

      const percent = Math.round((results.length / totalChunks) * 100);
      onProgress?.({
        stage: 'embedding',
        percent,
        message: `Embedding chunk ${results.length}/${totalChunks}...`,
        current: results.length,
        total: totalChunks,
      });
    }

    // Small delay between batches to respect API rate limits
    if (i + EMBEDDING_CONFIG.batchSize < totalChunks) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log(`[Embeddings] Completed: ${results.length}/${totalChunks} chunks embedded`);
  return results;
}

/**
 * Generate embedding specifically for a search query.
 * Uses RETRIEVAL_QUERY task type for better semantic search accuracy.
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const cleanQuery = query.trim().substring(0, 2000);
  if (!cleanQuery) {
    throw new Error('[Embeddings] Empty query provided.');
  }

  const client = getGeminiClient();
  const embeddingModel = client.getGenerativeModel({ model: EMBEDDING_CONFIG.model });

  const result = await embeddingModel.embedContent({
    content: { parts: [{ text: cleanQuery }], role: 'user' },
    taskType: TaskType.RETRIEVAL_QUERY, // Different task type for query vs document — better recall
  });

  return result.embedding.values.slice(0, EMBEDDING_CONFIG.dimensions);
}

/**
 * Check if embeddings are ready — always true since we use API (no model loading)
 */
export function isEmbedderReady(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

/**
 * No-op: no local cache to clear with API-based embeddings
 */
export function clearEmbedderCache(): void {
  geminiClient = null;
  console.log('[Embeddings] Gemini client reset');
}

/**
 * Get embedding dimensions
 */
export function getEmbeddingDimensions(): number {
  return EMBEDDING_CONFIG.dimensions;
}
