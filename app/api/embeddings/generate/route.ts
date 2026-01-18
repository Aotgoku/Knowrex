// ============================================
// Generate Embeddings API
// POST /api/embeddings/generate
// Generate embeddings for text locally
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding, generateEmbeddings, getEmbeddingDimensions, isEmbedderReady } from '@/lib/embeddings';

export interface GenerateRequest {
  text?: string;
  chunks?: Array<{ id: string; content: string }>;
}

export interface GenerateResponse {
  success: boolean;
  embedding?: number[];
  embeddings?: Array<{ id: string; embedding: number[] }>;
  dimensions: number;
  modelReady: boolean;
  error?: string;
}

/**
 * POST /api/embeddings/generate
 * Generate embeddings for text or chunks
 */
export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    const body: GenerateRequest = await request.json();
    const { text, chunks } = body;
    
    const dimensions = getEmbeddingDimensions();
    
    // Single text embedding
    if (text) {
      console.log('[API] Generating embedding for text');
      const embedding = await generateEmbedding(text);
      
      return NextResponse.json({
        success: true,
        embedding,
        dimensions,
        modelReady: isEmbedderReady()
      });
    }
    
    // Batch embeddings
    if (chunks && chunks.length > 0) {
      console.log(`[API] Generating embeddings for ${chunks.length} chunks`);
      const embeddings = await generateEmbeddings(chunks);
      
      return NextResponse.json({
        success: true,
        embeddings,
        dimensions,
        modelReady: isEmbedderReady()
      });
    }
    
    return NextResponse.json({
      success: false,
      dimensions,
      modelReady: isEmbedderReady(),
      error: 'Provide either text or chunks'
    }, { status: 400 });
    
  } catch (error) {
    console.error('[API] Generate error:', error);
    
    return NextResponse.json({
      success: false,
      dimensions: getEmbeddingDimensions(),
      modelReady: isEmbedderReady(),
      error: error instanceof Error ? error.message : 'Failed to generate embeddings'
    }, { status: 500 });
  }
}

/**
 * GET /api/embeddings/generate
 * Check embedding model status
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    modelReady: isEmbedderReady(),
    dimensions: getEmbeddingDimensions(),
    model: 'Xenova/all-MiniLM-L6-v2',
    type: 'local',
    cost: 'FREE'
  });
}
