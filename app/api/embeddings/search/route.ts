// ============================================
// Semantic Search API
// POST /api/embeddings/search
// Searches local vector database using local embeddings
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { searchVectors, SearchResult } from '@/lib/vectorSearch';
import { AUTH_COOKIE_NAME, deserializeSession } from '@/lib/auth';

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
 * Perform semantic search on local vector database (Admin / Agent Only)
 */
export async function POST(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const startTime = Date.now();
  
  try {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      return NextResponse.json({
        success: false,
        results: [],
        query: '',
        error: 'Unauthorized: Authentication required to execute raw vector searches.'
      }, { status: 401 });
    }

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
      error: process.env.NODE_ENV === 'production' ? 'Search failed' : (error instanceof Error ? error.message : 'Search failed')
    }, { status: 500 });
  }
}
