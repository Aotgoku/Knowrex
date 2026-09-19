'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, ClipboardEvent } from 'react';
import { Send, Loader2, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { MessageAttachment } from '@/types/chat';

// ============================================
// ChatInput Component
// A polished input field with Multimodal Vision attachment support:
// - Auto-resize textarea
// - Image/Screenshot attachment picker + drag & paste
// - Character counter
// - Enter to send (Shift+Enter for new line)
// ============================================

interface ChatInputProps {
  onSendMessage: (message: string, image?: MessageAttachment) => void;
  isLoading: boolean;
  disabled?: boolean;
}

// Maximum characters allowed in a single message
const MAX_CHARACTERS = 2000;

export default function ChatInput({ onSendMessage, isLoading, disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState<MessageAttachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
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
   * Convert file to base64 attachment
   */
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit. Please attach a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setAttachedImage({
          data: dataUrl,
          mimeType: file.type,
          name: file.name
        });
      }
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle clipboard paste for screenshots (Ctrl + V)
   */
  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          processImageFile(file);
          break;
        }
      }
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = () => {
    const trimmedMessage = message.trim();
    
    // Can send if text is present OR an image is attached
    if ((!trimmedMessage && !attachedImage) || isLoading || disabled) return;
    
    if (trimmedMessage.length > MAX_CHARACTERS) return;

    const finalMessage = trimmedMessage || 'Please analyze this screenshot/image and explain the issue or solution.';
    onSendMessage(finalMessage, attachedImage || undefined);
    
    setMessage('');
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const characterCount = message.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.9;
  const canSend = (message.trim().length > 0 || !!attachedImage) && !isLoading && !disabled && !isOverLimit;

  return (
    <div 
      className="border-t p-4"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Hidden File Input */}
        <input 
          type="file"
          ref={fileInputRef}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processImageFile(file);
          }}
        />

        {/* Attached Image Preview Tray */}
        {attachedImage && (
          <div className="mb-3 flex items-center gap-3 p-2.5 rounded-xl border bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60 max-w-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-indigo-300 dark:border-indigo-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={attachedImage.data} 
                alt="Attachment preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate text-foreground flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{attachedImage.name || 'Screenshot attachment'}</span>
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                Gemini Vision enabled
              </div>
            </div>
            <button
              onClick={() => {
                setAttachedImage(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-950/50 text-red-500 transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Container */}
        <div 
          className="flex items-end gap-2 p-2 rounded-2xl border transition-all duration-200"
          style={{ 
            backgroundColor: 'var(--input-bg)',
            borderColor: isOverLimit ? 'var(--error)' : 'var(--border-color)'
          }}
        >
          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || disabled}
            className={`flex-shrink-0 p-2 rounded-xl transition-colors cursor-pointer ${
              attachedImage 
                ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground'
            }`}
            title="Attach screenshot or photo (Ctrl+V supported)"
            aria-label="Attach image"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={
              isLoading 
                ? "Analyzing with Gemini..." 
                : attachedImage 
                  ? "Describe the issue or press Enter to analyze screenshot..." 
                  : "Type your message or paste screenshot (Ctrl+V)..."
            }
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
            disabled={!canSend}
            className="flex-shrink-0 p-2 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-hover-effect focus-ring cursor-pointer"
            style={{ 
              background: !canSend ? 'var(--border-color)' : 'var(--user-bubble)'
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
            className="text-xs flex items-center gap-1.5"
            style={{ color: 'var(--muted)' }}
          >
            <span>Press Enter to send</span>
            <span>•</span>
            <span className="hidden sm:inline">Paste screenshot with Ctrl+V</span>
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
