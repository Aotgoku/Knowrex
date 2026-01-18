'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { MessageSource } from '@/types/chat';

// ============================================
// Source Citation Component
// Shows document sources used in RAG responses
// ============================================

interface SourceCitationProps {
  sources: MessageSource[];
  confidence: number;
  showSources?: boolean;
}

/**
 * Get relevance level info
 * Note: Semantic similarity scores of 25-55% are NORMAL and indicate good matches
 * This is NOT an accuracy score - it measures how semantically similar the query is to the content
 */
function getConfidenceInfo(score: number) {
  // Adjusted for realistic semantic similarity scores
  if (score >= 0.45) return { level: 'high', color: '#22c55e', label: '✓ Excellent match' };
  if (score >= 0.35) return { level: 'medium', color: '#3b82f6', label: '✓ Good match' };
  if (score >= 0.25) return { level: 'low', color: '#eab308', label: '✓ Found' };
  return { level: 'none', color: '#ef4444', label: 'Low relevance' };
}

export default function SourceCitation({ sources, confidence, showSources = true }: SourceCitationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  
  if (!sources || sources.length === 0 || !showSources) {
    return null;
  }
  
  const confidenceInfo = getConfidenceInfo(confidence);
  const uniqueDocuments = [...new Set(sources.map(s => s.documentName))];
  
  return (
    <div 
      className="mt-3 pt-3 border-t"
      style={{ borderColor: 'var(--border-color)' }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
            📚 Sources ({uniqueDocuments.length} document{uniqueDocuments.length !== 1 ? 's' : ''})
          </span>
          <span 
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ 
              backgroundColor: `${confidenceInfo.color}20`,
              color: confidenceInfo.color 
            }}
          >
            {confidenceInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--muted)' }}>
          <span>{isExpanded ? 'Hide' : 'Show'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </div>
      </button>
      
      {/* Collapsed view - just document names */}
      {!isExpanded && (
        <div className="flex flex-wrap gap-1 mt-2">
          {uniqueDocuments.map((docName, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 rounded-md flex items-center gap-1"
              style={{ 
                backgroundColor: 'var(--background)',
                color: 'var(--muted)'
              }}
            >
              <FileText className="w-3 h-3" />
              {docName}
            </span>
          ))}
        </div>
      )}
      
      {/* Expanded view - full source details */}
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {sources.map((source, index) => {
            const sourceConfidence = getConfidenceInfo(source.score);
            const isSourceExpanded = expandedSource === source.chunkId;
            
            return (
              <div 
                key={source.chunkId || index}
                className="rounded-lg border overflow-hidden"
                style={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {/* Source header */}
                <button
                  onClick={() => setExpandedSource(isSourceExpanded ? null : (source.chunkId || `source-${index}`))}
                  className="flex items-center justify-between w-full p-3 text-left hover:bg-opacity-50"
                  style={{ backgroundColor: 'var(--card-bg)' }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <FileText className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {source.documentName}
                    </span>
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800"
                      style={{ color: 'var(--muted)' }}
                    >
                      Chunk #{source.chunkId.split('-chunk-')[1] || (index + 1)}
                    </span>
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ 
                        backgroundColor: `${sourceConfidence.color}20`,
                        color: sourceConfidence.color 
                      }}
                    >
                      {Math.round(source.score * 100)}% match
                    </span>
                  </div>
                  {isSourceExpanded ? (
                    <ChevronUp className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  ) : (
                    <ChevronDown className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                  )}
                </button>
                
                {/* Source content */}
                {isSourceExpanded && (
                  <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <p 
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {source.text}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
