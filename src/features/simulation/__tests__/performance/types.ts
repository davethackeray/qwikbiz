export interface ScenarioThresholds {
  maxProcessingTime: number;  // milliseconds
  minThroughput: number;     // events/second
  maxMemoryUsage: number;    // MB
  maxLatency: number;        // milliseconds
}

export interface PerformanceThresholds {
  smallBatch: ScenarioThresholds;
  mediumBatch: ScenarioThresholds;
  largeBatch: ScenarioThresholds;
  stressTest: ScenarioThresholds;
}

export interface TestScenario {
  name: string;
  eventCount: number;
}

export interface TestResult {
  timestamp: string;
  gitCommit?: string;
  scenario: string;
  metrics: {
    processingTime: number;
    throughput: number;
    memoryUsage: {
      heapUsed: number;
      heapTotal: number;
      rss: number;
    };
    avgLatency: number;
  };
  passed: boolean;
  failureReasons?: string[];
}

export interface HistoricalComparison {
  throughputDegradation: number;
  latencyIncrease: number;
  memoryIncrease: number;
  alerts: string[];
}

export interface TestSuiteResult {
  timestamp: string;
  gitCommit?: string;
  results: TestResult[];
  comparison?: HistoricalComparison;
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    degraded: number;
  };
}
