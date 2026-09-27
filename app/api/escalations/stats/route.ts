// ============================================
// Escalation Stats API
// GET /api/escalations/stats - Get escalation statistics
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getEscalationStats, getPendingCount } from '@/lib/escalationSystem';
import { getKBStats } from '@/lib/knowledgeLoop';
import { AUTH_COOKIE_NAME, deserializeSession } from '@/lib/auth';

/**
 * GET /api/escalations/stats
 * Get comprehensive escalation and KB statistics (Admin / Agent Only)
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(sessionCookie);

    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Authentication required to view support statistics.'
      }, { status: 401 });
    }

    // Get escalation stats
    const escalationStats = await getEscalationStats();
    
    // Get KB stats
    const kbStats = await getKBStats();
    
    // Get pending count for badge
    const pendingCount = await getPendingCount();

    return NextResponse.json({
      success: true,
      stats: {
        escalations: escalationStats,
        kb: kbStats,
        pendingCount
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get statistics' },
      { status: 500 }
    );
  }
}
