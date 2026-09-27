'use client';

import { useState, useEffect } from 'react';
import { Database, RefreshCw, Loader2, CheckCircle, XCircle, FileText, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ChromaStats from '@/components/admin/ChromaStats';
import SearchTester from '@/components/admin/SearchTester';
import VectorSyncButton from '@/components/admin/VectorSyncButton';
import { DocumentSummary } from '@/types/document';
import { AuthUser } from '@/lib/auth';

// ============================================
// Vector Database Management Page
// Manage Pinecone Cloud Vector Index and test semantic search
// ============================================

export default function VectorDBPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsKey, setStatsKey] = useState(0);
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

  // If Support Agent reaches this page, show access denied view
  if (currentUser?.role === 'agent') {
    return (
      <div className="p-6 md:p-12 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-foreground">
          Super Admin Privileges Required
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          You are currently signed in as a Support Agent (Alex Rivera). Vector database wiping, synchronization, and index configuration are restricted to Super Admins to protect system knowledge integrity.
        </p>
        <Link
          href="/admin/escalations"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-md hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Escalations Workspace
        </Link>
      </div>
    );
  }

  const syncedDocs = documents.filter(d => d.vectorSynced);
  const unsyncedDocs = documents.filter(d => d.status === 'complete' && !d.vectorSynced);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted mb-1.5">
            <Link href="/" className="hover:text-foreground transition-colors">Overview</Link>
            <span>/</span>
            <Link href="/admin" className="hover:text-foreground transition-colors">Operations</Link>
            <span>/</span>
            <span className="text-foreground">Vector DB</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Database className="h-4.5 w-4.5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-instrument text-foreground tracking-tight">
              Vector Database & Pinecone Index
            </h1>
            <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              PINECONE SERVERLESS · US-EAST-1
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted max-w-2xl">
            Real-time vector index orchestration, Xenova 384-dimensional embeddings, and sub-50ms cosine similarity retrieval telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 glass-button text-xs font-semibold text-muted hover:text-foreground transition-all"
            title="Back to Operations Command Center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Operations</span>
          </Link>
        </div>
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
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-indigo-500" />
            Document Sync Status
          </h3>
          <button
            onClick={fetchDocuments}
            className="p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-muted-foreground hover:text-foreground"
            title="Refresh Document List"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-40" />
            <p className="font-medium text-foreground">No documents uploaded yet</p>
            <p className="text-xs mt-1">Upload policy documents to synchronize vectors to Pinecone Cloud</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="flex items-center gap-4 mb-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-foreground">
                  <strong>{syncedDocs.length}</strong> synced to Pinecone
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-amber-500" />
                <span className="text-foreground">
                  <strong>{unsyncedDocs.length}</strong> pending sync
                </span>
              </div>
              <div className="text-muted-foreground">
                {documents.length} total documents
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {documents.filter(d => d.status === 'complete').map(doc => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                    <div className="min-w-0">
                      <p 
                        className="font-semibold truncate text-sm text-foreground"
                        title={doc.originalName}
                      >
                        {doc.originalName}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
              <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <p className="text-muted-foreground">
                  <strong className="text-amber-500">{unsyncedDocs.length}</strong> document{unsyncedDocs.length !== 1 ? 's' : ''} waiting to be synchronized
                </p>
                <p className="text-muted-foreground">
                  Click "Sync" to index chunks in Pinecone Cloud
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Section */}
      <div className="glass-card mt-6 p-6 rounded-2xl">
        <h3 className="font-bold mb-4 text-foreground flex items-center gap-2">
          <span>⚡ Pinecone Cloud Vector Architecture</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Active
          </span>
        </h3>
        <div className="grid md:grid-cols-3 gap-5 text-xs">
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
            <p className="font-bold mb-1 text-foreground">1. Embeddings Generation</p>
            <p className="text-muted-foreground leading-relaxed">
              Uses Xenova all-MiniLM-L6-v2 (384 dimensions) with cosine distance normalization for pinpoint semantic match.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
            <p className="font-bold mb-1 text-foreground">2. Pinecone Serverless Index</p>
            <p className="text-muted-foreground leading-relaxed">
              Cloud-hosted in AWS us-east-1. Zero local storage limits, persistent vectors across all deployments with sub-50ms query latency.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
            <p className="font-bold mb-1 text-foreground">3. Dual-Layer Semantic Retrieval</p>
            <p className="text-muted-foreground leading-relaxed">
              Queries retrieve the top-K relevant chunks with score thresholding before passing context to Gemini 2.5 Flash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
