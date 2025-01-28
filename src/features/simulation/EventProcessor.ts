import { EventEmitter } from 'events';

interface MarketEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export class EventProcessor {
  private eventEmitter: EventEmitter;
  private eventHistory: MarketEvent[];
  private listeners: Map<string, Set<(event: MarketEvent) => void>>;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.eventHistory = [];
    this.listeners = new Map();

    // Set high water mark for event emissions
    this.eventEmitter.setMaxListeners(50);
  }

  processEvents(events: MarketEvent[]) {
    events.forEach(event => {
      this.handleEvent(event);
    });
  }

  private handleEvent(event: MarketEvent) {
    // Store event in history
    this.eventHistory.push(event);

    // Emit the event for real-time processing
    this.eventEmitter.emit(event.type, event);
    
    // Notify specific listeners
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      typeListeners.forEach(listener => listener(event));
    }
  }

  addEventListener(type: string, callback: (event: MarketEvent) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
  }

  removeEventListener(type: string, callback: (event: MarketEvent) => void) {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.delete(callback);
    }
  }

  getEventHistory(): MarketEvent[] {
    return [...this.eventHistory];
  }

  clearHistory() {
    this.eventHistory = [];
  }
}
