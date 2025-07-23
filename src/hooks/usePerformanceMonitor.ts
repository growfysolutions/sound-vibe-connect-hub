
import { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  cumulativeLayoutShift: number;
  totalLoadTime: number;
  memoryUsage: number;
}

interface PerformanceThresholds {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  tti: number; // Time to Interactive
  cls: number; // Cumulative Layout Shift
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  fcp: 1500, // 1.5s
  lcp: 2500, // 2.5s
  tti: 3500, // 3.5s
  cls: 0.1
};

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      // Get memory usage if available
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;

      const performanceMetrics: PerformanceMetrics = {
        firstContentfulPaint: fcp,
        largestContentfulPaint: 0, // Will be updated by observer
        timeToInteractive: loadTime,
        cumulativeLayoutShift: 0, // Will be updated by observer
        totalLoadTime: loadTime,
        memoryUsage: memoryUsage
      };

      setMetrics(performanceMetrics);
      setIsLoading(false);
    };

    // Set up performance observer for LCP and CLS
    if ('PerformanceObserver' in window) {
      observerRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            setMetrics(prev => prev ? { ...prev, largestContentfulPaint: entry.startTime } : null);
          }
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            setMetrics(prev => prev ? { 
              ...prev, 
              cumulativeLayoutShift: prev.cumulativeLayoutShift + (entry as any).value 
            } : null);
          }
        }
      });

      observerRef.current.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift'] });
    }

    // Wait for page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  const getMetricStatus = (metric: keyof PerformanceMetrics, value: number) => {
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof PerformanceThresholds];
    if (!threshold) return 'good';
    
    if (value <= threshold) return 'good';
    if (value <= threshold * 1.5) return 'needs-improvement';
    return 'poor';
  };

  const trackCustomMetric = (name: string, value: number) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-${value}`);
    }
  };

  return {
    metrics,
    isLoading,
    getMetricStatus,
    trackCustomMetric,
    thresholds: PERFORMANCE_THRESHOLDS
  };
};
