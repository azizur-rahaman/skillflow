'use client';

import React from 'react';
import type { ConfidenceMeterProps } from '../../types/skill-extraction.types';
import { ConfidenceLevel } from '../../types/skill-extraction.types';

export function ConfidenceMeter({
  confidence,
  size = 'medium',
  showLabel = true,
  animated = true,
}: ConfidenceMeterProps) {
  // Determine confidence level
  const getConfidenceLevel = (value: number): ConfidenceLevel => {
    if (value >= 95) return ConfidenceLevel.VERY_HIGH;
    if (value >= 80) return ConfidenceLevel.HIGH;
    if (value >= 60) return ConfidenceLevel.MEDIUM;
    return ConfidenceLevel.LOW;
  };

  const confidenceLevel = getConfidenceLevel(confidence);

  // Size configurations
  const sizeConfig = {
    small: { width: 40, strokeWidth: 4, fontSize: '10px', labelSize: 'text-xs' },
    medium: { width: 56, strokeWidth: 5, fontSize: '13px', labelSize: 'text-sm' },
    large: { width: 80, strokeWidth: 6, fontSize: '16px', labelSize: 'text-base' },
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  // Color based on confidence level
  const getColor = () => {
    switch (confidenceLevel) {
      case ConfidenceLevel.VERY_HIGH:
        return '#10B981'; // Green (success)
      case ConfidenceLevel.HIGH:
        return '#22D3EE'; // Cyan (highlight)
      case ConfidenceLevel.MEDIUM:
        return '#F59E0B'; // Amber (warning)
      case ConfidenceLevel.LOW:
        return '#EF4444'; // Red (danger)
    }
  };

  const color = getColor();

  // Gradient ID
  const gradientId = `confidence-gradient-${confidence}-${size}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth={config.strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={config.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={animated ? 'animate-confidence-fill transition-all duration-1000' : ''}
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>

        {/* Percentage text */}
        <div
          className="absolute inset-0 flex items-center justify-center font-semibold"
          style={{
            fontSize: config.fontSize,
            color: color,
          }}
        >
          {confidence}%
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <span
          className={`${config.labelSize} font-medium capitalize`}
          style={{ color: color }}
        >
          {confidenceLevel.replace('_', ' ')}
        </span>
      )}
    </div>
  );
}
