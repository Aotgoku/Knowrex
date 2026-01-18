// ============================================
// Type Definitions for Knowrex Document Management
// Phase 2: Document Upload & Processing
// ============================================

/**
 * Document processing status
 */
export type DocumentStatus = 'uploading' | 'processing' | 'complete' | 'error';

/**
 * Supported file types for upload
 */
export type SupportedFileType = 'pdf' | 'docx' | 'txt' | 'md';

/**
 * Metadata for a single chunk
 */
export interface ChunkMetadata {
  page?: number;
  section?: string;
  startChar?: number;
  endChar?: number;
}

/**
 * A single chunk of processed document text
 */
export interface DocumentChunk {
  id: string;
  content: string;
  index: number;
  charCount: number;
  metadata: ChunkMetadata;
}

/**
 * Complete processed document with all chunks
 */
export interface ProcessedDocument {
  id: string;
  filename: string;
  originalName: string;
  uploadDate: string;
  fileSize: string;
  fileSizeBytes: number;
  fileType: SupportedFileType;
  status: DocumentStatus;
  error?: string;
  totalChunks: number;
  totalCharacters: number;
  chunks: DocumentChunk[];
  processingTime?: number;
  // Vector sync fields (Phase 3)
  vectorSynced?: boolean;
  vectorCount?: number;
  lastSyncDate?: string | null;
  embeddingModel?: string | null;
}

/**
 * Document summary for list views (without chunk content)
 */
export interface DocumentSummary {
  id: string;
  filename: string;
  originalName: string;
  uploadDate: string;
  fileSize: string;
  fileSizeBytes: number;
  fileType: SupportedFileType;
  status: DocumentStatus;
  error?: string;
  totalChunks: number;
  totalCharacters: number;
  processingTime?: number;
  // Vector sync fields (Phase 3)
  vectorSynced?: boolean;
  vectorCount?: number;
  lastSyncDate?: string | null;
  embeddingModel?: string | null;
}

/**
 * Statistics for the admin dashboard
 */
export interface DocumentStats {
  totalDocuments: number;
  totalChunks: number;
  totalStorageBytes: number;
  storageFormatted: string;
  lastUploadDate: string | null;
  documentsByStatus: {
    complete: number;
    processing: number;
    error: number;
  };
  documentsByType: {
    pdf: number;
    docx: number;
    txt: number;
    md: number;
  };
}

/**
 * Upload progress tracking
 */
export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  documentId?: string;
}

/**
 * API response for file upload
 */
export interface UploadResponse {
  success: boolean;
  message: string;
  document?: DocumentSummary;
  error?: string;
}

/**
 * API response for document list
 */
export interface DocumentListResponse {
  success: boolean;
  documents: DocumentSummary[];
  stats: DocumentStats;
}

/**
 * API response for single document
 */
export interface DocumentDetailResponse {
  success: boolean;
  document?: ProcessedDocument;
  error?: string;
}

/**
 * API response for document deletion
 */
export interface DeleteResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * File validation result
 */
export interface FileValidation {
  valid: boolean;
  error?: string;
  fileType?: SupportedFileType;
}

/**
 * Chunking configuration
 */
export interface ChunkingConfig {
  maxChunkSize: number;
  minChunkSize: number;
  overlapSize: number;
}

/**
 * Default chunking configuration
 * - maxChunkSize: Maximum characters per chunk
 * - minChunkSize: Minimum characters before looking for break point
 * - overlapSize: Characters to overlap between chunks for context
 */
export const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  maxChunkSize: 2000,   // Larger chunks for more context
  minChunkSize: 300,    // Higher minimum to ensure meaningful chunks
  overlapSize: 200,     // More overlap to prevent broken sentences
};

/**
 * File upload constraints
 */
export const FILE_CONSTRAINTS = {
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
  maxSizeMB: 50,
  allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown'],
  allowedExtensions: ['.pdf', '.docx', '.txt', '.md'],
};
