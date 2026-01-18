// ============================================
// Escalation Stats API
// GET /api/escalations/stats - Get escalation statistics
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getEscalationStats, getPendingCount } from '@/lib/escalationSystem';
import { getKBStats } from '@/lib/knowledgeLoop';

/**
 * GET /api/escalations/stats
 * Get comprehensive escalation and KB statistics
 */
export async function GET(request: NextRequest) {
  try {
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
