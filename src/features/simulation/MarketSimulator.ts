import { DepartmentNetwork } from './DepartmentNetwork';
import { EventProcessor } from './EventProcessor';
import { MetricsAggregator } from './MetricsAggregator';
import { AuthService } from '@/lib/services/auth';
import { RateLimiter } from '@/middleware/rateLimit';
import { config } from '@/lib/config/env';

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

interface SimulatorOptions {
  useAuth?: boolean;
  useRateLimit?: boolean;
  tickInterval?: number;
  testMode?: boolean;
}

export class MarketSimulator {
  private authService?: AuthService;
  private rateLimiter?: RateLimiter;
  private state: SimulationState;
  private readonly tickInterval: number;
  private simulationInterval: NodeJS.Timeout | null = null;
  private testMode: boolean;

  constructor(
    private departmentNetwork: DepartmentNetwork,
    private eventProcessor: EventProcessor,
    private metricsAggregator: MetricsAggregator,
    options: SimulatorOptions = {}
  ) {
    const {
      useAuth = true,
      useRateLimit = true,
      tickInterval = 200, // 200ms per tick to meet performance target
      testMode = false
    } = options;

    this.testMode = testMode;

    if (useAuth && !testMode) {
      this.authService = new AuthService({
        clientId: config.auth.google.clientId,
        clientSecret: config.auth.google.clientSecret,
        redirectUri: config.auth.google.redirectUri,
        scopes: ['email', 'profile']
      });
    }
    
    if (useRateLimit && !testMode) {
      this.rateLimiter = new RateLimiter();
    }

    this.tickInterval = tickInterval;
    this.state = {
      currentTick: 0,
      events: [],
      lastProcessedEvent: 0
    };
  }

  async start(userToken?: string) {
    // Skip auth checks in test mode
    if (!this.testMode && userToken) {
      if (this.authService && !this.authService.isAuthenticated()) {
        throw new Error('Unauthorized');
      }
      if (this.rateLimiter && !this.rateLimiter.allowRequest(userToken)) {
        throw new Error('Rate limit exceeded');
      }
    }

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
