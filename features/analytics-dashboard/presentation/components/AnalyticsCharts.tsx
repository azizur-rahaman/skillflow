/**
 * Analytics Charts Component
 * 
 * Multi-chart visualizations (line, bar, donut) with smooth animations
 */

'use client';

import { ChartConfig, ChartDataPoint, ChartSeries } from '../../types/analytics.types';
import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface AnalyticsChartProps {
  config: ChartConfig;
  className?: string;
}

export const AnalyticsChart = ({ config, className = '' }: AnalyticsChartProps) => {
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    if (config.animation.enabled) {
      const timer = setTimeout(() => setIsAnimated(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsAnimated(true);
    }
  }, [config.animation.enabled]);
  
  return (
    <div className={`bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-6 ${className}`}>
      {/* Chart Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{config.title}</h3>
          {config.showLegend && config.series.length > 1 && (
            <div className="flex flex-wrap gap-3 mt-2">
              {config.series.map((series) => (
                <div key={series.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: series.color }}
                  />
                  <span className="text-xs text-slate-400">{series.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          {config.type === 'line' && <TrendingUp className="w-5 h-5 text-indigo-400" />}
          {config.type === 'bar' && <BarChart3 className="w-5 h-5 text-purple-400" />}
          {config.type === 'donut' && <PieChart className="w-5 h-5 text-cyan-400" />}
          {config.type === 'area' && <Activity className="w-5 h-5 text-green-400" />}
        </div>
      </div>
      
      {/* Chart Render */}
      <div style={{ height: config.height }}>
        {config.type === 'line' && <LineChart config={config} isAnimated={isAnimated} />}
        {config.type === 'bar' && <BarChart config={config} isAnimated={isAnimated} />}
        {config.type === 'donut' && <DonutChart config={config} isAnimated={isAnimated} />}
        {config.type === 'area' && <AreaChart config={config} isAnimated={isAnimated} />}
      </div>
    </div>
  );
};

// Line Chart Component
const LineChart = ({ config, isAnimated }: { config: ChartConfig; isAnimated: boolean }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ seriesId: string; index: number } | null>(null);
  
  // Calculate scales
  const allValues = config.series.flatMap(s => s.data.map(d => d.value));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;
  
  const padding = 40;
  const width = 800;
  const height = config.height - 40;
  
  return (
    <div className="relative">
      <svg width="100%" height={config.height} viewBox={`0 0 ${width} ${config.height}`} className="overflow-visible">
        {/* Grid */}
        {config.showGrid && (
          <g className="opacity-20">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                y1={padding + height * ratio}
                x2={width - padding}
                y2={padding + height * ratio}
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-600"
              />
            ))}
          </g>
        )}
        
        {/* Series */}
        {config.series.map((series) => {
          const points = series.data.map((point, i) => {
            const x = padding + (i / (series.data.length - 1)) * (width - 2 * padding);
            const y = padding + height - ((point.value - minValue) / range) * height;
            return { x, y, point, index: i };
          });
          
          const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          
          return (
            <g key={series.id}>
              {/* Line */}
              <path
                d={pathData}
                fill="none"
                stroke={series.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500"
                style={{
                  strokeDasharray: isAnimated ? '0' : '1000',
                  strokeDashoffset: isAnimated ? '0' : '1000',
                }}
              />
              
              {/* Points */}
              {points.map(({ x, y, index }) => (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={hoveredPoint?.seriesId === series.id && hoveredPoint?.index === index ? 6 : 4}
                  fill={series.color}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint({ seriesId: series.id, index })}
                  onMouseLeave={() => setHoveredPoint(null)}
                  style={{
                    opacity: isAnimated ? 1 : 0,
                    transform: isAnimated ? 'scale(1)' : 'scale(0)',
                    transition: `all 0.3s ease-out ${index * 50}ms`,
                  }}
                />
              ))}
            </g>
          );
        })}
        
        {/* Labels */}
        {config.series[0]?.data.map((point, i) => {
          const x = padding + (i / (config.series[0].data.length - 1)) * (width - 2 * padding);
          return (
            <text
              key={i}
              x={x}
              y={config.height - 10}
              textAnchor="middle"
              className="text-xs fill-slate-400"
            >
              {point.label}
            </text>
          );
        })}
      </svg>
      
      {/* Tooltip */}
      {hoveredPoint && (
        <div className="absolute top-4 right-4 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl">
          {config.series.map((series) => {
            const point = series.data[hoveredPoint.index];
            if (!point) return null;
            return (
              <div key={series.id} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: series.color }} />
                <span className="text-xs text-slate-300">{series.name}:</span>
                <span className="text-sm font-semibold text-white">{point.formattedValue || point.value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Bar Chart Component
const BarChart = ({ config, isAnimated }: { config: ChartConfig; isAnimated: boolean }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  const allValues = config.series.flatMap(s => s.data.map(d => d.value));
  const maxValue = Math.max(...allValues);
  
  const padding = 40;
  const width = 800;
  const height = config.height - 60;
  
  const barGroupWidth = (width - 2 * padding) / config.series[0].data.length;
  const barWidth = barGroupWidth / config.series.length - 4;
  
  return (
    <svg width="100%" height={config.height} viewBox={`0 0 ${width} ${config.height}`}>
      {/* Grid */}
      {config.showGrid && (
        <g className="opacity-20">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + height * (1 - ratio)}
              x2={width - padding}
              y2={padding + height * (1 - ratio)}
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-600"
            />
          ))}
        </g>
      )}
      
      {/* Bars */}
      {config.series.map((series, seriesIndex) => (
        <g key={series.id}>
          {series.data.map((point, i) => {
            const x = padding + i * barGroupWidth + seriesIndex * (barWidth + 4);
            const barHeight = (point.value / maxValue) * height;
            const y = padding + height - barHeight;
            
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={isAnimated ? barHeight : 0}
                  fill={series.color}
                  rx="4"
                  className="cursor-pointer transition-all duration-500"
                  style={{
                    transitionDelay: `${i * 50}ms`,
                    opacity: hoveredBar === i ? 0.8 : 1,
                  }}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                {hoveredBar === i && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-xs fill-white font-semibold"
                  >
                    {point.formattedValue || point.value}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      ))}
      
      {/* Labels */}
      {config.series[0]?.data.map((point, i) => {
        const x = padding + i * barGroupWidth + (barGroupWidth / 2);
        return (
          <text
            key={i}
            x={x}
            y={config.height - 10}
            textAnchor="middle"
            className="text-xs fill-slate-400"
          >
            {point.label}
          </text>
        );
      })}
    </svg>
  );
};

// Donut Chart Component
const DonutChart = ({ config, isAnimated }: { config: ChartConfig; isAnimated: boolean }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  const data = config.series[0]?.data || [];
  const total = data.reduce((sum, d) => sum + d.value, 0);
  
  const centerX = 200;
  const centerY = config.height / 2;
  const radius = Math.min(centerX, centerY) - 40;
  const innerRadius = radius * 0.6;
  
  let currentAngle = -90;
  
  return (
    <div className="flex items-center justify-center gap-8">
      <svg width="400" height={config.height} viewBox={`0 0 400 ${config.height}`}>
        {data.map((point, i) => {
          const percentage = (point.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle += angle;
          
          const largeArc = angle > 180 ? 1 : 0;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);
          
          const x3 = centerX + innerRadius * Math.cos(endRad);
          const y3 = centerY + innerRadius * Math.sin(endRad);
          const x4 = centerX + innerRadius * Math.cos(startRad);
          const y4 = centerY + innerRadius * Math.sin(startRad);
          
          const pathData = [
            `M ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
            'Z',
          ].join(' ');
          
          const scale = hoveredSegment === i ? 1.05 : 1;
          
          return (
            <path
              key={i}
              d={pathData}
              fill={point.color || config.colors[i % config.colors.length]}
              className="cursor-pointer transition-all duration-300"
              style={{
                transform: `scale(${isAnimated ? scale : 0})`,
                transformOrigin: `${centerX}px ${centerY}px`,
                transitionDelay: `${i * 100}ms`,
              }}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          );
        })}
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          className="text-2xl font-bold fill-white"
        >
          {total.toLocaleString()}
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          className="text-sm fill-slate-400"
        >
          Total
        </text>
      </svg>
      
      {/* Legend */}
      <div className="flex flex-col gap-2">
        {data.map((point, i) => {
          const percentage = ((point.value / total) * 100).toFixed(1);
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                hoveredSegment === i ? 'bg-slate-800/50' : ''
              }`}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: point.color || config.colors[i % config.colors.length] }}
              />
              <div className="flex-1">
                <div className="text-sm text-white font-medium">{point.label}</div>
                <div className="text-xs text-slate-400">{point.formattedValue || point.value}</div>
              </div>
              <div className="text-sm font-semibold text-indigo-400">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Area Chart Component
const AreaChart = ({ config, isAnimated }: { config: ChartConfig; isAnimated: boolean }) => {
  const allValues = config.series.flatMap(s => s.data.map(d => d.value));
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;
  
  const padding = 40;
  const width = 800;
  const height = config.height - 40;
  
  return (
    <svg width="100%" height={config.height} viewBox={`0 0 ${width} ${config.height}`}>
      {config.series.map((series) => {
        const points = series.data.map((point, i) => {
          const x = padding + (i / (series.data.length - 1)) * (width - 2 * padding);
          const y = padding + height - ((point.value - minValue) / range) * height;
          return { x, y };
        });
        
        const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const areaPath = `${linePath} L ${width - padding} ${padding + height} L ${padding} ${padding + height} Z`;
        
        return (
          <g key={series.id}>
            <defs>
              <linearGradient id={`gradient-${series.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={series.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={series.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <path
              d={areaPath}
              fill={`url(#gradient-${series.id})`}
              className="transition-all duration-1000"
              style={{
                opacity: isAnimated ? 1 : 0,
              }}
            />
            
            <path
              d={linePath}
              fill="none"
              stroke={series.color}
              strokeWidth="2"
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </g>
        );
      })}
    </svg>
  );
};
