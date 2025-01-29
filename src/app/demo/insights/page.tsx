'use client';

import React from 'react';
import { InsightsPanel } from '@/components/organisms/sections/InsightsPanel';

// Sample KPI data
const sampleKPIs = [
  {
    type: 'revenue',
    value: 1500000,
    history: [1200000, 1300000, 1400000]
  },
  {
    type: 'growth',
    value: 15,
    history: [8, 10, 12]
  },
  {
    type: 'profitMargin',
    value: 25,
    history: [22, 23, 24]
  },
  {
    type: 'cashFlow',
    value: 500000,
    history: [400000, 450000, 480000]
  }
];

// Sample department data
const sampleDepartments = [
  {
    name: 'Sales',
    metrics: {
      efficiency: 85,
      morale: 90,
      innovation: 75
    }
  },
  {
    name: 'Marketing',
    metrics: {
      efficiency: 80,
      morale: 85,
      innovation: 90
    }
  },
  {
    name: 'Operations',
    metrics: {
      efficiency: 95,
      morale: 80,
      innovation: 70
    }
  }
];

// Sample scenario data
const sampleScenario = {
  id: 'demo-1',
  type: 'market_expansion',
  status: 'active',
  metrics: {
    riskLevel: 'medium',
    timeframe: 'Q2 2025',
    impact: 'high'
  }
};

export default function InsightsDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Smart Insights Demo
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            AI-powered business insights with real-time analysis and trend detection
          </p>
        </div>

        <InsightsPanel
          contextData={{
            kpis: sampleKPIs,
            departments: sampleDepartments,
            scenario: sampleScenario
          }}
        />
      </div>
    </div>
  );
}
