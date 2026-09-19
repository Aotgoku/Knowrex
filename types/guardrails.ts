// ============================================
// Types for Enterprise AI Guardrails & Evaluation Harness
// ============================================

import { RAGSource } from '@/lib/ragSystem';

/**
 * Result of running input safety guardrails
 */
export interface InputGuardrailResult {
  allowed: boolean;
  isJailbreak: boolean;
  detectedThreats: string[];
  piiRedacted: boolean;
  detectedPII: string[];
  originalText: string;
  sanitizedText: string;
  reason?: string;
}

/**
 * Claim verification breakdown for Output Groundedness
 */
export interface GroundedClaim {
  claim: string;
  isGrounded: boolean;
  citationChunkId?: string;
  sourceDocName?: string;
  confidence: number;
}

/**
 * Result of evaluating output hallucination & groundedness
 */
export interface OutputGuardrailResult {
  faithfulnessScore: number; // 0 to 100
  isGrounded: boolean;
  hallucinationRisk: 'low' | 'medium' | 'high';
  totalClaimsChecked: number;
  groundedClaimsCount: number;
  claims: GroundedClaim[];
  flaggedHallucinations: string[];
  evaluationSummary: string;
  verifiedAt: string;
}

/**
 * Combined guardrail metadata attached to a chat message
 */
export interface MessageGuardrailData {
  inputSafety: {
    passed: boolean;
    piiMasked: boolean;
    threatsDetected: string[];
  };
  outputGroundedness: OutputGuardrailResult;
  cached?: boolean;
}

/**
 * Individual test case for RAG Evaluation Harness
 */
export interface EvaluationTestCase {
  id: string;
  category: 'policy_accuracy' | 'jailbreak_defense' | 'hallucination_trap' | 'support_flow';
  name: string;
  query: string;
  expectedBehavior: 'grounded_answer' | 'block_or_refuse' | 'escalate_or_clarify';
  expectedKeywords?: string[];
  prohibitedKeywords?: string[];
}

/**
 * Result of running a single evaluation test case
 */
export interface EvaluationTestResult {
  testId: string;
  name: string;
  category: string;
  query: string;
  status: 'passed' | 'warning' | 'failed';
  contextRelevance: number; // 0 - 100%
  groundednessScore: number; // 0 - 100%
  answerRelevance: number; // 0 - 100%
  latencyMs: number;
  generatedAnswer: string;
  notes: string;
}

/**
 * Summary scorecard of an entire evaluation run
 */
export interface EvaluationRunSummary {
  runId: string;
  timestamp: string;
  totalTests: number;
  passedTests: number;
  warningTests: number;
  failedTests: number;
  avgContextRelevance: number; // RAG Triad Metric 1
  avgGroundedness: number;     // RAG Triad Metric 2
  avgAnswerRelevance: number;  // RAG Triad Metric 3
  overallScore: number;
  testResults: EvaluationTestResult[];
}
