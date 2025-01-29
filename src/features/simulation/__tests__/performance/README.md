# Automated Performance Testing Framework

This framework provides automated performance testing capabilities for the event processing system, with features including:

- Configurable test scenarios and thresholds
- Historical result tracking and comparison
- Memory usage monitoring
- Latency measurements
- CI/CD integration
- Performance degradation alerts

## Running Tests

```bash
# Run with Node.js garbage collection enabled for accurate memory metrics
node --expose-gc dist/features/simulation/__tests__/performance/runner.js

# Or use the npm script
npm run test:performance
```

## Configuration

Test scenarios, thresholds, and other settings can be configured in `config.ts`:

- Test scenarios (small batch, medium batch, large batch, stress test)
- Performance thresholds for each scenario
- Warm-up run count
- Test iterations
- Event types and departments
- Historical results storage
- Degradation alert thresholds

## Test Results

Results are stored in `performance-results.json` and include:

- Timestamp and Git commit
- Metrics for each scenario:
  - Processing time
  - Throughput (events/sec)
  - Memory usage
  - Average latency
- Historical comparisons
- Performance degradation alerts

## CI/CD Integration

The test runner will exit with code 1 if:
- Any test fails to meet performance thresholds
- Errors occur during test execution

This enables automatic CI/CD pipeline failures on performance regressions.

## Monitoring Performance Over Time

Historical results enable tracking of:
- Throughput trends
- Latency patterns
- Memory usage growth
- Performance degradations

## Example Output

```
🔥 Performing warm-up runs...

🏃 Running performance tests...

📊 Testing smallBatch (100 events)
----------------------------------------

Iteration 1/3:
⏱️  Processing time: 15.23ms
📈 Throughput: 6,567 events/sec
⚡ Average latency: 2.45ms
💾 Memory usage: 1.23MB

...

📋 Test Suite Summary:
----------------------------------------
Total Tests: 12
Passed: 11
Failed: 1
Tests showing degradation: 2
```

## Development

When modifying the event processing system:

1. Run performance tests locally to verify changes
2. Compare results with historical data
3. Investigate any degradation alerts
4. Update thresholds if architectural changes affect baseline performance

## Alerts and Monitoring

The system alerts on:
- Failed performance thresholds
- Throughput degradation > 10%
- Latency increases > 15%
- Memory usage growth > 20%

## Best Practices

1. Run tests on isolated environments
2. Use consistent hardware for comparisons
3. Monitor trends over time
4. Investigate any degradation alerts
5. Update thresholds when making architectural changes
