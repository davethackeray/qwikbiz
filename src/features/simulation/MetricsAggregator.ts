interface MarketEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface MetricSnapshot {
  timestamp: number;
  metrics: {
    [key: string]: number;
  };
}

interface DepartmentMetrics {
  performance: number[];
  efficiency: number[];
  satisfaction: number[];
  timestamps: number[];
}

export class MetricsAggregator {
  private readonly windowSize = 100; // Keep last 100 data points
  private departmentMetrics: Map<string, DepartmentMetrics>;
  private lastCalculation: number;
  private metricsCache: Map<string, MetricSnapshot>;
  
  constructor() {
    this.departmentMetrics = new Map();
    this.lastCalculation = Date.now();
    this.metricsCache = new Map();
  }

  aggregateMetrics(events: MarketEvent[]) {
    const startTime = Date.now();
    
    events.forEach(event => {
      this.updateMetrics(event);
    });

    // Calculate and cache aggregated metrics
    this.calculateAggregatedMetrics(events);

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    // Log if processing time exceeds threshold
    if (processingTime > 200) {
      console.warn(`Metrics aggregation took ${processingTime}ms, exceeding 200ms target`);
    }
  }

  private updateMetrics(event: MarketEvent) {
    let deptMetrics = this.departmentMetrics.get(event.departmentId);
    
    if (!deptMetrics) {
      deptMetrics = {
        performance: [],
        efficiency: [],
        satisfaction: [],
        timestamps: []
      };
      this.departmentMetrics.set(event.departmentId, deptMetrics);
    }

    // Add new data point
    deptMetrics.timestamps.push(event.timestamp);
    
    // Calculate impact on each metric
    const perfImpact = event.impact * 0.6;
    const effImpact = event.impact * 0.4;
    const satImpact = event.impact * 0.3;

    deptMetrics.performance.push(this.calculateMovingAverage(deptMetrics.performance, perfImpact));
    deptMetrics.efficiency.push(this.calculateMovingAverage(deptMetrics.efficiency, effImpact));
    deptMetrics.satisfaction.push(this.calculateMovingAverage(deptMetrics.satisfaction, satImpact));

    // Maintain window size
    if (deptMetrics.timestamps.length > this.windowSize) {
      deptMetrics.timestamps.shift();
      deptMetrics.performance.shift();
      deptMetrics.efficiency.shift();
      deptMetrics.satisfaction.shift();
    }
  }

  private calculateMovingAverage(values: number[], newValue: number): number {
    if (values.length === 0) return newValue;
    
    const avg = values[values.length - 1];
    return avg * 0.7 + newValue * 0.3; // Exponential moving average
  }

  private calculateAggregatedMetrics(events: MarketEvent[]) {
    const currentTime = Date.now();
    const metrics: { [key: string]: number } = {};

    // Only recalculate if we have new events
    if (events.length > 0) {
      this.departmentMetrics.forEach((deptMetrics, departmentId) => {
        const len = deptMetrics.performance.length;
        if (len > 0) {
          metrics[`${departmentId}_performance`] = deptMetrics.performance[len - 1];
          metrics[`${departmentId}_efficiency`] = deptMetrics.efficiency[len - 1];
          metrics[`${departmentId}_satisfaction`] = deptMetrics.satisfaction[len - 1];
        }
      });

      // Cache the results
      this.metricsCache.set('latest', {
        timestamp: currentTime,
        metrics
      });
    }

    this.lastCalculation = currentTime;
  }

  getMetrics(): MetricSnapshot {
    const cached = this.metricsCache.get('latest');
    if (cached && Date.now() - cached.timestamp < 200) {
      return cached;
    }
    
    // If cache is stale, return last known metrics but trigger async update
    setTimeout(() => this.calculateAggregatedMetrics([]), 0);
    return cached || { timestamp: Date.now(), metrics: {} };
  }

  getDepartmentMetrics(departmentId: string): DepartmentMetrics | null {
    return this.departmentMetrics.get(departmentId) || null;
  }

  reset() {
    this.departmentMetrics.clear();
    this.metricsCache.clear();
    this.lastCalculation = Date.now();
  }
}
