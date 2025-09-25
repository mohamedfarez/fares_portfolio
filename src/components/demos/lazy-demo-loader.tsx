'use client';

import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy load demo components
const SmaTestDemo = lazy(() => import('./smatest-demo'));
const HealthcareChatbotDemo = lazy(() => import('./healthcare-chatbot-demo'));
const PromptEngineeringLab = lazy(() => import('./prompt-engineering-lab'));
const ComputerVisionDemo = lazy(() => import('./computer-vision-demo'));

interface LazyDemoLoaderProps {
  demoType: 'smatest' | 'healthcare' | 'prompt' | 'vision';
  className?: string;
}

// Loading component
const DemoLoadingSpinner = () => (
  <motion.div
    className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800 rounded-xl"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="mb-4"
    >
      <Loader2 className="w-8 h-8 text-blue-500" />
    </motion.div>
    <p className="text-gray-600 dark:text-gray-400 font-medium">
      Loading AI Demo...
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
      Preparing interactive experience
    </p>
  </motion.div>
);

// Error boundary component
class DemoErrorBoundary extends React.Component<
  { children: React.ReactNode; demoName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; demoName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Demo ${this.props.demoName} failed to load:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
            Demo Loading Failed
          </h3>
          <p className="text-red-600 dark:text-red-300 text-center">
            Unable to load {this.props.demoName} demo. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Refresh Page
          </button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default function LazyDemoLoader({ demoType, className = '' }: LazyDemoLoaderProps) {
  const getDemoComponent = () => {
    switch (demoType) {
      case 'smatest':
        return <SmaTestDemo />;
      case 'healthcare':
        return <HealthcareChatbotDemo />;
      case 'prompt':
        return <PromptEngineeringLab />;
      case 'vision':
        return <ComputerVisionDemo />;
      default:
        return <div>Unknown demo type</div>;
    }
  };

  const getDemoName = () => {
    switch (demoType) {
      case 'smatest':
        return 'SmaTest AI Monitoring';
      case 'healthcare':
        return 'Healthcare AI Assistant';
      case 'prompt':
        return 'Prompt Engineering Lab';
      case 'vision':
        return 'Computer Vision Showcase';
      default:
        return 'AI Demo';
    }
  };

  return (
    <div className={className}>
      <DemoErrorBoundary demoName={getDemoName()}>
        <Suspense fallback={<DemoLoadingSpinner />}>
          {getDemoComponent()}
        </Suspense>
      </DemoErrorBoundary>
    </div>
  );
}

// Performance monitoring hook
export const useDemoPerformance = (demoName: string) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Log performance metrics
      console.log(`Demo ${demoName} load time: ${loadTime.toFixed(2)}ms`);
      
      // Send to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'demo_load_time', {
          demo_name: demoName,
          load_time: Math.round(loadTime),
        });
      }
    };
  }, [demoName]);
};
