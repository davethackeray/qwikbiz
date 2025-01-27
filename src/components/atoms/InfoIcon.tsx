import React from 'react';

export interface InfoIconProps {
  size?: number;
  color?: string;
  tooltip?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * InfoIcon is an atomic component that displays an information icon
 * with optional tooltip and accessibility features
 */
export const InfoIcon: React.FC<InfoIconProps> = ({
  size = 16,
  color = 'currentColor',
  tooltip,
  className = '',
  'aria-label': ariaLabel = 'Information',
}) => {
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      title={tooltip}
      role="img"
      aria-label={ariaLabel}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors duration-200"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </div>
  );
};

export default InfoIcon;
