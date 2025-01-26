"use client";

import { BusinessScenario, Solution } from "@/types/dashboard";
import { Fragment } from "react";

interface ScenarioSectionProps {
  scenario: BusinessScenario;
  onSelectSolution: (solution: Solution) => void;
  onSpecialProjects: () => void;
  loading?: boolean;
}

export function ScenarioSection({
  scenario,
  onSelectSolution,
  onSpecialProjects,
  loading = false,
}: ScenarioSectionProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Active Scenario</h2>
          <div className="flex items-center space-x-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scenario.solutions.map((solution) => (
            <Fragment key={solution.id}>
              <button
                onClick={() => onSelectSolution(solution)}
                disabled={loading}
                className="text-left p-4 rounded-lg border border-gray-700 hover:border-blue-500 
                         transition-all duration-200 hover:bg-gray-700/50 disabled:opacity-50 
                         disabled:cursor-not-allowed group"
              >
                <div className="space-y-4">
                  <p className="font-medium text-gray-200 group-hover:text-white transition-colors">
                    {solution.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded bg-gray-900/50">
                          <span className="text-gray-400">Revenue</span>
                          <span className={solution.impacts.revenue > 0 ? "text-green-400" : "text-red-400"}>
                            {solution.impacts.revenue > 0 ? "+" : ""}{solution.impacts.revenue}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-gray-900/50">
                          <span className="text-gray-400">Morale</span>
                          <span className={solution.impacts.morale > 0 ? "text-green-400" : "text-red-400"}>
                            {solution.impacts.morale > 0 ? "+" : ""}{solution.impacts.morale}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded bg-gray-900/50">
                          <span className="text-gray-400">Efficiency</span>
                          <span className={solution.impacts.efficiency > 0 ? "text-green-400" : "text-red-400"}>
                            {solution.impacts.efficiency > 0 ? "+" : ""}{solution.impacts.efficiency}%
                          </span>
                        </div>
                      </div>
                      <div className="p-2 rounded bg-gray-900/50">
                        <p className="text-gray-400 text-xs leading-relaxed">
                          {solution.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </Fragment>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={onSpecialProjects}
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 
                     text-white font-medium rounded-lg hover:from-purple-700 
                     hover:to-blue-700 transition-all duration-200 disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span>Call Special Projects Team</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
