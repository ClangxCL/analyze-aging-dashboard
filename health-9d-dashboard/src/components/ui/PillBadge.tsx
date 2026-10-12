import React from 'react';

interface PillBadgeProps {
  children: React.ReactNode;
  variant?: 'pebble' | 'signal' | 'dark' | 'success' | 'warning';
  className?: string;
}

export const PillBadge: React.FC<PillBadgeProps> = ({
  children,
  variant = 'pebble',
  className = ''
}) => {
  const variantStyles = {
    pebble: 'bg-[#f0f3f8] text-[#004eba] border border-[#d4e0ed]',
    signal: 'bg-[#e6f0ff] text-[#006bff] border border-[#b8d7ff]',
    dark: 'bg-[#0b3558] text-[#ffffff]',
    success: 'bg-[#e8f7ee] text-[#1b7a42] border border-[#c3edd3]',
    warning: 'bg-[#fff5e6] text-[#b86200] border border-[#ffe0b2]'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
