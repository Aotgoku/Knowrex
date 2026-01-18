// ============================================
// Semantic Search API
// POST /api/embeddings/search
// Searches local vector database using local embeddings
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { searchVectors, SearchResult } from '@/lib/vectorSearch';

export interface SearchRequest {
  query: string;
  topK?: number;
  documentId?: string;
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
  query: string;
  searchTime?: number;
  error?: string;
}

/**
 * POST /api/embeddings/search
 * Perform semantic search on local vector database
 */
export async function POST(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const startTime = Date.now();
  
  try {
    const body: SearchRequest = await request.json();
    const { query, topK = 5, documentId } = body;
    
    if (!query || !query.trim()) {
      return NextResponse.json({
        success: false,
        results: [],
        query: '',
        error: 'Query is required'
      }, { status: 400 });
    }
    
    console.log(`[API] Searching for: "${query}" (top ${topK})`);
    
    // Build filter
    const filter = documentId ? { documentId } : undefined;
    
    // Perform search
    const results = await searchVectors(query.trim(), topK, filter);
    
    const searchTime = Date.now() - startTime;
    console.log(`[API] Found ${results.length} results in ${searchTime}ms`);
    
    return NextResponse.json({
      success: true,
      results,
      query: query.trim(),
      searchTime
    });
    
  } catch (error) {
    console.error('[API] Search error:', error);
    
    return NextResponse.json({
      success: false,
      results: [],
      query: '',
      error: error instanceof Error ? error.message : 'Search failed'
    }, { status: 500 });
  }
}
