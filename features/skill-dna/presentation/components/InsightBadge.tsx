'use client';

import React from 'react';
import { Sparkles, Brain, Zap } from 'lucide-react';
import type { InsightBadgeProps } from '../../types/skill-dna.types';
import { InsightType } from '../../types/skill-dna.types';

export function InsightBadge({
  insight,
  size = 'medium',
  animated = true,
  onClick,
}: InsightBadgeProps) {
  // Size configurations
  const sizeConfig = {
    small: {
      padding: 'px-3 py-2',
      icon: 'w-4 h-4',
      text: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5',
    },
    medium: {
      padding: 'px-4 py-3',
      icon: 'w-5 h-5',
      text: 'text-sm',
      badge: 'text-xs px-2 py-1',
    },
    large: {
      padding: 'px-6 py-4',
      icon: 'w-6 h-6',
      text: 'text-base',
      badge: 'text-sm px-3 py-1',
    },
  };

  const config = sizeConfig[size];

  // Icon based on insight type
  const getTypeIcon = () => {
    switch (insight.type) {
      case InsightType.SPECIALIST:
        return <Zap className={config.icon} />;
      case InsightType.GENERALIST:
        return <Sparkles className={config.icon} />;
      case InsightType.T_SHAPED:
        return <Brain className={config.icon} />;
      case InsightType.POLYMATH:
        return <Sparkles className={config.icon} />;
      case InsightType.EMERGING:
        return <Zap className={config.icon} />;
      default:
        return <Sparkles className={config.icon} />;
    }
  };

  // Color scheme based on confidence
  const getColorScheme = () => {
    if (insight.confidence >= 85) {
      return {
        bg: 'from-[#10B981]/20 to-[#10B981]/10',
        border: 'border-[#10B981]/30',
        text: 'text-[#10B981]',
        icon: 'text-[#10B981]',
        glow: 'shadow-[#10B981]/20',
      };
    } else if (insight.confidence >= 70) {
      return {
        bg: 'from-[#22D3EE]/20 to-[#22D3EE]/10',
        border: 'border-[#22D3EE]/30',
        text: 'text-[#22D3EE]',
        icon: 'text-[#22D3EE]',
        glow: 'shadow-[#22D3EE]/20',
      };
    } else {
      return {
        bg: 'from-[#6366F1]/20 to-[#6366F1]/10',
        border: 'border-[#6366F1]/30',
        text: 'text-[#6366F1]',
        icon: 'text-[#6366F1]',
        glow: 'shadow-[#6366F1]/20',
      };
    }
  };

  const colors = getColorScheme();

  return (
    <div
      className={`
        relative group bg-gradient-to-br ${colors.bg} border ${colors.border}
        rounded-2xl ${config.padding} backdrop-blur-sm
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${animated ? 'animate-insight-pulse' : ''}
        transition-all duration-300
        shadow-lg ${colors.glow}
      `}
      onClick={onClick}
    >
      {/* Main content */}
      <div className="flex items-center gap-3">
        {/* Icon with glow */}
        <div className={`relative ${colors.icon} ${animated ? 'animate-dna-glow' : ''}`}>
          {getTypeIcon()}
          {/* Glow effect */}
          <div className={`absolute inset-0 blur-lg ${colors.icon} opacity-50`}>
            {getTypeIcon()}
          </div>
        </div>

        {/* Title and confidence */}
        <div className="flex-1">
          <div className={`font-bold ${config.text} ${colors.text} mb-0.5`}>
            {insight.title}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-[#94A3B8] font-medium">
              {insight.confidence}% confidence
            </div>
          </div>
        </div>

        {/* Emoji icon */}
        <div className="text-2xl">{insight.icon}</div>
      </div>

      {/* Badges */}
      {insight.badges.length > 0 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {insight.badges.map((badge, index) => (
            <div
              key={index}
              className={`
                ${config.badge} rounded-full font-semibold
                bg-gradient-to-r from-[#6366F1]/20 to-[#A855F7]/20
                border border-[#6366F1]/30 text-[#22D3EE]
                ${animated ? 'animate-badge-shimmer' : ''}
              `}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {badge}
            </div>
          ))}
        </div>
      )}

      {/* Description (for larger size) */}
      {size === 'large' && (
        <div className="mt-3 text-sm text-[#CBD5E1] leading-relaxed">
          {insight.description}
        </div>
      )}

      {/* Hover glow effect */}
      <div className={`
        absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.bg}
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        pointer-events-none blur-xl
      `} />
    </div>
  );
}
