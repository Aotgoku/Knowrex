// ============================================
// Escalation by ID API
// GET /api/escalations/[id] - Get single escalation
// PATCH /api/escalations/[id] - Update escalation
// DELETE /api/escalations/[id] - Delete escalation
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getEscalation,
  updateEscalation,
  deleteEscalation,
  assignEscalation,
  startEscalation,
  resolveEscalation,
  rejectEscalation,
  addUserFeedback
} from '@/lib/escalationSystem';
import {
  getEscalationFromDb,
  updateEscalationInDb,
  deleteEscalationFromDb
} from '@/lib/escalationDb';
import { AUTH_COOKIE_NAME, deserializeSession } from '@/lib/auth';

interface RouteParams {

  params: Promise<{ id: string }>;
}

/**
 * GET /api/escalations/[id]
 * Get a single escalation by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    let escalation = await getEscalationFromDb(id);
    if (!escalation) {
      escalation = await getEscalation(id);
    }

    if (!escalation) {
      return NextResponse.json(
        { success: false, error: 'Escalation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      escalation
    });
  } catch (error) {
    console.error('Error getting escalation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get escalation' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/escalations/[id]
 * Update an escalation (supports various actions)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Operational credentials required to update escalations.'
      }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, ...data } = body;

    let result = null;


    switch (action) {
      case 'assign':
        if (!data.assignedTo) {
          return NextResponse.json(
            { success: false, error: 'assignedTo is required' },
            { status: 400 }
          );
        }
        result = await updateEscalationInDb(id, {
          status: 'assigned',
          assignedTo: data.assignedTo,
          assignedAt: new Date()
        });
        if (!result) {
          result = await assignEscalation(id, { assignedTo: data.assignedTo });
        }
        break;

      case 'start':
        result = await updateEscalationInDb(id, { status: 'in_progress' });
        if (!result) {
          result = await startEscalation(id);
        }
        break;

      case 'resolve':
        if (!data.humanAnswer || !data.resolvedBy) {
          return NextResponse.json(
            { success: false, error: 'humanAnswer and resolvedBy are required' },
            { status: 400 }
          );
        }
        result = await updateEscalationInDb(id, {
          status: 'resolved',
          humanAnswer: data.humanAnswer,
          resolvedBy: data.resolvedBy,
          resolvedAt: new Date(),
          addToKB: data.addToKB || false
        });
        // Also keep local file updated if present
        try {
          await resolveEscalation(id, {
            humanAnswer: data.humanAnswer,
            resolvedBy: data.resolvedBy,
            resolutionNotes: data.resolutionNotes,
            addToKB: data.addToKB || false,
            kbIntegrationType: data.kbIntegrationType,
            targetDocument: data.targetDocument,
            category: data.category,
            tags: data.tags
          });
        } catch (e) {
          console.warn('Local resolve fallback error:', e);
        }
        break;

      case 'reject':
        if (!data.resolvedBy || !data.reason) {
          return NextResponse.json(
            { success: false, error: 'resolvedBy and reason are required' },
            { status: 400 }
          );
        }
        result = await updateEscalationInDb(id, {
          status: 'rejected',
          resolvedBy: data.resolvedBy,
          resolvedAt: new Date()
        });
        if (!result) {
          result = await rejectEscalation(id, data.resolvedBy, data.reason);
        }
        break;

      case 'feedback':
        if (data.satisfied === undefined) {
          return NextResponse.json(
            { success: false, error: 'satisfied is required' },
            { status: 400 }
          );
        }
        result = await updateEscalationInDb(id, {
          userSatisfied: data.satisfied,
          userFeedback: data.feedback
        });
        if (!result) {
          result = await addUserFeedback(id, data.satisfied, data.feedback);
        }
        break;

      default:
        result = await updateEscalationInDb(id, data);
        if (!result) {
          result = await updateEscalation(id, data);
        }
    }

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Escalation not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      escalation: result,
      message: `Escalation ${action || 'updated'} successfully`
    });
  } catch (error) {
    console.error('Error updating escalation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update escalation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/escalations/[id]
 * Delete an escalation
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Only Super Admins can delete escalation records.'
      }, { status: 401 });
    }

    const { id } = await params;

    let success = await deleteEscalationFromDb(id);
    if (!success) {
      success = await deleteEscalation(id);
    }

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Escalation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Escalation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting escalation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete escalation' },
      { status: 500 }
    );
  }
}
