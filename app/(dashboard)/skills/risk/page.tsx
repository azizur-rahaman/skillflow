/**
 * Skill Risk Dashboard - Complete Implementation
 * 
 * Comprehensive dashboard showing skill obsolescence risk scores
 * with circular gauges, trend charts, and AI recommendations.
 */

'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  ChevronRight,
  Sparkles,
  Clock,
  Target,
  RefreshCw,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
} from 'lucide-react';
import { SkillRiskProvider, useSkillRisk } from '@/features/skill-risk/context/SkillRiskContext';
import {
  getRiskColor,
  getRiskLevelLabel,
  getActionLabel,
  getPriorityColor,
  getGaugeZones,
  getTrendIcon,
  formatDaysAgo,
  RiskLevel,
  TrendDirection,
  SkillRiskScore,
  Recommendation,
} from '@/features/skill-risk/types/skill-risk.types';

// Risk Gauge Component
interface RiskGaugeProps {
  riskScore: number;
  size?: number;
}

const RiskGauge = ({ riskScore, size = 120 }: RiskGaugeProps) => {
  const zones = getGaugeZones();
  const currentZone = zones.find(z => riskScore >= z.min && riskScore <= z.max);
  const color = currentZone?.color || '#64748B';
  
  const circumference = 2 * Math.PI * 45;
  const progress = (riskScore / 100) * circumference;
  const dashOffset = circumference - progress;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circles for zones */}
        {zones.map((zone, index) => {
          const start = (zone.min / 100) * circumference;
          const length = ((zone.max - zone.min) / 100) * circumference;
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={45}
              fill="none"
              stroke={zone.color}
              strokeWidth="8"
              strokeOpacity="0.2"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-start}
              strokeLinecap="round"
            />
          );
        })}
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={45}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="animate-gauge-fill transition-all duration-1000"
        />
        
        {/* Inner glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={38}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.3"
          className="animate-risk-pulse"
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-3xl font-bold text-white">{riskScore}</span>
        <span className="text-xs text-slate-400">Risk Score</span>
      </div>
    </div>
  );
};

// Trend Chart Component
interface TrendChartProps {
  history: { date: Date; riskScore: number; event?: string }[];
  height?: number;
}

const TrendChart = ({ history, height = 60 }: TrendChartProps) => {
  if (history.length === 0) return null;
  
  const maxScore = Math.max(...history.map(h => h.riskScore));
  const minScore = Math.min(...history.map(h => h.riskScore));
  const range = maxScore - minScore || 1;
  
  const points = history.map((point, index) => {
    const x = (index / (history.length - 1)) * 200;
    const y = height - ((point.riskScore - minScore) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="relative" style={{ height }}>
      <svg width="200" height={height} className="w-full">
        {/* Grid lines */}
        <line x1="0" y1={height / 2} x2="200" y2={height / 2} stroke="#334155" strokeWidth="1" strokeOpacity="0.3" />
        
        {/* Trend line */}
        <polyline
          points={points}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-trend-draw"
        />
        
        {/* Area fill */}
        <polygon
          points={`0,${height} ${points} 200,${height}`}
          fill="url(#trendGradient)"
          opacity="0.2"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Data points */}
        {history.map((point, index) => {
          const x = (index / (history.length - 1)) * 200;
          const y = height - ((point.riskScore - minScore) / range) * height;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="#22D3EE"
              className="animate-point-appear"
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Recommendation Chip Component
interface RecommendationChipProps {
  recommendation: Recommendation;
  onAccept: () => void;
  onDismiss: () => void;
}

const RecommendationChip = ({ recommendation, onAccept, onDismiss }: RecommendationChipProps) => {
  const priorityColor = getPriorityColor(recommendation.priority);
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 hover:border-cyan-500/50 transition-all animate-recommendation-slide">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${priorityColor}20` }}
        >
          <Sparkles className="w-5 h-5" style={{ color: priorityColor }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${priorityColor}20`, color: priorityColor }}>
              {recommendation.priority}
            </span>
            <span className="text-xs text-slate-400">{getActionLabel(recommendation.action)}</span>
          </div>
          
          <h4 className="text-sm font-semibold text-white mb-1">{recommendation.title}</h4>
          <p className="text-xs text-slate-400 mb-3">{recommendation.description}</p>
          
          {recommendation.skillsToLearn && recommendation.skillsToLearn.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {recommendation.skillsToLearn.map((skill, index) => (
                <span key={index} className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
            {recommendation.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{recommendation.estimatedTime}</span>
              </div>
            )}
            {recommendation.impactScore && (
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>-{recommendation.impactScore}% risk</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onAccept}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-xs font-medium text-white hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Start Learning
            </button>
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Risk Score Widget Component
interface RiskWidgetProps {
  skill: SkillRiskScore;
  onViewDetails: () => void;
}

const RiskWidget = ({ skill, onViewDetails }: RiskWidgetProps) => {
  const { actions } = useSkillRisk();
  const trendIcon = getTrendIcon(skill.trend.direction);
  const riskColor = getRiskColor(skill.riskLevel);
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">{skill.skillName}</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${riskColor}20`, color: riskColor }}>
              {getRiskLevelLabel(skill.riskLevel)}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              {skill.trend.direction === TrendDirection.IMPROVING && <TrendingDown className="w-3 h-3 text-emerald-400" />}
              {skill.trend.direction === TrendDirection.DECLINING && <TrendingUp className="w-3 h-3 text-red-400" />}
              {skill.trend.direction === TrendDirection.STABLE && <Minus className="w-3 h-3 text-slate-400" />}
              <span>{Math.abs(skill.trend.changePercentage)}%</span>
            </div>
          </div>
        </div>
        
        <RiskGauge riskScore={skill.riskScore} size={100} />
      </div>
      
      {/* Trend Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Risk Trend ({skill.trend.period})</span>
          <span className="text-xs text-slate-500">Confidence: {skill.confidence}%</span>
        </div>
        <TrendChart history={skill.trend.history} />
      </div>
      
      {/* Top Recommendation */}
      {skill.recommendations.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">AI Recommendation</span>
          </div>
          <RecommendationChip
            recommendation={skill.recommendations[0]}
            onAccept={() => actions.acceptRecommendation(skill.skillId, skill.recommendations[0].id)}
            onDismiss={() => actions.dismissRecommendation(skill.skillId, skill.recommendations[0].id)}
          />
        </div>
      )}
      
      {/* View Details Button */}
      <button
        onClick={onViewDetails}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-300 transition-colors"
      >
        View Full Analysis
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// Main Dashboard Content
const SkillRiskDashboardContent = () => {
  const { state, actions } = useSkillRisk();
  const { riskScores, summary, filter, isLoading } = state;
  
  const [showFilters, setShowFilters] = useState(false);
  
  // Apply filters and sorting
  const filteredScores = riskScores
    .filter(skill => filter.riskLevels.includes(skill.riskLevel))
    .filter(skill => filter.trendDirections.includes(skill.trend.direction))
    .filter(skill => {
      if (!filter.searchQuery) return true;
      return skill.skillName.toLowerCase().includes(filter.searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const order = filter.sortOrder === 'asc' ? 1 : -1;
      switch (filter.sortBy) {
        case 'riskScore':
          return (a.riskScore - b.riskScore) * order;
        case 'skillName':
          return a.skillName.localeCompare(b.skillName) * order;
        case 'lastAssessment':
          return (a.lastAssessment.getTime() - b.lastAssessment.getTime()) * order;
        case 'trend':
          return (a.trend.changePercentage - b.trend.changePercentage) * order;
        default:
          return 0;
      }
    });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Skill Risk Assessment</h1>
              <p className="text-slate-400">Monitor obsolescence risk and get AI-powered recommendations</p>
            </div>
            
            <button
              onClick={actions.refreshRiskScores}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-400">Total Skills</span>
              </div>
              <p className="text-2xl font-bold text-white">{summary.totalSkills}</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400">Average Risk</span>
              </div>
              <p className="text-2xl font-bold text-white">{summary.averageRiskScore.toFixed(1)}</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-slate-400">At Risk</span>
              </div>
              <p className="text-2xl font-bold text-white">{summary.skillsAtRisk}</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-xs text-slate-400">Worsening</span>
              </div>
              <p className="text-2xl font-bold text-white">{summary.trendingUp}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium text-slate-300 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            {showFilters && <X className="w-4 h-4" />}
          </button>
          
          <input
            type="text"
            placeholder="Search skills..."
            value={filter.searchQuery || ''}
            onChange={(e) => actions.updateFilter({ searchQuery: e.target.value })}
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        
        {showFilters && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 mb-6 animate-filter-slide">
            <div className="grid grid-cols-2 gap-6">
              {/* Risk Level Filter */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 block">Risk Level</label>
                <div className="space-y-2">
                  {Object.values(RiskLevel).map((level) => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.riskLevels.includes(level)}
                        onChange={(e) => {
                          const newLevels = e.target.checked
                            ? [...filter.riskLevels, level]
                            : filter.riskLevels.filter(l => l !== level);
                          actions.updateFilter({ riskLevels: newLevels });
                        }}
                        className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-slate-300">{getRiskLevelLabel(level)}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Trend Filter */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 block">Trend Direction</label>
                <div className="space-y-2">
                  {Object.values(TrendDirection).map((direction) => (
                    <label key={direction} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.trendDirections.includes(direction)}
                        onChange={(e) => {
                          const newDirections = e.target.checked
                            ? [...filter.trendDirections, direction]
                            : filter.trendDirections.filter(d => d !== direction);
                          actions.updateFilter({ trendDirections: newDirections });
                        }}
                        className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                      />
                      <span className="text-sm text-slate-300 capitalize">{direction.toLowerCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Risk Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScores.map((skill) => (
            <RiskWidget
              key={skill.skillId}
              skill={skill}
              onViewDetails={() => actions.selectSkill(skill)}
            />
          ))}
        </div>
        
        {filteredScores.length === 0 && (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">No skills found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SkillRiskDashboardPage() {
  return (
    <SkillRiskProvider>
      <SkillRiskDashboardContent />
    </SkillRiskProvider>
  );
}
