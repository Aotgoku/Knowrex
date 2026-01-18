'use client';

import { useState, useEffect } from 'react';
import { Escalation } from '@/types/escalation';

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
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-16 bg-gray-200 rounded"></div>
              <div className="h-5 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (escalations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-3">📭</div>
        <div>No escalations found</div>
      </div>
    );
  }

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'critical': return { bg: 'bg-red-50', border: 'border-l-red-500', badge: 'bg-red-100 text-red-700' };
      case 'high': return { bg: 'bg-orange-50', border: 'border-l-orange-500', badge: 'bg-orange-100 text-orange-700' };
      case 'medium': return { bg: 'bg-yellow-50', border: 'border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-700' };
      case 'low': return { bg: 'bg-green-50', border: 'border-l-green-500', badge: 'bg-green-100 text-green-700' };
      default: return { bg: 'bg-gray-50', border: 'border-l-gray-500', badge: 'bg-gray-100 text-gray-700' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { text: '⏳ Pending', class: 'bg-gray-100 text-gray-700' };
      case 'assigned': return { text: '👤 Assigned', class: 'bg-blue-100 text-blue-700' };
      case 'in_progress': return { text: '🔄 In Progress', class: 'bg-yellow-100 text-yellow-700' };
      case 'resolved': return { text: '✅ Resolved', class: 'bg-green-100 text-green-700' };
      case 'rejected': return { text: '❌ Rejected', class: 'bg-red-100 text-red-700' };
      default: return { text: status, class: 'bg-gray-100 text-gray-700' };
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
    <div className="space-y-2">
      {escalations.map(escalation => {
        const urgencyStyle = getUrgencyStyle(escalation.urgency);
        const statusBadge = getStatusBadge(escalation.status);
        const isSelected = selectedId === escalation.id;

        return (
          <div
            key={escalation.id}
            onClick={() => onEscalationClick(escalation)}
            className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md ${
              urgencyStyle.border
            } ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${urgencyStyle.badge}`}>
                  {escalation.urgency.toUpperCase()}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs ${statusBadge.class}`}>
                  {statusBadge.text}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(escalation.createdAt)}
              </span>
            </div>

            {/* Question */}
            <p className="text-gray-900 font-medium line-clamp-2 mb-2">
              {escalation.userQuestion}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>📊 {Math.round(escalation.confidenceScore * 100)}%</span>
              <span>📄 {escalation.sourcesFound.length} sources</span>
              {escalation.category && <span>🏷️ {escalation.category}</span>}
              {escalation.assignedTo && (
                <span className="text-blue-600">👤 {escalation.assignedTo}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
