'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc,
  Filter,
  FileText,
  Inbox
} from 'lucide-react';
import { DocumentSummary, DocumentStatus, SupportedFileType } from '@/types/document';
import DocumentCard from './DocumentCard';

// ============================================
// DocumentList Component
// Displays and filters list of documents
// ============================================

interface DocumentListProps {
  documents: DocumentSummary[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry?: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'date' | 'name' | 'size' | 'chunks';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export default function DocumentList({ 
  documents, 
  onView, 
  onDelete, 
  onRetry,
  isLoading 
}: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<SupportedFileType | 'all'>('all');
  
  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let result = [...documents];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc.originalName.toLowerCase().includes(query) ||
        doc.filename.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(doc => doc.status === filterStatus);
    }
    
    // Type filter
    if (filterType !== 'all') {
      result = result.filter(doc => doc.fileType === filterType);
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
        case 'name':
          comparison = a.originalName.localeCompare(b.originalName);
          break;
        case 'size':
          comparison = a.fileSizeBytes - b.fileSizeBytes;
          break;
        case 'chunks':
          comparison = a.totalChunks - b.totalChunks;
          break;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
    
    return result;
  }, [documents, searchQuery, filterStatus, filterType, sortField, sortDirection]);
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div 
        className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ 
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)'
            }}
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as DocumentStatus | 'all')}
            className="px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ 
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)'
            }}
          >
            <option value="all">All Status</option>
            <option value="complete">Complete</option>
            <option value="processing">Processing</option>
            <option value="error">Error</option>
          </select>
          
          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as SupportedFileType | 'all')}
            className="px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ 
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)'
            }}
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="md">Markdown</option>
          </select>
          
          {/* Sort dropdown */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ 
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--foreground)'
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
            <option value="chunks">Sort by Chunks</option>
          </select>
          
          {/* Sort direction */}
          <button
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)' }}
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortDirection === 'asc' ? (
              <SortAsc className="w-4 h-4" style={{ color: 'var(--muted)' }} />
            ) : (
              <SortDesc className="w-4 h-4" style={{ color: 'var(--muted)' }} />
            )}
          </button>
          
          {/* View mode toggle */}
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              title="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
        </p>
        {(searchQuery || filterStatus !== 'all' || filterType !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterType('all');
            }}
            className="text-sm text-indigo-500 hover:text-indigo-600"
          >
            Clear filters
          </button>
        )}
      </div>
      
      {/* Document grid/list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div 
          className="flex flex-col items-center justify-center py-12 rounded-xl border"
          style={{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Inbox className="w-8 h-8" style={{ color: 'var(--muted)' }} />
          </div>
          <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>
            {documents.length === 0 ? 'No documents yet' : 'No matching documents'}
          </p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {documents.length === 0 
              ? 'Upload some documents to get started'
              : 'Try adjusting your search or filters'
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
        }>
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={onView}
              onDelete={onDelete}
              onRetry={onRetry}
            />
          ))}
        </div>
      )}
    </div>
  );
}
