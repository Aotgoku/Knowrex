// ============================================
// Documents List API Route
// Get all documents and statistics
// ============================================

import { NextResponse } from 'next/server';
import { listDocuments, getDocumentStats } from '@/lib/fileUtils';
import { DocumentListResponse } from '@/types/document';

/**
 * GET /api/documents
 * Returns all documents with statistics
 */
export async function GET(): Promise<NextResponse<DocumentListResponse>> {
  try {
    const [documents, stats] = await Promise.all([
      listDocuments(),
      getDocumentStats()
    ]);
    
    return NextResponse.json({
      success: true,
      documents,
      stats
    });
    
  } catch (error) {
    console.error('Error fetching documents:', error);
    
    return NextResponse.json({
      success: false,
      documents: [],
      stats: {
        totalDocuments: 0,
        totalChunks: 0,
        totalStorageBytes: 0,
        storageFormatted: '0 Bytes',
        lastUploadDate: null,
        documentsByStatus: { complete: 0, processing: 0, error: 0 },
        documentsByType: { pdf: 0, docx: 0, txt: 0, md: 0 }
      }
    }, { status: 500 });
  }
}

// Revalidate every 0 seconds (always fresh)
export const revalidate = 0;
