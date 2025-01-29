"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventProcessor = void 0;
const events_1 = require("events");
class CircularBuffer {
    constructor(capacity) {
        this.capacity = capacity;
        this.writePos = 0;
        this.size = 0;
        this.buffer = new Array(capacity);
    }
    push(item) {
        this.buffer[this.writePos] = item;
        this.writePos = (this.writePos + 1) % this.capacity;
        this.size = Math.min(this.size + 1, this.capacity);
    }
    getAll() {
        if (this.size < this.capacity) {
            return this.buffer.slice(0, this.size);
        }
        const items = this.buffer.slice(this.writePos).concat(this.buffer.slice(0, this.writePos));
        return items;
    }
    clear() {
        this.buffer = new Array(this.capacity);
        this.writePos = 0;
        this.size = 0;
    }
}
class EventProcessor {
    constructor() {
        this.eventQueue = [];
        this.BATCH_SIZE = 50;
        this.HISTORY_SIZE = 10000;
        this.PROCESSING_INTERVAL = 100; // ms
        this.eventEmitter = new events_1.EventEmitter();
        this.eventHistory = new CircularBuffer(this.HISTORY_SIZE);
        this.listeners = new Map();
        this.metrics = {
            eventsProcessed: 0,
            batchesProcessed: 0,
            totalProcessingTime: 0,
            averageLatency: 0,
            lastBatchSize: 0,
            maxBatchSize: 0,
            memoryUsage: 0
        };
        this.eventEmitter.setMaxListeners(50);
        this.startProcessingLoop();
    }
    processEvents(events) {
        const now = Date.now();
        events.forEach(event => {
            // Set timestamp if not provided
            if (!event.timestamp) {
                event.timestamp = now;
            }
            this.eventQueue.push(event);
        });
        // Process immediately if queue exceeds batch size
        if (this.eventQueue.length >= this.BATCH_SIZE) {
            this.processBatch();
        }
    }
    startProcessingLoop() {
        this.processingTimer = setInterval(() => {
            if (this.eventQueue.length > 0) {
                this.processBatch();
            }
        }, this.PROCESSING_INTERVAL);
    }
    processBatch() {
        const batchStart = Date.now();
        const batchSize = Math.min(this.eventQueue.length, this.BATCH_SIZE);
        const batch = this.eventQueue.splice(0, batchSize);
        // Pre-process batch for better performance
        const eventsByType = new Map();
        batch.forEach(event => {
            if (!eventsByType.has(event.type)) {
                eventsByType.set(event.type, []);
            }
            eventsByType.get(event.type).push(event);
            this.eventHistory.push(event);
        });
        let totalLatency = 0;
        const startTime = Date.now();
        // Process events by type to reduce context switching
        for (const [type, events] of eventsByType) {
            // Emit events in batch
            if (events.length > 0) {
                this.eventEmitter.emit(`batch:${type}`, events);
                // Get listeners once per type
                const typeListeners = this.listeners.get(type);
                if (typeListeners) {
                    const listeners = Array.from(typeListeners);
                    // Process all events for each listener
                    listeners.forEach(listener => {
                        events.forEach(event => {
                            listener(event);
                            totalLatency += Date.now() - event.timestamp;
                        });
                    });
                }
            }
        }
        // Update metrics
        const processingTime = Date.now() - batchStart;
        this.updateMetrics({
            batchSize,
            processingTime,
            totalLatency,
            eventCount: batch.length
        });
        // Trigger garbage collection hint for large batches
        if (batch.length > 10000 && global.gc) {
            setImmediate(() => global.gc?.());
        }
    }
    updateMetrics(data) {
        this.metrics.eventsProcessed += data.eventCount;
        this.metrics.batchesProcessed++;
        this.metrics.totalProcessingTime += data.processingTime;
        this.metrics.lastBatchSize = data.batchSize;
        this.metrics.maxBatchSize = Math.max(this.metrics.maxBatchSize, data.batchSize);
        this.metrics.averageLatency = (this.metrics.averageLatency * (this.metrics.eventsProcessed - data.eventCount) + data.totalLatency) / this.metrics.eventsProcessed;
        this.metrics.memoryUsage = process.memoryUsage().heapUsed;
    }
    addEventListener(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(callback);
    }
    removeEventListener(type, callback) {
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
            typeListeners.delete(callback);
        }
    }
    getEventHistory() {
        return this.eventHistory.getAll();
    }
    clearHistory() {
        this.eventHistory.clear();
    }
    getMetrics() {
        return { ...this.metrics };
    }
    dispose() {
        if (this.processingTimer) {
            clearInterval(this.processingTimer);
        }
        this.eventEmitter.removeAllListeners();
        this.listeners.clear();
        this.eventQueue = [];
    }
}
exports.EventProcessor = EventProcessor;
