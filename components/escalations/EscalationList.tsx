'use client';

import { Escalation } from '@/types/escalation';
import { 
  FileText, 
  Sparkles, 
  User, 
  Tag, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Inbox
} from 'lucide-react';

interface EscalationListProps {
  escalations: Escalation[];
  onEscalationClick: (escalation: Escalation) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export default function EscalationList({
  escalations,
  onEscalationClick,
  selectedId,
  isLoading
}: EscalationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="rounded-xl p-4 border border-border bg-card/60 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-16 bg-muted rounded-full"></div>
              <div className="h-4 w-20 bg-muted rounded-full"></div>
            </div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (escalations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground glass-panel rounded-xl border border-border bg-card/40">
        <Inbox className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">No escalations in queue</p>
        <p className="text-xs text-muted-foreground mt-0.5">All customer queries have been addressed or automated.</p>
      </div>
    );
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'high':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-muted-foreground bg-white/5 border-border';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', class: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'assigned':
        return { label: 'Assigned', class: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      case 'in_progress':
        return { label: 'In Progress', class: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      case 'resolved':
        return { label: 'Resolved', class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'rejected':
        return { label: 'Rejected', class: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
      default:
        return { label: status, class: 'text-muted-foreground bg-white/5 border-border' };
    }
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="space-y-2.5">
      {escalations.map(escalation => {
        const urgencyClass = getUrgencyBadge(escalation.urgency);
        const status = getStatusBadge(escalation.status);
        const isSelected = selectedId === escalation.id;

        return (
          <div
            key={escalation.id}
            onClick={() => onEscalationClick(escalation)}
            className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
              isSelected 
                ? 'border-indigo-500/50 bg-indigo-500/10 shadow-sm shadow-indigo-500/10' 
                : 'border-border bg-card/60 hover:bg-card hover:border-white/20'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${urgencyClass}`}>
                  {escalation.urgency}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${status.class}`}>
                  {status.label}
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                {formatTime(escalation.createdAt)}
              </span>
            </div>

            {/* Question */}
            <p className="text-sm font-medium text-foreground line-clamp-2 mb-2.5 leading-snug">
              {escalation.userQuestion}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1 text-indigo-400">
                <Sparkles className="w-3 h-3" />
                {Math.round(escalation.confidenceScore * 100)}% conf
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {escalation.sourcesFound.length} docs
              </span>
              {escalation.category && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Tag className="w-3 h-3" />
                  {escalation.category}
                </span>
              )}
              {escalation.assignedTo && (
                <span className="flex items-center gap-1 text-blue-400">
                  <User className="w-3 h-3" />
                  {escalation.assignedTo}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
