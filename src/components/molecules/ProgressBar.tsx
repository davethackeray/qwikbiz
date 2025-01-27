"use client";

import React from 'react';

export interface ProgressBarProps {
  /**
   * Current progress value (0-100)
   */
  value: number;
  /**
   * Optional CSS class for the progress bar color
   */
  color?: string;
  /**
   * Optional size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Optional animation duration in milliseconds
   */
  animationDuration?: number;
}

/**
 * ProgressBar component displays a progress indicator
 * @example
 * <ProgressBar
 *   value={75}
 *   color="bg-blue-500"
 *   size="medium"
 * />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color,
  size = 'medium',
  animationDuration = 500,
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3',
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} bg-gray-700 rounded-full overflow-hidden`}
      role="progressbar"
      aria-valuenow={normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`absolute h-full rounded-full transition-all ${color}`}
        style={{
          width: `${normalizedValue}%`,
          opacity: 0.8,
          transitionDuration: `${animationDuration}ms`,
        }}
      />
    </div>
  );
};

export default ProgressBar;
