interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 1000;

  constructor() {
    this.setupPerformanceObserver();
  }

  private setupPerformanceObserver() {
    if (typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric({
            name: entry.name,
            value: entry.duration,
            timestamp: entry.startTime,
            tags: {
              type: entry.entryType,
              ...(entry as any).attribution?.map((attr: any) => ({
                [attr.name]: attr.value,
              })),
            },
          });
        });
      });

      // Observer different types of performance entries
      observer.observe({
        entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint'],
      });
    }
  }

  public recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('Performance metric:', metric);
    }
  }

  public getMetrics(filter?: {
    name?: string;
    startTime?: number;
    endTime?: number;
  }) {
    let filteredMetrics = this.metrics;

    if (filter?.name) {
      filteredMetrics = filteredMetrics.filter((m) => m.name === filter.name);
    }

    if (filter?.startTime) {
      filteredMetrics = filteredMetrics.filter(
        (m) => m.timestamp >= filter.startTime!
      );
    }

    if (filter?.endTime) {
      filteredMetrics = filteredMetrics.filter(
        (m) => m.timestamp <= filter.endTime!
      );
    }

    return filteredMetrics;
  }

  public getAverageMetric(name: string, timeWindow: number = 60000) {
    const now = Date.now();
    const relevantMetrics = this.metrics.filter(
      (m) => m.name === name && m.timestamp >= now - timeWindow
    );

    if (relevantMetrics.length === 0) return null;

    const sum = relevantMetrics.reduce((acc, curr) => acc + curr.value, 0);
    return sum / relevantMetrics.length;
  }

  public clearMetrics() {
    this.metrics = [];
  }
}

export const performanceMonitoring = new PerformanceMonitoringService();