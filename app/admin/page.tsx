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
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import FileUpload from '@/components/admin/FileUpload';
import { DocumentStats, DocumentSummary } from '@/types/document';

// ============================================
// Admin Dashboard Page
// Overview of document management system
// ============================================

export default function AdminDashboard() {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch stats and recent documents
  const fetchData = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
        setRecentDocuments(data.documents.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleUploadComplete = (document: DocumentSummary) => {
    // Refresh stats
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: 'var(--foreground)' }}
        >
          Dashboard
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          Overview of your document management system
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="animate-in fade-in-up duration-300" style={{ animationDelay: '0ms' }}>
          <StatsCard
            title="Total Documents"
            value={isLoading ? '-' : stats?.totalDocuments || 0}
            subtitle={`${stats?.documentsByStatus.complete || 0} complete`}
            icon={FileText}
            color="primary"
          />
        </div>
        <div className="animate-in fade-in-up duration-300" style={{ animationDelay: '50ms' }}>
          <StatsCard
            title="Total Chunks"
            value={isLoading ? '-' : stats?.totalChunks.toLocaleString() || 0}
            subtitle="Ready for RAG"
            icon={Hash}
            color="success"
          />
        </div>
        <div className="animate-in fade-in-up duration-300" style={{ animationDelay: '100ms' }}>
          <StatsCard
            title="Storage Used"
            value={isLoading ? '-' : stats?.storageFormatted || '0 Bytes'}
            subtitle="Across all documents"
            icon={HardDrive}
            color="info"
          />
        </div>
        <div className="animate-in fade-in-up duration-300" style={{ animationDelay: '150ms' }}>
          <StatsCard
            title="Last Upload"
            value={isLoading ? '-' : formatDate(stats?.lastUploadDate || null)}
            subtitle="Most recent activity"
            icon={Clock}
            color="warning"
          />
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div 
          className="rounded-xl border p-6"
          style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 
                className="font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Quick Upload
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Upload documents for processing
              </p>
            </div>
          </div>
          
          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
        
        {/* Recent Documents */}
        <div 
          className="rounded-xl border p-6"
          style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 
                  className="font-semibold"
                  style={{ color: 'var(--foreground)' }}
                >
                  Recent Documents
                </h2>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Latest uploads
                </p>
              </div>
            </div>
            
            <Link
              href="/admin/documents"
              className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          ) : recentDocuments.length === 0 ? (
            <div className="text-center py-8">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 inline-block mb-3">
                <FileText className="w-6 h-6" style={{ color: 'var(--muted)' }} />
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                No documents yet. Upload some to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/admin/documents?view=${doc.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className={`p-2 rounded-lg ${
                    doc.status === 'complete' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                      : doc.status === 'error'
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-amber-100 dark:bg-amber-900/30'
                  }`}>
                    {doc.status === 'complete' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : doc.status === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-spin" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {doc.originalName}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {doc.totalChunks} chunks • {doc.fileSize}
                    </p>
                  </div>
                  
                  <span 
                    className="text-xs uppercase font-medium px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: 'var(--border-color)',
                      color: 'var(--muted)'
                    }}
                  >
                    {doc.fileType}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Document Type Breakdown */}
      {stats && stats.totalDocuments > 0 && (
        <div 
          className="mt-6 rounded-xl border p-6"
          style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <h2 
            className="font-semibold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Documents by Type
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.documentsByType).map(([type, count]) => (
              <div 
                key={type}
                className="p-4 rounded-lg text-center"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <p 
                  className="text-2xl font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {count}
                </p>
                <p 
                  className="text-sm uppercase"
                  style={{ color: 'var(--muted)' }}
                >
                  {type}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
