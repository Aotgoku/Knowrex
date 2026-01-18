'use client';

import { useState } from 'react';
import { 
  FileText, 
  FileType, 
  Trash2, 
  Eye, 
  RotateCw, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Clock,
  Hash,
  HardDrive,
  Database
} from 'lucide-react';
import { DocumentSummary } from '@/types/document';
import VectorSyncButton from './VectorSyncButton';

// ============================================
// DocumentCard Component
// Displays a single document with actions
// ============================================

interface DocumentCardProps {
  document: DocumentSummary;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry?: (id: string) => void;
  onSyncComplete?: (docId: string, success: boolean, vectorCount: number) => void;
}

const fileTypeIcons: Record<string, { bg: string; text: string }> = {
  pdf: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  docx: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  txt: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
  md: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' }
};

export default function DocumentCard({ document, onView, onDelete, onRetry, onSyncComplete }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [vectorSynced, setVectorSynced] = useState(document.vectorSynced || false);
  const [vectorCount, setVectorCount] = useState(document.vectorCount || 0);
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(document.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleRetry = async () => {
    if (!onRetry) return;
    
    setIsRetrying(true);
    try {
      await onRetry(document.id);
    } finally {
      setIsRetrying(false);
    }
  };
  
  const typeStyle = fileTypeIcons[document.fileType] || fileTypeIcons.txt;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div 
      className="group relative rounded-xl border card-hover overflow-hidden"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Status indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        document.status === 'complete' ? 'bg-emerald-500' :
        document.status === 'error' ? 'bg-red-500' :
        'bg-amber-500'
      }`} />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2.5 rounded-lg ${typeStyle.bg}`}>
            <FileText className={`w-5 h-5 ${typeStyle.text}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 
              className="font-medium truncate"
              style={{ color: 'var(--foreground)' }}
              title={document.originalName}
            >
              {document.originalName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className={`text-xs px-2 py-0.5 rounded-full uppercase font-medium ${typeStyle.bg} ${typeStyle.text}`}
              >
                {document.fileType}
              </span>
              {document.status === 'complete' && (
                <span className="flex items-center gap-1 text-xs text-emerald-500">
                  <CheckCircle className="w-3 h-3" />
                  Ready
                </span>
              )}
              {document.status === 'error' && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="w-3 h-3" />
                  Error
                </span>
              )}
              {document.status === 'processing' && (
                <span className="flex items-center gap-1 text-xs text-amber-500">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {document.error && (
          <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs text-red-600 dark:text-red-400">
            {document.error}
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {document.totalChunks} chunks
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {document.fileSize}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {document.processingTime ? `${document.processingTime}ms` : '-'}
            </span>
          </div>
        </div>
        
        {/* Upload date */}
        <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
          Uploaded {formatDate(document.uploadDate)}
        </p>
        
        {/* Vector Sync Status */}
        {document.status === 'complete' && (
          <div className="mb-3">
            <VectorSyncButton
              documentId={document.id}
              documentName={document.originalName}
              isSynced={vectorSynced}
              vectorCount={vectorCount}
              totalChunks={document.totalChunks}
              compact={true}
              onSyncComplete={(success, count) => {
                if (success) {
                  setVectorSynced(true);
                  setVectorCount(count);
                }
                onSyncComplete?.(document.id, success, count);
              }}
            />
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={() => onView(document.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          
          {document.status === 'error' && onRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 disabled:opacity-50"
            >
              {isRetrying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RotateCw className="w-4 h-4" />
              )}
            </button>
          )}
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
