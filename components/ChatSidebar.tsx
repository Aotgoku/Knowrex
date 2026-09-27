'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  X, 
  ExternalLink, 
  ArrowLeft, 
  Moon, 
  Sun,
  ShieldCheck,
  Clock,
  Check
} from 'lucide-react';
import { Message } from '@/types/chat';
import KnowrexLogo from '@/components/KnowrexLogo';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (session: ChatSession) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearAllSessions: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function ChatSidebar({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAllSessions,
  isDarkMode,
  onToggleDarkMode
}: ChatSidebarProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  // Close confirmation if sidebar closes
  useEffect(() => {
    if (!isOpen) setConfirmClear(false);
  }, [isOpen]);

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Sidebar Panel */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 bg-white/95 dark:bg-[#070709]/95 border-r border-slate-200/80 dark:border-white/10 backdrop-blur-xl transition-all duration-300 ease-in-out shadow-2xl md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:border-r-0 md:overflow-hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <KnowrexLogo size="sm" showWordmark={true} badge="CHAT" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action: + New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-indigo-500/30 dark:border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:scale-[1.01] hover:shadow-md hover:shadow-indigo-500/10 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-md bg-indigo-600 text-white group-hover:scale-110 transition-transform">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <span>New Session</span>
            </div>
            <span className="text-[10px] font-mono opacity-60 uppercase tracking-widest bg-white/50 dark:bg-white/10 px-1.5 py-0.5 rounded">
              Clean
            </span>
          </button>
        </div>

        {/* Sessions History Header */}
        <div className="px-4 py-1.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-indigo-400" />
            Recent Chats ({sessions.length})
          </span>
          {sessions.length > 0 && (
            confirmClear ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onClearAllSessions}
                  className="text-red-500 hover:text-red-600 font-bold text-[10px] transition-colors"
                  title="Confirm Delete All"
                >
                  Yes
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-zinc-500 hover:text-foreground text-[10px]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="hover:text-red-500 transition-colors cursor-pointer text-[10px]"
                title="Clear all chat history"
              >
                Clear
              </button>
            )
          )}
        </div>

        {/* Scrollable Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 custom-scrollbar">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-indigo-400" />
              <p className="font-medium">No previous sessions yet</p>
              <p className="text-[11px] opacity-70">
                Your past customer inquiries will appear here automatically.
              </p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-white/[0.08] text-indigo-600 dark:text-indigo-300 font-semibold shadow-xs border border-indigo-200/80 dark:border-indigo-500/30'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-slate-100/80 dark:hover:bg-white/[0.04] border border-transparent'
                  }`}
                  onClick={() => {
                    onSelectSession(session);
                    if (window.innerWidth < 768) onClose();
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-500' : 'text-muted-foreground opacity-60'}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate leading-tight">
                        {session.title || 'Support Session'}
                      </p>
                      <p className="text-[10px] text-muted-foreground opacity-60 mt-0.5">
                        {formatRelativeTime(session.createdAt)} · {session.messages.length} msgs
                      </p>
                    </div>
                  </div>

                  {/* Delete Single Session Button on Hover */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-950/60 text-zinc-400 hover:text-red-500 transition-all cursor-pointer"
                    title="Delete this session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Links */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/10 space-y-1.5 bg-slate-50/50 dark:bg-black/20 text-xs">
          <Link
            href="/admin"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Operations Portal</span>
            </span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Platform Overview</span>
          </Link>

          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </span>
            <span className="text-[10px] font-mono opacity-50 uppercase">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
