'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  HelpCircle, 
  Bot, 
  BarChart2, 
  FileText, 
  Zap, 
  Edit3, 
  XCircle, 
  X,
  Clock,
  UserCheck,
  Send
} from 'lucide-react';
import { Escalation, ESCALATION_CATEGORIES } from '@/types/escalation';

interface EscalationDetailProps {
  escalation: Escalation;
  onResolve: (data: ResolveData) => Promise<void>;
  onAssign: (assignedTo: string) => Promise<void>;
  onStart: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

interface ResolveData {
  humanAnswer: string;
  resolvedBy: string;
  resolutionNotes?: string;
  addToKB: boolean;
  kbIntegrationType?: string;
  category?: string;
  tags?: string[];
}

export default function EscalationDetail({
  escalation,
  onResolve,
  onAssign,
  onStart,
  onReject,
  onClose,
  isLoading = false
}: EscalationDetailProps) {
  const [humanAnswer, setHumanAnswer] = useState('');
  const [resolvedBy, setResolvedBy] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [addToKB, setAddToKB] = useState(true);
  const [kbIntegrationType, setKbIntegrationType] = useState<string>('faq');
  const [category, setCategory] = useState(escalation.category || '');
  const [tags, setTags] = useState(escalation.tags?.join(', ') || '');
  const [assignTo, setAssignTo] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isGeneratingAiReply, setIsGeneratingAiReply] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [aiSourcesCount, setAiSourcesCount] = useState<number | null>(null);

  const handleAiSuggestReply = async () => {
    try {
      setIsGeneratingAiReply(true);
      const res = await fetch('/api/escalations/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: escalation.userQuestion,
          attemptedAnswer: escalation.attemptedAnswer,
          triggerReason: escalation.reason,
          urgency: escalation.urgency
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to auto-draft resolution');
      }

      setHumanAnswer(data.suggestedReply);
      setAiGenerated(true);
      setAiSourcesCount(data.sourcesUsed || null);
    } catch (err: any) {
      alert(err.message || 'Error drafting AI reply');
    } finally {
      setIsGeneratingAiReply(false);
    }
  };

  const handleResolve = async () => {
    if (!humanAnswer.trim()) {
      alert('Please provide an answer');
      return;
    }
    if (!resolvedBy.trim()) {
      alert('Please enter your name');
      return;
    }

    await onResolve({
      humanAnswer: humanAnswer.trim(),
      resolvedBy: resolvedBy.trim(),
      resolutionNotes: resolutionNotes.trim() || undefined,
      addToKB,
      kbIntegrationType: addToKB ? kbIntegrationType : undefined,
      category: category || undefined,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined
    });
  };

  const handleAssign = async () => {
    if (!assignTo.trim()) {
      alert('Please enter a name to assign to');
      return;
    }
    await onAssign(assignTo.trim());
    setAssignTo('');
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    await onReject(rejectReason.trim());
    setShowRejectModal(false);
  };

  const canResolve = escalation.status !== 'resolved' && escalation.status !== 'rejected';

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'low': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default: return 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 border-zinc-200 dark:border-white/10';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#0c0d12] border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/80 dark:bg-neutral-900/40">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${getUrgencyBadge(escalation.urgency)}`}>
                  {escalation.urgency}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">
                  {escalation.status.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  ID: {escalation.id.substring(0, 8)}...
                </span>
              </div>
              <h2 className="text-lg font-instrument font-semibold text-zinc-900 dark:text-white">
                Escalation Incident Telemetry
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column - Question & Context */}
            <div className="space-y-4">
              {/* User Question */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-white/[0.03]">
                <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1.5 font-bold">
                  <HelpCircle className="w-3.5 h-3.5" />
                  User Query
                </h3>
                <p className="text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed">
                  {escalation.userQuestion}
                </p>
              </div>

              {/* AI Attempted Answer */}
              {escalation.attemptedAnswer && (
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-500/5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1.5 font-bold">
                    <Bot className="w-3.5 h-3.5" />
                    AI Attempted Answer
                  </h3>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {escalation.attemptedAnswer}
                  </p>
                </div>
              )}

              {/* Confidence Metrics */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-white/[0.03]">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3 flex items-center gap-1.5 font-bold">
                  <BarChart2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  Retrieval Confidence
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Confidence</span>
                    <div className="font-bold text-base text-zinc-900 dark:text-white mt-0.5">
                      {Math.round(escalation.confidenceScore * 100)}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Top Vector Score</span>
                    <div className="font-bold text-base text-zinc-900 dark:text-white mt-0.5">
                      {Math.round(escalation.topMatchScore * 100)}%
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Docs Scanned</span>
                    <div className="font-bold text-base text-zinc-900 dark:text-white mt-0.5">{escalation.documentsSearched}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Sources Matched</span>
                    <div className="font-bold text-base text-zinc-900 dark:text-white mt-0.5">{escalation.sourcesFound.length}</div>
                  </div>
                </div>
              </div>

              {/* Sources Found */}
              {escalation.sourcesFound.length > 0 && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-white/[0.03]">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3 flex items-center gap-1.5 font-bold">
                    <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                    Referenced Sources
                  </h3>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {escalation.sourcesFound.map((source, idx) => (
                      <div key={idx} className="text-xs p-2.5 bg-white dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/10">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
                          <span className="truncate">{source.documentName}</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 text-[10px] shrink-0 ml-2 font-bold">
                            {Math.round(source.score * 100)}%
                          </span>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[11px] mt-1 line-clamp-2">
                          {source.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 space-y-1 px-1">
                <div>Trigger Reason: <span className="text-zinc-800 dark:text-zinc-200 font-medium">{escalation.reason.replace('_', ' ')}</span></div>
                {escalation.assignedTo && (
                  <div>Assigned To: <span className="text-blue-600 dark:text-blue-400 font-medium">{escalation.assignedTo}</span></div>
                )}
                {escalation.resolvedBy && (
                  <div>Resolved By: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{escalation.resolvedBy}</span></div>
                )}
              </div>
            </div>

            {/* Right Column - Actions & Response */}
            <div className="space-y-4">
              {/* Quick Actions */}
              {canResolve && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-white/[0.03]">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3 flex items-center gap-1.5 font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Desk Dispatch
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {escalation.status === 'pending' && (
                      <>
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            value={assignTo}
                            onChange={(e) => setAssignTo(e.target.value)}
                            placeholder="Assign agent name..."
                            className="flex-1 px-3 py-1.5 bg-white dark:bg-black/30 border border-zinc-300 dark:border-white/15 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <button
                            onClick={handleAssign}
                            disabled={isLoading}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50 cursor-pointer transition-colors"
                          >
                            Assign
                          </button>
                        </div>
                        <button
                          onClick={onStart}
                          disabled={isLoading}
                          className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                        >
                          Start Working
                        </button>
                      </>
                    )}
                    {escalation.status === 'assigned' && (
                      <button
                        onClick={onStart}
                        disabled={isLoading}
                        className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                      >
                        Start Working
                      </button>
                    )}
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Human Answer Form */}
              {canResolve && (
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-white/[0.03]">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5 font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    Expert Resolution
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Agent Name *</label>
                      <input
                        type="text"
                        value={resolvedBy}
                        onChange={(e) => setResolvedBy(e.target.value)}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-3 py-1.5 bg-white dark:bg-black/30 border border-zinc-300 dark:border-white/15 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-mono text-zinc-600 dark:text-zinc-400 font-medium">Verified Answer *</label>
                        <button
                          type="button"
                          onClick={handleAiSuggestReply}
                          disabled={isGeneratingAiReply || isLoading}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 rounded-full transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isGeneratingAiReply ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Drafting...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3" />
                              <span>AI Suggest Reply</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        value={humanAnswer}
                        onChange={(e) => {
                          setHumanAnswer(e.target.value);
                          if (aiGenerated) setAiGenerated(false);
                        }}
                        placeholder="Provide verified resolution..."
                        rows={5}
                        className="w-full px-3 py-2 bg-white dark:bg-black/30 border border-zinc-300 dark:border-white/15 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-zinc-300 dark:border-white/15 rounded-xl text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="">Select...</option>
                          {ESCALATION_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-600 dark:text-zinc-400 mb-1 font-medium">Tags</label>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="billing, refund"
                          className="w-full px-3 py-1.5 bg-white dark:bg-black/30 border border-zinc-300 dark:border-white/15 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Pinecone KB Integration */}
                    <div className="border-t border-zinc-200 dark:border-white/10 pt-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-zinc-800 dark:text-zinc-200">
                        <input
                          type="checkbox"
                          checked={addToKB}
                          onChange={(e) => setAddToKB(e.target.checked)}
                          className="rounded border-zinc-300 accent-indigo-600"
                        />
                        <span>Sync verified answer back into Pinecone vector index</span>
                      </label>
                    </div>

                    <button
                      onClick={handleResolve}
                      disabled={isLoading || !humanAnswer.trim() || !resolvedBy.trim()}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isLoading ? 'Resolving Incident...' : 'Resolve & Update Knowledge Base'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Already Resolved State */}
              {escalation.status === 'resolved' && (
                <div className="space-y-4">
                  {/* Verified Solution Card */}
                  <div className="p-4 sm:p-5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-500/10 shadow-sm">
                    <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Verified Solution
                      </h3>
                      {escalation.resolvedBy && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                          Resolved by: {escalation.resolvedBy}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed whitespace-pre-wrap font-medium">
                      {escalation.humanAnswer || 'Resolution was finalized and logged by human support desk.'}
                    </p>
                    {escalation.resolutionNotes && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-200 dark:border-emerald-500/20 text-xs">
                        <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[10px] uppercase tracking-wider block mb-1">Internal Notes:</span>
                        <p className="text-zinc-800 dark:text-zinc-200 text-xs">{escalation.resolutionNotes}</p>
                      </div>
                    )}
                    {escalation.category && (
                      <div className="mt-3 pt-2.5 border-t border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2 text-[11px] font-mono text-emerald-800 dark:text-emerald-300">
                        <span>Category:</span>
                        <span className="font-semibold">{escalation.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Incident Lifecycle & Dispatch Status */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-white/[0.03]">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-3 flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Resolution Lifecycle & Dispatch
                    </h3>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                        <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">Lifecycle Status</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                          RESOLVED & VERIFIED
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                        <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">Vector Store Sync</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          {escalation.addedToKB ? 'Grounded in Pinecone Vector DB' : 'Direct Support Dispatch'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                        <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">Incident Urgency</span>
                        <span className="font-mono text-[11px] uppercase font-bold text-zinc-700 dark:text-zinc-300">
                          {escalation.urgency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 border-b border-zinc-200/60 dark:border-white/5">
                        <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">Database Audit Trail</span>
                        <span className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                          PostgreSQL + Redis Cache
                        </span>
                      </div>
                      {escalation.tags && escalation.tags.length > 0 && (
                        <div className="pt-1">
                          <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px] block mb-1.5">Tagged Keywords:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {escalation.tags.map((t, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-200/70 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-white/10">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Rejected */}
              {escalation.status === 'rejected' && (
                <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-500/20 bg-rose-50/80 dark:bg-rose-500/5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1.5 font-bold">
                    <XCircle className="w-3.5 h-3.5" />
                    Incident Rejected
                  </h3>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">{escalation.resolutionNotes || 'No reason provided.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/70 dark:bg-black/85 flex items-center justify-center z-60 p-4">
            <div className="bg-white dark:bg-neutral-950 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl p-5 w-full max-w-md shadow-2xl">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Reject Escalation</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows={3}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-black/30 border border-zinc-300 dark:border-white/15 rounded-xl text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-rose-500 mb-3 resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-white/15 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition-colors"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

