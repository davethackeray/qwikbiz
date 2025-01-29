export interface MarketEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  priority?: number;
  metadata?: Record<string, any>;
}

export interface EventTypeMetrics {
  count: number;
  averageLatency: number;
  maxLatency: number;
  minLatency: number;
}

export interface ProcessingMetrics {
  eventsProcessed: number;
  batchesProcessed: number;
  totalProcessingTime: number;
  averageLatency: number;
  lastBatchSize: number;
  maxBatchSize: number;
  memoryUsage: number;
}
