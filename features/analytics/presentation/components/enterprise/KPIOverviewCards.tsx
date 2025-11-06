'use client';

/**
 * KPI Overview Cards Component
 * 
 * Large overview cards displaying key performance indicators
 * Includes engagement, retention, skill gaps, and learning hours
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  KPIMetric,
  TrendDirection,
  formatPercentage,
  formatNumber,
  formatHours,
  getTrendColorClass,
} from '../../../types/enterprise-analytics.types';

interface KPIOverviewCardsProps {
  kpis: KPIMetric[];
}

export const KPIOverviewCards: React.FC<KPIOverviewCardsProps> = ({ kpis }) => {
  /**
   * Get trend icon component
   */
  const getTrendIcon = (trend: TrendDirection) => {
    const iconClass = "w-5 h-5";
    if (trend === TrendDirection.Up) {
      return <TrendingUp className={iconClass} />;
    }
    if (trend === TrendDirection.Down) {
      return <TrendingDown className={iconClass} />;
    }
    return <Minus className={iconClass} />;
  };

  /**
   * Format KPI value based on unit
   */
  const formatKPIValue = (value: number, unit: string): string => {
    if (unit === '%') {
      return value.toFixed(1);
    }
    if (unit === 'hrs') {
      return formatNumber(value);
    }
    if (unit === 'gaps') {
      return value.toString();
    }
    return value.toString();
  };

  /**
   * Get background gradient based on KPI color
   */
  const getBackgroundGradient = (color: string): string => {
    return `radial-gradient(circle at top right, ${color}15, transparent 70%)`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          className="relative bg-card backdrop-blur-sm rounded-2xl border border-border p-6 hover:border-accent transition-all duration-300 group overflow-hidden"
        >
          {/* Background gradient glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: getBackgroundGradient(kpi.color) }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header with icon */}
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: `${kpi.color}20`,
                  border: `1px solid ${kpi.color}40`,
                }}
              >
                {kpi.icon}
              </div>
              
              {/* Trend indicator */}
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                  kpi.trend === TrendDirection.Up
                    ? 'bg-success/10 text-success'
                    : kpi.trend === TrendDirection.Down
                    ? 'bg-danger/10 text-danger'
                    : 'bg-muted/10 text-muted-foreground'
                }`}
              >
                {getTrendIcon(kpi.trend)}
                <span className="text-xs font-semibold">
                  {Math.abs(kpi.changePercentage).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* KPI Label */}
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {kpi.label}
            </h3>

            {/* KPI Value */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-foreground">
                {formatKPIValue(kpi.value, kpi.unit)}
              </span>
              <span
                className="text-lg font-semibold"
                style={{ color: kpi.color }}
              >
                {kpi.unit}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {kpi.description}
            </p>

            {/* Previous value comparison */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Previous Period:
                </span>
                <span className="font-medium text-foreground/80">
                  {formatKPIValue(kpi.previousValue, kpi.unit)} {kpi.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Hover effect border glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `0 0 20px ${kpi.color}30`,
            }}
          />
        </div>
      ))}
    </div>
  );
};
