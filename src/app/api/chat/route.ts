import { NextRequest, NextResponse } from 'next/server';
import { AIEngineerChatEngine } from '@/lib/ai/chat-engine';

// Simple session storage for serverless environment
// In production, consider using Netlify KV, Supabase, or similar
const chatSessions = new Map<string, AIEngineerChatEngine>();

// Session cleanup to prevent memory leaks
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const sessionTimestamps = new Map<string, number>();

function cleanupOldSessions() {
  const now = Date.now();
  sessionTimestamps.forEach((timestamp, sessionId) => {
    if (now - timestamp > SESSION_TIMEOUT) {
      chatSessions.delete(sessionId);
      sessionTimestamps.delete(sessionId);
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Clean up old sessions periodically
    cleanupOldSessions();

    const { message, sessionId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Get or create chat session
    let chatEngine = chatSessions.get(sessionId);
    if (!chatEngine) {
      chatEngine = new AIEngineerChatEngine(sessionId);
      chatSessions.set(sessionId, chatEngine);
    }

    // Update session timestamp
    sessionTimestamps.set(sessionId, Date.now());

    // Process the message
    const response = await chatEngine.processMessage(message);
    const context = chatEngine.getContext();
    const engagementScore = chatEngine.getEngagementScore();

    return NextResponse.json({
      response,
      engagementScore,
      currentStage: context.currentStage,
      userProfile: context.userProfile,
      sessionId
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'SessionId is required' },
      { status: 400 }
    );
  }

  const chatEngine = chatSessions.get(sessionId);
  if (!chatEngine) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    );
  }

  const context = chatEngine.getContext();
  return NextResponse.json({
    messages: context.messages,
    engagementScore: chatEngine.getEngagementScore(),
    currentStage: context.currentStage,
    userProfile: context.userProfile
  });
}
