import { type TokenPayload } from '@/lib/utils/auth';

export type AuthEvent = {
  type: 'login' | 'logout' | 'refresh' | 'error' | 'rate_limit' | 'token_revoked';
  timestamp: number;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
};

export type AuthMetric = {
  name: string;
  value: number;
  timestamp: number;
  labels?: Record<string, string>;
};

export type ErrorContext = {
  code: string;
  message: string;
  stack?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  timestamp: number;
};

export type AlertCondition = {
  metric: string;
  threshold: number;
  duration: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
};

export type TimeFrame = {
  start: number;
  end: number;
};

const METRICS_RETENTION = 24 * 60 * 60 * 1000; // 24 hours
const ERROR_RETENTION = 7 * 24 * 60 * 60 * 1000; // 7 days
const EVENT_BATCH_SIZE = 100;
const ALERT_CHECK_INTERVAL = 60 * 1000; // 1 minute

class AuthMonitoringService {
  private events: AuthEvent[] = [];
  private metrics: AuthMetric[] = [];
  private errors: ErrorContext[] = [];
  private alertConditions: AlertCondition[] = [];
  private alertCheckInterval: NodeJS.Timeout;

  constructor() {
    // Set up regular maintenance
    this.setupMaintenance();
    // Set up alert checking
    this.alertCheckInterval = setInterval(() => {
      this.checkAlerts();
    }, ALERT_CHECK_INTERVAL);
  }

  // Event Tracking
  public trackEvent(event: AuthEvent): void {
    this.events.push({
      ...event,
      timestamp: event.timestamp || Date.now()
    });

    if (this.events.length >= EVENT_BATCH_SIZE) {
      this.processEvents();
    }
  }

  // Metric Collection
  public recordMetric(metric: AuthMetric): void {
    this.metrics.push({
      ...metric,
      timestamp: metric.timestamp || Date.now()
    });
  }

  // Error Handling
  public handleError(error: ErrorContext): void {
    const errorWithTimestamp = {
      ...error,
      timestamp: error.timestamp || Date.now()
    };
    this.errors.push(errorWithTimestamp);

    // Track as event
    this.trackEvent({
      type: 'error',
      timestamp: Date.now(),
      userId: error.userId,
      sessionId: error.sessionId,
      metadata: {
        code: error.code,
        message: error.message
      }
    });
  }

  // Alert Management
  public addAlertCondition(condition: AlertCondition): void {
    this.alertConditions.push(condition);
  }

  // Analytics
  public getMetrics(timeframe: TimeFrame) {
    const relevantMetrics = this.metrics.filter(
      m => m.timestamp >= timeframe.start && m.timestamp <= timeframe.end
    );

    return {
      total: relevantMetrics.length,
      metrics: this.aggregateMetrics(relevantMetrics)
    };
  }

  public getErrors(timeframe: TimeFrame) {
    const { start, end } = timeframe;
    return this.errors.filter(e => e.timestamp >= start && e.timestamp <= end);
  }

  // Token Lifecycle Monitoring
  public trackTokenLifecycle(token: TokenPayload, action: 'created' | 'refreshed' | 'revoked'): void {
    this.trackEvent({
      type: action === 'revoked' ? 'token_revoked' : 'refresh',
      timestamp: Date.now(),
      userId: token.sub,
      metadata: {
        action,
        tokenType: token.type,
        jti: token.jti
      }
    });
  }

  // Rate Limit Monitoring
  public trackRateLimit(userId: string | undefined, path: string): void {
    this.trackEvent({
      type: 'rate_limit',
      timestamp: Date.now(),
      userId,
      metadata: {
        path
      }
    });

    this.recordMetric({
      name: 'rate_limit_hit',
      value: 1,
      timestamp: Date.now(),
      labels: {
        path
      }
    });
  }

  private processEvents(): void {
    // Process event batch
    const now = Date.now();
    const recentEvents = this.events.filter(
      e => now - e.timestamp < METRICS_RETENTION
    );

    // Calculate metrics
    const eventCounts = new Map<string, number>();
    recentEvents.forEach(event => {
      const count = eventCounts.get(event.type) || 0;
      eventCounts.set(event.type, count + 1);
    });

    // Record metrics
    eventCounts.forEach((count, type) => {
      this.recordMetric({
        name: `auth_events_${type}`,
        value: count,
        timestamp: now
      });
    });

    // Clear processed events
    this.events = [];
  }

  private checkAlerts(): void {
    const now = Date.now();
    
    this.alertConditions.forEach(condition => {
      const relevantMetrics = this.metrics
        .filter(m => m.name === condition.metric)
        .filter(m => now - m.timestamp <= condition.duration);

      if (relevantMetrics.length > 0) {
        const average = relevantMetrics.reduce((sum, m) => sum + m.value, 0) / relevantMetrics.length;
        
        if (average >= condition.threshold) {
          console.error(`[Auth Monitor] Alert: ${condition.metric} threshold exceeded`, {
            severity: condition.severity,
            current: average,
            threshold: condition.threshold
          });
        }
      }
    });
  }

  private setupMaintenance(): void {
    // Regular cleanup
    setInterval(() => {
      const now = Date.now();

      // Clean up old metrics
      this.metrics = this.metrics.filter(
        m => now - m.timestamp < METRICS_RETENTION
      );

      // Clean up old errors
      this.errors = this.errors.filter(
        e => now - e.timestamp < ERROR_RETENTION
      );

      // Process any remaining events
      if (this.events.length > 0) {
        this.processEvents();
      }
    }, 60 * 60 * 1000); // Every hour
  }

  private aggregateMetrics(metrics: AuthMetric[]) {
    const aggregated = new Map<string, {
      count: number;
      sum: number;
      min: number;
      max: number;
    }>();

    metrics.forEach(metric => {
      const current = aggregated.get(metric.name) || {
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity
      };

      aggregated.set(metric.name, {
        count: current.count + 1,
        sum: current.sum + metric.value,
        min: Math.min(current.min, metric.value),
        max: Math.max(current.max, metric.value)
      });
    });

    return Array.from(aggregated.entries()).map(([name, stats]) => ({
      name,
      average: stats.sum / stats.count,
      count: stats.count,
      min: stats.min,
      max: stats.max
    }));
  }

  public dispose(): void {
    clearInterval(this.alertCheckInterval);
  }
}

// Export singleton instance
export const authMonitor = new AuthMonitoringService();
