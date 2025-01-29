#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EventProcessor } from '../../EventProcessor.js';
import { perfTestConfig, performanceThresholds } from './config.js';
import type { TestResult, TestSuiteResult, HistoricalComparison } from './types.js';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MarketEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceTestRunner {
  private eventProcessor: EventProcessor;
  private results: TestResult[] = [];
  private historicalResults: TestSuiteResult[] = [];

  constructor() {
    this.eventProcessor = new EventProcessor();
  }

  private generateTestEvents(count: number): MarketEvent[] {
    const { eventTypes, departments } = perfTestConfig;
    return Array.from({ length: count }, (_, i) => ({
      type: eventTypes[i % eventTypes.length],
      departmentId: departments[i % departments.length],
      impact: Math.random(),
      timestamp: Date.now() + i,
      metadata: { iteration: i }
    }));
  }

  private formatBytes(bytes: number): number {
    return Math.round(bytes / 1024 / 1024 * 100) / 100; // Convert to MB with 2 decimal places
  }

  private async loadHistoricalResults(): Promise<void> {
    try {
      const data = await fs.readFile(join(process.cwd(), perfTestConfig.resultsPath), 'utf8');
      this.historicalResults = JSON.parse(data);
    } catch (error) {
      this.historicalResults = [];
    }
  }

  private async saveResults(suiteResult: TestSuiteResult): Promise<void> {
    // Load existing results
    await this.loadHistoricalResults();

    // Add new results
    this.historicalResults.push(suiteResult);

    // Keep only the most recent entries
    if (this.historicalResults.length > perfTestConfig.maxHistoryEntries) {
      this.historicalResults = this.historicalResults.slice(-perfTestConfig.maxHistoryEntries);
    }

    // Save to file
    await fs.writeFile(
      join(process.cwd(), perfTestConfig.resultsPath),
      JSON.stringify(this.historicalResults, null, 2)
    );
  }

  private compareWithHistory(currentResult: TestResult): HistoricalComparison {
    if (this.historicalResults.length === 0) {
      return {
        throughputDegradation: 0,
        latencyIncrease: 0,
        memoryIncrease: 0,
        alerts: []
      };
    }

    // Get the last result for the same scenario
    const lastRun = this.historicalResults[this.historicalResults.length - 1];
    const lastResult = lastRun.results.find(r => r.scenario === currentResult.scenario);

    if (!lastResult) {
      return {
        throughputDegradation: 0,
        latencyIncrease: 0,
        memoryIncrease: 0,
        alerts: []
      };
    }

    const throughputDegradation = ((lastResult.metrics.throughput - currentResult.metrics.throughput) / lastResult.metrics.throughput) * 100;
    const latencyIncrease = ((currentResult.metrics.avgLatency - lastResult.metrics.avgLatency) / lastResult.metrics.avgLatency) * 100;
    const memoryIncrease = ((currentResult.metrics.memoryUsage.heapUsed - lastResult.metrics.memoryUsage.heapUsed) / lastResult.metrics.memoryUsage.heapUsed) * 100;

    const alerts: string[] = [];
    const { degradationAlerts } = perfTestConfig;

    if (throughputDegradation > degradationAlerts.throughputDecreasePercent) {
      alerts.push(`Throughput degraded by ${throughputDegradation.toFixed(1)}%`);
    }
    if (latencyIncrease > degradationAlerts.latencyIncreasePercent) {
      alerts.push(`Latency increased by ${latencyIncrease.toFixed(1)}%`);
    }
    if (memoryIncrease > degradationAlerts.memoryIncreasePercent) {
      alerts.push(`Memory usage increased by ${memoryIncrease.toFixed(1)}%`);
    }

    return {
      throughputDegradation,
      latencyIncrease,
      memoryIncrease,
      alerts
    };
  }

  private getGitCommit(): string | undefined {
    try {
      return execSync('git rev-parse HEAD').toString().trim();
    } catch {
      return undefined;
    }
  }

  private async runScenario(scenarioName: string, eventCount: number): Promise<TestResult> {
    // Reset metrics
    let totalListenerLatency = 0;
    let listenerCalls = 0;

    this.eventProcessor.clearHistory();
    if (global.gc) {
      global.gc();
    }

    const initialMemory = process.memoryUsage();
    const events = this.generateTestEvents(eventCount);

    // Add latency tracking
    const removeListeners = perfTestConfig.eventTypes.map(type => {
      const listener = (event: MarketEvent) => {
        const latency = Date.now() - event.timestamp;
        totalListenerLatency += latency;
        listenerCalls++;
      };
      this.eventProcessor.addEventListener(type, listener);
      return () => this.eventProcessor.removeEventListener(type, listener);
    });

    // Process events and measure time
    const startTime = process.hrtime.bigint();
    this.eventProcessor.processEvents(events);
    const endTime = process.hrtime.bigint();

    // Calculate metrics
    const duration = Number(endTime - startTime) / 1_000_000; // Convert to ms
    const throughput = Math.round(eventCount / (duration / 1000));
    const avgLatency = listenerCalls > 0 ? totalListenerLatency / listenerCalls : 0;
    const finalMemory = process.memoryUsage();

    // Clean up listeners
    removeListeners.forEach(remove => remove());

    const thresholds = performanceThresholds[scenarioName as keyof typeof performanceThresholds];
    const failureReasons: string[] = [];

    // Check against thresholds
    if (duration > thresholds.maxProcessingTime) {
      failureReasons.push(`Processing time ${duration.toFixed(2)}ms exceeded limit of ${thresholds.maxProcessingTime}ms`);
    }
    if (throughput < thresholds.minThroughput) {
      failureReasons.push(`Throughput ${throughput} events/sec below minimum of ${thresholds.minThroughput}`);
    }
    if (this.formatBytes(finalMemory.heapUsed - initialMemory.heapUsed) > thresholds.maxMemoryUsage) {
      failureReasons.push(`Memory usage ${this.formatBytes(finalMemory.heapUsed - initialMemory.heapUsed)}MB exceeded limit of ${thresholds.maxMemoryUsage}MB`);
    }
    if (avgLatency > thresholds.maxLatency) {
      failureReasons.push(`Average latency ${avgLatency.toFixed(2)}ms exceeded limit of ${thresholds.maxLatency}ms`);
    }

    return {
      timestamp: new Date().toISOString(),
      gitCommit: this.getGitCommit(),
      scenario: scenarioName,
      metrics: {
        processingTime: duration,
        throughput,
        memoryUsage: {
          heapUsed: this.formatBytes(finalMemory.heapUsed - initialMemory.heapUsed),
          heapTotal: this.formatBytes(finalMemory.heapTotal),
          rss: this.formatBytes(finalMemory.rss)
        },
        avgLatency
      },
      passed: failureReasons.length === 0,
      failureReasons: failureReasons.length > 0 ? failureReasons : undefined
    };
  }

  public async runAll(): Promise<TestSuiteResult> {
    this.results = [];

    // Perform warm-up runs
    console.log('\n🔥 Performing warm-up runs...');
    for (let i = 0; i < perfTestConfig.warmupRuns; i++) {
      await this.runScenario('smallBatch', 100);
    }

    // Run actual tests
    console.log('\n🏃 Running performance tests...');
    for (const scenario of perfTestConfig.scenarios) {
      console.log(`\n📊 Testing ${scenario.name} (${scenario.eventCount} events)`);
      console.log('----------------------------------------');

      // Run multiple iterations
      for (let i = 0; i < perfTestConfig.iterations; i++) {
        const result = await this.runScenario(scenario.name, scenario.eventCount);
        this.results.push(result);

        // Log results
        console.log(`\nIteration ${i + 1}/${perfTestConfig.iterations}:`);
        console.log(`⏱️  Processing time: ${result.metrics.processingTime.toFixed(2)}ms`);
        console.log(`📈 Throughput: ${result.metrics.throughput.toLocaleString()} events/sec`);
        console.log(`⚡ Average latency: ${result.metrics.avgLatency.toFixed(2)}ms`);
        console.log(`💾 Memory usage: ${result.metrics.memoryUsage.heapUsed}MB`);
        
        if (!result.passed) {
          console.log('\n❌ Failed thresholds:');
          result.failureReasons?.forEach(reason => console.log(`   - ${reason}`));
        }
      }
    }

    // Compare with historical results
    const comparison = this.compareWithHistory(this.results[this.results.length - 1]);
    if (comparison.alerts.length > 0) {
      console.log('\n⚠️  Performance Degradation Alerts:');
      comparison.alerts.forEach(alert => console.log(`   - ${alert}`));
    }

    // Calculate summary
    const summary = {
      totalTests: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length,
      degraded: comparison.alerts.length
    };

    const suiteResult: TestSuiteResult = {
      timestamp: new Date().toISOString(),
      gitCommit: this.getGitCommit(),
      results: this.results,
      comparison,
      summary
    };

    // Save results
    await this.saveResults(suiteResult);

    return suiteResult;
  }

  public dispose(): void {
    this.eventProcessor.dispose();
  }
}

// Direct execution check for ES modules
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new PerformanceTestRunner();
  runner.runAll()
    .then(result => {
      console.log('\n📋 Test Suite Summary:');
      console.log('----------------------------------------');
      console.log(`Total Tests: ${result.summary.totalTests}`);
      console.log(`Passed: ${result.summary.passed}`);
      console.log(`Failed: ${result.summary.failed}`);
      console.log(`Tests showing degradation: ${result.summary.degraded}`);
      
      if (result.summary.failed > 0) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error running performance tests:', error);
      process.exit(1);
    })
    .finally(() => {
      runner.dispose();
    });
}

export { PerformanceTestRunner };
