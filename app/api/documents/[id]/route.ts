// ============================================
// Single Document API Route
// Get, update, or delete a specific document
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { loadDocument, deleteDocument as deleteDoc } from '@/lib/fileUtils';
import { reprocessDocument } from '@/lib/documentProcessor';
import { DocumentDetailResponse, DeleteResponse } from '@/types/document';
import { deleteDocumentVectors } from '@/lib/vectorSearch';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/documents/[id]
 * Returns a single document with all chunks
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<DocumentDetailResponse>> {
  try {
    const { id } = await params;
    const document = await loadDocument(id);
    
    if (!document) {
      return NextResponse.json({
        success: false,
        error: 'Document not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      document
    });
    
  } catch (error) {
    console.error('Error fetching document:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch document'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/documents/[id]
 * Deletes a document and its associated files + vectors
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<DeleteResponse>> {
  try {
    const { id } = await params;
    
    // First, delete vectors from ChromaDB
    try {
      await deleteDocumentVectors(id);
      console.log(`[API] Deleted vectors for document ${id}`);
    } catch (vectorError) {
      console.error('Error deleting vectors:', vectorError);
      // Continue with document deletion even if vector deletion fails
    }
    
    const success = await deleteDoc(id);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to delete document',
        error: 'Document not found or could not be deleted'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Document and vectors deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting document:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to delete document',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/documents/[id]
 * Reprocess a document (for retrying failed documents)
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<DocumentDetailResponse>> {
  try {
    const { id } = await params;
    const document = await reprocessDocument(id);
    
    if (!document) {
      return NextResponse.json({
        success: false,
        error: 'Document not found or source file missing'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      document
    });
    
  } catch (error) {
    console.error('Error reprocessing document:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to reprocess document'
    }, { status: 500 });
  }
}
