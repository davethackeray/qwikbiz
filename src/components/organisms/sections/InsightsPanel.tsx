import React from 'react';
import { InsightCard } from '@/components/molecules';
import { Button, InfoIcon, LoadingSpinner } from '@/components/atoms';
import { useInsights } from '@/hooks/useInsights';
import type { Insight } from '@/types/insights';

export interface InsightsPanelProps {
  contextData: {
    kpis: any[];
    departments: any[];
    scenario: any;
  };
  className?: string;
}

/**
 * InsightsPanel displays business insights and trends
 * with filtering and interactive capabilities
 */
export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  contextData,
  className = ''
}) => {
  const [state, actions] = useInsights(contextData);

  const categoryFilters = [
    { value: 'performance', label: 'Performance' },
    { value: 'risk', label: 'Risks' },
    { value: 'opportunity', label: 'Opportunities' },
    { value: 'learning', label: 'Learning' }
  ] as const;

  const importanceFilters = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ] as const;

  const handleCategoryToggle = (category: Insight['category']) => {
    const currentCategories = state.filters.category;
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    actions.filterInsights({ category: newCategories });
  };

  const handleImportanceToggle = (importance: Insight['importance']) => {
    const currentImportance = state.filters.importance;
    const newImportance = currentImportance.includes(importance)
      ? currentImportance.filter(i => i !== importance)
      : [...currentImportance, importance];
    
    actions.filterInsights({ importance: newImportance });
  };

  return (
    <section 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}
      aria-label="Business Insights"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Business Insights
          </h2>
          <InfoIcon
            size={18}
            tooltip="AI-powered insights based on your business metrics"
            className="text-gray-400"
          />
        </div>
        <Button
          onClick={() => actions.refreshInsights()}
          className="flex items-center gap-2"
          aria-label="Refresh insights"
        >
          <span>↻</span>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map(({ value, label }) => (
            <Button
              key={value}
              onClick={() => handleCategoryToggle(value)}
              className={`px-3 py-1 text-sm ${
                state.filters.category.includes(value)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {importanceFilters.map(({ value, label }) => (
            <Button
              key={value}
              onClick={() => handleImportanceToggle(value)}
              className={`px-3 py-1 text-sm ${
                state.filters.importance.includes(value)
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {state.loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size={32} text="Loading insights..." />
          </div>
        ) : state.error ? (
          <div className="text-center py-8 text-red-500 dark:text-red-400">
            {state.error}
          </div>
        ) : state.insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No insights found with current filters
          </div>
        ) : (
          state.insights.map(insight => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onActionClick={() => actions.handleInsightAction(insight.id)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default InsightsPanel;
