import type { TestScenario, ScenarioThresholds, PerformanceThresholds } from './types.js';

export const performanceThresholds: PerformanceThresholds = {
  smallBatch: {
    maxProcessingTime: 200, // ms
    minThroughput: 5000, // events/sec
    maxMemoryUsage: 10, // MB
    maxLatency: 50 // ms
  },
  mediumBatch: {
    maxProcessingTime: 500,
    minThroughput: 10000,
    maxMemoryUsage: 50,
    maxLatency: 100
  },
  largeBatch: {
    maxProcessingTime: 2000,
    minThroughput: 15000,
    maxMemoryUsage: 200,
    maxLatency: 200
  },
  stressTest: {
    maxProcessingTime: 5000,
    minThroughput: 20000,
    maxMemoryUsage: 500,
    maxLatency: 500
  }
};

export const perfTestConfig = {
  // Number of warm-up runs before collecting metrics
  warmupRuns: 2,
  
  // Number of test iterations for each scenario
  iterations: 3,
  
  // Test scenarios
  scenarios: [
    { name: 'smallBatch', eventCount: 100 },
    { name: 'mediumBatch', eventCount: 1000 },
    { name: 'largeBatch', eventCount: 10000 },
    { name: 'stressTest', eventCount: 50000 }
  ] satisfies TestScenario[],
  
  // Event types to test
  eventTypes: [
    'market_change',
    'department_update',
    'metric_update',
    'resource_allocation',
    'budget_adjustment'
  ],

  // Departments to include in tests
  departments: [
    'sales',
    'marketing',
    'operations',
    'finance',
    'hr',
    'it',
    'legal',
    'rd'
  ],
  
  // Results storage
  resultsPath: 'performance-results.json',
  
  // Maximum test run history to keep
  maxHistoryEntries: 100,
  
  // Alert thresholds for performance degradation
  degradationAlerts: {
    throughputDecreasePercent: 10,
    latencyIncreasePercent: 15,
    memoryIncreasePercent: 20
  }
} as const;
