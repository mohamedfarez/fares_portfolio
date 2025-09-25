'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Heart, Brain, Stethoscope, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  confidence?: number;
  category?: 'symptom' | 'diagnosis' | 'advice' | 'emergency';
}

interface HealthMetrics {
  consultationsToday: number;
  accuracyRate: number;
  responseTime: string;
  emergencyAlerts: number;
}

const medicalResponses = {
  'headache': {
    response: "Based on your symptoms, this could be a tension headache. I recommend: 1) Rest in a quiet, dark room 2) Apply cold compress 3) Stay hydrated 4) Consider over-the-counter pain relief. If symptoms persist or worsen, please consult a healthcare professional.",
    confidence: 0.87,
    category: 'diagnosis' as const
  },
  'fever': {
    response: "Fever can indicate various conditions. Current recommendations: 1) Monitor temperature regularly 2) Stay hydrated 3) Rest 4) Consider fever reducers if temperature >101°F. Seek immediate medical attention if fever >103°F or accompanied by severe symptoms.",
    confidence: 0.92,
    category: 'advice' as const
  },
  'chest pain': {
    response: "⚠️ EMERGENCY ALERT: Chest pain can be serious. Please seek immediate medical attention or call emergency services. Do not delay treatment. While waiting: 1) Sit upright 2) Loosen tight clothing 3) Take prescribed medications if available.",
    confidence: 0.95,
    category: 'emergency' as const
  },
  'cough': {
    response: "Persistent cough analysis: This could be due to various causes including viral infection, allergies, or respiratory conditions. Recommendations: 1) Stay hydrated 2) Use humidifier 3) Avoid irritants 4) Consider honey for throat soothing. Consult doctor if cough persists >2 weeks.",
    confidence: 0.84,
    category: 'diagnosis' as const
  },
  'fatigue': {
    response: "Chronic fatigue assessment: Multiple factors could contribute including sleep patterns, stress, nutrition, or underlying conditions. Suggestions: 1) Maintain regular sleep schedule 2) Balanced nutrition 3) Regular exercise 4) Stress management. Consider medical evaluation if fatigue persists.",
    confidence: 0.79,
    category: 'advice' as const
  }
};

const quickSymptoms = [
  'I have a headache',
  'I\'m experiencing chest pain',
  'I have a persistent cough',
  'I\'m feeling very tired lately',
  'I have a fever'
];

export default function HealthcareChatbotDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI Medical Assistant powered by Gemini API. I can help analyze symptoms and provide preliminary health guidance. Please describe your symptoms or health concerns.',
      timestamp: new Date(),
      category: 'advice'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [metrics, setMetrics] = useState<HealthMetrics>({
    consultationsToday: 127,
    accuracyRate: 94.3,
    responseTime: '1.2s',
    emergencyAlerts: 3
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeSymptoms = (input: string): { response: string; confidence: number; category: ChatMessage['category'] } => {
    const lowerInput = input.toLowerCase();
    
    for (const [symptom, data] of Object.entries(medicalResponses)) {
      if (lowerInput.includes(symptom)) {
        return data;
      }
    }

    // Default response for unrecognized symptoms
    return {
      response: "Thank you for sharing your symptoms. While I can provide general health information, I recommend consulting with a qualified healthcare professional for a proper diagnosis and treatment plan. Is there anything specific about your symptoms you'd like me to help clarify?",
      confidence: 0.75,
      category: 'advice'
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const analysis = analyzeSymptoms(inputValue);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: analysis.response,
        timestamp: new Date(),
        confidence: analysis.confidence,
        category: analysis.category
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Update metrics
      setMetrics(prev => ({
        ...prev,
        consultationsToday: prev.consultationsToday + 1,
        emergencyAlerts: analysis.category === 'emergency' ? prev.emergencyAlerts + 1 : prev.emergencyAlerts
      }));
    }, 1500);
  };

  const handleQuickSymptom = (symptom: string) => {
    setInputValue(symptom);
  };

  const getCategoryIcon = (category?: ChatMessage['category']) => {
    switch (category) {
      case 'symptom': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'diagnosis': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'advice': return <Heart className="w-4 h-4 text-green-500" />;
      case 'emergency': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Stethoscope className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category?: ChatMessage['category']) => {
    switch (category) {
      case 'emergency': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'diagnosis': return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/20';
      case 'advice': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-green-500" />
            Healthcare AI Assistant
          </h3>
          <p className="text-sm text-muted-foreground">
            Medical consultation chatbot powered by Gemini API & NLP
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-muted-foreground">AI Doctor Online</span>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted rounded-lg p-4 text-center">
          <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.consultationsToday}</div>
          <div className="text-xs text-muted-foreground">Consultations Today</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.accuracyRate}%</div>
          <div className="text-xs text-muted-foreground">Accuracy Rate</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <Activity className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.responseTime}</div>
          <div className="text-xs text-muted-foreground">Avg Response</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.emergencyAlerts}</div>
          <div className="text-xs text-muted-foreground">Emergency Alerts</div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Messages */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-muted rounded-lg p-4 h-96 overflow-y-auto space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div className={`rounded-lg p-3 border-l-4 ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white border-l-blue-600' 
                        : getCategoryColor(message.category)
                    }`}>
                      <div className="flex items-start gap-2">
                        {message.type === 'bot' && getCategoryIcon(message.category)}
                        <div className="flex-1">
                          <p className={`text-sm ${message.type === 'user' ? 'text-white' : 'text-foreground'}`}>
                            {message.content}
                          </p>
                          {message.confidence && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Confidence: {(message.confidence * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 px-3">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg p-3 border-l-4 border-l-green-500">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe your symptoms or health concerns..."
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Quick Symptoms */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Quick Symptoms</h4>
          <div className="space-y-2">
            {quickSymptoms.map((symptom, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickSymptom(symptom)}
                className="w-full text-left p-3 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {symptom}
              </motion.button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Disclaimer:</strong> This AI assistant provides general health information only. Always consult qualified healthcare professionals for medical advice.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Tech Stack:</span>
          {['Gemini API', 'NLP', 'Medical Knowledge Base', 'Real-time Chat', 'Symptom Analysis'].map((tech) => (
            <span key={tech} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
