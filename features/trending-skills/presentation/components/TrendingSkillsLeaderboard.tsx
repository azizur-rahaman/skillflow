'use client';

/**
 * TrendingSkillsLeaderboard Component
 * Main leaderboard displaying trending skills with filters
 * Energetic yet professional feel
 */

import React, { useState } from 'react';
import { RefreshCw, TrendingUp, ArrowUpRight, Download } from 'lucide-react';
import { useTrendingSkills } from '../../context/TrendingSkillsContext';
import { TrendingSkillCard } from './TrendingSkillCard';
import { TrendingSkillsFilters } from './TrendingSkillsFilters';
import type { TrendingSkill } from '../../types/trending-skills.types';

interface TrendingSkillsLeaderboardProps {
  showSparklines?: boolean;
  showSalaryImpact?: boolean;
  compact?: boolean;
  onSkillClick?: (skill: TrendingSkill) => void;
}

export function TrendingSkillsLeaderboard({
  showSparklines = true,
  showSalaryImpact = false,
  compact = false,
  onSkillClick,
}: TrendingSkillsLeaderboardProps) {
  const {
    skills,
    filters,
    isLoading,
    error,
    updateFilters,
    refreshData,
    lastUpdated,
    totalSkillsTracked,
  } = useTrendingSkills();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const handleExport = () => {
    // Export functionality - could export as CSV or JSON
    const dataStr = JSON.stringify(skills, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `trending-skills-${filters.timeRange}-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#A855F7]">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#F8FAFC]">
              Trending Skills
            </h1>
          </div>
          <p className="text-[#94A3B8]">
            Fastest-rising skills globally and by industry
          </p>
          {lastUpdated && (
            <p className="text-xs text-[#64748B] mt-1">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="
              p-2.5 rounded-xl border border-[#334155]
              bg-[#1E293B] hover:bg-[#6366F1]/10 hover:border-[#6366F1]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              group
            "
            aria-label="Refresh data"
          >
            <RefreshCw 
              className={`w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors ${
                isRefreshing ? 'animate-spin' : ''
              }`} 
            />
          </button>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={skills.length === 0}
            className="
              px-4 py-2.5 rounded-xl border border-[#334155]
              bg-[#1E293B] hover:bg-[#6366F1]/10 hover:border-[#6366F1]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
              text-sm font-medium text-[#F8FAFC]
              group
            "
          >
            <Download className="w-4 h-4 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <TrendingSkillsFilters
        filters={filters}
        onFilterChange={updateFilters}
        totalResults={skills.length}
      />

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Skills Tracked"
          value={totalSkillsTracked.toLocaleString()}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="+12%"
        />
        <StatCard
          label="Avg. Growth Rate"
          value={
            skills.length > 0
              ? `${(skills.reduce((sum, s) => sum + s.growthPercentage, 0) / skills.length).toFixed(1)}%`
              : '0%'
          }
          icon={<ArrowUpRight className="w-5 h-5" />}
          trend="+5%"
        />
        <StatCard
          label="Top Category"
          value={
            filters.category !== 'all' 
              ? filters.category.replace('-', ' ')
              : 'AI & ML'
          }
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]">
          <p className="font-medium">Error loading trending skills</p>
          <p className="text-sm mt-1 opacity-80">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && skills.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-32 bg-[#1E293B] border border-[#334155] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Leaderboard List */}
      {!isLoading && skills.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1E293B] mb-4">
            <TrendingUp className="w-8 h-8 text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">
            No trending skills found
          </h3>
          <p className="text-[#94A3B8]">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="space-y-4">
          {skills.map((skill) => (
            <TrendingSkillCard
              key={skill.id}
              skill={skill}
              showSparkline={showSparklines}
              showSalaryImpact={showSalaryImpact}
              compact={compact}
              onClick={onSkillClick}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {skills.length > 0 && (
        <div className="text-center pt-4">
          <button
            className="
              px-6 py-3 rounded-xl
              bg-[#1E293B] border border-[#334155]
              hover:bg-[#6366F1]/10 hover:border-[#6366F1]
              transition-all duration-200
              text-sm font-medium text-[#F8FAFC]
            "
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[#94A3B8]">{label}</span>
        <div className="text-[#6366F1]">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#F8FAFC]">{value}</span>
        {trend && (
          <span className="text-xs text-[#10B981] font-medium">{trend}</span>
        )}
      </div>
    </div>
  );
}
