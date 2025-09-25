// Voice Integration System for AI Twin
import { ExpressionType, avatarExpressionManager } from './avatar-expressions';
import { avatarAnimationEngine } from './avatar-animations';

export interface VoiceConfig {
  language: 'en-US' | 'ar-SA';
  voice?: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface SpeechRecognitionConfig {
  language: 'en-US' | 'ar-SA';
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export class VoiceIntegration {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null; // SpeechRecognition
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private isListening = false;
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private voiceConfig: VoiceConfig = {
    language: 'en-US',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8
  };

  private recognitionConfig: SpeechRecognitionConfig = {
    language: 'en-US',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1
  };

  constructor() {
    this.initializeSpeechSynthesis();
    this.initializeSpeechRecognition();
  }

  private initializeSpeechSynthesis(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private initializeSpeechRecognition(): void {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.setupRecognitionEvents();
      }
    }
  }

  private setupRecognitionEvents(): void {
    if (!this.recognition) return;

    this.recognition.continuous = this.recognitionConfig.continuous;
    this.recognition.interimResults = this.recognitionConfig.interimResults;
    this.recognition.maxAlternatives = this.recognitionConfig.maxAlternatives;
    this.recognition.lang = this.recognitionConfig.language;

    this.recognition.onstart = () => {
      this.isListening = true;
      avatarExpressionManager.startListening();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      avatarExpressionManager.stopListening();
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      avatarExpressionManager.stopListening();
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      
      if (result.isFinal) {
        this.onSpeechRecognized?.(transcript);
      } else {
        this.onInterimResult?.(transcript);
      }
    };
  }

  async speak(text: string, options?: Partial<VoiceConfig>): Promise<void> {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop current speech
    this.stopSpeaking();

    const config = { ...this.voiceConfig, ...options };
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.lang = config.language;
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;

    // Set voice if specified
    if (config.voice) {
      const voices = this.synthesis!.getVoices();
      const selectedVoice = voices.find(voice =>
        voice.name === config.voice || voice.lang === config.language
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    return new Promise((resolve, reject) => {
      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
        avatarExpressionManager.startSpeaking();
        this.startLipSync();
        
        // Detect and play gestures
        const gesture = avatarAnimationEngine.detectGestureFromText(text);
        if (gesture) {
          avatarAnimationEngine.playHandGesture(gesture);
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        avatarExpressionManager.stopSpeaking();
        this.stopLipSync();
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        avatarExpressionManager.stopSpeaking();
        this.stopLipSync();
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      this.synthesis!.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis!.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
      avatarExpressionManager.stopSpeaking();
      this.stopLipSync();
    }
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  private async startLipSync(): Promise<void> {
    try {
      // Create audio context for lip sync
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;

      // Get microphone access for real-time audio analysis
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyser);

      this.updateLipSync();
    } catch (error) {
      console.warn('Could not start lip sync:', error);
    }
  }

  private updateLipSync(): void {
    if (!this.analyser || !this.isSpeaking) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate average audio level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = average / 255;

    // Update avatar lip sync
    avatarExpressionManager.updateLipSync(normalizedLevel);

    // Continue updating
    if (this.isSpeaking) {
      requestAnimationFrame(() => this.updateLipSync());
    }
  }

  private stopLipSync(): void {
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }

  setVoiceConfig(config: Partial<VoiceConfig>): void {
    this.voiceConfig = { ...this.voiceConfig, ...config };
  }

  setRecognitionConfig(config: Partial<SpeechRecognitionConfig>): void {
    this.recognitionConfig = { ...this.recognitionConfig, ...config };
    if (this.recognition) {
      this.recognition.lang = this.recognitionConfig.language;
      this.recognition.continuous = this.recognitionConfig.continuous;
      this.recognition.interimResults = this.recognitionConfig.interimResults;
      this.recognition.maxAlternatives = this.recognitionConfig.maxAlternatives;
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis!.getVoices();
  }

  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  // Event handlers (to be set by components)
  onSpeechRecognized?: (transcript: string) => void;
  onInterimResult?: (transcript: string) => void;
  onListeningStart?: () => void;
  onListeningEnd?: () => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;

  // Utility methods
  async speakWithExpression(text: string, expression: ExpressionType): Promise<void> {
    // Set expression before speaking
    await avatarExpressionManager.setExpression(expression);
    
    // Speak the text
    await this.speak(text);
    
    // Return to neutral after speaking
    setTimeout(() => {
      avatarExpressionManager.setExpression('neutral');
    }, 500);
  }

  async respondToMessage(message: string, response: string): Promise<void> {
    // Show thinking expression
    await avatarExpressionManager.setExpression('thinking');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show explaining expression and speak
    await this.speakWithExpression(response, 'explaining');
  }
}

export const voiceIntegration = new VoiceIntegration();
