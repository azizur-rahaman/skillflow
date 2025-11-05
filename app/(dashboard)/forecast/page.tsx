/**
 * AI Forecast Analytics Dashboard - Complete Implementation
 * 
 * Comprehensive analytics showing AI-predicted skill demand with
 * time-series charts, global heat maps, and forecast confidence scores
 */

'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  DollarSign,
  Briefcase,
  Sparkles,
  Target,
  AlertCircle,
  Info,
  ChevronRight,
  BarChart3,
  Map,
  Calendar,
  Brain,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// Types
enum TrendDirection {
  RISING = 'RISING',
  GROWING = 'GROWING',
  STABLE = 'STABLE',
  DECLINING = 'DECLINING',
  FALLING = 'FALLING',
}

enum ConfidenceLevel {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

enum Region {
  NORTH_AMERICA = 'NORTH_AMERICA',
  EUROPE = 'EUROPE',
  ASIA_PACIFIC = 'ASIA_PACIFIC',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
  MIDDLE_EAST = 'MIDDLE_EAST',
  AFRICA = 'AFRICA',
}

interface TimeSeriesPoint {
  date: Date;
  value: number;
  confidence?: number;
  isPrediction?: boolean;
}

interface SkillForecast {
  skillId: string;
  skillName: string;
  category: string;
  currentDemand: number;
  trend: TrendDirection;
  changePercentage: number;
  confidence: number;
  historical: TimeSeriesPoint[];
  predicted: TimeSeriesPoint[];
  geographic: {
    region: Region;
    demand: number;
    growth: number;
    salary: number;
  }[];
  salaryForecast: {
    current: number;
    predicted: number;
    growth: number;
  };
}

// Mock Data
const mockForecasts: SkillForecast[] = [
  {
    skillId: 'ai-ml',
    skillName: 'AI & Machine Learning',
    category: 'Artificial Intelligence',
    currentDemand: 95,
    trend: TrendDirection.RISING,
    changePercentage: 145,
    confidence: 94,
    historical: [
      { date: new Date('2024-05'), value: 45, confidence: 100 },
      { date: new Date('2024-06'), value: 48, confidence: 100 },
      { date: new Date('2024-07'), value: 52, confidence: 100 },
      { date: new Date('2024-08'), value: 58, confidence: 100 },
      { date: new Date('2024-09'), value: 65, confidence: 100 },
      { date: new Date('2024-10'), value: 73, confidence: 100 },
      { date: new Date('2024-11'), value: 82, confidence: 100 },
      { date: new Date('2024-12'), value: 88, confidence: 100 },
      { date: new Date('2025-01'), value: 90, confidence: 100 },
      { date: new Date('2025-02'), value: 92, confidence: 100 },
      { date: new Date('2025-03'), value: 93, confidence: 100 },
      { date: new Date('2025-04'), value: 95, confidence: 100 },
    ],
    predicted: [
      { date: new Date('2025-05'), value: 96, confidence: 94, isPrediction: true },
      { date: new Date('2025-06'), value: 97, confidence: 93, isPrediction: true },
      { date: new Date('2025-07'), value: 98, confidence: 92, isPrediction: true },
      { date: new Date('2025-08'), value: 98, confidence: 90, isPrediction: true },
      { date: new Date('2025-09'), value: 99, confidence: 88, isPrediction: true },
      { date: new Date('2025-10'), value: 99, confidence: 86, isPrediction: true },
    ],
    geographic: [
      { region: Region.NORTH_AMERICA, demand: 98, growth: 152, salary: 185000 },
      { region: Region.ASIA_PACIFIC, demand: 95, growth: 168, salary: 145000 },
      { region: Region.EUROPE, demand: 92, growth: 138, salary: 165000 },
      { region: Region.SOUTH_AMERICA, demand: 75, growth: 125, salary: 95000 },
      { region: Region.MIDDLE_EAST, demand: 82, growth: 145, salary: 125000 },
      { region: Region.AFRICA, demand: 65, growth: 110, salary: 75000 },
    ],
    salaryForecast: {
      current: 165000,
      predicted: 195000,
      growth: 18.2,
    },
  },
  {
    skillId: 'react',
    skillName: 'React',
    category: 'Frontend Development',
    currentDemand: 88,
    trend: TrendDirection.GROWING,
    changePercentage: 32,
    confidence: 91,
    historical: [
      { date: new Date('2024-05'), value: 72, confidence: 100 },
      { date: new Date('2024-06'), value: 74, confidence: 100 },
      { date: new Date('2024-07'), value: 76, confidence: 100 },
      { date: new Date('2024-08'), value: 78, confidence: 100 },
      { date: new Date('2024-09'), value: 80, confidence: 100 },
      { date: new Date('2024-10'), value: 82, confidence: 100 },
      { date: new Date('2024-11'), value: 83, confidence: 100 },
      { date: new Date('2024-12'), value: 84, confidence: 100 },
      { date: new Date('2025-01'), value: 85, confidence: 100 },
      { date: new Date('2025-02'), value: 86, confidence: 100 },
      { date: new Date('2025-03'), value: 87, confidence: 100 },
      { date: new Date('2025-04'), value: 88, confidence: 100 },
    ],
    predicted: [
      { date: new Date('2025-05'), value: 89, confidence: 91, isPrediction: true },
      { date: new Date('2025-06'), value: 90, confidence: 90, isPrediction: true },
      { date: new Date('2025-07'), value: 90, confidence: 89, isPrediction: true },
      { date: new Date('2025-08'), value: 91, confidence: 87, isPrediction: true },
      { date: new Date('2025-09'), value: 91, confidence: 85, isPrediction: true },
      { date: new Date('2025-10'), value: 92, confidence: 83, isPrediction: true },
    ],
    geographic: [
      { region: Region.NORTH_AMERICA, demand: 95, growth: 35, salary: 135000 },
      { region: Region.EUROPE, demand: 90, growth: 30, salary: 125000 },
      { region: Region.ASIA_PACIFIC, demand: 88, growth: 38, salary: 115000 },
      { region: Region.SOUTH_AMERICA, demand: 70, growth: 25, salary: 75000 },
      { region: Region.MIDDLE_EAST, demand: 75, growth: 28, salary: 95000 },
      { region: Region.AFRICA, demand: 60, growth: 20, salary: 55000 },
    ],
    salaryForecast: {
      current: 125000,
      predicted: 138000,
      growth: 10.4,
    },
  },
  {
    skillId: 'blockchain',
    skillName: 'Blockchain & Web3',
    category: 'Emerging Technology',
    currentDemand: 78,
    trend: TrendDirection.RISING,
    changePercentage: 95,
    confidence: 85,
    historical: [
      { date: new Date('2024-05'), value: 48, confidence: 100 },
      { date: new Date('2024-06'), value: 52, confidence: 100 },
      { date: new Date('2024-07'), value: 55, confidence: 100 },
      { date: new Date('2024-08'), value: 60, confidence: 100 },
      { date: new Date('2024-09'), value: 64, confidence: 100 },
      { date: new Date('2024-10'), value: 68, confidence: 100 },
      { date: new Date('2024-11'), value: 71, confidence: 100 },
      { date: new Date('2024-12'), value: 73, confidence: 100 },
      { date: new Date('2025-01'), value: 75, confidence: 100 },
      { date: new Date('2025-02'), value: 76, confidence: 100 },
      { date: new Date('2025-03'), value: 77, confidence: 100 },
      { date: new Date('2025-04'), value: 78, confidence: 100 },
    ],
    predicted: [
      { date: new Date('2025-05'), value: 80, confidence: 85, isPrediction: true },
      { date: new Date('2025-06'), value: 82, confidence: 84, isPrediction: true },
      { date: new Date('2025-07'), value: 84, confidence: 82, isPrediction: true },
      { date: new Date('2025-08'), value: 85, confidence: 80, isPrediction: true },
      { date: new Date('2025-09'), value: 87, confidence: 78, isPrediction: true },
      { date: new Date('2025-10'), value: 88, confidence: 76, isPrediction: true },
    ],
    geographic: [
      { region: Region.ASIA_PACIFIC, demand: 85, growth: 105, salary: 155000 },
      { region: Region.NORTH_AMERICA, demand: 82, growth: 95, salary: 165000 },
      { region: Region.EUROPE, demand: 78, growth: 88, salary: 145000 },
      { region: Region.MIDDLE_EAST, demand: 72, growth: 92, salary: 135000 },
      { region: Region.SOUTH_AMERICA, demand: 62, growth: 75, salary: 85000 },
      { region: Region.AFRICA, demand: 55, growth: 68, salary: 65000 },
    ],
    salaryForecast: {
      current: 155000,
      predicted: 178000,
      growth: 14.8,
    },
  },
  {
    skillId: 'python',
    skillName: 'Python',
    category: 'Programming Language',
    currentDemand: 92,
    trend: TrendDirection.GROWING,
    changePercentage: 28,
    confidence: 96,
    historical: [
      { date: new Date('2024-05'), value: 78, confidence: 100 },
      { date: new Date('2024-06'), value: 80, confidence: 100 },
      { date: new Date('2024-07'), value: 81, confidence: 100 },
      { date: new Date('2024-08'), value: 83, confidence: 100 },
      { date: new Date('2024-09'), value: 85, confidence: 100 },
      { date: new Date('2024-10'), value: 87, confidence: 100 },
      { date: new Date('2024-11'), value: 88, confidence: 100 },
      { date: new Date('2024-12'), value: 89, confidence: 100 },
      { date: new Date('2025-01'), value: 90, confidence: 100 },
      { date: new Date('2025-02'), value: 91, confidence: 100 },
      { date: new Date('2025-03'), value: 91, confidence: 100 },
      { date: new Date('2025-04'), value: 92, confidence: 100 },
    ],
    predicted: [
      { date: new Date('2025-05'), value: 93, confidence: 96, isPrediction: true },
      { date: new Date('2025-06'), value: 93, confidence: 95, isPrediction: true },
      { date: new Date('2025-07'), value: 94, confidence: 94, isPrediction: true },
      { date: new Date('2025-08'), value: 94, confidence: 93, isPrediction: true },
      { date: new Date('2025-09'), value: 95, confidence: 91, isPrediction: true },
      { date: new Date('2025-10'), value: 95, confidence: 90, isPrediction: true },
    ],
    geographic: [
      { region: Region.NORTH_AMERICA, demand: 96, growth: 30, salary: 145000 },
      { region: Region.EUROPE, demand: 94, growth: 28, salary: 135000 },
      { region: Region.ASIA_PACIFIC, demand: 92, growth: 32, salary: 125000 },
      { region: Region.SOUTH_AMERICA, demand: 78, growth: 22, salary: 80000 },
      { region: Region.MIDDLE_EAST, demand: 82, growth: 25, salary: 105000 },
      { region: Region.AFRICA, demand: 70, growth: 18, salary: 60000 },
    ],
    salaryForecast: {
      current: 135000,
      predicted: 148000,
      growth: 9.6,
    },
  },
];

// Helper functions
const getTrendColor = (trend: TrendDirection): string => {
  switch (trend) {
    case TrendDirection.RISING: return '#10B981';
    case TrendDirection.GROWING: return '#22D3EE';
    case TrendDirection.STABLE: return '#F59E0B';
    case TrendDirection.DECLINING: return '#F97316';
    case TrendDirection.FALLING: return '#EF4444';
    default: return '#64748B';
  }
};

const getConfidenceColor = (score: number): string => {
  if (score >= 90) return '#10B981';
  if (score >= 80) return '#22D3EE';
  if (score >= 70) return '#F59E0B';
  if (score >= 60) return '#F97316';
  return '#EF4444';
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getRegionName = (region: Region): string => {
  const names = {
    [Region.NORTH_AMERICA]: 'North America',
    [Region.EUROPE]: 'Europe',
    [Region.ASIA_PACIFIC]: 'Asia Pacific',
    [Region.SOUTH_AMERICA]: 'South America',
    [Region.MIDDLE_EAST]: 'Middle East',
    [Region.AFRICA]: 'Africa',
  };
  return names[region] || 'Unknown';
};

// Time Series Chart Component
interface TimeSeriesChartProps {
  forecasts: SkillForecast[];
  selectedSkills: string[];
  height?: number;
}

const TimeSeriesChart = ({ forecasts, selectedSkills, height = 300 }: TimeSeriesChartProps) => {
  const filteredForecasts = forecasts.filter(f => selectedSkills.includes(f.skillId));
  
  if (filteredForecasts.length === 0) return null;
  
  // Combine all data points
  const allPoints = filteredForecasts.flatMap(f => [
    ...f.historical.map(h => ({ ...h, skillId: f.skillId })),
    ...f.predicted.map(p => ({ ...p, skillId: f.skillId })),
  ]);
  
  const minValue = Math.min(...allPoints.map(p => p.value));
  const maxValue = Math.max(...allPoints.map(p => p.value));
  const range = maxValue - minValue || 1;
  
  const colors = ['#22D3EE', '#A855F7', '#10B981', '#F59E0B'];
  
  return (
    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Demand Forecast</h3>
          <p className="text-sm text-slate-400">12-month historical + 6-month AI predictions</p>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-violet-400" />
          <span className="text-xs text-violet-400">Prophet + LSTM</span>
        </div>
      </div>
      
      <div className="relative" style={{ height }}>
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((val, idx) => {
            const y = height - ((val - minValue) / range) * height;
            return (
              <g key={idx}>
                <line
                  x1="0"
                  y1={y}
                  x2="100%"
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  strokeDasharray="4 4"
                />
                <text x="0" y={y - 5} fill="#64748B" fontSize="10">
                  {val}
                </text>
              </g>
            );
          })}
          
          {/* Vertical separator for predictions */}
          <line
            x1="66%"
            y1="0"
            x2="66%"
            y2={height}
            stroke="#6366F1"
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
          />
          
          {/* Chart lines */}
          {filteredForecasts.map((forecast, idx) => {
            const color = colors[idx % colors.length];
            const allData = [...forecast.historical, ...forecast.predicted];
            
            // Historical line
            const historicalPoints = forecast.historical.map((point, i) => {
              const x = (i / (allData.length - 1)) * 100;
              const y = height - ((point.value - minValue) / range) * height;
              return `${x}%,${y}`;
            }).join(' ');
            
            // Predicted line
            const predictedStart = forecast.historical.length - 1;
            const predictedPoints = forecast.predicted.map((point, i) => {
              const x = ((predictedStart + i) / (allData.length - 1)) * 100;
              const y = height - ((point.value - minValue) / range) * height;
              return `${x}%,${y}`;
            }).join(' ');
            
            // Connect last historical to first predicted
            const connectionPoints = [
              forecast.historical[forecast.historical.length - 1],
              forecast.predicted[0],
            ].map((point, i) => {
              const x = ((predictedStart + i) / (allData.length - 1)) * 100;
              const y = height - ((point.value - minValue) / range) * height;
              return `${x}%,${y}`;
            }).join(' ');
            
            return (
              <g key={forecast.skillId}>
                {/* Historical line */}
                <polyline
                  points={historicalPoints}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-chart-draw"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                />
                
                {/* Connection line */}
                <polyline
                  points={connectionPoints}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                
                {/* Predicted line */}
                <polyline
                  points={predictedPoints}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 4"
                  opacity="0.8"
                  className="animate-chart-draw"
                  style={{ animationDelay: `${idx * 0.1 + 0.3}s` }}
                />
                
                {/* Data points */}
                {allData.map((point, i) => {
                  const x = (i / (allData.length - 1)) * 100;
                  const y = height - ((point.value - minValue) / range) * height;
                  
                  return (
                    <circle
                      key={i}
                      cx={`${x}%`}
                      cy={y}
                      r={point.isPrediction ? "4" : "3"}
                      fill={color}
                      opacity={point.isPrediction ? 0.7 : 1}
                      className="animate-point-appear"
                      style={{ animationDelay: `${idx * 0.1 + i * 0.02}s` }}
                    >
                      <title>{`${forecast.skillName}: ${point.value}${point.isPrediction ? ` (${point.confidence}% confidence)` : ''}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="absolute top-0 right-0 flex flex-wrap gap-3">
          {filteredForecasts.map((forecast, idx) => (
            <div key={forecast.skillId} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[idx % colors.length] }}
              />
              <span className="text-xs text-slate-300">{forecast.skillName}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>May 2024</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-slate-600" />
          <span>Historical</span>
          <div className="w-8 h-0.5 bg-slate-600" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #475569 0, #475569 4px, transparent 4px, transparent 8px)' }} />
          <span>Predicted</span>
        </div>
        <span>Oct 2025</span>
      </div>
    </div>
  );
};

// Global Demand Map Component
interface GlobalMapProps {
  forecasts: SkillForecast[];
  selectedSkill: string;
}

const GlobalDemandMap = ({ forecasts, selectedSkill }: GlobalMapProps) => {
  const forecast = forecasts.find(f => f.skillId === selectedSkill);
  if (!forecast) return null;
  
  const maxDemand = Math.max(...forecast.geographic.map(g => g.demand));
  
  // Simple world map regions with approximate positions
  const regionPositions: Record<Region, { x: number; y: number }> = {
    [Region.NORTH_AMERICA]: { x: 20, y: 30 },
    [Region.SOUTH_AMERICA]: { x: 30, y: 60 },
    [Region.EUROPE]: { x: 50, y: 25 },
    [Region.AFRICA]: { x: 52, y: 50 },
    [Region.MIDDLE_EAST]: { x: 60, y: 35 },
    [Region.ASIA_PACIFIC]: { x: 75, y: 40 },
  };
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Global Demand Distribution</h3>
          <p className="text-sm text-slate-400">{forecast.skillName} — Regional intensity</p>
        </div>
        <Globe className="w-5 h-5 text-cyan-400" />
      </div>
      
      <div className="relative bg-slate-950 rounded-xl p-8 mb-6" style={{ height: 300 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
          {/* World map outline (simplified) */}
          <rect
            x="0"
            y="0"
            width="100"
            height="100"
            fill="none"
            stroke="#1E293B"
            strokeWidth="0.5"
          />
          
          {/* Region markers */}
          {forecast.geographic.map((geo) => {
            const pos = regionPositions[geo.region];
            const intensity = geo.demand / maxDemand;
            const radius = 3 + (intensity * 5);
            const color = intensity > 0.8 ? '#10B981' : intensity > 0.6 ? '#22D3EE' : intensity > 0.4 ? '#F59E0B' : '#F97316';
            
            return (
              <g key={geo.region}>
                {/* Pulse ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius + 2}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.5"
                  opacity="0.3"
                  className="animate-map-pulse"
                />
                
                {/* Main marker */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={color}
                  opacity="0.8"
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <title>{getRegionName(geo.region)}: {geo.demand}% demand, +{geo.growth}% growth, {formatCurrency(geo.salary)}</title>
                </circle>
                
                {/* Glow */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={radius}
                  fill={color}
                  opacity="0.2"
                  filter="blur(2px)"
                />
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        {forecast.geographic
          .sort((a, b) => b.demand - a.demand)
          .slice(0, 6)
          .map((geo) => (
            <div key={geo.region} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: geo.demand / maxDemand > 0.8 ? '#10B981' : geo.demand / maxDemand > 0.6 ? '#22D3EE' : geo.demand / maxDemand > 0.4 ? '#F59E0B' : '#F97316',
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{getRegionName(geo.region)}</p>
                <p className="text-xs text-slate-400">{geo.demand}% demand</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-emerald-400">+{geo.growth}%</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// Forecast Summary Card
interface ForecastCardProps {
  forecast: SkillForecast;
  onClick: () => void;
}

const ForecastSummaryCard = ({ forecast, onClick }: ForecastCardProps) => {
  const trendColor = getTrendColor(forecast.trend);
  const confidenceColor = getConfidenceColor(forecast.confidence);
  
  return (
    <div
      onClick={onClick}
      className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all cursor-pointer animate-forecast-reveal"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{forecast.skillName}</h3>
          <p className="text-xs text-slate-400">{forecast.category}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: `${confidenceColor}20` }}>
          <Sparkles className="w-3 h-3" style={{ color: confidenceColor }} />
          <span className="text-xs font-medium" style={{ color: confidenceColor }}>
            {forecast.confidence}%
          </span>
        </div>
      </div>
      
      {/* Demand Index */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Current Demand</span>
          <span className="text-2xl font-bold text-white">{forecast.currentDemand}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 animate-confidence-fill"
            style={{
              width: `${forecast.currentDemand}%`,
              background: `linear-gradient(90deg, ${trendColor}40, ${trendColor})`,
            }}
          />
        </div>
      </div>
      
      {/* Trend & Salary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">Growth</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" style={{ color: trendColor }} />
            <span className="text-lg font-bold" style={{ color: trendColor }}>
              +{forecast.changePercentage}%
            </span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">Salary</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">
              {formatCurrency(forecast.salaryForecast.current)}
            </span>
            <span className="text-xs text-emerald-400">
              +{forecast.salaryForecast.growth.toFixed(1)}% predicted
            </span>
          </div>
        </div>
      </div>
      
      {/* Top Region */}
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-300">
            Top Region: {getRegionName(forecast.geographic[0].region)}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-500" />
      </div>
    </div>
  );
};

// Main Dashboard
export default function ForecastAnalyticsPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['ai-ml', 'react']);
  const [selectedMapSkill, setSelectedMapSkill] = useState<string>('ai-ml');
  
  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };
  
  const avgConfidence = mockForecasts.reduce((sum, f) => sum + f.confidence, 0) / mockForecasts.length;
  const avgGrowth = mockForecasts.reduce((sum, f) => sum + f.changePercentage, 0) / mockForecasts.length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Forecast Analytics</h1>
              <p className="text-slate-400">Predictive intelligence for skill demand and salary trends</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-lg">
                <Brain className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-300">Prophet + LSTM Ensemble</span>
              </div>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">Skills Tracked</span>
              </div>
              <p className="text-2xl font-bold text-white">{mockForecasts.length}</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-xs text-slate-400">Avg Confidence</span>
              </div>
              <p className="text-2xl font-bold text-white">{avgConfidence.toFixed(1)}%</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Avg Growth</span>
              </div>
              <p className="text-2xl font-bold text-white">+{avgGrowth.toFixed(1)}%</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">Regions</span>
              </div>
              <p className="text-2xl font-bold text-white">6</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-8">
        {/* Time Series Chart */}
        <div className="mb-8">
          <TimeSeriesChart
            forecasts={mockForecasts}
            selectedSkills={selectedSkills}
          />
        </div>
        
        {/* Map and Cards Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Global Map */}
          <div className="col-span-2">
            <GlobalDemandMap
              forecasts={mockForecasts}
              selectedSkill={selectedMapSkill}
            />
          </div>
          
          {/* Skill Selector */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Skills</h3>
            <div className="space-y-2">
              {mockForecasts.map((forecast) => (
                <label key={forecast.skillId} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(forecast.skillId)}
                    onChange={() => toggleSkill(forecast.skillId)}
                    className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{forecast.skillName}</p>
                    <p className="text-xs text-slate-400">{forecast.trend}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedMapSkill(forecast.skillId);
                    }}
                    className="p-1 hover:bg-slate-700 rounded"
                  >
                    <Map className="w-4 h-4 text-slate-400" />
                  </button>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Forecast Summary Cards */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Detailed Forecasts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockForecasts.map((forecast) => (
              <ForecastSummaryCard
                key={forecast.skillId}
                forecast={forecast}
                onClick={() => setSelectedMapSkill(forecast.skillId)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
