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
  const baseStyles = 'rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-wine text-warm-white hover:bg-wine-dark shadow-md',
    secondary: 'bg-deep-blue text-warm-white hover:bg-deep-blue-dark shadow-md',
    outline: 'bg-transparent border-2 border-wine text-wine hover:bg-wine hover:text-warm-white'
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
