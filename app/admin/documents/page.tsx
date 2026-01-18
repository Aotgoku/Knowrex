'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText, Upload, RefreshCw, Loader2 } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';
import DocumentList from '@/components/admin/DocumentList';
import ChunkViewer from '@/components/admin/ChunkViewer';
import { DocumentSummary, ProcessedDocument, DocumentStats } from '@/types/document';

// ============================================
// Documents Management Page
// Full document list with upload and viewing
// ============================================

function DocumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewDocId = searchParams.get('view');
  
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  // Chunk viewer state
  const [selectedDocument, setSelectedDocument] = useState<ProcessedDocument | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  
  // Fetch documents
  const fetchDocuments = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.documents);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  // Handle view param
  useEffect(() => {
    if (viewDocId) {
      handleView(viewDocId);
    }
  }, [viewDocId]);
  
  // View document
  const handleView = async (id: string) => {
    setIsLoadingDocument(true);
    
    try {
      const response = await fetch(`/api/documents/${id}`);
      const data = await response.json();
      
      if (data.success && data.document) {
        setSelectedDocument(data.document);
        setIsViewerOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch document:', error);
    } finally {
      setIsLoadingDocument(false);
    }
  };
  
  // Close viewer
  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedDocument(null);
    
    // Remove view param from URL
    if (viewDocId) {
      router.push('/admin/documents');
    }
  };
  
  // Delete document
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setDocuments(prev => prev.filter(d => d.id !== id));
        // Refresh stats
        fetchDocuments();
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };
  
  // Retry processing
  const handleRetry = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh list
        fetchDocuments();
      }
    } catch (error) {
      console.error('Failed to retry processing:', error);
    }
  };
  
  // Handle upload complete
  const handleUploadComplete = (document: DocumentSummary) => {
    setDocuments(prev => [document, ...prev]);
    fetchDocuments(); // Refresh stats
  };
  
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 
            className="text-2xl md:text-3xl font-bold mb-1"
            style={{ color: 'var(--foreground)' }}
          >
            Documents
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            Manage your uploaded documents and view processed chunks
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDocuments(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} style={{ color: 'var(--muted)' }} />
            <span style={{ color: 'var(--foreground)' }}>Refresh</span>
          </button>
          
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white transition-colors hover:bg-indigo-600"
          >
            <Upload className="w-4 h-4" />
            <span>{showUpload ? 'Hide Upload' : 'Upload'}</span>
          </button>
        </div>
      </div>
      
      {/* Stats Summary */}
      {stats && (
        <div 
          className="flex flex-wrap items-center gap-4 p-4 rounded-xl border mb-6"
          style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <span style={{ color: 'var(--foreground)' }}>
              <strong>{stats.totalDocuments}</strong> documents
            </span>
          </div>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <span style={{ color: 'var(--muted)' }}>
            <strong>{stats.totalChunks.toLocaleString()}</strong> chunks
          </span>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <span style={{ color: 'var(--muted)' }}>
            <strong>{stats.storageFormatted}</strong> storage
          </span>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <span className="text-emerald-500">
            <strong>{stats.documentsByStatus.complete}</strong> complete
          </span>
          {stats.documentsByStatus.error > 0 && (
            <>
              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
              <span className="text-red-500">
                <strong>{stats.documentsByStatus.error}</strong> errors
              </span>
            </>
          )}
        </div>
      )}
      
      {/* Upload Section */}
      {showUpload && (
        <div 
          className="mb-6 p-6 rounded-xl border"
          style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 
            className="font-semibold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Upload Documents
          </h2>
          <FileUpload 
            onUploadComplete={handleUploadComplete}
          />
        </div>
      )}
      
      {/* Document List */}
      <DocumentList
        documents={documents}
        onView={handleView}
        onDelete={handleDelete}
        onRetry={handleRetry}
        isLoading={isLoading}
      />
      
      {/* Loading indicator for document view */}
      {isLoadingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div 
            className="p-6 rounded-xl shadow-xl flex items-center gap-3"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            <span style={{ color: 'var(--foreground)' }}>Loading document...</span>
          </div>
        </div>
      )}
      
      {/* Chunk Viewer Modal */}
      <ChunkViewer
        document={selectedDocument}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function DocumentsPage() {
  return (
    <Suspense fallback={
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    }>
      <DocumentsContent />
    </Suspense>
  );
}
