'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  FileText, 
  Settings, 
  Menu, 
  X,
  ChevronLeft,
  LayoutDashboard,
  Moon,
  Sun,
  Database,
  Users,
  BarChart2
} from 'lucide-react';

// ============================================
// AdminSidebar Component
// Navigation sidebar for admin pages
// ============================================

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/documents', label: 'Documents', icon: FileText },
  { href: '/admin/vectors', label: 'Vector DB', icon: Database, badge: 'FREE' },
  { href: '/admin/escalations', label: 'Escalations', icon: Users, badge: 'NEW' },
  { href: '/admin/escalations/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/', label: 'Chat', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
  
  const isActive = (href: string) => {
    // Exact match for root paths
    if (href === '/admin' || href === '/') {
      return pathname === href;
    }
    // For nested routes like /admin/documents, check if pathname starts with href
    return pathname === href || pathname.startsWith(href + '/');
  };
  
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>Knowrex</h1>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Admin Panel</p>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                active 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              style={!active ? { color: 'var(--foreground)' } : {}}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && (
                <span className="font-medium flex-1">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-green-500/10 text-green-600">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer actions */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--border-color)' }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 btn-press"
          style={{ color: 'var(--foreground)' }}
        >
          {isDarkMode ? (
            <Sun className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'mx-auto' : ''}`} style={{ transform: isDarkMode ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
          ) : (
            <Moon className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'mx-auto' : ''}`} style={{ transform: !isDarkMode ? 'rotate(0deg)' : 'rotate(90deg)' }} />
          )}
          {!isCollapsed && <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        
        {/* Collapse button - desktop only */}
        <button
          onClick={() => setIsCollapsed(prev => !prev)}
          className="hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          style={{ color: 'var(--muted)' }}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180 mx-auto' : ''}`} />
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
