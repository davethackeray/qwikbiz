import { EventProcessor } from '../../features/simulation/EventProcessor';

export class EventService {
  private processor: EventProcessor;

  constructor() {
    this.processor = new EventProcessor();
  }

  processEvents(events: Event[]) {
    return this.processor.processEvents(events);
  }
}