# Engineering Insights

## EventProcessor Optimization (2025-01-28)

### Performance Metrics

| Batch Size | Processing Time | Throughput | Latency | Heap Impact |
|------------|----------------|------------|---------|-------------|
| 100        | 0.58ms        | 172k/sec   | -23.5ms | 0.07 MB    |
| 1,000      | 0.56ms        | 1.79M/sec  | -9.5ms  | 0.27 MB    |
| 10,000     | 3.04ms        | 3.29M/sec  | -3.5ms  | 1.77 MB    |
| 50,000     | 4.48ms        | 11.16M/sec | 6.5ms   | 8.14 MB    |

### Key Optimizations

1. **Batch Processing**
   - Events are processed in configurable batches (default: 50)
   - Processing interval of 100ms maintains real-time responsiveness
   - Immediate processing when batch size threshold is reached

2. **Memory Management**
   - Circular buffer implementation for event history
   - Fixed capacity (10,000 events) prevents unbounded growth
   - Garbage collection hints for large batches (>10,000 events)

3. **Event Emission**
   - Events grouped by type to reduce context switching
   - Batch event emission using `batch:${type}` events
   - Listener sets to prevent duplicate subscriptions

4. **Performance Features**
   - Pre-processing of events into type-based collections
   - Single lookup for listeners per event type
   - Array-based iteration for better performance
   - Memory-efficient event queueing

### Usage Guidelines

1. **Event Processing**
   ```typescript
   const processor = new EventProcessor();
   
   // Process single or multiple events
   processor.processEvents([{
     type: 'market_change',
     departmentId: 'sales',
     impact: 0.5,
     timestamp: Date.now()
   }]);
   ```

2. **Event Listening**
   ```typescript
   // Single events
   processor.addEventListener('market_change', (event) => {
     // Handle event
   });

   // Batch events
   processor.eventEmitter.on('batch:market_change', (events) => {
     // Handle batch of events
   });
   ```

3. **Metrics Monitoring**
   ```typescript
   const metrics = processor.getMetrics();
   console.log(`Processed ${metrics.eventsProcessed} events`);
   console.log(`Average latency: ${metrics.averageLatency}ms`);
   ```

4. **Resource Cleanup**
   ```typescript
   // Important: Call dispose when done to prevent memory leaks
   processor.dispose();
   ```

### Implementation Details

1. **Circular Buffer**
   - O(1) insertion time
   - Constant memory usage
   - Automatic old event cleanup

2. **Event Batching**
   ```typescript
   // Events are queued and processed in batches
   private processBatch(): void {
     const batch = this.eventQueue.splice(0, this.BATCH_SIZE);
     const eventsByType = new Map<string, MarketEvent[]>();
     
     // Group by type for efficient processing
     batch.forEach(event => {
       if (!eventsByType.has(event.type)) {
         eventsByType.set(event.type, []);
       }
       eventsByType.get(event.type)!.push(event);
     });
     
     // Process each type's events together
     for (const [type, events] of eventsByType) {
       // Emit batch event
       this.eventEmitter.emit(`batch:${type}`, events);
       // Process individual events
       const listeners = this.listeners.get(type);
       if (listeners) {
         events.forEach(event => {
           listeners.forEach(listener => listener(event));
         });
       }
     }
   }
   ```

3. **Memory Management**
   - Events are processed in a streaming fashion
   - Historical events automatically roll off when buffer is full
   - Explicit GC hints for large batches

### Performance Tuning

1. **Batch Size**
   - Default: 50 events
   - Increase for higher throughput
   - Decrease for lower latency

2. **Processing Interval**
   - Default: 100ms
   - Balance between responsiveness and CPU usage
   - Configurable based on use case

3. **History Size**
   - Default: 10,000 events
   - Memory usage is predictable
   - Adjust based on monitoring requirements

### Best Practices

1. Always call `dispose()` when destroying processor instance
2. Monitor metrics for performance regression
3. Use batch event listeners for high-throughput scenarios
4. Keep event payloads minimal
5. Consider implementing event TTL for critical systems
