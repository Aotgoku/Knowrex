// ============================================
// File Utilities
// Helper functions for file handling, validation, and storage
// ============================================

import { promises as fs } from 'fs';
import path from 'path';
import { 
  FileValidation, 
  SupportedFileType, 
  FILE_CONSTRAINTS,
  ProcessedDocument,
  DocumentSummary,
  DocumentStats
} from '@/types/document';

// Directory paths
export const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
export const DOCUMENTS_DIR = path.join(process.cwd(), 'data', 'documents');

/**
 * Ensures required directories exist
 */
export async function ensureDirectories(): Promise<void> {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(DOCUMENTS_DIR, { recursive: true });
}

/**
 * Validates a file for upload
 */
export function validateFile(
  filename: string,
  fileSize: number,
  mimeType?: string
): FileValidation {
  // Check file size
  if (fileSize > FILE_CONSTRAINTS.maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${FILE_CONSTRAINTS.maxSizeMB}MB limit`
    };
  }
  
  if (fileSize === 0) {
    return {
      valid: false,
      error: 'File is empty'
    };
  }
  
  // Get file extension
  const ext = path.extname(filename).toLowerCase();
  
  // Check extension
  if (!FILE_CONSTRAINTS.allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `File type not supported. Allowed types: ${FILE_CONSTRAINTS.allowedExtensions.join(', ')}`
    };
  }
  
  // Determine file type
  const fileType = getFileType(ext);
  if (!fileType) {
    return {
      valid: false,
      error: 'Could not determine file type'
    };
  }
  
  return {
    valid: true,
    fileType
  };
}

/**
 * Gets the file type from extension
 */
export function getFileType(extension: string): SupportedFileType | null {
  const ext = extension.toLowerCase().replace('.', '');
  
  switch (ext) {
    case 'pdf':
      return 'pdf';
    case 'docx':
      return 'docx';
    case 'txt':
      return 'txt';
    case 'md':
    case 'markdown':
      return 'md';
    default:
      return null;
  }
}

/**
 * Sanitizes a filename to prevent security issues
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts
  let safe = filename.replace(/[\/\\]/g, '');
  
  // Remove special characters except dots, dashes, underscores
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Remove multiple consecutive underscores
  safe = safe.replace(/_+/g, '_');
  
  // Ensure it doesn't start with a dot (hidden file)
  if (safe.startsWith('.')) {
    safe = '_' + safe;
  }
  
  // Limit length
  const maxLength = 200;
  if (safe.length > maxLength) {
    const ext = path.extname(safe);
    const name = path.basename(safe, ext);
    safe = name.slice(0, maxLength - ext.length) + ext;
  }
  
  return safe;
}

/**
 * Generates a unique filename with timestamp
 */
export function generateUniqueFilename(originalFilename: string): string {
  const sanitized = sanitizeFilename(originalFilename);
  const ext = path.extname(sanitized);
  const name = path.basename(sanitized, ext);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${name}_${timestamp}_${random}${ext}`;
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Saves a processed document to JSON storage
 */
export async function saveDocument(document: ProcessedDocument): Promise<void> {
  await ensureDirectories();
  
  const filePath = path.join(DOCUMENTS_DIR, `${document.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(document, null, 2), 'utf-8');
}

/**
 * Loads a document from JSON storage
 */
export async function loadDocument(documentId: string): Promise<ProcessedDocument | null> {
  try {
    const filePath = path.join(DOCUMENTS_DIR, `${documentId}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as ProcessedDocument;
  } catch (error) {
    return null;
  }
}

/**
 * Deletes a document and its associated files
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    const document = await loadDocument(documentId);
    if (!document) return false;
    
    // Delete the JSON file
    const jsonPath = path.join(DOCUMENTS_DIR, `${documentId}.json`);
    await fs.unlink(jsonPath).catch(() => {});
    
    // Delete the uploaded file
    const uploadPath = path.join(UPLOADS_DIR, document.filename);
    await fs.unlink(uploadPath).catch(() => {});
    
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

/**
 * Lists all documents (summaries without full chunk content)
 */
export async function listDocuments(): Promise<DocumentSummary[]> {
  await ensureDirectories();
  
  try {
    const files = await fs.readdir(DOCUMENTS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const documents: DocumentSummary[] = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(DOCUMENTS_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const doc = JSON.parse(content) as ProcessedDocument;
        
        // Create summary (without chunk content)
        documents.push({
          id: doc.id,
          filename: doc.filename,
          originalName: doc.originalName,
          uploadDate: doc.uploadDate,
          fileSize: doc.fileSize,
          fileSizeBytes: doc.fileSizeBytes,
          fileType: doc.fileType,
          status: doc.status,
          error: doc.error,
          totalChunks: doc.totalChunks,
          totalCharacters: doc.totalCharacters,
          processingTime: doc.processingTime,
          // Vector sync fields (Phase 3)
          vectorSynced: doc.vectorSynced || false,
          vectorCount: doc.vectorCount || 0,
          lastSyncDate: doc.lastSyncDate || null,
          embeddingModel: doc.embeddingModel || null
        });
      } catch (e) {
        // Skip invalid files
        console.error(`Error reading document ${file}:`, e);
      }
    }
    
    // Sort by upload date (newest first)
    documents.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
    
    return documents;
  } catch (error) {
    console.error('Error listing documents:', error);
    return [];
  }
}

/**
 * Calculates document statistics
 */
export async function getDocumentStats(): Promise<DocumentStats> {
  const documents = await listDocuments();
  
  const stats: DocumentStats = {
    totalDocuments: documents.length,
    totalChunks: 0,
    totalStorageBytes: 0,
    storageFormatted: '0 Bytes',
    lastUploadDate: null,
    documentsByStatus: {
      complete: 0,
      processing: 0,
      error: 0
    },
    documentsByType: {
      pdf: 0,
      docx: 0,
      txt: 0,
      md: 0
    }
  };
  
  for (const doc of documents) {
    stats.totalChunks += doc.totalChunks;
    stats.totalStorageBytes += doc.fileSizeBytes;
    
    // Count by status
    if (doc.status === 'complete') stats.documentsByStatus.complete++;
    else if (doc.status === 'processing') stats.documentsByStatus.processing++;
    else if (doc.status === 'error') stats.documentsByStatus.error++;
    
    // Count by type
    if (doc.fileType in stats.documentsByType) {
      stats.documentsByType[doc.fileType]++;
    }
  }
  
  stats.storageFormatted = formatFileSize(stats.totalStorageBytes);
  
  if (documents.length > 0) {
    stats.lastUploadDate = documents[0].uploadDate;
  }
  
  return stats;
}

/**
 * Checks if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads a text file with encoding detection
 */
export async function readTextFile(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  
  // Simple UTF-8 BOM detection
  if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    return buffer.toString('utf-8').slice(1); // Remove BOM
  }
  
  // UTF-16 LE BOM
  if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    return buffer.toString('utf16le').slice(1);
  }
  
  // UTF-16 BE BOM
  if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
    // Node.js doesn't have native utf16be, convert manually
    const swapped = Buffer.alloc(buffer.length - 2);
    for (let i = 2; i < buffer.length; i += 2) {
      swapped[i - 2] = buffer[i + 1];
      swapped[i - 1] = buffer[i];
    }
    return swapped.toString('utf16le');
  }
  
  // Default to UTF-8
  return buffer.toString('utf-8');
}

// ============================================
// Vector Sync Status Functions (Phase 3)
// ============================================

/**
 * Update document vector sync status
 */
export async function updateDocumentVectorStatus(
  documentId: string,
  vectorStatus: {
    vectorSynced: boolean;
    vectorCount: number;
    lastSyncDate: string | null;
    embeddingModel: string | null;
  }
): Promise<boolean> {
  try {
    const document = await loadDocument(documentId);
    if (!document) return false;
    
    // Update vector fields
    document.vectorSynced = vectorStatus.vectorSynced;
    document.vectorCount = vectorStatus.vectorCount;
    document.lastSyncDate = vectorStatus.lastSyncDate;
    document.embeddingModel = vectorStatus.embeddingModel;
    
    // Save updated document
    await saveDocument(document);
    
    return true;
  } catch (error) {
    console.error('Error updating vector status:', error);
    return false;
  }
}

/**
 * Get all documents (full list)
 */
export async function getAllDocuments(): Promise<ProcessedDocument[]> {
  await ensureDirectories();
  
  try {
    const files = await fs.readdir(DOCUMENTS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const documents: ProcessedDocument[] = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(DOCUMENTS_DIR, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const doc = JSON.parse(content) as ProcessedDocument;
        documents.push(doc);
      } catch (e) {
        console.error(`Error reading document ${file}:`, e);
      }
    }
    
    return documents;
  } catch (error) {
    console.error('Error getting all documents:', error);
    return [];
  }
}
