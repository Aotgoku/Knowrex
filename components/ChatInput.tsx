'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

// ============================================
// ChatInput Component
// A polished input field with send button for
// composing and sending messages. Features:
// - Auto-resize textarea
// - Character counter
// - Enter to send (Shift+Enter for new line)
// - Loading state handling
// - Disabled state when AI is responding
// ============================================

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

// Maximum characters allowed in a single message
const MAX_CHARACTERS = 2000;

export default function ChatInput({ onSendMessage, isLoading, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set height to scrollHeight, but cap at 150px
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Focus textarea when component mounts
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  /**
   * Handle form submission
   * Trims the message and sends it if not empty
   */
  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    
    // Don't send empty messages or if loading
    if (!trimmedMessage || isLoading || disabled) return;
    
    // Don't exceed character limit
    if (trimmedMessage.length > MAX_CHARACTERS) return;

    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  /**
   * Handle keyboard events
   * Enter sends message, Shift+Enter adds new line
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  /**
   * Handle input changes
   * Updates message state and respects character limit
   */
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Allow typing but show warning if over limit
    setMessage(value);
  };

  const characterCount = message.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.9;

  return (
    <div 
      className="border-t p-4"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Input Container */}
        <div 
          className="flex items-end gap-2 p-2 rounded-2xl border transition-all duration-200"
          style={{ 
            backgroundColor: 'var(--input-bg)',
            borderColor: isOverLimit ? 'var(--error)' : 'var(--border-color)'
          }}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
            disabled={isLoading || disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-2 text-sm sm:text-base focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed custom-scrollbar"
            style={{ 
              color: 'var(--foreground)',
              minHeight: '44px',
              maxHeight: '150px'
            }}
            aria-label="Message input"
          />

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading || disabled || isOverLimit}
            className="flex-shrink-0 p-2 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-hover-effect focus-ring"
            style={{ 
              background: (!message.trim() || isLoading || disabled || isOverLimit) 
                ? 'var(--border-color)' 
                : 'var(--user-bubble)'
            }}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Character Counter & Helper Text */}
        <div className="flex justify-between items-center mt-2 px-2">
          <span 
            className="text-xs"
            style={{ color: 'var(--muted)' }}
          >
            Press Enter to send, Shift+Enter for new line
          </span>
          <span 
            className={`text-xs font-medium transition-colors ${
              isOverLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : ''
            }`}
            style={{ color: isOverLimit ? 'var(--error)' : isNearLimit ? '#f59e0b' : 'var(--muted)' }}
          >
            {characterCount.toLocaleString()}/{MAX_CHARACTERS.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
