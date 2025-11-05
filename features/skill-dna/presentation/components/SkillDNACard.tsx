'use client';

import React, { useState } from 'react';
import { TrendingUp, Award, Target } from 'lucide-react';
import type { SkillDNACardProps } from '../../types/skill-dna.types';
import { SkillDomain } from '../../types/skill-dna.types';
import { RadarChart } from './RadarChart';
import { InsightBadge } from './InsightBadge';

export function SkillDNACard({
  dna,
  stats,
  showInsight = true,
  showLegend = true,
  interactive = true,
  onDomainClick,
}: SkillDNACardProps) {
  const [selectedDomain, setSelectedDomain] = useState<SkillDomain | null>(null);

  const handleDomainClick = (domain: SkillDomain) => {
    if (!interactive) return;
    setSelectedDomain(selectedDomain === domain ? null : domain);
    onDomainClick?.(domain);
  };

  // Get selected domain data
  const selectedDomainData = selectedDomain 
    ? dna.radarData.find(d => d.domain === selectedDomain)
    : null;

  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-3xl border border-[#334155] p-8 backdrop-blur-sm relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#6366F1]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#A855F7]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1]/20 to-[#A855F7]/20 border border-[#6366F1]/30 mb-4">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] animate-pulse" />
            <span className="text-sm font-semibold text-[#22D3EE]">Skill DNA Fingerprint</span>
          </div>
          
          <h2 className="text-3xl font-bold text-[#F8FAFC] mb-2">
            Your Skill Ecosystem
          </h2>
          <p className="text-[#94A3B8]">
            Visual fingerprint of your expertise across {stats.activeDomains} domains
          </p>
        </div>

        {/* Main Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#0F172A]/60 to-[#0F172A]/40 rounded-xl border border-[#334155]/50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-4 h-4 text-[#22D3EE]" />
              <span className="text-xs text-[#94A3B8]">Overall Strength</span>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] to-[#22D3EE] bg-clip-text text-transparent">
              {Math.round(dna.overallStrength)}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0F172A]/60 to-[#0F172A]/40 rounded-xl border border-[#334155]/50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span className="text-xs text-[#94A3B8]">Total Skills</span>
            </div>
            <div className="text-3xl font-bold text-[#F8FAFC]">
              {dna.totalSkills}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0F172A]/60 to-[#0F172A]/40 rounded-xl border border-[#334155]/50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-4 h-4 text-[#A855F7]" />
              <span className="text-xs text-[#94A3B8]">Balance Score</span>
            </div>
            <div className="text-3xl font-bold text-[#F8FAFC]">
              {stats.balanceScore}%
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="flex justify-center mb-8">
          <RadarChart
            data={dna.radarData}
            size={500}
            showLabels={true}
            showGrid={true}
            animated={true}
            glowIntensity={0.6}
            onAxisClick={interactive ? handleDomainClick : undefined}
          />
        </div>

        {/* Insight Badge */}
        {showInsight && (
          <div className="mb-8">
            <InsightBadge
              insight={dna.insight}
              size="large"
              animated={true}
            />
          </div>
        )}

        {/* Domain Legend */}
        {showLegend && (
          <div className="space-y-3">
            <div className="text-sm font-semibold text-[#F8FAFC] mb-3 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-[#6366F1] to-[#A855F7] rounded-full" />
              Skill Domains
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {dna.radarData.map((domain, index) => (
                <button
                  key={domain.domain}
                  onClick={() => handleDomainClick(domain.domain)}
                  disabled={!interactive}
                  className={`
                    group flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                    ${selectedDomain === domain.domain
                      ? 'bg-gradient-to-r from-[#6366F1]/20 to-[#A855F7]/20 border-[#6366F1]'
                      : 'bg-[#0F172A]/40 border-[#334155]/50 hover:border-[#6366F1]/50'
                    }
                    ${interactive ? 'cursor-pointer' : 'cursor-default'}
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {/* Color indicator */}
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: domain.color,
                        boxShadow: `0 0 12px ${domain.color}60`,
                      }}
                    />
                    
                    {/* Domain name */}
                    <div className="text-sm font-medium text-[#F8FAFC]">
                      {domain.label}
                    </div>
                    
                    {/* Skill count */}
                    <div className="text-xs text-[#64748B]">
                      {domain.skillCount} skills
                    </div>
                  </div>

                  {/* Strength bar */}
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-[#0F172A]/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${domain.strength}%`,
                          backgroundColor: domain.color,
                          boxShadow: `0 0 8px ${domain.color}40`,
                        }}
                      />
                    </div>
                    
                    {/* Strength percentage */}
                    <div
                      className="text-sm font-bold min-w-[3rem] text-right"
                      style={{ color: domain.color }}
                    >
                      {domain.strength}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Domain Detail */}
        {selectedDomainData && interactive && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#6366F1]/10 to-[#A855F7]/10 border border-[#6366F1]/30 animate-zone-fade">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedDomainData.color }}
              />
              <span className="text-sm font-semibold text-[#F8FAFC]">
                {selectedDomainData.label} Top Skills
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedDomainData.topSkills.map((skill, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-[#0F172A]/60 border border-[#334155]/50 text-sm text-[#CBD5E1]"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
