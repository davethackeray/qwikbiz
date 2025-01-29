import { EventEmitter } from 'node:events';
import { performanceMonitor } from '../../lib/services/monitoring.js';
import type { MarketEvent, ProcessingMetrics } from './types.js';

class CircularBuffer<T> {
  private buffer: T[];
  private writePos = 0;
  private size = 0;

  constructor(private capacity: number) {
    this.buffer = new Array<T>(capacity);
  }

  push(item: T): void {
    this.buffer[this.writePos] = item;
    this.writePos = (this.writePos + 1) % this.capacity;
    this.size = Math.min(this.size + 1, this.capacity);
  }

  getAll(): T[] {
    if (this.size < this.capacity) {
      return this.buffer.slice(0, this.size);
    }
    const items = this.buffer.slice(this.writePos).concat(this.buffer.slice(0, this.writePos));
    return items;
  }

  clear(): void {
    this.buffer = new Array<T>(this.capacity);
    this.writePos = 0;
    this.size = 0;
  }
}

export class EventProcessor {
  private eventEmitter: EventEmitter;
  private eventHistory: CircularBuffer<MarketEvent>;
  private listeners: Map<string, Set<(event: MarketEvent) => void | Promise<void>>>;
  private metrics: ProcessingMetrics;
  private eventQueue: MarketEvent[] = [];
  private processingTimer?: NodeJS.Timeout;
  private metricsFlushInterval!: NodeJS.Timeout;
  private readonly MIN_BATCH_SIZE = 100;  // Aligned with test scenarios
  private readonly MAX_BATCH_SIZE = 1000;
  private readonly HISTORY_SIZE = 10000;
  private readonly PROCESSING_INTERVAL = 1; // 1ms interval for rapid processing
  private dynamicBatchSize: number;
  private isProcessing: boolean = false;
  private metricsBuffer: { [key: string]: number[] } = {};

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventHistory = new CircularBuffer<MarketEvent>(this.HISTORY_SIZE);
    this.listeners = new Map();
    this.dynamicBatchSize = this.MIN_BATCH_SIZE;
    this.metrics = {
      eventsProcessed: 0,
      batchesProcessed: 0,
      totalProcessingTime: 0,
      averageLatency: 0,
      lastBatchSize: 0,
      maxBatchSize: 0,
      memoryUsage: 0
    };

    this.eventEmitter.setMaxListeners(100);
    this.startProcessingLoop();
    this.startMetricsFlush();
  }

  processEvents(events: MarketEvent[]): void {
    const now = Date.now();
    
    // Preserve existing timestamps for accurate latency measurement
    const timestampedEvents = events.map(event => ({
      ...event,
      timestamp: event.timestamp || now,
      priority: event.priority ?? 0
    }));

    // Small batches are processed immediately
    if (timestampedEvents.length <= this.MIN_BATCH_SIZE) {
      void this.processEventsBatch(timestampedEvents);
      return;
    }

    // Large batches use queue and batch processing
    this.eventQueue.push(...timestampedEvents);
    if (!this.isProcessing) {
      void this.processBatch();
    }
  }

  private async processEventsBatch(events: MarketEvent[]): Promise<void> {
    const batchStart = Date.now();
    const eventsByType = new Map<string, MarketEvent[]>();
    let totalLatency = 0;
    
    // Group events by type for efficient processing
    for (const event of events) {
      if (!eventsByType.has(event.type)) {
        eventsByType.set(event.type, []);
      }
      eventsByType.get(event.type)!.push(event);
      this.eventHistory.push(event);
    }

    const processingPromises: Array<Promise<void>> = [];

    // Process each event type independently
    for (const [type, typeEvents] of eventsByType) {
      const typeListeners = this.listeners.get(type);
      if (!typeListeners?.size) continue;

      const listeners = Array.from(typeListeners);
      
      // Process events in parallel for this type
      for (const event of typeEvents) {
        const startTime = Date.now();
        const promises = listeners.map(async listener => {
          try {
            await Promise.resolve(listener(event));
          } catch (error) {
            console.error(`Error in listener for event type ${type}:`, error);
          }
        });
        
        const promise = Promise.all(promises).then(() => {
          const eventLatency = Date.now() - event.timestamp;
          totalLatency += eventLatency;
          
          if (!this.metricsBuffer[type]) {
            this.metricsBuffer[type] = [];
          }
          this.metricsBuffer[type].push(Date.now() - startTime);
        });

        processingPromises.push(promise);
      }
    }

    // Wait for all event processing to complete
    await Promise.all(processingPromises);
    
    const processingTime = Date.now() - batchStart;
    
    this.updateMetrics({
      batchSize: events.length,
      processingTime,
      totalLatency,
      eventCount: events.length
    });
  }

  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    
    try {
      const batchSize = Math.min(this.eventQueue.length, this.dynamicBatchSize);
      const batch = this.eventQueue.splice(0, batchSize);
      
      await this.processEventsBatch(batch);
      
      // Adjust batch size based on queue length
      if (this.eventQueue.length > this.dynamicBatchSize * 2) {
        this.dynamicBatchSize = Math.min(this.MAX_BATCH_SIZE, this.dynamicBatchSize * 1.2);
      } else if (this.eventQueue.length < this.dynamicBatchSize / 2) {
        this.dynamicBatchSize = Math.max(this.MIN_BATCH_SIZE, this.dynamicBatchSize * 0.8);
      }

    } finally {
      this.isProcessing = false;
      
      // Process next batch immediately if there are more events
      if (this.eventQueue.length > 0) {
        setImmediate(() => void this.processBatch());
      }
    }
  }

  private startProcessingLoop(): void {
    const processNext = () => {
      if (this.eventQueue.length > 0 && !this.isProcessing) {
        void this.processBatch();
      }
      this.processingTimer = setTimeout(processNext, this.PROCESSING_INTERVAL);
    };

    processNext();
  }

  private startMetricsFlush(): void {
    this.metricsFlushInterval = setInterval(() => {
      for (const [type, latencies] of Object.entries(this.metricsBuffer)) {
        if (latencies.length > 0) {
          const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
          performanceMonitor.updateTypeMetrics(type, {
            count: latencies.length,
            averageLatency: avgLatency,
            maxLatency: Math.max(...latencies),
            minLatency: Math.min(...latencies)
          });
        }
      }
      this.metricsBuffer = {};
    }, 1000);
  }

  private updateMetrics(data: { batchSize: number; processingTime: number; totalLatency: number; eventCount: number }): void {
    this.metrics.eventsProcessed += data.eventCount;
    this.metrics.batchesProcessed++;
    this.metrics.totalProcessingTime += data.processingTime;
    this.metrics.lastBatchSize = data.batchSize;
    this.metrics.maxBatchSize = Math.max(this.metrics.maxBatchSize, data.batchSize);
    
    // Use EMA for stable latency tracking
    const alpha = 0.1;
    this.metrics.averageLatency = (alpha * (data.totalLatency / data.eventCount)) + 
                                 ((1 - alpha) * this.metrics.averageLatency);
    
    if (this.metrics.batchesProcessed % 10 === 0) {
      this.metrics.memoryUsage = process.memoryUsage().heapUsed;
    }
    
    performanceMonitor.updateMetrics(this.metrics);
  }

  addEventListener(type: string, callback: (event: MarketEvent) => void | Promise<void>): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
  }

  removeEventListener(type: string, callback: (event: MarketEvent) => void | Promise<void>): void {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(callback);
    }
  }

  getEventHistory(): MarketEvent[] {
    return this.eventHistory.getAll();
  }

  clearHistory(): void {
    this.eventHistory.clear();
  }

  getMetrics(): ProcessingMetrics {
    return { ...this.metrics };
  }

  dispose(): void {
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
    }
    if (this.metricsFlushInterval) {
      clearInterval(this.metricsFlushInterval);
    }
    this.eventEmitter.removeAllListeners();
    this.listeners.clear();
    this.eventQueue = [];
    this.metricsBuffer = {};
  }
}
