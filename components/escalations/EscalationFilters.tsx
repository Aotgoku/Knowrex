'use client';

import { EscalationStatus, EscalationUrgency, ESCALATION_CATEGORIES } from '@/types/escalation';

interface EscalationFiltersProps {
  status: string;
  urgency: string;
  category: string;
  search: string;
  onStatusChange: (status: string) => void;
  onUrgencyChange: (urgency: string) => void;
  onCategoryChange: (category: string) => void;
  onSearchChange: (search: string) => void;
  onReset: () => void;
}

export default function EscalationFilters({
  status,
  urgency,
  category,
  search,
  onStatusChange,
  onUrgencyChange,
  onCategoryChange,
  onSearchChange,
  onReset
}: EscalationFiltersProps) {
  const hasFilters = status || urgency || category || search;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-gray-500 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions..."
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="w-40">
          <label className="block text-xs text-gray-500 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="assigned">👤 Assigned</option>
            <option value="in_progress">🔄 In Progress</option>
            <option value="resolved">✅ Resolved</option>
            <option value="rejected">❌ Rejected</option>
          </select>
        </div>

        {/* Urgency Filter */}
        <div className="w-36">
          <label className="block text-xs text-gray-500 mb-1">Urgency</label>
          <select
            value={urgency}
            onChange={(e) => onUrgencyChange(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Urgencies</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="w-44">
          <label className="block text-xs text-gray-500 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {ESCALATION_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border rounded hover:bg-gray-50"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
