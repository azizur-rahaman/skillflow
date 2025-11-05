/**
 * Skill Heatmap Page
 * 
 * Interactive heatmap visualization for comparing skill strength 
 * across domains and teams.
 */

'use client';

import { useState } from 'react';
import { RefreshCw, Download, Palette, TrendingUp, BarChart3 } from 'lucide-react';
import { HeatmapProvider, useHeatmap } from '@/features/skill-heatmap/context/HeatmapContext';
import { HeatmapGrid } from '@/features/skill-heatmap/presentation/components/HeatmapGrid';
import { FilterBar } from '@/features/skill-heatmap/presentation/components/FilterBar';
import {
  ColorScheme,
  getCompetencyColor,
  ExportConfig,
} from '@/features/skill-heatmap/types/heatmap.types';

const HeatmapPageContent = () => {
  const { state, actions } = useHeatmap();
  const { matrix, legendConfig, comparisonData, isLoading, colorScheme } = state;

  const [showColorSchemeMenu, setShowColorSchemeMenu] = useState(false);

  const handleExport = (format: 'png' | 'svg' | 'csv' | 'json') => {
    const config: ExportConfig = {
      format,
      includeFilters: true,
      includeLegend: true,
      includeMetadata: true,
      resolution: 'high',
    };
    actions.exportHeatmap(config);
  };

  const colorSchemes = [
    { value: ColorScheme.COOL_TO_WARM, label: 'Cool to Warm', gradient: 'from-blue-500 to-red-500' },
    { value: ColorScheme.MONOCHROME, label: 'Monochrome', gradient: 'from-slate-800 to-slate-100' },
    { value: ColorScheme.VIRIDIS, label: 'Viridis', gradient: 'from-purple-900 via-green-500 to-yellow-400' },
    { value: ColorScheme.CUSTOM, label: 'Custom', gradient: 'from-indigo-500 via-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      </div>

      {/* Filter bar */}
      <FilterBar />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Skill Heatmap
              </h1>
              <p className="text-slate-400 max-w-2xl">
                Compare skill strength across domains and teams with interactive 
                color-coded visualization.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Refresh */}
              <button
                onClick={actions.refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm text-slate-300">Refresh</span>
              </button>

              {/* Color scheme */}
              <div className="relative">
                <button
                  onClick={() => setShowColorSchemeMenu(!showColorSchemeMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-colors"
                >
                  <Palette className="w-4 h-4 text-violet-400" />
                  <span className="text-sm text-slate-300">Colors</span>
                </button>

                {/* Color scheme menu */}
                {showColorSchemeMenu && (
                  <div className="absolute top-full mt-2 right-0 min-w-[200px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.value}
                        onClick={() => {
                          actions.setColorScheme(scheme.value);
                          setShowColorSchemeMenu(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors
                          ${scheme.value === colorScheme ? 'bg-violet-500/20' : 'hover:bg-slate-800'}
                        `}
                      >
                        <div className={`w-8 h-4 rounded bg-gradient-to-r ${scheme.gradient}`} />
                        <span className="text-slate-300">{scheme.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25">
                  <Download className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Export</span>
                </button>

                {/* Export menu */}
                <div className="absolute top-full mt-2 right-0 min-w-[120px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {['png', 'svg', 'csv', 'json'].map((format) => (
                    <button
                      key={format}
                      onClick={() => handleExport(format as any)}
                      className="w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors text-left"
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Heatmap */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <HeatmapGrid
                cellSize={48}
                gap={4}
                showRowLabels={true}
                showColumnLabels={true}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Legend */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Color Scale
              </h3>
              <div className="space-y-3">
                {legendConfig.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 animate-legend-fade">
                    <div
                      className="w-8 h-8 rounded-lg shadow-lg"
                      style={{ backgroundColor: step.color }}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-slate-300">{step.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gradient preview */}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="h-4 rounded-lg bg-gradient-to-r from-blue-500 via-green-500 to-red-500" />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">0%</span>
                  <span className="text-xs text-slate-400">100%</span>
                </div>
              </div>
            </div>

            {/* Domain comparison */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                Top Domains
              </h3>
              <div className="space-y-4">
                {comparisonData.slice(0, 4).map((domain) => (
                  <div key={domain.id} className="animate-domain-fade">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-300">
                        {domain.name}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {domain.averageStrength}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
                        style={{ width: `${domain.averageStrength}%` }}
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-slate-500">
                        {domain.totalSkills} skills
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-white mb-4">
                Matrix Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Skills</span>
                  <span className="text-sm font-semibold text-white">
                    {matrix?.rows.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Categories</span>
                  <span className="text-sm font-semibold text-white">
                    {matrix?.columns.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Avg Strength</span>
                  <span className="text-sm font-semibold text-white">
                    {matrix
                      ? Math.round(matrix.rows.reduce((sum, row) => sum + row.averageValue, 0) /
                          (matrix.rows.length || 1))
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SkillHeatmapPage() {
  return (
    <HeatmapProvider>
      <HeatmapPageContent />
    </HeatmapProvider>
  );
}
