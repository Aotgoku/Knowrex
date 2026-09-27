// ============================================
// ChromaDB Stats API
// GET /api/chroma/stats
// Returns local vector database statistics
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getCollectionStats, isStorageAvailable } from '@/lib/vectorStore';
import { getEmbeddingModelInfo } from '@/lib/vectorSearch';
import { AUTH_COOKIE_NAME, deserializeSession } from '@/lib/auth';

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
 * Get ChromaDB statistics (Admin / Agent Only)
 */
export async function GET(request: NextRequest): Promise<NextResponse<ChromaStatsResponse>> {
  try {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      return NextResponse.json({
        success: false,
        available: false,
        totalVectors: 0,
        collectionName: '',
        embeddingModel: getEmbeddingModelInfo(),
        error: 'Unauthorized: Authentication required.'
      }, { status: 401 });
    }

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
