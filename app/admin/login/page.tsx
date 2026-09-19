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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Dynamic Ambient Background Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in-up duration-500">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-4 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-xl border border-white/25">
              <Lock className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Knowrex Workspace
          </h1>
          <p className="text-xs sm:text-sm mt-1 text-muted">
            Role-Based Access Control & Operations Portal
          </p>
        </div>

        {/* Obsidian Glass Card Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-2xl">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 mb-6 text-xs font-semibold border border-slate-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Quick Demo Access
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Custom Sign In
            </button>
          </div>

          {activeTab === 'demo' ? (
            <div className="space-y-3.5">
              <div className="text-[11px] font-medium text-muted mb-1">
                Select a verified profile to test granular RBAC capabilities:
              </div>

              {/* Super Admin Option */}
              <button
                type="button"
                onClick={() => handleLogin({ role: 'admin' })}
                disabled={loading}
                className="w-full text-left p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-500/20 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-transparent dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-transparent hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group flex items-start justify-between cursor-pointer disabled:opacity-50"
              >
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                      Super Admin
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        Full Control
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">
                      Manage documents, Pinecone DB index, Eval Harness & settings.
                    </p>
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1 font-semibold flex items-center gap-1.5">
                      <span>Sarah Connor</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] opacity-80">admin@knowrex.ai</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform shrink-0 mt-2" />
              </button>

              {/* Support Agent Option */}
              <button
                type="button"
                onClick={() => handleLogin({ role: 'agent' })}
                disabled={loading}
                className="w-full text-left p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-500/20 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-transparent hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all group flex items-start justify-between cursor-pointer disabled:opacity-50"
              >
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                      Support Agent
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Human-in-the-Loop
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">
                      Resolve customer escalations & publish Knowledge Loop FAQs.
                    </p>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1.5">
                      <span>Alex Rivera</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] opacity-80">agent@knowrex.ai</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform shrink-0 mt-2" />
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
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-foreground"
                />
                <p className="text-[11px] text-muted mt-1">
                  Tip: Include &quot;admin&quot; in email for Admin role, otherwise Agent.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-foreground"
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

          {/* Customer Chat Jump Link */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center gap-1.5"
            >
              <span>Switch to Customer Chat Interface</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Enterprise Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            256-Bit Encrypted RBAC
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
            Pinecone Cloud Vector RAG
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
            Active AI Safety Guardrails
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
