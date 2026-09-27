import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/conversations - Get or list conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');

    if (conversationId) {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return NextResponse.json({ success: true, messages: messages || [] });
    }

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ success: true, conversations: conversations || [] });
  } catch (error: any) {
    console.error('[API Conversations] GET Error:', error);
    return NextResponse.json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Failed to fetch conversations' : (error?.message || 'Database error')
    }, { status: 500 });
  }
}

// POST /api/conversations - Create conversation or save messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, conversationId, title, message } = body;

    // Action 1: Create a new conversation session
    if (action === 'create') {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ title: title || 'New Chat' }])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, conversation: data });
    }

    // Action 2: Save a single message to an existing conversation
    if (action === 'save_message') {
      if (!conversationId || !message || typeof message.content !== 'string') {
        return NextResponse.json({ success: false, error: 'Missing or invalid conversationId or message' }, { status: 400 });
      }

      if (message.content.length > 10000) {
        return NextResponse.json({ success: false, error: 'Message content exceeds maximum allowed length' }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          id: message.id,
          conversation_id: conversationId,
          role: message.role,
          content: message.content,
          sources: message.sources || [],
          confidence: message.confidence || null,
          used_rag: message.usedRAG || false,
          escalation_id: message.escalationId || null
        }])
        .select()
        .single();

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return NextResponse.json({ success: true, message: data });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[API Conversations] POST Error:', error);
    return NextResponse.json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Failed to process conversation update' : (error?.message || 'Database error')
    }, { status: 500 });
  }
}
