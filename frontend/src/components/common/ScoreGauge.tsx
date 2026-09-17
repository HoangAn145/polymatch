import React from 'react';

interface ScoreGaugeProps {
  score: number; // raw score
  maxScore?: number; // default 100, or 695 for large enterprise
  size?: number;
  levelTitle?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, maxScore = 100, size = 180, levelTitle }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(1, Math.max(0, score / maxScore));
  const strokeDashoffset = circumference - ratio * circumference;
  const percentage = Math.round(ratio * 100);

  let color = '#f43f5e'; // rose
  if (percentage > 20) color = '#f59e0b'; // amber
  if (percentage > 40) color = '#2563eb'; // blue
  if (percentage > 60) color = '#0d9488'; // teal
  if (percentage > 80) color = '#6366f1'; // indigo

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center Label */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{score}</span>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">trên {maxScore}</span>
        {maxScore !== 100 && (
          <span className="text-[10px] font-bold text-teal-700 mt-0.5 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
            {percentage}%
          </span>
        )}
      </div>
      {levelTitle && (
        <div className="mt-2 text-xs font-semibold text-slate-600 max-w-[160px] text-center">
          {levelTitle}
        </div>
      )}
    </div>
  );
};
