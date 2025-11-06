/**
 * Team Skills Heatmap Page
 * 
 * Enterprise data-viz heatmap comparing team skills.
 * Team avatars as columns, skills as rows, color intensity for proficiency.
 */

'use client';

import { useState } from 'react';
import { TeamHeatmapProvider, useTeamHeatmap } from '@/features/analytics/context/TeamSkillsHeatmapContext';
import { TeamSkillsHeatmapGrid } from '@/features/analytics/presentation/components/team-heatmap/TeamSkillsHeatmapGrid';
import { ProficiencyLegend } from '@/features/analytics/presentation/components/team-heatmap/ProficiencyLegend';
import { TeamInsightsPanel } from '@/features/analytics/presentation/components/team-heatmap/TeamInsightsPanel';
import {
  SkillCategory,
  getSkillCategoryLabel,
} from '@/features/analytics/types/team-skills-heatmap.types';
import {
  Users,
  Download,
  RefreshCw,
  Filter,
  Search,
  X,
  SlidersHorizontal,
} from 'lucide-react';

/**
 * Team Skills Heatmap Content
 */
const TeamSkillsHeatmapContent = () => {
  const { state, actions } = useTeamHeatmap();
  const { matrix, filters, isLoading, viewMode } = state;

  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    actions.updateFilters({ searchQuery: query });
  };

  const handleCategoryToggle = (category: SkillCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    actions.updateFilters({ categories: newCategories });
  };

  const handleExport = (format: 'json' | 'csv' | 'png') => {
    actions.exportHeatmap({
      format,
      includeMetadata: true,
      includeLegend: true,
      includeAnalysis: true,
      resolution: 'high',
    });
  };

  const activeFiltersCount =
    filters.categories.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.showGapsOnly ? 1 : 0) +
    (filters.showStrengthsOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Team Skills Heatmap
              </h1>
              <p className="text-sm text-slate-400">
                Compare team skills to identify gaps and strengths • {matrix?.teamName || 'Loading...'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
                  ${showFilters 
                    ? 'bg-indigo-500 text-white border-indigo-700' 
                    : 'bg-slate-800/50 text-white border-slate-700 hover:border-indigo-700'
                  }
                `}
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-white/20 text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </span>
              </button>

              <button
                onClick={() => actions.refreshData()}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-indigo-700 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium text-white">Refresh</span>
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:brightness-110 transition-all">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">Export</span>
                </button>

                {/* Export dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2">
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-white"
                    >
                      Export as JSON
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-white"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('png')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-white"
                    >
                      Export as Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchQuery && (
                <button aria-label="Clear search"
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <aside className="w-80 flex-shrink-0 space-y-6 animate-fade-in">
              {/* View mode */}
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                  View Mode
                </h3>

                <div className="space-y-2">
                  <button
                    onClick={() => actions.setViewMode('heatmap')}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      viewMode === 'heatmap'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Heatmap View
                  </button>
                  <button
                    onClick={() => actions.setViewMode('gaps')}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      viewMode === 'gaps'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Skill Gaps Only
                  </button>
                  <button
                    onClick={() => actions.setViewMode('comparison')}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      viewMode === 'comparison'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Comparison View
                  </button>
                </div>
              </div>

              {/* Category filters */}
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">
                    Skill Categories
                  </h3>
                  {filters.categories.length > 0 && (
                    <button
                      onClick={() => actions.updateFilters({ categories: [] })}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {Object.values(SkillCategory).slice(0, 8).map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-300 group-hover:text-indigo-400 transition-colors">
                        {getSkillCategoryLabel(category)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick filters */}
              <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Quick Filters
                </h3>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.showGapsOnly}
                      onChange={(e) =>
                        actions.updateFilters({ showGapsOnly: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-slate-300 group-hover:text-indigo-400 transition-colors">
                      Show gaps only
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters.showStrengthsOnly}
                      onChange={(e) =>
                        actions.updateFilters({ showStrengthsOnly: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-slate-300 group-hover:text-indigo-400 transition-colors">
                      Show strengths only
                    </span>
                  </label>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={actions.resetFilters}
                    className="mt-4 w-full px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>

              {/* Proficiency legend */}
              <ProficiencyLegend orientation="vertical" showDescriptions={false} />
            </aside>
          )}

          {/* Main heatmap */}
          <main className="flex-1 min-w-0">
            <div className="space-y-6">
              {/* Heatmap grid */}
              <TeamSkillsHeatmapGrid
                cellWidth={120}
                cellHeight={90}
                rowLabelWidth={200}
                showAvatarDetails={true}
              />
            </div>
          </main>

          {/* Insights panel */}
          <aside className="w-96 flex-shrink-0 animate-fade-in">
            <div className="sticky top-32">
              <TeamInsightsPanel maxGaps={5} maxStrengths={5} />
            </div>
          </aside>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-lg font-medium text-white">
                Loading team skills data...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Main page component with provider
 */
export default function TeamSkillsHeatmapPage() {
  return (
    <TeamHeatmapProvider>
      <TeamSkillsHeatmapContent />
    </TeamHeatmapProvider>
  );
}
