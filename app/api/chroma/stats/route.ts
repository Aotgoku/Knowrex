// ============================================
// ChromaDB Stats API
// GET /api/chroma/stats
// Returns local vector database statistics
// ============================================

import { NextResponse } from 'next/server';
import { getCollectionStats, isStorageAvailable } from '@/lib/vectorStore';
import { getEmbeddingModelInfo } from '@/lib/vectorSearch';

export interface ChromaStatsResponse {
  success: boolean;
  available: boolean;
  totalVectors: number;
  collectionName: string;
  embeddingModel: {
    model: string;
    dimensions: number;
    type: string;
    cost: string;
  };
  error?: string;
}

/**
 * GET /api/chroma/stats
 * Get ChromaDB statistics
 */
export async function GET(): Promise<NextResponse<ChromaStatsResponse>> {
  try {
    const available = await isStorageAvailable();
    
    if (!available) {
      return NextResponse.json({
        success: false,
        available: false,
        totalVectors: 0,
        collectionName: '',
        embeddingModel: getEmbeddingModelInfo(),
        error: 'Vector storage is not available'
      });
    }
    
    const stats = await getCollectionStats();
    
    return NextResponse.json({
      success: true,
      available: true,
      totalVectors: stats.totalVectors,
      collectionName: stats.collectionName,
      embeddingModel: getEmbeddingModelInfo()
    });
    
  } catch (error) {
    console.error('[API] Stats error:', error);
    
    return NextResponse.json({
      success: false,
      available: false,
      totalVectors: 0,
      collectionName: '',
      embeddingModel: getEmbeddingModelInfo(),
      error: error instanceof Error ? error.message : 'Failed to get stats'
    }, { status: 500 });
  }
}
