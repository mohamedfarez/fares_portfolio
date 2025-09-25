// Avatar Animation System
import { ExpressionType } from './avatar-expressions';

export interface AnimationKeyframe {
  time: number; // 0-1
  value: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface HandGesture {
  id: string;
  name: string;
  description: string;
  keyframes: {
    leftHand: { x: number; y: number; rotation: number }[];
    rightHand: { x: number; y: number; rotation: number }[];
  };
  duration: number;
  triggers: string[];
}

export interface BodyAnimation {
  id: string;
  name: string;
  description: string;
  keyframes: {
    head: { x: number; y: number; rotation: number }[];
    shoulders: { rotation: number }[];
    torso: { x: number; y: number }[];
  };
  duration: number;
  loop: boolean;
}

export const handGestures: Record<string, HandGesture> = {
  pointing: {
    id: 'pointing',
    name: 'Pointing',
    description: 'Pointing to emphasize a point',
    keyframes: {
      leftHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: 20, y: -10, rotation: 15 }
      ],
      rightHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: -20, y: -10, rotation: -15 }
      ]
    },
    duration: 800,
    triggers: ['this', 'here', 'look', 'see', 'check']
  },

  explaining: {
    id: 'explaining',
    name: 'Explaining',
    description: 'Open hands while explaining',
    keyframes: {
      leftHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: -15, y: -5, rotation: -10 },
        { x: -25, y: -8, rotation: -15 },
        { x: -15, y: -5, rotation: -10 },
        { x: 0, y: 0, rotation: 0 }
      ],
      rightHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: 15, y: -5, rotation: 10 },
        { x: 25, y: -8, rotation: 15 },
        { x: 15, y: -5, rotation: 10 },
        { x: 0, y: 0, rotation: 0 }
      ]
    },
    duration: 2000,
    triggers: ['explain', 'understand', 'concept', 'idea', 'process']
  },

  thinking: {
    id: 'thinking',
    name: 'Thinking',
    description: 'Hand to chin while thinking',
    keyframes: {
      leftHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: 10, y: 15, rotation: 20 }
      ],
      rightHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: 0, y: 0, rotation: 0 }
      ]
    },
    duration: 1500,
    triggers: ['think', 'consider', 'analyze', 'evaluate', 'hmm']
  },

  presenting: {
    id: 'presenting',
    name: 'Presenting',
    description: 'Presenting or showcasing',
    keyframes: {
      leftHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: -20, y: -15, rotation: -20 }
      ],
      rightHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: 20, y: -15, rotation: 20 }
      ]
    },
    duration: 1000,
    triggers: ['present', 'show', 'demonstrate', 'showcase', 'display']
  },

  counting: {
    id: 'counting',
    name: 'Counting',
    description: 'Counting on fingers',
    keyframes: {
      leftHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: -10, y: -10, rotation: 0 },
        { x: -15, y: -10, rotation: 5 },
        { x: -20, y: -10, rotation: 10 }
      ],
      rightHand: [
        { x: 0, y: 0, rotation: 0 },
        { x: 10, y: -10, rotation: 0 },
        { x: 15, y: -10, rotation: -5 },
        { x: 20, y: -10, rotation: -10 }
      ]
    },
    duration: 1200,
    triggers: ['first', 'second', 'third', 'steps', 'points']
  }
};

export const bodyAnimations: Record<string, BodyAnimation> = {
  idle: {
    id: 'idle',
    name: 'Idle',
    description: 'Subtle breathing animation',
    keyframes: {
      head: [
        { x: 0, y: 0, rotation: 0 },
        { x: 0, y: -1, rotation: 0 },
        { x: 0, y: 0, rotation: 0 }
      ],
      shoulders: [
        { rotation: 0 },
        { rotation: 0.5 },
        { rotation: 0 }
      ],
      torso: [
        { x: 0, y: 0 },
        { x: 0, y: -0.5 },
        { x: 0, y: 0 }
      ]
    },
    duration: 3000,
    loop: true
  },

  nodding: {
    id: 'nodding',
    name: 'Nodding',
    description: 'Agreeing or understanding',
    keyframes: {
      head: [
        { x: 0, y: 0, rotation: 0 },
        { x: 0, y: 3, rotation: 5 },
        { x: 0, y: 0, rotation: 0 },
        { x: 0, y: 3, rotation: 5 },
        { x: 0, y: 0, rotation: 0 }
      ],
      shoulders: [
        { rotation: 0 },
        { rotation: 0 },
        { rotation: 0 },
        { rotation: 0 },
        { rotation: 0 }
      ],
      torso: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    },
    duration: 1000,
    loop: false
  },

  shaking: {
    id: 'shaking',
    name: 'Head Shaking',
    description: 'Disagreeing or saying no',
    keyframes: {
      head: [
        { x: 0, y: 0, rotation: 0 },
        { x: -2, y: 0, rotation: -3 },
        { x: 2, y: 0, rotation: 3 },
        { x: -2, y: 0, rotation: -3 },
        { x: 0, y: 0, rotation: 0 }
      ],
      shoulders: [
        { rotation: 0 },
        { rotation: 0 },
        { rotation: 0 },
        { rotation: 0 },
        { rotation: 0 }
      ],
      torso: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]
    },
    duration: 800,
    loop: false
  },

  leaning: {
    id: 'leaning',
    name: 'Leaning Forward',
    description: 'Showing interest or engagement',
    keyframes: {
      head: [
        { x: 0, y: 0, rotation: 0 },
        { x: 0, y: 5, rotation: 2 }
      ],
      shoulders: [
        { rotation: 0 },
        { rotation: 2 }
      ],
      torso: [
        { x: 0, y: 0 },
        { x: 0, y: 3 }
      ]
    },
    duration: 600,
    loop: false
  }
};

export class AnimationEngine {
  private currentGesture: string | null = null;
  private currentBodyAnimation: string | null = null;
  private isAnimating = false;
  private animationCallbacks: Map<string, () => void> = new Map();

  async playHandGesture(gestureId: string): Promise<void> {
    if (this.isAnimating) return;

    const gesture = handGestures[gestureId];
    if (!gesture) return;

    this.currentGesture = gestureId;
    this.isAnimating = true;

    // Trigger animation callback
    const callback = this.animationCallbacks.get(`gesture:${gestureId}`);
    if (callback) callback();

    // Simulate animation duration
    await new Promise(resolve => setTimeout(resolve, gesture.duration));

    this.currentGesture = null;
    this.isAnimating = false;
  }

  async playBodyAnimation(animationId: string): Promise<void> {
    const animation = bodyAnimations[animationId];
    if (!animation) return;

    this.currentBodyAnimation = animationId;

    // Trigger animation callback
    const callback = this.animationCallbacks.get(`body:${animationId}`);
    if (callback) callback();

    // Simulate animation duration
    await new Promise(resolve => setTimeout(resolve, animation.duration));

    if (!animation.loop) {
      this.currentBodyAnimation = null;
    }
  }

  detectGestureFromText(text: string): string | null {
    const lowerText = text.toLowerCase();
    
    for (const [gestureId, gesture] of Object.entries(handGestures)) {
      for (const trigger of gesture.triggers) {
        if (lowerText.includes(trigger)) {
          return gestureId;
        }
      }
    }
    
    return null;
  }

  detectBodyAnimationFromExpression(expression: ExpressionType): string | null {
    switch (expression) {
      case 'thinking':
        return 'leaning';
      case 'happy':
        return 'nodding';
      case 'explaining':
        return 'leaning';
      default:
        return 'idle';
    }
  }

  onAnimationStart(animationType: string, callback: () => void): void {
    this.animationCallbacks.set(animationType, callback);
  }

  getCurrentGesture(): string | null {
    return this.currentGesture;
  }

  getCurrentBodyAnimation(): string | null {
    return this.currentBodyAnimation;
  }

  isCurrentlyAnimating(): boolean {
    return this.isAnimating;
  }

  stopAllAnimations(): void {
    this.currentGesture = null;
    this.currentBodyAnimation = null;
    this.isAnimating = false;
  }
}

export const avatarAnimationEngine = new AnimationEngine();
