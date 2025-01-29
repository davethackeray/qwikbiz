import React, { useEffect, useState } from 'react';
import KPICard from '../../molecules/cards/KPICard';
import { InfoIcon } from '../../atoms';
import { performanceMonitor } from '../../../lib/services/monitoring';
import type { ProcessingMetrics } from '../../../features/simulation/EventProcessor';

interface MetricsWithTrends extends ProcessingMetrics {
  throughput: number;
  timestamp: number;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toFixed(0);
};

const formatMemory = (bytes: number) => {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

export const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsWithTrends | null>(null);
  const [alerts, setAlerts] = useState<{ message: string; type: 'warning' | 'error' }[]>([]);

  useEffect(() => {
    const metricsHandler = (newMetrics: MetricsWithTrends) => {
      setMetrics(newMetrics);
    };

    const alertHandler = (alert: { message: string; type: 'warning' | 'error' }) => {
      setAlerts(prev => [...prev, alert].slice(-5)); // Keep last 5 alerts
    };

    performanceMonitor.onMetrics(metricsHandler);
    performanceMonitor.onAlert(alertHandler);

    return () => {
      // Cleanup not strictly needed due to singleton, but good practice
      setMetrics(null);
      setAlerts([]);
    };
  }, []);

  if (!metrics) return null;

  const getTrend = (current: number, threshold: number) => {
    if (current > threshold * 1.1) return 'up';
    if (current < threshold * 0.9) return 'down';
    return 'stable';
  };

  const getTrendValue = (current: number, target: number): number => {
    return ((current - target) / target) * 100;
};

const cards = [
    {
      label: 'Throughput',
      value: `${formatNumber(metrics.throughput)} events/sec`,
      trend: getTrendValue(metrics.throughput, 100000),
      color: 'text-blue-400'
    },
    {
      label: 'Latency',
      value: `${metrics.averageLatency.toFixed(2)} ms`,
      trend: -getTrendValue(metrics.averageLatency, 200), // Negative because lower is better
      color: 'text-green-400'
    },
    {
      label: 'Memory',
      value: formatMemory(metrics.memoryUsage),
      trend: -getTrendValue(metrics.memoryUsage / (1024 * 1024), 512), // Negative because lower is better
      color: 'text-purple-400'
    },
    {
      label: 'Batch Size',
      value: `${metrics.lastBatchSize} events`,
      trend: getTrendValue(metrics.lastBatchSize, 25),
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <KPICard
            key={card.label}
            label={card.label}
            value={card.value}
            trend={card.trend}
            color={card.color}
          />
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="mt-4 space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                alert.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
