import React from 'react';

const Card = ({ children, className = '', variant = 'default', hover = false }) => {
  const variantClasses = {
    default: 'bg-white shadow-card',
    gradient: 'card-gradient shadow-card',
    glass: 'glass-effect',
  };

  const hoverClass = hover ? 'hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-300 cursor-pointer' : '';

  return (
    <div className={`rounded-xl p-6 ${variantClasses[variant]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
