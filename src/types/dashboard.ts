export interface KPI {
  label: string;
  value: string;
  trend: number;
  color: string;
}

export interface DepartmentMetrics {
  efficiency: number;
  morale: number;
  innovation: number;
}

export interface Department {
  name: string;
  metrics: DepartmentMetrics;
}

export interface BusinessScenario {
  id: string;
  description: string;
  solutions: Solution[];
  complexity: number;
}

export interface Solution {
  id: string;
  description: string;
  impacts: {
    revenue: number;
    morale: number;
    efficiency: number;
  };
  explanation: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  timestamp: string;
}
