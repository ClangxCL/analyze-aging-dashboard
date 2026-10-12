import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#006bff]/30 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeStyles = {
    sm: 'text-sm px-3.5 py-1.5 gap-1.5',
    md: 'text-[16px] px-5 py-2.5 gap-2',
    lg: 'text-[18px] px-6 py-3 gap-2.5'
  };

  const variantStyles = {
    primary: 'bg-[#006bff] text-white hover:bg-[#005ad4] active:bg-[#004eba] button-elevation',
    dark: 'bg-[#0b3558] text-white hover:bg-[#092945] active:bg-[#061e32] button-elevation',
    outline: 'border border-[#d4e0ed] bg-white text-[#0b3558] hover:bg-[#f0f3f8] active:bg-[#e4ebf5]',
    ghost: 'text-[#0b3558] hover:bg-[#f0f3f8] active:bg-[#e4ebf5]'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
