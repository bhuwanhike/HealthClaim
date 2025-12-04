import React from 'react';
import { getStatusColor, getStatusLabel } from '../../utils/helpers';

const Badge = ({ status, size = 'md', className = '' }) => {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);
  
  const colorClasses = {
    gray: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-success-100 text-success-700',
    red: 'bg-danger-100 text-danger-700',
    purple: 'bg-secondary-100 text-secondary-700',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClasses[color]} ${sizeClasses[size]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-current`}></span>
      {label}
    </span>
  );
};

export default Badge;
