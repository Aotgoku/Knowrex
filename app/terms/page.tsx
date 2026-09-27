'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Scale, 
  Moon, 
  Sun,
  Sparkles,
  Zap
} from 'lucide-react';

export default function TermsOfServicePage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            <span>Enterprise Terms of Service</span>
          </div>
          <h1 className="font-instrument text-4xl sm:text-6xl tracking-tight text-foreground">
            Terms of Service & SLA
          </h1>
          <p className="text-sm font-mono text-muted-foreground">
            Effective: March 2026 • Agreement Reference: KNX-TERMS-ENTERPRISE
          </p>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            These terms govern the use of the Knowrex AI Autonomous Support Engine, Pinecone Cloud Vector retrieval services, and realtime human escalation infrastructure.
          </p>
        </div>

        {/* SLA & Service Commitments Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl glass-panel border border-border">
            <div className="text-[11px] font-mono text-indigo-400 font-bold uppercase mb-1">Service SLA</div>
            <div className="font-mono text-2xl font-bold text-foreground">99.9% Uptime</div>
            <p className="text-[11px] text-muted-foreground mt-1">Multi-AZ Pinecone Cloud Serverless vector redundancy.</p>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-border">
            <div className="text-[11px] font-mono text-purple-400 font-bold uppercase mb-1">Defense Intercept</div>
            <div className="font-mono text-2xl font-bold text-foreground">&lt; 5.0ms</div>
            <p className="text-[11px] text-muted-foreground mt-1">Sub-5ms input sanitizer and injection firewall.</p>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-border">
            <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase mb-1">Zero Hallucination</div>
            <div className="font-mono text-2xl font-bold text-foreground">Grounded Triad</div>
            <p className="text-[11px] text-muted-foreground mt-1">Strict citation binding to uploaded documentation.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground border-t border-border pt-10">
          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              1. Provision of Enterprise Autonomous Services
            </h2>
            <p>
              Knowrex grants customers a non-exclusive, worldwide subscription to access and deploy the Knowrex RAG engine, customer chat portal, and operations command center. The service includes automated vector indexing, semantic search, multimodal image diagnosis, and live WebSocket agent escalation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              2. Acceptable Use & AI Safety Compliance
            </h2>
            <p>
              Customers agree not to utilize Knowrex to intentionally inject malicious payloads, conduct denial-of-service attacks against vector indexes, or bypass automated guardrails. Knowrex reserves the right to rate-limit or terminate sessions that repeatedly trigger prompt injection firewalls or automated security red-lines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              3. Service Level Agreement (SLA) & Credits
            </h2>
            <p>
              Knowrex commits to maintaining a minimum of 99.9% Monthly Uptime for vector retrieval and API inference endpoints. In the event of an unplanned degradation exceeding SLA parameters, eligible enterprise accounts receive proportional service credits against their billing cycle.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              4. Intellectual Property & Document Ownership
            </h2>
            <p>
              You retain all ownership, copyright, and intellectual property rights in and to all documents, knowledge bases, and custom policies uploaded into Knowrex. Knowrex claims zero intellectual property rights over customer vector data or agent resolutions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-instrument text-2xl text-foreground font-normal">
              5. Legal & Corporate Notices
            </h2>
            <p>
              For legal inquiries, master services agreements (MSA), or enterprise terms amendments:
            </p>
            <div className="p-4 rounded-xl border border-border bg-card/60 font-mono text-xs text-foreground">
              legal@knowrex.ai • Subject: Enterprise MSA Inquiry
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
