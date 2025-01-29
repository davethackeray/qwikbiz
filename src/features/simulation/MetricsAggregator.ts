interface MetricsEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface MetricsState {
  metrics: Record<string, number>;
  timestamp: number;
}

interface DepartmentMetrics {
  currentValue: number;
  previousValues: number[];
  lastUpdateTime: number;
}

export class MetricsAggregator {
  private metricsCache: Map<string, DepartmentMetrics>;
  private readonly historyWindow = 10; // Keep last 10 values for moving averages
  private readonly batchSize = 50; // Process events in batches for performance
  private readonly updateThreshold = 100; // Minimum ms between full recalculations

  constructor() {
    this.metricsCache = new Map();
  }

  aggregateMetrics(events: MetricsEvent[]): MetricsState {
    const now = Date.now();
    const metrics: Record<string, number> = {};
    
    // Process events in batches for better performance
    for (let i = 0; i < events.length; i += this.batchSize) {
      const batch = events.slice(i, i + this.batchSize);
      this.processEventBatch(batch, metrics);
    }

    // Calculate moving averages and finalize metrics
    for (const [deptId, deptMetrics] of this.metricsCache.entries()) {
      if (now - deptMetrics.lastUpdateTime > this.updateThreshold) {
        metrics[deptId] = this.calculateMovingAverage(deptMetrics);
        deptMetrics.lastUpdateTime = now;
      } else {
        metrics[deptId] = deptMetrics.currentValue;
      }
    }

    return {
      metrics,
      timestamp: now
    };
  }

  private processEventBatch(events: MetricsEvent[], metrics: Record<string, number>) {
    events.forEach(event => {
      let deptMetrics = this.metricsCache.get(event.departmentId);
      
      if (!deptMetrics) {
        deptMetrics = {
          currentValue: 0,
          previousValues: [],
          lastUpdateTime: 0
        };
        this.metricsCache.set(event.departmentId, deptMetrics);
      }

      // Update metrics
      const newValue = this.calculateMetricValue(deptMetrics.currentValue, event);
      deptMetrics.previousValues.push(deptMetrics.currentValue);
      
      // Maintain history window size
      if (deptMetrics.previousValues.length > this.historyWindow) {
        deptMetrics.previousValues.shift();
      }
      
      deptMetrics.currentValue = newValue;
    });
  }

  private calculateMetricValue(currentValue: number, event: MetricsEvent): number {
    // Implement optimized metric calculation logic
    const baseImpact = event.impact * this.getImpactMultiplier(event.type);
    const newValue = currentValue + baseImpact;
    return Math.max(0, Math.min(100, newValue)); // Ensure value stays within bounds
  }

  private calculateMovingAverage(metrics: DepartmentMetrics): number {
    if (metrics.previousValues.length === 0) {
      return metrics.currentValue;
    }

    // Calculate weighted moving average
    const weights = metrics.previousValues.map((_, i) => 
      1 + (i / metrics.previousValues.length) * 0.5
    );
    const totalWeight = weights.reduce((a, b) => a + b, 1); // +1 for current value

    const weightedSum = metrics.previousValues.reduce((sum, value, i) => 
      sum + value * weights[i], 0
    );

    return (weightedSum + metrics.currentValue) / totalWeight;
  }

  private getImpactMultiplier(eventType: string): number {
    // Optimize impact calculation based on event type
    switch (eventType) {
      case 'market_shift':
        return 0.8;
      case 'rapid_change':
        return 0.5;
      case 'stress_test':
        return 0.3;
      default:
        return 0.6;
    }
  }

  getMetrics(): MetricsState {
    const metrics: Record<string, number> = {};
    
    for (const [deptId, deptMetrics] of this.metricsCache.entries()) {
      metrics[deptId] = deptMetrics.currentValue;
    }

    return {
      metrics,
      timestamp: Date.now()
    };
  }

  reset() {
    this.metricsCache.clear();
  }

  /**
   * Analyze trends in KPI data and return insights
   */
  analyzeTrends(kpis: Array<{ type: string; value: number; history?: number[] }>): Array<{ 
    metric: string;
    trend: {
      direction: 'up' | 'down' | 'stable';
      percentage: number;
      period: string;
      compare?: {
        value: number;
        period: string;
      }
    }
  }> {
    return kpis.map(kpi => {
      const history = kpi.history || [];
      const currentValue = kpi.value;
      const previousValue = history[history.length - 1] || currentValue;
      
      const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
      const direction = 
        Math.abs(percentageChange) < 1 ? 'stable' :
        percentageChange > 0 ? 'up' : 'down';

      return {
        metric: kpi.type,
        trend: {
          direction,
          percentage: Math.abs(percentageChange),
          period: 'current',
          compare: {
            value: previousValue,
            period: 'previous'
          }
        }
      };
    });
  }

  /**
   * Get historical data for a specific metric
   */
  getHistoricalData(metricId: string, period: string): {
    data: number[];
    trend: {
      direction: 'up' | 'down' | 'stable';
      percentage: number;
      period: string;
    }
  } {
    const metrics = this.metricsCache.get(metricId);
    
    if (!metrics) {
      return {
        data: [],
        trend: { direction: 'stable', percentage: 0, period }
      };
    }

    const data = [...metrics.previousValues, metrics.currentValue];
    const first = data[0] || 0;
    const last = data[data.length - 1] || 0;
    const percentageChange = ((last - first) / first) * 100;

    return {
      data,
      trend: {
        direction: 
          Math.abs(percentageChange) < 1 ? 'stable' :
          percentageChange > 0 ? 'up' : 'down',
        percentage: Math.abs(percentageChange),
        period
      }
    };
  }
}
