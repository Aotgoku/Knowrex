'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, RefreshCw, BarChart3, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Escalation, EscalationStats } from '@/types/escalation';
import EscalationList from '@/components/escalations/EscalationList';
import EscalationFilters from '@/components/escalations/EscalationFilters';
import EscalationStatsDisplay from '@/components/escalations/EscalationStats';
import EscalationDetail from '@/components/escalations/EscalationDetail';

export default function EscalationsPage() {
  const router = useRouter();
  
  // State
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [stats, setStats] = useState<EscalationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [status, setStatus] = useState('');
  const [urgency, setUrgency] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Selected escalation for detail view
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Fetch escalations
  const fetchEscalations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (urgency) params.set('urgency', urgency);
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('sortBy', sortBy);
      params.set('page', page.toString());
      params.set('pageSize', '20');
      params.set('includeStats', 'true');

      const response = await fetch(`/api/escalations?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setEscalations(data.escalations);
        setTotal(data.total);
        setHasMore(data.hasMore);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        setError(data.error || 'Failed to fetch escalations');
      }
    } catch (err) {
      setError('Failed to fetch escalations');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [status, urgency, category, search, sortBy, page]);

  // Initial load and refresh on filter changes
  useEffect(() => {
    fetchEscalations();
  }, [fetchEscalations]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [status, urgency, category, search, sortBy]);

  // Handle escalation click
  const handleEscalationClick = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
  };

  // Handle resolve
  const handleResolve = async (data: {
    humanAnswer: string;
    resolvedBy: string;
    resolutionNotes?: string;
    addToKB: boolean;
    kbIntegrationType?: string;
    category?: string;
    tags?: string[];
  }) => {
    if (!selectedEscalation) return;

    try {
      setIsDetailLoading(true);
      const response = await fetch(`/api/escalations/${selectedEscalation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve',
          ...data
        })
      });

      const result = await response.json();
      if (result.success) {
        setSelectedEscalation(result.escalation);
        fetchEscalations(); // Refresh list
      } else {
        alert(result.error || 'Failed to resolve');
      }
    } catch (err) {
      alert('Failed to resolve escalation');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Handle assign
  const handleAssign = async (assignedTo: string) => {
    if (!selectedEscalation) return;

    try {
      setIsDetailLoading(true);
      const response = await fetch(`/api/escalations/${selectedEscalation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign',
          assignedTo
        })
      });

      const result = await response.json();
      if (result.success) {
        setSelectedEscalation(result.escalation);
        fetchEscalations();
      } else {
        alert(result.error || 'Failed to assign');
      }
    } catch (err) {
      alert('Failed to assign escalation');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Handle start
  const handleStart = async () => {
    if (!selectedEscalation) return;

    try {
      setIsDetailLoading(true);
      const response = await fetch(`/api/escalations/${selectedEscalation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });

      const result = await response.json();
      if (result.success) {
        setSelectedEscalation(result.escalation);
        fetchEscalations();
      } else {
        alert(result.error || 'Failed to start');
      }
    } catch (err) {
      alert('Failed to start escalation');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Handle reject
  const handleReject = async (reason: string) => {
    if (!selectedEscalation) return;

    try {
      setIsDetailLoading(true);
      const response = await fetch(`/api/escalations/${selectedEscalation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          resolvedBy: 'Admin',
          reason
        })
      });

      const result = await response.json();
      if (result.success) {
        setSelectedEscalation(result.escalation);
        fetchEscalations();
      } else {
        alert(result.error || 'Failed to reject');
      }
    } catch (err) {
      alert('Failed to reject escalation');
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatus('');
    setUrgency('');
    setCategory('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Overview</Link>
          <span>/</span>
          <Link href="/admin" className="hover:text-foreground transition-colors">Operations</Link>
          <span>/</span>
          <span className="text-foreground font-semibold">Human Escalations</span>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card/60 hover:bg-card hover:border-white/20 transition-all text-muted-foreground hover:text-foreground cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Operations</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-instrument text-3xl md:text-4xl font-normal tracking-tight text-foreground">
                Human Escalations Workspace
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live WebSockets
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Live human-in-the-loop support desk with automated Pinecone learning integration.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchEscalations}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-inherit glass-button text-foreground font-semibold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
          <button
            onClick={() => router.push('/admin/escalations/analytics')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Knowledge Gap Intel</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <EscalationStatsDisplay stats={stats} isLoading={isLoading && !stats} />

      {/* Filters */}
      <EscalationFilters
        status={status}
        urgency={urgency}
        category={category}
        search={search}
        onStatusChange={setStatus}
        onUrgencyChange={setUrgency}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
        onReset={handleResetFilters}
      />

      {/* Sort & Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing <strong className="text-foreground">{escalations.length}</strong> of <strong className="text-foreground">{total}</strong> escalations
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card text-foreground text-xs font-medium cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="urgency">By Urgency</option>
          <option value="confidence">Lowest Confidence</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Escalation List */}
      <EscalationList
        escalations={escalations}
        onEscalationClick={handleEscalationClick}
        selectedId={selectedEscalation?.id}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEscalation && (
        <EscalationDetail
          escalation={selectedEscalation}
          onResolve={handleResolve}
          onAssign={handleAssign}
          onStart={handleStart}
          onReject={handleReject}
          onClose={() => setSelectedEscalation(null)}
          isLoading={isDetailLoading}
        />
      )}
    </div>
  );
}
