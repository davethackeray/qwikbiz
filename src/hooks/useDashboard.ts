import { useState, useEffect, useCallback } from 'react';
import { KPI, Department, BusinessScenario, Solution, NewsItem } from "@/types/dashboard";
import { fetchBusinessNews } from "@/lib/services/news";
import { generateBusinessScenario, getSpecialProjectsRecommendation } from "@/lib/services/ai";
import { INITIAL_KPIS, INITIAL_DEPARTMENTS } from "@/lib/constants/initialData";

export interface DashboardState {
  kpis: KPI[];
  departments: Department[];
  news: NewsItem[];
  scenario: BusinessScenario | null;
  loading: boolean;
  error: string | null;
}

export interface DashboardActions {
  handleSolutionSelect: (solution: Solution) => Promise<void>;
  handleSpecialProjects: () => Promise<void>;
  refreshData: () => Promise<void>;
}

/**
 * Custom hook to manage dashboard state and business logic
 * @returns Dashboard state and actions
 */
export function useDashboard(): [DashboardState, DashboardActions] {
  const [kpis, setKpis] = useState<KPI[]>(INITIAL_KPIS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [scenario, setScenario] = useState<BusinessScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBusinessContext = useCallback(() => ({
    revenue: kpis?.[0]?.value ?? "$0",
    growth: kpis?.[1]?.value ?? "0%",
    profitMargin: kpis?.[2]?.value ?? "0%",
    cashFlow: kpis?.[3]?.value ?? "$0",
    departmentMetrics: (departments ?? []).reduce((acc, dept) => ({
      ...acc,
      [dept.name]: dept.metrics
    }), {})
  }), [kpis, departments]);

  const fetchNews = useCallback(async () => {
    try {
      const newsData = await fetchBusinessNews();
      setNews(newsData);
    } catch (error) {
      console.error("Failed to fetch news:", error);
      // Don't set error state for news failures as it's not critical
    }
  }, []);

  const generateScenario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const context = getBusinessContext();
      const newScenario = await generateBusinessScenario(context);
      setScenario(newScenario);
    } catch (error) {
      console.error("Failed to generate scenario:", error);
      setError("Failed to generate scenario. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getBusinessContext]);

  const handleSolutionSelect = async (solution: Solution) => {
    setLoading(true);
    try {
      // Update departments based on solution impacts
      const updatedDepartments = departments.map(dept => ({
        ...dept,
        metrics: {
          efficiency: Math.min(100, dept.metrics.efficiency + solution.impacts.efficiency),
          morale: Math.min(100, dept.metrics.morale + solution.impacts.morale),
          innovation: dept.metrics.innovation,
        }
      }));

      // Update KPIs based on solution impacts
      const updatedKpis = kpis.map(kpi => {
        if (kpi.label === "Annual Revenue" || kpi.label === "Revenue Growth") {
          return {
            ...kpi,
            trend: solution.impacts.revenue,
          };
        }
        return kpi;
      });

      setDepartments(updatedDepartments);
      setKpis(updatedKpis);

      // Generate a new scenario after applying the solution
      await generateScenario();
    } catch (error) {
      console.error("Error applying solution:", error);
      setError("Failed to apply solution. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialProjects = async () => {
    if (!scenario) return;

    setLoading(true);
    try {
      const context = getBusinessContext();
      const specialSolution = await getSpecialProjectsRecommendation(scenario, context);
      await handleSolutionSelect(specialSolution);
    } catch (error) {
      console.error("Error getting special projects solution:", error);
      setError("Failed to get special projects recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchNews(),
      generateScenario()
    ]);
  }, [fetchNews, generateScenario]);

  // Initialize data and set up refresh interval
  useEffect(() => {
    refreshData();

    // Refresh news every 5 minutes
    const newsInterval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(newsInterval);
  }, [refreshData, fetchNews]);

  return [
    { kpis, departments, news, scenario, loading, error },
    { handleSolutionSelect, handleSpecialProjects, refreshData }
  ];
}
