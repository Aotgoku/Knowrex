import AdminSidebar from '@/components/admin/AdminSidebar';

// ============================================
// Admin Layout
// Wraps all admin pages with sidebar navigation
// ============================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100/70 dark:bg-[#040406] text-slate-900 dark:text-zinc-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
