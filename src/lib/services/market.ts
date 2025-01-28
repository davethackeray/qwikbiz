import { MarketSimulator } from '../../features/simulation/MarketSimulator';

export class MarketService {
  private simulator: MarketSimulator;

  constructor() {
    this.simulator = new MarketSimulator();
  }

  runSimulation(events: Event[]) {
    return this.simulator.simulateMarket(events);
  }
}