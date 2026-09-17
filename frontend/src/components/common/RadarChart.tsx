import React from 'react';
import { PillarId } from '../../types';
import { DBI_PILLARS } from '../../data/mockData';

interface RadarChartProps {
  userScores: Record<PillarId, number>; // 0 - 100
  industryScores: Record<PillarId, number>; // 0 - 100
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ 
  userScores, 
  industryScores,
  size = 380 
}) => {
  const center = size / 2;
  const radius = size * 0.36;
  const numAxes = DBI_PILLARS.length;
  const angleStep = (2 * Math.PI) / numAxes;

  // Concentric levels (20%, 40%, 60%, 80%, 100%)
  const levels = [20, 40, 60, 80, 100];

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points
  const userPolygonPoints = DBI_PILLARS.map((p, i) => {
    const score = userScores[p.id] ?? 0;
    const { x, y } = getCoordinates(score, i);
    return `${x},${y}`;
  }).join(' ');

  const industryPolygonPoints = DBI_PILLARS.map((p, i) => {
    const score = industryScores[p.id] ?? 40;
    const { x, y } = getCoordinates(score, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid: Concentric Web Polygons */}
        {levels.map((lvl) => {
          const points = DBI_PILLARS.map((_, i) => {
            const { x, y } = getCoordinates(lvl, i);
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={lvl}>
              <polygon
                points={points}
                fill={lvl === 100 ? '#f8fafc' : 'none'}
                stroke="#e2e8f0"
                strokeWidth={lvl === 100 ? '1.5' : '1'}
                strokeDasharray={lvl < 100 ? '2 2' : 'none'}
              />
              <text
                x={center + 6}
                y={center - (lvl / 100) * radius + 4}
                fill="#94a3b8"
                fontSize="10"
                fontWeight="500"
              >
                {lvl}
              </text>
            </g>
          );
        })}

        {/* Axis Spokes from center */}
        {DBI_PILLARS.map((_, i) => {
          const { x, y } = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Industry Average Polygon */}
        <polygon
          points={industryPolygonPoints}
          fill="rgba(148, 163, 184, 0.2)"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* User Enterprise Polygon */}
        <polygon
          points={userPolygonPoints}
          fill="rgba(13, 148, 136, 0.3)"
          stroke="#0d9488"
          strokeWidth="2.5"
        />

        {/* User Data Points */}
        {DBI_PILLARS.map((p, i) => {
          const score = userScores[p.id] ?? 0;
          const { x, y } = getCoordinates(score, i);
          return (
            <g key={p.id}>
              <circle
                cx={x}
                cy={y}
                r="4.5"
                fill="#0d9488"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Axis Labels */}
        {DBI_PILLARS.map((p, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 28;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const score = userScores[p.id] ?? 0;

          let textAnchor = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          if (Math.cos(angle) < -0.3) textAnchor = 'end';

          return (
            <g key={`lbl-${p.id}`} className="transition-all">
              <text
                x={lx}
                y={ly - 6}
                textAnchor={textAnchor}
                fill="#1e293b"
                fontSize="11.5"
                fontWeight="700"
              >
                {p.shortName}
              </text>
              <text
                x={lx}
                y={ly + 10}
                textAnchor={textAnchor}
                fill="#0d9488"
                fontSize="12"
                fontWeight="800"
              >
                {score}/100
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-teal-600 inline-block border border-teal-700"></span>
          <span className="text-slate-700">Doanh nghiệp của bạn</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 border-t-2 border-dashed border-slate-400 inline-block"></span>
          <span className="text-slate-500">Trung bình ngành cùng quy mô</span>
        </div>
      </div>
    </div>
  );
};
