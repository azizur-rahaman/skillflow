/**
 * KPI Tiles Component
 * 
 * Animated metric cards with trend indicators and micro-icons
 */

'use client';

import { KPIMetric, getKPIColor, getTrendColor, getTrendIcon } from '../../types/analytics.types';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Users,
  CheckCircle,
  Zap,
  Coins,
  BarChart3,
  Target,
  Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface KPITilesProps {
  metrics: KPIMetric[];
  onMetricClick?: (metric: KPIMetric) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Users,
  CheckCircle,
  Zap,
  Coins,
  BarChart3,
  Target,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Activity;
};

export const KPITiles = ({ metrics, onMetricClick }: KPITilesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <KPITile 
          key={metric.id} 
          metric={metric} 
          index={index}
          onClick={() => onMetricClick?.(metric)}
        />
      ))}
    </div>
  );
};

interface KPITileProps {
  metric: KPIMetric;
  index: number;
  onClick?: () => void;
}

const KPITile = ({ metric, index, onClick }: KPITileProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const colors = getKPIColor(metric.color);
  const Icon = getIcon(metric.icon);
  const TrendIcon = metric.trend ? getIcon(getTrendIcon(metric.trend.direction)) : null;
  
  // Stagger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);
  
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-slate-900/50 to-slate-800/30
        border border-slate-700
        rounded-2xl p-6
        hover:scale-[1.02] hover:border-indigo-500/50
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${colors.glow} shadow-lg
      `}
      style={{
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Background gradient glow */}
      <div className={`absolute inset-0 ${colors.bg} opacity-10 blur-xl`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${colors.bg} rounded-xl ${colors.glow} shadow-lg`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          
          {metric.trend && TrendIcon && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              metric.trend.direction === 'up' ? 'bg-green-500/10' :
              metric.trend.direction === 'down' ? 'bg-red-500/10' :
              'bg-slate-500/10'
            }`}>
              <TrendIcon className={`w-4 h-4 ${getTrendColor(metric.trend.direction)}`} />
              <span className={`text-xs font-medium ${getTrendColor(metric.trend.direction)}`}>
                {metric.trend.percentage.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        
        {/* Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold text-white mb-1">
            {metric.formattedValue}
          </div>
          <div className="text-sm text-slate-400">
            {metric.label}
          </div>
        </div>
        
        {/* Target Progress */}
        {metric.target && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Target: {metric.target}{metric.unit === 'percentage' ? '%' : ''}</span>
              <span>{((metric.value / metric.target) * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.bg} ${colors.text} transition-all duration-1000 ease-out`}
                style={{
                  width: `${Math.min(100, (metric.value / metric.target) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
        
        {/* Sparkline */}
        {metric.sparklineData && (
          <div className="mt-4">
            <Sparkline data={metric.sparklineData} color={colors.text} />
          </div>
        )}
        
        {/* Trend description */}
        {metric.trend && (
          <div className="mt-3 text-xs text-slate-500">
            {metric.trend.period}
          </div>
        )}
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 hover:from-indigo-500/5 hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

// Sparkline mini chart
interface SparklineProps {
  data: number[];
  color: string;
}

const Sparkline = ({ data, color }: SparklineProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`${color} opacity-60`}
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={`0,100 ${points} 100,100`}
        fill="currentColor"
        className={`${color} opacity-10`}
      />
    </svg>
  );
};

// Compact KPI Row (alternative layout)
interface KPIRowProps {
  metrics: KPIMetric[];
}

export const KPIRow = ({ metrics }: KPIRowProps) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {metrics.map((metric) => {
        const colors = getKPIColor(metric.color);
        const Icon = getIcon(metric.icon);
        const TrendIcon = metric.trend ? getIcon(getTrendIcon(metric.trend.direction)) : null;
        
        return (
          <div
            key={metric.id}
            className="flex-shrink-0 flex items-center gap-4 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 min-w-[240px]"
          >
            <div className={`p-2 ${colors.bg} rounded-lg`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            
            <div className="flex-1">
              <div className="text-xs text-slate-400 mb-0.5">{metric.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">{metric.formattedValue}</span>
                {metric.trend && TrendIcon && (
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`w-3 h-3 ${getTrendColor(metric.trend.direction)}`} />
                    <span className={`text-xs ${getTrendColor(metric.trend.direction)}`}>
                      {metric.trend.percentage.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
