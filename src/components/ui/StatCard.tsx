import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  actionText?: string;
  onAction?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  className = '',
  actionText,
  onAction
}) => {
  return (
    <div className={`bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1769AA] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
        {change && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              changeType === 'positive'
                ? 'text-emerald-700 bg-emerald-50'
                : changeType === 'negative'
                ? 'text-rose-700 bg-rose-50'
                : 'text-slate-600 bg-slate-100'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {description && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{description}</p>}

      {actionText && onAction && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={onAction}
            className="text-xs font-medium text-[#1769AA] hover:text-[#104D80] flex items-center gap-1 cursor-pointer transition-colors"
          >
            {actionText} &rarr;
          </button>
        </div>
      )}
    </div>
  );
};
