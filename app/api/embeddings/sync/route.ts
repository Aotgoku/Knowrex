// ============================================
// Sync Document to Vector DB API
// POST /api/embeddings/sync
// Generates local embeddings and stores in ChromaDB
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { loadDocument, updateDocumentVectorStatus } from '@/lib/fileUtils';
import { syncDocumentToVectorDB } from '@/lib/vectorSearch';

export interface SyncRequest {
  documentId: string;
}

export interface SyncResponse {
  success: boolean;
  message: string;
  vectorsCreated?: number;
  error?: string;
}

/**
 * POST /api/embeddings/sync
 * Sync a document to the local vector database
 */
export async function POST(request: NextRequest): Promise<NextResponse<SyncResponse>> {
  try {
    const body: SyncRequest = await request.json();
    const { documentId } = body;
    
    if (!documentId) {
      return NextResponse.json({
        success: false,
        message: 'Document ID is required',
        error: 'Missing documentId'
      }, { status: 400 });
    }
    
    // Load the document
    const document = await loadDocument(documentId);
    
    if (!document) {
      return NextResponse.json({
        success: false,
        message: 'Document not found',
        error: `No document found with ID: ${documentId}`
      }, { status: 404 });
    }
    
    if (document.status !== 'complete') {
      return NextResponse.json({
        success: false,
        message: 'Document is not ready for syncing',
        error: `Document status: ${document.status}`
      }, { status: 400 });
    }
    
    if (!document.chunks || document.chunks.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Document has no chunks',
        error: 'No chunks available to sync'
      }, { status: 400 });
    }
    
    console.log(`[API] Syncing document ${documentId} with ${document.chunks.length} chunks`);
    
    // Sync to vector database
    const result = await syncDocumentToVectorDB(document);
    
    if (result.success) {
      // Update document with vector sync status
      await updateDocumentVectorStatus(documentId, {
        vectorSynced: true,
        vectorCount: result.vectorsCreated,
        lastSyncDate: new Date().toISOString(),
        embeddingModel: 'all-MiniLM-L6-v2'
      });
      
      return NextResponse.json({
        success: true,
        message: result.message,
        vectorsCreated: result.vectorsCreated
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.message
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('[API] Sync error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to sync document',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
