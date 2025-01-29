import { MarketSimulator } from '../MarketSimulator';
import { DepartmentNetwork } from '../DepartmentNetwork';
import { EventProcessor } from '../EventProcessor';
import { MetricsAggregator } from '../MetricsAggregator';
import { jest } from '@jest/globals';

interface MarketEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

describe('Market Simulation Integration', () => {
  let departmentNetwork: DepartmentNetwork;
  let eventProcessor: EventProcessor;
  let metricsAggregator: MetricsAggregator;
  let simulator: MarketSimulator;

  beforeEach(() => {
    // Create actual instances instead of mocks for integration testing
    const departments = [
      {
        id: 'sales',
        name: 'Sales',
        metrics: {
          performance: 80,
          efficiency: 75,
          satisfaction: 85
        },
        dependencies: ['marketing', 'operations']
      },
      {
        id: 'marketing',
        name: 'Marketing',
        metrics: {
          performance: 85,
          efficiency: 80,
          satisfaction: 75
        },
        dependencies: ['sales']
      },
      {
        id: 'operations',
        name: 'Operations',
        metrics: {
          performance: 90,
          efficiency: 85,
          satisfaction: 80
        },
        dependencies: ['sales', 'marketing']
      }
    ];

    departmentNetwork = new DepartmentNetwork(departments);
    eventProcessor = new EventProcessor();
    metricsAggregator = new MetricsAggregator();
    simulator = new MarketSimulator(departmentNetwork, eventProcessor, metricsAggregator, {
      testMode: true // Enable test mode to bypass auth and rate limiting
    });
  });

  afterEach(() => {
    simulator.stop();
    jest.useRealTimers();
  });

  describe('Real-time Department Interactions', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should propagate effects through department network', async () => {
      // Create market event that affects sales
      const event: MarketEvent = {
        type: 'market_shift',
        departmentId: 'sales',
        impact: 0.8,
        timestamp: Date.now(),
        metadata: { cause: 'new_market_opportunity' }
      };

      await simulator.start(); // No token needed in test mode
      simulator.addEvents([event]);

      // Advance time to allow event processing
      jest.advanceTimersByTime(200);

      // Check sales department state
      const salesState = departmentNetwork.getDepartmentState('sales');
      expect(salesState?.metrics.performance).toBeGreaterThan(80);

      // Check marketing department state (should be affected due to dependency)
      const marketingState = departmentNetwork.getDepartmentState('marketing');
      expect(marketingState?.metrics.performance).not.toBe(85);
    });

    it('should maintain consistent metrics over time', async () => {
      const events: MarketEvent[] = [
        {
          type: 'market_shift',
          departmentId: 'sales',
          impact: 0.5,
          timestamp: Date.now(),
          metadata: { cause: 'market_growth' }
        },
        {
          type: 'market_shift',
          departmentId: 'marketing',
          impact: -0.3,
          timestamp: Date.now() + 500,
          metadata: { cause: 'competitor_action' }
        }
      ];

      await simulator.start();
      simulator.addEvents(events);

      // Check initial state
      const initialMetrics = metricsAggregator.getMetrics();
      
      // Advance time
      jest.advanceTimersByTime(200);
      
      // Check metrics after first event
      const midMetrics = metricsAggregator.getMetrics();
      expect(Object.keys(midMetrics.metrics).length).toBeGreaterThan(0);
      
      // Advance time for second event
      jest.advanceTimersByTime(300);
      
      // Check final metrics
      const finalMetrics = metricsAggregator.getMetrics();
      expect(finalMetrics.timestamp).toBeGreaterThan(initialMetrics.timestamp);
    });
  });

  describe('Performance and State Management', () => {
    it('should handle rapid event sequences within performance targets', async () => {
      const events: MarketEvent[] = Array.from({ length: 10 }, (_, i) => ({
        type: 'rapid_change',
        departmentId: 'operations',
        impact: 0.1 * (i + 1),
        timestamp: Date.now() + i * 100,
        metadata: { sequence: i }
      }));

      const start = performance.now();
      
      await simulator.start();
      simulator.addEvents(events);
      
      // Process all events
      jest.advanceTimersByTime(2000);
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThanOrEqual(200);

      // Verify state consistency
      const state = simulator.getSimulationState();
      expect(state.events.length).toBe(10);
    });

    it('should maintain system stability under load', async () => {
      // Create events targeting all departments
      const departments = ['sales', 'marketing', 'operations'];
      const events: MarketEvent[] = departments.flatMap(dept => 
        Array.from({ length: 5 }, (_, i) => ({
          type: 'stress_test',
          departmentId: dept,
          impact: 0.2,
          timestamp: Date.now() + i * 100,
          metadata: { iteration: i }
        }))
      );

      await simulator.start();
      simulator.addEvents(events);

      // Process events over time
      for (let i = 0; i < 10; i++) {
        jest.advanceTimersByTime(200);
        
        // Verify metrics are being calculated
        const metrics = metricsAggregator.getMetrics();
        expect(metrics).toBeDefined();
        expect(Object.keys(metrics.metrics).length).toBeGreaterThan(0);
      }

      // Verify final system state
      departments.forEach(dept => {
        const state = departmentNetwork.getDepartmentState(dept);
        expect(state).toBeDefined();
        expect(state?.metrics.performance).toBeLessThanOrEqual(100);
        expect(state?.metrics.performance).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
