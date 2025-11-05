/**
 * Filter Bar Component
 * 
 * Floating filter bar with domain selector, time range picker, 
 * and view mode toggles.
 */

'use client';

import { useState } from 'react';
import {
  Filter,
  X,
  Calendar,
  Grid3x3,
  Users,
  TrendingUp,
  ChevronDown,
  Search,
  CheckCircle,
} from 'lucide-react';
import { useHeatmap } from '../../context/HeatmapContext';
import {
  ViewMode,
  TimeFrame,
  SkillDomain,
  CompetencyLevel,
  getDomainLabel,
} from '../../types/heatmap.types';

export const FilterBar = () => {
  const { state, actions } = useHeatmap();
  const { filters, viewMode } = state;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const hasActiveFilters =
    filters.domains.length > 0 ||
    filters.searchQuery.length > 0 ||
    filters.showVerifiedOnly ||
    filters.minValue > 0 ||
    filters.maxValue < 100;

  const domains = Object.values(SkillDomain);
  const timeFrames = Object.values(TimeFrame);
  const viewModes = Object.values(ViewMode);

  const toggleDomain = (domain: SkillDomain) => {
    const newDomains = filters.domains.includes(domain)
      ? filters.domains.filter((d) => d !== domain)
      : [...filters.domains, domain];
    actions.updateFilters({ domains: newDomains });
  };

  const getViewModeIcon = (mode: ViewMode) => {
    switch (mode) {
      case ViewMode.SKILLS_BY_DOMAIN:
        return <Grid3x3 className="w-4 h-4" />;
      case ViewMode.SKILLS_BY_TEAM:
        return <Users className="w-4 h-4" />;
      case ViewMode.DOMAINS_BY_TIME:
        return <TrendingUp className="w-4 h-4" />;
      case ViewMode.TEAM_COMPARISON:
        return <Users className="w-4 h-4" />;
      default:
        return <Grid3x3 className="w-4 h-4" />;
    }
  };

  const getViewModeLabel = (mode: ViewMode) => {
    return mode.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getTimeFrameLabel = (frame: TimeFrame) => {
    const labels: Record<TimeFrame, string> = {
      [TimeFrame.CURRENT]: 'Current',
      [TimeFrame.LAST_MONTH]: 'Last Month',
      [TimeFrame.LAST_QUARTER]: 'Last Quarter',
      [TimeFrame.LAST_YEAR]: 'Last Year',
      [TimeFrame.ALL_TIME]: 'All Time',
    };
    return labels[frame];
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 animate-filter-slide">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-full shadow-2xl">
        {/* Compact bar */}
        <div className="flex items-center gap-2 px-4 py-2">
          {/* Toggle button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors"
          >
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-intensity-pulse" />
            )}
          </button>

          {/* View mode selector */}
          <div className="relative">
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              {getViewModeIcon(viewMode)}
              <span className="text-sm text-slate-300">
                {getViewModeLabel(viewMode)}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* View mode dropdown */}
            {showViewMenu && (
              <div className="absolute top-full mt-2 left-0 min-w-[200px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
                {viewModes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      actions.setViewMode(mode);
                      setShowViewMenu(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                      ${mode === viewMode ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-slate-800'}
                    `}
                  >
                    {getViewModeIcon(mode)}
                    <span>{getViewModeLabel(mode)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time frame selector */}
          <div className="relative">
            <button
              onClick={() => setShowTimeMenu(!showTimeMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <Calendar className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-slate-300">
                {getTimeFrameLabel(filters.timeFrame)}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Time frame dropdown */}
            {showTimeMenu && (
              <div className="absolute top-full mt-2 left-0 min-w-[160px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
                {timeFrames.map((frame) => (
                  <button
                    key={frame}
                    onClick={() => {
                      actions.setTimeFrame(frame);
                      setShowTimeMenu(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-2 text-sm transition-colors
                      ${frame === filters.timeFrame ? 'bg-violet-500/20 text-violet-400' : 'text-slate-300 hover:bg-slate-800'}
                    `}
                  >
                    <span>{getTimeFrameLabel(frame)}</span>
                    {frame === filters.timeFrame && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset filters */}
          {hasActiveFilters && (
            <button
              onClick={actions.resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors"
            >
              <X className="w-3 h-3 text-red-400" />
              <span className="text-sm text-red-400">Reset</span>
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {isExpanded && (
          <div className="border-t border-slate-700/50 px-4 py-4 space-y-4 animate-filter-slide">
            {/* Search */}
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Search Skills</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    actions.updateFilters({ searchQuery: e.target.value })
                  }
                  placeholder="Type to search..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            {/* Domains */}
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Domains</label>
              <div className="flex flex-wrap gap-2">
                {domains.slice(0, 6).map((domain) => (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                      ${
                        filters.domains.includes(domain)
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                      }
                    `}
                  >
                    {getDomainLabel(domain)}
                  </button>
                ))}
              </div>
            </div>

            {/* Strength range */}
            <div>
              <label className="text-xs text-slate-400 mb-2 block">
                Strength Range: {filters.minValue}% - {filters.maxValue}%
              </label>
              <div className="flex gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minValue}
                  onChange={(e) =>
                    actions.updateFilters({ minValue: Number(e.target.value) })
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.maxValue}
                  onChange={(e) =>
                    actions.updateFilters({ maxValue: Number(e.target.value) })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            {/* Verified only */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="verified-only"
                checked={filters.showVerifiedOnly}
                onChange={(e) =>
                  actions.updateFilters({ showVerifiedOnly: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
              />
              <label htmlFor="verified-only" className="text-sm text-slate-300">
                Show verified skills only
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
