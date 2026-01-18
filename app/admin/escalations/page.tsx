'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Escalations</h1>
          <p className="text-gray-500">Manage questions that need human expertise</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchEscalations}
            className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => router.push('/admin/escalations/analytics')}
            className="px-4 py-2 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600 text-sm"
          >
            📊 Analytics
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
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Showing {escalations.length} of {total} escalations
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 border rounded text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="urgency">By Urgency</option>
          <option value="confidence">Lowest Confidence</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
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
