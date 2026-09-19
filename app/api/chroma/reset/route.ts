// ============================================
// ChromaDB Reset API
// POST /api/chroma/reset
// Clears all vectors from local database
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { resetCollection } from '@/lib/vectorStore';
import { getAllDocuments, updateDocumentVectorStatus } from '@/lib/fileUtils';
import { AUTH_COOKIE_NAME, deserializeSession } from '@/lib/auth';

export interface ResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * POST /api/chroma/reset
 * Reset the Vector database (delete all vectors) - Super Admin Only
 */
export async function POST(request: NextRequest): Promise<NextResponse<ResetResponse>> {
  try {
    // RBAC: Verify user has admin privileges
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (user && user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Permission denied: Only Super Admins can reset the vector database.',
        error: 'Forbidden'
      }, { status: 403 });
    }

    console.log('[API] Resetting vector database...');
    
    // Reset the collection
    const result = await resetCollection();
    
    if (result.success) {
      // Update all documents to mark as not synced
      const documents = await getAllDocuments();
      
      for (const doc of documents) {
        await updateDocumentVectorStatus(doc.id, {
          vectorSynced: false,
          vectorCount: 0,
          lastSyncDate: null,
          embeddingModel: null
        });
      }
      
      console.log('[API] Collection reset and documents updated');
      
      return NextResponse.json({
        success: true,
        message: 'Vector database reset successfully. All documents marked as not synced.'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to reset collection',
        error: result.message
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('[API] Reset error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to reset vector database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
