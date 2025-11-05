'use client';

/**
 * TrendingSkillCard Component
 * Leaderboard-style card displaying trending skill with:
 * - Ranking number
 * - Trend arrows
 * - Sparkline mini-chart
 * - Growth percentage
 * - Professional feel with energetic accents
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import type { TrendingSkill } from '../../types/trending-skills.types';

interface TrendingSkillCardProps {
  skill: TrendingSkill;
  showSparkline?: boolean;
  showSalaryImpact?: boolean;
  compact?: boolean;
  onClick?: (skill: TrendingSkill) => void;
}

export function TrendingSkillCard({
  skill,
  showSparkline = true,
  showSalaryImpact = false,
  compact = false,
  onClick,
}: TrendingSkillCardProps) {
  const rankChange = skill.previousRank 
    ? skill.previousRank - skill.rank 
    : 0;

  const getTrendIcon = () => {
    if (skill.trendDirection === 'up') {
      return <TrendingUp className="w-4 h-4 text-success" />;
    }
    if (skill.trendDirection === 'down') {
      return <TrendingDown className="w-4 h-4 text-danger" />;
    }
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (skill.trendDirection === 'up') return 'text-success';
    if (skill.trendDirection === 'down') return 'text-danger';
    return 'text-muted-foreground';
  };

  const getRankBadgeColor = () => {
    if (skill.rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white';
    if (skill.rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white';
    if (skill.rank === 3) return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const handleClick = () => {
    if (onClick) {
      onClick(skill);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative bg-[#1E293B] border border-[#334155] rounded-2xl
        transition-all duration-300 hover:border-[#6366F1] hover:shadow-lg hover:shadow-[#6366F1]/20
        ${onClick ? 'cursor-pointer' : ''}
        ${compact ? 'p-4' : 'p-6'}
      `}
    >
      {/* Rank Badge */}
      <div className="absolute -left-3 -top-3">
        <div
          className={`
            ${getRankBadgeColor()}
            w-12 h-12 rounded-xl flex items-center justify-center
            font-bold text-lg shadow-lg
            transition-transform duration-300 group-hover:scale-110
          `}
        >
          {skill.rank}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 ml-6">
        {/* Skill Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-[#F8FAFC] truncate">
              {skill.name}
            </h3>
            {getTrendIcon()}
          </div>

          <div className="flex items-center gap-4 text-sm">
            {/* Growth Percentage */}
            <div className={`flex items-center gap-1 font-semibold ${getTrendColor()}`}>
              {skill.growthPercentage > 0 ? '+' : ''}
              {skill.growthPercentage.toFixed(1)}%
              <span className="text-[#94A3B8] font-normal">growth</span>
            </div>

            {/* Rank Change */}
            {rankChange !== 0 && (
              <div className="flex items-center gap-1 text-[#94A3B8]">
                {rankChange > 0 ? (
                  <span className="text-success">↑ {rankChange}</span>
                ) : (
                  <span className="text-danger">↓ {Math.abs(rankChange)}</span>
                )}
              </div>
            )}

            {/* Category */}
            <span className="px-2 py-1 rounded-lg bg-[#6366F1]/20 text-[#6366F1] text-xs font-medium">
              {skill.category.replace('-', ' ')}
            </span>
          </div>

          {/* Additional Info */}
          {!compact && (
            <div className="mt-3 flex items-center gap-4 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-1">
                <span className="font-medium">{skill.jobPostings.toLocaleString()}</span>
                <span>jobs</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">{skill.learningResources}</span>
                <span>resources</span>
              </div>
              {showSalaryImpact && skill.averageSalaryImpact && (
                <div className="flex items-center gap-1 text-[#22D3EE]">
                  <span className="font-medium">+{skill.averageSalaryImpact}%</span>
                  <span>salary</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sparkline Chart */}
        {showSparkline && skill.sparklineData.length > 0 && (
          <div className="flex-shrink-0">
            <SparklineChart data={skill.sparklineData} color={getTrendColor()} />
          </div>
        )}

        {/* Arrow */}
        {onClick && (
          <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors flex-shrink-0" />
        )}
      </div>

      {/* Demand Score Bar */}
      <div className="mt-4 ml-6">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[#94A3B8]">Demand Score</span>
          <span className="font-semibold text-[#F8FAFC]">{skill.demandScore}/100</span>
        </div>
        <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#22D3EE] transition-all duration-500"
            style={{ width: `${skill.demandScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Simple Sparkline Chart Component
 */
interface SparklineChartProps {
  data: Array<{ timestamp: string; value: number }>;
  color: string;
}

function SparklineChart({ data, color }: SparklineChartProps) {
  if (data.length === 0) return null;

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((point.value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      width="120"
      height="40"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="opacity-80 group-hover:opacity-100 transition-opacity"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
      />
    </svg>
  );
}
