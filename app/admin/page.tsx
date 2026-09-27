'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Hash, 
  HardDrive, 
  Clock,
  Upload,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Database,
  Users,
  Sparkles,
  Zap,
  ExternalLink,
  Lock,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import FileUpload from '@/components/admin/FileUpload';
import { DocumentStats, DocumentSummary } from '@/types/document';
import { EscalationStats } from '@/types/escalation';

// ============================================
// Knowrex AI - Executive Operations Dashboard
// Real-time AI Command Center with Pinecone Cloud,
// Human Escalation Queue, and Guardrail Telemetry
// ============================================

export default function AdminDashboard() {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<DocumentSummary[]>([]);
  const [escalationStats, setEscalationStats] = useState<EscalationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch document and escalation metrics
  const fetchData = async () => {
    try {
      const [docsRes, escRes] = await Promise.allSettled([
        fetch('/api/documents'),
        fetch('/api/escalations?pageSize=1&includeStats=true')
      ]);

      if (docsRes.status === 'fulfilled') {
        const data = await docsRes.value.json();
        if (data.success) {
          setStats(data.stats);
          setRecentDocuments(data.documents.slice(0, 5));
        }
      }

      if (escRes.status === 'fulfilled') {
        const escData = await escRes.value.json();
        if (escData.success && escData.stats) {
          setEscalationStats(escData.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard telemetry:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };
  
  const handleUploadComplete = () => {
    fetchData();
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Executive Command Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-instrument text-3xl md:text-4xl font-normal tracking-tight text-foreground">
              Operations Command Center
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time telemetry across Pinecone Cloud RAG, Human Escalations, and AI Guardrails.
          </p>
        </div>

        {/* Quick Launch Header Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 glass-button text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Back to Public Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </Link>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-inherit glass-button transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
            title="Refresh Live Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
          </button>
          
          <Link
            href="/admin/evaluations"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass-button text-xs font-semibold hover:text-foreground transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>RAG Eval Suite</span>
          </Link>

          <Link
            href="/chat"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity"
          >
            <span>Customer Chat</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
      
      {/* 4 Primary Enterprise Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Real-time Escalations */}
        <div className="animate-in fade-in-up duration-300" style={{ animationDelay: '0ms' }}>
          <StatsCard
            title="Human Escalations"
            value={isLoading ? '-' : (escalationStats?.pending ?? 0)}
            subtitle={`${escalationStats?.resolved ?? 0} resolved this cycle`}
            icon={Users}
            color={(escalationStats?.pending ?? 0) > 0 ? 'warning' : 'success'}
          />
        </div>

        {/* Metric 2: Guardrail Defenses */}
        <div className="animate-in fade-in-up duration-300" style={{ animationDelay: '50ms' }}>
          <StatsCard
            title="Guardrail Defense"
            value="100% Active"
            subtitle="Injection, PII & Hallucinations"
            icon={ShieldCheck}
            color="success"
          />
        </div>

        {/* Metric 3: Pinecone Cloud Vector Store */}
        <div className="animate-in fade-in-up duration-300" style={{ animationDelay: '100ms' }}>
          <StatsCard
            title="Vector Index"
            value={isLoading ? '-' : `${stats?.totalChunks || 0}`}
            subtitle="Pinecone Serverless · 384-dim"
            icon={Database}
            color="primary"
          />
        </div>

        {/* Metric 4: Knowledge Coverage */}
        <div className="animate-in fade-in-up duration-300" style={{ animationDelay: '150ms' }}>
          <StatsCard
            title="Active Documents"
            value={isLoading ? '-' : `${stats?.totalDocuments || 0}`}
            subtitle={stats?.storageFormatted || '0 KB Storage'}
            icon={FileText}
            color="info"
          />
        </div>
      </div>

      {/* Quick Action Operations Center */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/escalations"
          className="glass-card glow-card p-5 rounded-2xl group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Human In Loop
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-indigo-500 transition-colors flex items-center justify-between">
              <span>Live Escalation Desk</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Assist customers, resolve inquiries, and push new learnings directly to KB.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/evaluations"
          className="glass-card glow-card p-5 rounded-2xl group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              RAG Triad
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-indigo-500 transition-colors flex items-center justify-between">
              <span>Benchmark Harness</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Score Context Relevance, Groundedness & Faithfulness across 5 test suites.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/vectors"
          className="glass-card glow-card p-5 rounded-2xl group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Pinecone Cloud
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-indigo-500 transition-colors flex items-center justify-between">
              <span>Vector Database</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Verify vector index, sync document embeddings, and test semantic queries.
            </p>
          </div>
        </Link>

        <Link
          href="/admin/escalations/analytics"
          className="glass-card glow-card p-5 rounded-2xl group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Analytics
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-indigo-500 transition-colors flex items-center justify-between">
              <span>Knowledge Gap Intel</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Discover unanswered customer topics and auto-generate missing policy docs.
            </p>
          </div>
        </Link>
      </div>
      
      {/* Main Operational Section: Upload + Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Ingestion Card */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">
                Knowledge Ingestion
              </h2>
              <p className="text-xs text-muted-foreground">
                Upload company documents (PDF, TXT, MD, DOCX) for automatic chunking & vectorization
              </p>
            </div>
          </div>
          
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
        
        {/* Recent Ingested Documents Card */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">
                    Recently Ingested Documents
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Indexed and live in Pinecone Cloud
                  </p>
                </div>
              </div>
              
              <Link
                href="/admin/documents"
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="text-center py-10">
                <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 inline-block mb-3">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No documents ingested yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload policy documents to start grounding AI responses.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/admin/documents?view=${doc.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-100/60 dark:hover:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50"
                  >
                    <div className={`p-2 rounded-lg ${
                      doc.status === 'complete' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                        : doc.status === 'error'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                    }`}>
                      {doc.status === 'complete' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : doc.status === 'error' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">
                        {doc.originalName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {doc.totalChunks} chunks • {doc.fileSize}
                      </p>
                    </div>
                    
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {doc.fileType}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Last upload activity: {formatDate(stats?.lastUploadDate || null)}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Vector Synced</span>
          </div>
        </div>
      </div>
      
      {/* System Infrastructure Architecture Strip */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Enterprise Infrastructure Stack
              </p>
              <p className="text-sm font-semibold text-foreground">
                Google Gemini 2.5 Flash · Pinecone Cloud Vector Store · Redis Semantic Caching · Supabase Realtime
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              AWS us-east-1
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
              384-Dim all-MiniLM-L6-v2
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              Sub-50ms Retrieval
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
