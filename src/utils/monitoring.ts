// Système de monitoring et logs pour Racha Business Group CRM

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  stack?: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  userAgent: string;
  url: string;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private sessionId: string;
  private userId?: string;
  private logs: LogEntry[] = [];
  private metrics: PerformanceMetric[] = [];
  private maxLogs = 1000;
  private maxMetrics = 500;
  private isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceObserver();
    this.initializeErrorHandling();
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
      try {
        // Observer pour les métriques de navigation
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('navigation', entry.duration, {
              type: entry.entryType,
              name: entry.name,
            });
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });

        // Observer pour les métriques de ressources
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 1000) { // Seulement les ressources lentes
              this.recordMetric('resource-load', entry.duration, {
                name: entry.name,
                size: (entry as any).transferSize,
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });

        // Observer pour les métriques de peinture
        const paintObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(entry.name, entry.startTime);
          }
        });
        paintObserver.observe({ entryTypes: ['paint'] });

        // Observer pour les Layout Shifts (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              this.recordMetric('cumulative-layout-shift', (entry as any).value);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }

  private initializeErrorHandling() {
    // Capturer les erreurs JavaScript globales
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Capturer les promesses rejetées non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
      });
    });
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logs.push(entry);

    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log dans la console en développement
    if (!this.isProduction) {
      const logMethod = this.getConsoleMethod(level);
      logMethod(`[${LogLevel[level]}] ${message}`, data);
    }

    // Envoyer les logs critiques immédiatement
    if (level >= LogLevel.ERROR) {
      this.sendLogs([entry]);
    }
  }

  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error;
      default:
        return console.log;
    }
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, data);
  }

  fatal(message: string, data?: any) {
    this.log(LogLevel.FATAL, message, data);
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.metrics.push(metric);

    // Limiter le nombre de métriques en mémoire
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log les métriques importantes
    if (value > 3000) { // Plus de 3 secondes
      this.warn(`Performance metric ${name} is slow: ${value}ms`, metadata);
    }
  }

  reportError(error: {
    message: string;
    stack?: string;
    componentStack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    metadata?: Record<string, any>;
  }) {
    const errorReport: ErrorReport = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: error.message,
      stack: error.stack,
      componentStack: error.componentStack,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      metadata: {
        ...error.metadata,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
      },
    };

    this.error('Error reported', errorReport);
    this.sendErrorReport(errorReport);
  }

  // Métriques Web Vitals
  recordWebVital(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') {
    this.recordMetric(`web-vital-${name}`, value, { rating });
    
    if (rating === 'poor') {
      this.warn(`Poor Web Vital: ${name} = ${value}`, { rating });
    }
  }

  // Métriques business
  recordUserAction(action: string, metadata?: Record<string, any>) {
    this.info(`User action: ${action}`, metadata);
    this.recordMetric(`user-action-${action}`, 1, metadata);
  }

  recordPageView(page: string, loadTime?: number) {
    this.info(`Page view: ${page}`, { loadTime });
    if (loadTime) {
      this.recordMetric('page-load-time', loadTime, { page });
    }
  }

  // Envoyer les logs au serveur
  private async sendLogs(logs: LogEntry[]) {
    // Désactivé pour le moment - pas de serveur backend
    return;

    if (!this.isProduction) return;

    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      console.error('Failed to send logs:', error);
    }
  }

  // Envoyer les métriques au serveur
  private async sendMetrics(metrics: PerformanceMetric[]) {
    // Désactivé pour le moment - pas de serveur backend
    return;

    if (!this.isProduction) return;

    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics }),
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }

  // Envoyer un rapport d'erreur
  private async sendErrorReport(errorReport: ErrorReport) {
    // Désactivé pour le moment - pas de serveur backend
    return;

    if (!this.isProduction) return;

    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  }

  // Flush périodique des logs et métriques
  startPeriodicFlush(intervalMs = 30000) {
    setInterval(() => {
      if (this.logs.length > 0) {
        const logsToSend = this.logs.filter(log => log.level >= LogLevel.INFO);
        if (logsToSend.length > 0) {
          this.sendLogs(logsToSend);
        }
      }

      if (this.metrics.length > 0) {
        this.sendMetrics([...this.metrics]);
        this.metrics = [];
      }
    }, intervalMs);
  }

  // Obtenir un résumé des métriques
  getMetricsSummary() {
    const summary: Record<string, { count: number; avg: number; max: number; min: number }> = {};

    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = { count: 0, avg: 0, max: 0, min: Infinity };
      }

      const s = summary[metric.name];
      s.count++;
      s.max = Math.max(s.max, metric.value);
      s.min = Math.min(s.min, metric.value);
      s.avg = (s.avg * (s.count - 1) + metric.value) / s.count;
    });

    return summary;
  }

  // Obtenir les logs récents
  getRecentLogs(count = 50) {
    return this.logs.slice(-count);
  }

  // Nettoyer les données anciennes
  cleanup() {
    this.logs = [];
    this.metrics = [];
  }
}

// Instance singleton
export const monitoring = new MonitoringService();

// Hook React pour utiliser le monitoring
export const useMonitoring = () => {
  return {
    log: monitoring.log.bind(monitoring),
    debug: monitoring.debug.bind(monitoring),
    info: monitoring.info.bind(monitoring),
    warn: monitoring.warn.bind(monitoring),
    error: monitoring.error.bind(monitoring),
    fatal: monitoring.fatal.bind(monitoring),
    recordMetric: monitoring.recordMetric.bind(monitoring),
    recordUserAction: monitoring.recordUserAction.bind(monitoring),
    recordPageView: monitoring.recordPageView.bind(monitoring),
    recordWebVital: monitoring.recordWebVital.bind(monitoring),
    reportError: monitoring.reportError.bind(monitoring),
    setUserId: monitoring.setUserId.bind(monitoring),
    getMetricsSummary: monitoring.getMetricsSummary.bind(monitoring),
    getRecentLogs: monitoring.getRecentLogs.bind(monitoring),
  };
};

// Initialiser le monitoring
if (typeof window !== 'undefined') {
  monitoring.startPeriodicFlush();
}
