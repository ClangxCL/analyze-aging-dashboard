import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon,
  className = ''
}) => {
  return (
    <div
      className={`bg-white rounded-[20px] p-6 border border-[#d4e0ed] card-elevation transition-all hover:translate-y-[-2px] ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-sm font-medium text-[#476788]">{title}</span>
        {icon && <div className="text-[#006bff] p-2 bg-[#f0f3f8] rounded-xl">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <h3 className="text-3xl font-bold tracking-tight text-[#0b3558]">{value}</h3>
      </div>
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0f3f8]">
        {subtitle && <p className="text-xs text-[#476788]">{subtitle}</p>}
        {badge && <div>{badge}</div>}
      </div>
    </div>
  );
};
