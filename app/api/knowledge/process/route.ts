// ============================================
// Knowledge Loop Processing API
// POST /api/knowledge/process - Process KB queue
// GET /api/knowledge/process - Get processing status
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { processKBQueue, getKBStats, generateKnowledgeSummary } from '@/lib/knowledgeLoop';
import { getKBPendingEscalations } from '@/lib/escalationSystem';

/**
 * GET /api/knowledge/process
 * Get KB processing status and pending items
 */
export async function GET(request: NextRequest) {
  try {
    const pendingEscalations = await getKBPendingEscalations();
    const stats = await getKBStats();
    const summary = await generateKnowledgeSummary();

    return NextResponse.json({
      success: true,
      pendingCount: pendingEscalations.length,
      pendingEscalations: pendingEscalations.map(e => ({
        id: e.id,
        question: e.userQuestion.substring(0, 100),
        kbIntegrationType: e.kbIntegrationType,
        category: e.category
      })),
      stats,
      summary
    });
  } catch (error) {
    console.error('Error getting KB status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get KB status' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/knowledge/process
 * Process the KB queue (add resolved escalations to knowledge base)
 */
export async function POST(request: NextRequest) {
  try {
    const result = await processKBQueue();

    return NextResponse.json({
      success: true,
      ...result,
      message: `Processed ${result.processed} items, created ${result.faqsCreated} FAQs`
    });
  } catch (error) {
    console.error('Error processing KB queue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process KB queue' },
      { status: 500 }
    );
  }
}
