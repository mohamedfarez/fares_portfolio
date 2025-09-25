'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Stethoscope, Brain, Eye, ChevronLeft, ChevronRight, Play, Award } from 'lucide-react';
import LazyDemoLoader, { useDemoPerformance } from './lazy-demo-loader';
import { usePerformanceMonitor } from '@/lib/performance/performance-monitor';

interface Demo {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  achievement?: string;
  techStack: string[];
  color: string;
}

const demos: Demo[] = [
  {
    id: 'smatest',
    title: 'SmaTest - AI Exam Monitoring',
    description: 'Real-time examination monitoring system using Computer Vision and YOLOv5 for detecting suspicious activities',
    icon: Shield,
    category: 'Computer Vision',
    achievement: '🏆 1st Place Winner',
    techStack: ['YOLOv5', 'OpenCV', 'TensorFlow', 'Real-time Processing'],
    color: 'blue'
  },
  {
    id: 'healthcare',
    title: 'Healthcare AI Assistant',
    description: 'Medical consultation chatbot powered by Gemini API for symptom analysis and health guidance',
    icon: Stethoscope,
    category: 'NLP & Healthcare',
    techStack: ['Gemini API', 'NLP', 'Medical Knowledge Base', 'Real-time Chat'],
    color: 'green'
  },
  {
    id: 'prompt',
    title: 'Prompt Engineering Lab',
    description: 'LLM optimization research platform achieving +12% accuracy improvement in model responses',
    icon: Brain,
    category: 'Prompt Engineering',
    achievement: '📈 +12% Improvement',
    techStack: ['OpenAI API', 'Research Methods', 'Data Analysis', 'A/B Testing'],
    color: 'purple'
  },
  {
    id: 'vision',
    title: 'Computer Vision Showcase',
    description: 'Real-time image analysis with object detection, face recognition, and scene understanding',
    icon: Eye,
    category: 'Computer Vision',
    techStack: ['YOLOv5', 'OpenCV', 'TensorFlow', 'Object Detection'],
    color: 'orange'
  }
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    text: 'text-blue-500',
    border: 'border-blue-500',
    gradient: 'from-blue-500 to-blue-600'
  },
  green: {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    text: 'text-green-500',
    border: 'border-green-500',
    gradient: 'from-green-500 to-green-600'
  },
  purple: {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    text: 'text-purple-500',
    border: 'border-purple-500',
    gradient: 'from-purple-500 to-purple-600'
  },
  orange: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    text: 'text-orange-500',
    border: 'border-orange-500',
    gradient: 'from-orange-500 to-orange-600'
  }
};

export default function DemoShowcase() {
  const [activeDemo, setActiveDemo] = useState<Demo>(demos[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { averageLoadTime, memoryUsage } = usePerformanceMonitor();

  const handleDemoChange = async (demo: Demo) => {
    if (demo.id === activeDemo.id) return;
    
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveDemo(demo);
    setIsTransitioning(false);
  };

  const navigateDemo = (direction: 'prev' | 'next') => {
    const currentIndex = demos.findIndex(demo => demo.id === activeDemo.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : demos.length - 1;
    } else {
      newIndex = currentIndex < demos.length - 1 ? currentIndex + 1 : 0;
    }
    
    handleDemoChange(demos[newIndex]);
  };

  const colors = colorClasses[activeDemo.color as keyof typeof colorClasses];

  // Map demo IDs to lazy loader types
  const getDemoType = (demoId: string): 'smatest' | 'healthcare' | 'prompt' | 'vision' => {
    switch (demoId) {
      case 'smatest': return 'smatest';
      case 'healthcare': return 'healthcare';
      case 'prompt': return 'prompt';
      case 'vision': return 'vision';
      default: return 'smatest';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h2 className="text-3xl font-bold text-foreground">Live AI Demos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience my AI projects in action. Interactive demonstrations showcasing real-world applications 
            of Computer Vision, NLP, and Prompt Engineering.
          </p>
        </motion.div>

        {/* Demo Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span>4 Interactive Demos</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span>Award-Winning Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span>Real AI Applications</span>
          </div>
          {averageLoadTime > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Avg Load: {averageLoadTime.toFixed(0)}ms</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Demo Navigation */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={() => navigateDemo('prev')}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </motion.button>

        {/* Demo Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {demos.map((demo, index) => {
            const demoColors = colorClasses[demo.color as keyof typeof colorClasses];
            const isActive = demo.id === activeDemo.id;
            
            return (
              <motion.button
                key={demo.id}
                onClick={() => handleDemoChange(demo)}
                className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all min-w-[200px] ${
                  isActive 
                    ? `${demoColors.border} bg-gradient-to-br ${demoColors.gradient} text-white` 
                    : 'border-border bg-background hover:border-muted-foreground/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <demo.icon className={`w-5 h-5 ${isActive ? 'text-white' : demoColors.text}`} />
                  <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-foreground'}`}>
                    {demo.title}
                  </span>
                </div>
                
                <div className={`text-xs ${isActive ? 'text-white/90' : 'text-muted-foreground'} mb-2`}>
                  {demo.category}
                </div>
                
                {demo.achievement && (
                  <div className={`text-xs font-medium ${isActive ? 'text-white' : demoColors.text}`}>
                    {demo.achievement}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={() => navigateDemo('next')}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Active Demo Info */}
      <motion.div
        key={activeDemo.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted rounded-xl p-6"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <activeDemo.icon className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-foreground">{activeDemo.title}</h3>
              {activeDemo.achievement && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${colors.text} bg-background border ${colors.border}`}>
                  {activeDemo.achievement}
                </span>
              )}
            </div>
            
            <p className="text-muted-foreground mb-3">{activeDemo.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Tech Stack:</span>
              {activeDemo.techStack.map((tech) => (
                <span 
                  key={tech} 
                  className={`px-2 py-1 rounded text-xs ${colors.text} bg-background border ${colors.border}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Demo Component */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDemo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {!isTransitioning && (
            <LazyDemoLoader
              demoType={getDemoType(activeDemo.id)}
              className="w-full"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Demo Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Play className="w-5 h-5 text-white" />
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-2">How to Use the Demos</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>SmaTest:</strong> Click "Start Monitoring" to begin webcam-based exam monitoring simulation</p>
              <p>• <strong>Healthcare AI:</strong> Type symptoms or use quick buttons to get medical guidance</p>
              <p>• <strong>Prompt Lab:</strong> Run optimization tests to see +12% improvement in action</p>
              <p>• <strong>Computer Vision:</strong> Use camera or upload images for real-time object detection</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
