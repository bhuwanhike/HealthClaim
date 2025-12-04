import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'bg-gradient-to-r from-success-600 to-success-500 hover:from-success-700 hover:to-success-600 text-white shadow-md hover:shadow-lg',
    danger: 'bg-gradient-to-r from-danger-600 to-danger-500 hover:from-danger-700 hover:to-danger-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;
