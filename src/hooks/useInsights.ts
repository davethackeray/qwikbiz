import { useState, useEffect, useCallback } from 'react';
import { Insight } from '@/types/insights';
import { insightsService } from '@/lib/services/insights';

export interface InsightsState {
  insights: Insight[];
  loading: boolean;
  error: string | null;
  filters: {
    importance: ('high' | 'medium' | 'low')[];
    category: ('performance' | 'risk' | 'opportunity' | 'learning')[];
  };
}

export interface InsightsActions {
  refreshInsights: () => Promise<void>;
  filterInsights: (filters: Partial<InsightsState['filters']>) => void;
  handleInsightAction: (insightId: string) => Promise<void>;
  provideFeedback: (insightId: string, helpful: boolean, feedback?: string) => Promise<void>;
}

/**
 * Custom hook to manage insights state and interactions
 */
export function useInsights(contextData: {
  kpis: any[];
  departments: any[];
  scenario: any;
}): [InsightsState, InsightsActions] {
  const [state, setState] = useState<InsightsState>({
    insights: [],
    loading: false,
    error: null,
    filters: {
      importance: ['high', 'medium', 'low'],
      category: ['performance', 'risk', 'opportunity', 'learning']
    }
  });

  const refreshInsights = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const insights = await insightsService.generateInsights(contextData);
      const prioritizedInsights = await insightsService.prioritizeInsights(insights);
      setState(prev => ({
        ...prev,
        insights: prioritizedInsights,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load insights'
      }));
    }
  }, [contextData]);

  const filterInsights = useCallback((filters: Partial<InsightsState['filters']>) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...filters
      }
    }));
  }, []);

  const handleInsightAction = useCallback(async (insightId: string) => {
    const insight = state.insights.find(i => i.id === insightId);
    if (insight?.action) {
      await insight.action.onClick();
    }
  }, [state.insights]);

  const provideFeedback = useCallback(async (insightId: string, helpful: boolean, feedback?: string) => {
    await insightsService.recordInsightFeedback(insightId, helpful, feedback);
  }, []);

  // Initialize insights
  useEffect(() => {
    refreshInsights();
  }, [refreshInsights]);

  const filteredInsights = state.insights.filter(insight => (
    state.filters.importance.includes(insight.importance) &&
    state.filters.category.includes(insight.category)
  ));

  return [
    {
      ...state,
      insights: filteredInsights
    },
    {
      refreshInsights,
      filterInsights,
      handleInsightAction,
      provideFeedback
    }
  ];
}

export default useInsights;
