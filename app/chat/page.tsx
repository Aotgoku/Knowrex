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
  ShieldCheck,
  Package,
  Plane,
  Camera,
  UserCheck,
  Menu
} from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import RAGSettingsPanel, { useRAGSettings } from '@/components/RAGSettings';
import { Message, MessageSource, MessageAttachment, RAGSettings, DocumentOption } from '@/types/chat';
import { supabase } from '@/lib/supabase';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import KnowrexLogo from '@/components/KnowrexLogo';
import ChatSidebar, { ChatSession } from '@/components/ChatSidebar';

// ============================================
// Knowrex AI - Dedicated Customer Support Chat
// Realtime RAG with Pinecone Cloud, Multimodal Vision,
// Voice Speech, and Live Human Specialist Escalation
// ============================================

const STORAGE_KEY = 'knowrex-chat-history';
const SESSIONS_STORAGE_KEY = 'knowrex-chat-sessions';

// High-value enterprise prompt starter cards
const PROMPT_STARTERS = [
  {
    id: 'company-policy',
    title: 'Company Policies & Guidelines',
    prompt: 'What are our official company workplace policies, conduct rules, and standards?',
    category: 'Policy & Procedures',
    icon: BookOpen,
    badge: 'Verified RAG'
  },
  {
    id: 'security-compliance',
    title: 'Data Privacy & Compliance',
    prompt: 'How does Knowrex handle customer confidentiality and enterprise data compliance?',
    category: 'Security & SLA',
    icon: ShieldCheck,
    badge: 'Zero Training'
  },
  {
    id: 'vision-diagnosis',
    title: 'Inspect Invoice or Error Screenshot',
    prompt: 'How do I upload an invoice or error screenshot for visual AI diagnosis?',
    category: 'Vision AI',
    icon: Camera,
    badge: 'Multimodal'
  },
  {
    id: 'human-escalation',
    title: 'Connect with Human Specialist',
    prompt: 'I want to escalate my issue to a live human support specialist right now.',
    category: 'Human-in-the-Loop',
    icon: UserCheck,
    badge: 'Realtime Escalation'
  }
];

export default function DedicatedChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('knowrex-dark-mode');
      if (saved !== null) return saved === 'true';
      return document.documentElement.classList.contains('dark');
    }
    return true; // Default dark
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [documents, setDocuments] = useState<DocumentOption[]>([]);
  const [pendingEscalations, setPendingEscalations] = useState<Set<string>>(new Set());
  
  // Collapsible ChatGPT / Claude Style Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  // RAG settings hook
  const { settings: ragSettings, setSettings: setRagSettings } = useRAGSettings();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef<boolean>(true);

  // Initialize on client mount (Instant 0ms render without network blocking)
  useEffect(() => {
    // 1. Sync dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Load existing chat history from localStorage synchronously
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out stale legacy placeholder messages that contain technical vector search text
          const cleaned = parsed.filter((m: any) => 
            !m.content?.includes('Pinecone Cloud Vector Search') &&
            !m.content?.includes('Pinecone')
          );
          
          // Only restore if user actually participated (has at least one user question)
          const hasUserInteraction = cleaned.some((m: any) => m.role === 'user');
          if (hasUserInteraction) {
            const messagesWithDates = cleaned.map((msg: Message) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            setMessages(messagesWithDates);
          } else {
            // Remove solitary legacy placeholder so user gets the pristine, readable Hero view
            localStorage.removeItem(STORAGE_KEY);
            setMessages([]);
          }
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([]);
    }

    // 3. Load saved session history for sidebar
    try {
      const rawSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (rawSessions) {
        const parsedSessions = JSON.parse(rawSessions);
        if (Array.isArray(parsedSessions)) {
          setSessions(parsedSessions);
        }
      }
    } catch {
      // ignore
    }

    setIsInitialized(true);
    fetchDocumentsCount();

    // 3. Sync or create Supabase conversation ID in background (non-blocking)
    const initConversationSession = async () => {
      try {
        const currentConvId = localStorage.getItem('knowrex-conversation-id');
        if (currentConvId) {
          setConversationId(currentConvId);
        } else {
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
        }
      } catch (err) {
        console.warn('Session init warning:', err);
      }
    };

    initConversationSession();
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

  // Auto-scroll ONLY when user has sent messages or when AI is streaming/searching!
  // NEVER scroll down on initial empty page load!
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messages.length > 0 || isSearching || isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
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
    setMessages([]);
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
    } catch (err) {
      console.warn('Failed to reset session:', err);
    }
  };

  // Save/Update sessions list whenever conversation changes
  useEffect(() => {
    if (!isInitialized || messages.length === 0) return;

    const userMsg = messages.find(m => m.role === 'user');
    if (!userMsg) return;

    const sessionTitle = userMsg.content.slice(0, 45) + (userMsg.content.length > 45 ? '...' : '');
    const currentId = conversationId || `session-${Date.now()}`;

    setSessions(prev => {
      const existingIdx = prev.findIndex(s => s.id === currentId);
      let updated: ChatSession[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          messages,
          title: updated[existingIdx].title || sessionTitle
        };
      } else {
        const newSession: ChatSession = {
          id: currentId,
          title: sessionTitle,
          createdAt: new Date().toISOString(),
          messages
        };
        // Cap to latest 30 sessions to guarantee lightweight storage (<100KB)
        updated = [newSession, ...prev].slice(0, 30);
      }
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [messages, conversationId, isInitialized]);

  const handleSelectSession = (session: ChatSession) => {
    setConversationId(session.id);
    const withDates = session.messages.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }));
    setMessages(withDates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withDates));
    localStorage.setItem('knowrex-conversation-id', session.id);
  };

  const handleNewSession = async () => {
    await clearChat();
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    });
    if (conversationId === sessionId) {
      clearChat();
    }
  };

  const handleClearAllSessions = () => {
    setSessions([]);
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
    clearChat();
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
      let rawBuffer = '';

      // The backend sends a custom text/plain stream:
      //   __RAG_METADATA__{...}__END_METADATA__[streamed text]__GUARDRAIL_METADATA__{...}__END_GUARDRAIL__
      // We accumulate all bytes and extract the blocks.

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        rawBuffer += chunk;

        // Extract and remove the RAG metadata block (only present once, at start)
        if (!usedRAG && rawBuffer.includes('__RAG_METADATA__') && rawBuffer.includes('__END_METADATA__')) {
          const metaStart = rawBuffer.indexOf('__RAG_METADATA__') + '__RAG_METADATA__'.length;
          const metaEnd = rawBuffer.indexOf('__END_METADATA__');
          try {
            const meta = JSON.parse(rawBuffer.slice(metaStart, metaEnd));
            messageSources = meta.sources || [];
            confidenceScore = meta.confidence;
            usedRAG = meta.usedRAG || false;
            if (meta.escalation) escalationOffer = meta.escalation;
          } catch (e) {
            console.warn('[Stream] RAG metadata parse error:', e);
          }
          // Remove the metadata block from buffer so we only show clean text
          rawBuffer = rawBuffer.slice(metaEnd + '__END_METADATA__'.length);
        }

        // Extract guardrail block if present (appended at end of stream)
        if (rawBuffer.includes('__GUARDRAIL_METADATA__') && rawBuffer.includes('__END_GUARDRAIL__')) {
          const gStart = rawBuffer.indexOf('__GUARDRAIL_METADATA__') + '__GUARDRAIL_METADATA__'.length;
          const gEnd = rawBuffer.indexOf('__END_GUARDRAIL__');
          try {
            guardrailCheck = JSON.parse(rawBuffer.slice(gStart, gEnd));
          } catch (e) {
            console.warn('[Stream] Guardrail metadata parse error:', e);
          }
          // Remove guardrail block from visible text
          rawBuffer = rawBuffer.slice(0, rawBuffer.indexOf('__GUARDRAIL_METADATA__'));
        }

        // Show clean content progressively (strip any remaining marker fragments)
        const visibleText = rawBuffer
          .replace(/__RAG_METADATA__[\s\S]*?__END_METADATA__/g, '')
          .replace(/__GUARDRAIL_METADATA__[\s\S]*?__END_GUARDRAIL__/g, '');

        if (visibleText !== assistantMessageContent) {
          assistantMessageContent = visibleText;
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: assistantMessageContent }
              : msg
          ));
        }
      }

      // Final clean of accumulated buffer
      assistantMessageContent = rawBuffer
        .replace(/__RAG_METADATA__[\s\S]*?__END_METADATA__/g, '')
        .replace(/__GUARDRAIL_METADATA__[\s\S]*?__END_GUARDRAIL__/g, '')
        .trim();

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
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 relative selection:bg-indigo-500/30 selection:text-indigo-200 ${
      isDarkMode ? 'bg-[#030303] text-zinc-100' : 'bg-[#F4F4F0] text-zinc-900'
    }`}>
      {/* Collapsible ChatGPT / Claude Style Sidebar */}
      <ChatSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={conversationId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Chat Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 relative">
        {/* Dynamic Ambient Background Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Top Navbar */}
        <header className={`sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3.5 border-b backdrop-blur-xl transition-colors ${
          isDarkMode ? 'bg-[#030303]/80 border-white/5 shadow-2xl' : 'bg-white/80 border-black/5 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* 3-Horizontal-Line Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="p-2 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 text-muted-foreground hover:text-foreground hover:border-indigo-500/40 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs"
              title={isSidebarOpen ? "Collapse Sidebar" : "Open Chat History"}
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-inherit glass-button text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mr-1"
              title="Return to Platform Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Overview</span>
            </Link>

            <Link href="/" className="cursor-pointer">
              <KnowrexLogo size="sm" />
            </Link>

            <div className="flex items-center gap-2">
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono tracking-widest uppercase font-semibold ${
                isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified Enterprise AI · Active
              </div>
              <p className="hidden md:block text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Knowrex 24/7 Intelligence
              </p>
            </div>
          </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-button text-xs font-semibold hover:text-foreground transition-colors"
          >
            <span>Operations Portal</span>
            <ExternalLink className="w-3 h-3 text-indigo-400" />
          </Link>

          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-inherit glass-button text-xs font-semibold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Start a new chat session"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">New Session</span>
          </button>

          <button
            onClick={clearChat}
            className="p-2 rounded-full border border-inherit glass-button text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-inherit glass-button text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Chat Messages Body */}
      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar"
      >
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {/* 1. Empty State: Modern Centered Assistant Hero (ChatGPT/Claude style) */}
          {messages.length === 0 ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-500 max-w-3xl mx-auto px-2 py-4">
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-25 animate-pulse-slow" />
                <div className="relative p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
                  <KnowrexLogo size="lg" showWordmark={false} />
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Enterprise Support Intelligence · 24/7 Ready</span>
              </div>

              <h2 className="font-instrument text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight mb-2.5 text-zinc-900 dark:text-zinc-100">
                How can <span className="italic font-light text-indigo-600 dark:text-indigo-400">Knowrex</span> assist you?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto mb-6 leading-relaxed font-medium">
                Instant answers verified from official company documentation, backed by visual multimodal inspection and live specialist escalation.
              </p>

              {/* 4 Interactive Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {PROMPT_STARTERS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSampleQuestion(item.prompt)}
                    disabled={isLoading}
                    className="p-3.5 rounded-2xl glass-panel glow-card border text-left flex items-start gap-3 group cursor-pointer disabled:opacity-50 transition-all hover:-translate-y-0.5 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 bg-white/70 dark:bg-white/[0.03] border-zinc-200/80 dark:border-white/10"
                  >
                    <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform text-indigo-600 dark:text-indigo-400">
                      <item.icon className="w-4 h-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-500/20">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* 2. Active Conversation Thread */
            <div className="space-y-6">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={message.id} 
                  message={message}
                  isLatest={index === messages.length - 1}
                  showSources={ragSettings.showSources}
                  onEscalate={handleEscalate}
                />
              ))}
            </div>
          )}

          {/* Searching indicator */}
          {isSearching && (
            <div className="glass-card flex items-center gap-2 text-xs py-2 px-3.5 rounded-xl text-indigo-600 dark:text-indigo-400 w-fit message-enter">
              <BookOpen className="w-3.5 h-3.5 animate-pulse" />
              <span>Searching verified company documentation...</span>
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
        {/* Quick Suggestion Chips (Accessible even during active chat!) */}
        {messages.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 custom-scrollbar no-scrollbar">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 shrink-0 flex items-center gap-1 pl-1">
              <Sparkles className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              Suggestions:
            </span>
            {PROMPT_STARTERS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSampleQuestion(item.prompt)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/40 shrink-0 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                title={item.prompt}
              >
                <item.icon className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        )}

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
    </div>
  );
}
