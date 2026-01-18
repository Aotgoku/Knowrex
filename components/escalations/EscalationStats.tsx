'use client';

import { EscalationStats as Stats } from '@/types/escalation';

interface EscalationStatsProps {
  stats: Stats | null;
  isLoading?: boolean;
}

export default function EscalationStatsDisplay({ stats, isLoading }: EscalationStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
        No statistics available yet
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-red-600';
      case 'decreasing': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Total Escalations</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className={`text-xs ${getTrendColor(stats.recentTrend)} mt-1`}>
            {getTrendIcon(stats.recentTrend)} {stats.recentTrend}
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200">
          <div className="text-sm text-yellow-600 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.assigned} assigned
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
          <div className="text-sm text-green-600 mb-1">Resolved</div>
          <div className="text-3xl font-bold text-green-700">{stats.resolved}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.addedToKBCount} added to KB
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
          <div className="text-sm text-blue-600 mb-1">Avg Resolution</div>
          <div className="text-3xl font-bold text-blue-700">
            {stats.avgResolutionTimeHours.toFixed(1)}h
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(stats.userSatisfactionRate * 100)}% satisfied
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* By Urgency */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-700 mb-3">By Urgency</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Critical
              </span>
              <span className="font-medium">{stats.byUrgency.critical}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                High
              </span>
              <span className="font-medium">{stats.byUrgency.high}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                Medium
              </span>
              <span className="font-medium">{stats.byUrgency.medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Low
              </span>
              <span className="font-medium">{stats.byUrgency.low}</span>
            </div>
          </div>
        </div>

        {/* By Category */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-700 mb-3">By Category</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(stats.byCategory)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{category}</span>
                  <span className="font-medium text-sm">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-gray-700 mb-3">Status Breakdown</h3>
        <div className="flex gap-1 h-4 rounded overflow-hidden">
          {stats.pending > 0 && (
            <div
              className="bg-gray-400"
              style={{ width: `${(stats.pending / stats.total) * 100}%` }}
              title={`Pending: ${stats.pending}`}
            />
          )}
          {stats.assigned > 0 && (
            <div
              className="bg-blue-400"
              style={{ width: `${(stats.assigned / stats.total) * 100}%` }}
              title={`Assigned: ${stats.assigned}`}
            />
          )}
          {stats.inProgress > 0 && (
            <div
              className="bg-yellow-400"
              style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
              title={`In Progress: ${stats.inProgress}`}
            />
          )}
          {stats.resolved > 0 && (
            <div
              className="bg-green-400"
              style={{ width: `${(stats.resolved / stats.total) * 100}%` }}
              title={`Resolved: ${stats.resolved}`}
            />
          )}
          {stats.rejected > 0 && (
            <div
              className="bg-red-400"
              style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
              title={`Rejected: ${stats.rejected}`}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded"></span> Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded"></span> Assigned
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded"></span> In Progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded"></span> Resolved
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-400 rounded"></span> Rejected
          </span>
        </div>
      </div>
    </div>
  );
}
