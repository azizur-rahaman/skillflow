'use client';

import React from 'react';
import { RefreshCw, Download, Share2, TrendingUp, Lightbulb, Target } from 'lucide-react';
import { SkillDNAProvider, useSkillDNA } from '@/features/skill-dna/context/SkillDNAContext';
import { SkillDNACard } from '@/features/skill-dna/presentation/components/SkillDNACard';
import { RecommendationPriority } from '@/features/skill-dna/types/skill-dna.types';

function SkillDNAContent() {
  const {
    dna,
    stats,
    recommendations,
    isLoading,
    refreshDNA,
    dismissRecommendation,
  } = useSkillDNA();

  if (!dna || !stats) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#94A3B8]">Loading your Skill DNA...</p>
        </div>
      </div>
    );
  }

  // Priority colors
  const getPriorityColor = (priority: RecommendationPriority) => {
    switch (priority) {
      case RecommendationPriority.CRITICAL:
        return { bg: 'from-[#EF4444]/20 to-[#EF4444]/10', border: 'border-[#EF4444]/30', text: 'text-[#EF4444]' };
      case RecommendationPriority.HIGH:
        return { bg: 'from-[#F59E0B]/20 to-[#F59E0B]/10', border: 'border-[#F59E0B]/30', text: 'text-[#F59E0B]' };
      case RecommendationPriority.MEDIUM:
        return { bg: 'from-[#22D3EE]/20 to-[#22D3EE]/10', border: 'border-[#22D3EE]/30', text: 'text-[#22D3EE]' };
      case RecommendationPriority.LOW:
        return { bg: 'from-[#6366F1]/20 to-[#6366F1]/10', border: 'border-[#6366F1]/30', text: 'text-[#6366F1]' };
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">
              Skill DNA
            </h1>
            <p className="text-[#94A3B8]">
              Your unique skill fingerprint and ecosystem visualization
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={refreshDNA}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#6366F1]/50 text-[#CBD5E1] hover:text-[#F8FAFC] transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#6366F1]/50 text-[#CBD5E1] hover:text-[#F8FAFC] transition-all duration-200">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white transition-all duration-200 shadow-lg shadow-[#6366F1]/25">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Main DNA Card */}
        <SkillDNACard
          dna={dna}
          stats={stats}
          showInsight={true}
          showLegend={true}
          interactive={true}
        />

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Specialization vs Balance */}
          <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-[#22D3EE]" />
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Profile Analysis</h3>
            </div>

            <div className="space-y-4">
              {/* Specialization */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#94A3B8]">Specialization</span>
                  <span className="text-sm font-semibold text-[#F8FAFC]">{stats.specializationScore}%</span>
                </div>
                <div className="w-full h-2 bg-[#0F172A]/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] rounded-full transition-all duration-500"
                    style={{ width: `${stats.specializationScore}%` }}
                  />
                </div>
              </div>

              {/* Balance */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#94A3B8]">Balance</span>
                  <span className="text-sm font-semibold text-[#F8FAFC]">{stats.balanceScore}%</span>
                </div>
                <div className="w-full h-2 bg-[#0F172A]/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#22D3EE] to-[#10B981] rounded-full transition-all duration-500"
                    style={{ width: `${stats.balanceScore}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[#0F172A]/40 border border-[#334155]/50">
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  {stats.specializationScore > 80 && stats.balanceScore < 60 && (
                    "You have deep specialization in specific areas. Consider expanding to complementary domains for T-shaped growth."
                  )}
                  {stats.balanceScore > 70 && stats.specializationScore < 70 && (
                    "You have a well-balanced skill set. Focus on deepening expertise in your core domain for greater impact."
                  )}
                  {stats.specializationScore > 70 && stats.balanceScore > 70 && (
                    "Excellent balance! You have both deep expertise and broad knowledge—ideal for senior technical roles."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Growth Trajectory */}
          <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#10B981]" />
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Growth Potential</h3>
            </div>

            <div className="space-y-3">
              {/* Dominant Domain */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/10 border border-[#10B981]/30">
                <div className="text-xs text-[#94A3B8] mb-1">Strongest Domain</div>
                <div className="text-sm font-semibold text-[#10B981] capitalize">
                  {stats.strongestDomain.replace('_', ' ')}
                </div>
              </div>

              {/* Secondary Domains */}
              {dna.secondaryDomains.length > 0 && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-[#22D3EE]/20 to-[#22D3EE]/10 border border-[#22D3EE]/30">
                  <div className="text-xs text-[#94A3B8] mb-1">Secondary Strengths</div>
                  <div className="flex flex-wrap gap-2">
                    {dna.secondaryDomains.map((domain, i) => (
                      <span key={i} className="text-sm font-medium text-[#22D3EE] capitalize">
                        {domain.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Growth Opportunity */}
              {stats.weakestDomain && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/10 border border-[#F59E0B]/30">
                  <div className="text-xs text-[#94A3B8] mb-1">Growth Opportunity</div>
                  <div className="text-sm font-semibold text-[#F59E0B] capitalize">
                    {stats.weakestDomain.replace('_', ' ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Skill Recommendations</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#22D3EE] text-xs font-semibold">
                {recommendations.length}
              </span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => {
                const colors = getPriorityColor(rec.priority);
                
                return (
                  <div
                    key={rec.id}
                    className={`group p-4 rounded-xl bg-gradient-to-r ${colors.bg} border ${colors.border} transition-all duration-200 hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-base font-semibold text-[#F8FAFC]">
                            {rec.skillName}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.text} bg-[#0F172A]/40 capitalize`}>
                            {rec.priority}
                          </span>
                          <span className="text-xs text-[#64748B] capitalize">
                            {rec.domain.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-sm text-[#CBD5E1] mb-3">
                          {rec.reason}
                        </p>

                        {/* Impact meter */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#94A3B8]">Estimated Impact:</span>
                          <div className="flex-1 max-w-xs h-1.5 bg-[#0F172A]/60 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${colors.text} transition-all duration-500`}
                              style={{ 
                                width: `${rec.estimatedImpact}%`,
                                backgroundColor: 'currentColor',
                              }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${colors.text}`}>
                            {rec.estimatedImpact}%
                          </span>
                        </div>

                        {/* Related skills */}
                        {rec.relatedSkills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs text-[#64748B]">Related:</span>
                            {rec.relatedSkills.map((skill, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded bg-[#0F172A]/40 text-[#94A3B8]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => dismissRecommendation(rec.id)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1 rounded-lg text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0F172A]/40 transition-all duration-200"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SkillDNAPage() {
  return (
    <SkillDNAProvider>
      <SkillDNAContent />
    </SkillDNAProvider>
  );
}
