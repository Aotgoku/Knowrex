'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, FileType, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadProgress, FILE_CONSTRAINTS, DocumentSummary } from '@/types/document';

// ============================================
// FileUpload Component
// Drag & drop file upload with progress tracking
// ============================================

interface FileUploadProps {
  onUploadComplete: (document: DocumentSummary) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUpload({ onUploadComplete, onUploadError }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  // Validate file before upload
  const validateFile = (file: File): string | null => {
    if (file.size > FILE_CONSTRAINTS.maxSizeBytes) {
      return `File too large. Maximum size is ${FILE_CONSTRAINTS.maxSizeMB}MB`;
    }
    
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!FILE_CONSTRAINTS.allowedExtensions.includes(ext)) {
      return `Invalid file type. Allowed: ${FILE_CONSTRAINTS.allowedExtensions.join(', ')}`;
    }
    
    return null;
  };
  
  // Upload a single file
  const uploadFile = async (file: File) => {
    const uploadId = `${file.name}-${Date.now()}`;
    
    // Add to uploads list
    setUploads(prev => [...prev, {
      filename: file.name,
      progress: 0,
      status: 'pending'
    }]);
    
    // Validate
    const error = validateFile(file);
    if (error) {
      setUploads(prev => prev.map(u => 
        u.filename === file.name 
          ? { ...u, status: 'error', error }
          : u
      ));
      onUploadError?.(error);
      return;
    }
    
    // Update status to uploading
    setUploads(prev => prev.map(u => 
      u.filename === file.name 
        ? { ...u, status: 'uploading', progress: 10 }
        : u
    ));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploads(prev => prev.map(u => 
          u.filename === file.name && u.status === 'uploading'
            ? { ...u, progress: Math.min(u.progress + 10, 60) }
            : u
        ));
      }, 200);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      
      const result = await response.json();
      
      if (result.success && result.document) {
        // Update to processing
        setUploads(prev => prev.map(u => 
          u.filename === file.name 
            ? { ...u, status: 'processing', progress: 80 }
            : u
        ));
        
        // Small delay then complete
        setTimeout(() => {
          setUploads(prev => prev.map(u => 
            u.filename === file.name 
              ? { ...u, status: 'complete', progress: 100, documentId: result.document.id }
              : u
          ));
          onUploadComplete(result.document);
        }, 500);
        
      } else {
        setUploads(prev => prev.map(u => 
          u.filename === file.name 
            ? { ...u, status: 'error', error: result.error || 'Upload failed' }
            : u
        ));
        onUploadError?.(result.error || 'Upload failed');
      }
      
    } catch (error) {
      setUploads(prev => prev.map(u => 
        u.filename === file.name 
          ? { ...u, status: 'error', error: 'Network error. Please try again.' }
          : u
      ));
      onUploadError?.('Network error. Please try again.');
    }
  };
  
  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFile);
  }, []);
  
  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(uploadFile);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove upload from list
  const removeUpload = (filename: string) => {
    setUploads(prev => prev.filter(u => u.filename !== filename));
  };
  
  // Clear completed uploads
  const clearCompleted = () => {
    setUploads(prev => prev.filter(u => u.status !== 'complete'));
  };
  
  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200 ease-out
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]' 
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.01]'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={FILE_CONSTRAINTS.allowedExtensions.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`
            p-4 rounded-full transition-colors
            ${isDragging 
              ? 'bg-indigo-100 dark:bg-indigo-900/50' 
              : 'bg-gray-100 dark:bg-gray-800'
            }
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
          </div>
          
          <div>
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
              or click to browse
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {FILE_CONSTRAINTS.allowedExtensions.map(ext => (
              <span 
                key={ext}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800"
                style={{ color: 'var(--muted)' }}
              >
                {ext.toUpperCase()}
              </span>
            ))}
          </div>
          
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Maximum file size: {FILE_CONSTRAINTS.maxSizeMB}MB
          </p>
        </div>
      </div>
      
      {/* Upload Queue */}
      {uploads.length > 0 && (
        <div 
          className="rounded-xl border overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              Uploads ({uploads.length})
            </span>
            {uploads.some(u => u.status === 'complete') && (
              <button
                onClick={clearCompleted}
                className="text-xs text-indigo-500 hover:text-indigo-600"
              >
                Clear completed
              </button>
            )}
          </div>
          
          <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
            {uploads.map((upload) => (
              <div key={upload.filename} className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {upload.status === 'complete' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : upload.status === 'error' ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : upload.status === 'processing' ? (
                      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                    ) : upload.status === 'uploading' ? (
                      <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p 
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {upload.filename}
                    </p>
                    {upload.error ? (
                      <p className="text-xs text-red-500 truncate">{upload.error}</p>
                    ) : (
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {upload.status === 'complete' ? 'Complete' :
                         upload.status === 'processing' ? 'Processing...' :
                         upload.status === 'uploading' ? 'Uploading...' :
                         'Pending'}
                      </p>
                    )}
                  </div>
                  
                  {/* Progress / Remove */}
                  <div className="flex items-center gap-2">
                    {(upload.status === 'uploading' || upload.status === 'processing') && (
                      <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                        {upload.progress}%
                      </span>
                    )}
                    <button
                      onClick={() => removeUpload(upload.filename)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <X className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                    </button>
                  </div>
                </div>
                
                {/* Progress bar */}
                {(upload.status === 'uploading' || upload.status === 'processing') && (
                  <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        upload.status === 'processing' ? 'bg-indigo-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
