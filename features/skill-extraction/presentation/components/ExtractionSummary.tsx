'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Clock, TrendingUp, Database } from 'lucide-react';
import type { ExtractionSummaryProps } from '../../types/skill-extraction.types';

export function ExtractionSummary({ stats, currentJob }: ExtractionSummaryProps) {
  const confidencePercentage = Math.round(stats.averageConfidence);

  // Get top sources
  const topSources = Object.entries(stats.sourceBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Skills */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-xl border border-[#334155] p-4 hover:border-[#6366F1]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#6366F1]/20 to-[#A855F7]/20 group-hover:from-[#6366F1]/30 group-hover:to-[#A855F7]/30 transition-all duration-300">
              <Database className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
            {stats.totalSkills}
          </div>
          <div className="text-sm text-[#94A3B8]">Total Skills</div>
        </div>

        {/* Verified Skills */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-xl border border-[#334155] p-4 hover:border-[#10B981]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/10 group-hover:from-[#10B981]/30 group-hover:to-[#10B981]/20 transition-all duration-300">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981]">
              {stats.totalSkills > 0 
                ? Math.round((stats.verifiedSkills / stats.totalSkills) * 100) 
                : 0}%
            </div>
          </div>
          <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
            {stats.verifiedSkills}
          </div>
          <div className="text-sm text-[#94A3B8]">AI Verified</div>
        </div>

        {/* Pending Review */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-xl border border-[#334155] p-4 hover:border-[#F59E0B]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10 group-hover:from-[#F59E0B]/30 group-hover:to-[#F59E0B]/20 transition-all duration-300">
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B]">
              {stats.totalSkills > 0 
                ? Math.round((stats.pendingSkills / stats.totalSkills) * 100) 
                : 0}%
            </div>
          </div>
          <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
            {stats.pendingSkills}
          </div>
          <div className="text-sm text-[#94A3B8]">Pending Review</div>
        </div>

        {/* Average Confidence */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-xl border border-[#334155] p-4 hover:border-[#22D3EE]/50 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#22D3EE]/20 to-[#22D3EE]/10 group-hover:from-[#22D3EE]/30 group-hover:to-[#22D3EE]/20 transition-all duration-300 animate-badge-shimmer">
              <Sparkles className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <div className={`
              text-xs font-medium px-2 py-0.5 rounded-full
              ${confidencePercentage >= 80 
                ? 'bg-[#10B981]/20 text-[#10B981]' 
                : confidencePercentage >= 60 
                  ? 'bg-[#F59E0B]/20 text-[#F59E0B]' 
                  : 'bg-[#EF4444]/20 text-[#EF4444]'
              }
            `}>
              {confidencePercentage >= 80 ? 'High' : confidencePercentage >= 60 ? 'Medium' : 'Low'}
            </div>
          </div>
          <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
            {confidencePercentage}%
          </div>
          <div className="text-sm text-[#94A3B8]">Avg Confidence</div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Confidence Distribution */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-xl border border-[#334155] p-5">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
            Confidence Distribution
          </h3>
          
          <div className="space-y-3">
            {/* High Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#22D3EE]">High (80%+)</span>
                <span className="text-sm font-semibold text-[#F8FAFC]">
                  {stats.highConfidenceSkills}
                </span>
              </div>
              <div className="w-full h-2 bg-[#0F172A]/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#22D3EE] to-[#6366F1] rounded-full transition-all duration-500 animate-confidence-fill"
                  style={{ 
                    width: stats.totalSkills > 0 
                      ? `${(stats.highConfidenceSkills / stats.totalSkills) * 100}%` 
                      : '0%'
                  }}
                />
              </div>
            </div>

            {/* Medium Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#F59E0B]">Medium (60-79%)</span>
                <span className="text-sm font-semibold text-[#F8FAFC]">
                  {stats.mediumConfidenceSkills}
                </span>
              </div>
              <div className="w-full h-2 bg-[#0F172A]/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/80 rounded-full transition-all duration-500 animate-confidence-fill"
                  style={{ 
                    width: stats.totalSkills > 0 
                      ? `${(stats.mediumConfidenceSkills / stats.totalSkills) * 100}%` 
                      : '0%',
                    animationDelay: '200ms'
                  }}
                />
              </div>
            </div>

            {/* Low Confidence */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#EF4444]">Low (&lt;60%)</span>
                <span className="text-sm font-semibold text-[#F8FAFC]">
                  {stats.lowConfidenceSkills}
                </span>
              </div>
              <div className="w-full h-2 bg-[#0F172A]/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#EF4444] to-[#EF4444]/80 rounded-full transition-all duration-500 animate-confidence-fill"
                  style={{ 
                    width: stats.totalSkills > 0 
                      ? `${(stats.lowConfidenceSkills / stats.totalSkills) * 100}%` 
                      : '0%',
                    animationDelay: '400ms'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Sources */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-xl border border-[#334155] p-5">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#22D3EE]" />
            Top Extraction Sources
          </h3>
          
          <div className="space-y-3">
            {topSources.map(([source, count], index) => (
              <div key={source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#CBD5E1] capitalize">
                    {source.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-semibold text-[#F8FAFC]">{count}</span>
                </div>
                <div className="w-full h-2 bg-[#0F172A]/60 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 animate-confidence-fill ${
                      index === 0 
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#A855F7]' 
                        : index === 1 
                          ? 'bg-gradient-to-r from-[#22D3EE] to-[#6366F1]' 
                          : 'bg-gradient-to-r from-[#A855F7] to-[#22D3EE]'
                    }`}
                    style={{ 
                      width: stats.totalSkills > 0 
                        ? `${(count / stats.totalSkills) * 100}%` 
                        : '0%',
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Job Status */}
      {currentJob && currentJob.status === 'processing' && (
        <div className="bg-gradient-to-br from-[#6366F1]/20 to-[#A855F7]/20 rounded-xl border border-[#6366F1]/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] flex items-center justify-center animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#F8FAFC]">
                  Extracting skills from {currentJob.source}...
                </div>
                <div className="text-xs text-[#CBD5E1]">
                  {currentJob.fileName}
                </div>
              </div>
            </div>
            <div className="text-lg font-bold text-[#22D3EE]">
              {currentJob.progress}%
            </div>
          </div>
          
          <div className="w-full h-2 bg-[#0F172A]/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#22D3EE] rounded-full transition-all duration-300"
              style={{ width: `${currentJob.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
