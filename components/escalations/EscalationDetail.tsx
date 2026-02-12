'use client';

import { useState } from 'react';
import { Escalation, EscalationStatus, EscalationUrgency, ESCALATION_CATEGORIES } from '@/types/escalation';

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

  const getUrgencyColor = (urgency: EscalationUrgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: EscalationStatus) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  const handleResolve = async () => {
    if (!humanAnswer.trim() || !resolvedBy.trim()) {
      alert('Please provide an answer and your name');
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-sm font-medium ${getUrgencyColor(escalation.urgency)}`}>
                  {escalation.urgency.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(escalation.status)}`}>
                  {escalation.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {escalation.id.substring(0, 8)}...
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Escalation Details</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Question & Context */}
            <div className="space-y-6">
              {/* User Question */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  ❓ User Question
                </h3>
                <p className="text-gray-900">{escalation.userQuestion}</p>
              </div>

              {/* AI Attempted Answer */}
              {escalation.attemptedAnswer && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                    🤖 AI Attempted Answer
                  </h3>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {escalation.attemptedAnswer}
                  </p>
                </div>
              )}

              {/* Metrics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-3">📊 Confidence Metrics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Confidence Score</span>
                    <div className="font-medium text-lg">
                      {Math.round(escalation.confidenceScore * 100)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Top Match Score</span>
                    <div className="font-medium text-lg">
                      {Math.round(escalation.topMatchScore * 100)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Documents Searched</span>
                    <div className="font-medium text-lg">{escalation.documentsSearched}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Sources Found</span>
                    <div className="font-medium text-lg">{escalation.sourcesFound.length}</div>
                  </div>
                </div>
              </div>

              {/* Sources Found */}
              {escalation.sourcesFound.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">📄 Sources Found</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {escalation.sourcesFound.map((source, idx) => (
                      <div key={idx} className="text-sm p-2 bg-white rounded border border-gray-200">
                        <div className="font-medium text-gray-700">
                          {source.documentName} ({Math.round(source.score * 100)}%)
                        </div>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                          {source.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-sm text-gray-500 space-y-1">
                <div>Escalation Reason: <span className="font-medium">{escalation.reason.replace('_', ' ')}</span></div>
                <div>Created: <span className="font-medium">{formatDate(escalation.createdAt)}</span></div>
                {escalation.assignedTo && (
                  <div>Assigned to: <span className="font-medium">{escalation.assignedTo}</span></div>
                )}
                {escalation.resolvedBy && (
                  <div>Resolved by: <span className="font-medium">{escalation.resolvedBy}</span></div>
                )}
              </div>
            </div>

            {/* Right Column - Actions & Response */}
            <div className="space-y-6">
              {/* Quick Actions */}
              {canResolve && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-3">⚡ Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    {escalation.status === 'pending' && (
                      <>
                        <div className="flex gap-2 w-full">
                          <input
                            type="text"
                            value={assignTo}
                            onChange={(e) => setAssignTo(e.target.value)}
                            placeholder="Assign to..."
                            className="flex-1 px-3 py-2 border rounded text-sm"
                          />
                          <button
                            onClick={handleAssign}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                          >
                            Assign
                          </button>
                        </div>
                        <button
                          onClick={onStart}
                          disabled={isLoading}
                          className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
                        >
                          Start Working
                        </button>
                      </>
                    )}
                    {escalation.status === 'assigned' && (
                      <button
                        onClick={onStart}
                        disabled={isLoading}
                        className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
                      >
                        Start Working
                      </button>
                    )}
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={isLoading}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {/* Human Answer Form */}
              {canResolve && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-700 mb-3">✍️ Provide Human Answer</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={resolvedBy}
                        onChange={(e) => setResolvedBy(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Answer *</label>
                      <textarea
                        value={humanAnswer}
                        onChange={(e) => setHumanAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={6}
                        className="w-full px-3 py-2 border rounded resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select category...</option>
                        {ESCALATION_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., billing, refund, policy"
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Internal Notes</label>
                      <textarea
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Optional notes for future reference..."
                        rows={2}
                        className="w-full px-3 py-2 border rounded resize-none"
                      />
                    </div>

                    {/* KB Integration Options */}
                    <div className="border-t border-green-200 pt-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addToKB}
                          onChange={(e) => setAddToKB(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Add to Knowledge Base</span>
                      </label>

                      {addToKB && (
                        <div className="mt-3 ml-6">
                          <label className="block text-sm text-gray-600 mb-1">Integration Type</label>
                          <select
                            value={kbIntegrationType}
                            onChange={(e) => setKbIntegrationType(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-sm"
                          >
                            <option value="faq">Create as FAQ</option>
                            <option value="doc_update">Update existing document</option>
                            <option value="verified">Mark as verified (no KB addition)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleResolve}
                      disabled={isLoading || !humanAnswer.trim() || !resolvedBy.trim()}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Resolving...' : '✅ Resolve Escalation'}
                    </button>
                  </div>
                </div>
              )}

              {/* Already Resolved */}
              {escalation.status === 'resolved' && escalation.humanAnswer && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-700 mb-3">✅ Human Answer (Resolved)</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{escalation.humanAnswer}</p>
                  {escalation.resolutionNotes && (
                    <div className="mt-3 text-sm text-gray-500 border-t border-green-200 pt-3">
                      <strong>Notes:</strong> {escalation.resolutionNotes}
                    </div>
                  )}
                  {escalation.addedToKB && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ Added to Knowledge Base as {escalation.kbIntegrationType}
                    </div>
                  )}
                </div>
              )}

              {/* Rejected */}
              {escalation.status === 'rejected' && (
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="font-medium text-red-700 mb-3">❌ Rejected</h3>
                  <p className="text-gray-700">{escalation.resolutionNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Reject Escalation</h3>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows={4}
                className="w-full px-3 py-2 border rounded mb-4"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
