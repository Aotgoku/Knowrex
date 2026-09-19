'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Headphones, Lock, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'demo' | 'custom'>('demo');

  const handleLogin = async (roleOrEmail: { role?: 'admin' | 'agent'; email?: string; password?: string }) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleOrEmail)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      const user = data.user;
      let targetUrl = redirectTarget;

      if (!targetUrl || targetUrl === '/admin/login') {
        targetUrl = user.role === 'agent' ? '/admin/escalations' : '/admin';
      }

      router.push(targetUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong during sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12" style={{ backgroundColor: 'var(--background)' }}>
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Knowrex Workspace
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Role-Based Access Control & Operations Portal
          </p>
        </div>

        {/* Card Container */}
        <div 
          className="rounded-2xl border shadow-2xl p-6 sm:p-8 backdrop-blur-sm"
          style={{ 
            backgroundColor: 'var(--card-bg, #ffffff)', 
            borderColor: 'var(--border-color, #e2e8f0)' 
          }}
        >
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'demo'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Quick Demo Access
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Custom Sign In
            </button>
          </div>

          {activeTab === 'demo' ? (
            <div className="space-y-4">
              <div className="text-xs text-muted-foreground mb-1">
                Select a role to experience the distinct permission levels:
              </div>

              {/* Super Admin Option */}
              <button
                onClick={() => handleLogin({ role: 'admin' })}
                disabled={loading}
                className="w-full text-left p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 hover:border-indigo-500 transition-all group flex items-start justify-between cursor-pointer disabled:opacity-50"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      Super Admin
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Full Control
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Manage documents, wipe/sync Pinecone DB & full settings.
                    </p>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
                      Sarah Connor • admin@knowrex.ai
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform shrink-0 mt-2" />
              </button>

              {/* Support Agent Option */}
              <button
                onClick={() => handleLogin({ role: 'agent' })}
                disabled={loading}
                className="w-full text-left p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10 hover:border-emerald-500 transition-all group flex items-start justify-between cursor-pointer disabled:opacity-50"
              >
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      Support Agent
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Human-in-the-Loop
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Resolve customer escalations & publish Knowledge Loop FAQs.
                    </p>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      Alex Rivera • agent@knowrex.ai
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform shrink-0 mt-2" />
              </button>
            </div>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin({ email, password });
              }} 
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ borderColor: 'var(--border-color)' }}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Tip: Include &quot;admin&quot; in email for Admin role, otherwise Agent.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ borderColor: 'var(--border-color)' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In to Workspace'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Return to Chat */}
          <div className="mt-8 pt-4 border-t text-center" style={{ borderColor: 'var(--border-color)' }}>
            <Link 
              href="/"
              className="text-xs text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 font-medium inline-flex items-center gap-1.5"
            >
              ← Return to Customer Chat Interface
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: 'var(--background)' }}>
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
