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
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shrink-0">
          <FileText className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-bold text-lg leading-tight" style={{ color: 'var(--foreground)' }}>Knowrex</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Operations Portal</p>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isRestrictedForAgent = isAgent && item.adminOnly;
          
          if (isRestrictedForAgent) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed select-none"
                title="Restricted: Super Admin permission required"
              >
                <Lock className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && (
                  <span className="font-medium flex-1 text-sm">{item.label}</span>
                )}
                {!isCollapsed && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-amber-600 uppercase">
                    Admin Only
                  </span>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                active 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              style={!active ? { color: 'var(--foreground)' } : {}}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && (
                <span className="font-medium flex-1 text-sm truncate">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Card (RBAC Badge) */}
      {currentUser && (
        <div className="p-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
            currentUser.role === 'admin'
              ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50'
              : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
              currentUser.role === 'admin' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-emerald-600 text-white'
            }`}>
              {currentUser.role === 'admin' ? <Shield className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
            </div>

            {!isCollapsed && (
              <div className="overflow-hidden flex-1">
                <div className="font-semibold text-xs truncate" style={{ color: 'var(--foreground)' }}>
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    currentUser.role === 'admin'
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
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
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border-color)' }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer text-sm"
          style={{ color: 'var(--foreground)' }}
        >
          {isDarkMode ? (
            <Sun className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'mx-auto' : ''}`} />
          ) : (
            <Moon className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'mx-auto' : ''}`} />
          )}
          {!isCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Logout Button */}
        {currentUser && (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 cursor-pointer text-sm"
          >
            <LogOut className={`w-4 h-4 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>}
          </button>
        )}
        
        {/* Collapse button - desktop only */}
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="hidden md:flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer text-sm"
          style={{ color: 'var(--muted)' }}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180 mx-auto' : ''}`} />
          {!isCollapsed && <span>Collapse</span>}
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
