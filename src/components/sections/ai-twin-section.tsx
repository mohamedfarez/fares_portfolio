'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mic, Send, Volume2, Brain, TrendingUp, Target } from 'lucide-react';
import ProfessionalAvatar from '@/components/ai-twin/professional-avatar';
import EnhancedAvatar from '@/components/ai-twin/enhanced-avatar';
import AvatarSelector from '@/components/ai-twin/avatar-selector';
import { ExpressionType } from '@/lib/ai/avatar-expressions';
import { voiceIntegration } from '@/lib/ai/voice-integration';

export function AITwinSection() {
  const t = useTranslations('aiTwin');
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const [engagementScore, setEngagementScore] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [avatarExpression, setAvatarExpression] = useState<ExpressionType>('neutral');
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [isAvatarListening, setIsAvatarListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hi there! I'm Fares, an AI Engineer specializing in Prompt Engineering, Computer Vision, and NLP. I help companies solve their biggest AI challenges and drive real business results. What brings you here today?",
    },
  ]);

  const suggestions = [
    "Tell me about your AI projects",
    "What's your experience with prompt engineering?",
    "How can you help my business with AI?",
    "Show me your portfolio and achievements"
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize voice integration
  useEffect(() => {
    // Setup voice integration callbacks
    voiceIntegration.onSpeechRecognized = (transcript: string) => {
      setMessage(transcript);
      setIsAvatarListening(false);
      setIsListening(false);
    };

    voiceIntegration.onSpeakingStart = () => {
      setIsAvatarSpeaking(true);
      setAvatarExpression('speaking');
    };

    voiceIntegration.onSpeakingEnd = () => {
      setIsAvatarSpeaking(false);
      setAvatarExpression('neutral');
    };

    voiceIntegration.onListeningStart = () => {
      setIsAvatarListening(true);
      setAvatarExpression('listening');
    };

    voiceIntegration.onListeningEnd = () => {
      setIsAvatarListening(false);
      setAvatarExpression('neutral');
    };
  }, []);

  // Update avatar expression based on conversation state
  useEffect(() => {
    if (isLoading) {
      setAvatarExpression('thinking');
    } else if (isAvatarSpeaking) {
      setAvatarExpression('speaking');
    } else if (isAvatarListening) {
      setAvatarExpression('listening');
    } else {
      setAvatarExpression('neutral');
    }
  }, [isLoading, isAvatarSpeaking, isAvatarListening]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add AI response
      setMessages(prev => [...prev, {
        type: 'ai',
        content: data.response
      }]);

      // Update engagement metrics
      setEngagementScore(data.engagementScore || 0);
      setCurrentStage(data.currentStage || 1);

      // Speak the response if voice is enabled
      if (isVoiceEnabled) {
        await voiceIntegration.speakWithExpression(data.response, 'explaining');
      } else {
        // Just show expression without speaking
        setAvatarExpression('explaining');
        setTimeout(() => setAvatarExpression('neutral'), 2000);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "I apologize, but I'm having trouble connecting right now. Please try again or contact me directly at mohamedhfares5@gmail.com"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      voiceIntegration.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      await voiceIntegration.startListening();
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isAvatarSpeaking) {
      voiceIntegration.stopSpeaking();
    }
  };

  return (
    <section id="ai-twin" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-ai-blue to-ai-purple bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Engagement Metrics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-ai-blue" />
              <span className="text-sm font-medium">Engagement Score</span>
            </div>
            <div className="text-2xl font-bold text-ai-blue">{engagementScore}/100</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-ai-blue to-ai-purple h-2 rounded-full transition-all duration-500"
                style={{ width: `${engagementScore}%` }}
              />
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-ai-green" />
              <span className="text-sm font-medium">Conversation Stage</span>
            </div>
            <div className="text-2xl font-bold text-ai-green">{currentStage}/5</div>
            <div className="text-xs text-muted-foreground mt-1">
              {currentStage <= 1 ? 'Introduction' :
               currentStage <= 2 ? 'Technical Discussion' :
               currentStage <= 4 ? 'Expertise Showcase' : 'Collaboration'}
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-ai-purple" />
              <span className="text-sm font-medium">AI Status</span>
            </div>
            <div className="text-2xl font-bold text-ai-purple">
              {isLoading ? 'Thinking...' : 'Ready'}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-ai-orange animate-pulse' : 'bg-ai-green'}`} />
              <span className="text-xs text-muted-foreground">
                {isLoading ? 'Processing' : 'Online'}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            {/* Avatar Container */}
            <div className="relative mb-6 flex flex-col items-center">
              <AvatarSelector
                expression={avatarExpression}
                isListening={isAvatarListening}
                isSpeaking={isAvatarSpeaking}
                size="xl"
                className="mb-4"
              />

              {/* Voice Controls */}
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={toggleVoice}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isVoiceEnabled
                      ? 'bg-ai-green text-white shadow-lg'
                      : 'bg-muted text-muted-foreground hover:bg-ai-green/20'
                  }`}
                  title={isVoiceEnabled ? 'Voice Enabled' : 'Enable Voice'}
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                <button
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isListening
                      ? 'bg-ai-blue text-white shadow-lg animate-pulse'
                      : 'bg-muted text-muted-foreground hover:bg-ai-blue/20'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice Input'}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${
                  isAvatarSpeaking ? 'bg-ai-green animate-pulse' :
                  isAvatarListening ? 'bg-ai-blue animate-pulse' :
                  isLoading ? 'bg-ai-orange animate-pulse' : 'bg-ai-green'
                }`} />
                <span>
                  {isAvatarSpeaking ? 'Speaking...' :
                   isAvatarListening ? 'Listening...' :
                   isLoading ? 'Thinking...' : t('status.online')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col h-96"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-ai-blue to-ai-purple text-white'
                        : 'bg-muted text-foreground border border-border'
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{msg.content}</div>
                    {msg.type === 'ai' && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Brain className="w-3 h-3" />
                        <span>Fares AI</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted text-foreground border border-border px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-ai-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-ai-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-ai-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-muted-foreground">Fares is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="grid grid-cols-2 gap-2 my-4">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 text-xs text-left bg-muted hover:bg-accent rounded-lg transition-colors duration-200 truncate"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask me anything about my AI expertise..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ai-blue/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-ai-blue border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <button
                onClick={handleVoiceInput}
                disabled={isLoading}
                className={`p-3 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening
                    ? 'bg-ai-blue text-white border-ai-blue animate-pulse'
                    : 'border-border hover:bg-accent'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="p-3 rounded-lg bg-gradient-to-r from-ai-blue to-ai-purple text-white hover:shadow-lg hover:shadow-ai-blue/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                title="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
