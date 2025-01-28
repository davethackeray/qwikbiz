import { MetricsAggregator } from '../../features/simulation/MetricsAggregator';

export class MetricsService {
  private aggregator: MetricsAggregator;

  constructor() {
    this.aggregator = new MetricsAggregator();
  }

  aggregateMetrics(events: Event[]) {
    return this.aggregator.aggregateMetrics(events);
  }
}