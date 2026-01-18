// ============================================
// Knowledge API - FAQ Management
// GET /api/knowledge/faq - List FAQs
// POST /api/knowledge/faq - Create FAQ
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllFAQs,
  searchFAQs,
  createFAQFromEscalation,
  getKBStats
} from '@/lib/knowledgeLoop';
import { getEscalation } from '@/lib/escalationSystem';
import { FAQEntry } from '@/types/escalation';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

const FAQ_DIR = path.join(process.cwd(), 'data', 'faq');

/**
 * GET /api/knowledge/faq
 * List FAQs with optional search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const includeStats = searchParams.get('includeStats') === 'true';

    let faqs: FAQEntry[];
    
    if (search) {
      faqs = await searchFAQs(search);
    } else {
      faqs = await getAllFAQs();
    }

    let stats = null;
    if (includeStats) {
      stats = await getKBStats();
    }

    return NextResponse.json({
      success: true,
      faqs,
      total: faqs.length,
      stats
    });
  } catch (error) {
    console.error('Error listing FAQs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list FAQs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/knowledge/faq
 * Create a new FAQ entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If creating from escalation
    if (body.escalationId) {
      const escalation = await getEscalation(body.escalationId);
      if (!escalation) {
        return NextResponse.json(
          { success: false, error: 'Escalation not found' },
          { status: 404 }
        );
      }

      const faq = await createFAQFromEscalation(escalation);
      if (!faq) {
        return NextResponse.json(
          { success: false, error: 'Failed to create FAQ from escalation' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        faq,
        message: 'FAQ created from escalation'
      });
    }

    // Direct FAQ creation
    if (!body.question || !body.answer) {
      return NextResponse.json(
        { success: false, error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    // Ensure FAQ directory exists
    try {
      await fs.access(FAQ_DIR);
    } catch {
      await fs.mkdir(FAQ_DIR, { recursive: true });
    }

    const faq: FAQEntry = {
      id: uuidv4(),
      question: body.question,
      answer: body.answer,
      category: body.category || 'General',
      tags: body.tags || [],
      sourceEscalationId: body.sourceEscalationId || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const faqPath = path.join(FAQ_DIR, `${faq.id}.json`);
    await fs.writeFile(faqPath, JSON.stringify(faq, null, 2));

    return NextResponse.json({
      success: true,
      faq,
      message: 'FAQ created successfully'
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
