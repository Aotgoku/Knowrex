'use client';

import { Bot } from 'lucide-react';

// ============================================
// TypingIndicator Component
// Shows an animated "AI is typing..." indicator
// with bouncing dots to indicate the AI is
// processing and generating a response
// ============================================

interface TypingIndicatorProps {
  isVisible: boolean;
}

export default function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  // Don't render anything if not visible
  if (!isVisible) return null;

  return (
    <div className="flex items-start gap-3 message-enter">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
        <Bot className="w-4 h-4 text-white" />
      </div>

      {/* Typing Bubble */}
      <div 
        className="px-4 py-3 rounded-2xl rounded-tl-md shadow-sm"
        style={{ 
          backgroundColor: 'var(--ai-bubble)',
          color: 'var(--ai-text)'
        }}
      >
        <div className="flex items-center gap-1">
          {/* Three animated bouncing dots */}
          <span 
            className="typing-dot w-2 h-2 rounded-full bg-indigo-500"
            style={{ opacity: 0.7 }}
          />
          <span 
            className="typing-dot w-2 h-2 rounded-full bg-indigo-500"
            style={{ opacity: 0.7 }}
          />
          <span 
            className="typing-dot w-2 h-2 rounded-full bg-indigo-500"
            style={{ opacity: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
}
