'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { DepartmentSlider } from '@/components/organisms/sections/DepartmentSlider';
import { NewsTicker } from '@/components/organisms/sections/NewsTicker';
import { ScenarioSection } from '@/components/organisms/sections/ScenarioSection';
import { InsightsPanel } from '@/components/organisms/sections/InsightsPanel';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

interface DashboardTemplateProps {
  user: {
    name: string;
    email: string;
    imageUrl?: string;
  };
}

export function DashboardTemplate({ user }: DashboardTemplateProps) {
  const { signOut } = useAuth();
  const [
    { kpis, departments, news, scenario, loading, error },
    { handleSolutionSelect, handleSpecialProjects }
  ] = useDashboard();

  // Convert error string to Error object if needed
  const errorObj = error ? new Error(error) : undefined;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">BizSim Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-400">{user.email}</div>
            </div>
            <button
              onClick={signOut}
              className="ml-4 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Departments Section */}
            <div className="space-y-4">
              {departments?.map((dept) => (
                <DepartmentSlider
                  key={dept.name}
                  name={dept.name}
                  metrics={dept.metrics}
                  isLoading={loading}
                />
              ))}
            </div>

            {/* News Section */}
            {news && news.length > 0 && <NewsTicker news={news} />}

            {/* Scenario Section */}
            <ScenarioSection
              scenario={scenario}
              onSelectSolution={handleSolutionSelect}
              onSpecialProjects={handleSpecialProjects}
              loading={loading}
              error={errorObj}
            />
          </div>

          {/* Right Column - Insights */}
          <div className="space-y-8">
            <InsightsPanel
              contextData={{ kpis, departments, scenario }}
              className="h-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
