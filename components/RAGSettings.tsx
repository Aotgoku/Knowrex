'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, BookOpen, Sparkles, FileText, ChevronDown } from 'lucide-react';
import { RAGSettings, DocumentOption } from '@/types/chat';

// ============================================
// RAG Settings Component
// Toggle and configure document search
// ============================================

const STORAGE_KEY = 'knowrex-rag-settings';
const SETTINGS_VERSION = 3;  // Increment to reset user settings to new defaults

const DEFAULT_SETTINGS: RAGSettings = {
  enabled: true,
  minConfidence: 0.25,  // Lower threshold - semantic similarity scores are typically 20-50%
  showSources: true,
  selectedDocumentId: undefined, // All documents by default
};

interface RAGSettingsPanelProps {
  settings: RAGSettings;
  onSettingsChange: (settings: RAGSettings) => void;
  isSearching?: boolean;
  documentsCount?: number;
  documents?: DocumentOption[]; // List of documents for filter dropdown
}

export function useRAGSettings() {
  const [settings, setSettings] = useState<RAGSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check version - reset if outdated
        if (parsed.version !== SETTINGS_VERSION) {
          // Old settings, use defaults
          setSettings(DEFAULT_SETTINGS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, version: SETTINGS_VERSION }));
        } else {
          setSettings(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load RAG settings:', e);
    }
    setIsLoaded(true);
  }, []);
  
  // Save to localStorage when settings change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, version: SETTINGS_VERSION }));
      } catch (e) {
        console.error('Failed to save RAG settings:', e);
      }
    }
  }, [settings, isLoaded]);
  
  return { settings, setSettings, isLoaded };
}

export default function RAGSettingsPanel({ 
  settings, 
  onSettingsChange, 
  isSearching = false,
  documentsCount = 0,
  documents = []
}: RAGSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleToggle = () => {
    onSettingsChange({
      ...settings,
      enabled: !settings.enabled
    });
  };
  
  const handleConfidenceChange = (value: number) => {
    onSettingsChange({
      ...settings,
      minConfidence: value / 100
    });
  };
  
  const handleShowSourcesChange = (show: boolean) => {
    onSettingsChange({
      ...settings,
      showSources: show
    });
  };
  
  const handleDocumentChange = (documentId: string) => {
    onSettingsChange({
      ...settings,
      selectedDocumentId: documentId === 'all' ? undefined : documentId
    });
  };
  
  // Get display name for selected document
  const getSelectedDocumentName = () => {
    if (!settings.selectedDocumentId) return 'All Documents';
    const doc = documents.find(d => d.id === settings.selectedDocumentId);
    return doc?.name || 'Unknown';
  };
  
  return (
    <div 
      className="border rounded-lg overflow-hidden"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      {/* Main toggle row */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          {/* Toggle button */}
          <button
            onClick={handleToggle}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              settings.enabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={settings.enabled ? 'Disable document search' : 'Enable document search'}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                settings.enabled ? 'left-6' : 'left-0.5'
              }`}
            />
          </button>
          
          {/* Label */}
          <div className="flex items-center gap-2">
            {settings.enabled ? (
              <BookOpen className="w-4 h-4 text-indigo-500" />
            ) : (
              <Sparkles className="w-4 h-4" style={{ color: 'var(--muted)' }} />
            )}
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
              {settings.enabled ? 'Search Documents' : 'General Knowledge'}
            </span>
          </div>
          
          {/* Status indicator */}
          {settings.enabled && isSearching && (
            <span className="flex items-center gap-1 text-xs text-indigo-500">
              <Search className="w-3 h-3 animate-pulse" />
              Searching...
            </span>
          )}
          
          {settings.enabled && !isSearching && documentsCount > 0 && (
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {documentsCount} document{documentsCount !== 1 ? 's' : ''} available
            </span>
          )}
        </div>
        
        {/* Settings button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-md hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
          style={{ color: 'var(--muted)' }}
          aria-label="Toggle settings"
        >
          {isExpanded ? (
            <X className="w-4 h-4" />
          ) : (
            <SlidersHorizontal className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {/* Expanded settings */}
      {isExpanded && (
        <div 
          className="px-3 pb-3 pt-1 border-t space-y-4"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {/* Document filter dropdown */}
          {documents.length > 0 && (
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: 'var(--muted)' }}>
                Search in Document
              </label>
              <div className="relative">
                <select
                  value={settings.selectedDocumentId || 'all'}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  className="w-full px-3 py-2 pr-8 rounded-md text-sm appearance-none cursor-pointer"
                  style={{ 
                    backgroundColor: 'var(--background)', 
                    color: 'var(--foreground)',
                    border: '1px solid var(--border-color)'
                  }}
                  disabled={!settings.enabled}
                >
                  <option value="all">📚 All Documents ({documents?.length || 0})</option>
                  {documents && documents.map((doc) => (
                    <option key={doc?.id || ''} value={doc?.id || ''}>
                      📄 {doc?.name && doc.name.length > 40 ? doc.name.substring(0, 40) + '...' : (doc?.name || 'Unknown')}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" 
                  style={{ color: 'var(--muted)' }}
                />
              </div>
              {settings.selectedDocumentId && (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                  <FileText className="w-3 h-3" />
                  Searching only in: {getSelectedDocumentName()}
                </p>
              )}
            </div>
          )}

          {/* Minimum confidence slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                Minimum Match Confidence
              </label>
              <span 
                className="text-xs font-mono px-2 py-0.5 rounded"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              >
                {Math.round(settings.minConfidence * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="5"
              value={Math.round(settings.minConfidence * 100)}
              onChange={(e) => handleConfidenceChange(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              style={{ backgroundColor: 'var(--background)' }}
              disabled={!settings.enabled}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
              <span>More results</span>
              <span>Higher accuracy</span>
            </div>
          </div>
          
          {/* Show sources toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
              Show source citations
            </label>
            <button
              onClick={() => handleShowSourcesChange(!settings.showSources)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                settings.showSources ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              disabled={!settings.enabled}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.showSources ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
          
          {/* Info text */}
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            {settings.enabled 
              ? 'The AI will search your uploaded documents before answering questions.'
              : 'The AI will use general knowledge without searching your documents.'
            }
          </p>
        </div>
      )}
    </div>
  );
}

// Compact inline toggle for chat input area
export function RAGToggle({ 
  enabled, 
  onChange,
  isSearching = false 
}: { 
  enabled: boolean; 
  onChange: (enabled: boolean) => void;
  isSearching?: boolean;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
        enabled 
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      }`}
      title={enabled ? 'Document search enabled' : 'Document search disabled'}
    >
      {isSearching ? (
        <Search className="w-3 h-3 animate-pulse" />
      ) : enabled ? (
        <BookOpen className="w-3 h-3" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      <span>{enabled ? 'RAG' : 'AI'}</span>
    </button>
  );
}
