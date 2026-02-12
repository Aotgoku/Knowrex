'use client';

import { useState } from 'react';
import { Bot, User, BookOpen, Sparkles, AlertTriangle, Users } from 'lucide-react';
import { Message, MessageEscalation } from '@/types/chat';
import SourceCitation from './SourceCitation';

// ============================================
// ChatMessage Component
// Renders a single chat message with different
// styles for user vs AI messages. User messages
// appear on the right with a gradient background,
// AI messages appear on the left with a subtle
// background color.
// Now includes source citations for RAG responses!
// Also shows escalation options when confidence is low.
// ============================================

interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
  showSources?: boolean;
  onEscalate?: (message: Message) => Promise<void>;
}

export default function ChatMessage({ 
  message, 
  isLatest = false, 
  showSources = true,
  onEscalate 
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [isEscalating, setIsEscalating] = useState(false);
  const [escalated, setEscalated] = useState(false);
  
  // Format the timestamp to show time in a readable format
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleEscalate = async () => {
    if (!onEscalate || isEscalating || escalated) return;
    
    setIsEscalating(true);
    try {
      await onEscalate(message);
      setEscalated(true);
    } catch (error) {
      console.error('Failed to escalate:', error);
    } finally {
      setIsEscalating(false);
    }
  };

  // Check if we should show escalation UI
  const showEscalationUI = !isUser && message.escalation && 
    (message.escalation.shouldEscalate || message.escalation.offerEscalation);

  return (
    <div 
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} ${isLatest ? 'message-enter' : ''}`}
    >
      {/* Avatar - Different for user vs AI */}
      <div 
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
          isUser 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%] sm:max-w-[70%]`}>
        {/* RAG indicator for AI messages */}
        {!isUser && (message.usedRAG !== undefined || (message.sources && message.sources.length > 0)) && (
          <div className="flex items-center gap-1 mb-1 text-xs" style={{ color: 'var(--muted)' }}>
            {(message.usedRAG || (message.sources && message.sources.length > 0)) ? (
              <>
                <BookOpen className="w-3 h-3 text-indigo-500" />
                <span className="text-indigo-500">Using documents</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>General knowledge</span>
              </>
            )}
          </div>
        )}
        
        {/* Message Bubble */}
        <div 
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser 
              ? 'rounded-tr-md text-white' 
              : 'rounded-tl-md'
          }`}
          style={{
            background: isUser ? 'var(--user-bubble)' : 'var(--ai-bubble)',
            color: isUser ? 'white' : 'var(--ai-text)'
          }}
        >
          {/* 
            Message text with basic markdown-like rendering
            The prose-chat class handles styling for formatted content
          */}
          <div className="prose-chat text-sm sm:text-base whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* Source citations for RAG responses */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <SourceCitation 
              sources={message.sources}
              confidence={message.confidence ?? message.sources[0]?.score ?? 0.3}
              showSources={showSources}
            />
          )}
          
          {/* Escalation UI */}
          {showEscalationUI && !escalated && !message.escalationId && onEscalate && (
            <div className={`mt-3 pt-3 border-t ${
              message.escalation?.shouldEscalate 
                ? 'border-orange-200 bg-orange-50' 
                : 'border-yellow-200 bg-yellow-50'
            } -mx-4 -mb-3 px-4 pb-3 rounded-b-2xl`}>
              <div className="flex items-start gap-2">
                {message.escalation?.shouldEscalate ? (
                  <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Users className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-xs ${
                    message.escalation?.shouldEscalate ? 'text-orange-700' : 'text-yellow-700'
                  }`}>
                    {message.escalation?.message || (
                      message.escalation?.shouldEscalate 
                        ? 'This question may need human expertise.'
                        : `My confidence is ${Math.round((message.confidence || 0) * 100)}%. Would you like to speak with a human?`
                    )}
                  </p>
                  <button
                    onClick={handleEscalate}
                    disabled={isEscalating}
                    className={`mt-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      message.escalation?.shouldEscalate
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isEscalating ? 'Requesting...' : '👤 Get Human Help'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Escalation confirmed - waiting for human */}
          {(escalated || message.escalationId) && (
            <div className="mt-3 pt-3 border-t border-blue-200 bg-blue-50 -mx-4 -mb-3 px-4 pb-3 rounded-b-2xl">
              <div className="flex items-start gap-2 text-blue-700 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Waiting for human expert...</p>
                  <p className="mt-1 opacity-80">Your question has been sent to our support team. You'll see their response here shortly.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span 
          className="text-xs mt-1 px-1"
          style={{ color: 'var(--muted)' }}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
