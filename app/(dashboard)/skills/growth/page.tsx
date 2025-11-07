/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Skill Growth Rings Page
 * 
 * Displays animated concentric rings visualization showing skill progression over time.
 * Features time controls, domain filtering, and growth insights.
 */

'use client';

import React from 'react';
import {
  RefreshCw,
  Download,
  Sparkles,
  Award,
  TrendingUp,
  Flame,
  Target,
  BarChart3,
} from 'lucide-react';
import { GrowthRingsProvider, useGrowthRings } from '@/features/growth-rings/context/GrowthRingsContext';
import { GrowthRingsVisualization } from '@/features/growth-rings/presentation/components/GrowthRingsVisualization';
import { getDomainLabel } from '@/features/growth-rings/types/growth-rings.types';

function GrowthRingsContent() {
  const { state, actions } = useGrowthRings();

  const handleRefresh = async () => {
    await actions.refreshData();
  };

  const handleExport = () => {
    actions.exportData('png');
  };

  const getInsightIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Award,
      TrendingUp,
      Flame,
      Target,
    };
    return icons[iconName] || Sparkles;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">
              Skill Growth Rings
            </h1>
            <p className="text-[#94A3B8]">
              Visualize your skill progression over time with concentric growth patterns
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={state.isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#CBD5E1] hover:text-[#F8FAFC] transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${state.isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#CBD5E1] hover:text-[#F8FAFC] transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Visualization */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Visualization */}
            <GrowthRingsVisualization
              size={600}
              showControls={true}
              showLegend={true}
            />

            {/* Skill Progressions */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-5 h-5 text-[#22D3EE]" />
                <h3 className="text-lg font-semibold text-[#F8FAFC]">Top Skill Progressions</h3>
              </div>

              <div className="space-y-4">
                {state.skillProgressions.map((progression, index) => (
                  <div
                    key={progression.skillName}
                    className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: state.domainStats.find(d => d.domain === progression.domain)?.color }}
                        />
                        <span className="text-sm font-semibold text-[#F8FAFC]">
                          {progression.skillName}
                        </span>
                      </div>

                      <span className="text-sm font-semibold text-[#10B981]">
                        +{progression.overallGrowth.toFixed(1)}%
                      </span>
                    </div>

                    {/* Mini sparkline */}
                    <div className="flex items-end gap-1 h-12">
                      {progression.dataPoints.map((point, idx) => {
                        const height = (point.strength / progression.peakStrength) * 100;
                        return (
                          <div
                            key={idx}
                            className="flex-1 rounded-t bg-gradient-to-t from-[#6366F1] to-[#A855F7] opacity-60 hover:opacity-100 transition-opacity duration-200"
                            style={{ height: `${height}%` }}
                            title={`${point.strength.toFixed(1)}%`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-[#64748B]">
                      <span>{getDomainLabel(progression.domain)}</span>
                      <span>Current: {progression.currentStrength.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Insights */}
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#A855F7]" />
                <h3 className="text-lg font-semibold text-[#F8FAFC]">Growth Summary</h3>
              </div>

              <div className="space-y-4">
                {/* Total Skills */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#6366F1]/10 to-transparent border border-[#6366F1]/20">
                  <div className="text-xs text-[#94A3B8] mb-1">Total Skills Tracked</div>
                  <div className="text-2xl font-bold text-[#F8FAFC]">
                    {state.domainStats.reduce((sum, d) => sum + d.skillCount, 0)}
                  </div>
                </div>

                {/* Average Growth */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/20">
                  <div className="text-xs text-[#94A3B8] mb-1">Average Monthly Growth</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#F8FAFC]">
                      {(state.domainStats.reduce((sum, d) => sum + d.averageGrowth, 0) / state.domainStats.length).toFixed(1)}
                    </span>
                    <span className="text-sm text-[#10B981]">%</span>
                  </div>
                </div>

                {/* Active Domains */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#22D3EE]/10 to-transparent border border-[#22D3EE]/20">
                  <div className="text-xs text-[#94A3B8] mb-1">Active Domains</div>
                  <div className="text-2xl font-bold text-[#F8FAFC]">
                    {state.domainStats.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Insights */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-lg font-semibold text-[#F8FAFC]">Growth Insights</h3>
              </div>

              <div className="space-y-3">
                {state.insights.map((insight, index) => {
                  const Icon = getInsightIcon(insight.icon);
                  
                  return (
                    <div
                      key={insight.id}
                      className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${insight.color}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: insight.color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#F8FAFC] mb-1">
                            {insight.title}
                          </div>
                          <div className="text-xs text-[#94A3B8] leading-relaxed">
                            {insight.description}
                          </div>

                          {insight.relatedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {insight.relatedSkills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-[#CBD5E1] border border-white/10"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Period Stats */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <h3 className="text-sm font-semibold text-[#CBD5E1] mb-4">Monthly Growth Rate</h3>
              
              <div className="space-y-2">
                {state.timeSegments.slice().reverse().map((segment, index) => (
                  <div
                    key={segment.id}
                    className="flex items-center gap-3"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="text-xs text-[#64748B] w-20">
                      {segment.label}
                    </div>
                    
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] transition-all duration-500"
                        style={{ width: `${Math.min((segment.totalGrowth / 50) * 100, 100)}%` }}
                      />
                    </div>

                    <div className="text-xs font-semibold text-[#22D3EE] w-12 text-right">
                      +{segment.totalGrowth.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GrowthRingsPage() {
  return (
    <GrowthRingsProvider>
      <GrowthRingsContent />
    </GrowthRingsProvider>
  );
}
