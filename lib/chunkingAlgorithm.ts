// ============================================
// Smart Text Chunking Algorithm
// Splits documents into optimal chunks for RAG
// ============================================

import { DocumentChunk, ChunkingConfig, DEFAULT_CHUNKING_CONFIG, ChunkMetadata } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

/**
 * Splits text into chunks using a smart algorithm that:
 * 1. First tries to split on paragraph boundaries (double line breaks)
 * 2. If chunks are still too large, splits on single line breaks
 * 3. If still too large, splits on sentences (periods followed by space)
 * 4. Adds overlap between chunks for context preservation
 * 5. Never cuts mid-word
 * 
 * @param text - The full text to chunk
 * @param config - Chunking configuration (max size, min size, overlap)
 * @param baseMetadata - Base metadata to include with each chunk
 * @returns Array of DocumentChunk objects
 */
export function chunkText(
  text: string,
  config: ChunkingConfig = DEFAULT_CHUNKING_CONFIG,
  baseMetadata: Partial<ChunkMetadata> = {}
): DocumentChunk[] {
  const { maxChunkSize, minChunkSize, overlapSize } = config;
  
  // Clean and normalize the text
  const cleanedText = text
    .replace(/\r\n/g, '\n')  // Normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')  // Max 2 consecutive newlines
    .trim();
  
  if (!cleanedText) {
    return [];
  }
  
  // If text is small enough, return as single chunk
  if (cleanedText.length <= maxChunkSize) {
    return [{
      id: uuidv4(),
      content: cleanedText,
      index: 0,
      charCount: cleanedText.length,
      metadata: { ...baseMetadata, startChar: 0, endChar: cleanedText.length }
    }];
  }
  
  const chunks: DocumentChunk[] = [];
  let currentPosition = 0;
  let chunkIndex = 0;
  
  while (currentPosition < cleanedText.length) {
    // Calculate the end position for this chunk
    let endPosition = Math.min(currentPosition + maxChunkSize, cleanedText.length);
    
    // If we're not at the end, find a good break point
    if (endPosition < cleanedText.length) {
      endPosition = findBestBreakPoint(cleanedText, currentPosition, endPosition, minChunkSize);
    }
    
    // Extract the chunk content
    let chunkContent = cleanedText.slice(currentPosition, endPosition).trim();
    
    // Skip empty chunks
    if (chunkContent.length === 0) {
      currentPosition = endPosition;
      continue;
    }
    
    // Create the chunk
    chunks.push({
      id: uuidv4(),
      content: chunkContent,
      index: chunkIndex,
      charCount: chunkContent.length,
      metadata: {
        ...baseMetadata,
        startChar: currentPosition,
        endChar: endPosition
      }
    });
    
    chunkIndex++;
    
    // Move position forward, accounting for overlap
    // The overlap ensures context is preserved between chunks
    currentPosition = Math.max(currentPosition + 1, endPosition - overlapSize);
    
    // Make sure we're making progress
    if (currentPosition >= cleanedText.length) {
      break;
    }
  }
  
  return chunks;
}

/**
 * Finds the best break point in text to avoid cutting mid-word or mid-sentence
 * Priority: paragraph break > line break > sentence end > colon/semicolon > comma > word boundary
 * NEVER cuts in the middle of a word
 */
function findBestBreakPoint(
  text: string,
  startPos: number,
  maxEndPos: number,
  minChunkSize: number
): number {
  const searchText = text.slice(startPos, maxEndPos);
  const minEndPos = startPos + minChunkSize;
  
  // 1. Try to find paragraph break (double newline) - best option
  const paragraphBreak = searchText.lastIndexOf('\n\n');
  if (paragraphBreak !== -1 && startPos + paragraphBreak >= minEndPos) {
    return startPos + paragraphBreak + 2;
  }
  
  // 2. Try to find line break
  const lineBreak = searchText.lastIndexOf('\n');
  if (lineBreak !== -1 && startPos + lineBreak >= minEndPos) {
    return startPos + lineBreak + 1;
  }
  
  // 3. Try to find sentence end (. ! ? followed by space or newline)
  // Also check for sentences ending with quotes like ." or .)
  const sentencePatterns = ['. ', '! ', '? ', '.\n', '!\n', '?\n', '." ', '.) ', '.\' '];
  let bestSentenceEnd = -1;
  
  for (const pattern of sentencePatterns) {
    const pos = searchText.lastIndexOf(pattern);
    if (pos !== -1 && pos > bestSentenceEnd && startPos + pos >= minEndPos) {
      bestSentenceEnd = pos;
    }
  }
  
  if (bestSentenceEnd !== -1) {
    // Include the punctuation mark
    return startPos + bestSentenceEnd + 2;
  }
  
  // 4. Try to find colon or semicolon (good logical break points)
  const colonBreak = Math.max(searchText.lastIndexOf(': '), searchText.lastIndexOf('; '));
  if (colonBreak !== -1 && startPos + colonBreak >= minEndPos) {
    return startPos + colonBreak + 2;
  }
  
  // 5. Try to find comma (acceptable break point)
  const commaBreak = searchText.lastIndexOf(', ');
  if (commaBreak !== -1 && startPos + commaBreak >= minEndPos) {
    return startPos + commaBreak + 2;
  }
  
  // 6. MUST find word boundary - NEVER cut a word
  // Search backwards from maxEndPos to find a space
  let wordBreak = searchText.lastIndexOf(' ');
  if (wordBreak !== -1 && startPos + wordBreak >= minEndPos) {
    return startPos + wordBreak + 1;
  }
  
  // 7. If no space found in acceptable range, extend search forward to next space
  // This ensures we never cut a word
  const remainingText = text.slice(maxEndPos);
  const nextSpace = remainingText.indexOf(' ');
  if (nextSpace !== -1 && nextSpace < 50) { // Only extend up to 50 chars
    return maxEndPos + nextSpace + 1;
  }
  
  // 8. Check for next newline as fallback
  const nextNewline = remainingText.indexOf('\n');
  if (nextNewline !== -1 && nextNewline < 50) {
    return maxEndPos + nextNewline + 1;
  }
  
  // Final fallback - return maxEndPos (only if we're at end of text)
  return maxEndPos;
}

/**
 * Chunks text from a PDF with page awareness
 * Each chunk includes page number in metadata
 */
export function chunkPdfText(
  pages: { pageNumber: number; text: string }[],
  config: ChunkingConfig = DEFAULT_CHUNKING_CONFIG
): DocumentChunk[] {
  const allChunks: DocumentChunk[] = [];
  let globalIndex = 0;
  
  for (const page of pages) {
    const pageChunks = chunkText(page.text, config, { page: page.pageNumber });
    
    // Update indices to be global
    for (const chunk of pageChunks) {
      chunk.index = globalIndex++;
      allChunks.push(chunk);
    }
  }
  
  return allChunks;
}

/**
 * Estimates the number of chunks that will be created from text
 * Useful for showing progress during processing
 */
export function estimateChunkCount(
  textLength: number,
  config: ChunkingConfig = DEFAULT_CHUNKING_CONFIG
): number {
  if (textLength <= config.maxChunkSize) return 1;
  
  const effectiveChunkSize = config.maxChunkSize - config.overlapSize;
  return Math.ceil(textLength / effectiveChunkSize);
}

/**
 * Validates chunking configuration
 */
export function validateChunkingConfig(config: ChunkingConfig): boolean {
  return (
    config.maxChunkSize > 0 &&
    config.minChunkSize > 0 &&
    config.overlapSize >= 0 &&
    config.maxChunkSize > config.minChunkSize &&
    config.maxChunkSize > config.overlapSize
  );
}
