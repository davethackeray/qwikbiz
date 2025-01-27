"use client";

import React from 'react';
import { Department } from "@/types/dashboard";
import { ErrorBoundary } from '../../ErrorBoundary';
import { ProgressBar } from '../../molecules/ProgressBar';

export interface DepartmentSliderProps extends Department {
  /**
   * Optional loading state
   */
  isLoading?: boolean;
  /**
   * Optional callback for metric value changes
   */
  onMetricUpdate?: (metric: string, value: number) => void;
}

/**
 * DepartmentSlider displays department metrics with interactive progress bars
 * @example
 * <DepartmentSlider
 *   name="Sales"
 *   metrics={{
 *     performance: 85,
 *     satisfaction: 92
 *   }}
 *   onMetricUpdate={(metric, value) => console.log(metric, value)}
 * />
 */
export const DepartmentSlider: React.FC<DepartmentSliderProps> = ({
  name,
  metrics,
  isLoading = false,
  onMetricUpdate
}) => {
  const getMetricColor = (value: number): string => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-blue-500";
    if (value >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-2 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section 
        className="bg-gray-800 rounded-lg p-4"
        aria-labelledby={`department-${name}`}
      >
        <h3 
          id={`department-${name}`}
          className="text-lg font-semibold mb-4"
        >
          {name}
        </h3>
        <div className="space-y-4">
          {Object.entries(metrics).map(([metric, value]) => (
            <div 
              key={metric}
              className="space-y-2"
            >
              <div className="flex justify-between">
                <label 
                  id={`${name}-${metric}-label`}
                  className="text-sm text-gray-400 capitalize"
                >
                  {metric}
                </label>
                <span 
                  className="text-sm text-gray-400"
                  aria-label={`${value} percent`}
                >
                  {value}%
                </span>
              </div>
              <ProgressBar
                value={value}
                color={getMetricColor(value)}
                size="medium"
                aria-labelledby={`${name}-${metric}-label`}
              />
            </div>
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default DepartmentSlider;
