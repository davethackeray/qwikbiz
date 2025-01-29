import { Insight, TrendData } from '@/types/insights';
import { generateBusinessScenario } from './ai';
import { MetricsAggregator } from '@/features/simulation/MetricsAggregator';

const metricsAggregator = new MetricsAggregator();

// Cache insights for 5 minutes
const CACHE_TTL = 5 * 60 * 1000;
const insightsCache = new Map<string, { insights: Insight[], timestamp: number }>();

/**
 * Service for managing business insights and trend analysis
 */
class InsightsService {
  /**
   * Analyzes business metrics and generates insights using AI
   */
  async generateInsights(context: {
    kpis: any[];
    departments: any[];
    scenario: any;
  }): Promise<Insight[]> {
    const cacheKey = JSON.stringify(context);
    const cached = insightsCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.insights;
    }

    // Convert KPIs to business context
    const businessContext = {
      revenue: this.formatMetric(context.kpis.find(kpi => kpi.type === 'revenue')?.value),
      growth: this.formatMetric(context.kpis.find(kpi => kpi.type === 'growth')?.value),
      profitMargin: this.formatMetric(context.kpis.find(kpi => kpi.type === 'profitMargin')?.value),
      cashFlow: this.formatMetric(context.kpis.find(kpi => kpi.type === 'cashFlow')?.value),
      departmentMetrics: context.departments.reduce((acc, dept) => ({
        ...acc,
        [dept.name]: {
          efficiency: dept.metrics.efficiency,
          morale: dept.metrics.morale,
          innovation: dept.metrics.innovation
        }
      }), {})
    };

    // Generate scenario using AI
    const scenario = await generateBusinessScenario(businessContext);
    
    // Analyze trends using MetricsAggregator
    const trends = metricsAggregator.analyzeTrends(context.kpis.map(kpi => ({
      type: kpi.type,
      value: kpi.value,
      history: kpi.history
    })));

    // Convert scenario and trends into insights
    const insights: Insight[] = [
      // Scenario-based insight
      {
        id: scenario.id,
        title: 'Strategic Opportunity',
        description: scenario.description,
        importance: this.getImportanceFromComplexity(scenario.complexity),
        category: 'opportunity',
        timestamp: new Date().toISOString(),
          trend: (trends.find(t => t.metric === 'overall')?.trend || {
            direction: 'stable',
            percentage: 0,
            period: 'current',
            compare: { value: 0, period: 'previous' }
          }) as TrendData,
        action: {
          label: 'View Solutions',
          onClick: () => this.handleScenarioAction(scenario.id)
        }
      },
      // Convert each solution to an insight
      ...scenario.solutions.map(solution => ({
        id: solution.id,
        title: this.generateTitleFromImpacts(solution.impacts),
        description: solution.description,
        importance: this.getImportanceFromImpacts(solution.impacts),
        category: this.getCategoryFromImpacts(solution.impacts),
        timestamp: new Date().toISOString(),
        trend: {
          direction: solution.impacts.revenue > 0 ? 'up' as const : 'down' as const,
          percentage: Math.abs(solution.impacts.revenue),
          period: 'projected',
          compare: {
            value: 0,
            period: 'current'
          }
        },
        action: {
          label: 'Learn More',
          onClick: () => this.handleSolutionAction(solution.id)
        }
      }))
    ];

    // Cache the results
    insightsCache.set(cacheKey, { insights, timestamp: Date.now() });

    return insights;
  }

  /**
   * Gets historical trend data for a specific metric
   */
  async getTrendData(metricId: string, period: string): Promise<any> {
    return metricsAggregator.getHistoricalData(metricId, period);
  }

  /**
   * Records user feedback on an insight
   */
  async recordInsightFeedback(insightId: string, helpful: boolean, feedback?: string): Promise<void> {
    // Store feedback for ML model improvement
    await fetch('/api/insights/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ insightId, helpful, feedback })
    });
  }

  /**
   * Prioritizes insights based on business impact and urgency
   */
  async prioritizeInsights(insights: Insight[]): Promise<Insight[]> {
    return insights.sort((a, b) => {
      const scoreA = this.calculateInsightScore(a);
      const scoreB = this.calculateInsightScore(b);
      return scoreB - scoreA;
    });
  }

  private calculateInsightScore(insight: Insight): number {
    const baseScore = {
      high: 100,
      medium: 50,
      low: 25
    }[insight.importance];

    const categoryMultiplier = {
      risk: 1.5, // Prioritize risks
      opportunity: 1.2,
      performance: 1.0,
      learning: 0.8
    }[insight.category];

    const trend = insight.trend?.direction === 'up' ? 1.1 : 
                 insight.trend?.direction === 'down' ? 1.2 : 1.0;

    return baseScore * categoryMultiplier * trend;
  }

  private formatMetric(value: number | undefined): string {
    if (value === undefined) return 'N/A';
    return value >= 1e6 ? `$${(value / 1e6).toFixed(1)}M` :
           value >= 1e3 ? `$${(value / 1e3).toFixed(1)}K` :
           `$${value.toFixed(0)}`;
  }

  private getImportanceFromComplexity(complexity: number): Insight['importance'] {
    return complexity >= 4 ? 'high' :
           complexity >= 2 ? 'medium' : 'low';
  }

  private getImportanceFromImpacts(impacts: Record<string, number>): Insight['importance'] {
    const maxImpact = Math.max(...Object.values(impacts).map(Math.abs));
    return maxImpact >= 20 ? 'high' :
           maxImpact >= 10 ? 'medium' : 'low';
  }

  private getCategoryFromImpacts(impacts: Record<string, number>): Insight['category'] {
    if (impacts.revenue < 0 || impacts.efficiency < 0) return 'risk';
    if (impacts.revenue > 15) return 'opportunity';
    if (impacts.efficiency > 15) return 'performance';
    return 'learning';
  }

  private generateTitleFromImpacts(impacts: Record<string, number>): string {
    const mainImpact = Object.entries(impacts)
      .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))[0];
    
    const direction = mainImpact[1] > 0 ? 'Increase' : 'Decrease';
    const metric = mainImpact[0].charAt(0).toUpperCase() + mainImpact[0].slice(1);
    
    return `${metric} ${direction} Alert`;
  }

  private async handleScenarioAction(scenarioId: string): Promise<void> {
    await fetch(`/api/scenarios/${scenarioId}/view`, { method: 'POST' });
  }

  private async handleSolutionAction(solutionId: string): Promise<void> {
    await fetch(`/api/solutions/${solutionId}/view`, { method: 'POST' });
  }
}

export const insightsService = new InsightsService();
