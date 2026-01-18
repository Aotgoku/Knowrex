// ============================================
// Vector Search System
// Combines local embeddings + File-based Vector Store for semantic search
// 100% FREE - no API calls
// ============================================

import { generateEmbedding, generateEmbeddings, EMBEDDING_CONFIG, EmbeddingProgressCallback } from './embeddings';
import { addVectors, queryVectors, deleteVectorsByDocument, VectorMetadata, getDocumentVectorCount } from './vectorStore';
import { ProcessedDocument, DocumentChunk } from '@/types/document';

/**
 * Sync progress callback
 */
export type SyncProgressCallback = (progress: {
  stage: 'preparing' | 'embedding' | 'storing' | 'complete' | 'error';
  percent: number;
  message: string;
  current?: number;
  total?: number;
}) => void;

/**
 * Search result type
 */
export interface SearchResult {
  chunkId: string;
  documentId: string;
  documentName: string;
  text: string;
  score: number;
  chunkIndex: number;
}

/**
 * Sync a document to the vector database
 * Generates embeddings locally and stores in ChromaDB
 */
export async function syncDocumentToVectorDB(
  document: ProcessedDocument,
  onProgress?: SyncProgressCallback
): Promise<{ success: boolean; vectorsCreated: number; message: string }> {
  if (!document.chunks || document.chunks.length === 0) {
    return {
      success: false,
      vectorsCreated: 0,
      message: 'Document has no chunks to sync'
    };
  }
  
  const totalChunks = document.chunks.length;
  
  try {
    // Stage 1: Prepare chunks
    onProgress?.({
      stage: 'preparing',
      percent: 0,
      message: `Preparing ${totalChunks} chunks for embedding...`
    });
    
    const chunksToEmbed = document.chunks.map((chunk: DocumentChunk) => ({
      id: chunk.id,
      content: chunk.content
    }));
    
    // Stage 2: Generate embeddings locally
    onProgress?.({
      stage: 'embedding',
      percent: 0,
      message: 'Initializing embedding model...'
    });
    
    const embeddingProgress: EmbeddingProgressCallback = (progress) => {
      if (progress.stage === 'downloading') {
        onProgress?.({
          stage: 'embedding',
          percent: Math.round(progress.percent * 0.3), // 0-30% for download
          message: progress.message
        });
      } else if (progress.stage === 'embedding') {
        onProgress?.({
          stage: 'embedding',
          percent: 30 + Math.round(progress.percent * 0.5), // 30-80% for embedding
          message: progress.message,
          current: progress.current,
          total: progress.total
        });
      }
    };
    
    const embeddings = await generateEmbeddings(chunksToEmbed, embeddingProgress);
    
    if (embeddings.length === 0) {
      return {
        success: false,
        vectorsCreated: 0,
        message: 'No embeddings could be generated'
      };
    }
    
    // Stage 3: Store in ChromaDB
    onProgress?.({
      stage: 'storing',
      percent: 85,
      message: 'Storing vectors in local database...'
    });
    
    // First, delete existing vectors for this document
    await deleteVectorsByDocument(document.id);
    
    // Prepare vectors with metadata
    const vectors = embeddings.map((emb, index) => {
      const chunk = document.chunks.find(c => c.id === emb.id);
      return {
        id: emb.id,
        embedding: emb.embedding,
        metadata: {
          documentId: document.id,
          documentName: document.originalName || document.filename,
          text: chunk?.content || '',
          chunkIndex: chunk?.index || index,
          charCount: chunk?.charCount || 0,
        } as VectorMetadata
      };
    });
    
    // Add to ChromaDB
    const result = await addVectors(vectors);
    
    // Complete
    onProgress?.({
      stage: 'complete',
      percent: 100,
      message: `Successfully synced ${result.count} vectors!`
    });
    
    return {
      success: true,
      vectorsCreated: result.count,
      message: `Document synced: ${result.count} vectors created`
    };
    
  } catch (error) {
    console.error('[VectorSearch] Sync error:', error);
    
    onProgress?.({
      stage: 'error',
      percent: 0,
      message: error instanceof Error ? error.message : 'Sync failed'
    });
    
    return {
      success: false,
      vectorsCreated: 0,
      message: error instanceof Error ? error.message : 'Failed to sync document'
    };
  }
}

/**
 * Search for similar content using semantic search
 * Query is embedded locally, then searched in ChromaDB
 */
export async function searchVectors(
  query: string,
  topK: number = 5,
  filter?: { documentId?: string }
): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }
  
  try {
    // Generate query embedding locally
    console.log('[VectorSearch] Embedding query...');
    const queryEmbedding = await generateEmbedding(query);
    
    // Search ChromaDB
    console.log('[VectorSearch] Searching vectors...');
    const results = await queryVectors(queryEmbedding, topK, filter);
    
    // Transform results
    return results.map(r => ({
      chunkId: r.id,
      documentId: r.metadata.documentId,
      documentName: r.metadata.documentName,
      text: r.text || r.metadata.text,
      score: r.score,
      chunkIndex: r.metadata.chunkIndex,
    }));
    
  } catch (error) {
    console.error('[VectorSearch] Search error:', error);
    throw error;
  }
}

/**
 * Delete all vectors for a document
 */
export async function deleteDocumentVectors(documentId: string): Promise<{ success: boolean; deleted: number }> {
  try {
    const result = await deleteVectorsByDocument(documentId);
    console.log(`[VectorSearch] Deleted ${result.deleted} vectors for document ${documentId}`);
    return result;
  } catch (error) {
    console.error('[VectorSearch] Delete error:', error);
    return { success: false, deleted: 0 };
  }
}

/**
 * Check if a document is synced to vector DB
 */
export async function isDocumentSynced(documentId: string): Promise<boolean> {
  const count = await getDocumentVectorCount(documentId);
  return count > 0;
}

/**
 * Get vector count for a document
 */
export async function getDocumentSyncStatus(documentId: string): Promise<{
  synced: boolean;
  vectorCount: number;
}> {
  const vectorCount = await getDocumentVectorCount(documentId);
  return {
    synced: vectorCount > 0,
    vectorCount
  };
}

/**
 * Get embedding model info
 */
export function getEmbeddingModelInfo() {
  return {
    model: EMBEDDING_CONFIG.model,
    dimensions: EMBEDDING_CONFIG.dimensions,
    type: 'local',
    cost: 'FREE'
  };
}
