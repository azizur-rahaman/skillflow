'use client';

import React from 'react';
import { User } from 'lucide-react';
import { formatPercentage } from '../../types/skill-mastery.types';

/**
 * Props for ConfidenceGauge component
 */
interface ConfidenceGaugeProps {
  score: number; // 0-100
  label?: string;
  size?: number; // Diameter in pixels
  strokeWidth?: number;
  showLabel?: boolean;
  animated?: boolean;
}

/**
 * Circular gauge for self-assessed confidence score
 * Features: different visual style from mastery gauge, warm color palette
 */
export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  score,
  label = 'Self-Confidence',
  size = 200,
  strokeWidth = 16,
  showLabel = true,
  animated = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  // Warm color palette for confidence
  const getColor = (): string => {
    if (score >= 80) return '#10B981'; // Very confident - Green
    if (score >= 60) return '#22D3EE'; // Confident - Cyan
    if (score >= 40) return '#F59E0B'; // Somewhat confident - Orange
    return '#94A3B8'; // Not confident - Slate
  };

  const color = getColor();

  // Gradient ID for unique SVG gradients
  const gradientId = `confidence-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular SVG gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Define gradient */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>

            {/* Dotted pattern for distinction */}
            <pattern
              id="confidence-dots"
              x="0"
              y="0"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="4" cy="4" r="1" fill={color} opacity="0.3" />
            </pattern>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1E293B"
            strokeWidth={strokeWidth}
          />

          {/* Inner decorative ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth / 2}
            fill="none"
            stroke="url(#confidence-dots)"
            strokeWidth={1}
          />

          {/* Progress circle with dashed style */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={animated ? 'transition-all duration-1000 ease-out' : ''}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.3))',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* User Icon */}
          <User className="w-8 h-8 mb-2" style={{ color }} />

          {/* Score */}
          <div className="text-4xl font-bold" style={{ color }}>
            {formatPercentage(score)}
          </div>

          {/* Label */}
          {showLabel && <div className="text-sm text-slate-400 mt-1">{label}</div>}
        </div>

        {/* Softer glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-10 blur-xl"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Confidence level badge */}
      <div
        className="px-4 py-1.5 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${color}15`,
          color: color,
          border: `1px solid ${color}30`,
        }}
      >
        {score >= 80 && 'Very Confident'}
        {score >= 60 && score < 80 && 'Confident'}
        {score >= 40 && score < 60 && 'Somewhat Confident'}
        {score < 40 && 'Not Confident'}
      </div>
    </div>
  );
};
