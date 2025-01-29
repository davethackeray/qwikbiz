"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventProcessor_1 = require("../src/features/simulation/EventProcessor");
function generateTestEvents(count, types, departments) {
    return Array.from({ length: count }, (_, i) => ({
        type: types[i % types.length],
        departmentId: departments[i % departments.length],
        impact: Math.random(),
        timestamp: Date.now() + i,
        metadata: { iteration: i }
    }));
}
function formatMemoryUsage(bytes) {
    return `${Math.round(bytes / 1024 / 1024 * 100) / 100} MB`;
}
async function profileEventProcessor() {
    const eventProcessor = new EventProcessor_1.EventProcessor();
    const eventTypes = ['market_change', 'department_update', 'metric_update'];
    const departments = ['sales', 'marketing', 'operations', 'finance', 'hr'];
    // Test scenarios
    const scenarios = [
        { count: 100, desc: 'Small batch' },
        { count: 1000, desc: 'Medium batch' },
        { count: 10000, desc: 'Large batch' },
        { count: 50000, desc: 'Stress test' }
    ];
    // Listener latency tracking
    let totalListenerLatency = 0;
    let listenerCalls = 0;
    eventTypes.forEach(type => {
        eventProcessor.addEventListener(type, (event) => {
            const latency = Date.now() - event.timestamp;
            totalListenerLatency += latency;
            listenerCalls++;
        });
    });
    console.log('🔍 EventProcessor Performance Profile\n');
    for (const scenario of scenarios) {
        // Reset metrics
        totalListenerLatency = 0;
        listenerCalls = 0;
        eventProcessor.clearHistory();
        // Force garbage collection if possible
        if (global.gc) {
            global.gc();
        }
        const initialMemory = process.memoryUsage();
        const events = generateTestEvents(scenario.count, eventTypes, departments);
        console.log(`\n📊 Scenario: ${scenario.desc} (${scenario.count} events)`);
        console.log('----------------------------------------');
        // Measure processing time
        const startTime = process.hrtime.bigint();
        eventProcessor.processEvents(events);
        const endTime = process.hrtime.bigint();
        // Calculate metrics
        const duration = Number(endTime - startTime) / 1000000; // Convert to ms
        const throughput = Math.round(scenario.count / (duration / 1000));
        const avgLatency = listenerCalls > 0 ? totalListenerLatency / listenerCalls : 0;
        const finalMemory = process.memoryUsage();
        const memoryDiff = {
            heap: finalMemory.heapUsed - initialMemory.heapUsed,
            rss: finalMemory.rss - initialMemory.rss
        };
        // Report results
        console.log(`⏱️  Processing time: ${duration.toFixed(2)}ms`);
        console.log(`📈 Throughput: ${throughput.toLocaleString()} events/sec`);
        console.log(`⚡ Average listener latency: ${avgLatency.toFixed(2)}ms`);
        console.log(`💾 Memory impact:`);
        console.log(`   Heap: ${formatMemoryUsage(memoryDiff.heap)} (${formatMemoryUsage(finalMemory.heapUsed)} total)`);
        console.log(`   RSS: ${formatMemoryUsage(memoryDiff.rss)} (${formatMemoryUsage(finalMemory.rss)} total)`);
        // Performance check
        if (duration > 200 && scenario.count <= 100) {
            console.log('\n⚠️  Warning: Failed to meet 200ms performance target for small batch');
        }
    }
    // Clean up
    eventProcessor.dispose();
}
// Enable garbage collection for memory metrics
const flags = require('v8').getHeapStatistics();
if (!flags.does_zap_garbage) {
    console.log('\n⚠️  Warning: Run with --expose-gc for accurate memory metrics\n');
}
profileEventProcessor().catch(console.error);
