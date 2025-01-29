import { EventEmitter } from 'node:events';
import type { ProcessingMetrics } from '../../features/simulation/types.js';

import type { EventTypeMetrics } from '../../features/simulation/types.js';

interface Alert {
  type: 'warning' | 'error';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
}

interface MetricsSnapshot {
  metrics: ProcessingMetrics;
  eventTypeMetrics: Map<string, EventTypeMetrics>;
  timestamp: number;
}

export interface ThresholdConfig {
  throughputMin: number;     // events/sec
  latencyMax: number;        // ms
  memoryMax: number;         // MB
  batchSizeMin: number;      // events
  processingTimeMax: number; // ms
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private eventEmitter: EventEmitter;
  private metricsHistory: MetricsSnapshot[] = [];
  private readonly historyLimit = 1000;
  private thresholds: ThresholdConfig;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.thresholds = {
      throughputMin: 100000,    // 100k events/sec
      latencyMax: 200,         // 200ms
      memoryMax: 512,         // 512MB
      batchSizeMin: 25,       // 25 events
      processingTimeMax: 100,  // 100ms
    };

    // Set high water mark for event emissions
    this.eventEmitter.setMaxListeners(50);
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  updateMetrics(metrics: ProcessingMetrics): void {
    const snapshot: MetricsSnapshot = {
      metrics,
      eventTypeMetrics: new Map(),
      timestamp: Date.now()
    };

    // Add to history
    this.metricsHistory.push(snapshot);
    if (this.metricsHistory.length > this.historyLimit) {
      this.metricsHistory.shift();
    }

    // Calculate derived metrics
    const throughput = this.calculateThroughput(snapshot);
    
    // Check thresholds and emit alerts
    this.checkThresholds({
      ...metrics,
      throughput
    });

    // Emit metrics update
    this.eventEmitter.emit('metrics', {
      ...metrics,
      throughput,
      timestamp: snapshot.timestamp
    });
  }

  updateTypeMetrics(type: string, metrics: EventTypeMetrics): void {
    if (this.metricsHistory.length > 0) {
      const latest = this.metricsHistory[this.metricsHistory.length - 1];
      latest.eventTypeMetrics.set(type, metrics);
    }
  }

  private calculateThroughput(snapshot: MetricsSnapshot): number {
    if (this.metricsHistory.length < 2) return 0;
    
    const previous = this.metricsHistory[this.metricsHistory.length - 2];
    const timeDiff = snapshot.timestamp - previous.timestamp;
    const eventsDiff = snapshot.metrics.eventsProcessed - previous.metrics.eventsProcessed;
    
    return timeDiff > 0 ? (eventsDiff / timeDiff) * 1000 : 0;
  }

  private checkThresholds(metrics: ProcessingMetrics & { throughput: number }): void {
    // Check throughput
    if (metrics.throughput < this.thresholds.throughputMin) {
      this.emitAlert('warning', 'throughput', metrics.throughput, this.thresholds.throughputMin,
        `Throughput dropped below ${this.thresholds.throughputMin} events/sec`);
    }

    // Check latency
    if (metrics.averageLatency > this.thresholds.latencyMax) {
      this.emitAlert('warning', 'latency', metrics.averageLatency, this.thresholds.latencyMax,
        `Latency exceeded ${this.thresholds.latencyMax}ms`);
    }

    // Check memory
    const memoryMB = metrics.memoryUsage / (1024 * 1024);
    if (memoryMB > this.thresholds.memoryMax) {
      this.emitAlert('error', 'memory', memoryMB, this.thresholds.memoryMax,
        `Memory usage exceeded ${this.thresholds.memoryMax}MB`);
    }

    // Check batch size
    if (metrics.lastBatchSize < this.thresholds.batchSizeMin) {
      this.emitAlert('warning', 'batchSize', metrics.lastBatchSize, this.thresholds.batchSizeMin,
        `Batch size below ${this.thresholds.batchSizeMin} events`);
    }

    // Check processing time per batch
    const processingTimePerBatch = metrics.totalProcessingTime / metrics.batchesProcessed;
    if (processingTimePerBatch > this.thresholds.processingTimeMax) {
      this.emitAlert('warning', 'processingTime', processingTimePerBatch, this.thresholds.processingTimeMax,
        `Processing time per batch exceeded ${this.thresholds.processingTimeMax}ms`);
    }
  }

  private emitAlert(type: Alert['type'], metric: string, value: number, threshold: number, message: string): void {
    const alert: Alert = {
      type,
      metric,
      value,
      threshold,
      message,
      timestamp: Date.now()
    };
    this.eventEmitter.emit('alert', alert);
  }

  onMetrics(callback: (metrics: ProcessingMetrics & { throughput: number; timestamp: number }) => void): void {
    this.eventEmitter.on('metrics', callback);
  }

  onAlert(callback: (alert: Alert) => void): void {
    this.eventEmitter.on('alert', callback);
  }

  getMetricsHistory(): MetricsSnapshot[] {
    return [...this.metricsHistory];
  }

  updateThresholds(config: Partial<ThresholdConfig>): void {
    this.thresholds = {
      ...this.thresholds,
      ...config
    };
  }

  getThresholds(): ThresholdConfig {
    return { ...this.thresholds };
  }

  reset(): void {
    this.metricsHistory = [];
    this.eventEmitter.removeAllListeners();
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
