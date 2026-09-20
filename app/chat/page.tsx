'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Moon, 
  Sun, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import RAGSettingsPanel, { useRAGSettings } from '@/components/RAGSettings';
import { Message, MessageSource, MessageAttachment, RAGSettings, DocumentOption } from '@/types/chat';
import { supabase } from '@/lib/supabase';
import { useVoiceChat } from '@/hooks/useVoiceChat';

// ============================================
// Knowrex AI - Dedicated Customer Support Chat
// Realtime RAG with Pinecone Cloud, Multimodal Vision,
// Voice Speech, and Live Human Specialist Escalation
// ============================================

const STORAGE_KEY = 'knowrex-chat-history';

// High-value enterprise prompt starter cards
const PROMPT_STARTERS = [
  {
    id: 'return-policy',
    title: 'Return Policy & Condition',
    prompt: 'What is your official return window and what condition must items be in?',
    category: 'Policy & Refunds',
    icon: '📦',
    badge: 'Pinecone RAG'
  },
  {
    id: 'international-shipping',
    title: 'International Shipping & Duties',
    prompt: 'Do you deliver internationally to Europe and who is responsible for customs duties?',
    category: 'Logistics',
    icon: '✈️',
    badge: 'Autonomous Doc'
  },
  {
    id: 'vision-diagnosis',
    title: 'Inspect Invoice or Error Screenshot',
    prompt: 'How do I upload an invoice or error screenshot for visual AI diagnosis?',
    category: 'Vision AI',
    icon: '📸',
    badge: 'Multimodal'
  },
  {
    id: 'human-escalation',
    title: 'Escalate to Live Human Agent',
    prompt: 'I want to escalate my issue to a human support specialist right now.',
    category: 'Human-in-the-Loop',
    icon: '👤',
    badge: 'Realtime WS'
  }
];

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 Hello! I'm Knowrex, your intelligent enterprise customer support assistant.

I'm grounded in company documentation via Pinecone Cloud Vector Search and equipped with live human escalation. Feel free to ask a question, click the microphone to speak, or paste a screenshot (Ctrl+V) for visual analysis!`,
  timestamp: new Date()
};

export default function DedicatedChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [documents, setDocuments] = useState<DocumentOption[]>([]);
  const [pendingEscalations, setPendingEscalations] = useState<Set<string>>(new Set());
  
  // RAG settings hook
  const { settings: ragSettings, setSettings: setRagSettings } = useRAGSettings();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize on client mount
  useEffect(() => {
    const initApp = async () => {
      const savedDarkMode = localStorage.getItem('knowrex-dark-mode');
      if (savedDarkMode === 'true') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }

      try {
        let currentConvId = localStorage.getItem('knowrex-conversation-id');
        
        if (currentConvId) {
          setConversationId(currentConvId);
          try {
            const res = await fetch(`/api/conversations?id=${currentConvId}`);
            const data = await res.json();
            if (data.success && data.messages && data.messages.length > 0) {
              const dbMessages: Message[] = data.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                timestamp: new Date(m.created_at),
                sources: m.sources,
                confidence: m.confidence,
                usedRAG: m.used_rag,
                escalationId: m.escalation_id
              }));
              setMessages(dbMessages);
              setIsInitialized(true);
              fetchDocumentsCount();
              return;
            }
          } catch (fetchErr) {
            console.warn('Could not fetch from Supabase:', fetchErr);
          }
        } else {
          try {
            const createRes = await fetch('/api/conversations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'create', title: 'New Support Session' })
            });
            const createData = await createRes.json();
            if (createData.success && createData.conversation?.id) {
              setConversationId(createData.conversation.id);
              localStorage.setItem('knowrex-conversation-id', createData.conversation.id);
            }
          } catch (err) {
            console.warn('Could not create Supabase conversation:', err);
          }
        }
      } catch (convErr) {
        console.warn('Session init error:', convErr);
      }

      // Fallback to local storage
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          const messagesWithDates = parsed.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch {
          setMessages([WELCOME_MESSAGE]);
        }
      } else {
        setMessages([WELCOME_MESSAGE]);
      }
      setIsInitialized(true);
      fetchDocumentsCount();
    };

    initApp();
  }, []);

  // Fetch document count
  const fetchDocumentsCount = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.success && data.stats) {
        setDocumentsCount(data.stats.totalDocuments || 0);
        if (data.documents) {
          setDocuments(data.documents.map((d: any) => ({
            id: d.id,
            originalName: d.originalName,
            status: d.status
          })));
        }
      }
    } catch {
      // Quiet fail
    }
  };

  // Realtime Supabase escalation listener
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-escalations-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'escalations'
        },
        (payload) => {
          const updated = payload.new as any;
          if (updated && (updated.status === 'resolved' || updated.status === 'rejected')) {
            setMessages(prev => prev.map(msg => {
              if (msg.escalationId === updated.id) {
                return {
                  ...msg,
                  escalation: {
                    ...msg.escalation!,
                    status: updated.status,
                    humanAnswer: updated.human_answer || updated.resolution_notes
                  }
                };
              }
              return msg;
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Save to local storage
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSearching, isLoading]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('knowrex-dark-mode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const clearChat = async () => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('knowrex-conversation-id');
    try {
      const createRes = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', title: 'New Support Session' })
      });
      const createData = await createRes.json();
      if (createData.success && createData.conversation?.id) {
        setConversationId(createData.conversation.id);
        localStorage.setItem('knowrex-conversation-id', createData.conversation.id);
      }
    } catch {
      // Quiet fail
    }
  };

  // Voice AI
  const voiceChat = useVoiceChat();
  const [voiceTranscript, setVoiceTranscript] = useState('');

  const handleToggleVoice = async () => {
    if (voiceChat.isListening) {
      voiceChat.stopListening();
    } else {
      await voiceChat.startListening((transcript) => {
        setVoiceTranscript(transcript);
      });
    }
  };

  const sendMessage = useCallback(async (content: string, image?: MessageAttachment) => {
    setError(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      image: image || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    if (ragSettings.enabled) {
      setIsSearching(true);
    }

    try {
      const history = messages
        .filter(msg => msg.id !== 'welcome')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          image: image || undefined,
          history,
          ragEnabled: ragSettings.enabled,
          minConfidence: ragSettings.minConfidence,
          selectedDocumentId: ragSettings.selectedDocumentId
        }),
      });
      
      setIsSearching(false);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) throw new Error('ReadableStream not supported');

      const assistantMessageId = `assistant-${Date.now()}`;
      let assistantMessageContent = '';
      let messageSources: MessageSource[] = [];
      let confidenceScore: number | undefined;
      let usedRAG = false;
      let escalationOffer: any;
      let guardrailCheck: any;

      const initialAssistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, initialAssistantMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'sources') {
                messageSources = data.sources || [];
                confidenceScore = data.confidence;
                usedRAG = data.usedRAG || false;
              } else if (data.type === 'chunk') {
                assistantMessageContent += data.text;
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessageId 
                    ? { ...msg, content: assistantMessageContent }
                    : msg
                ));
              } else if (data.type === 'escalation') {
                escalationOffer = data.escalation;
              } else if (data.type === 'guardrail') {
                guardrailCheck = data.guardrail;
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch (err) {
              console.warn('Stream parse error:', err);
            }
          }
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { 
              ...msg, 
              content: assistantMessageContent,
              sources: messageSources.length > 0 ? messageSources : undefined,
              confidence: confidenceScore,
              usedRAG,
              escalation: escalationOffer,
              guardrail: guardrailCheck,
              isStreaming: false 
            }
          : msg
      ));

      if (voiceChat.isSupported && !voiceChat.isMuted && assistantMessageContent) {
        voiceChat.speakText(assistantMessageContent);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [messages, ragSettings, voiceChat]);

  const handleSampleQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleEscalate = useCallback(async (message: Message) => {
    if (!message.escalation) return;
    
    const messageIndex = messages.findIndex(m => m.id === message.id);
    const userMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
    
    try {
      const response = await fetch('/api/escalations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: userMessage?.content || 'Unknown question',
          context: messages.slice(Math.max(0, messageIndex - 5), messageIndex + 1).map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
          })),
          attemptedAnswer: message.content,
          confidenceScore: message.confidence || 0,
          documentsSearched: message.sources?.length || 0,
          topMatchScore: message.sources?.[0]?.score || 0,
          sourcesFound: message.sources?.map(s => ({
            documentName: s.documentName,
            chunkId: s.chunkId,
            score: s.score,
            text: s.text.substring(0, 500)
          })) || [],
          reason: message.escalation.reason,
          urgency: message.escalation.urgency
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => prev.map(m => 
          m.id === message.id 
            ? { ...m, escalationId: data.escalation.id }
            : m
        ));
        setPendingEscalations(prev => new Set(prev).add(data.escalation.id));
      }
    } catch (err) {
      console.error('Escalation error:', err);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Top Navbar */}
      <header className="glass-panel sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mr-1"
            title="Return to Platform Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </Link>

          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md border border-white/20">
            <Bot className="w-4 h-4 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base leading-tight text-foreground tracking-tight">
                Knowrex
              </h1>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pinecone Cloud
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Enterprise Customer Support AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
          >
            <span>Operations Portal</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Chat Messages Body */}
      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar"
      >
        <div className="max-w-4xl mx-auto space-y-6 pb-6">
          {/* Hero Starter Prompt Cards when empty */}
          {messages.length <= 1 && (
            <div className="py-6 sm:py-8 text-center animate-in fade-in-up duration-500">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse-slow" />
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl border border-white/25">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-2 text-foreground">
                How can <span className="shimmer-text">Knowrex</span> assist you?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
                Document-grounded answers powered by Pinecone Cloud RAG, sub-5ms guardrails, and real-time human specialist escalation.
              </p>

              {/* 4 Interactive Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left mb-6">
                {PROMPT_STARTERS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSampleQuestion(item.prompt)}
                    disabled={isLoading}
                    className="p-3.5 rounded-2xl glass-card glow-card border text-left flex items-start gap-3 group cursor-pointer disabled:opacity-50"
                  >
                    <span className="text-xl p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/40 border border-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-foreground truncate group-hover:text-indigo-500 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-500/20">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render messages */}
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isLatest={index === messages.length - 1}
              showSources={ragSettings.showSources}
              onEscalate={handleEscalate}
            />
          ))}

          {/* Searching indicator */}
          {isSearching && (
            <div className="glass-card flex items-center gap-2 text-xs py-2 px-3.5 rounded-xl text-indigo-600 dark:text-indigo-400 w-fit message-enter">
              <BookOpen className="w-3.5 h-3.5 animate-pulse" />
              <span>Querying Pinecone Cloud Vector Store...</span>
            </div>
          )}
          <TypingIndicator isVisible={isLoading && !isSearching} />

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 text-xs message-enter">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <div>
                <p className="font-bold">Error Encountered</p>
                <p className="opacity-90">{error}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Floating Control Strip (Proper vertical spacing) */}
      <div className="p-3 max-w-4xl mx-auto w-full space-y-2 bg-gradient-to-t from-background via-background/95 to-transparent">
        <RAGSettingsPanel 
          settings={ragSettings}
          onSettingsChange={setRagSettings}
          isSearching={isSearching}
          documentsCount={documentsCount}
          documents={documents}
        />

        <ChatInput 
          onSendMessage={sendMessage}
          isLoading={isLoading}
          isListening={voiceChat.isListening}
          isSpeaking={voiceChat.isSpeaking}
          isVoiceSupported={voiceChat.isSupported}
          isMuted={voiceChat.isMuted}
          permissionDenied={voiceChat.permissionDenied}
          externalMessage={voiceTranscript}
          onToggleListen={handleToggleVoice}
          onToggleMute={voiceChat.toggleMute}
          onStopSpeaking={voiceChat.stopSpeaking}
          onDismissPermissionError={voiceChat.dismissPermissionError}
        />
      </div>
    </div>
  );
}
