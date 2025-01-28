import { MarketSimulator } from '../MarketSimulator';
import { DepartmentNetwork } from '../DepartmentNetwork';
import { EventProcessor } from '../EventProcessor';
import { MetricsAggregator } from '../MetricsAggregator';

interface MarketEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

describe('MarketSimulator', () => {
  let departmentNetwork: jest.Mocked<DepartmentNetwork>;
  let eventProcessor: jest.Mocked<EventProcessor>;
  let metricsAggregator: jest.Mocked<MetricsAggregator>;
  let simulator: MarketSimulator;
  let events: MarketEvent[];

  beforeEach(() => {
    departmentNetwork = {
      manageDepartments: jest.fn(),
    } as unknown as jest.Mocked<DepartmentNetwork>;

    eventProcessor = {
      processEvents: jest.fn(),
    } as unknown as jest.Mocked<EventProcessor>;

    metricsAggregator = {
      aggregateMetrics: jest.fn(),
    } as unknown as jest.Mocked<MetricsAggregator>;

    simulator = new MarketSimulator(departmentNetwork, eventProcessor, metricsAggregator);
    events = [{
      type: 'market_change',
      departmentId: 'sales',
      impact: 0.5,
      timestamp: Date.now(),
      metadata: { cause: 'market_growth' }
    }];
  });

  afterEach(() => {
    simulator.stop();
    jest.useRealTimers();
  });

  describe('Event Processing', () => {
    it('should process market events and trigger department changes', () => {
      simulator.addEvents(events);
      simulator.start();
      expect(departmentNetwork.manageDepartments).toHaveBeenCalledWith(events[0]);
    });

    it('should propagate cross-functional effects', () => {
      simulator.addEvents(events);
      simulator.start();
      expect(eventProcessor.processEvents).toHaveBeenCalledWith([events[0]]);
    });

    it('should aggregate metrics based on events', () => {
      simulator.addEvents(events);
      simulator.start();
      expect(metricsAggregator.aggregateMetrics).toHaveBeenCalledWith(events);
    });
  });

  describe('Real-time Simulation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should process events in real-time with tick interval', () => {
      simulator.start();
      simulator.addEvents(events);
      
      jest.advanceTimersByTime(200); // One tick
      
      expect(departmentNetwork.manageDepartments).toHaveBeenCalled();
      expect(eventProcessor.processEvents).toHaveBeenCalled();
      expect(metricsAggregator.aggregateMetrics).toHaveBeenCalled();
    });

    it('should maintain event order and timing', () => {
      const event1 = { ...events[0], timestamp: Date.now() };
      const event2 = { ...events[0], timestamp: Date.now() + 500 };
      
      simulator.start();
      simulator.addEvents([event1, event2]);

      jest.advanceTimersByTime(200); // First tick
      expect(departmentNetwork.manageDepartments).toHaveBeenCalledWith(event1);
      
      jest.advanceTimersByTime(300); // Second tick
      expect(departmentNetwork.manageDepartments).toHaveBeenCalledWith(event2);
    });

    it('should stop processing when simulator is stopped', () => {
      simulator.start();
      simulator.addEvents(events);
      
      simulator.stop();
      jest.advanceTimersByTime(1000);
      
      expect(departmentNetwork.manageDepartments).not.toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should complete event processing within 200ms', () => {
      const start = Date.now();
      
      simulator.addEvents(events);
      simulator.start();
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThanOrEqual(200);
    });
  });

  describe('State Management', () => {
    it('should maintain simulation state', () => {
      simulator.addEvents(events);
      const state = simulator.getSimulationState();
      
      expect(state.events).toHaveLength(1);
      expect(state.currentTick).toBe(0);
    });

    it('should reset state correctly', () => {
      simulator.addEvents(events);
      simulator.start();
      
      simulator.reset();
      const state = simulator.getSimulationState();
      
      expect(state.events).toHaveLength(0);
      expect(state.currentTick).toBe(0);
      expect(state.lastProcessedEvent).toBe(0);
    });
  });
});
