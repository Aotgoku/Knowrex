// ============================================
// Local Embedding Generation
// Uses @xenova/transformers for 100% FREE local embeddings
// Model: Xenova/all-MiniLM-L6-v2 (384 dimensions)
// ============================================

import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';

// Cache the embedder pipeline to avoid reloading
let embedderCache: FeatureExtractionPipeline | null = null;
let isInitializing = false;
let initPromise: Promise<FeatureExtractionPipeline> | null = null;

// Model configuration
export const EMBEDDING_CONFIG = {
  model: 'Xenova/all-MiniLM-L6-v2',
  dimensions: 384,
  batchSize: 10, // Process 10 chunks at a time
  maxRetries: 3,
};

/**
 * Progress callback type
 */
export type EmbeddingProgressCallback = (progress: {
  stage: 'downloading' | 'loading' | 'embedding';
  percent: number;
  message: string;
  current?: number;
  total?: number;
}) => void;

/**
 * Get or initialize the embedding pipeline
 * First run downloads the model (~50MB)
 */
export async function getEmbedder(
  onProgress?: EmbeddingProgressCallback
): Promise<FeatureExtractionPipeline> {
  // Return cached embedder if available
  if (embedderCache) {
    return embedderCache;
  }
  
  // If already initializing, wait for it
  if (isInitializing && initPromise) {
    return initPromise;
  }
  
  // Start initialization
  isInitializing = true;
  
  initPromise = (async () => {
    try {
      console.log('[Embeddings] Initializing embedding model...');
      onProgress?.({
        stage: 'downloading',
        percent: 0,
        message: 'Preparing embedding model...'
      });
      
      // Create the pipeline with progress tracking
      const embedder = await pipeline(
        'feature-extraction',
        EMBEDDING_CONFIG.model,
        {
          progress_callback: (data: { status: string; progress?: number; file?: string }) => {
            if (data.status === 'progress' && data.progress !== undefined) {
              onProgress?.({
                stage: 'downloading',
                percent: Math.round(data.progress),
                message: `Downloading model... ${Math.round(data.progress)}%`
              });
            } else if (data.status === 'ready') {
              onProgress?.({
                stage: 'loading',
                percent: 100,
                message: 'Model loaded successfully!'
              });
            }
          }
        }
      );
      
      embedderCache = embedder;
      console.log('[Embeddings] Model ready!');
      
      return embedder;
      
    } catch (error) {
      console.error('[Embeddings] Failed to initialize:', error);
      isInitializing = false;
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
}

/**
 * Generate embedding for a single text
 * Returns a 384-dimensional vector
 */
export async function generateEmbedding(
  text: string,
  onProgress?: EmbeddingProgressCallback
): Promise<number[]> {
  const embedder = await getEmbedder(onProgress);
  
  // Clean and truncate text if needed (model has token limit)
  const cleanText = text.trim().substring(0, 8000);
  
  if (!cleanText) {
    throw new Error('Empty text provided for embedding');
  }
  
  try {
    const output = await embedder(cleanText, {
      pooling: 'mean',
      normalize: true
    });
    
    // Convert to array
    return Array.from(output.data as Float32Array);
    
  } catch (error) {
    console.error('[Embeddings] Generation error:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Batch generate embeddings for multiple chunks
 * Shows progress and processes in batches
 */
export async function generateEmbeddings(
  chunks: Array<{ id: string; content: string }>,
  onProgress?: EmbeddingProgressCallback
): Promise<Array<{ id: string; embedding: number[] }>> {
  if (chunks.length === 0) {
    return [];
  }
  
  // Initialize embedder first (may download model)
  const embedder = await getEmbedder(onProgress);
  
  const results: Array<{ id: string; embedding: number[] }> = [];
  const batchSize = EMBEDDING_CONFIG.batchSize;
  const totalChunks = chunks.length;
  
  console.log(`[Embeddings] Processing ${totalChunks} chunks in batches of ${batchSize}`);
  
  // Process in batches
  for (let i = 0; i < totalChunks; i += batchSize) {
    const batch = chunks.slice(i, Math.min(i + batchSize, totalChunks));
    
    // Process batch
    for (const chunk of batch) {
      try {
        const cleanText = chunk.content.trim().substring(0, 8000);
        
        if (!cleanText) {
          console.warn(`[Embeddings] Skipping empty chunk: ${chunk.id}`);
          continue;
        }
        
        const output = await embedder(cleanText, {
          pooling: 'mean',
          normalize: true
        });
        
        results.push({
          id: chunk.id,
          embedding: Array.from(output.data as Float32Array)
        });
        
      } catch (error) {
        console.error(`[Embeddings] Error processing chunk ${chunk.id}:`, error);
        // Continue with other chunks
      }
      
      // Report progress
      const processed = results.length;
      const percent = Math.round((processed / totalChunks) * 100);
      
      onProgress?.({
        stage: 'embedding',
        percent,
        message: `Embedding chunk ${processed}/${totalChunks}...`,
        current: processed,
        total: totalChunks
      });
    }
  }
  
  console.log(`[Embeddings] Completed: ${results.length}/${totalChunks} chunks`);
  
  return results;
}

/**
 * Check if the embedder is ready (model cached)
 */
export function isEmbedderReady(): boolean {
  return embedderCache !== null;
}

/**
 * Clear the embedder cache (for memory management)
 */
export function clearEmbedderCache(): void {
  embedderCache = null;
  isInitializing = false;
  initPromise = null;
  console.log('[Embeddings] Cache cleared');
}

/**
 * Get embedding dimensions
 */
export function getEmbeddingDimensions(): number {
  return EMBEDDING_CONFIG.dimensions;
}
