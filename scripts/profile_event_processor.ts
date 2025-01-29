#!/usr/bin/env node

import { PerformanceTestRunner } from '../src/features/simulation/__tests__/performance/runner.js';

async function runPerformanceTests() {
  console.log('🚀 Starting performance test suite');

  const runner = new PerformanceTestRunner();
  
  try {
    const result = await runner.runAll();
    
    // Print summary
    console.log('\n📊 Performance Test Results');
    console.log('==========================');
    console.log(`Tests Run: ${result.summary.totalTests}`);
    console.log(`Passed: ${result.summary.passed}`);
    console.log(`Failed: ${result.summary.failed}`);
    
    // Check for degradation
    if (result.comparison?.alerts.length) {
      console.log('\n⚠️  Performance Degradation Detected:');
      result.comparison.alerts.forEach(alert => {
        console.log(`   - ${alert}`);
      });
    }
    
    // Exit with failure if any tests failed
    if (result.summary.failed > 0) {
      console.log('\n❌ Some performance tests failed');
      process.exit(1);
    }

    console.log('\n✅ All performance tests passed');
  } catch (error) {
    console.error('Error running performance tests:', error);
    process.exit(1);
  } finally {
    runner.dispose();
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceTests();
}

export { runPerformanceTests };
