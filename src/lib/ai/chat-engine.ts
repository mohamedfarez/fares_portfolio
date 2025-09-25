import { aiEngineerPersonality } from './sales-manager-personality';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    salesStep?: number;
    intent?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    leadScore?: number;
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
  private personality = aiEngineerPersonality;

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
    
    // Intent detection
    let intent = 'general_inquiry';
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
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
    }

    // Cap the score
    this.context.engagementScore = Math.max(0, Math.min(100, this.context.engagementScore));
  }

  private async generateResponse(userMessage: string, analysis: any): Promise<string> {
    // Handle concerns first
    if (analysis.objections.length > 0) {
      return this.handleConcerns(analysis.objections);
    }

    // Handle specific intents
    switch (analysis.intent) {
      case 'budget_inquiry':
        return this.handleBudgetInquiry();
      case 'demo_request':
        return this.handleDemoRequest();
      case 'experience_inquiry':
        return this.handleExperienceInquiry();
      case 'collaboration_request':
        return this.handleCollaborationRequest();
      case 'technical_inquiry':
        return this.handleTechnicalInquiry();
      default:
        return this.handleGeneralInquiry(userMessage, analysis);
    }
  }

  private handleConcerns(concerns: string[]): string {
    const concern = concerns[0]; // Handle first concern
    const responses = this.personality.responses.concernAddressing[concern];
    if (responses && responses.length > 0) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
    return "I understand your concern. Let me address that for you...";
  }

  private handleBudgetInquiry(): string {
    return "Great question! My approach to pricing depends on the project scope and technical complexity. I typically work on a project basis, with costs ranging from $5,000 to $25,000 depending on the AI implementation requirements. My solutions usually deliver ROI within 3-6 months through efficiency gains and improved accuracy. Would you like me to assess your specific technical requirements for a more precise estimate?";
  }

  private handleTechnicalInquiry(): string {
    const expertise = this.personality.responses.expertiseShowcase;
    const randomExpertise = expertise[Math.floor(Math.random() * expertise.length)];
    return `${randomExpertise} What specific technical aspect would you like me to elaborate on?`;
  }

  private handleDemoRequest(): string {
    return "Absolutely! I'd love to show you my work. You can see live demos right here on this page - check out my SmaTest exam monitoring system, healthcare chatbot, and prompt engineering lab. Which one interests you most? I can also walk you through the technical implementation details of any of these projects.";
  }

  private handleExperienceInquiry(): string {
    const achievements = this.personality.responses.achievements;
    const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
    return `${randomAchievement} I have 1.5+ years of hands-on experience and have worked with companies like Hive Tech, Esaal, and CODSOFT. What specific area of my experience would you like to know more about?`;
  }

  private handleCollaborationRequest(): string {
    this.context.currentStage = 5; // Move to collaboration stage
    const collaborationInvites = this.personality.responses.collaborationInvites;
    const randomInvite = collaborationInvites[Math.floor(Math.random() * collaborationInvites.length)];
    return `${randomInvite} You can reach me at mohamedhfares5@gmail.com or +20 1023629575. I'm also available on LinkedIn. What's the best way to continue our technical discussion?`;
  }

  private handleGeneralInquiry(userMessage: string, analysis: any): string {
    // Progress through conversation stages
    const currentStage = this.personality.conversationFlow[this.context.currentStage - 1];

    if (this.context.currentStage === 1) {
      // First interaction - use greeting
      const greetings = this.personality.responses.greetings;
      return greetings[Math.floor(Math.random() * greetings.length)];
    } else if (this.context.currentStage <= 2) {
      // Technical discussion phase
      return "That's an interesting point! What specific technical challenges are you facing in your current setup?";
    } else if (this.context.currentStage <= 4) {
      // Expertise showcase
      const expertiseShowcase = this.personality.responses.expertiseShowcase;
      const randomShowcase = expertiseShowcase[Math.floor(Math.random() * expertiseShowcase.length)];
      return randomShowcase;
    } else {
      // Collaboration phase
      const collaborationInvites = this.personality.responses.collaborationInvites;
      const randomInvite = collaborationInvites[Math.floor(Math.random() * collaborationInvites.length)];
      return randomInvite;
    }
  }

  public getContext(): ChatContext {
    return this.context;
  }

  public getEngagementScore(): number {
    return this.context.engagementScore;
  }
}
