// ============================================
// Escalations API - List & Create
// GET /api/escalations - List escalations
// POST /api/escalations - Create escalation
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import {
  listEscalations,
  createEscalation,
  getEscalationStats
} from '@/lib/escalationSystem';
import {
  CreateEscalationRequest,
  EscalationFilters,
  EscalationSortBy,
  EscalationStatus,
  EscalationUrgency
} from '@/types/escalation';

/**
 * GET /api/escalations
 * List escalations with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters
    const filters: EscalationFilters = {};
    
    const status = searchParams.get('status');
    if (status) filters.status = status as EscalationStatus;
    
    const urgency = searchParams.get('urgency');
    if (urgency) filters.urgency = urgency as EscalationUrgency;
    
    const category = searchParams.get('category');
    if (category) filters.category = category;
    
    const search = searchParams.get('search');
    if (search) filters.search = search;
    
    const assignedTo = searchParams.get('assignedTo');
    if (assignedTo) filters.assignedTo = assignedTo;

    // Parse sort and pagination
    const sortBy = (searchParams.get('sortBy') || 'newest') as EscalationSortBy;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // Check if stats requested
    const includeStats = searchParams.get('includeStats') === 'true';

    // Get escalations
    const result = await listEscalations(filters, sortBy, page, pageSize);

    // Optionally include stats
    let stats = null;
    if (includeStats) {
      stats = await getEscalationStats();
    }

    return NextResponse.json({
      success: true,
      ...result,
      page,
      pageSize,
      stats
    });
  } catch (error) {
    console.error('Error listing escalations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list escalations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/escalations
 * Create a new escalation
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateEscalationRequest = await request.json();

    // Validate required fields
    if (!body.userQuestion) {
      return NextResponse.json(
        { success: false, error: 'User question is required' },
        { status: 400 }
      );
    }

    if (body.confidenceScore === undefined) {
      return NextResponse.json(
        { success: false, error: 'Confidence score is required' },
        { status: 400 }
      );
    }

    // Create the escalation
    const escalation = await createEscalation({
      userQuestion: body.userQuestion,
      context: body.context || [],
      attemptedAnswer: body.attemptedAnswer,
      confidenceScore: body.confidenceScore,
      documentsSearched: body.documentsSearched || 0,
      topMatchScore: body.topMatchScore || 0,
      sourcesFound: body.sourcesFound || [],
      reason: body.reason || 'low_confidence',
      urgency: body.urgency || 'medium',
      category: body.category,
      tags: body.tags || [],
      conversationId: body.conversationId,
      userId: body.userId
    });

    return NextResponse.json({
      success: true,
      escalation,
      message: 'Escalation created successfully'
    });
  } catch (error) {
    console.error('Error creating escalation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create escalation' },
      { status: 500 }
    );
  }
}
