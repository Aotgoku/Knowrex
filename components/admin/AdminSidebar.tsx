'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  FileText, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  Moon,
  Sun,
  Database,
  Users,
  BarChart2,
  Lock,
  LogOut,
  Shield,
  Headphones
} from 'lucide-react';
import { AuthUser } from '@/lib/auth';
import KnowrexLogo from '@/components/KnowrexLogo';

// ============================================
// AdminSidebar Component
// Navigation sidebar for admin pages with RBAC awareness
// ============================================

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
  { href: '/admin/vectors', label: 'Vector DB', icon: Database, badge: 'PINECONE', adminOnly: true },
  { href: '/admin/escalations', label: 'Escalations', icon: Users, badge: 'LIVE' },
  { href: '/admin/escalations/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/evaluations', label: 'Eval Harness', icon: Shield, badge: 'GUARDRAILS', adminOnly: true },
  { href: '/chat', label: 'Customer Chat', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch current session
  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(err => console.error('Failed to load user session:', err));
  }, [pathname]);
  
  // Check dark mode on mount and sync with system preference
  useEffect(() => {
    const saved = localStorage.getItem('knowrex-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved !== null ? saved === 'true' : prefersDark;
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('knowrex-dark-mode', String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoggingOut(false);
    }
  };
  
  const isActive = (href: string) => {
    // Exact match is always active
    if (pathname === href) return true;

    // If another navItem is a more specific match for this pathname, don't match the parent
    const hasMoreSpecificMatch = navItems.some(
      item => item.href !== href && item.href.startsWith(href + '/') && (pathname === item.href || pathname.startsWith(item.href + '/'))
    );
    if (hasMoreSpecificMatch) return false;

    if (href === '/admin' || href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href + '/');
  };

  const isAgent = currentUser?.role === 'agent';
  
  const SidebarContent = () => (
    <>
      {/* Brand Header with Top Collapse Toggle */}
      <div className={`flex items-center ${isCollapsed ? 'flex-col justify-center py-4 px-2' : 'justify-between px-4 py-4'} border-b border-slate-200/80 dark:border-white/10`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <Link href="/" className="cursor-pointer">
            <KnowrexLogo 
              size={isCollapsed ? 'sm' : 'md'} 
              showWordmark={!isCollapsed} 
              badge={isCollapsed ? undefined : "OS"} 
            />
          </Link>
        </div>

        {/* Top Collapse / Expand Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(prev => !prev)}
          className={`p-2 rounded-xl border border-slate-200/90 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 text-muted hover:text-foreground hover:border-indigo-500/30 hover:bg-slate-200/70 dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs ${isCollapsed ? 'mt-2.5' : ''}`}
          title={isCollapsed ? "Expand Sidebar (Menu)" : "Collapse Sidebar (Menu)"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
        </button>
      </div>

      {/* Back to Public Overview Link */}
      <div className="px-3 pt-3 pb-1">
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted hover:text-foreground hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Return to Public Overview"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-muted" />
          {!isCollapsed && <span>Back to Overview</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isRestrictedForAgent = isAgent && item.adminOnly;
          
          // If feature is restricted for this role, hide it completely from sidebar
          if (isRestrictedForAgent) {
            return null;
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                active 
                  ? 'bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-slate-100/70 dark:hover:bg-slate-800/50 border border-transparent font-medium'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full shadow-sm shadow-indigo-500" />
              )}
              <Icon className={`w-4 h-4 shrink-0 ${isCollapsed ? 'mx-auto' : ''} ${active ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
              {!isCollapsed && (
                <span className="text-xs flex-1 truncate">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className={`px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider rounded-md uppercase shrink-0 border ${
                  item.badge === 'LIVE'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : item.badge === 'GUARDRAILS'
                      ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20'
                      : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live System Connection Heartbeat */}
      <div className="mx-3 my-2 p-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 flex items-center gap-2.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        {!isCollapsed && (
          <div className="overflow-hidden flex-1">
            <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              Pinecone Cloud
            </div>
            <div className="text-[9px] text-muted truncate">
              AWS us-east-1 • Healthy
            </div>
          </div>
        )}
      </div>

      {/* User Profile Card (RBAC Badge) */}
      {currentUser && (
        <div className="p-3 border-t border-slate-200/80 dark:border-white/10">
          <div className={`p-2.5 rounded-2xl border flex items-center gap-2.5 ${
            currentUser.role === 'admin'
              ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60'
              : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
          }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              currentUser.role === 'admin' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-emerald-600 text-white'
            }`}>
              {currentUser.role === 'admin' ? <Shield className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
            </div>

            {!isCollapsed && (
              <div className="overflow-hidden flex-1 min-w-0">
                <div className="font-bold text-xs truncate text-foreground">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    currentUser.role === 'admin'
                      ? 'bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/70 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {currentUser.role === 'admin' ? 'Super Admin' : 'Support Agent'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer actions */}
      <div className="p-3 pb-8 border-t border-slate-200/80 dark:border-white/10 space-y-1">
        {/* Dark mode toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer text-xs font-semibold text-muted hover:text-foreground"
        >
          {isDarkMode ? (
            <Sun className={`w-4 h-4 text-amber-400 ${isCollapsed ? 'mx-auto' : ''}`} />
          ) : (
            <Moon className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : ''}`} />
          )}
          {!isCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout Button */}
        {currentUser && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 cursor-pointer text-xs font-semibold"
          >
            <LogOut className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>}
          </button>
        )}
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg shadow-lg"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <Menu className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
      </button>
      
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <aside 
        className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-[#0A0A0A] border-r border-slate-200 dark:border-white/10 shadow-2xl`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>
      
      {/* Desktop sidebar */}
      <aside 
        className={`hidden md:flex flex-col h-screen sticky top-0 border-r transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-white dark:bg-[#0A0A0A] border-slate-200 dark:border-white/10 shadow-xs`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
