import { DepartmentNetwork } from './DepartmentNetwork';
import { EventProcessor } from './EventProcessor';
import { MetricsAggregator } from './MetricsAggregator';

interface MarketEvent {
  type: string;
  departmentId: string;
  impact: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface SimulationState {
  currentTick: number;
  events: MarketEvent[];
  lastProcessedEvent: number;
}

export class MarketSimulator {
  private state: SimulationState;
  private readonly tickInterval = 200; // 200ms per tick to meet performance target
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor(
    private departmentNetwork: DepartmentNetwork,
    private eventProcessor: EventProcessor,
    private metricsAggregator: MetricsAggregator
  ) {
    this.state = {
      currentTick: 0,
      events: [],
      lastProcessedEvent: 0
    };
  }

  start() {
    if (this.simulationInterval) return;

    this.simulationInterval = setInterval(() => {
      this.tick();
    }, this.tickInterval);
  }

  stop() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  private tick() {
    this.state.currentTick++;
    this.processQueuedEvents();
    this.updateMetrics();
  }

  addEvents(events: MarketEvent[]) {
    this.state.events.push(...events.map(event => ({
      ...event,
      timestamp: Date.now()
    })));
  }

  private processQueuedEvents() {
    const currentTime = Date.now();
    const eventsToProcess = this.state.events.filter(event => 
      event.timestamp <= currentTime && 
      event.timestamp > this.state.lastProcessedEvent
    );

    eventsToProcess.forEach(event => {
      this.departmentNetwork.manageDepartments(event);
      this.eventProcessor.processEvents([event]);
    });

    if (eventsToProcess.length > 0) {
      this.state.lastProcessedEvent = currentTime;
    }
  }

  private updateMetrics() {
    this.metricsAggregator.aggregateMetrics(this.state.events);
  }

  getSimulationState(): SimulationState {
    return { ...this.state };
  }

  reset() {
    this.stop();
    this.state = {
      currentTick: 0,
      events: [],
      lastProcessedEvent: 0
    };
  }
}
