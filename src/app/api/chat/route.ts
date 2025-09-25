import { NextRequest, NextResponse } from 'next/server';
import { AIEngineerChatEngine } from '@/lib/ai/chat-engine';

// Store chat sessions in memory (in production, use Redis or database)
const chatSessions = new Map<string, AIEngineerChatEngine>();

export async function POST(request: NextRequest) {
  try {
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
