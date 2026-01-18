// ============================================
// Document Processor
// Extracts text from PDF, DOCX, TXT, and MD files
// ============================================

import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { 
  ProcessedDocument, 
  SupportedFileType, 
  DocumentChunk,
  DEFAULT_CHUNKING_CONFIG 
} from '@/types/document';
import { chunkText, chunkPdfText } from './chunkingAlgorithm';
import { 
  formatFileSize, 
  readTextFile, 
  UPLOADS_DIR,
  saveDocument 
} from './fileUtils';

/**
 * Main document processor
 * Takes a file and returns a fully processed document with chunks
 */
export async function processDocument(
  filePath: string,
  originalFilename: string,
  fileType: SupportedFileType,
  documentId?: string
): Promise<ProcessedDocument> {
  const startTime = Date.now();
  const id = documentId || uuidv4();
  
  // Get file stats
  const stats = await fs.stat(filePath);
  const filename = path.basename(filePath);
  
  // Create initial document record
  const document: ProcessedDocument = {
    id,
    filename,
    originalName: originalFilename,
    uploadDate: new Date().toISOString(),
    fileSize: formatFileSize(stats.size),
    fileSizeBytes: stats.size,
    fileType,
    status: 'processing',
    totalChunks: 0,
    totalCharacters: 0,
    chunks: []
  };
  
  try {
    // Extract text based on file type
    let chunks: DocumentChunk[] = [];
    
    switch (fileType) {
      case 'pdf':
        chunks = await processPdf(filePath);
        break;
      case 'docx':
        chunks = await processDocx(filePath);
        break;
      case 'txt':
      case 'md':
        chunks = await processTextFile(filePath);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    // Check if we got any content
    if (chunks.length === 0) {
      document.status = 'error';
      document.error = 'No text content could be extracted from this file. If this is a scanned PDF, OCR is not currently supported.';
    } else {
      document.status = 'complete';
      document.chunks = chunks;
      document.totalChunks = chunks.length;
      document.totalCharacters = chunks.reduce((sum, c) => sum + c.charCount, 0);
    }
    
  } catch (error) {
    console.error('Document processing error:', error);
    document.status = 'error';
    document.error = error instanceof Error ? error.message : 'Unknown processing error';
  }
  
  document.processingTime = Date.now() - startTime;
  
  // Save the document
  await saveDocument(document);
  
  return document;
}

/**
 * Process PDF files using pdf-parse v1.x
 * Note: pdf-parse has a quirk where it tries to load test data on import,
 * so we use a custom pagerender to avoid issues
 */
async function processPdf(filePath: string): Promise<DocumentChunk[]> {
  const dataBuffer = await fs.readFile(filePath);
  
  try {
    // Import pdf-parse - we need to handle it carefully due to its test file quirk
    const pdfParse = require('pdf-parse/lib/pdf-parse');
    
    const data = await pdfParse(dataBuffer);
    
    // Check for text content
    if (!data.text || data.text.trim().length === 0) {
      return [];
    }
    
    // If we have page info, chunk by pages
    if (data.numpages && data.numpages > 1) {
      // pdf-parse doesn't give us page-by-page text easily
      // So we'll chunk the whole text and estimate pages
      const totalChars = data.text.length;
      const charsPerPage = Math.ceil(totalChars / data.numpages);
      
      const pages: { pageNumber: number; text: string }[] = [];
      
      for (let i = 0; i < data.numpages; i++) {
        const start = i * charsPerPage;
        const end = Math.min((i + 1) * charsPerPage, totalChars);
        const pageText = data.text.slice(start, end);
        
        if (pageText.trim()) {
          pages.push({
            pageNumber: i + 1,
            text: pageText
          });
        }
      }
      
      return chunkPdfText(pages, DEFAULT_CHUNKING_CONFIG);
    }
    
    // Single page or no page info - chunk the whole text
    return chunkText(data.text, DEFAULT_CHUNKING_CONFIG, { page: 1 });
    
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF. The file may be corrupted or password-protected.');
  }
}

/**
 * Process DOCX files using mammoth
 */
async function processDocx(filePath: string): Promise<DocumentChunk[]> {
  const mammoth = await import('mammoth');
  
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    
    if (!result.value || result.value.trim().length === 0) {
      return [];
    }
    
    // Log any warnings
    if (result.messages && result.messages.length > 0) {
      console.log('Mammoth warnings:', result.messages);
    }
    
    return chunkText(result.value, DEFAULT_CHUNKING_CONFIG);
    
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file. The file may be corrupted.');
  }
}

/**
 * Process plain text files (TXT, MD)
 */
async function processTextFile(filePath: string): Promise<DocumentChunk[]> {
  try {
    const text = await readTextFile(filePath);
    
    if (!text || text.trim().length === 0) {
      return [];
    }
    
    return chunkText(text, DEFAULT_CHUNKING_CONFIG);
    
  } catch (error) {
    console.error('Text file reading error:', error);
    throw new Error('Failed to read text file. The file may be corrupted or use an unsupported encoding.');
  }
}

/**
 * Reprocess an existing document (for retrying failed documents)
 */
export async function reprocessDocument(documentId: string): Promise<ProcessedDocument | null> {
  const { loadDocument } = await import('./fileUtils');
  
  const existingDoc = await loadDocument(documentId);
  if (!existingDoc) {
    return null;
  }
  
  const filePath = path.join(UPLOADS_DIR, existingDoc.filename);
  
  try {
    await fs.access(filePath);
  } catch {
    return null; // File doesn't exist
  }
  
  return processDocument(
    filePath,
    existingDoc.originalName,
    existingDoc.fileType,
    documentId
  );
}

/**
 * Gets a preview of document content (first N characters)
 */
export function getDocumentPreview(chunks: DocumentChunk[], maxLength: number = 500): string {
  if (chunks.length === 0) return '';
  
  let preview = '';
  for (const chunk of chunks) {
    preview += chunk.content + ' ';
    if (preview.length >= maxLength) break;
  }
  
  return preview.slice(0, maxLength).trim() + (preview.length > maxLength ? '...' : '');
}
