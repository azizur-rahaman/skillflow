'use client';

import React from 'react';
import { Brain } from 'lucide-react';
import { getMasteryLevelColor, formatPercentage } from '../../types/skill-mastery.types';

/**
 * Props for MasteryGauge component
 */
interface MasteryGaugeProps {
  score: number; // 0-100
  label?: string;
  size?: number; // Diameter in pixels
  strokeWidth?: number;
  showLabel?: boolean;
  animated?: boolean;
}

/**
 * Circular gauge for AI-evaluated mastery score
 * Features: animated progress, gradient fills, mastery level color coding
 */
export const MasteryGauge: React.FC<MasteryGaugeProps> = ({
  score,
  label = 'AI Mastery',
  size = 200,
  strokeWidth = 16,
  showLabel = true,
  animated = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  // Determine color based on mastery level
  const getColor = (): string => {
    if (score >= 80) return '#A855F7'; // Expert - Purple
    if (score >= 60) return '#6366F1'; // Advanced - Indigo
    if (score >= 40) return '#22D3EE'; // Intermediate - Cyan
    return '#94A3B8'; // Beginner - Slate
  };

  const color = getColor();

  // Gradient ID for unique SVG gradients
  const gradientId = `mastery-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular SVG gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Define gradient */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
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

          {/* Progress circle */}
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
              filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* AI Icon */}
          <Brain className="w-8 h-8 mb-2" style={{ color }} />

          {/* Score */}
          <div className="text-4xl font-bold" style={{ color }}>
            {formatPercentage(score)}
          </div>

          {/* Label */}
          {showLabel && <div className="text-sm text-slate-400 mt-1">{label}</div>}
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-2xl"
          style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Mastery level badge */}
      <div
        className="px-4 py-1.5 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${color}20`,
          color: color,
          border: `1px solid ${color}40`,
        }}
      >
        {score >= 80 && 'Expert'}
        {score >= 60 && score < 80 && 'Advanced'}
        {score >= 40 && score < 60 && 'Intermediate'}
        {score < 40 && 'Beginner'}
      </div>
    </div>
  );
};
