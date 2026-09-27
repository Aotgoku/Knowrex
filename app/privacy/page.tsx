'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Database, 
  EyeOff, 
  CheckCircle2, 
  Server, 
  Clock,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';

export default function PrivacyPolicyPage() {
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />

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
            href="/chat"
            className="px-4 py-1.5 rounded-full bg-foreground text-background font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Launch Chat
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-12">
        {/* Header Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enterprise Sovereign Privacy</span>
          </div>
          <h1 className="font-instrument text-4xl sm:text-6xl tracking-tight text-foreground">
            Enterprise Privacy Policy
          </h1>
          <p className="text-sm font-mono text-muted-foreground">
            Last Updated: March 2026 • Document Ref: KNX-PRIVACY-V2.4
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Knowrex AI is engineered on zero-trust enterprise principles. We believe enterprise AI must be deterministic, auditable, and fundamentally incapable of exposing or training on customer corporate intelligence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-border space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase">
              <EyeOff className="w-4 h-4" />
              <span>Zero-Training Guarantee</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your company documents, support transcripts, and user inquiries are never used to train or fine-tune public LLMs (including Gemini, Claude, or GPT).
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-border space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase">
              <Server className="w-4 h-4" />
              <span>Tenant Cloud Isolation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All 384-dimensional vector embeddings are strictly partitioned in dedicated namespaces on Pinecone Serverless in AWS us-east-1.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-border space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <Lock className="w-4 h-4" />
              <span>Luhn PII Scrubbing</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sensitive data including credit card numbers (validated via Mod-10 algorithm) and SSNs are redacted at the proxy layer before reaching vector storage.
            </p>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-border space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <Clock className="w-4 h-4" />
              <span>Configurable Retention</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Session transcripts expire automatically based on enterprise retention SLAs, with immediate 1-click vector wipe supported for compliance.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground border-t border-border pt-10">
          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              1. Information Collection & Vectorization
            </h2>
            <p>
              Knowrex collects and processes only the documentation and queries explicitly submitted by authorized administrators and end-users. When files (PDFs, DOCX, Markdown, Text) are ingested through the Knowrex Knowledge Base:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Documents are chunked into discrete semantic passages of 500 tokens with 50-token overlap.</li>
              <li>Passages are converted into high-density 384-dimensional embeddings using Xenova MiniLM models locally or via dedicated private endpoints.</li>
              <li>Vectors are transmitted via encrypted TLS 1.3 to your dedicated Pinecone Serverless cluster.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              2. Data Encryption In-Transit and At-Rest
            </h2>
            <p>
              Security is implemented at every architectural layer:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>In-Transit:</strong> All communication between end-users, Next.js servers, Supabase WebSockets, and Pinecone is enforced using TLS 1.3 with HSTS headers.</li>
              <li><strong>At-Rest:</strong> Database stores, session tokens, and vector storage indices are encrypted using military-grade AES-256 encryption.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              3. Human-in-the-Loop & Escalation Safeguards
            </h2>
            <p>
              When a query triggers an escalation (due to confidence scores falling below 70% or explicit customer requests), the incident is dispatched via secure Supabase WebSockets strictly to authorized internal support personnel. Support agents are authenticated via role-based access control (RBAC), and verified solutions can be committed back into vector memory only with authorized administrator sign-off.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              4. Sovereign Deletion & Data Portability
            </h2>
            <p>
              You maintain complete sovereignty over your knowledge base. At any time, authenticated administrators can export knowledge audits in JSON format or trigger an immediate cascade deletion of all vectorized chunks from the Pinecone Cloud index.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              5. Contact Enterprise Privacy Desk
            </h2>
            <p>
              For Data Protection Agreements (DPA), SOC-2 Type II attestation packets, or custom on-premise air-gapped deployment inquiries, reach out directly to:
            </p>
            <div className="p-4 rounded-xl border border-border bg-card/60 font-mono text-xs text-foreground">
              privacy@knowrex.ai • Subject: Enterprise DPA Inquiry
            </div>
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
