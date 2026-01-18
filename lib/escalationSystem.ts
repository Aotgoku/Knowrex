// ============================================
// Human Escalation System - Core Library
// Phase 4: Enterprise Feature
// ============================================

import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import {
  Escalation,
  EscalationStatus,
  EscalationReason,
  EscalationUrgency,
  EscalationTriggerResult,
  CreateEscalationRequest,
  ResolveEscalationRequest,
  AssignEscalationRequest,
  EscalationStats,
  EscalationFilters,
  EscalationSortBy,
  EscalationSource,
  ChatMessage,
  ESCALATION_KEYWORDS,
  SENSITIVE_TOPICS,
  CONFIDENCE_THRESHOLDS
} from '@/types/escalation';

// Data directory for escalations
const ESCALATIONS_DIR = path.join(process.cwd(), 'data', 'escalations');

/**
 * Ensure the escalations directory exists
 */
async function ensureEscalationsDir(): Promise<void> {
  try {
    await fs.access(ESCALATIONS_DIR);
  } catch {
    await fs.mkdir(ESCALATIONS_DIR, { recursive: true });
  }
}

/**
 * Get file path for an escalation
 */
function getEscalationPath(id: string): string {
  return path.join(ESCALATIONS_DIR, `${id}.json`);
}

// ============================================
// ESCALATION TRIGGER DETECTION
// ============================================

/**
 * Check if a query contains user-requested escalation keywords
 */
function containsEscalationKeywords(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return ESCALATION_KEYWORDS.some(keyword => lowerQuery.includes(keyword));
}

/**
 * Check if a query contains sensitive topics
 */
function containsSensitiveTopics(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return SENSITIVE_TOPICS.some(topic => lowerQuery.includes(topic));
}

/**
 * Determine urgency based on confidence and other factors
 */
function determineUrgency(
  confidenceScore: number,
  reason: EscalationReason,
  hasSensitiveTopics: boolean
): EscalationUrgency {
  if (hasSensitiveTopics || reason === 'sensitive_topic') {
    return 'high';
  }
  if (reason === 'user_requested') {
    return 'medium';
  }
  if (confidenceScore < 0.2) {
    return 'high';
  }
  if (confidenceScore < 0.35) {
    return 'medium';
  }
  return 'low';
}

/**
 * Main function to check if a response should be escalated
 */
export function shouldEscalate(
  userQuery: string,
  confidenceScore: number,
  documentsSearched: number,
  topMatchScore: number,
  sourcesFound: number
): EscalationTriggerResult {
  // 1. User explicitly requested human
  if (containsEscalationKeywords(userQuery)) {
    return {
      shouldEscalate: true,
      reason: 'user_requested',
      urgency: 'medium',
      message: 'You requested to speak with a human. Let me connect you with someone who can help.'
    };
  }

  // 2. Sensitive topic detected
  if (containsSensitiveTopics(userQuery)) {
    return {
      shouldEscalate: true,
      reason: 'sensitive_topic',
      urgency: 'high',
      message: 'This topic requires a human expert. Let me get someone to assist you.'
    };
  }

  // 3. No documents found at all
  if (documentsSearched === 0 || sourcesFound === 0) {
    return {
      shouldEscalate: true,
      reason: 'no_documents',
      urgency: 'medium',
      message: 'I don\'t have information on this topic. Let me escalate to someone who can help.'
    };
  }

  // 4. Low confidence score
  if (confidenceScore < CONFIDENCE_THRESHOLDS.LOW) {
    return {
      shouldEscalate: true,
      reason: 'low_confidence',
      urgency: determineUrgency(confidenceScore, 'low_confidence', false),
      message: 'I\'m not confident in my answer. Let me connect you with a specialist.'
    };
  }

  // 5. Below threshold for confident answer
  if (confidenceScore < CONFIDENCE_THRESHOLDS.HIGH) {
    // Don't auto-escalate, but flag for potential escalation
    return {
      shouldEscalate: false,
      reason: 'low_confidence',
      urgency: 'low',
      message: `My confidence is ${Math.round(confidenceScore * 100)}%. You can request human help if needed.`
    };
  }

  // Confident answer - no escalation needed
  return {
    shouldEscalate: false,
    reason: 'low_confidence',
    urgency: 'low',
    message: ''
  };
}

/**
 * Check if confidence warrants showing escalation option
 */
export function shouldOfferEscalation(confidenceScore: number): boolean {
  return confidenceScore < CONFIDENCE_THRESHOLDS.HIGH;
}

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Create a new escalation
 */
export async function createEscalation(request: CreateEscalationRequest): Promise<Escalation> {
  await ensureEscalationsDir();

  const now = new Date();
  const escalation: Escalation = {
    id: uuidv4(),
    conversationId: request.conversationId || uuidv4(),
    userId: request.userId,
    
    userQuestion: request.userQuestion,
    context: request.context,
    attemptedAnswer: request.attemptedAnswer,
    
    confidenceScore: request.confidenceScore,
    documentsSearched: request.documentsSearched,
    topMatchScore: request.topMatchScore,
    sourcesFound: request.sourcesFound,
    
    reason: request.reason,
    category: request.category,
    urgency: request.urgency,
    tags: request.tags || [],
    
    status: 'pending',
    
    shouldAddToKB: false,
    addedToKB: false,
    relatedDocuments: request.sourcesFound.map(s => s.documentName),
    
    createdAt: now,
    updatedAt: now,
    
    userNotified: false
  };

  // Save to file
  await fs.writeFile(
    getEscalationPath(escalation.id),
    JSON.stringify(escalation, null, 2)
  );

  return escalation;
}

/**
 * Get an escalation by ID
 */
export async function getEscalation(id: string): Promise<Escalation | null> {
  try {
    const data = await fs.readFile(getEscalationPath(id), 'utf-8');
    const escalation = JSON.parse(data);
    
    // Parse dates
    escalation.createdAt = new Date(escalation.createdAt);
    escalation.updatedAt = new Date(escalation.updatedAt);
    if (escalation.assignedAt) escalation.assignedAt = new Date(escalation.assignedAt);
    if (escalation.resolvedAt) escalation.resolvedAt = new Date(escalation.resolvedAt);
    
    return escalation;
  } catch {
    return null;
  }
}

/**
 * Update an escalation
 */
export async function updateEscalation(id: string, updates: Partial<Escalation>): Promise<Escalation | null> {
  const escalation = await getEscalation(id);
  if (!escalation) return null;

  const updated: Escalation = {
    ...escalation,
    ...updates,
    updatedAt: new Date()
  };

  await fs.writeFile(
    getEscalationPath(id),
    JSON.stringify(updated, null, 2)
  );

  return updated;
}

/**
 * Delete an escalation
 */
export async function deleteEscalation(id: string): Promise<boolean> {
  try {
    await fs.unlink(getEscalationPath(id));
    return true;
  } catch {
    return false;
  }
}

/**
 * List all escalations with optional filters
 */
export async function listEscalations(
  filters?: EscalationFilters,
  sortBy: EscalationSortBy = 'newest',
  page: number = 1,
  pageSize: number = 20
): Promise<{ escalations: Escalation[]; total: number; hasMore: boolean }> {
  await ensureEscalationsDir();

  // Read all escalation files
  const files = await fs.readdir(ESCALATIONS_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const escalations: Escalation[] = [];

  for (const file of jsonFiles) {
    try {
      const data = await fs.readFile(path.join(ESCALATIONS_DIR, file), 'utf-8');
      const escalation = JSON.parse(data);
      
      // Parse dates
      escalation.createdAt = new Date(escalation.createdAt);
      escalation.updatedAt = new Date(escalation.updatedAt);
      if (escalation.assignedAt) escalation.assignedAt = new Date(escalation.assignedAt);
      if (escalation.resolvedAt) escalation.resolvedAt = new Date(escalation.resolvedAt);
      
      escalations.push(escalation);
    } catch {
      // Skip invalid files
    }
  }

  // Apply filters
  let filtered = escalations;

  if (filters) {
    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    if (filters.urgency) {
      filtered = filtered.filter(e => e.urgency === filters.urgency);
    }
    if (filters.category) {
      filtered = filtered.filter(e => e.category === filters.category);
    }
    if (filters.assignedTo) {
      filtered = filtered.filter(e => e.assignedTo === filters.assignedTo);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(e => 
        e.userQuestion.toLowerCase().includes(searchLower) ||
        (e.attemptedAnswer && e.attemptedAnswer.toLowerCase().includes(searchLower)) ||
        e.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(e => e.createdAt >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(e => e.createdAt <= filters.dateTo!);
    }
  }

  // Sort
  const urgencyOrder: Record<EscalationUrgency, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3
  };

  switch (sortBy) {
    case 'newest':
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case 'oldest':
      filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      break;
    case 'urgency':
      filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
      break;
    case 'confidence':
      filtered.sort((a, b) => a.confidenceScore - b.confidenceScore);
      break;
  }

  // Paginate
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);
  const hasMore = start + pageSize < total;

  return { escalations: paginated, total, hasMore };
}

// ============================================
// ESCALATION ACTIONS
// ============================================

/**
 * Assign an escalation to an admin
 */
export async function assignEscalation(
  id: string,
  request: AssignEscalationRequest
): Promise<Escalation | null> {
  return updateEscalation(id, {
    assignedTo: request.assignedTo,
    assignedAt: new Date(),
    status: 'assigned'
  });
}

/**
 * Mark escalation as in progress
 */
export async function startEscalation(id: string): Promise<Escalation | null> {
  return updateEscalation(id, {
    status: 'in_progress'
  });
}

/**
 * Resolve an escalation with a human answer
 */
export async function resolveEscalation(
  id: string,
  request: ResolveEscalationRequest
): Promise<Escalation | null> {
  return updateEscalation(id, {
    humanAnswer: request.humanAnswer,
    resolvedBy: request.resolvedBy,
    resolvedAt: new Date(),
    resolutionNotes: request.resolutionNotes,
    status: 'resolved',
    shouldAddToKB: request.addToKB,
    kbIntegrationType: request.kbIntegrationType,
    category: request.category,
    tags: request.tags
  });
}

/**
 * Reject an escalation (not relevant, spam, etc.)
 */
export async function rejectEscalation(
  id: string,
  resolvedBy: string,
  reason: string
): Promise<Escalation | null> {
  return updateEscalation(id, {
    status: 'rejected',
    resolvedBy,
    resolvedAt: new Date(),
    resolutionNotes: reason
  });
}

/**
 * Mark user feedback
 */
export async function addUserFeedback(
  id: string,
  satisfied: boolean,
  feedback?: string
): Promise<Escalation | null> {
  return updateEscalation(id, {
    userSatisfied: satisfied,
    userFeedback: feedback
  });
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get escalation statistics
 */
export async function getEscalationStats(): Promise<EscalationStats> {
  const { escalations } = await listEscalations(undefined, 'newest', 1, 10000);

  const stats: EscalationStats = {
    total: escalations.length,
    pending: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    avgResolutionTimeHours: 0,
    userSatisfactionRate: 0,
    addedToKBCount: 0,
    byCategory: {},
    byUrgency: { low: 0, medium: 0, high: 0, critical: 0 },
    recentTrend: 'stable'
  };

  let totalResolutionTime = 0;
  let resolvedCount = 0;
  let satisfiedCount = 0;
  let feedbackCount = 0;

  for (const e of escalations) {
    // Count by status
    switch (e.status) {
      case 'pending': stats.pending++; break;
      case 'assigned': stats.assigned++; break;
      case 'in_progress': stats.inProgress++; break;
      case 'resolved': stats.resolved++; break;
      case 'rejected': stats.rejected++; break;
    }

    // Count by urgency
    stats.byUrgency[e.urgency]++;

    // Count by category
    const category = e.category || 'Uncategorized';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

    // Resolution time
    if (e.status === 'resolved' && e.resolvedAt && e.createdAt) {
      const resolutionTime = e.resolvedAt.getTime() - e.createdAt.getTime();
      totalResolutionTime += resolutionTime;
      resolvedCount++;
    }

    // Satisfaction
    if (e.userSatisfied !== undefined) {
      feedbackCount++;
      if (e.userSatisfied) satisfiedCount++;
    }

    // KB additions
    if (e.addedToKB) stats.addedToKBCount++;
  }

  // Calculate averages
  if (resolvedCount > 0) {
    stats.avgResolutionTimeHours = totalResolutionTime / resolvedCount / (1000 * 60 * 60);
  }
  if (feedbackCount > 0) {
    stats.userSatisfactionRate = satisfiedCount / feedbackCount;
  }

  // Calculate trend (compare last 7 days vs previous 7 days)
  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  const lastWeek = escalations.filter(e => e.createdAt.getTime() >= oneWeekAgo).length;
  const prevWeek = escalations.filter(e => 
    e.createdAt.getTime() >= twoWeeksAgo && e.createdAt.getTime() < oneWeekAgo
  ).length;

  if (lastWeek > prevWeek * 1.2) {
    stats.recentTrend = 'increasing';
  } else if (lastWeek < prevWeek * 0.8) {
    stats.recentTrend = 'decreasing';
  }

  return stats;
}

/**
 * Get pending escalations count
 */
export async function getPendingCount(): Promise<number> {
  const { escalations } = await listEscalations({ status: 'pending' }, 'newest', 1, 1);
  const { total } = await listEscalations({ status: 'pending' }, 'newest', 1, 10000);
  return total;
}

/**
 * Get escalations that should be added to KB
 */
export async function getKBPendingEscalations(): Promise<Escalation[]> {
  const { escalations } = await listEscalations(
    { status: 'resolved' },
    'newest',
    1,
    10000
  );
  
  return escalations.filter(e => e.shouldAddToKB && !e.addedToKB);
}

/**
 * Format escalation for display
 */
export function formatEscalationSummary(escalation: Escalation): string {
  const truncatedQuestion = escalation.userQuestion.length > 100
    ? escalation.userQuestion.substring(0, 100) + '...'
    : escalation.userQuestion;
  
  return `[${escalation.urgency.toUpperCase()}] ${truncatedQuestion}`;
}

/**
 * Get urgency color
 */
export function getUrgencyColor(urgency: EscalationUrgency): string {
  switch (urgency) {
    case 'critical': return 'red';
    case 'high': return 'orange';
    case 'medium': return 'yellow';
    case 'low': return 'green';
  }
}

/**
 * Get status badge color
 */
export function getStatusColor(status: EscalationStatus): string {
  switch (status) {
    case 'pending': return 'gray';
    case 'assigned': return 'blue';
    case 'in_progress': return 'yellow';
    case 'resolved': return 'green';
    case 'rejected': return 'red';
  }
}
