'use client';

import { useState } from 'react';
import { Search, Loader2, FileText, AlertCircle, Sparkles } from 'lucide-react';

// ============================================
// Search Tester Component
// Test semantic search functionality
// ============================================

interface SearchResult {
  chunkId: string;
  documentId: string;
  documentName: string;
  text: string;
  score: number;
  chunkIndex: number;
}

interface SearchTesterProps {
  className?: string;
}

export default function SearchTester({ className = '' }: SearchTesterProps) {
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(5);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTime, setSearchTime] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    setResults([]);
    setSearchTime(null);

    try {
      const response = await fetch('/api/embeddings/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), topK })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setSearchTime(data.searchTime);
        setHasSearched(true);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const formatScore = (score: number): string => {
    return (score * 100).toFixed(1) + '%';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className={`p-4 rounded-xl border ${className}`} style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
          Semantic Search Tester
        </h3>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600">
          AI-Powered
        </span>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a question or search query..."
              className="w-full px-4 py-2 pr-10 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--input-bg)',
                color: 'var(--foreground)'
              }}
            />
            <Search 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" 
              style={{ color: 'var(--muted)' }} 
            />
          </div>
          
          <select
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--input-bg)',
              color: 'var(--foreground)'
            }}
          >
            <option value={3}>Top 3</option>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
          </select>

          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          First search may take longer while the embedding model loads
        </p>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center gap-2 text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Results */}
      {hasSearched && !error && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'var(--foreground)' }}>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </span>
            {searchTime !== null && (
              <span style={{ color: 'var(--muted)' }}>
                {searchTime}ms
              </span>
            )}
          </div>

          {results.length === 0 ? (
            <div 
              className="text-center py-8 rounded-lg"
              style={{ background: 'var(--muted-bg)' }}
            >
              <Search className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--muted)' }} />
              <p style={{ color: 'var(--muted)' }}>No matching documents found</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                Try a different query or sync more documents
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.chunkId}
                  className="p-3 rounded-lg border transition-colors hover:border-purple-500/30"
                  style={{ borderColor: 'var(--border)', background: 'var(--muted-bg)' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600"
                      >
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" style={{ color: 'var(--muted)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          {result.documentName}
                        </span>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--card-bg)', color: 'var(--muted)' }}>
                        Chunk {result.chunkIndex + 1}
                      </span>
                    </div>
                    <span className={`text-sm font-mono font-medium ${getScoreColor(result.score)}`}>
                      {formatScore(result.score)}
                    </span>
                  </div>
                  <p 
                    className="text-sm line-clamp-3"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {result.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Initial state */}
      {!hasSearched && !isSearching && (
        <div 
          className="mt-4 text-center py-8 rounded-lg"
          style={{ background: 'var(--muted-bg)' }}
        >
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-amber-500" />
          <p style={{ color: 'var(--foreground)' }}>Ready for semantic search</p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Enter a question to find relevant document chunks
          </p>
        </div>
      )}
    </div>
  );
}
