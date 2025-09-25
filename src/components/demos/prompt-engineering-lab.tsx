'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, TrendingUp, Zap, Brain, Target, BarChart3, CheckCircle } from 'lucide-react';

interface PromptTest {
  id: string;
  original: string;
  optimized: string;
  originalScore: number;
  optimizedScore: number;
  improvement: number;
  category: 'classification' | 'generation' | 'reasoning' | 'summarization';
  status: 'idle' | 'running' | 'completed';
}

interface LabMetrics {
  totalTests: number;
  averageImprovement: number;
  bestImprovement: number;
  successRate: number;
}

const promptTests: PromptTest[] = [
  {
    id: '1',
    original: 'Classify this text as positive or negative: "The movie was okay"',
    optimized: 'You are a sentiment analysis expert. Classify the following text as positive, negative, or neutral, providing confidence score and reasoning:\n\nText: "The movie was okay"\n\nFormat your response as:\nSentiment: [classification]\nConfidence: [0-100]%\nReasoning: [brief explanation]',
    originalScore: 72,
    optimizedScore: 89,
    improvement: 17,
    category: 'classification',
    status: 'idle'
  },
  {
    id: '2',
    original: 'Write a product description for a smartphone',
    optimized: 'You are a professional copywriter specializing in tech products. Write a compelling product description for a flagship smartphone that:\n\n1. Highlights 3 key features\n2. Uses emotional language to connect with customers\n3. Includes a clear call-to-action\n4. Targets tech-savvy millennials\n5. Keeps it under 150 words\n\nTone: Enthusiastic yet professional\nFocus: Innovation and lifestyle benefits',
    originalScore: 68,
    optimizedScore: 85,
    improvement: 17,
    category: 'generation',
    status: 'idle'
  },
  {
    id: '3',
    original: 'Solve this math problem: If a train travels 60 mph for 2 hours, how far does it go?',
    optimized: 'You are a mathematics tutor. Solve the following problem step-by-step, showing your work clearly:\n\nProblem: If a train travels at 60 mph for 2 hours, how far does it travel?\n\nPlease provide:\n1. The formula used\n2. Step-by-step calculation\n3. Final answer with units\n4. A brief explanation of the concept',
    originalScore: 78,
    optimizedScore: 94,
    improvement: 16,
    category: 'reasoning',
    status: 'idle'
  },
  {
    id: '4',
    original: 'Summarize this article about AI',
    optimized: 'You are a technical writer specializing in AI content. Create a comprehensive summary of the following article:\n\n[Article content would go here]\n\nYour summary should:\n1. Capture the main thesis in the first sentence\n2. Include 3-5 key points with supporting details\n3. Highlight any significant statistics or findings\n4. Conclude with implications or future outlook\n5. Use clear, accessible language for a general audience\n6. Keep it between 150-200 words',
    originalScore: 71,
    optimizedScore: 88,
    improvement: 17,
    category: 'summarization',
    status: 'idle'
  }
];

export default function PromptEngineeringLab() {
  const [tests, setTests] = useState<PromptTest[]>(promptTests);
  const [selectedTest, setSelectedTest] = useState<PromptTest>(tests[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<LabMetrics>({
    totalTests: 247,
    averageImprovement: 16.8,
    bestImprovement: 23.4,
    successRate: 94.7
  });

  const runTest = async (testId: string) => {
    setIsRunning(true);
    
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'running' } : test
    ));

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 3000));

    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: 'completed' } : test
    ));

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      totalTests: prev.totalTests + 1
    }));

    setIsRunning(false);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      setTests(prev => prev.map(t => 
        t.id === test.id ? { ...t, status: 'running' } : t
      ));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setTests(prev => prev.map(t => 
        t.id === test.id ? { ...t, status: 'completed' } : t
      ));
    }
    
    setMetrics(prev => ({
      ...prev,
      totalTests: prev.totalTests + tests.length
    }));
    
    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({ ...test, status: 'idle' })));
  };

  const getCategoryIcon = (category: PromptTest['category']) => {
    switch (category) {
      case 'classification': return <Target className="w-4 h-4" />;
      case 'generation': return <Zap className="w-4 h-4" />;
      case 'reasoning': return <Brain className="w-4 h-4" />;
      case 'summarization': return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: PromptTest['category']) => {
    switch (category) {
      case 'classification': return 'text-blue-500';
      case 'generation': return 'text-purple-500';
      case 'reasoning': return 'text-green-500';
      case 'summarization': return 'text-orange-500';
    }
  };

  const getStatusColor = (status: PromptTest['status']) => {
    switch (status) {
      case 'idle': return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
      case 'running': return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
      case 'completed': return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="bg-background border border-border rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Prompt Engineering Lab
          </h3>
          <p className="text-sm text-muted-foreground">
            LLM optimization research achieving +12% accuracy improvement
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4" />
            Run All Tests
          </motion.button>
          
          <motion.button
            onClick={resetTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted rounded-lg p-4 text-center">
          <BarChart3 className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.totalTests}</div>
          <div className="text-xs text-muted-foreground">Total Tests</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-foreground">+{metrics.averageImprovement}%</div>
          <div className="text-xs text-muted-foreground">Avg Improvement</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold text-foreground">+{metrics.bestImprovement}%</div>
          <div className="text-xs text-muted-foreground">Best Result</div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 text-center">
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold text-foreground">{metrics.successRate}%</div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test List */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Optimization Tests</h4>
          
          <div className="space-y-2">
            {tests.map((test) => (
              <motion.div
                key={test.id}
                onClick={() => setSelectedTest(test)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTest.id === test.id 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-border hover:border-purple-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-2 ${getCategoryColor(test.category)}`}>
                    {getCategoryIcon(test.category)}
                    <span className="text-sm font-medium capitalize">{test.category}</span>
                  </div>
                  
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(test.status)}`}>
                    {test.status === 'running' ? 'Running...' : test.status}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {test.original.substring(0, 60)}...
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Improvement: +{test.improvement}%
                  </div>
                  
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      runTest(test.id);
                    }}
                    disabled={isRunning}
                    className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Prompt Comparison */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">Prompt Comparison</h4>
            <div className={`flex items-center gap-2 ${getCategoryColor(selectedTest.category)}`}>
              {getCategoryIcon(selectedTest.category)}
              <span className="text-sm font-medium capitalize">{selectedTest.category}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Prompt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-foreground">Original Prompt</h5>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">Score:</div>
                  <div className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-sm font-medium">
                    {selectedTest.originalScore}%
                  </div>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 border-l-4 border-l-red-500">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {selectedTest.original}
                </pre>
              </div>
            </div>

            {/* Optimized Prompt */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-foreground">Optimized Prompt</h5>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">Score:</div>
                  <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm font-medium">
                    {selectedTest.optimizedScore}%
                  </div>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-4 border-l-4 border-l-green-500">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                  {selectedTest.optimized}
                </pre>
              </div>
            </div>
          </div>

          {/* Improvement Analysis */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h5 className="font-medium text-foreground">Improvement Analysis</h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+{selectedTest.improvement}%</div>
                <div className="text-sm text-muted-foreground">Performance Gain</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{selectedTest.optimizedScore - selectedTest.originalScore}</div>
                <div className="text-sm text-muted-foreground">Points Improved</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedTest.status === 'completed' ? '✓' : selectedTest.status === 'running' ? '⏳' : '⏸'}
                </div>
                <div className="text-sm text-muted-foreground">Test Status</div>
              </div>
            </div>
          </div>

          {/* Optimization Techniques */}
          <div className="bg-muted rounded-lg p-4">
            <h5 className="font-medium text-foreground mb-3">Optimization Techniques Applied</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Clear role definition</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Structured output format</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Context specification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Step-by-step instructions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Constraint definition</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Example provision</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Tech Stack:</span>
          {['OpenAI API', 'Research Methods', 'Data Analysis', 'A/B Testing', 'Performance Metrics'].map((tech) => (
            <span key={tech} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
