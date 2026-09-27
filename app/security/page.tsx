'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Database, 
  Zap, 
  Server, 
  FileCheck2, 
  Cpu, 
  Activity,
  CheckCircle2,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';

export default function SecurityArchitecturePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('knowrex-dark-mode');
    if (saved === 'false') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('knowrex-dark-mode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 relative font-sans ${
      isDarkMode ? 'bg-[#030303] text-zinc-100' : 'bg-[#F4F4F0] text-zinc-900'
    }`}>
      {/* Ambient Horizon Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b backdrop-blur-xl transition-colors ${
        isDarkMode ? 'bg-[#030303]/80 border-white/10' : 'bg-white/80 border-black/10'
      }`}>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-inherit glass-button text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-instrument text-2xl text-foreground">Knowrex</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full glass-button text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <Link
            href="/admin/evaluations"
            className="px-4 py-1.5 rounded-full bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Run RAG Audit
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-12">
        {/* Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Architecture & Compliance</span>
          </div>
          <h1 className="font-instrument text-4xl sm:text-6xl tracking-tight text-foreground">
            Zero-Trust AI Defense Layer
          </h1>
          <p className="text-sm font-mono text-muted-foreground">
            Audit Level: Enterprise Grade • Specification Ref: KNX-SEC-ARCH-2026
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Knowrex is architected so that untrusted user input never touches third-party foundation models without undergoing deterministic regex sanitization, PII scrubbing, and semantic vector boundary checks.
          </p>
        </div>

        {/* Technical Architecture Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-indigo-400">Layer 1 · Input Firewall</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">&lt; 3.5ms</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm">Deterministic Sanitization & Injection Interception</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Catches delimiter exploitation, base64 obfuscations, and prompt injection attempts before tokenization. Evaluates credit card numbers with the Luhn modulus-10 algorithm.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-purple-400">Layer 2 · Vector Boundary</span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">&lt; 42ms</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm">Pinecone Serverless Cloud Grounding</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Only authentic document chunks from your isolated tenant in AWS us-east-1 are supplied to the generation context, eliminating open-ended model drift.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-emerald-400">Layer 3 · Output Triad</span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Automated</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm">Groundedness & Faithfulness Verification</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every synthesized claim is bound directly to chunk citations. If confidence falls below 70%, the query automatically escalates to a live support agent.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-border space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-amber-400">Layer 4 · Realtime Handoff</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">WebSockets</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm">Supabase RBAC Realtime Desk</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              End-to-end encrypted event streaming connects customer sessions directly with authenticated human specialists without polling delays.
            </p>
          </div>
        </div>

        {/* Detailed Compliance Whitepaper Body */}
        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground border-t border-border pt-10">
          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              Prompt Injection Defense Architecture
            </h2>
            <p>
              Traditional AI applications pass raw user queries straight into the system prompt, leaving them susceptible to system prompt leakage, instruction hijacking, and unauthorized actions. Knowrex implements a dual-stage firewall:
            </p>
            <div className="p-4 rounded-xl border border-border bg-black/40 font-mono text-xs text-foreground space-y-1">
              <div className="text-indigo-400">// Stage 1: Fast Regex & Delimiter Interceptor (lib/guardrails.ts)</div>
              <div>if (INJECTION_PATTERNS.some(pattern =&gt; pattern.test(input))) &#123;</div>
              <div className="pl-4 text-rose-400">return &#123; safe: false, reason: &apos;PROMPT_INJECTION_DETECTED&apos; &#125;;</div>
              <div>&#125;</div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              Luhn Modulus-10 PII Sanitization
            </h2>
            <p>
              Unlike dumb regex masking that produces high false positives, Knowrex verifies potential 13-19 digit sequences using the real <strong>Luhn Modulus-10 algorithm</strong>. If a sequence mathematically corresponds to a valid Visa, Mastercard, Amex, or Discover card number, it is scrubbed before any vector query or storage occurs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              SOC-2 Type II Readiness & Encryption Controls
            </h2>
            <p>
              Knowrex infrastructure adheres to the five trust services criteria of SOC-2: Security, Availability, Processing Integrity, Confidentiality, and Privacy. All tokens, secrets, and environment variables are secured using secret management systems with automated rotation capabilities.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-xs font-mono text-muted-foreground">
        © {new Date().getFullYear()} Knowrex AI Inc. Grounded Sovereign Intelligence.
      </footer>
    </div>
  );
}
