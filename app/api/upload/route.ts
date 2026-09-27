// ============================================
// File Upload API Route
// Handles multipart file uploads and processing
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { 
  validateFile, 
  generateUniqueFilename, 
  ensureDirectories,
  updateDocumentVectorStatus,
  UPLOADS_DIR 
} from '@/lib/fileUtils';
import { processDocument } from '@/lib/documentProcessor';
import { syncDocumentToVectorDB } from '@/lib/vectorSearch';
import { UploadResponse } from '@/types/document';
import { AUTH_COOKIE_NAME, deserializeSession } from '@/lib/auth';

// Rate limiting - simple in-memory store
const uploadTimestamps: Map<string, number[]> = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_UPLOADS_PER_WINDOW = 10;

/**
 * Simple rate limiter
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = uploadTimestamps.get(ip) || [];
  
  // Filter to only recent timestamps
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= MAX_UPLOADS_PER_WINDOW) {
    return false;
  }
  
  recentTimestamps.push(now);
  uploadTimestamps.set(ip, recentTimestamps);
  
  return true;
}

/**
 * POST /api/upload
 * Handles file upload and processing (Super Admin Only)
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // RBAC: Verify user has admin privileges
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        message: 'Permission denied: Only Super Admins can upload documents.',
        error: 'Forbidden'
      }, { status: 403 });
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({
        success: false,
        message: 'Rate limit exceeded',
        error: 'Too many uploads. Please wait a minute before uploading more files.'
      }, { status: 429 });
    }
    
    // Ensure directories exist
    await ensureDirectories();
    
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file provided',
        error: 'Please select a file to upload'
      }, { status: 400 });
    }
    
    // Validate file
    const validation = validateFile(file.name, file.size, file.type);
    
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        message: 'Invalid file',
        error: validation.error
      }, { status: 400 });
    }
    
    // Generate unique filename
    const uniqueFilename = generateUniqueFilename(file.name);
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);
    
    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    
    // Generate document ID
    const documentId = uuidv4();
    
    // Process the document
    const document = await processDocument(
      filePath,
      file.name,
      validation.fileType!,
      documentId
    );
    
    // Auto-sync document chunks to vector database
    let vectorSynced = false;
    let vectorsCount = 0;
    if (document.status === 'complete' && document.chunks && document.chunks.length > 0) {
      try {
        console.log(`[Upload API] Auto-syncing document ${document.id} to vector DB...`);
        const syncResult = await syncDocumentToVectorDB(document);
        if (syncResult.success) {
          vectorSynced = true;
          vectorsCount = syncResult.vectorsCreated;
          await updateDocumentVectorStatus(document.id, {
            vectorSynced: true,
            vectorCount: vectorsCount,
            lastSyncDate: new Date().toISOString(),
            embeddingModel: 'all-MiniLM-L6-v2'
          });
          console.log(`[Upload API] Auto-sync complete: ${vectorsCount} vectors created`);
        }
      } catch (syncErr) {
        console.warn('[Upload API] Auto-sync to vector DB failed:', syncErr);
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: document.status === 'complete' 
        ? `Successfully processed ${document.totalChunks} chunks${vectorSynced ? ` and synced ${vectorsCount} vectors to search database` : ''}`
        : 'Document uploaded but processing encountered issues',
      document: {
        id: document.id,
        filename: document.filename,
        originalName: document.originalName,
        uploadDate: document.uploadDate,
        fileSize: document.fileSize,
        fileSizeBytes: document.fileSizeBytes,
        fileType: document.fileType,
        status: document.status,
        error: document.error,
        totalChunks: document.totalChunks,
        totalCharacters: document.totalCharacters,
        processingTime: document.processingTime,
        vectorSynced,
        vectorCount: vectorsCount
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Upload failed',
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }, { status: 500 });
  }
}

/**
 * OPTIONS - Handle CORS preflight
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
