'use client';

import React from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { MasteryHistoryPoint, formatPercentage } from '../../types/skill-mastery.types';

/**
 * Props for ComparisonChart component
 */
interface ComparisonChartProps {
  history: MasteryHistoryPoint[];
  skillName?: string;
  height?: number;
}

/**
 * Comparison chart showing AI mastery vs self-confidence over time
 * Features: dual-line chart with area fills, data points, trend indicators
 */
export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  history,
  skillName,
  height = 300,
}) => {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No historical data available</p>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 800; // Will be responsive via CSS
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max values for scaling
  const allValues = history.flatMap((p) => [p.aiMastery, p.selfConfidence]);
  const minValue = Math.max(0, Math.min(...allValues) - 10);
  const maxValue = Math.min(100, Math.max(...allValues) + 10);

  // Scale functions
  const scaleX = (index: number) => {
    return (index / (history.length - 1)) * chartWidth;
  };

  const scaleY = (value: number) => {
    return chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
  };

  // Generate path for mastery line
  const masteryPath = history
    .map((point, index) => {
      const x = scaleX(index);
      const y = scaleY(point.aiMastery);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Generate area path for mastery (filled)
  const masteryAreaPath =
    masteryPath +
    ` L ${scaleX(history.length - 1)} ${chartHeight} L 0 ${chartHeight} Z`;

  // Generate path for confidence line
  const confidencePath = history
    .map((point, index) => {
      const x = scaleX(index);
      const y = scaleY(point.selfConfidence);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Generate area path for confidence (filled)
  const confidenceAreaPath =
    confidencePath +
    ` L ${scaleX(history.length - 1)} ${chartHeight} L 0 ${chartHeight} Z`;

  // Format date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Calculate trends
  const masteryTrend =
    history[history.length - 1].aiMastery - history[0].aiMastery;
  const confidenceTrend =
    history[history.length - 1].selfConfidence - history[0].selfConfidence;

  return (
    <div className="space-y-4">
      {/* Header with trends */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Progress Over Time</h3>
          {skillName && <p className="text-sm text-slate-400">{skillName}</p>}
        </div>

        <div className="flex items-center gap-4">
          {/* Mastery trend */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-sm text-slate-400">AI Mastery</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp
                className={`w-4 h-4 ${
                  masteryTrend >= 0 ? 'text-green-400' : 'text-red-400 rotate-90'
                }`}
              />
              <span className={masteryTrend >= 0 ? 'text-green-400' : 'text-red-400'}>
                {masteryTrend > 0 ? '+' : ''}{Math.round(masteryTrend)}%
              </span>
            </div>
          </div>

          {/* Confidence trend */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-sm text-slate-400">Self-Confidence</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp
                className={`w-4 h-4 ${
                  confidenceTrend >= 0 ? 'text-green-400' : 'text-red-400 rotate-90'
                }`}
              />
              <span className={confidenceTrend >= 0 ? 'text-green-400' : 'text-red-400'}>
                {confidenceTrend > 0 ? '+' : ''}{Math.round(confidenceTrend)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth + padding.left + padding.right} ${height}`}
          className="w-full"
          style={{ minWidth: '600px' }}
        >
          {/* Grid lines */}
          <g>
            {[0, 25, 50, 75, 100].map((value) => {
              const y = scaleY(value);
              if (value < minValue || value > maxValue) return null;
              return (
                <g key={value}>
                  <line
                    x1={padding.left}
                    y1={padding.top + y}
                    x2={chartWidth + padding.left}
                    y2={padding.top + y}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padding.left - 10}
                    y={padding.top + y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-xs fill-slate-400"
                  >
                    {value}%
                  </text>
                </g>
              );
            })}
          </g>

          {/* Chart area */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Mastery area fill */}
            <path
              d={masteryAreaPath}
              fill="url(#masteryGradient)"
              opacity="0.2"
            />

            {/* Confidence area fill */}
            <path
              d={confidenceAreaPath}
              fill="url(#confidenceGradient)"
              opacity="0.2"
            />

            {/* Mastery line */}
            <path
              d={masteryPath}
              fill="none"
              stroke="#6366F1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Confidence line */}
            <path
              d={confidencePath}
              fill="none"
              stroke="#22D3EE"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 4"
            />

            {/* Data points - Mastery */}
            {history.map((point, index) => (
              <g key={`mastery-${index}`}>
                <circle
                  cx={scaleX(index)}
                  cy={scaleY(point.aiMastery)}
                  r="5"
                  fill="#6366F1"
                  stroke="#0F172A"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-7 transition-all"
                >
                  <title>{`${formatDate(point.date)}: ${formatPercentage(
                    point.aiMastery
                  )}`}</title>
                </circle>
              </g>
            ))}

            {/* Data points - Confidence */}
            {history.map((point, index) => (
              <g key={`confidence-${index}`}>
                <circle
                  cx={scaleX(index)}
                  cy={scaleY(point.selfConfidence)}
                  r="5"
                  fill="#22D3EE"
                  stroke="#0F172A"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-7 transition-all"
                >
                  <title>{`${formatDate(point.date)}: ${formatPercentage(
                    point.selfConfidence
                  )}`}</title>
                </circle>
              </g>
            ))}
          </g>

          {/* X-axis labels (dates) */}
          <g>
            {history.map((point, index) => (
              <text
                key={index}
                x={padding.left + scaleX(index)}
                y={height - padding.bottom + 25}
                textAnchor="middle"
                className="text-xs fill-slate-400"
              >
                {formatDate(point.date)}
              </text>
            ))}
          </g>

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="masteryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-indigo-500" />
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
          </div>
          <span className="text-slate-400">AI-Evaluated Mastery</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-cyan-500 border-t-2 border-dashed" />
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
          </div>
          <span className="text-slate-400">Self-Assessed Confidence</span>
        </div>
      </div>
    </div>
  );
};
