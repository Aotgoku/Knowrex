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
  createEscalationInDb,
  listEscalationsFromDb
} from '@/lib/escalationDb';
import {
  CreateEscalationRequest,
  EscalationFilters,
  EscalationSortBy,
  EscalationStatus,
  EscalationUrgency
} from '@/types/escalation';
import { AUTH_COOKIE_NAME, deserializeSession } from '@/lib/auth';
import { checkRateLimit } from '@/lib/cache';

/**
 * GET /api/escalations
 * List escalations with optional filters (Admin / Agent Only)
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Authentication required to view support escalations.'
      }, { status: 401 });
    }

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

    // Get escalations (Try Supabase first, fallback to local files)
    let result = await listEscalationsFromDb(filters, sortBy, page, pageSize);
    if (!result || result.escalations.length === 0) {
      result = await listEscalations(filters, sortBy, page, pageSize);
    }

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
    // Rate limit creation: max 15 requests per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'anonymous';
    const rateCheck = await checkRateLimit(`escalation:${ip}`, 15, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many escalation requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body: CreateEscalationRequest = await request.json();

    // Validate required fields
    if (!body.userQuestion || typeof body.userQuestion !== 'string') {
      return NextResponse.json(
        { success: false, error: 'User question is required' },
        { status: 400 }
      );
    }

    if (body.userQuestion.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Question exceeds maximum length of 5000 characters' },
        { status: 400 }
      );
    }

    if (body.confidenceScore === undefined || typeof body.confidenceScore !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Valid confidence score is required' },
        { status: 400 }
      );
    }

    // Create escalation in Supabase (and local file fallback)
    let escalation = await createEscalationInDb(body);
    try {
      await createEscalation(body);
    } catch (e) {
      console.warn('Local file fallback create escalation failed:', e);
    }

    return NextResponse.json({
      success: true,
      escalation,
      message: 'Escalation created successfully'
    });
  } catch (error) {
    console.error('Error creating escalation:', error);
    return NextResponse.json(
      { success: false, error: process.env.NODE_ENV === 'production' ? 'Failed to create escalation' : 'Failed to create escalation' },
      { status: 500 }
    );
  }
}
