// ============================================
// ChromaDB Reset API
// POST /api/chroma/reset
// Clears all vectors from local database
// ============================================

import { NextResponse } from 'next/server';
import { resetCollection } from '@/lib/vectorStore';
import { getAllDocuments, updateDocumentVectorStatus } from '@/lib/fileUtils';

export interface ResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * POST /api/chroma/reset
 * Reset the ChromaDB collection (delete all vectors)
 */
export async function POST(): Promise<NextResponse<ResetResponse>> {
  try {
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
