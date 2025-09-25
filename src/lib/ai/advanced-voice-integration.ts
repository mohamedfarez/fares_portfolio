// Advanced Voice Integration with TTS and Speech Recognition
export interface VoiceSettings {
  rate: number; // 0.1 to 10
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
  voice?: SpeechSynthesisVoice;
  language: string;
}

export interface SpeechRecognitionSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

class AdvancedVoiceIntegration {
  private synthesis: SpeechSynthesis | null = null;
  private recognition: any = null; // SpeechRecognition
  private isSupported = false;
  private isSpeaking = false;
  private isListening = false;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Default settings
  private voiceSettings: VoiceSettings = {
    rate: 1,
    pitch: 1,
    volume: 0.8,
    language: 'en-US',
  };

  private recognitionSettings: SpeechRecognitionSettings = {
    language: 'en-US',
    continuous: false,
    interimResults: true,
    maxAlternatives: 1,
  };

  // Event callbacks
  private onSpeechStart?: () => void;
  private onSpeechEnd?: () => void;
  private onSpeechError?: (error: string) => void;
  private onListenStart?: () => void;
  private onListenEnd?: () => void;
  private onListenResult?: (transcript: string, isFinal: boolean) => void;
  private onListenError?: (error: string) => void;

  constructor() {
    this.initializeVoiceSupport();
  }

  private initializeVoiceSupport() {
    if (typeof window === 'undefined') return;

    // Check for Speech Synthesis support
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();
      this.isSupported = true;

      // Load voices when they become available
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }

    // Check for Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupSpeechRecognition();
    }
  }

  private loadVoices() {
    if (!this.synthesis) return;
    
    this.voices = this.synthesis.getVoices();
    
    // Try to find a good default voice
    const preferredVoice = this.voices.find(voice => 
      voice.lang.startsWith(this.voiceSettings.language) && voice.default
    ) || this.voices.find(voice => 
      voice.lang.startsWith(this.voiceSettings.language)
    ) || this.voices[0];

    if (preferredVoice) {
      this.voiceSettings.voice = preferredVoice;
    }
  }

  private setupSpeechRecognition() {
    if (!this.recognition) return;

    this.recognition.lang = this.recognitionSettings.language;
    this.recognition.continuous = this.recognitionSettings.continuous;
    this.recognition.interimResults = this.recognitionSettings.interimResults;
    this.recognition.maxAlternatives = this.recognitionSettings.maxAlternatives;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.onListenStart?.();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.onListenEnd?.();
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const isFinal = result.isFinal;
      
      this.onListenResult?.(transcript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      this.onListenError?.(event.error);
    };
  }

  // Text-to-Speech methods
  async speak(text: string, options?: Partial<VoiceSettings>): Promise<void> {
    if (!this.synthesis || !text.trim()) return;

    // Stop any current speech
    this.stopSpeaking();

    const settings = { ...this.voiceSettings, ...options };
    
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = settings.rate;
      utterance.pitch = settings.pitch;
      utterance.volume = settings.volume;
      utterance.lang = settings.language;
      
      if (settings.voice) {
        utterance.voice = settings.voice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
        this.onSpeechStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.onSpeechEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.onSpeechError?.(event.error);
        reject(new Error(event.error));
      };

      this.synthesis?.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  pauseSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  resumeSpeaking() {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.resume();
    }
  }

  // Speech Recognition methods
  startListening(): Promise<string> {
    if (!this.recognition) {
      return Promise.reject(new Error('Speech recognition not supported'));
    }

    return new Promise((resolve, reject) => {
      let finalTranscript = '';

      const originalOnResult = this.onListenResult;
      const originalOnError = this.onListenError;
      const originalOnEnd = this.onListenEnd;

      this.onListenResult = (transcript, isFinal) => {
        if (isFinal) {
          finalTranscript = transcript;
        }
        originalOnResult?.(transcript, isFinal);
      };

      this.onListenError = (error) => {
        this.onListenResult = originalOnResult;
        this.onListenError = originalOnError;
        this.onListenEnd = originalOnEnd;
        originalOnError?.(error);
        reject(new Error(error));
      };

      this.onListenEnd = () => {
        this.onListenResult = originalOnResult;
        this.onListenError = originalOnError;
        this.onListenEnd = originalOnEnd;
        originalOnEnd?.();
        resolve(finalTranscript);
      };

      this.recognition.start();
    });
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Settings methods
  updateVoiceSettings(settings: Partial<VoiceSettings>) {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
  }

  updateRecognitionSettings(settings: Partial<SpeechRecognitionSettings>) {
    this.recognitionSettings = { ...this.recognitionSettings, ...settings };
    if (this.recognition) {
      this.setupSpeechRecognition();
    }
  }

  // Event handlers
  onSpeechEvents(handlers: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  }) {
    this.onSpeechStart = handlers.onStart;
    this.onSpeechEnd = handlers.onEnd;
    this.onSpeechError = handlers.onError;
  }

  onListenEvents(handlers: {
    onStart?: () => void;
    onEnd?: () => void;
    onResult?: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
  }) {
    this.onListenStart = handlers.onStart;
    this.onListenEnd = handlers.onEnd;
    this.onListenResult = handlers.onResult;
    this.onListenError = handlers.onError;
  }

  // Getters
  get isVoiceSupported() { return this.isSupported; }
  get isCurrentlySpeaking() { return this.isSpeaking; }
  get isCurrentlyListening() { return this.isListening; }
  get availableVoices() { return [...this.voices]; }
  get currentVoiceSettings() { return { ...this.voiceSettings }; }
  get currentRecognitionSettings() { return { ...this.recognitionSettings }; }

  // Utility methods
  getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => voice.lang.startsWith(language));
  }

  setLanguage(language: string) {
    this.voiceSettings.language = language;
    this.recognitionSettings.language = language;
    
    // Update voice to match language
    const voice = this.getVoicesByLanguage(language)[0];
    if (voice) {
      this.voiceSettings.voice = voice;
    }

    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}

// Singleton instance
export const advancedVoiceIntegration = new AdvancedVoiceIntegration();
