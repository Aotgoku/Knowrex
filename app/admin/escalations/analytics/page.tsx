'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EscalationStats } from '@/types/escalation';

interface KBStats {
  totalFAQs: number;
  byCategory: Record<string, number>;
  recentlyAdded: number;
}

export default function AnalyticsPage() {
  const [escalationStats, setEscalationStats] = useState<EscalationStats | null>(null);
  const [kbStats, setKBStats] = useState<KBStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/escalations/stats');
        const data = await response.json();

        if (data.success) {
          setEscalationStats(data.stats.escalations);
          setKBStats(data.stats.kb);
        } else {
          setError(data.error || 'Failed to fetch stats');
        }
      } catch (err) {
        setError('Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const stats = escalationStats;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Escalation Analytics</h1>
          <p className="text-gray-500">Performance metrics and knowledge base growth</p>
        </div>
        <Link
          href="/admin/escalations"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
        >
          ← Back to Escalations
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Escalations</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Resolution Rate</p>
              <p className="text-3xl font-bold text-green-700">
                {stats?.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-blue-700">
                {stats?.avgResolutionTimeHours.toFixed(1) || 0}h
              </p>
            </div>
            <div className="text-4xl">⏱️</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">User Satisfaction</p>
              <p className="text-3xl font-bold text-purple-700">
                {Math.round((stats?.userSatisfactionRate || 0) * 100)}%
              </p>
            </div>
            <div className="text-4xl">😊</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Pending', value: stats?.pending || 0, color: 'bg-gray-400' },
              { label: 'Assigned', value: stats?.assigned || 0, color: 'bg-blue-400' },
              { label: 'In Progress', value: stats?.inProgress || 0, color: 'bg-yellow-400' },
              { label: 'Resolved', value: stats?.resolved || 0, color: 'bg-green-400' },
              { label: 'Rejected', value: stats?.rejected || 0, color: 'bg-red-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">{item.label}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{
                      width: `${stats?.total ? (item.value / stats.total) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="w-10 text-sm font-medium text-right">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Urgency Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600">
                {stats?.byUrgency.critical || 0}
              </div>
              <div className="text-sm text-red-600">Critical</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-orange-600">
                {stats?.byUrgency.high || 0}
              </div>
              <div className="text-sm text-orange-600">High</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {stats?.byUrgency.medium || 0}
              </div>
              <div className="text-sm text-yellow-600">Medium</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats?.byUrgency.low || 0}
              </div>
              <div className="text-sm text-green-600">Low</div>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Base Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Knowledge Base Growth</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            +{kbStats?.recentlyAdded || 0} this week
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KB Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="text-4xl font-bold text-blue-700">
              {kbStats?.totalFAQs || 0}
            </div>
            <div className="text-sm text-blue-600">Total FAQs Created</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="text-4xl font-bold text-green-700">
              {stats?.addedToKBCount || 0}
            </div>
            <div className="text-sm text-green-600">Escalations → KB</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4">
            <div className="text-4xl font-bold text-purple-700">
              {Object.keys(kbStats?.byCategory || {}).length}
            </div>
            <div className="text-sm text-purple-600">Categories</div>
          </div>
        </div>

        {/* Categories */}
        {kbStats && Object.keys(kbStats.byCategory).length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">FAQs by Category</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(kbStats.byCategory).map(([cat, count]) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {cat}: {count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-2">
              {stats?.recentTrend === 'increasing' ? '📈' :
               stats?.recentTrend === 'decreasing' ? '📉' : '➡️'}
            </div>
            <div className="font-medium text-gray-900">Escalation Trend</div>
            <div className="text-sm text-gray-500 capitalize">{stats?.recentTrend || 'stable'}</div>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-2">
              {(stats?.userSatisfactionRate || 0) >= 0.8 ? '🌟' :
               (stats?.userSatisfactionRate || 0) >= 0.6 ? '👍' : '⚠️'}
            </div>
            <div className="font-medium text-gray-900">User Sentiment</div>
            <div className="text-sm text-gray-500">
              {(stats?.userSatisfactionRate || 0) >= 0.8 ? 'Excellent' :
               (stats?.userSatisfactionRate || 0) >= 0.6 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-2">
              {(stats?.avgResolutionTimeHours || 24) <= 4 ? '⚡' :
               (stats?.avgResolutionTimeHours || 24) <= 24 ? '🕐' : '🐢'}
            </div>
            <div className="font-medium text-gray-900">Response Speed</div>
            <div className="text-sm text-gray-500">
              {(stats?.avgResolutionTimeHours || 24) <= 4 ? 'Fast' :
               (stats?.avgResolutionTimeHours || 24) <= 24 ? 'Normal' : 'Slow'}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-4">💡 Recommendations</h3>
        <ul className="space-y-2 text-blue-100">
          {(stats?.pending || 0) > 5 && (
            <li>• {stats?.pending} escalations pending - consider assigning more resources</li>
          )}
          {(stats?.avgResolutionTimeHours || 0) > 24 && (
            <li>• Resolution time is high - look for ways to speed up responses</li>
          )}
          {(stats?.addedToKBCount || 0) < (stats?.resolved || 0) * 0.5 && (
            <li>• Low KB integration rate - encourage adding resolved answers to knowledge base</li>
          )}
          {(stats?.byUrgency?.critical || 0) > 0 && (
            <li>• {stats?.byUrgency.critical} critical escalations need immediate attention</li>
          )}
          {(stats?.total || 0) === 0 && (
            <li>• No escalations yet - your AI is performing well! 🎉</li>
          )}
        </ul>
      </div>
    </div>
  );
}
