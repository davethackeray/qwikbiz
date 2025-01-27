"use client";

import React from 'react';
import { Solution } from "@/types/dashboard";

export interface SolutionCardProps {
  /**
   * Solution data to display
   */
  solution: Solution;
  /**
   * Callback when solution is selected
   */
  onSelect: (solution: Solution) => void;
  /**
   * Optional loading state
   */
  isLoading?: boolean;
}

/**
 * SolutionCard displays a business solution with its impacts and explanation
 * @example
 * <SolutionCard
 *   solution={solutionData}
 *   onSelect={(solution) => handleSelect(solution)}
 * />
 */
export const SolutionCard: React.FC<SolutionCardProps> = ({
  solution,
  onSelect,
  isLoading = false
}) => {
  const renderImpactValue = (value: number) => {
    const isPositive = value > 0;
    return (
      <span className={isPositive ? "text-green-400" : "text-red-400"}>
        {isPositive ? "+" : ""}{value}%
      </span>
    );
  };

  return (
    <button
      onClick={() => onSelect(solution)}
      disabled={isLoading}
      className="w-full text-left p-4 rounded-lg border border-gray-700 hover:border-blue-500 
               transition-all duration-200 hover:bg-gray-700/50 disabled:opacity-50 
               disabled:cursor-not-allowed group"
      aria-busy={isLoading}
      role="listitem"
    >
      <div className="space-y-4">
        <p className="font-medium text-gray-200 group-hover:text-white transition-colors">
          {solution.description}
        </p>
        
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <div 
                className="flex items-center justify-between p-2 rounded bg-gray-900/50"
                role="group"
                aria-label="Revenue impact"
              >
                <span className="text-gray-400">Revenue</span>
                {renderImpactValue(solution.impacts.revenue)}
              </div>
              <div 
                className="flex items-center justify-between p-2 rounded bg-gray-900/50"
                role="group"
                aria-label="Morale impact"
              >
                <span className="text-gray-400">Morale</span>
                {renderImpactValue(solution.impacts.morale)}
              </div>
              <div 
                className="flex items-center justify-between p-2 rounded bg-gray-900/50"
                role="group"
                aria-label="Efficiency impact"
              >
                <span className="text-gray-400">Efficiency</span>
                {renderImpactValue(solution.impacts.efficiency)}
              </div>
            </div>
            <div 
              className="p-2 rounded bg-gray-900/50"
              aria-label="Solution explanation"
            >
              <p className="text-gray-400 text-xs leading-relaxed">
                {solution.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default SolutionCard;
