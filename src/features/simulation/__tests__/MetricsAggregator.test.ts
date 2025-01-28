import { MetricsAggregator } from '../MetricsAggregator';

interface MarketEvent {
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
      const events: MarketEvent[] = [{
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now(),
        metadata: { cause: 'market_growth' }
      }];

      aggregator.aggregateMetrics(events);
      const metrics = aggregator.getMetrics();
      
      expect(metrics.metrics['sales_performance']).toBeDefined();
      expect(metrics.metrics['sales_efficiency']).toBeDefined();
      expect(metrics.metrics['sales_satisfaction']).toBeDefined();
    });

    it('should maintain metrics within valid range (0-100)', () => {
      const events: MarketEvent[] = [{
        type: 'market_change',
        departmentId: 'sales',
        impact: 2.0, // Large impact
        timestamp: Date.now()
      }];

      aggregator.aggregateMetrics(events);
      const metrics = aggregator.getMetrics();
      
      Object.values(metrics.metrics).forEach(value => {
        expect(value).toBeLessThanOrEqual(100);
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it('should calculate moving averages correctly', () => {
      const events: MarketEvent[] = Array.from({ length: 5 }, (_, i) => ({
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.2,
        timestamp: Date.now() + i * 1000
      }));

      events.forEach(event => {
        aggregator.aggregateMetrics([event]);
      });

      const deptMetrics = aggregator.getDepartmentMetrics('sales');
      expect(deptMetrics?.performance.length).toBeLessThanOrEqual(100); // Window size
      expect(deptMetrics?.efficiency.length).toBeLessThanOrEqual(100);
      expect(deptMetrics?.satisfaction.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Caching System', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should use cached metrics when available', () => {
      const event: MarketEvent = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      aggregator.aggregateMetrics([event]);
      const firstMetrics = aggregator.getMetrics();
      
      // Second call within cache window should return same timestamp
      const secondMetrics = aggregator.getMetrics();
      expect(secondMetrics.timestamp).toBe(firstMetrics.timestamp);
    });

    it('should update cache when stale', () => {
      const event: MarketEvent = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      aggregator.aggregateMetrics([event]);
      const firstMetrics = aggregator.getMetrics();
      
      // Advance time beyond cache window
      jest.advanceTimersByTime(201);
      
      const secondMetrics = aggregator.getMetrics();
      expect(secondMetrics.timestamp).toBeGreaterThan(firstMetrics.timestamp);
    });
  });

  describe('Performance', () => {
    it('should aggregate metrics within performance target', () => {
      const events: MarketEvent[] = Array.from({ length: 100 }, (_, i) => ({
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.1,
        timestamp: Date.now() + i
      }));

      const start = Date.now();
      aggregator.aggregateMetrics(events);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThanOrEqual(200);
    });

    it('should handle high-frequency updates efficiently', () => {
      const departments = ['sales', 'marketing', 'operations'];
      const events: MarketEvent[] = Array.from({ length: 1000 }, (_, i) => ({
        type: 'market_change',
        departmentId: departments[i % departments.length],
        impact: 0.1,
        timestamp: Date.now() + i
      }));

      const start = Date.now();
      
      events.forEach(event => {
        aggregator.aggregateMetrics([event]);
        const metrics = aggregator.getMetrics(); // Force metrics calculation
        expect(metrics).toBeDefined();
      });
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThanOrEqual(200);
    });
  });

  describe('State Management', () => {
    it('should maintain correct metrics history window', () => {
      const events: MarketEvent[] = Array.from({ length: 150 }, (_, i) => ({
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.1,
        timestamp: Date.now() + i
      }));

      events.forEach(event => {
        aggregator.aggregateMetrics([event]);
      });

      const deptMetrics = aggregator.getDepartmentMetrics('sales');
      expect(deptMetrics?.performance.length).toBe(100); // Window size
    });

    it('should reset state correctly', () => {
      const event: MarketEvent = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      aggregator.aggregateMetrics([event]);
      expect(aggregator.getMetrics().metrics).toHaveProperty('sales_performance');
      
      aggregator.reset();
      expect(Object.keys(aggregator.getMetrics().metrics)).toHaveLength(0);
    });
  });
});
