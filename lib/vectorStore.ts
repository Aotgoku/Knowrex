// ============================================
// Simple File-Based Vector Store
// 100% FREE local vector database
// Storage: /data/chroma/vectors.json
// ============================================

import { promises as fs } from 'fs';
import path from 'path';

// Storage configuration
export const VECTOR_CONFIG = {
  collectionName: 'knowrex-documents',
  storageFile: path.join(process.cwd(), 'data', 'chroma', 'vectors.json'),
  distanceMetric: 'cosine' as const,
};

// ============================================
// IN-MEMORY CACHE
// The vectors.json is ~136MB - reading it from
// disk on every query is extremely slow.
// Cache it in memory after first load.
// ============================================
let vectorCache: VectorDatabase | null = null;
let cacheLoadPromise: Promise<VectorDatabase> | null = null;

/**
 * Vector metadata structure
 */
export interface VectorMetadata {
  documentId: string;
  documentName: string;
  text: string;
  chunkIndex: number;
  charCount: number;
}

/**
 * Stored vector structure
 */
interface StoredVector {
  id: string;
  embedding: number[];
  metadata: VectorMetadata;
}

/**
 * Vector database structure
 */
interface VectorDatabase {
  vectors: StoredVector[];
  version: number;
}

/**
 * Ensure storage directory exists
 */
async function ensureStorageDirectory(): Promise<void> {
  const dir = path.dirname(VECTOR_CONFIG.storageFile);
  await fs.mkdir(dir, { recursive: true });
}

/**
 * Load vectors from file (with in-memory cache)
 * The 136MB file is only read from disk ONCE per server session.
 */
async function loadVectors(): Promise<VectorDatabase> {
  // Return from cache if already loaded
  if (vectorCache) {
    return vectorCache;
  }

  // If a load is already in progress, wait for it
  if (cacheLoadPromise) {
    return cacheLoadPromise;
  }

  // Start loading from disk
  cacheLoadPromise = (async () => {
    try {
      await ensureStorageDirectory();
      console.log('[VectorStore] Loading vectors from disk (first time)...');
      const data = await fs.readFile(VECTOR_CONFIG.storageFile, 'utf-8');
      const db = JSON.parse(data) as VectorDatabase;
      vectorCache = db;
      console.log(`[VectorStore] Loaded ${db.vectors.length} vectors into memory cache`);
      return db;
    } catch (error) {
      // File doesn't exist or is empty, return empty database
      cacheLoadPromise = null;
      vectorCache = { vectors: [], version: 1 };
      return vectorCache;
    }
  })();

  return cacheLoadPromise;
}

/**
 * Save vectors to file and update memory cache
 */
async function saveVectors(db: VectorDatabase): Promise<void> {
  // Update cache immediately
  vectorCache = db;
  cacheLoadPromise = null;
  await ensureStorageDirectory();
  await fs.writeFile(VECTOR_CONFIG.storageFile, JSON.stringify(db), 'utf-8');
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) {
    return 0;
  }
  
  return dotProduct / (normA * normB);
}

/**
 * Add vectors to the collection
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
    const db = await loadVectors();
    
    // Remove existing vectors with same IDs (upsert behavior)
    const newVectorIds = new Set(vectors.map(v => v.id));
    db.vectors = db.vectors.filter(v => !newVectorIds.has(v.id));
    
    // Add new vectors
    db.vectors.push(...vectors);
    
    await saveVectors(db);
    
    console.log(`[VectorStore] Upserted ${vectors.length} vectors`);
    return { success: true, count: vectors.length };
    
  } catch (error) {
    console.error('[VectorStore] Failed to add vectors:', error);
    throw error;
  }
}

/**
 * Query vectors by similarity
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
    const db = await loadVectors();
    
    // Filter vectors if needed
    let vectors = db.vectors;
    if (filter?.documentId) {
      vectors = vectors.filter(v => v.metadata.documentId === filter.documentId);
    }
    
    // Calculate similarity scores
    const results = vectors.map(v => ({
      id: v.id,
      score: cosineSimilarity(queryEmbedding, v.embedding),
      metadata: v.metadata,
      text: v.metadata.text,
    }));
    
    // Sort by score (highest first) and take top K
    results.sort((a, b) => b.score - a.score);
    
    return results.slice(0, topK);
    
  } catch (error) {
    console.error('[VectorStore] Query failed:', error);
    throw error;
  }
}

/**
 * Delete vectors by document ID
 */
export async function deleteVectorsByDocument(documentId: string): Promise<{ success: boolean; deleted: number }> {
  try {
    const db = await loadVectors();
    
    const initialCount = db.vectors.length;
    db.vectors = db.vectors.filter(v => v.metadata.documentId !== documentId);
    const deleted = initialCount - db.vectors.length;
    
    if (deleted > 0) {
      await saveVectors(db);
      console.log(`[VectorStore] Deleted ${deleted} vectors for document ${documentId}`);
    }
    
    return { success: true, deleted };
    
  } catch (error) {
    console.error('[VectorStore] Delete failed:', error);
    throw error;
  }
}

/**
 * Get collection statistics
 */
export async function getCollectionStats(): Promise<{
  totalVectors: number;
  collectionName: string;
}> {
  try {
    const db = await loadVectors();
    
    return {
      totalVectors: db.vectors.length,
      collectionName: VECTOR_CONFIG.collectionName,
    };
    
  } catch (error) {
    console.error('[VectorStore] Failed to get stats:', error);
    return {
      totalVectors: 0,
      collectionName: VECTOR_CONFIG.collectionName,
    };
  }
}

/**
 * Reset the collection (delete all vectors)
 */
export async function resetCollection(): Promise<{ success: boolean; message: string }> {
  try {
    const db: VectorDatabase = { vectors: [], version: 1 };
    await saveVectors(db);
    
    console.log('[VectorStore] Collection reset');
    return { success: true, message: 'Collection reset successfully' };
    
  } catch (error) {
    console.error('[VectorStore] Reset failed:', error);
    throw error;
  }
}

/**
 * Check if storage is available
 */
export async function isStorageAvailable(): Promise<boolean> {
  try {
    await ensureStorageDirectory();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get vectors count for a specific document
 */
export async function getDocumentVectorCount(documentId: string): Promise<number> {
  try {
    const db = await loadVectors();
    return db.vectors.filter(v => v.metadata.documentId === documentId).length;
  } catch {
    return 0;
  }
}

/**
 * Get or create collection (compatibility with chromadb.ts interface)
 */
export async function getCollection() {
  await ensureStorageDirectory();
  return {
    name: VECTOR_CONFIG.collectionName,
    metadata: { 'hnsw:space': VECTOR_CONFIG.distanceMetric }
  };
}

/**
 * Get client (compatibility with chromadb.ts interface)
 */
export async function getChromaClient() {
  await ensureStorageDirectory();
  console.log('[VectorStore] File-based vector storage initialized');
  return {};
}
