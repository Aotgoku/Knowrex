// ============================================
// Pinecone Cloud Vector Store
// Production-grade Serverless Vector Database
// Connected to: knowrex-index (384 dimensions, cosine)
// ============================================

import { Pinecone } from '@pinecone-database/pinecone';

// Storage configuration
export const VECTOR_CONFIG = {
  collectionName: process.env.PINECONE_INDEX_NAME || 'knowrex-index',
  distanceMetric: 'cosine' as const,
};

/**
 * Vector metadata structure
 */
export interface VectorMetadata {
  documentId: string;
  documentName: string;
  text: string;
  chunkIndex: number;
  charCount: number;
  [key: string]: any;
}

// Cached Pinecone client instance
let pineconeClient: Pinecone | null = null;

/**
 * Get or initialize the Pinecone index client
 */
export function getPineconeIndex() {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error('[Pinecone] Missing PINECONE_API_KEY environment variable. Please check .env.local');
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey });
  }

  const indexName = VECTOR_CONFIG.collectionName;
  return pineconeClient.index(indexName);
}

/**
 * Add / Upsert vectors to Pinecone
 * Automatically handles batching (100 vectors per request)
 */
export async function addVectors(
  vectors: Array<{
    id: string;
    embedding: number[];
    metadata: VectorMetadata;
  }>
): Promise<{ success: boolean; count: number }> {
  if (vectors.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    const index = getPineconeIndex();
    const batchSize = 100;

    console.log(`[Pinecone] Upserting ${vectors.length} vectors to cloud index...`);

    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      const records = batch.map(v => ({
        id: v.id,
        values: v.embedding,
        metadata: {
          documentId: String(v.metadata.documentId || ''),
          documentName: String(v.metadata.documentName || ''),
          text: String(v.metadata.text || ''),
          chunkIndex: Number(v.metadata.chunkIndex ?? 0),
          charCount: Number(v.metadata.charCount ?? 0),
          ...(v.metadata.faqId ? { faqId: String(v.metadata.faqId) } : {}),
          ...(v.metadata.type ? { type: String(v.metadata.type) } : {}),
          ...(v.metadata.category ? { category: String(v.metadata.category) } : {})
        }
      }));

      await index.upsert({ records });
    }

    console.log(`[Pinecone] Successfully upserted ${vectors.length} vectors.`);
    return { success: true, count: vectors.length };

  } catch (error) {
    console.error('[Pinecone] Failed to add vectors:', error);
    throw error;
  }
}

/**
 * Query vectors by semantic similarity
 */
export async function queryVectors(
  queryEmbedding: number[],
  topK: number = 5,
  filter?: { documentId?: string }
): Promise<Array<{
  id: string;
  score: number;
  metadata: VectorMetadata;
  text: string;
}>> {
  try {
    const index = getPineconeIndex();

    const queryFilter = filter?.documentId
      ? { documentId: { $eq: filter.documentId } }
      : undefined;

    const response = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter: queryFilter
    });

    const matches = response.matches || [];

    return matches.map(m => {
      const meta = m.metadata as Record<string, any> || {};
      const text = String(meta.text || '');
      return {
        id: m.id,
        score: m.score || 0,
        metadata: {
          documentId: String(meta.documentId || ''),
          documentName: String(meta.documentName || ''),
          text,
          chunkIndex: Number(meta.chunkIndex ?? 0),
          charCount: Number(meta.charCount ?? text.length),
        },
        text
      };
    });

  } catch (error) {
    console.error('[Pinecone] Query failed:', error);
    throw error;
  }
}

/**
 * Delete vectors by document ID
 */
export async function deleteVectorsByDocument(documentId: string): Promise<{ success: boolean; deleted: number }> {
  try {
    const index = getPineconeIndex();
    await index.deleteMany({
      filter: {
        documentId: { $eq: documentId }
      }
    });
    console.log(`[Pinecone] Deleted vectors for document ${documentId}`);
    return { success: true, deleted: 1 };
  } catch (error) {
    console.error('[Pinecone] Delete failed:', error);
    return { success: false, deleted: 0 };
  }
}

/**
 * Delete a single vector by its ID
 */
export async function deleteVectorById(id: string): Promise<boolean> {
  try {
    const index = getPineconeIndex();
    await index.deleteOne({ id });
    console.log(`[Pinecone] Deleted vector ${id}`);
    return true;
  } catch (error) {
    console.error(`[Pinecone] Failed to delete vector ${id}:`, error);
    return false;
  }
}

/**
 * Get collection / index statistics
 */
export async function getCollectionStats(): Promise<{
  totalVectors: number;
  collectionName: string;
}> {
  try {
    const index = getPineconeIndex();
    const stats = await index.describeIndexStats();
    return {
      totalVectors: stats.totalRecordCount || 0,
      collectionName: VECTOR_CONFIG.collectionName,
    };
  } catch (error) {
    console.error('[Pinecone] Failed to get stats:', error);
    return {
      totalVectors: 0,
      collectionName: VECTOR_CONFIG.collectionName,
    };
  }
}

/**
 * Reset the collection (delete all vectors from Pinecone)
 */
export async function resetCollection(): Promise<{ success: boolean; message: string }> {
  try {
    const index = getPineconeIndex();
    await index.deleteAll();
    console.log('[Pinecone] Index cleared successfully');
    return { success: true, message: 'Pinecone index reset successfully' };
  } catch (error) {
    console.error('[Pinecone] Reset failed:', error);
    throw error;
  }
}

/**
 * Check if storage is available
 */
export async function isStorageAvailable(): Promise<boolean> {
  return !!process.env.PINECONE_API_KEY;
}

/**
 * Get vectors count for a specific document
 */
export async function getDocumentVectorCount(documentId: string): Promise<number> {
  try {
    const index = getPineconeIndex();
    const res = await index.query({
      vector: new Array(384).fill(0),
      topK: 1,
      filter: { documentId: { $eq: documentId } }
    });
    return (res.matches && res.matches.length > 0) ? 1 : 0;
  } catch {
    return 0;
  }
}

/**
 * Compatibility helpers
 */
export async function getCollection() {
  return {
    name: VECTOR_CONFIG.collectionName,
    metadata: { 'hnsw:space': VECTOR_CONFIG.distanceMetric }
  };
}

export async function getChromaClient() {
  console.log('[Pinecone] Cloud vector storage initialized');
  return {};
}
