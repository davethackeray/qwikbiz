export type TrendDirection = 'up' | 'down' | 'stable';

export interface TrendData {
  direction: TrendDirection;
  percentage: number;
  period: string;
  compare?: {
    value: number;
    period: string;
  };
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  trend?: TrendData;
  importance: 'low' | 'medium' | 'high';
  category: 'performance' | 'risk' | 'opportunity' | 'learning';
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
