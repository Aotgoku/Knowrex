'use client';

import { useState } from 'react';
import { Database, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

// ============================================
// Vector Sync Button Component
// Syncs a document to local ChromaDB
// ============================================

interface VectorSyncButtonProps {
  documentId: string;
  documentName: string;
  isSynced: boolean;
  vectorCount: number;
  totalChunks: number;
  onSyncComplete?: (success: boolean, vectorCount: number) => void;
  compact?: boolean;
}

interface SyncProgress {
  stage: string;
  percent: number;
  message: string;
}

export default function VectorSyncButton({
  documentId,
  documentName,
  isSynced,
  vectorCount,
  totalChunks,
  onSyncComplete,
  compact = false
}: VectorSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    setProgress({ stage: 'preparing', percent: 0, message: 'Starting sync...' });

    try {
      const response = await fetch('/api/embeddings/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId })
      });

      const data = await response.json();

      if (data.success) {
        setProgress({ stage: 'complete', percent: 100, message: 'Sync complete!' });
        onSyncComplete?.(true, data.vectorsCreated);
      } else {
        setError(data.error || 'Sync failed');
        onSyncComplete?.(false, 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
      onSyncComplete?.(false, 0);
    } finally {
      setIsSyncing(false);
      // Clear progress after a delay
      setTimeout(() => setProgress(null), 2000);
    }
  };

  // Compact version for document cards
  if (compact) {
    return (
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors ${
          isSynced 
            ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20' 
            : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
        } disabled:opacity-50`}
        title={isSynced ? `${vectorCount} vectors synced` : 'Sync to vector DB'}
      >
        {isSyncing ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : isSynced ? (
          <>
            <CheckCircle className="h-3 w-3" />
            <span>{vectorCount} vectors</span>
          </>
        ) : (
          <>
            <Database className="h-3 w-3" />
            <span>Sync</span>
          </>
        )}
      </button>
    );
  }

  // Full version
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isSynced
              ? 'bg-green-500/10 text-green-600 border border-green-500/30 hover:bg-green-500/20'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSyncing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : isSynced ? (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Re-sync to Vector DB</span>
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              <span>Sync to Vector DB</span>
            </>
          )}
        </button>

        {isSynced && !isSyncing && (
          <div className="flex items-center gap-1.5 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>{vectorCount} vectors synced</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {isSyncing && progress && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span style={{ color: 'var(--muted)' }}>{progress.message}</span>
            <span style={{ color: 'var(--muted)' }}>{progress.percent}%</span>
          </div>
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--muted-bg)' }}
          >
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Info text */}
      {!isSynced && !isSyncing && (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          First sync may take 1-2 minutes (downloads embedding model ~50MB)
        </p>
      )}
    </div>
  );
}
