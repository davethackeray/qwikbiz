"use client";

import { useState, useEffect, useCallback } from "react";
import { KPICard } from "./KPICard";
import { DepartmentSlider } from "./DepartmentSlider";
import { NewsTicker } from "./NewsTicker";
import { ScenarioSection } from "./ScenarioSection";
import { KPI, Department, BusinessScenario, Solution, NewsItem } from "@/types/dashboard";
import { fetchBusinessNews } from "@/lib/services/news";
import { generateBusinessScenario, getSpecialProjectsRecommendation } from "@/lib/services/ai";

const initialKPIs: KPI[] = [
  {
    label: "Annual Revenue",
    value: "$245M",
    trend: 12.5,
    color: "text-green-400",
  },
  {
    label: "Revenue Growth",
    value: "12.5%",
    trend: 2.1,
    color: "text-blue-400",
  },
  {
    label: "Gross Profit Margin",
    value: "32%",
    trend: -1.2,
    color: "text-yellow-400",
  },
  {
    label: "Cash Flow",
    value: "-$28M",
    trend: -5.3,
    color: "text-red-400",
  },
];

const initialDepartments: Department[] = [
  {
    name: "Human Resources",
    metrics: {
      efficiency: 75,
      morale: 82,
      innovation: 65,
    },
  },
  {
    name: "Finance",
    metrics: {
      efficiency: 88,
      morale: 71,
      innovation: 59,
    },
  },
  {
    name: "Operations",
    metrics: {
      efficiency: 92,
      morale: 68,
      innovation: 73,
    },
  },
  {
    name: "Senior Leadership",
    metrics: {
      efficiency: 85,
      morale: 79,
      innovation: 81,
    },
  },
];

export function Dashboard() {
  const [kpis, setKpis] = useState<KPI[]>(initialKPIs);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [scenario, setScenario] = useState<BusinessScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBusinessContext = useCallback(() => ({
    revenue: kpis[0].value,
    growth: kpis[1].value,
    profitMargin: kpis[2].value,
    cashFlow: kpis[3].value,
    departmentMetrics: departments.reduce((acc, dept) => ({
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
      // Simulate applying the solution's impacts
      const updatedDepartments = departments.map(dept => ({
        ...dept,
        metrics: {
          efficiency: Math.min(100, dept.metrics.efficiency + solution.impacts.efficiency),
          morale: Math.min(100, dept.metrics.morale + solution.impacts.morale),
          innovation: dept.metrics.innovation,
        }
      }));

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
      handleSolutionSelect(specialSolution);
    } catch (error) {
      console.error("Error getting special projects solution:", error);
      setError("Failed to get special projects recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    generateScenario();

    // Refresh news every 5 minutes
    const newsInterval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(newsInterval);
  }, [fetchNews, generateScenario]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Business Simulation Dashboard</h1>
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-lg">
              {error}
            </div>
          )}
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Department Sliders */}
          <div className="col-span-3 space-y-6">
            {departments.map((dept) => (
              <DepartmentSlider key={dept.name} {...dept} />
            ))}
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
              {kpis.map((kpi) => (
                <KPICard key={kpi.label} {...kpi} />
              ))}
            </div>

            {/* Active Scenario */}
            {scenario ? (
              <ScenarioSection
                scenario={scenario}
                onSelectSolution={handleSolutionSelect}
                onSpecialProjects={handleSpecialProjects}
                loading={loading}
              />
            ) : loading ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                Loading scenario...
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <button
                  onClick={generateScenario}
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Generate New Scenario
                </button>
              </div>
            )}
          </div>
        </div>

        {/* News Ticker */}
        <div className="mt-6">
          <NewsTicker news={news} />
        </div>
      </div>
    </div>
  );
}
