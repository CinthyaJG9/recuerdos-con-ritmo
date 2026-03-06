import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'large' | 'medium';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'large',
  className = '',
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseStyles = 'rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl';
  
  const variantStyles = {
    primary: 'bg-coral text-white hover:bg-coral-dark',
    secondary: 'bg-lavender text-white hover:bg-lavender-dark',
    outline: 'bg-transparent border-3 border-coral text-coral hover:bg-coral hover:text-white shadow-md hover:shadow-lg'
  };
  
  const sizeStyles = {
    large: 'px-10 py-5 min-h-[70px] text-[22px]',
    medium: 'px-8 py-4 min-h-[60px] text-[20px]'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
}
