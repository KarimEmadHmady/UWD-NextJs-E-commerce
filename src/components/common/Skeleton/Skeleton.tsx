import React from 'react';
import clsx from 'clsx';

/**
 * Skeleton component - Displays a placeholder skeleton for loading states.
 * Supports rectangular and circular shapes with customizable size and style.
 *
 * Props:
 * - width: CSS width (e.g., '100%', '200px')
 * - height: CSS height (e.g., '20px', '3rem')
 * - borderRadius: CSS border-radius (e.g., '8px', '50%')
 * - className: Additional class names
 */
const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}> = ({ width = '100%', height = '1.5rem', borderRadius = '8px', className }) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        className
      )}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export default Skeleton; 