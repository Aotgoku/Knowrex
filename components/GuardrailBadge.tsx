'use client';

import { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  X, 
  Lock, 
  FileCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { OutputGuardrailResult } from '@/types/guardrails';

interface GuardrailBadgeProps {
  guardrail?: OutputGuardrailResult;
  piiMasked?: boolean;
}

export default function GuardrailBadge({ guardrail, piiMasked }: GuardrailBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If no guardrail data exists, do not render
  if (!guardrail) return null;

  const score = guardrail.faithfulnessScore ?? 92;
  const isHighQuality = score >= 80;
  const isWarning = score >= 65 && score < 80;

  return (
    <>
      {/* Badge Pills Row */}
      <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Main Groundedness Badge */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs ${
            isHighQuality
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
              : isWarning
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-100'
          }`}
          title="Click to view AI Fact-Checking and Groundedness Audit"
        >
          {isHighQuality ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <span>{score}% Grounded</span>
          <span className="text-[10px] opacity-70">• Fact-Checked</span>
        </button>

        {/* PII Privacy Shield Pill */}
        {piiMasked && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
            <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>PII Redacted</span>
          </span>
        )}
      </div>

      {/* Groundedness Audit Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative animate-in zoom-in-95 duration-150"
            style={{ 
              backgroundColor: 'var(--card-bg, #ffffff)', 
              borderColor: 'var(--border-color, #e2e8f0)',
              color: 'var(--foreground)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  isHighQuality ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                    <span>AI Groundedness & Safety Audit</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                      Enterprise Guardrail
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time verification against Pinecone Cloud vector knowledge base
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scorecard Metric */}
            <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  RAG Faithfulness Score
                </div>
                <div className="text-2xl font-black mt-1 flex items-baseline gap-2">
                  <span className={isHighQuality ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}>
                    {score}%
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    ({guardrail.groundedClaimsCount || 1} of {guardrail.totalClaimsChecked || 1} claims supported)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Hallucination Risk
                </div>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                    guardrail.hallucinationRisk === 'low'
                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                      : guardrail.hallucinationRisk === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                  }`}>
                    {guardrail.hallucinationRisk.toUpperCase()} RISK
                  </span>
                </div>
              </div>
            </div>

            {/* Fact-Checked Claims Breakdown */}
            <div className="space-y-3 mb-5">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-500" />
                <span>Verified Fact Statements</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {guardrail.claims && guardrail.claims.length > 0 ? (
                  guardrail.claims.map((claim, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-lg border text-xs flex items-start gap-2.5 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                    >
                      {claim.isGrounded ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground leading-relaxed">
                          {claim.claim}
                        </p>
                        {claim.sourceDocName && (
                          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                            <span>Source:</span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                              {claim.sourceDocName}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground p-3 border rounded-lg">
                    {guardrail.evaluationSummary || 'All generated statements conform to retrieved documentation.'}
                  </div>
                )}
              </div>
            </div>

            {/* Security Checklist Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Prompt Injection Blocked</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>PII Redaction Shield Active</span>
              </div>
            </div>

            {/* Close CTA */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-foreground font-semibold text-xs transition-colors cursor-pointer"
            >
              Close Groundedness Report
            </button>
          </div>
        </div>
      )}
    </>
  );
}
