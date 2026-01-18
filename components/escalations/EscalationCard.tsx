'use client';

import { Escalation, EscalationStatus, EscalationUrgency } from '@/types/escalation';

interface EscalationCardProps {
  escalation: Escalation;
  onClick?: () => void;
  onQuickAction?: (action: string) => void;
}

export default function EscalationCard({ 
  escalation, 
  onClick,
  onQuickAction 
}: EscalationCardProps) {
  const getUrgencyColor = (urgency: EscalationUrgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
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

  const getStatusIcon = (status: EscalationStatus) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'assigned': return '👤';
      case 'in_progress': return '🔄';
      case 'resolved': return '✅';
      case 'rejected': return '❌';
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-l-4 p-4 hover:shadow-md transition-shadow cursor-pointer ${
        escalation.urgency === 'critical' ? 'border-l-red-500' :
        escalation.urgency === 'high' ? 'border-l-orange-500' :
        escalation.urgency === 'medium' ? 'border-l-yellow-500' :
        'border-l-green-500'
      }`}
      onClick={onClick}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getUrgencyColor(escalation.urgency)}`}>
            {escalation.urgency.toUpperCase()}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(escalation.status)}`}>
            {getStatusIcon(escalation.status)} {escalation.status.replace('_', ' ')}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(escalation.createdAt)}
        </span>
      </div>

      {/* Question */}
      <h3 className="font-medium text-gray-900 mb-2">
        {truncateText(escalation.userQuestion, 120)}
      </h3>

      {/* Metadata Row */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          📊 {Math.round(escalation.confidenceScore * 100)}% confidence
        </span>
        <span className="flex items-center gap-1">
          📄 {escalation.documentsSearched} docs searched
        </span>
        {escalation.category && (
          <span className="flex items-center gap-1">
            🏷️ {escalation.category}
          </span>
        )}
      </div>

      {/* Reason Badge */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <span className="bg-gray-100 px-2 py-1 rounded">
          Reason: {escalation.reason.replace('_', ' ')}
        </span>
        {escalation.assignedTo && (
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
            Assigned to: {escalation.assignedTo}
          </span>
        )}
      </div>

      {/* Quick Actions */}
      {onQuickAction && escalation.status === 'pending' && (
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAction('assign');
            }}
            className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
          >
            Assign
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAction('start');
            }}
            className="px-3 py-1 text-xs bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 transition"
          >
            Start Working
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAction('reject');
            }}
            className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
          >
            Reject
          </button>
        </div>
      )}

      {/* Tags */}
      {escalation.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {escalation.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
          {escalation.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{escalation.tags.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
}
