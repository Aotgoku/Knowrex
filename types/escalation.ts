// ============================================
// Type Definitions for Human Escalation System
// Phase 4: Enterprise Feature
// ============================================

/**
 * Urgency levels for escalations
 */
export type EscalationUrgency = 'low' | 'medium' | 'high' | 'critical';

/**
 * Status of an escalation
 */
export type EscalationStatus = 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';

/**
 * Reason why escalation was triggered
 */
export type EscalationReason = 
  | 'low_confidence'
  | 'no_documents'
  | 'conflicting_info'
  | 'user_requested'
  | 'repeated_question'
  | 'sensitive_topic';

/**
 * Knowledge base integration type
 */
export type KBIntegrationType = 'faq' | 'doc_update' | 'rule' | 'verified';

/**
 * Source document info for escalation context
 */
export interface EscalationSource {
  documentName: string;
  chunkId: string;
  score: number;
  text: string;
}

/**
 * Main Escalation interface
 */
export interface Escalation {
  id: string;
  conversationId: string;
  userId?: string;
  
  // Question Details
  userQuestion: string;
  context: ChatMessage[];          // Previous chat messages
  attemptedAnswer?: string;        // What AI tried to say
  
  // Confidence Metrics
  confidenceScore: number;         // 0-1 (e.g., 0.58)
  documentsSearched: number;       // How many docs checked
  topMatchScore: number;           // Best match found
  sourcesFound: EscalationSource[]; // Sources that were found
  
  // Classification
  reason: EscalationReason;        // Why escalated
  category?: string;               // "Product", "Policy", "Technical", etc.
  urgency: EscalationUrgency;
  tags: string[];
  
  // Status Tracking
  status: EscalationStatus;
  assignedTo?: string;             // Admin user ID
  assignedAt?: Date;
  
  // Resolution
  humanAnswer?: string;            // Admin's answer
  resolvedBy?: string;             // Admin name
  resolvedAt?: Date;
  resolutionNotes?: string;        // Internal notes
  
  // Knowledge Base Integration
  shouldAddToKB: boolean;
  addedToKB: boolean;
  kbIntegrationType?: KBIntegrationType;
  relatedDocuments: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // User Feedback
  userSatisfied?: boolean;
  userFeedback?: string;
  userNotified: boolean;
}

/**
 * Chat message for context
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Escalation trigger result
 */
export interface EscalationTriggerResult {
  shouldEscalate: boolean;
  reason: EscalationReason;
  urgency: EscalationUrgency;
  message: string;
}

/**
 * Create escalation request
 */
export interface CreateEscalationRequest {
  userQuestion: string;
  context: ChatMessage[];
  attemptedAnswer?: string;
  confidenceScore: number;
  documentsSearched: number;
  topMatchScore: number;
  sourcesFound: EscalationSource[];
  reason: EscalationReason;
  urgency: EscalationUrgency;
  category?: string;
  tags?: string[];
  conversationId?: string;
  userId?: string;
}

/**
 * Resolve escalation request
 */
export interface ResolveEscalationRequest {
  humanAnswer: string;
  resolvedBy: string;
  resolutionNotes?: string;
  addToKB: boolean;
  kbIntegrationType?: KBIntegrationType;
  targetDocument?: string;
  category?: string;
  tags?: string[];
}

/**
 * Assign escalation request
 */
export interface AssignEscalationRequest {
  assignedTo: string;
}

/**
 * Escalation stats
 */
export interface EscalationStats {
  total: number;
  pending: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  avgResolutionTimeHours: number;
  userSatisfactionRate: number;
  addedToKBCount: number;
  byCategory: Record<string, number>;
  byUrgency: Record<EscalationUrgency, number>;
  recentTrend: 'increasing' | 'stable' | 'decreasing';
}

/**
 * Escalation list response
 */
export interface EscalationListResponse {
  success: boolean;
  escalations: Escalation[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Escalation filter options
 */
export interface EscalationFilters {
  status?: EscalationStatus;
  urgency?: EscalationUrgency;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  assignedTo?: string;
}

/**
 * Escalation sort options
 */
export type EscalationSortBy = 'newest' | 'oldest' | 'urgency' | 'confidence';

/**
 * Categories for escalations
 */
export const ESCALATION_CATEGORIES = [
  'General Inquiry',
  'Product Questions',
  'Policy & Procedures',
  'Technical Support',
  'Billing & Payments',
  'Refunds & Returns',
  'Account Management',
  'Legal & Compliance',
  'Other'
] as const;

/**
 * Keywords that trigger immediate escalation
 */
export const ESCALATION_KEYWORDS = [
  'speak to human',
  'talk to person',
  'talk to someone',
  'real person',
  'human agent',
  'not helpful',
  'wrong answer',
  'incorrect',
  'escalate',
  'supervisor',
  'manager'
] as const;

/**
 * Sensitive topics requiring human review
 */
export const SENSITIVE_TOPICS = [
  'legal',
  'lawsuit',
  'sue',
  'lawyer',
  'attorney',
  'medical',
  'health advice',
  'financial advice',
  'investment',
  'emergency',
  'urgent',
  'complaint',
  'harassment',
  'discrimination'
] as const;

/**
 * Confidence thresholds
 */
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.55,      // Above this = confident answer (lowered from 0.65)
  MEDIUM: 0.35,    // Between medium and high = answer with caution
  LOW: 0.20,       // Below this = auto-escalate (lowered from 0.25)
} as const;

/**
 * Notification for admin
 */
export interface EscalationNotification {
  id: string;
  type: 'new_escalation' | 'assigned' | 'resolved' | 'urgent';
  escalationId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

/**
 * FAQ Entry created from escalation
 */
export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  sourceEscalationId: string;
  createdAt: Date;
  updatedAt: Date;
}
