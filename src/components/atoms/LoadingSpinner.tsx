import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`
        ${sizeMap[size]}
        border-4 border-blue-200 border-t-blue-600
        rounded-full animate-spin
        ${className}
      `.trim()}
      role="status"
      aria-label="Loading"
    />
  );
}
