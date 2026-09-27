'use client';

import { EscalationStats as Stats } from '@/types/escalation';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles
} from 'lucide-react';

interface EscalationStatsProps {
  stats: Stats | null;
  isLoading?: boolean;
}

export default function EscalationStatsDisplay({ stats, isLoading }: EscalationStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-xl p-4 sm:p-5 border border-border bg-card/60 animate-pulse">
            <div className="h-3 bg-muted rounded w-1/3 mb-3"></div>
            <div className="h-7 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs sm:text-sm font-medium">
        No active escalation telemetry recorded yet.
      </div>
    );
  }

  const renderTrendBadge = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            <TrendingUp className="w-3 h-3" /> Volume Rising
          </span>
        );
      case 'decreasing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <TrendingDown className="w-3 h-3" /> Easing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-border">
            <Minus className="w-3 h-3" /> Steady
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Escalations */}
        <div className="glass-card glow-card p-4 sm:p-5 rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Total In Queue</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {stats.total}
          </div>
          <div className="mt-2 flex items-center justify-between">
            {renderTrendBadge(stats.recentTrend)}
          </div>
        </div>

        {/* Pending */}
        <div className="glass-card glow-card p-4 sm:p-5 rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Pending Attention</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-amber-400">
            {stats.pending}
          </div>
          <div className="mt-2 text-[11px] font-mono text-muted-foreground">
            {stats.assigned} currently assigned
          </div>
        </div>

        {/* Resolved */}
        <div className="glass-card glow-card p-4 sm:p-5 rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Resolved Cleanly</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400">
            {stats.resolved}
          </div>
          <div className="mt-2 text-[11px] font-mono text-muted-foreground">
            {stats.addedToKBCount} synced to Pinecone
          </div>
        </div>

        {/* Avg Resolution */}
        <div className="glass-card glow-card p-4 sm:p-5 rounded-xl border border-border bg-card/60">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Avg Triage Time</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {stats.avgResolutionTimeHours.toFixed(1)}h
          </div>
          <div className="mt-2 text-[11px] font-mono text-emerald-400">
            {Math.round(stats.userSatisfactionRate * 100)}% satisfaction
          </div>
        </div>
      </div>

      {/* Secondary Telemetry: Urgency & Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Urgency Distribution */}
        <div className="glass-panel p-4 sm:p-5 rounded-xl border border-border bg-card/60">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Triage by Urgency</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-lg bg-white/5 border border-border">
              <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Critical
              </div>
              <div className="font-mono text-lg font-bold text-foreground">{stats.byUrgency.critical}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-border">
              <div className="flex items-center gap-1.5 text-[11px] text-orange-400 font-medium mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                High
              </div>
              <div className="font-mono text-lg font-bold text-foreground">{stats.byUrgency.high}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-border">
              <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Medium
              </div>
              <div className="font-mono text-lg font-bold text-foreground">{stats.byUrgency.medium}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white/5 border border-border">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Low
              </div>
              <div className="font-mono text-lg font-bold text-foreground">{stats.byUrgency.low}</div>
            </div>
          </div>
        </div>

        {/* Status Breakdown Bar */}
        <div className="glass-panel p-4 sm:p-5 rounded-xl border border-border bg-card/60 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Pipeline Status Flow</h3>
            <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white/5">
              {stats.pending > 0 && (
                <div
                  className="bg-amber-400 transition-all"
                  style={{ width: `${(stats.pending / (stats.total || 1)) * 100}%` }}
                  title={`Pending: ${stats.pending}`}
                />
              )}
              {stats.assigned > 0 && (
                <div
                  className="bg-blue-400 transition-all"
                  style={{ width: `${(stats.assigned / (stats.total || 1)) * 100}%` }}
                  title={`Assigned: ${stats.assigned}`}
                />
              )}
              {stats.inProgress > 0 && (
                <div
                  className="bg-purple-400 transition-all"
                  style={{ width: `${(stats.inProgress / (stats.total || 1)) * 100}%` }}
                  title={`In Progress: ${stats.inProgress}`}
                />
              )}
              {stats.resolved > 0 && (
                <div
                  className="bg-emerald-400 transition-all"
                  style={{ width: `${(stats.resolved / (stats.total || 1)) * 100}%` }}
                  title={`Resolved: ${stats.resolved}`}
                />
              )}
              {stats.rejected > 0 && (
                <div
                  className="bg-rose-400 transition-all"
                  style={{ width: `${(stats.rejected / (stats.total || 1)) * 100}%` }}
                  title={`Rejected: ${stats.rejected}`}
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Pending ({stats.pending})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> Assigned ({stats.assigned})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> In Progress ({stats.inProgress})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Resolved ({stats.resolved})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
