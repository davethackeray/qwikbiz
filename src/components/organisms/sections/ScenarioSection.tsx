"use client";

import React from 'react';
import { BusinessScenario, Solution } from "@/types/dashboard";
import { ErrorBoundary } from '../../ErrorBoundary';
import { LoadingSpinner } from '../../atoms/LoadingSpinner';
import { SolutionCard } from '../../molecules/cards/SolutionCard';
import { Button } from '../../atoms/Button';

export interface ScenarioSectionProps {
  /**
   * Current business scenario
   */
  scenario: BusinessScenario | null;
  /**
   * Callback when a solution is selected
   */
  onSelectSolution: (solution: Solution) => void;
  /**
   * Callback when special projects team is called
   */
  onSpecialProjects: () => void;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Optional error state
   */
  error?: Error;
}

/**
 * ScenarioSection displays the current business scenario and possible solutions
 * @example
 * <ScenarioSection
 *   scenario={currentScenario}
 *   onSelectSolution={handleSolution}
 *   onSpecialProjects={handleSpecialProjects}
 * />
 */
export const ScenarioSection: React.FC<ScenarioSectionProps> = ({
  scenario,
  onSelectSolution,
  onSpecialProjects,
  loading = false,
  error
}) => {
  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center text-red-400">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div 
        className="bg-gray-800 rounded-lg p-6 text-center"
        role="status"
        aria-label="No scenario available"
      >
        <span className="text-gray-400">No scenario available</span>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section 
        className="bg-gray-800 rounded-lg p-6"
        aria-labelledby="scenario-title"
      >
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 id="scenario-title" className="text-xl font-bold">
              Active Scenario
            </h2>
            <div 
              className="flex items-center space-x-2"
              role="status"
              aria-label={`Complexity level ${scenario.complexity}`}
            >
              <span className="text-sm text-gray-400">Complexity:</span>
              <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-500/20 text-blue-400">
                Level {scenario.complexity}
              </span>
            </div>
          </div>
          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            {scenario.description}
          </p>
        </div>

        <div className="space-y-6">
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            role="list"
            aria-label="Available solutions"
          >
            {scenario.solutions.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                onSelect={onSelectSolution}
                isLoading={loading}
              />
            ))}
          </div>

          <div className="pt-4 border-t border-gray-700">
            <Button
              onClick={onSpecialProjects}
              disabled={loading}
              variant="primary"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 
                       hover:from-purple-700 hover:to-blue-700"
              icon={loading ? <LoadingSpinner size={20} /> : undefined}
            >
              {loading ? "Processing..." : "Call Special Projects Team"}
            </Button>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default ScenarioSection;
