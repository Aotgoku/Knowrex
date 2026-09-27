'use client';

import { ESCALATION_CATEGORIES } from '@/types/escalation';
import { Search, RotateCcw, Filter } from 'lucide-react';

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
  const hasFilters = Boolean(status || urgency || category || search);

  return (
    <div className="glass-panel p-3.5 sm:p-4 rounded-xl border border-border bg-card/60">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[220px] relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search questions or ticket summaries..."
            className="w-full pl-9 pr-3 py-2 bg-black/20 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="w-36">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="" className="bg-neutral-900 text-foreground">All Statuses</option>
            <option value="pending" className="bg-neutral-900 text-foreground">Pending</option>
            <option value="assigned" className="bg-neutral-900 text-foreground">Assigned</option>
            <option value="in_progress" className="bg-neutral-900 text-foreground">In Progress</option>
            <option value="resolved" className="bg-neutral-900 text-foreground">Resolved</option>
            <option value="rejected" className="bg-neutral-900 text-foreground">Rejected</option>
          </select>
        </div>

        {/* Urgency Filter */}
        <div className="w-32">
          <select
            value={urgency}
            onChange={(e) => onUrgencyChange(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="" className="bg-neutral-900 text-foreground">All Urgencies</option>
            <option value="critical" className="bg-neutral-900 text-foreground">Critical</option>
            <option value="high" className="bg-neutral-900 text-foreground">High</option>
            <option value="medium" className="bg-neutral-900 text-foreground">Medium</option>
            <option value="low" className="bg-neutral-900 text-foreground">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="w-40">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="" className="bg-neutral-900 text-foreground">All Categories</option>
            {ESCALATION_CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-neutral-900 text-foreground">{cat}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-muted-foreground hover:text-foreground border border-border bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
