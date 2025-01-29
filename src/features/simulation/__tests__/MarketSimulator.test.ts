import { MarketSimulator } from '../MarketSimulator';
import { DepartmentNetwork } from '../DepartmentNetwork';
import { EventProcessor } from '../EventProcessor';
import { MetricsAggregator } from '../MetricsAggregator';
import { AuthService } from '@/lib/services/auth';
import { RateLimiter } from '@/middleware/rateLimit';

jest.mock('@/lib/services/auth');
jest.mock('@/middleware/rateLimit');

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

    events = [{
      type: 'market_change',
      departmentId: 'sales',
      impact: 0.5,
      timestamp: Date.now(),
      metadata: { cause: 'market_growth' }
    }];

    // Reset mocks
    (AuthService as jest.Mock).mockClear();
    (RateLimiter as jest.Mock).mockClear();
  });

  afterEach(() => {
    if (simulator) {
      simulator.stop();
    }
    jest.useRealTimers();
  });

  describe('Authentication and Rate Limiting', () => {
    it('should bypass auth and rate limiting in test mode', async () => {
      simulator = new MarketSimulator(
        departmentNetwork,
        eventProcessor,
        metricsAggregator,
        { testMode: true }
      );

      await simulator.start();
      expect(AuthService).not.toHaveBeenCalled();
      expect(RateLimiter).not.toHaveBeenCalled();
    });

    it('should enforce auth and rate limiting in production mode', async () => {
      // Mock auth and rate limit responses
      const mockAuthService = {
        isAuthenticated: jest.fn().mockReturnValue(true)
      };
      const mockRateLimiter = {
        allowRequest: jest.fn().mockReturnValue(true)
      };

      (AuthService as jest.Mock).mockImplementation(() => mockAuthService);
      (RateLimiter as jest.Mock).mockImplementation(() => mockRateLimiter);

      simulator = new MarketSimulator(
        departmentNetwork,
        eventProcessor,
        metricsAggregator,
        { testMode: false }
      );

      await simulator.start('user-token');
      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
      expect(mockRateLimiter.allowRequest).toHaveBeenCalledWith('user-token');
    });

    it('should throw error when unauthorized', async () => {
      const mockAuthService = {
        isAuthenticated: jest.fn().mockReturnValue(false)
      };
      (AuthService as jest.Mock).mockImplementation(() => mockAuthService);

      simulator = new MarketSimulator(
        departmentNetwork,
        eventProcessor,
        metricsAggregator
      );

      await expect(simulator.start('user-token')).rejects.toThrow('Unauthorized');
    });

    it('should throw error when rate limit exceeded', async () => {
      const mockAuthService = {
        isAuthenticated: jest.fn().mockReturnValue(true)
      };
      const mockRateLimiter = {
        allowRequest: jest.fn().mockReturnValue(false)
      };

      (AuthService as jest.Mock).mockImplementation(() => mockAuthService);
      (RateLimiter as jest.Mock).mockImplementation(() => mockRateLimiter);

      simulator = new MarketSimulator(
        departmentNetwork,
        eventProcessor,
        metricsAggregator
      );

      await expect(simulator.start('user-token')).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('Event Processing', () => {
    beforeEach(() => {
      simulator = new MarketSimulator(
        departmentNetwork,
        eventProcessor,
        metricsAggregator,
        { testMode: true }
      );
    });

    it('should process market events and trigger department changes', async () => {
      simulator.addEvents(events);
      await simulator.start();
      expect(departmentNetwork.manageDepartments).toHaveBeenCalledWith(events[0]);
    });

    it('should propagate cross-functional effects', async () => {
      simulator.addEvents(events);
      await simulator.start();
      expect(eventProcessor.processEvents).toHaveBeenCalledWith([events[0]]);
    });

    it('should aggregate metrics based on events', async () => {
      simulator.addEvents(events);
      await simulator.start();
      expect(metricsAggregator.aggregateMetrics).toHaveBeenCalledWith(events);
    });
  });

  describe('Real-time Simulation', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      simulator = new MarketSimulator(
        departmentNetwork,
        eventProcessor,
        metricsAggregator,
        { testMode: true }
      );
    });

    it('should process events in real-time with tick interval', async () => {
      await simulator.start();
      simulator.addEvents(events);
      
      jest.advanceTimersByTime(200); // One tick
      
      expect(departmentNetwork.manageDepartments).toHaveBeenCalled();
      expect(eventProcessor.processEvents).toHaveBeenCalled();
      expect(metricsAggregator.aggregateMetrics).toHaveBeenCalled();
    });

    it('should maintain event order and timing', async () => {
      const event1 = { ...events[0], timestamp: Date.now() };
      const event2 = { ...events[0], timestamp: Date.now() + 500 };
      
      await simulator.start();
      simulator.addEvents([event1, event2]);

      jest.advanceTimersByTime(200); // First tick
      expect(departmentNetwork.manageDepartments).toHaveBeenCalledWith(event1);
      
      jest.advanceTimersByTime(300); // Second tick
      expect(departmentNetwork.manageDepartments).toHaveBeenCalledWith(event2);
    });

    it('should stop processing when simulator is stopped', async () => {
      await simulator.start();
      simulator.addEvents(events);
      
      simulator.stop();
      jest.advanceTimersByTime(1000);
      
      expect(departmentNetwork.manageDepartments).not.toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    beforeEach(() => {
      simulator = new MarketSimulator(
        departmentNetwork,
        eventProcessor,
        metricsAggregator,
        { testMode: true }
      );
    });

    it('should complete event processing within 200ms', async () => {
      const start = Date.now();
      
      simulator.addEvents(events);
      await simulator.start();
      
      const duration = Date.now() - start;
      expect(duration).toBeLessThanOrEqual(200);
    });
  });

  describe('State Management', () => {
    beforeEach(() => {
      simulator = new MarketSimulator(
        departmentNetwork,
        eventProcessor,
        metricsAggregator,
        { testMode: true }
      );
    });

    it('should maintain simulation state', () => {
      simulator.addEvents(events);
      const state = simulator.getSimulationState();
      
      expect(state.events).toHaveLength(1);
      expect(state.currentTick).toBe(0);
    });

    it('should reset state correctly', async () => {
      simulator.addEvents(events);
      await simulator.start();
      
      simulator.reset();
      const state = simulator.getSimulationState();
      
      expect(state.events).toHaveLength(0);
      expect(state.currentTick).toBe(0);
      expect(state.lastProcessedEvent).toBe(0);
    });
  });
});
