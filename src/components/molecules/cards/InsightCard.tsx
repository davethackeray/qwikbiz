import React from 'react';
import { Button, InfoIcon } from '@/components/atoms';
import { TrendIndicator } from '@/components/molecules/TrendIndicator';
import { Insight } from '@/types/insights';

export interface InsightCardProps {
  insight: Insight;
  className?: string;
  onActionClick?: () => void;
}

/**
 * InsightCard displays a single business insight with trend data,
 * importance level, and optional action button
 */
export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  className = '',
  onActionClick
}) => {
  const importanceColors = {
    low: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
    medium: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
    high: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
  };

  const categoryIcons = {
    performance: '📊',
    risk: '⚠️',
    opportunity: '💡',
    learning: '📚'
  };

  return (
    <div 
      className={`
        rounded-lg border p-4 shadow-sm
        ${importanceColors[insight.importance]}
        ${className}
      `}
      role="article"
      aria-labelledby={`insight-${insight.id}-title`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span role="img" aria-label={`Category: ${insight.category}`}>
            {categoryIcons[insight.category]}
          </span>
          <h3 
            id={`insight-${insight.id}-title`}
            className="font-semibold text-gray-900 dark:text-gray-100"
          >
            {insight.title}
          </h3>
          <InfoIcon
            size={16}
            tooltip={`${insight.category} insight - ${insight.importance} importance`}
            className="text-gray-400"
          />
        </div>
        <time 
          className="text-sm text-gray-500 dark:text-gray-400"
          dateTime={insight.timestamp}
        >
          {new Date(insight.timestamp).toLocaleDateString()}
        </time>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-3">
        {insight.description}
      </p>

      {/* Trend Data */}
      {insight.trend && (
        <div className="mb-3">
          <TrendIndicator
            data={insight.trend}
            showComparison={true}
            size="sm"
          />
        </div>
      )}

      {/* Action Button */}
      {insight.action && (
        <div className="mt-4">
          <Button
            onClick={() => {
              insight.action?.onClick();
              onActionClick?.();
            }}
            className="w-full justify-center"
          >
            {insight.action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InsightCard;
