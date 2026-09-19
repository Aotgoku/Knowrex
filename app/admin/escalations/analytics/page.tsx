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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Escalation & Knowledge Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Operational telemetry, human resolution performance, and autonomous knowledge discovery
          </p>
        </div>
        <Link
          href="/admin/escalations"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-50 dark:hover:bg-slate-900 text-foreground font-semibold text-xs transition-colors shadow-xs"
        >
          ← Back to Escalation Desk
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card glow-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Escalations</p>
              <p className="text-3xl font-black text-foreground mt-1">{stats?.total || 0}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="glass-card glow-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Resolution Rate</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats?.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="glass-card glow-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Avg Resolution</p>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {stats?.avgResolutionTimeHours.toFixed(1) || 0}h
              </p>
            </div>
            <div className="text-3xl">⏱️</div>
          </div>
        </div>

        <div className="glass-card glow-card p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">User Satisfaction</p>
              <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {Math.round((stats?.userSatisfactionRate || 0) * 100)}%
              </p>
            </div>
            <div className="text-3xl">😊</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-foreground mb-4">Status Distribution</h3>
          <div className="space-y-4">
            {[
              { label: 'Pending', value: stats?.pending || 0, color: 'bg-amber-500' },
              { label: 'Assigned', value: stats?.assigned || 0, color: 'bg-blue-500' },
              { label: 'In Progress', value: stats?.inProgress || 0, color: 'bg-indigo-500' },
              { label: 'Resolved', value: stats?.resolved || 0, color: 'bg-emerald-500' },
              { label: 'Rejected', value: stats?.rejected || 0, color: 'bg-rose-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-24 text-xs font-medium text-muted-foreground">{item.label}</div>
                <div className="flex-1 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{
                      width: `${stats?.total ? (item.value / stats.total) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="w-10 text-xs font-bold text-foreground text-right">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Breakdown */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-bold text-foreground mb-4">Urgency Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <div className="text-2xl font-black text-red-600 dark:text-red-400">
                {stats?.byUrgency.critical || 0}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mt-1">Critical</div>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
              <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
                {stats?.byUrgency.high || 0}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mt-1">High</div>
            </div>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center">
              <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">
                {stats?.byUrgency.medium || 0}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mt-1">Medium</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats?.byUrgency.low || 0}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-1">Low</div>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Base Section */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">Knowledge Base Growth</h3>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">
            +{kbStats?.recentlyAdded || 0} this week
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {kbStats?.totalFAQs || 0}
            </div>
            <div className="text-xs font-medium text-muted-foreground mt-1">Total FAQs Created</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stats?.addedToKBCount || 0}
            </div>
            <div className="text-xs font-medium text-muted-foreground mt-1">Escalations → KB Promoted</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
              {Object.keys(kbStats?.byCategory || {}).length}
            </div>
            <div className="text-xs font-medium text-muted-foreground mt-1">Active Categories</div>
          </div>
        </div>

        {/* Categories */}
        {kbStats && Object.keys(kbStats.byCategory).length > 0 && (
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">FAQs by Category</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(kbStats.byCategory).map(([cat, count]) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-foreground border border-slate-200 dark:border-slate-700"
                >
                  {cat}: {count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Autonomous Knowledge Gap Detection & Auto-Doc Generator */}
      <div className="glass-card p-6 rounded-2xl border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-foreground text-lg">Autonomous Knowledge Gap Detection</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                Self-Healing Loop
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              AI clusters repeated customer inquiries with no current document coverage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
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
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isIndexed 
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/70 dark:border-slate-800/70 hover:border-indigo-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-card border border-slate-200 dark:border-slate-800 text-foreground">
                      {gap.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                        gap.urgency === 'critical' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20' :
                        gap.urgency === 'high' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20' :
                        'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {gap.urgency}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {gap.inquiryCount} Inquiries
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-foreground mb-2 leading-snug">
                    {gap.topic}
                  </h4>

                  {/* Sample Customer Inquiries */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Customer Inquiries:</p>
                    <ul className="space-y-1">
                      {gap.sampleQuestions.slice(0, 2).map((q, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground italic bg-card px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800/50 truncate">
                          &ldquo;{q}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  {isIndexed ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Indexed in Pinecone Cloud</span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Coverage: <strong className="text-red-500">0% (Missing Policy)</strong>
                    </div>
                  )}

                  {isIndexed ? (
                    <Link
                      href="/admin/documents"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20"
                    >
                      <FileText className="w-3.5 h-3.5" /> View in Docs
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleGenerateDoc(gap)}
                      disabled={isGenerating || generatingGapId !== null}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>Auto-Draft to Pinecone</span>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 shadow-2xl">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-foreground text-base">Policy Synthesized & Indexed</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ {generatedDocModal.chunksIndexed} chunks successfully embedded into Pinecone Cloud
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setGeneratedDocModal(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4">
              <div className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/30 text-xs text-muted-foreground space-y-1">
                <div className="font-bold text-foreground mb-1">Generated Document Details:</div>
                <div>Filename: <code className="text-indigo-600 dark:text-indigo-400 font-mono">{generatedDocModal.filename}</code></div>
                <div>Destination: <strong className="text-emerald-600 dark:text-emerald-400">Pinecone Serverless Index (knowrex-index)</strong></div>
                <div>Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Live for Customer RAG Inquiries</span></div>
              </div>

              <div>
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">Synthesized Policy Preview:</h4>
                <div className="bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed custom-scrollbar border border-slate-800">
                  {generatedDocModal.fullContent}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <Link
                href="/admin/documents"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View in Document Management</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setGeneratedDocModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="glass-panel rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-slate-900/20">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <span>💡 AI Operational Recommendations</span>
        </h3>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {(stats?.pending || 0) > 5 && (
            <li>• <strong className="text-foreground">{stats?.pending} escalations</strong> pending in queue - recommend assigning additional support agents.</li>
          )}
          {(stats?.avgResolutionTimeHours || 0) > 24 && (
            <li>• Resolution time is currently elevated - consider standardizing quick macro responses.</li>
          )}
          {(stats?.addedToKBCount || 0) < (stats?.resolved || 0) * 0.5 && (
            <li>• Low KB promotion rate - enable "Save answer to Knowledge Base" on resolved escalations to train Pinecone.</li>
          )}
          {(stats?.byUrgency?.critical || 0) > 0 && (
            <li>• <strong className="text-red-500">{stats?.byUrgency.critical} critical escalations</strong> require immediate human intervention.</li>
          )}
          {(stats?.total || 0) === 0 && (
            <li>• All customer questions currently answered autonomously by Pinecone RAG! 🎉</li>
          )}
        </ul>
      </div>
    </div>
  );
}
