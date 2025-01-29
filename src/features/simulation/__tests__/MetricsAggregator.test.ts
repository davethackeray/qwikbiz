import { MetricsAggregator } from '../MetricsAggregator';
import { jest } from '@jest/globals';

interface MetricsEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

describe('MetricsAggregator', () => {
  let aggregator: MetricsAggregator;
  
  beforeEach(() => {
    aggregator = new MetricsAggregator();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Metrics Calculation', () => {
    it('should calculate department metrics correctly', () => {
      const events: MetricsEvent[] = [
        {
          type: 'market_shift',
          departmentId: 'sales',
          impact: 0.5,
          timestamp: Date.now()
        }
      ];

      const result = aggregator.aggregateMetrics(events);
      expect(result.metrics).toBeDefined();
      expect(result.metrics['sales']).toBeGreaterThan(0);
    });

    it('should maintain metrics within valid range (0-100)', () => {
      const events: MetricsEvent[] = [
        {
          type: 'market_shift',
          departmentId: 'sales',
          impact: 150,
          timestamp: Date.now()
        }
      ];

      const result = aggregator.aggregateMetrics(events);
      expect(result.metrics['sales']).toBeLessThanOrEqual(100);
    });

    it('should calculate moving averages correctly', () => {
      const events: MetricsEvent[] = Array.from({ length: 5 }, (_, i) => ({
        type: 'market_shift',
        departmentId: 'sales',
        impact: 0.1 * (i + 1),
        timestamp: Date.now() + i * 100
      }));

      const results = events.map(event => 
        aggregator.aggregateMetrics([event]).metrics['sales']
      );

      // Check that values show a reasonable trend
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBeGreaterThan(results[i - 1]);
      }
    });
  });

  describe('Caching System', () => {
    it('should use cached metrics when available', () => {
      jest.useFakeTimers();

      const event: MetricsEvent = {
        type: 'market_shift',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      const firstResult = aggregator.aggregateMetrics([event]);
      
      // Advance time but stay within update threshold
      jest.advanceTimersByTime(50);
      
      const secondResult = aggregator.aggregateMetrics([event]);
      expect(secondResult.metrics['sales']).toBe(firstResult.metrics['sales']);
    });

    it('should update cache when stale', () => {
      jest.useFakeTimers();

      const event: MetricsEvent = {
        type: 'market_shift',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      const firstResult = aggregator.aggregateMetrics([event]);
      
      // Advance time beyond update threshold
      jest.advanceTimersByTime(150);
      
      const secondResult = aggregator.aggregateMetrics([event]);
      expect(secondResult.metrics['sales']).not.toBe(firstResult.metrics['sales']);
    });
  });

  describe('Performance', () => {
    it('should aggregate metrics within performance target', () => {
      const events: MetricsEvent[] = Array.from({ length: 50 }, (_, i) => ({
        type: 'market_shift',
        departmentId: `dept${i}`,
        impact: 0.1,
        timestamp: Date.now() + i * 10
      }));

      const start = performance.now();
      aggregator.aggregateMetrics(events);
      const duration = performance.now() - start;

      expect(duration).toBeLessThanOrEqual(200);
    });

    it('should handle high-frequency updates efficiently', () => {
      const events: MetricsEvent[] = Array.from({ length: 1000 }, (_, i) => ({
        type: 'market_shift',
        departmentId: 'sales',
        impact: 0.01,
        timestamp: Date.now() + i
      }));

      const start = performance.now();
      aggregator.aggregateMetrics(events);
      const duration = performance.now() - start;

      expect(duration).toBeLessThanOrEqual(200);
    });
  });

  describe('State Management', () => {
    it('should maintain correct metrics history window', () => {
      const events: MetricsEvent[] = Array.from({ length: 15 }, (_, i) => ({
        type: 'market_shift',
        departmentId: 'sales',
        impact: 0.1,
        timestamp: Date.now() + i * 100
      }));

      events.forEach(event => {
        aggregator.aggregateMetrics([event]);
      });

      const finalState = aggregator.getMetrics();
      expect(finalState.metrics['sales']).toBeDefined();
    });

    it('should reset state correctly', () => {
      const event: MetricsEvent = {
        type: 'market_shift',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      aggregator.aggregateMetrics([event]);
      aggregator.reset();

      const metrics = aggregator.getMetrics();
      expect(Object.keys(metrics.metrics)).toHaveLength(0);
    });
  });
});
