'use client';

import { useState } from 'react';
import { EscalationTriggerResult } from '@/types/escalation';

interface EscalationPromptProps {
  triggerResult: EscalationTriggerResult;
  confidenceScore: number;
  onEscalate: () => Promise<void>;
  onContinue: () => void;
  isLoading?: boolean;
}

export default function EscalationPrompt({
  triggerResult,
  confidenceScore,
  onEscalate,
  onContinue,
  isLoading = false
}: EscalationPromptProps) {
  const [isEscalating, setIsEscalating] = useState(false);

  const handleEscalate = async () => {
    setIsEscalating(true);
    try {
      await onEscalate();
    } finally {
      setIsEscalating(false);
    }
  };

  const getUrgencyStyle = () => {
    switch (triggerResult.urgency) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-blue-50 border-blue-200';
    }
  };

  const getUrgencyIcon = () => {
    switch (triggerResult.urgency) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '💬';
      case 'low': return '💡';
    }
  };

  return (
    <div className={`rounded-lg border p-4 ${getUrgencyStyle()}`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getUrgencyIcon()}</div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            {triggerResult.shouldEscalate 
              ? 'Human Assistance Recommended'
              : 'Want to Talk to a Human?'}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {triggerResult.message || `My confidence in answering this is ${Math.round(confidenceScore * 100)}%. A human expert can provide a more accurate response.`}
          </p>

          {/* Confidence indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>AI Confidence</span>
              <span>{Math.round(confidenceScore * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  confidenceScore >= 0.65 ? 'bg-green-500' :
                  confidenceScore >= 0.45 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${confidenceScore * 100}%` }}
              />
            </div>
          </div>

          {/* Reason badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
              Reason: {triggerResult.reason.replace('_', ' ')}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleEscalate}
              disabled={isEscalating || isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEscalating ? 'Requesting...' : '👤 Get Human Help'}
            </button>
            {!triggerResult.shouldEscalate && (
              <button
                onClick={onContinue}
                disabled={isLoading}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                Continue with AI
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
