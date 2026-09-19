'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Moon, 
  Sun, 
  Trash2, 
  Sparkles,
  MessageSquare,
  Zap,
  HelpCircle,
  AlertCircle,
  Settings,
  BookOpen
} from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import TypingIndicator from '@/components/TypingIndicator';
import RAGSettingsPanel, { useRAGSettings } from '@/components/RAGSettings';
import { Message, MessageSource, MessageAttachment, RAGSettings, DocumentOption } from '@/types/chat';
import { supabase } from '@/lib/supabase';
import { useVoiceChat } from '@/hooks/useVoiceChat';

// ============================================
// Knowrex - Main Chat Page with RAG Integration
// 
// This is the main chat interface component that:
// 1. Manages the chat state (messages, loading, errors)
// 2. Handles communication with the Gemini API
// 3. Integrates RAG for document-based answers
// 4. Provides a beautiful, responsive UI
// ============================================

// Key for localStorage persistence
const STORAGE_KEY = 'knowrex-chat-history';

// Sample questions to help users get started
const SAMPLE_QUESTIONS = [
  {
    id: '1',
    text: 'What services do you offer?',
    icon: '🎯'
  },
  {
    id: '2', 
    text: 'How can I contact support?',
    icon: '📞'
  },
  {
    id: '3',
    text: 'Tell me about your pricing',
    icon: '💰'
  },
  {
    id: '4',
    text: 'How do I get started?',
    icon: '🚀'
  }
];

// Welcome message shown when chat starts
const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 Hello! I'm Knowrex, your intelligent customer support assistant.

I'm here to help you with any questions about our products, services, or general inquiries. Feel free to ask me anything!

Here are some things I can help you with:
• Answer questions about products and services
• Provide information and recommendations
• Help troubleshoot common issues
• Guide you through processes

What would you like to know today?`,
  timestamp: new Date()
};

export default function ChatPage() {
  // ============================================
  // State Management
  // ============================================
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
  
  // RAG settings
  const { settings: ragSettings, setSettings: setRagSettings, isLoaded: ragSettingsLoaded } = useRAGSettings();
  
  // Ref for auto-scrolling to the latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMountRef = useRef<boolean>(true);

  // ============================================
  // Load messages from localStorage on mount
  // ============================================
  useEffect(() => {
    const initApp = async () => {
      // 1. Check for saved dark mode preference
      const savedDarkMode = localStorage.getItem('knowrex-dark-mode');
      if (savedDarkMode === 'true') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }

      // 2. Load or initialize conversation session
      try {
        let currentConvId = localStorage.getItem('knowrex-conversation-id');
        
        // If we have a saved conversation ID, attempt to fetch messages from Supabase
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
            console.warn('Could not fetch from Supabase, falling back to localStorage:', fetchErr);
          }
        } else {
          // Create new conversation in Supabase
          try {
            const createRes = await fetch('/api/conversations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'create', title: 'Support Chat' })
            });
            const createData = await createRes.json();
            if (createData.success && createData.conversation?.id) {
              currentConvId = createData.conversation.id;
              setConversationId(currentConvId);
              localStorage.setItem('knowrex-conversation-id', currentConvId!);
            }
          } catch (createErr) {
            console.warn('Could not create Supabase conversation:', createErr);
          }
        }

        // Fallback: Load chat history from localStorage
        const savedMessages = localStorage.getItem(STORAGE_KEY);
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          const restoredMessages = parsedMessages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          
          const pendingEscIds = new Set<string>();
          const messagesToAdd: Message[] = [];
          
          for (const msg of restoredMessages) {
            if (msg.id?.startsWith('human-')) {
              continue;
            }
            messagesToAdd.push(msg);
            if (msg.escalationId) {
              pendingEscIds.add(msg.escalationId);
            }
          }
          setMessages(messagesToAdd.length > 0 ? messagesToAdd : [WELCOME_MESSAGE]);
          setPendingEscalations(pendingEscIds);
        } else {
          setMessages([WELCOME_MESSAGE]);
        }
      } catch (e) {
        console.error('Failed to load chat history:', e);
        setMessages([WELCOME_MESSAGE]);
      } finally {
        setIsInitialized(true);
      }

      // 3. Fetch documents count for RAG indicator
      fetchDocumentsCount();
    };
    
    initApp();
  }, []);
  
  // Fetch documents count
  const fetchDocumentsCount = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        const docsList = data.documents || [];
        setDocumentsCount(docsList.length);
        setDocuments(docsList.map((doc: { id: string; originalName?: string; filename?: string }) => ({
          id: doc.id,
          name: doc.originalName || doc.filename || 'Unnamed Document'
        })));
      }
    } catch (e) {
      console.error('Failed to fetch documents count:', e);
    }
  };

  // ============================================
  // Save messages to localStorage when they change
  // ============================================
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
  }, [messages, isInitialized]);

  // ============================================
  // Auto-scroll to bottom cleanly
  // ============================================
  useEffect(() => {
    if (!isInitialized || !messagesEndRef.current) return;

    if (isInitialMountRef.current) {
      // First load: jump straight to bottom without stutter
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      isInitialMountRef.current = false;
    } else {
      // New messages: smooth scroll
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isInitialized]);

  // ============================================
  // Supabase Realtime: Instant Human Resolution Delivery
  // Listens via WebSockets (postgres_changes) + gentle fallback
  // ============================================
  useEffect(() => {
    if (pendingEscalations.size === 0) return;

    const deliverResolution = (
      escalationId: string, 
      humanAnswer: string, 
      resolvedBy?: string, 
      resolvedAt?: string | Date
    ) => {
      setPendingEscalations(prev => {
        const next = new Set(prev);
        next.delete(escalationId);
        return next;
      });

      setMessages(prev => {
        const humanResponseExists = prev.some(
          m => m.id === `human-${escalationId}`
        );
        if (humanResponseExists) return prev;

        const humanMessage: Message = {
          id: `human-${escalationId}`,
          role: 'assistant',
          content: `**🙋 Human Expert Response:**\n\n${humanAnswer}\n\n*Resolved by: ${resolvedBy || 'Support Specialist'}*`,
          timestamp: resolvedAt ? new Date(resolvedAt) : new Date(),
          usedRAG: false
        };

        return [...prev, humanMessage];
      });
    };

    // 1. Live WebSocket Listener via Supabase Realtime Channel
    const channel = supabase
      .channel('customer-escalation-live')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'escalations'
        },
        (payload) => {
          const updated = payload.new as any;
          if (
            updated &&
            pendingEscalations.has(updated.id) &&
            updated.status === 'resolved' &&
            updated.human_answer
          ) {
            console.log('[Realtime] ⚡ Received live human resolution via WebSocket:', updated.id);
            deliverResolution(
              updated.id,
              updated.human_answer,
              updated.resolved_by,
              updated.resolved_at
            );
          }
        }
      )
      .subscribe();

    // 2. Light safety check (in case WebSocket reconnected during network change)
    const checkEscalations = async () => {
      const escalationsToCheck = Array.from(pendingEscalations);
      for (const escalationId of escalationsToCheck) {
        try {
          const response = await fetch(`/api/escalations/${escalationId}`);
          const data = await response.json();
          if (data.success && data.escalation.status === 'resolved' && data.escalation.humanAnswer) {
            deliverResolution(
              escalationId,
              data.escalation.humanAnswer,
              data.escalation.resolvedBy,
              data.escalation.resolvedAt
            );
          }
        } catch (error) {
          console.error(`Error checking escalation ${escalationId}:`, error);
        }
      }
    };

    // Initial check on mount + 15s gentle fallback interval (reduced from aggressive 5s)
    checkEscalations();
    const interval = setInterval(checkEscalations, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [pendingEscalations]);

  // ============================================
  // Toggle dark mode
  // ============================================
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('knowrex-dark-mode', String(newValue));
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  };

  // ============================================
  // Clear chat history & start fresh conversation
  // ============================================
  const clearChat = async () => {
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('knowrex-conversation-id');
    try {
      const createRes = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', title: 'New Support Chat' })
      });
      const createData = await createRes.json();
      if (createData.success && createData.conversation?.id) {
        setConversationId(createData.conversation.id);
        localStorage.setItem('knowrex-conversation-id', createData.conversation.id);
      }
    } catch (err) {
      console.warn('Could not reset Supabase conversation on clear:', err);
    }
  };

  // ============================================
  // Voice AI Assistant hook & Speech Controls
  // ============================================
  const voiceChat = useVoiceChat();
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // ============================================
  // Send message to API and handle streaming response with RAG
  // ============================================
  const sendMessage = useCallback(async (content: string, image?: MessageAttachment) => {
    // Clear any previous errors
    setError(null);

    // Create the user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      image: image || undefined
    };

    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Show searching indicator if RAG is enabled
    if (ragSettings.enabled) {
      setIsSearching(true);
    }

    try {
      // Prepare conversation history for the API
      // We exclude the welcome message and only send actual conversation
      const history = messages
        .filter(msg => msg.id !== 'welcome')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Make the API call with streaming and RAG options
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      // Handle error responses
      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          // If parsing fails, use the default error message
          console.error('Failed to parse error response:', parseError);
          // Keep the default errorMessage
        }
        
        // Set error state instead of throwing
        setError(errorMessage);
        setIsLoading(false);
        return; // Exit early instead of throwing
      }

      // Create a placeholder for the AI response
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        usedRAG: undefined,  // Will be set from RAG metadata
        sources: undefined,
        confidence: undefined,
        escalation: undefined  // Will be set from RAG metadata
      };

      // Add the empty assistant message
      setMessages(prev => [...prev, assistantMessage]);

      // Read the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      // Process the stream chunk by chunk
      let accumulatedContent = '';
      let ragMetadata: { 
        usedRAG?: boolean; 
        sources?: MessageSource[]; 
        confidence?: number;
        escalation?: {
          shouldEscalate: boolean;
          offerEscalation: boolean;
          reason: string;
          urgency: string;
          message: string;
        };
      } = {};
      let metadataExtracted = false;
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        // Decode the chunk and add to accumulated content
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        
        // Extract RAG metadata from the beginning of the response
        if (!metadataExtracted && accumulatedContent.includes('__END_METADATA__')) {
          const metadataMatch = accumulatedContent.match(/__RAG_METADATA__(.+?)__END_METADATA__/);
          if (metadataMatch) {
            try {
              ragMetadata = JSON.parse(metadataMatch[1]);
              console.log('[Frontend] Parsed RAG metadata:', ragMetadata);
              console.log('[Frontend] usedRAG:', ragMetadata.usedRAG, 'sources:', ragMetadata.sources?.length);
              if (ragMetadata.escalation) {
                console.log('[Frontend] Escalation info:', ragMetadata.escalation);
              }
            } catch (e) {
              console.error('Failed to parse RAG metadata:', e);
            }
            // Remove metadata from content
            accumulatedContent = accumulatedContent.replace(/__RAG_METADATA__.+?__END_METADATA__/, '');
            metadataExtracted = true;
          }
        }

        // Update the message content with the accumulated text (without metadata)
        const displayContent = accumulatedContent.replace(/__RAG_METADATA__.+?__END_METADATA__/, '');
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                content: displayContent,
                usedRAG: ragMetadata.usedRAG,
                sources: ragMetadata.sources,
                confidence: ragMetadata.confidence,
                escalation: ragMetadata.escalation as Message['escalation']
              }
            : msg
        ));
      }

      // Save user & assistant messages to Supabase in background
      if (conversationId) {
        try {
          // Save user message
          fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'save_message',
              conversationId,
              message: userMessage
            })
          }).catch(console.error);

          // Save assistant message
          const finalAssistantMsg = {
            id: assistantMessageId,
            role: 'assistant',
            content: accumulatedContent.replace(/__RAG_METADATA__.+?__END_METADATA__/, ''),
            usedRAG: ragMetadata.usedRAG,
            sources: ragMetadata.sources,
            confidence: ragMetadata.confidence,
            escalationId: undefined
          };

          fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'save_message',
              conversationId,
              message: finalAssistantMsg
            })
          }).catch(console.error);
        } catch (dbErr) {
          console.warn('Failed to save to Supabase:', dbErr);
        }
      }

      // Trigger Voice AI audio readout if not muted
      const cleanVoiceText = accumulatedContent.replace(/__RAG_METADATA__.+?__END_METADATA__/, '').trim();
      if (cleanVoiceText && !voiceChat.isMuted) {
        voiceChat.speakText(cleanVoiceText);
      }

    } catch (err) {
      // Handle errors gracefully
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Chat error:', err);
      }
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [messages, ragSettings, conversationId, voiceChat]);

  // Voice Speech-to-Text Toggle Handler
  const handleToggleVoice = useCallback(() => {
    if (voiceChat.isListening) {
      voiceChat.stopListening();
    } else {
      voiceChat.startListening(
        (interim) => {
          setVoiceTranscript(interim);
        },
        (finalText) => {
          setVoiceTranscript(finalText);
          if (finalText.trim()) {
            sendMessage(finalText.trim());
            setVoiceTranscript('');
          }
        }
      );
    }
  }, [voiceChat, sendMessage]);

  // ============================================
  // Handle sample question click
  // ============================================
  const handleSampleQuestion = (question: string) => {
    if (!isLoading) {
      sendMessage(question);
    }
  };

  // ============================================
  // Handle escalation request
  // ============================================
  const handleEscalate = useCallback(async (message: Message) => {
    if (!message.escalation) return;
    
    // Find the user message that triggered this response
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
        // Update the message with escalation ID
        setMessages(prev => prev.map(m => 
          m.id === message.id 
            ? { ...m, escalationId: data.escalation.id }
            : m
        ));
        
        // Add to pending escalations for polling
        setPendingEscalations(prev => new Set(prev).add(data.escalation.id));
      } else {
        throw new Error(data.error || 'Failed to create escalation');
      }
    } catch (error) {
      console.error('Escalation error:', error);
      throw error;
    }
  }, [messages]);

  // ============================================
  // Render the chat interface
  // ============================================
  return (
    <div 
      className="flex flex-col h-screen"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* ============================================
          Header
          ============================================ */}
      <header 
        className="flex items-center justify-between px-4 py-3 border-b shadow-sm"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg" style={{ color: 'var(--foreground)' }}>
              Knowrex
            </h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Intelligent Customer Support
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Admin Dashboard Link */}
          <Link
            href="/admin"
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--muted)' }}
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* Clear Chat Button */}
          <button
            onClick={clearChat}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--muted)' }}
            title="Clear chat history"
            aria-label="Clear chat history"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-gray-500"
            style={{ color: 'var(--muted)' }}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* ============================================
          Chat Messages Area
          ============================================ */}
      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Show sample questions when chat is empty or only has welcome message */}
          {messages.length <= 1 && (
            <div className="mb-8">
              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div 
                  className="p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Instant Responses
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Get answers in real-time with AI-powered support
                  </p>
                </div>

                <div 
                  className="p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Natural Conversation
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Chat naturally like you would with a human agent
                  </p>
                </div>

                <div 
                  className="p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                    <HelpCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    24/7 Available
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Get help anytime, day or night
                  </p>
                </div>
              </div>

              {/* Sample questions */}
              <div className="text-center mb-4">
                <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
                  Try asking one of these questions:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_QUESTIONS.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleSampleQuestion(question.text)}
                    disabled={isLoading}
                    className="p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                    style={{ 
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{question.icon}</span>
                      <span 
                        className="font-medium group-hover:text-indigo-500 transition-colors"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {question.text}
                      </span>
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

          {/* Typing indicator with search status */}
          {isSearching && (
            <div 
              className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg message-enter"
              style={{ 
                backgroundColor: 'var(--ai-bubble)',
                color: 'var(--muted)',
                width: 'fit-content'
              }}
            >
              <BookOpen className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>Searching documents...</span>
            </div>
          )}
          <TypingIndicator isVisible={isLoading && !isSearching} />

          {/* Error message */}
          {error && (
            <div 
              className="flex items-center gap-3 p-4 rounded-xl border message-enter"
              style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'var(--error)',
                color: 'var(--error)'
              }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Something went wrong</p>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ============================================
          RAG Settings Panel
          ============================================ */}
      <div className="px-4 pb-2 max-w-4xl mx-auto w-full">
        <RAGSettingsPanel 
          settings={ragSettings}
          onSettingsChange={setRagSettings}
          isSearching={isSearching}
          documentsCount={documentsCount}
          documents={documents}
        />
      </div>

      {/* ============================================
          Chat Input
          ============================================ */}
      <ChatInput 
        onSendMessage={sendMessage}
        isLoading={isLoading}
        isListening={voiceChat.isListening}
        isSpeaking={voiceChat.isSpeaking}
        isVoiceSupported={voiceChat.isSupported}
        isMuted={voiceChat.isMuted}
        externalMessage={voiceTranscript}
        onToggleListen={handleToggleVoice}
        onToggleMute={voiceChat.toggleMute}
        onStopSpeaking={voiceChat.stopSpeaking}
      />

      {/* ============================================
          Footer - Powered by badge
          ============================================ */}
      <footer 
        className="text-center py-2 text-xs border-t"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          color: 'var(--muted)'
        }}
      >
        <div className="flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Powered by Google Gemini AI</span>
        </div>
      </footer>
    </div>
  );
}
