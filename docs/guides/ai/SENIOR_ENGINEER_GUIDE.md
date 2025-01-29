# AI Senior Engineer Guide - Updated January 29, 2025

## 🎯 Current Focus Areas

### 1. Performance Testing Framework
The automated performance testing framework is now operational with the following key aspects:

#### Testing Infrastructure
- ES modules-based implementation
- Automated metrics collection
- Historical comparison tracking
- Configurable test scenarios

#### Critical Metrics
```typescript
interface PerformanceTargets {
  throughput: {
    minimum: '11M events/sec',
    current: '12.6M events/sec (peak)',
    stability: 'Consistent across batch sizes'
  },
  latency: {
    targets: {
      smallBatch: '50ms',
      mediumBatch: '100ms',
      largeBatch: '200ms',
      stressTest: '500ms'
    },
    current: 'Exceeding targets (200-600ms)',
    priority: 'Critical optimization needed'
  },
  memory: {
    efficiency: 'Excellent (linear scaling)',
    current: '11.32MB for 50k events',
    leaks: 'None detected'
  }
}
```

#### Known Challenges
1. Event Processing Latency
   - Currently exceeding targets across all scenarios
   - Potential architectural bottleneck in event handling
   - Requires investigation of listener callbacks and queue processing

2. Performance Testing
   - Framework now fully operational
   - ES modules configuration resolved
   - Metrics collection working correctly

### 2. Core System Architecture

#### Event Processing System
- High-throughput event handling (12.6M events/sec peak)
- Batch processing capabilities
- Real-time metrics collection
- Memory-efficient implementation

#### Testing Framework
- Automated performance tests
- Historical data tracking
- Configurable test scenarios
- Metrics aggregation and reporting

## 🔄 Development Workflow

### Performance Testing
1. Run performance tests:
   ```bash
   npm run test:performance
   ```
2. Review metrics in:
   - Console output
   - performance-results.json
   - Metrics aggregator

### Adding New Tests
1. Configure scenarios in:
   ```
   src/features/simulation/__tests__/performance/config.ts
   ```
2. Define thresholds for:
   - Processing time
   - Throughput
   - Memory usage
   - Latency targets

## 📊 Key Files

### Performance Testing
- Runner: `src/features/simulation/__tests__/performance/runner.ts`
- Config: `src/features/simulation/__tests__/performance/config.ts`
- Types: `src/features/simulation/__tests__/performance/types.ts`

### Core Components
- EventProcessor: `src/features/simulation/EventProcessor.ts`
- MarketSimulator: `src/features/simulation/MarketSimulator.ts`
- DepartmentNetwork: `src/features/simulation/DepartmentNetwork.ts`
- MetricsAggregator: `src/features/simulation/MetricsAggregator.ts`

## 🎯 Priority Areas

### Immediate Focus
1. Event processing latency optimization:
   - Profile event listener execution
   - Analyze queue processing
   - Optimize handler registration
   - Review emission patterns

2. Metrics enhancement:
   - Per-event-type latency tracking
   - Warm-up period filtering
   - Percentile-based reporting

3. Documentation:
   - Performance testing guide
   - Latency patterns documentation
   - Metrics interpretation guide

## 📈 Success Metrics

### Performance Targets
1. Throughput:
   - Maintain >11M events/sec
   - Consistent scaling with batch size
   - Stable under sustained load

2. Latency:
   - Small batch: <50ms
   - Medium batch: <100ms
   - Large batch: <200ms
   - Stress test: <500ms

3. Memory:
   - Linear scaling with batch size
   - No memory leaks
   - Efficient resource utilization

## 📚 Resources

### Documentation
- Engineering Journal: `docs/engineering/journals/2025-01-28-performance-testing.md`
- Next Session Brief: `docs/guides/ai/NEXT_SESSION_BRIEF.md`
- Architecture Overview: `docs/architecture/ARCHITECTURE.md`

### Testing
- Performance Results: `performance-results.json`
- Test Configurations: `src/features/simulation/__tests__/performance/config.ts`
- Testing Framework: `src/features/simulation/__tests__/performance/`

## 🚀 Next Steps
1. Review current performance metrics
2. Analyze event processing bottlenecks
3. Implement latency optimizations
4. Update monitoring and alerting
5. Enhance documentation and guides

Remember: Always validate performance impacts of any changes using the automated testing framework.
