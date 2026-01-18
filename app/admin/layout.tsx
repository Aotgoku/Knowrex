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
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
