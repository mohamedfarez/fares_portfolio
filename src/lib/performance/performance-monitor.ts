// Performance monitoring utilities
export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
  timestamp: number;
}

export interface WebVitals {
  CLS: number; // Cumulative Layout Shift
  FID: number; // First Input Delay
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  TTFB: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private vitals: Partial<WebVitals> = {};

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.trackWebVitals();
    }
  }

  private initializeObservers() {
    // Performance observer for navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric({
              loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
              renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              interactionTime: navEntry.domInteractive - navEntry.fetchStart,
              timestamp: Date.now(),
            });
          }
        });
      });

      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Performance observer for resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('chunk') || entry.name.includes('.js')) {
            console.log(`Resource ${entry.name} loaded in ${entry.duration.toFixed(2)}ms`);
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private trackWebVitals() {
    // Track Core Web Vitals
    if (typeof window !== 'undefined') {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        this.vitals.FCP = fcp.startTime;
        this.reportVital('FCP', fcp.startTime);
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        this.vitals.LCP = lcp.startTime;
        this.reportVital('LCP', lcp.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.vitals.CLS = clsValue;
        this.reportVital('CLS', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.vitals.FID = entry.processingStart - entry.startTime;
          this.reportVital('FID', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });
    }
  }

  private reportVital(name: string, value: number) {
    console.log(`Web Vital ${name}: ${value.toFixed(2)}`);
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'web_vital', {
        metric_name: name,
        metric_value: Math.round(value),
        metric_rating: this.getVitalRating(name, value),
      });
    }
  }

  private getVitalRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getWebVitals(): Partial<WebVitals> {
    return { ...this.vitals };
  }

  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return total / this.metrics.length;
  }

  getMemoryUsage(): { used: number; total: number; limit: number } | null {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  // Clean up observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
import React from 'react';

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics[]>([]);
  const [webVitals, setWebVitals] = React.useState<Partial<WebVitals>>({});

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
      setWebVitals(performanceMonitor.getWebVitals());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    webVitals,
    averageLoadTime: performanceMonitor.getAverageLoadTime(),
    memoryUsage: performanceMonitor.getMemoryUsage(),
  };
};

// Performance tracking utilities
export const trackComponentRender = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    performanceMonitor.recordMetric({
      loadTime: 0,
      renderTime,
      interactionTime: 0,
      timestamp: Date.now(),
    });
    
    console.log(`Component ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
  };
};

export const trackUserInteraction = (interactionType: string, elementName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const interactionTime = endTime - startTime;
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'user_interaction', {
        interaction_type: interactionType,
        element_name: elementName,
        interaction_time: Math.round(interactionTime),
      });
    }
    
    console.log(`${interactionType} on ${elementName} took ${interactionTime.toFixed(2)}ms`);
  };
};
