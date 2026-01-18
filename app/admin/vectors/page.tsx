'use client';

import { useState, useEffect } from 'react';
import { Database, RefreshCw, Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';
import ChromaStats from '@/components/admin/ChromaStats';
import SearchTester from '@/components/admin/SearchTester';
import VectorSyncButton from '@/components/admin/VectorSyncButton';
import { DocumentSummary } from '@/types/document';

// ============================================
// Vector Database Management Page
// Manage local ChromaDB and test semantic search
// ============================================

export default function VectorDBPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsKey, setStatsKey] = useState(0);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSyncComplete = () => {
    // Refresh stats
    setStatsKey(prev => prev + 1);
    // Refresh document list
    fetchDocuments();
  };

  const handleReset = () => {
    // Refresh everything
    setStatsKey(prev => prev + 1);
    fetchDocuments();
  };

  const syncedDocs = documents.filter(d => d.vectorSynced);
  const unsyncedDocs = documents.filter(d => d.status === 'complete' && !d.vectorSynced);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Database className="h-8 w-8 text-purple-500" />
          <h1 
            className="text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--foreground)' }}
          >
            Vector Database
          </h1>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600">
            100% FREE · LOCAL
          </span>
        </div>
        <p style={{ color: 'var(--muted)' }}>
          Manage your local ChromaDB vector database and test semantic search
        </p>
      </div>

      {/* Stats Card */}
      <ChromaStats 
        key={statsKey}
        className="mb-6" 
        onReset={handleReset}
      />

      {/* Search Tester */}
      <SearchTester className="mb-6" />

      {/* Document Sync Status */}
      <div 
        className="p-4 rounded-xl border"
        style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <FileText className="h-5 w-5 text-indigo-500" />
            Document Sync Status
          </h3>
          <button
            onClick={fetchDocuments}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" style={{ color: 'var(--muted)' }} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--muted)' }} />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--muted)' }}>
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm mt-1">Upload documents to start syncing to the vector database</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span style={{ color: 'var(--foreground)' }}>
                  <strong>{syncedDocs.length}</strong> synced
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-orange-500" />
                <span style={{ color: 'var(--foreground)' }}>
                  <strong>{unsyncedDocs.length}</strong> pending
                </span>
              </div>
              <div style={{ color: 'var(--muted)' }}>
                {documents.length} total documents
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {documents.filter(d => d.status === 'complete').map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ borderColor: 'var(--border)', background: 'var(--muted-bg)' }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                    <div className="min-w-0">
                      <p 
                        className="font-medium truncate text-sm"
                        style={{ color: 'var(--foreground)' }}
                        title={doc.originalName}
                      >
                        {doc.originalName}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {doc.totalChunks} chunks · {doc.fileSize}
                      </p>
                    </div>
                  </div>
                  
                  <VectorSyncButton
                    documentId={doc.id}
                    documentName={doc.originalName}
                    isSynced={doc.vectorSynced || false}
                    vectorCount={doc.vectorCount || 0}
                    totalChunks={doc.totalChunks}
                    compact={true}
                    onSyncComplete={handleSyncComplete}
                  />
                </div>
              ))}
            </div>

            {/* Sync All Button */}
            {unsyncedDocs.length > 0 && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                  {unsyncedDocs.length} document{unsyncedDocs.length !== 1 ? 's' : ''} waiting to be synced
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Click the "Sync" button on each document to add it to the vector database
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Section */}
      <div 
        className="mt-6 p-4 rounded-xl border"
        style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
      >
        <h3 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
          💡 How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>1. Local Embeddings</p>
            <p style={{ color: 'var(--muted)' }}>
              Uses Xenova/all-MiniLM-L6-v2 model running locally. First run downloads ~50MB model.
            </p>
          </div>
          <div>
            <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>2. ChromaDB Storage</p>
            <p style={{ color: 'var(--muted)' }}>
              Vectors stored locally in /data/chroma/. No cloud services, 100% private.
            </p>
          </div>
          <div>
            <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>3. Semantic Search</p>
            <p style={{ color: 'var(--muted)' }}>
              Search finds relevant content by meaning, not just keywords. Powered by cosine similarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
