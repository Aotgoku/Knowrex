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
    const escalation = await getEscalation(id);

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
    const { id } = await params;
    const body = await request.json();
    const { action, ...data } = body;

    let result = null;

    switch (action) {
      case 'assign':
        // Assign to an admin
        if (!data.assignedTo) {
          return NextResponse.json(
            { success: false, error: 'assignedTo is required' },
            { status: 400 }
          );
        }
        result = await assignEscalation(id, { assignedTo: data.assignedTo });
        break;

      case 'start':
        // Mark as in progress
        result = await startEscalation(id);
        break;

      case 'resolve':
        // Resolve with human answer
        if (!data.humanAnswer || !data.resolvedBy) {
          return NextResponse.json(
            { success: false, error: 'humanAnswer and resolvedBy are required' },
            { status: 400 }
          );
        }
        result = await resolveEscalation(id, {
          humanAnswer: data.humanAnswer,
          resolvedBy: data.resolvedBy,
          resolutionNotes: data.resolutionNotes,
          addToKB: data.addToKB || false,
          kbIntegrationType: data.kbIntegrationType,
          targetDocument: data.targetDocument,
          category: data.category,
          tags: data.tags
        });
        break;

      case 'reject':
        // Reject escalation
        if (!data.resolvedBy || !data.reason) {
          return NextResponse.json(
            { success: false, error: 'resolvedBy and reason are required' },
            { status: 400 }
          );
        }
        result = await rejectEscalation(id, data.resolvedBy, data.reason);
        break;

      case 'feedback':
        // Add user feedback
        if (data.satisfied === undefined) {
          return NextResponse.json(
            { success: false, error: 'satisfied is required' },
            { status: 400 }
          );
        }
        result = await addUserFeedback(id, data.satisfied, data.feedback);
        break;

      default:
        // Generic update
        result = await updateEscalation(id, data);
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
    const { id } = await params;
    const success = await deleteEscalation(id);

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
