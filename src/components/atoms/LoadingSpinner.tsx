"use client";

import React from 'react';

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner in pixels
   */
  size?: number;
  /**
   * Optional color class (tailwind)
   */
  color?: string;
  /**
   * Optional text to show next to spinner
   */
  text?: string;
}

/**
 * LoadingSpinner shows an animated loading indicator
 * @example
 * <LoadingSpinner size={24} color="text-blue-500" text="Loading..." />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 20,
  color = "text-white",
  text
}) => {
  return (
    <span className="inline-flex items-center">
      <svg
        className={`animate-spin ${color}`}
        style={{ width: size, height: size }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span className="ml-3" role="status">
          {text}
        </span>
      )}
    </span>
  );
};

export default LoadingSpinner;
