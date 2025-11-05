/**
 * Skill Summary Card Component
 * 
 * Compact overview of user's skill profile with distribution and top domains.
 * Shows total skills, verification status, and strength breakdown.
 */

'use client';

import React from 'react';
import { Award, CheckCircle2, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { SkillSummary, SkillGrowth } from '../../types/dashboard.types';

interface SkillSummaryCardProps {
  summary: SkillSummary;
  topGrowth?: SkillGrowth[];
  showDistribution?: boolean;
}

export function SkillSummaryCard({ 
  summary, 
  topGrowth = [],
  showDistribution = true 
}: SkillSummaryCardProps) {
  const router = useRouter();

  const distributionData = [
    { label: 'Expert', count: summary.strengthDistribution.expert, color: '#10B981', percentage: 0 },
    { label: 'Advanced', count: summary.strengthDistribution.advanced, color: '#6366F1', percentage: 0 },
    { label: 'Intermediate', count: summary.strengthDistribution.intermediate, color: '#22D3EE', percentage: 0 },
    { label: 'Beginner', count: summary.strengthDistribution.beginner, color: '#94A3B8', percentage: 0 },
  ];

  // Calculate percentages
  distributionData.forEach(item => {
    item.percentage = (item.count / summary.totalSkills) * 100;
  });

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#A855F7] flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Skill Profile</h3>
              <p className="text-sm text-[#94A3B8]">Your expertise overview</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/skills/dna')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] text-sm transition-all duration-200"
          >
            <span>View DNA</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {/* Total Skills */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#6366F1]/10 to-transparent border border-[#6366F1]/20">
          <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
            {summary.totalSkills}
          </div>
          <div className="text-sm text-[#94A3B8]">Total Skills</div>
        </div>

        {/* Verified Skills */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/20">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-[#F8FAFC]">
              {summary.verifiedSkills}
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-sm text-[#94A3B8]">Verified</div>
        </div>

        {/* Top Domain */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#A855F7]/10 to-transparent border border-[#A855F7]/20">
          <div className="text-sm text-[#94A3B8] mb-1">Top Domain</div>
          <div className="font-semibold text-[#F8FAFC]">{summary.topDomain}</div>
          <div className="text-xs text-[#A855F7] mt-1">{summary.topDomainStrength}% strength</div>
        </div>

        {/* Average Strength */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#22D3EE]/10 to-transparent border border-[#22D3EE]/20">
          <div className="text-sm text-[#94A3B8] mb-1">Avg. Strength</div>
          <div className="text-2xl font-bold text-[#F8FAFC]">
            {summary.averageStrength}%
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      {showDistribution && (
        <div className="px-6 pb-6">
          <div className="text-sm font-medium text-[#CBD5E1] mb-3">
            Strength Distribution
          </div>

          {/* Stacked Bar */}
          <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
            {distributionData.map((item) => (
              item.count > 0 && (
                <div
                  key={item.label}
                  className="h-full transition-all duration-500 hover:opacity-80"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.label}: ${item.count} skills`}
                />
              )
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {distributionData.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs text-[#94A3B8]">
                  {item.label}
                  <span className="ml-1 text-[#64748B]">({item.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Growth Skills */}
      {topGrowth.length > 0 && (
        <div className="px-6 pb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-[#CBD5E1] mb-3">
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span>Top Growth (Last 30 Days)</span>
          </div>

          <div className="space-y-2">
            {topGrowth.slice(0, 3).map((skill) => (
              <div
                key={skill.skillName}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#F8FAFC] mb-0.5">
                    {skill.skillName}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    {skill.domain}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-[#10B981]">
                    +{skill.growthRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-[#94A3B8]">
                    {skill.currentStrength}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="px-6 pb-6 flex items-center gap-4">
        {summary.emergingSkills > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-[#22D3EE]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{summary.emergingSkills} emerging</span>
          </div>
        )}
        
        {summary.obsoleteRisk > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-[#F59E0B]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{summary.obsoleteRisk} at risk</span>
          </div>
        )}
      </div>
    </div>
  );
}
