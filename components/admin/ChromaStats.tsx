'use client';

import { useState, useEffect } from 'react';
import { Database, RefreshCw, Cpu, HardDrive, Loader2 } from 'lucide-react';

// ============================================
// ChromaDB Stats Component
// Displays local vector database statistics
// ============================================

interface ChromaStats {
  totalVectors: number;
  collectionName: string;
  embeddingModel: {
    model: string;
    dimensions: number;
    type: string;
    cost: string;
  };
}

interface ChromaStatsProps {
  className?: string;
  onReset?: () => void;
}

export default function ChromaStats({ className = '', onReset }: ChromaStatsProps) {
  const [stats, setStats] = useState<ChromaStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/chroma/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats({
          totalVectors: data.totalVectors,
          collectionName: data.collectionName,
          embeddingModel: data.embeddingModel
        });
      } else {
        setError(data.error || 'Failed to load stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the vector database? This will delete all vectors and require re-syncing all documents.')) {
      return;
    }

    try {
      setIsResetting(true);
      
      const response = await fetch('/api/chroma/reset', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchStats();
        onReset?.();
      } else {
        setError(data.error || 'Reset failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className={`p-4 rounded-xl border ${className}`} style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'var(--muted)' }} />
          <span style={{ color: 'var(--muted)' }}>Loading stats...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-xl border ${className}`} style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
        <div className="flex items-center justify-between">
          <span className="text-red-500 text-sm">{error}</span>
          <button
            onClick={fetchStats}
            className="text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border ${className}`} style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
            Vector Database
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
            LOCAL · FREE
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Refresh stats"
          >
            <RefreshCw className="h-4 w-4" style={{ color: 'var(--muted)' }} />
          </button>
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
            title="Reset vector database"
          >
            {isResetting ? 'Resetting...' : 'Reset'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Vectors */}
        <div className="text-center p-3 rounded-lg" style={{ background: 'var(--muted-bg)' }}>
          <div className="text-2xl font-bold text-purple-500">
            {stats?.totalVectors.toLocaleString() || 0}
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Total Vectors
          </div>
        </div>

        {/* Embedding Model */}
        <div className="text-center p-3 rounded-lg" style={{ background: 'var(--muted-bg)' }}>
          <div className="flex items-center justify-center gap-1">
            <Cpu className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>
              {stats?.embeddingModel.dimensions || 384}D
            </span>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Dimensions
          </div>
        </div>

        {/* Model Type */}
        <div className="text-center p-3 rounded-lg" style={{ background: 'var(--muted-bg)' }}>
          <div className="font-medium text-sm truncate" style={{ color: 'var(--foreground)' }}>
            MiniLM-L6
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Model
          </div>
        </div>

        {/* Storage */}
        <div className="text-center p-3 rounded-lg" style={{ background: 'var(--muted-bg)' }}>
          <div className="flex items-center justify-center gap-1">
            <HardDrive className="h-4 w-4 text-green-500" />
            <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>
              Local
            </span>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            Storage
          </div>
        </div>
      </div>

      {/* Collection info */}
      <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'var(--muted)' }}>
            Collection: <code className="px-1 rounded" style={{ background: 'var(--muted-bg)' }}>
              {stats?.collectionName || 'knowrex-documents'}
            </code>
          </span>
          <span style={{ color: 'var(--muted)' }}>
            ChromaDB · Cosine Similarity
          </span>
        </div>
      </div>
    </div>
  );
}
