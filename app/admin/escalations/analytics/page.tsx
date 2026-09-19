'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  FileText, 
  Database,
  BrainCircuit,
  ArrowUpRight
} from 'lucide-react';
import { EscalationStats } from '@/types/escalation';
import { KnowledgeGapItem } from '@/app/api/analytics/knowledge-gaps/route';

interface KBStats {
  totalFAQs: number;
  byCategory: Record<string, number>;
  recentlyAdded: number;
}

export default function AnalyticsPage() {
  const [escalationStats, setEscalationStats] = useState<EscalationStats | null>(null);
  const [kbStats, setKBStats] = useState<KBStats | null>(null);
  const [gaps, setGaps] = useState<KnowledgeGapItem[]>([]);
  const [generatingGapId, setGeneratingGapId] = useState<string | null>(null);
  const [generatedDocModal, setGeneratedDocModal] = useState<{
    topic: string;
    filename: string;
    chunksIndexed: number;
    fullContent: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const [statsRes, gapsRes] = await Promise.all([
          fetch('/api/escalations/stats'),
          fetch('/api/analytics/knowledge-gaps')
        ]);
        
        const statsData = await statsRes.json();
        const gapsData = await gapsRes.json();

        if (statsData.success) {
          setEscalationStats(statsData.stats.escalations);
          setKBStats(statsData.stats.kb);
        }
        if (gapsData.success) {
          setGaps(gapsData.gaps || []);
        }
      } catch (err) {
        setError('Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleGenerateDoc = async (gap: KnowledgeGapItem) => {
    try {
      setGeneratingGapId(gap.id);
      const res = await fetch('/api/analytics/knowledge-gaps/generate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: gap.topic,
          category: gap.category,
          sampleQuestions: gap.sampleQuestions
        })
      });

      const data = await res.json();
      if (data.success) {
        // Mark gap as indexed
        setGaps(prev => prev.map(g => g.id === gap.id ? { ...g, status: 'indexed', docId: data.docId } : g));
        setGeneratedDocModal({
          topic: gap.topic,
          filename: data.filename,
          chunksIndexed: data.chunksIndexed,
          fullContent: data.fullContent
        });
      } else {
        alert(data.error || 'Failed to generate document');
      }
    } catch (err) {
      console.error('Error generating doc:', err);
      alert('Failed to connect to document generation service');
    } finally {
      setGeneratingGapId(null);
    }
  };

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

      {/* ============================================
          Autonomous Knowledge Gap Detection & Auto-Doc Generator
          Enterprise Self-Healing Knowledge Loop
          ============================================ */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-gray-900 text-lg">Autonomous Knowledge Gap Detection</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Self-Healing AI Loop
              </span>
            </div>
            <p className="text-sm text-gray-500">
              AI clusters repeated customer escalations & low-confidence inquiries with no documentation coverage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{gaps.filter(g => g.status === 'missing').length} Missing Policies Detected</span>
            </span>
          </div>
        </div>

        {/* Gaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gaps.map((gap) => {
            const isGenerating = generatingGapId === gap.id;
            const isIndexed = gap.status === 'indexed';

            return (
              <div 
                key={gap.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isIndexed 
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-gray-50/70 hover:bg-gray-50 border-gray-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700">
                      {gap.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase ${
                        gap.urgency === 'critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                        gap.urgency === 'high' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {gap.urgency} Priority
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {gap.inquiryCount} Inquiries
                      </span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2 leading-snug">
                    {gap.topic}
                  </h4>

                  {/* Sample Customer Inquiries */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">Unaddressed Customer Inquiries:</p>
                    <ul className="space-y-1">
                      {gap.sampleQuestions.slice(0, 2).map((q, idx) => (
                        <li key={idx} className="text-xs text-gray-600 italic bg-white/70 px-2 py-1 rounded border border-gray-100 truncate">
                          &ldquo;{q}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-gray-200/80 flex items-center justify-between">
                  {isIndexed ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Indexed in Pinecone Cloud</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Coverage: <strong className="text-red-600">0% (Missing Policy)</strong>
                    </div>
                  )}

                  {isIndexed ? (
                    <Link
                      href="/admin/documents"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> View in Docs
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleGenerateDoc(gap)}
                      disabled={isGenerating || generatingGapId !== null}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                      title="Synthesize documentation with Gemini and vectorize into Pinecone"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Synthesizing & Vectorizing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>✨ Auto-Draft & Index to Pinecone</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Document Success Modal */}
      {generatedDocModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Policy Synthesized & Indexed</h3>
                  <p className="text-xs text-emerald-700 font-medium">
                    ✓ {generatedDocModal.chunksIndexed} chunks successfully embedded into Pinecone Cloud Vector Store
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setGeneratedDocModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs text-gray-600">
                <div className="font-semibold text-gray-800 mb-1">Generated Document Details:</div>
                <div>Filename: <code className="text-indigo-600">{generatedDocModal.filename}</code></div>
                <div>Destination: <strong className="text-emerald-700">Pinecone Serverless Index (knowrex-index)</strong></div>
                <div>Status: <span className="text-emerald-700 font-semibold">Active for Customer RAG Queries</span></div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 text-xs uppercase tracking-wider mb-2">Synthesized Policy Preview:</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed custom-scrollbar">
                  {generatedDocModal.fullContent}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <Link
                href="/admin/documents"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View in Document Management</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setGeneratedDocModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

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
