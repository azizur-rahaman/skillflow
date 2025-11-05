'use client';

/**
 * PathNode Component
 * Individual milestone node in the learning journey flow
 * Features: Color-coded status, animations, icons, progress indicator
 */

import React from 'react';
import {
  CheckCircle2,
  Circle,
  Lock,
  Play,
  Award,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Milestone, CompletionStatus, getStatusColor, getDifficultyColor } from '../../types/learning-path.types';

interface PathNodeProps {
  milestone: Milestone;
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
}

export function PathNode({ milestone, isActive, isLast, onClick }: PathNodeProps) {
  const statusColor = getStatusColor(milestone.status);
  const difficultyColor = getDifficultyColor(milestone.difficulty);

  const getIcon = () => {
    switch (milestone.status) {
      case CompletionStatus.COMPLETED:
        return <CheckCircle2 className="w-6 h-6" />;
      case CompletionStatus.IN_PROGRESS:
        return <Play className="w-6 h-6" />;
      case CompletionStatus.LOCKED:
        return <Lock className="w-5 h-5" />;
      default:
        return <Circle className="w-6 h-6" />;
    }
  };

  const getNodeClasses = () => {
    const base = 'relative transition-all duration-300 cursor-pointer';
    
    if (milestone.status === CompletionStatus.LOCKED) {
      return `${base} opacity-40 cursor-not-allowed`;
    }
    
    if (isActive) {
      return `${base} scale-110`;
    }
    
    return `${base} hover:scale-105`;
  };

  const getGlowEffect = () => {
    if (milestone.status === CompletionStatus.LOCKED) return '';
    if (isActive) return 'animate-pulse-glow';
    return '';
  };

  return (
    <div className="flex items-center">
      {/* Node Container */}
      <div className={getNodeClasses()} onClick={milestone.status !== CompletionStatus.LOCKED ? onClick : undefined}>
        {/* Glow Effect */}
        <div
          className={`absolute inset-0 rounded-full blur-xl opacity-30 ${getGlowEffect()}`}
          style={{ backgroundColor: statusColor }}
        />

        {/* Main Node Circle */}
        <div
          className="relative w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300"
          style={{
            borderColor: statusColor,
            background: milestone.status === CompletionStatus.COMPLETED
              ? `linear-gradient(135deg, ${statusColor}40, ${statusColor}20)`
              : milestone.status === CompletionStatus.IN_PROGRESS
              ? `linear-gradient(135deg, ${statusColor}60, ${statusColor}30)`
              : '#1E293B',
          }}
        >
          {/* Icon */}
          <div style={{ color: statusColor }}>
            {getIcon()}
          </div>

          {/* Progress Ring for In Progress */}
          {milestone.status === CompletionStatus.IN_PROGRESS && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke={`${statusColor}40`}
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke={statusColor}
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - milestone.progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
          )}

          {/* Completion Badge */}
          {milestone.status === CompletionStatus.COMPLETED && milestone.certificate?.issued && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#EF4444] flex items-center justify-center shadow-lg">
              <Award className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Label Below Node */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-32 text-center">
          <div className="text-sm font-semibold text-[#F8FAFC] mb-1 line-clamp-2">
            {milestone.title}
          </div>
          
          {/* Progress Percentage */}
          {milestone.status !== CompletionStatus.LOCKED && (
            <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
              <span>{milestone.progress}%</span>
              {milestone.status === CompletionStatus.IN_PROGRESS && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{milestone.estimatedDuration}h</span>
                </div>
              )}
            </div>
          )}

          {/* Difficulty Badge */}
          <div className="mt-2 flex justify-center">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${difficultyColor}20`,
                color: difficultyColor,
              }}
            >
              {milestone.difficulty.toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Connecting Line to Next Node */}
      {!isLast && (
        <div className="relative mx-4">
          {/* Background Line */}
          <div className="h-1 w-24 bg-[#334155] rounded-full" />
          
          {/* Progress Line */}
          {milestone.status === CompletionStatus.COMPLETED && (
            <div
              className="absolute top-0 left-0 h-1 w-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${statusColor}, ${statusColor}60)`,
              }}
            />
          )}

          {/* Animated Flow Dots */}
          {milestone.status === CompletionStatus.COMPLETED && (
            <>
              <div
                className="absolute top-1/2 left-0 w-2 h-2 rounded-full -translate-y-1/2 animate-flow-dot"
                style={{ backgroundColor: statusColor }}
              />
              <div
                className="absolute top-1/2 left-0 w-2 h-2 rounded-full -translate-y-1/2 animate-flow-dot"
                style={{
                  backgroundColor: statusColor,
                  animationDelay: '0.5s',
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
