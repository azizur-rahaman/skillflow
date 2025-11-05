'use client';

/**
 * ProgressRing Component
 * Circular progress indicator showing lesson completion
 */

import React from 'react';
import { Check } from 'lucide-react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  showCheckmark?: boolean;
  color?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  showCheckmark = true,
  color = '#6366F1',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const isComplete = progress === 100;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#334155"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isComplete ? '#10B981' : color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: isComplete 
              ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))'
              : `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isComplete && showCheckmark ? (
          <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center animate-scale-in">
            <Check className="w-7 h-7 text-white" strokeWidth={3} />
          </div>
        ) : showLabel ? (
          <>
            <span className="text-2xl font-bold text-[#F8FAFC]">
              {Math.round(progress)}%
            </span>
            <span className="text-xs text-[#94A3B8] mt-1">Complete</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
