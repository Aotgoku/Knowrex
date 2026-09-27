'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Upload, RefreshCw, Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';
import DocumentList from '@/components/admin/DocumentList';
import ChunkViewer from '@/components/admin/ChunkViewer';
import { DocumentSummary, ProcessedDocument, DocumentStats } from '@/types/document';
import { AuthUser } from '@/lib/auth';

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
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Load session
  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated && d.user) setCurrentUser(d.user);
      })
      .catch(() => {});
  }, []);
  
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
    if (currentUser?.role === 'agent') {
      alert('Permission Denied: Only Super Admins can delete organizational documents.');
      return;
    }

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
      } else {
        alert(data.message || data.error || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };
  
  // Retry processing
  const handleRetry = async (id: string) => {
    if (currentUser?.role === 'agent') {
      alert('Permission Denied: Only Super Admins can reprocess documents.');
      return;
    }

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh list
        fetchDocuments();
      } else {
        alert(data.message || data.error || 'Failed to retry processing');
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
  
  const isAgent = currentUser?.role === 'agent';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Role Notice for Support Agent */}
      {isAgent && (
        <div className="mb-6 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex items-center gap-3 text-sm text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <strong>Support Agent View:</strong> You have read-only access to documents. Ingestion, reprocessing, and deletion of knowledge files are restricted to Super Admins.
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-instrument text-foreground tracking-tight">
              Enterprise Knowledge Ingestion
            </h1>
            <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              RAG CORPUS REPOSITORY
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-normal">
            Multi-modal document parsing, recursive chunk slicing, and vector synchronization pipeline.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 glass-button text-xs font-semibold text-muted hover:text-foreground transition-all"
            title="Back to Operations Command Center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Operations</span>
          </Link>

          <button
            onClick={() => fetchDocuments(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 dark:border-white/10 bg-white/5 dark:bg-white/[0.03] backdrop-blur-md transition-all hover:bg-white/10 text-foreground cursor-pointer text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''} text-muted-foreground`} />
            <span>Refresh</span>
          </button>
          
          {!isAgent && (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{showUpload ? 'Hide Upload' : 'Upload Documents'}</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Stats Summary */}
      {stats && (
        <div className="glass-card flex flex-wrap items-center gap-5 p-4 rounded-2xl mb-8 border border-white/10 dark:border-white/10 bg-white/[0.02] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="text-foreground text-xs">
              <strong className="font-mono text-sm text-foreground">{stats.totalDocuments}</strong> documents
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-muted-foreground text-xs">
            <strong className="font-mono text-sm text-foreground">{stats.totalChunks.toLocaleString()}</strong> chunks
          </span>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-muted-foreground text-xs">
            <strong className="font-mono text-sm text-foreground">{stats.storageFormatted}</strong> storage
          </span>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-emerald-400 font-medium text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <strong className="font-mono text-sm">{stats.documentsByStatus.complete}</strong> complete
          </span>
          {stats.documentsByStatus.error > 0 && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-red-400 font-medium text-xs">
                <strong className="font-mono text-sm">{stats.documentsByStatus.error}</strong> errors
              </span>
            </>
          )}
        </div>
      )}
      
      {/* Upload Section */}
      {showUpload && (
        <div className="glass-card mb-6 p-6 rounded-2xl">
          <h2 className="font-bold text-foreground mb-4">
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
