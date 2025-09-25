// Analytics and Tracking System
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface UserProperties {
  user_id?: string;
  language?: string;
  device_type?: string;
  engagement_score?: number;
  ai_interaction_count?: number;
  demo_usage_count?: number;
}

class AnalyticsManager {
  private isInitialized = false;
  private trackingId: string | null = null;
  private debugMode = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.debugMode = window.location.hostname === 'localhost';
    }
  }

  // Initialize Google Analytics
  initialize(trackingId: string) {
    if (typeof window === 'undefined' || this.isInitialized) return;

    this.trackingId = trackingId;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    // Configure Google Analytics
    window.gtag('js', new Date());
    window.gtag('config', trackingId, {
      page_title: document.title,
      page_location: window.location.href,
      debug_mode: this.debugMode,
      send_page_view: true,
    });

    this.isInitialized = true;
    this.log('Analytics initialized with tracking ID:', trackingId);
  }

  // Track page views
  trackPageView(url: string, title?: string) {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId!, {
      page_title: title || document.title,
      page_location: url,
    });

    this.log('Page view tracked:', { url, title });
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized) return;

    const { action, category, label, value, custom_parameters } = event;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...custom_parameters,
    });

    this.log('Event tracked:', event);
  }

  // Track user properties
  setUserProperties(properties: UserProperties) {
    if (!this.isInitialized) return;

    window.gtag('config', this.trackingId!, {
      custom_map: properties,
    });

    this.log('User properties set:', properties);
  }

  // Track AI interactions
  trackAIInteraction(type: 'chat' | 'voice' | 'demo', details: Record<string, any>) {
    this.trackEvent({
      action: 'ai_interaction',
      category: 'AI',
      label: type,
      custom_parameters: {
        interaction_type: type,
        ...details,
      },
    });
  }

  // Track demo usage
  trackDemoUsage(demoName: string, action: 'start' | 'complete' | 'error', duration?: number) {
    this.trackEvent({
      action: 'demo_usage',
      category: 'Demos',
      label: demoName,
      value: duration,
      custom_parameters: {
        demo_name: demoName,
        demo_action: action,
        duration_ms: duration,
      },
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, category = 'Performance') {
    this.trackEvent({
      action: 'performance_metric',
      category,
      label: metric,
      value: Math.round(value),
      custom_parameters: {
        metric_name: metric,
        metric_value: value,
      },
    });
  }

  // Track user engagement
  trackEngagement(score: number, stage: string) {
    this.trackEvent({
      action: 'engagement_update',
      category: 'Engagement',
      label: stage,
      value: score,
      custom_parameters: {
        engagement_score: score,
        conversation_stage: stage,
      },
    });
  }

  // Track errors
  trackError(error: Error, context?: string) {
    this.trackEvent({
      action: 'error',
      category: 'Errors',
      label: error.name,
      custom_parameters: {
        error_message: error.message,
        error_stack: error.stack,
        error_context: context,
      },
    });
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, fields?: Record<string, any>) {
    this.trackEvent({
      action: 'form_submission',
      category: 'Forms',
      label: formName,
      custom_parameters: {
        form_name: formName,
        submission_success: success,
        form_fields: fields,
      },
    });
  }

  // Track downloads
  trackDownload(fileName: string, fileType: string) {
    this.trackEvent({
      action: 'download',
      category: 'Downloads',
      label: fileName,
      custom_parameters: {
        file_name: fileName,
        file_type: fileType,
      },
    });
  }

  // Track external links
  trackExternalLink(url: string, linkText?: string) {
    this.trackEvent({
      action: 'external_link_click',
      category: 'External Links',
      label: url,
      custom_parameters: {
        link_url: url,
        link_text: linkText,
      },
    });
  }

  // Track scroll depth
  trackScrollDepth(percentage: number) {
    if (percentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
      this.trackEvent({
        action: 'scroll_depth',
        category: 'Engagement',
        label: `${percentage}%`,
        value: percentage,
      });
    }
  }

  // Track time on page
  trackTimeOnPage(seconds: number) {
    this.trackEvent({
      action: 'time_on_page',
      category: 'Engagement',
      value: seconds,
      custom_parameters: {
        time_seconds: seconds,
      },
    });
  }

  private log(...args: any[]) {
    if (this.debugMode) {
      console.log('[Analytics]', ...args);
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsManager();

// React hooks for analytics
export const useAnalytics = () => {
  const trackPageView = (url: string, title?: string) => {
    analytics.trackPageView(url, title);
  };

  const trackEvent = (event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  };

  const trackAIInteraction = (type: 'chat' | 'voice' | 'demo', details: Record<string, any>) => {
    analytics.trackAIInteraction(type, details);
  };

  const trackDemoUsage = (demoName: string, action: 'start' | 'complete' | 'error', duration?: number) => {
    analytics.trackDemoUsage(demoName, action, duration);
  };

  return {
    trackPageView,
    trackEvent,
    trackAIInteraction,
    trackDemoUsage,
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackEngagement: analytics.trackEngagement.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackFormSubmission: analytics.trackFormSubmission.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics),
    trackExternalLink: analytics.trackExternalLink.bind(analytics),
  };
};

// Utility functions for automatic tracking
export const setupAutoTracking = () => {
  if (typeof window === 'undefined') return;

  // Track scroll depth
  let maxScrollDepth = 0;
  const trackScroll = () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      analytics.trackScrollDepth(scrollDepth);
    }
  };

  window.addEventListener('scroll', trackScroll, { passive: true });

  // Track time on page
  const startTime = Date.now();
  const trackTimeOnPage = () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    analytics.trackTimeOnPage(timeOnPage);
  };

  window.addEventListener('beforeunload', trackTimeOnPage);

  // Track external links
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.href && !link.href.startsWith(window.location.origin)) {
      analytics.trackExternalLink(link.href, link.textContent || undefined);
    }
  });

  // Track errors
  window.addEventListener('error', (event) => {
    analytics.trackError(new Error(event.message), event.filename);
  });

  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), 'unhandled_promise_rejection');
  });
};

// Initialize analytics with environment-specific tracking ID
export const initializeAnalytics = () => {
  const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  
  if (trackingId) {
    analytics.initialize(trackingId);
    setupAutoTracking();
  }
};
