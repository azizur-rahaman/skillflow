/**
 * KPI Widget Component
 * 
 * Displays key performance indicators with trend visualization.
 * Shows growth metrics, learning progress, and engagement scores.
 */

'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { TrendDirection } from '../../types/dashboard.types';
import type { KPIMetric } from '../../types/dashboard.types';

interface KPIWidgetProps {
  metric: KPIMetric;
  size?: 'small' | 'medium' | 'large';
  showTrend?: boolean;
  animated?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  TrendingDown,
  Minus,
};

export function KPIWidget({ 
  metric, 
  size = 'medium', 
  showTrend = true,
  animated = true 
}: KPIWidgetProps) {
  const Icon = iconMap[metric.icon] || TrendingUp;
  
  const getTrendIcon = () => {
    switch (metric.trend) {
      case TrendDirection.UP:
        return <TrendingUp className="w-4 h-4" />;
      case TrendDirection.DOWN:
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = () => {
    switch (metric.trend) {
      case TrendDirection.UP:
        return 'text-[#10B981]';
      case TrendDirection.DOWN:
        return 'text-[#EF4444]';
      default:
        return 'text-[#94A3B8]';
    }
  };

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  const valueSizes = {
    small: 'text-2xl',
    medium: 'text-3xl',
    large: 'text-4xl',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-2xl
        bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50
        border border-white/10
        backdrop-blur-sm
        hover:border-white/20
        transition-all duration-300
        group
        relative
        overflow-hidden
        ${animated ? 'animate-fade-in' : ''}
      `}
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${metric.color}20, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Label */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${metric.color}40, ${metric.color}20)`,
            }}
          >
            <Icon 
              className="w-6 h-6"
              style={{ color: metric.color }}
            />
          </div>

          {showTrend && (
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-semibold">
                {metric.changePercentage > 0 ? '+' : ''}
                {metric.changePercentage}%
              </span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className={`${valueSizes[size]} font-bold text-[#F8FAFC]`}>
              {metric.value}
            </span>
            <span className="text-lg text-[#94A3B8]">
              {metric.unit}
            </span>
          </div>
        </div>

        {/* Label */}
        <div className="text-sm font-medium text-[#CBD5E1] mb-1">
          {metric.label}
        </div>

        {/* Description */}
        {size !== 'small' && (
          <div className="text-xs text-[#64748B]">
            {metric.description}
          </div>
        )}

        {/* Progress bar (for percentage metrics) */}
        {metric.unit === '%' && size !== 'small' && (
          <div className="mt-4">
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${metric.value}%`,
                  background: `linear-gradient(90deg, ${metric.color}, ${metric.color}80)`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Shimmer effect */}
      {animated && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      )}
    </div>
  );
}

/**
 * KPI Grid Component
 * Displays multiple KPI widgets in a responsive grid
 */
interface KPIGridProps {
  metrics: KPIMetric[];
  columns?: 2 | 3 | 4;
  size?: 'small' | 'medium' | 'large';
}

export function KPIGrid({ metrics, columns = 4, size = 'medium' }: KPIGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {metrics.map((metric, index) => (
        <div
          key={metric.id}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <KPIWidget metric={metric} size={size} />
        </div>
      ))}
    </div>
  );
}
