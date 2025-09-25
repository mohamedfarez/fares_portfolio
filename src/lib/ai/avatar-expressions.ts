// Avatar Expression System for AI Twin
export type ExpressionType = 
  | 'neutral'
  | 'happy'
  | 'thinking'
  | 'explaining'
  | 'surprised'
  | 'confident'
  | 'listening'
  | 'speaking';

export interface FacialExpression {
  id: ExpressionType;
  name: string;
  description: string;
  eyeShape: string;
  eyebrowPosition: string;
  mouthShape: string;
  duration: number; // in milliseconds
  intensity: number; // 0-1
}

export interface AvatarState {
  currentExpression: ExpressionType;
  isAnimating: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  eyePosition: { x: number; y: number };
  blinkState: boolean;
  lipSyncState: 'closed' | 'open' | 'wide';
}

export const expressions: Record<ExpressionType, FacialExpression> = {
  neutral: {
    id: 'neutral',
    name: 'Neutral',
    description: 'Default calm expression',
    eyeShape: 'normal',
    eyebrowPosition: 'relaxed',
    mouthShape: 'closed',
    duration: 500,
    intensity: 0.5
  },
  
  happy: {
    id: 'happy',
    name: 'Happy',
    description: 'Friendly and welcoming',
    eyeShape: 'slightly-closed',
    eyebrowPosition: 'raised',
    mouthShape: 'smile',
    duration: 800,
    intensity: 0.8
  },
  
  thinking: {
    id: 'thinking',
    name: 'Thinking',
    description: 'Processing information',
    eyeShape: 'focused',
    eyebrowPosition: 'slightly-furrowed',
    mouthShape: 'pursed',
    duration: 1200,
    intensity: 0.7
  },
  
  explaining: {
    id: 'explaining',
    name: 'Explaining',
    description: 'Teaching or demonstrating',
    eyeShape: 'wide',
    eyebrowPosition: 'raised',
    mouthShape: 'open',
    duration: 1000,
    intensity: 0.9
  },
  
  surprised: {
    id: 'surprised',
    name: 'Surprised',
    description: 'Reacting to unexpected input',
    eyeShape: 'wide',
    eyebrowPosition: 'high',
    mouthShape: 'open-wide',
    duration: 600,
    intensity: 1.0
  },
  
  confident: {
    id: 'confident',
    name: 'Confident',
    description: 'Showcasing expertise',
    eyeShape: 'focused',
    eyebrowPosition: 'slightly-raised',
    mouthShape: 'slight-smile',
    duration: 900,
    intensity: 0.8
  },
  
  listening: {
    id: 'listening',
    name: 'Listening',
    description: 'Actively listening to user',
    eyeShape: 'attentive',
    eyebrowPosition: 'slightly-raised',
    mouthShape: 'closed',
    duration: 700,
    intensity: 0.6
  },
  
  speaking: {
    id: 'speaking',
    name: 'Speaking',
    description: 'Actively speaking',
    eyeShape: 'normal',
    eyebrowPosition: 'animated',
    mouthShape: 'animated',
    duration: 500,
    intensity: 0.7
  }
};

export const expressionTriggers = {
  // Chat-based triggers
  greeting: 'happy',
  question: 'listening',
  response: 'explaining',
  technical: 'confident',
  achievement: 'happy',
  problem: 'thinking',
  surprise: 'surprised',
  
  // Voice-based triggers
  speaking: 'speaking',
  listening: 'listening',
  processing: 'thinking',
  
  // Default states
  idle: 'neutral',
  waiting: 'neutral'
} as const;

export class ExpressionManager {
  private currentState: AvatarState;
  private animationQueue: ExpressionType[] = [];
  private isProcessing = false;

  constructor() {
    this.currentState = {
      currentExpression: 'neutral',
      isAnimating: false,
      isSpeaking: false,
      isListening: false,
      eyePosition: { x: 0, y: 0 },
      blinkState: false,
      lipSyncState: 'closed'
    };
  }

  getCurrentState(): AvatarState {
    return { ...this.currentState };
  }

  async setExpression(expression: ExpressionType, force = false): Promise<void> {
    if (!force && this.currentState.isAnimating) {
      this.animationQueue.push(expression);
      return;
    }

    const expressionData = expressions[expression];
    this.currentState.isAnimating = true;
    this.currentState.currentExpression = expression;

    // Simulate animation duration
    await new Promise(resolve => setTimeout(resolve, expressionData.duration));
    
    this.currentState.isAnimating = false;
    
    // Process next in queue
    if (this.animationQueue.length > 0) {
      const nextExpression = this.animationQueue.shift()!;
      await this.setExpression(nextExpression);
    }
  }

  updateEyePosition(x: number, y: number): void {
    // Constrain eye movement to realistic range
    this.currentState.eyePosition = {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-0.5, Math.min(0.5, y))
    };
  }

  triggerBlink(): void {
    this.currentState.blinkState = true;
    setTimeout(() => {
      this.currentState.blinkState = false;
    }, 150);
  }

  startSpeaking(): void {
    this.currentState.isSpeaking = true;
    this.setExpression('speaking');
  }

  stopSpeaking(): void {
    this.currentState.isSpeaking = false;
    this.setExpression('neutral');
  }

  startListening(): void {
    this.currentState.isListening = true;
    this.setExpression('listening');
  }

  stopListening(): void {
    this.currentState.isListening = false;
    this.setExpression('neutral');
  }

  updateLipSync(audioLevel: number): void {
    if (!this.currentState.isSpeaking) return;
    
    if (audioLevel > 0.7) {
      this.currentState.lipSyncState = 'wide';
    } else if (audioLevel > 0.3) {
      this.currentState.lipSyncState = 'open';
    } else {
      this.currentState.lipSyncState = 'closed';
    }
  }

  // Auto-blink system
  startAutoBlink(): void {
    const blink = () => {
      if (!this.currentState.isAnimating) {
        this.triggerBlink();
      }
      // Random blink interval between 2-6 seconds
      const nextBlink = 2000 + Math.random() * 4000;
      setTimeout(blink, nextBlink);
    };
    blink();
  }
}

export const avatarExpressionManager = new ExpressionManager();
