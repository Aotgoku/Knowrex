'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, ClipboardEvent } from 'react';
import { Send, Loader2, Paperclip, X, Image as ImageIcon, Mic, MicOff, Volume2, VolumeX, Square, AlertCircle } from 'lucide-react';
import { MessageAttachment, ChatInputProps } from '@/types/chat';

// ============================================
// ChatInput Component
// A polished input field with Multimodal Vision & Voice AI support:
// - Auto-resize textarea
// - Image/Screenshot attachment picker + drag & paste
// - Native Web Speech API Voice Mode with live waveform
// - AI Text-to-Speech natural voice readout toggle
// - Character counter
// - Enter to send (Shift+Enter for new line)
// ============================================

// Maximum characters allowed in a single message
const MAX_CHARACTERS = 2000;

export default function ChatInput({ 
  onSendMessage, 
  isLoading, 
  disabled = false,
  isListening = false,
  isSpeaking = false,
  isVoiceSupported = false,
  isMuted = false,
  permissionDenied = false,
  externalMessage,
  onToggleListen,
  onToggleMute,
  onStopSpeaking,
  onDismissPermissionError
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState<MessageAttachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync external voice transcript if provided
  useEffect(() => {
    if (externalMessage !== undefined && externalMessage !== '') {
      setMessage(externalMessage);
    }
  }, [externalMessage]);

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
    <div className="w-full">
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

        {/* Microphone Permission Warning Banner */}
        {permissionDenied && (
          <div className="mb-2 flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl border bg-amber-50/95 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-medium animate-in fade-in slide-in-from-bottom-1 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                Microphone access blocked. Click the lock/tune icon in your browser address bar to allow microphone permissions.
              </span>
            </div>
            {onDismissPermissionError && (
              <button
                type="button"
                onClick={onDismissPermissionError}
                className="p-1 rounded-full hover:bg-amber-200/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 transition-colors shrink-0 cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Voice AI Status Banners */}
        {isListening && (
          <div className="mb-2 flex items-center justify-between px-3.5 py-1.5 rounded-xl border bg-red-50/90 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-medium animate-in fade-in slide-in-from-bottom-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Listening to your voice... Speak your question</span>
            </div>
            <div className="flex items-center gap-0.5 h-3.5">
              <span className="w-0.5 h-3 bg-red-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"></span>
              <span className="w-0.5 h-2 bg-red-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]"></span>
              <span className="w-0.5 h-4 bg-red-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]"></span>
              <span className="w-0.5 h-2.5 bg-red-500 rounded-full animate-[pulse_0.3s_ease-in-out_infinite]"></span>
            </div>
          </div>
        )}

        {isSpeaking && (
          <div className="mb-2 flex items-center justify-between px-3.5 py-1.5 rounded-xl border bg-purple-50/90 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-medium animate-in fade-in slide-in-from-bottom-1">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 animate-bounce text-purple-600 dark:text-purple-400" />
              <span>AI Speaking response out loud...</span>
            </div>
            {onStopSpeaking && (
              <button
                type="button"
                onClick={onStopSpeaking}
                className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 hover:underline cursor-pointer"
              >
                <Square className="w-2.5 h-2.5 fill-current" /> Stop
              </button>
            )}
          </div>
        )}

        {/* Input Container */}
        <div 
          className="flex items-end gap-2 p-2 sm:p-2.5 rounded-2xl border glass-card shadow-xl transition-all duration-200 focus-within:border-indigo-500/60 focus-within:shadow-indigo-500/15"
          style={{ 
            borderColor: isOverLimit ? 'var(--error)' : 'var(--card-border)'
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
                : isListening
                  ? "Listening to your voice..."
                  : attachedImage 
                    ? "Describe the issue or press Enter to analyze screenshot..." 
                    : "Type your message, click mic to speak, or paste screenshot (Ctrl+V)..."
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

          {/* Voice AI Mute / Unmute Button */}
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              className={`flex-shrink-0 p-2 rounded-xl transition-colors cursor-pointer ${
                isMuted
                  ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
              title={isMuted ? 'AI Voice readout muted (click to unmute)' : 'AI Voice readout active (click to mute)'}
              aria-label="Toggle Voice Readout"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}

          {/* Voice AI Microphone Button */}
          {isVoiceSupported && onToggleListen && (
            <button
              type="button"
              onClick={onToggleListen}
              disabled={isLoading || disabled}
              className={`flex-shrink-0 p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-300'
                  : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Voice Mode: Click and speak'}
              aria-label="Toggle Microphone"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

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
