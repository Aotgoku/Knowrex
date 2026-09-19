import { supabase } from '@/lib/supabase';
import {
  Escalation,
  CreateEscalationRequest,
  EscalationFilters,
  EscalationSortBy,
  EscalationStats
} from '@/types/escalation';
import { v4 as uuidv4 } from 'uuid';

export async function createEscalationInDb(request: CreateEscalationRequest): Promise<Escalation> {
  const id = uuidv4();
  const now = new Date();

  const escalation: Escalation = {
    id,
    conversationId: request.conversationId || uuidv4(),
    userId: request.userId,
    userQuestion: request.userQuestion,
    context: request.context || [],
    attemptedAnswer: request.attemptedAnswer,
    confidenceScore: request.confidenceScore,
    documentsSearched: request.documentsSearched || 0,
    topMatchScore: request.topMatchScore || 0,
    sourcesFound: request.sourcesFound || [],
    reason: request.reason || 'low_confidence',
    urgency: request.urgency || 'medium',
    category: request.category,
    tags: request.tags || [],
    status: 'pending',
    shouldAddToKB: false,
    addedToKB: false,
    relatedDocuments: (request.sourcesFound || []).map(s => s.documentName),
    createdAt: now,
    updatedAt: now,
    userNotified: false
  };

  try {
    const { error } = await supabase.from('escalations').insert([{
      id: escalation.id,
      conversation_id: escalation.conversationId,
      user_question: escalation.userQuestion,
      attempted_answer: escalation.attemptedAnswer,
      confidence_score: escalation.confidenceScore,
      reason: escalation.reason,
      urgency: escalation.urgency,
      status: escalation.status,
      created_at: escalation.createdAt.toISOString(),
      updated_at: escalation.updatedAt.toISOString()
    }]);

    if (error) {
      console.warn('[EscalationDB] Supabase insert failed:', error.message);
    }
  } catch (err) {
    console.error('[EscalationDB] Insert exception:', err);
  }

  return escalation;
}

export async function getEscalationFromDb(id: string): Promise<Escalation | null> {
  try {
    const { data, error } = await supabase
      .from('escalations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      conversationId: data.conversation_id || '',
      userQuestion: data.user_question,
      context: [],
      attemptedAnswer: data.attempted_answer,
      confidenceScore: data.confidence_score || 0,
      documentsSearched: 0,
      topMatchScore: 0,
      sourcesFound: [],
      reason: data.reason,
      urgency: data.urgency,
      tags: [],
      status: data.status,
      humanAnswer: data.human_answer,
      resolvedBy: data.resolved_by,
      resolvedAt: data.resolved_at ? new Date(data.resolved_at) : undefined,
      shouldAddToKB: data.added_to_kb,
      addedToKB: data.added_to_kb,
      relatedDocuments: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      userNotified: false
    };
  } catch (err) {
    console.error('[EscalationDB] Get exception:', err);
    return null;
  }
}

export async function listEscalationsFromDb(
  filters?: EscalationFilters,
  sortBy: EscalationSortBy = 'newest',
  page: number = 1,
  pageSize: number = 20
): Promise<{ escalations: Escalation[]; total: number; hasMore: boolean }> {
  try {
    let query = supabase.from('escalations').select('*', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }
    if (filters?.search) {
      query = query.ilike('user_question', `%${filters.search}%`);
    }

    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sortBy === 'confidence') {
      query = query.order('confidence_score', { ascending: true });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error || !data) {
      return { escalations: [], total: 0, hasMore: false };
    }

    const escalations: Escalation[] = data.map((d: any) => ({
      id: d.id,
      conversationId: d.conversation_id || '',
      userQuestion: d.user_question,
      context: [],
      attemptedAnswer: d.attempted_answer,
      confidenceScore: d.confidence_score || 0,
      documentsSearched: 0,
      topMatchScore: 0,
      sourcesFound: [],
      reason: d.reason,
      urgency: d.urgency,
      tags: [],
      status: d.status,
      humanAnswer: d.human_answer,
      resolvedBy: d.resolved_by,
      resolvedAt: d.resolved_at ? new Date(d.resolved_at) : undefined,
      shouldAddToKB: d.added_to_kb,
      addedToKB: d.added_to_kb,
      relatedDocuments: [],
      createdAt: new Date(d.created_at),
      updatedAt: new Date(d.updated_at),
      userNotified: false
    }));

    const total = count || 0;
    return {
      escalations,
      total,
      hasMore: from + pageSize < total
    };
  } catch (err) {
    console.error('[EscalationDB] List exception:', err);
    return { escalations: [], total: 0, hasMore: false };
  }
}

export async function updateEscalationInDb(id: string, updates: any): Promise<Escalation | null> {
  try {
    const updatePayload: any = {
      updated_at: new Date().toISOString()
    };
    if (updates.status) updatePayload.status = updates.status;
    if (updates.humanAnswer) updatePayload.human_answer = updates.humanAnswer;
    if (updates.resolvedBy) updatePayload.resolved_by = updates.resolvedBy;
    if (updates.resolvedAt) updatePayload.resolved_at = updates.resolvedAt.toISOString();
    if (updates.addToKB !== undefined) updatePayload.added_to_kb = updates.addToKB;

    const { data, error } = await supabase
      .from('escalations')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error || !data) return null;

    return getEscalationFromDb(id);
  } catch (err) {
    console.error('[EscalationDB] Update exception:', err);
    return null;
  }
}

export async function deleteEscalationFromDb(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('escalations').delete().eq('id', id);
    return !error;
  } catch (err) {
    return false;
  }
}
