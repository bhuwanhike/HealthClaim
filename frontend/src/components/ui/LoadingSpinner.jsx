import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 ${sizeClasses[size]} ${className}`}></div>
  );
};

export default LoadingSpinner;
