"use client";

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { ErrorBoundary } from '../../ErrorBoundary';

export interface KPICardProps {
  /**
   * Label displayed at the top of the card
   */
  label: string;
  /**
   * The main value to display
   */
  value: string | number;
  /**
   * Percentage trend (positive or negative)
   */
  trend: number;
  /**
   * Text color class for the value
   */
  color?: string;
  /**
   * Optional loading state
   */
  isLoading?: boolean;
}

/**
 * KPICard component displays a key performance indicator with its trend
 * @example
 * <KPICard
 *   label="Revenue"
 *   value="$50,000"
 *   trend={12.5}
 *   color="text-blue-400"
 * />
 */
export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  trend,
  color = "text-white",
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-8 bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg" data-testid="kpi-card">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
          <span 
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
              ${trend > 0 ? 'bg-green-100/10 text-green-400' : 'bg-red-100/10 text-red-400'}`}
            data-testid="trend-indicator"
          >
            {trend > 0 ? 
              <ArrowUpIcon className="w-3 h-3 mr-1" aria-hidden="true" /> : 
              <ArrowDownIcon className="w-3 h-3 mr-1" aria-hidden="true" />
            }
            <span className="sr-only">
              {trend > 0 ? 'Increased by' : 'Decreased by'}
            </span>
            {Math.abs(trend)}%
          </span>
        </div>
        <div 
          className={`text-2xl font-bold ${color}`}
          data-testid="kpi-value"
        >
          {value}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default KPICard;
