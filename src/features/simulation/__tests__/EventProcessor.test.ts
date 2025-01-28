import { EventProcessor } from '../EventProcessor';

interface MarketEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

describe('EventProcessor', () => {
  let processor: EventProcessor;

  beforeEach(() => {
    processor = new EventProcessor();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Event Processing', () => {
    it('should process events and store them in history', () => {
      const events: MarketEvent[] = [{
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now(),
        metadata: { cause: 'market_growth' }
      }];

      processor.processEvents(events);
      const history = processor.getEventHistory();
      
      expect(history).toHaveLength(1);
      expect(history[0]).toEqual(events[0]);
    });

    it('should emit events to registered listeners', () => {
      const event: MarketEvent = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      const listener = jest.fn();
      processor.addEventListener('market_change', listener);
      
      processor.processEvents([event]);
      
      expect(listener).toHaveBeenCalledWith(event);
    });

    it('should handle multiple event types', () => {
      const events: MarketEvent[] = [
        {
          type: 'market_change',
          departmentId: 'sales',
          impact: 0.5,
          timestamp: Date.now()
        },
        {
          type: 'department_update',
          departmentId: 'marketing',
          impact: 0.3,
          timestamp: Date.now()
        }
      ];

      const marketListener = jest.fn();
      const departmentListener = jest.fn();
      
      processor.addEventListener('market_change', marketListener);
      processor.addEventListener('department_update', departmentListener);
      
      processor.processEvents(events);
      
      expect(marketListener).toHaveBeenCalledTimes(1);
      expect(departmentListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event History', () => {
    it('should maintain correct event order', () => {
      jest.useFakeTimers();
      const baseTime = Date.now();
      
      const events: MarketEvent[] = Array.from({ length: 5 }, (_, i) => ({
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.1 * (i + 1),
        timestamp: baseTime + i * 1000
      }));

      processor.processEvents(events);
      const history = processor.getEventHistory();
      
      expect(history).toHaveLength(5);
      expect(history.map(e => e.impact)).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);
    });

    it('should clear history when requested', () => {
      const event: MarketEvent = {
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      };

      processor.processEvents([event]);
      expect(processor.getEventHistory()).toHaveLength(1);
      
      processor.clearHistory();
      expect(processor.getEventHistory()).toHaveLength(0);
    });
  });

  describe('Listener Management', () => {
    it('should properly remove event listeners', () => {
      const listener = jest.fn();
      
      processor.addEventListener('market_change', listener);
      processor.removeEventListener('market_change', listener);
      
      processor.processEvents([{
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      }]);
      
      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners for same event type', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      processor.addEventListener('market_change', listener1);
      processor.addEventListener('market_change', listener2);
      
      processor.processEvents([{
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.5,
        timestamp: Date.now()
      }]);
      
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance', () => {
    it('should process events within performance target', () => {
      const events: MarketEvent[] = Array.from({ length: 100 }, (_, i) => ({
        type: 'market_change',
        departmentId: 'sales',
        impact: 0.1,
        timestamp: Date.now() + i
      }));

      const start = Date.now();
      processor.processEvents(events);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThanOrEqual(200);
    });

    it('should handle high event throughput', () => {
      const eventTypes = ['market_change', 'department_update', 'metric_update'];
      const departments = ['sales', 'marketing', 'operations'];
      
      const events: MarketEvent[] = Array.from({ length: 1000 }, (_, i) => ({
        type: eventTypes[i % eventTypes.length],
        departmentId: departments[i % departments.length],
        impact: 0.1,
        timestamp: Date.now() + i
      }));

      const listener = jest.fn();
      eventTypes.forEach(type => {
        processor.addEventListener(type, listener);
      });

      const start = Date.now();
      processor.processEvents(events);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThanOrEqual(200);
      expect(listener).toHaveBeenCalledTimes(1000);
    });
  });
});
