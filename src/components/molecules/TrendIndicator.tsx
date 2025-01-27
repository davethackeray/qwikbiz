import React from 'react';
import { InfoIcon } from '../atoms';
import { TrendData } from '@/types/insights';

export interface TrendIndicatorProps {
  data: TrendData;
  className?: string;
  showComparison?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * TrendIndicator displays trend direction and percentage change
 * with optional comparison data and tooltips
 */
export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  data,
  className = '',
  showComparison = false,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const colorClasses = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-blue-500'
  };

  const arrowIcons = {
    up: '↑',
    down: '↓',
    stable: '→'
  };

  const tooltipText = showComparison && data.compare
    ? `${data.percentage}% change compared to ${data.compare.value}% in ${data.compare.period}`
    : `${data.percentage}% change over ${data.period}`;

  return (
    <div 
      className={`flex items-center gap-2 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={`Trend: ${data.direction}, ${tooltipText}`}
    >
      <span 
        className={`flex items-center font-semibold ${colorClasses[data.direction]}`}
        aria-hidden="true"
      >
        <span className="mr-1">{arrowIcons[data.direction]}</span>
        {data.percentage}%
      </span>

      <span className="text-gray-500 dark:text-gray-400">
        {data.period}
      </span>

      {showComparison && data.compare && (
        <div className="flex items-center gap-1">
          <span className="text-gray-400">vs</span>
          <span className="text-gray-600 dark:text-gray-300">
            {data.compare.value}%
          </span>
          <span className="text-gray-400">
            ({data.compare.period})
          </span>
        </div>
      )}

      <InfoIcon
        size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
        tooltip={tooltipText}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      />
    </div>
  );
};

export default TrendIndicator;
