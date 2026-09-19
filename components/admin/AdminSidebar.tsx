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
  { href: '/', label: 'Customer Chat', icon: MessageSquare },
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
    if (href === '/admin' || href === '/') {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isAgent = currentUser?.role === 'agent';
  
  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200/80 dark:border-white/10">
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md border border-white/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base leading-tight text-foreground tracking-tight">Knowrex</h1>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 uppercase">OS</span>
            </div>
            <p className="text-[11px] text-muted font-medium">Enterprise AI Portal</p>
          </div>
        )}
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
      <div className="p-3 border-t border-slate-200/80 dark:border-white/10 space-y-1">
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
        
        {/* Collapse button - desktop only */}
        <button
          type="button"
          onClick={() => setIsCollapsed(prev => !prev)}
          className="hidden md:flex w-full items-center gap-3 px-3 py-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer text-xs text-muted hover:text-foreground"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180 mx-auto' : ''}`} />
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>
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
        }`}
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-1"
        >
          <X className="w-5 h-5" style={{ color: 'var(--muted)' }} />
        </button>
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </aside>
      
      {/* Desktop sidebar */}
      <aside 
        className={`hidden md:flex flex-col h-screen sticky top-0 border-r transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border-color)'
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
