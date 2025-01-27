"use client";

import React from 'react';
import { ErrorBoundary } from '../../ErrorBoundary';
import { LoadingSpinner } from '../../atoms/LoadingSpinner';
import { KPICard } from '../../molecules/cards/KPICard';
import { DepartmentSlider } from '../../organisms/sections/DepartmentSlider';
import { NewsTicker } from '../../organisms/sections/NewsTicker';
import { ScenarioSection } from '../../organisms/sections/ScenarioSection';
import { useDashboard } from '@/hooks/useDashboard';

/**
 * DashboardTemplate is the main page template for the business simulation dashboard
 */
export const DashboardTemplate: React.FC = () => {
  const [
    { kpis, departments, news, scenario, loading, error },
    { handleSolutionSelect, handleSpecialProjects }
  ] = useDashboard();

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen bg-gray-900 text-white p-6 flex flex-col"
        role="main"
        aria-label="Business Simulation Dashboard"
      >
        <div className="max-w-7xl mx-auto flex-grow pb-16">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Business Simulation Dashboard</h1>
            {error && (
              <div 
                className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
          </header>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Department Sliders */}
            <aside 
              className="col-span-3 space-y-6"
              aria-label="Department Metrics"
            >
              {departments.map((dept) => (
                <DepartmentSlider
                  key={dept.name}
                  {...dept}
                  isLoading={loading}
                />
              ))}
            </aside>

            {/* Main Content */}
            <main className="col-span-9 space-y-6">
              {/* KPIs */}
              <section 
                className="grid grid-cols-4 gap-4"
                aria-label="Key Performance Indicators"
              >
                {kpis.map((kpi) => (
                  <KPICard
                    key={kpi.label}
                    {...kpi}
                    isLoading={loading}
                  />
                ))}
              </section>

              {/* Active Scenario */}
              <section className="relative">
                {loading && (
                  <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <LoadingSpinner size={20} text="Loading scenario..." />
                    </div>
                  </div>
                )}
                <ScenarioSection
                  scenario={scenario}
                  onSelectSolution={handleSolutionSelect}
                  onSpecialProjects={handleSpecialProjects}
                  loading={loading}
                  error={error ? new Error(error) : undefined}
                />
              </section>
            </main>
          </div>
        </div>

        {/* News Ticker - Fixed to bottom */}
        <footer className="fixed bottom-0 left-0 right-0 w-full">
          <div className="max-w-7xl mx-auto px-6">
            <NewsTicker news={news || []} />
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardTemplate;
