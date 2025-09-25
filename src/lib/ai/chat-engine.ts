import { mohamedFaresPersona } from './mohamed-fares-persona';
import { llmService } from './llm-service';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    conversationStage?: number;
    intent?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    engagementScore?: number;
    provider?: string;
  };
}

export interface ChatContext {
  messages: ChatMessage[];
  currentStage: number;
  userProfile: {
    industry?: string;
    company?: string;
    role?: string;
    interests?: string[];
    technicalChallenges?: string[];
    projectScope?: string;
    timeline?: string;
  };
  engagementScore: number;
  sessionId: string;
}

export class AIEngineerChatEngine {
  private context: ChatContext;
  private persona = mohamedFaresPersona;

  constructor(sessionId: string) {
    this.context = {
      messages: [],
      currentStage: 1,
      userProfile: {},
      engagementScore: 0,
      sessionId
    };
  }

  async processMessage(userMessage: string): Promise<string> {
    // Add user message to context
    this.addMessage('user', userMessage);

    // Analyze user intent and sentiment
    const analysis = this.analyzeMessage(userMessage);
    
    // Update user profile based on message
    this.updateUserProfile(userMessage, analysis);

    // Calculate engagement score
    this.updateEngagementScore(analysis);
    
    // Generate appropriate response
    const response = await this.generateResponse(userMessage, analysis);
    
    // Add assistant response to context
    this.addMessage('assistant', response, {
      conversationStage: this.context.currentStage,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      engagementScore: this.context.engagementScore
    });

    return response;
  }

  private addMessage(role: 'user' | 'assistant', content: string, metadata?: any) {
    this.context.messages.push({
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      metadata
    });
  }

  private analyzeMessage(message: string): {
    intent: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    keywords: string[];
    objections: string[];
  } {
    const lowerMessage = message.toLowerCase();
    
    // Intent detection - including personal topics
    let intent = 'general_inquiry';

    // Personal interests
    if (lowerMessage.includes('football') || lowerMessage.includes('real madrid') || lowerMessage.includes('كورة') || lowerMessage.includes('ريال')) {
      intent = 'football_inquiry';
    } else if (lowerMessage.includes('read') || lowerMessage.includes('book') || lowerMessage.includes('philosophy') || lowerMessage.includes('قراءة') || lowerMessage.includes('كتاب')) {
      intent = 'reading_inquiry';
    } else if (lowerMessage.includes('star') || lowerMessage.includes('astronomy') || lowerMessage.includes('universe') || lowerMessage.includes('نجوم') || lowerMessage.includes('فلك')) {
      intent = 'astronomy_inquiry';
    } else if (lowerMessage.includes('poetry') || lowerMessage.includes('poem') || lowerMessage.includes('شعر') || lowerMessage.includes('قصيدة')) {
      intent = 'poetry_inquiry';
    } else if (lowerMessage.includes('yourself') || lowerMessage.includes('about you') || lowerMessage.includes('who are you') || lowerMessage.includes('نفسك') || lowerMessage.includes('مين انت')) {
      intent = 'personal_inquiry';
    }
    // Professional topics
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      intent = 'budget_inquiry';
    } else if (lowerMessage.includes('demo') || lowerMessage.includes('example') || lowerMessage.includes('show')) {
      intent = 'demo_request';
    } else if (lowerMessage.includes('experience') || lowerMessage.includes('portfolio') || lowerMessage.includes('projects')) {
      intent = 'experience_inquiry';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('meeting') || lowerMessage.includes('call') || lowerMessage.includes('collaborate')) {
      intent = 'collaboration_request';
    } else if (lowerMessage.includes('technical') || lowerMessage.includes('how') || lowerMessage.includes('implementation')) {
      intent = 'technical_inquiry';
    }

    // Sentiment analysis (basic)
    const positiveWords = ['great', 'excellent', 'good', 'interested', 'yes', 'perfect', 'amazing'];
    const negativeWords = ['expensive', 'no', 'not sure', 'maybe', 'think about it', 'later'];
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveWords.some(word => lowerMessage.includes(word))) {
      sentiment = 'positive';
    } else if (negativeWords.some(word => lowerMessage.includes(word))) {
      sentiment = 'negative';
    }

    // Extract keywords
    const keywords = this.extractKeywords(lowerMessage);
    
    // Detect objections
    const objections = this.detectObjections(lowerMessage);

    return { intent, sentiment, keywords, objections };
  }

  private extractKeywords(message: string): string[] {
    const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'nlp', 'computer vision', 'chatbot', 'automation'];
    const industryKeywords = ['healthcare', 'education', 'finance', 'retail', 'manufacturing', 'technology'];
    const techKeywords = ['python', 'tensorflow', 'pytorch', 'openai', 'gpt', 'llm', 'api'];
    
    const allKeywords = [...aiKeywords, ...industryKeywords, ...techKeywords];
    return allKeywords.filter(keyword => message.includes(keyword));
  }

  private detectObjections(message: string): string[] {
    const concernPatterns = {
      'budget_concerns': ['expensive', 'cost', 'budget', 'afford'],
      'ai_uncertainty': ['not sure', 'uncertain', 'risky', 'complex'],
      'need_more_info': ['think about it', 'consider', 'discuss', 'later'],
      'existing_solution': ['already have', 'current system', 'existing']
    };

    const detectedConcerns: string[] = [];
    for (const [concern, patterns] of Object.entries(concernPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        detectedConcerns.push(concern);
      }
    }

    return detectedConcerns;
  }

  private updateUserProfile(message: string, analysis: any) {
    // Extract company/industry information
    if (analysis.keywords.includes('healthcare')) {
      this.context.userProfile.industry = 'healthcare';
    } else if (analysis.keywords.includes('education')) {
      this.context.userProfile.industry = 'education';
    }

    // Extract interests and technical challenges
    if (!this.context.userProfile.interests) {
      this.context.userProfile.interests = [];
    }
    this.context.userProfile.interests.push(...analysis.keywords);

    // Extract technical challenges
    if (analysis.objections.length > 0) {
      if (!this.context.userProfile.technicalChallenges) {
        this.context.userProfile.technicalChallenges = [];
      }
      this.context.userProfile.technicalChallenges.push(...analysis.objections);
    }
  }

  private updateEngagementScore(analysis: any) {
    // Increase score for positive sentiment
    if (analysis.sentiment === 'positive') {
      this.context.engagementScore += 10;
    } else if (analysis.sentiment === 'negative') {
      this.context.engagementScore -= 5;
    }

    // Increase score for specific intents
    if (analysis.intent === 'demo_request') {
      this.context.engagementScore += 20;
    } else if (analysis.intent === 'collaboration_request') {
      this.context.engagementScore += 30;
    } else if (analysis.intent === 'technical_inquiry') {
      this.context.engagementScore += 15;
    } else if (analysis.intent === 'experience_inquiry') {
      this.context.engagementScore += 12;
    } else if (analysis.intent === 'personal_inquiry') {
      this.context.engagementScore += 18; // High engagement for personal connection
    } else if (analysis.intent === 'football_inquiry') {
      this.context.engagementScore += 25; // Very high for shared interests
    } else if (analysis.intent === 'reading_inquiry') {
      this.context.engagementScore += 20; // High for intellectual connection
    } else if (analysis.intent === 'astronomy_inquiry') {
      this.context.engagementScore += 22; // High for deep interests
    } else if (analysis.intent === 'poetry_inquiry') {
      this.context.engagementScore += 20; // High for creative connection
    }

    // Cap the score
    this.context.engagementScore = Math.max(0, Math.min(100, this.context.engagementScore));
  }

  private async generateResponse(userMessage: string, analysis: any): Promise<string> {
    try {
      // Build conversation context for LLM
      const messages = this.buildLLMMessages(userMessage, analysis);

      // Call LLM service with fallback
      const response = await llmService.generateResponse({
        messages,
        temperature: 0.7,
        maxTokens: 1000
      });

      // Update metadata with provider info
      this.context.messages[this.context.messages.length - 1].metadata = {
        ...this.context.messages[this.context.messages.length - 1].metadata,
        provider: response.provider
      };

      return response.content;

    } catch (error) {
      console.error('LLM generation failed:', error);
      // Fallback to template-based response
      return this.getFallbackResponse(userMessage, analysis);
    }
  }

  private buildLLMMessages(userMessage: string, analysis: any): Array<{role: 'system' | 'user' | 'assistant', content: string}> {
    const messages: Array<{role: 'system' | 'user' | 'assistant', content: string}> = [];

    // Add system prompt with persona
    messages.push({
      role: 'system',
      content: this.buildSystemPrompt(analysis)
    });

    // Add conversation history (last 10 messages to keep context manageable)
    const recentMessages = this.context.messages.slice(-10);
    for (const msg of recentMessages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    return messages;
  }

  private buildSystemPrompt(analysis: any): string {
    let systemPrompt = this.persona.systemPrompt;

    // Add conversation context
    const messageCount = this.context.messages.length;

    if (messageCount === 0) {
      systemPrompt += `\n\n🎯 FIRST INTERACTION: Be welcoming and friendly. Introduce yourself naturally and ask what brings them here.`;
    } else if (messageCount < 4) {
      systemPrompt += `\n\n💬 EARLY CONVERSATION: Build rapport. Share relevant experiences and ask about their interests.`;
    } else {
      systemPrompt += `\n\n🤝 ONGOING CONVERSATION: You're getting to know each other. Be more personal and dive deeper into shared interests.`;
    }

    // Add specific guidance based on topic
    if (analysis.intent) {
      const intentGuidance: Record<string, string> = {
        'technical_inquiry': 'Share a brief technical example from your experience. Mix Arabic and English naturally. Ask if they want to see it in action.',
        'personal_inquiry': 'Share personal stories and interests. Be authentic and relatable. Ask about their own experiences.',
        'experience_inquiry': 'Tell specific stories from your work experience. Use "أنا" and "كنت" to make it personal.',
        'project_inquiry': 'Describe your projects with enthusiasm. Mention the challenges and how you solved them.',
        'collaboration_request': 'Show genuine interest. Ask about their specific needs and share how you can help.',
        'football_inquiry': 'Share your passion for Real Madrid! Use emojis and be enthusiastic about football.',
        'reading_inquiry': 'Talk about your love for philosophy and psychology books. Connect it to your AI work.',
        'astronomy_inquiry': 'Share your fascination with stars and the universe. Be poetic and thoughtful.',
        'poetry_inquiry': 'Mention how poetry helps you express feelings and experiences.',
        'demo_request': 'Be enthusiastic about your demos. Explain what they can expect to see.',
        'budget_inquiry': 'Be professional but friendly about pricing discussions.',
        'general_inquiry': 'Keep the conversation natural and ask follow-up questions.'
      };

      systemPrompt += `\n\n🎯 USER INTENT: ${analysis.intent}
GUIDANCE: ${intentGuidance[analysis.intent] || 'Keep the conversation natural and ask follow-up questions.'}`;
    }

    // Add conversation metrics for context
    if (this.context.messages.length > 0) {
      systemPrompt += `\n\n📊 CONVERSATION CONTEXT:
- Engagement score: ${this.context.engagementScore}/100
- Stage: ${this.context.currentStage}/5
- User interests: ${this.context.userProfile.interests?.join(', ') || 'Still discovering'}`;
    }

    return systemPrompt;
  }

  private getFallbackResponse(userMessage: string, analysis: any): string {
    // Interactive fallback responses when LLM fails
    const fallbackResponses = [
      "أهلاً! أنا محمد فارس، AI Engineer وعاشق للـ machine learning 🚀 إيه اللي جابك هنا النهاردة؟",
      "دي حاجة interesting! حبيت أساعدك فيها. إيه اللي محيرك فيها بالضبط؟ 🤔",
      "Nice topic! أنا شغلت على حاجة similar قبل كدا. عايز تشوف إزاي عملتها؟",
      "دا موضوع قريب لقلبي! 😊 إيه اللي خلاك مهتم بالموضوع دا؟",
      "Cool! دا من المواضيع اللي بحبها. إنت شغال على project معين؟",
      "حلو! أنا عندي experience في المجال دا. إيه أكبر challenge واجهك فيه؟",
      "أكيد هساعدك! SmaTest project بتاعي كسب المركز الأول 🏆 إيه اللي عايز تعرفه عنه؟",
      "ريال مدريد forever! ⚽ بس خلينا نتكلم عن الـ AI كمان 😄 إيه اهتمامك فيه؟"
    ];

    // Try to match response to user message content
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('football') || lowerMessage.includes('real madrid') || lowerMessage.includes('كورة')) {
      return "ريال مدريد forever! ⚽ مش بس بشجعهم، بعيش كل مباراة بحماس جنوني 😄 إنت بتشجع مين؟";
    }

    if (lowerMessage.includes('read') || lowerMessage.includes('book') || lowerMessage.includes('قراءة')) {
      return "بحب الفلسفة وعلم النفس كتير 📚 بيساعدوني أفهم الـ human behavior أكتر. إيه آخر كتاب قريته؟";
    }

    if (lowerMessage.includes('star') || lowerMessage.includes('astronomy') || lowerMessage.includes('نجوم')) {
      return "النجوم والفلك حاجة تانية خالص! 🌟 بحب أتأمل السماء وأفكر في أسرار الكون. إنت مهتم بالفلك؟";
    }

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  public getContext(): ChatContext {
    return this.context;
  }

  public getEngagementScore(): number {
    return this.context.engagementScore;
  }
}
