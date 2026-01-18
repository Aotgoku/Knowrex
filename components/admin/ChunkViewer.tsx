'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check,
  FileText,
  Hash,
  AlignLeft,
  Search
} from 'lucide-react';
import { ProcessedDocument, DocumentChunk } from '@/types/document';

// ============================================
// ChunkViewer Component
// Modal to view document chunks with pagination
// Handles large documents without freezing
// ============================================

interface ChunkViewerProps {
  document: ProcessedDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

// Number of chunks to show per page in the sidebar
const CHUNKS_PER_PAGE = 20;

export default function ChunkViewer({ document, isOpen, onClose }: ChunkViewerProps) {
  const [selectedChunkIndex, setSelectedChunkIndex] = useState(0);
  const [copiedChunkId, setCopiedChunkId] = useState<string | null>(null);
  const [sidebarPage, setSidebarPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reset selection when document changes
  useEffect(() => {
    setSelectedChunkIndex(0);
    setSidebarPage(0);
    setSearchQuery('');
  }, [document?.id]);
  
  // Filter chunks based on search
  const filteredChunks = useMemo(() => {
    if (!document?.chunks) return [];
    if (!searchQuery.trim()) return document.chunks;
    
    const query = searchQuery.toLowerCase();
    return document.chunks.filter(chunk => 
      chunk.content.toLowerCase().includes(query)
    );
  }, [document?.chunks, searchQuery]);
  
  // Paginate the filtered chunks for sidebar display
  const totalPages = Math.ceil(filteredChunks.length / CHUNKS_PER_PAGE);
  const paginatedChunks = useMemo(() => {
    const start = sidebarPage * CHUNKS_PER_PAGE;
    return filteredChunks.slice(start, start + CHUNKS_PER_PAGE);
  }, [filteredChunks, sidebarPage]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen || !document) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setSelectedChunkIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedChunkIndex(prev => Math.min((document.chunks?.length || 1) - 1, prev + 1));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, document, onClose]);
  
  const copyChunk = async (chunk: DocumentChunk) => {
    try {
      await navigator.clipboard.writeText(chunk.content);
      setCopiedChunkId(chunk.id);
      setTimeout(() => setCopiedChunkId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  if (!isOpen || !document) return null;
  
  // Handle empty chunks
  if (!document.chunks || document.chunks.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div 
          className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <p style={{ color: 'var(--muted)' }}>No chunks available for this document.</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  
  const currentChunk = document.chunks[selectedChunkIndex];
  
  // Safety check for currentChunk
  if (!currentChunk) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-150">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] mx-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in-up duration-200"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 
                className="font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                {document.originalName}
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {document.totalChunks} chunks • {document.totalCharacters.toLocaleString()} characters
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" style={{ color: 'var(--muted)' }} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Chunk list sidebar */}
          <div 
            className="w-64 border-r flex flex-col"
            style={{ borderColor: 'var(--border-color)' }}
          >
            {/* Search */}
            <div className="p-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
                <input
                  type="text"
                  placeholder="Search chunks..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSidebarPage(0);
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--input-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>
            </div>
            
            <div className="p-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {filteredChunks.length} chunks
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSidebarPage(p => Math.max(0, p - 1))}
                    disabled={sidebarPage === 0}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    {sidebarPage + 1}/{totalPages}
                  </span>
                  <button
                    onClick={() => setSidebarPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={sidebarPage >= totalPages - 1}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {paginatedChunks.map((chunk) => {
                // Find the real index in the original array
                const realIndex = document.chunks.findIndex(c => c.id === chunk.id);
                return (
                  <button
                    key={chunk.id}
                    onClick={() => setSelectedChunkIndex(realIndex)}
                    className={`w-full px-3 py-2 text-left transition-colors border-b ${
                      selectedChunkIndex === realIndex 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          selectedChunkIndex === realIndex
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                        style={selectedChunkIndex !== realIndex ? { color: 'var(--muted)' } : {}}
                      >
                        #{realIndex + 1}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {chunk.content.length} chars
                      </span>
                    </div>
                    <p 
                      className="text-xs line-clamp-2"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {chunk.content.substring(0, 80)}...
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Chunk content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chunk header */}
            <div 
              className="flex items-center justify-between px-6 py-3 border-b"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                    Chunk {selectedChunkIndex + 1} of {document.chunks.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    {currentChunk.content.length.toLocaleString()} characters
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedChunkIndex(prev => Math.max(0, prev - 1))}
                  disabled={selectedChunkIndex === 0}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedChunkIndex(prev => Math.min(document.chunks.length - 1, prev + 1))}
                  disabled={selectedChunkIndex >= document.chunks.length - 1}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => copyChunk(currentChunk)}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Copy chunk content"
                >
                  {copiedChunkId === currentChunk.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Chunk text */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <pre 
                className="whitespace-pre-wrap text-sm font-mono leading-relaxed"
                style={{ color: 'var(--foreground)' }}
              >
                {currentChunk.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
