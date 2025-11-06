/**
 * Skill Graph Widget
 * 
 * Interactive circular/radial visualization of candidate's skill network
 * showing domain clusters, confidence levels, and skill relationships.
 */

'use client';

import { useState } from 'react';
import { SkillDNAProfile, DomainBreakdown, SkillWithConfidence } from '@/features/candidate-profile/types/profile.types';
import { TrendingUp, Award, Clock, ChevronRight } from 'lucide-react';

interface SkillGraphWidgetProps {
  skillDNA: SkillDNAProfile;
  onSkillClick?: (skillId: string) => void;
}

export const SkillGraphWidget = ({ skillDNA, onSkillClick }: SkillGraphWidgetProps) => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  const filteredSkills = selectedDomain
    ? skillDNA.topSkills.filter(s => 
        skillDNA.domains.find(d => d.domain === selectedDomain)?.domain === s.category
      )
    : skillDNA.topSkills.slice(0, 12);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Skill DNA</h2>
          <p className="text-sm text-slate-400">
            Interactive skill network with confidence scoring
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
            {Math.round(skillDNA.overallConfidence)}%
          </div>
          <div className="text-xs text-slate-400">Overall Confidence</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Radial Visualization */}
        <div className="relative">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 p-8 overflow-hidden">
            {/* Concentric Rings Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[100, 80, 60, 40, 20].map((size) => (
                <div
                  key={size}
                  className="absolute rounded-full border border-slate-700/30"
                  style={{
                    width: `${size}%`,
                    height: `${size}%`,
                  }}
                />
              ))}
              
              {/* Center Confidence Indicator */}
              <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.round(skillDNA.overallConfidence)}
                  </div>
                  <div className="text-xs text-white/80">Score</div>
                </div>
              </div>
            </div>
            
            {/* Skill Nodes (positioned in circle) */}
            <div className="relative w-full h-full">
              {skillDNA.domains.slice(0, 6).map((domain, index) => {
                const angle = (index / 6) * 2 * Math.PI - Math.PI / 2;
                const radius = 35; // percentage
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                
                return (
                  <button
                    key={domain.domain}
                    onClick={() => setSelectedDomain(
                      selectedDomain === domain.domain ? null : domain.domain
                    )}
                    className="absolute group transition-all duration-300 hover:scale-110"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Connection Line to Center */}
                    <svg className="absolute inset-0 pointer-events-none -z-10" style={{ width: '200%', height: '200%', left: '-50%', top: '-50%' }}>
                      <line
                        x1="50%"
                        y1="50%"
                        x2={`${(x - 50) / 2 + 50}%`}
                        y2={`${(y - 50) / 2 + 50}%`}
                        stroke={selectedDomain === domain.domain ? domain.color : 'rgba(148, 163, 184, 0.3)'}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                    </svg>
                    
                    {/* Node */}
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 ${
                        selectedDomain === domain.domain
                          ? 'border-white scale-110'
                          : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: `${domain.color}20`,
                        boxShadow: selectedDomain === domain.domain 
                          ? `0 0 20px ${domain.color}80`
                          : `0 0 12px ${domain.color}40`,
                      }}
                    >
                      <div className="text-center">
                        <div 
                          className="text-sm font-bold"
                          style={{ color: domain.color }}
                        >
                          {Math.round(domain.avgConfidence)}
                        </div>
                        <div className="text-[10px] text-white/80">
                          {domain.skillCount}
                        </div>
                      </div>
                    </div>
                    
                    {/* Label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div 
                        className="text-xs font-medium px-2 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${domain.color}15`,
                          color: domain.color,
                        }}
                      >
                        {domain.domain}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <span>0-40</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>41-70</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
              <span>71-100</span>
            </div>
          </div>
        </div>
        
        {/* Right: Skill List & Domains */}
        <div className="space-y-4">
          {/* Domain Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDomain(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedDomain === null
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-indigo-500'
              }`}
            >
              All Skills
            </button>
            {skillDNA.domains.map((domain) => (
              <button
                key={domain.domain}
                onClick={() => setSelectedDomain(
                  selectedDomain === domain.domain ? null : domain.domain
                )}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedDomain === domain.domain
                    ? 'text-white'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-indigo-500'
                }`}
                style={selectedDomain === domain.domain ? {
                  backgroundColor: domain.color,
                } : {}}
              >
                {domain.domain}
                <span className="ml-1.5 text-xs opacity-75">
                  {domain.skillCount}
                </span>
              </button>
            ))}
          </div>
          
          {/* Top Skills List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredSkills.map((skill) => (
              <button
                key={skill.skillId}
                onClick={() => onSkillClick?.(skill.skillId)}
                onMouseEnter={() => setHoveredSkill(skill.skillId)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="w-full p-4 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 hover:border-indigo-500 transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {skill.name}
                      </span>
                      {skill.isVerified && (
                        <Award className="w-4 h-4 text-emerald-400" />
                      )}
                      {skill.isTrending && (
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="capitalize">{skill.proficiencyLevel}</span>
                      <span>•</span>
                      <span>{skill.yearsOfExperience} yr{skill.yearsOfExperience !== 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(skill.lastUsed).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                      {Math.round(skill.confidence)}%
                    </div>
                    {skill.endorsementCount > 0 && (
                      <div className="text-xs text-amber-400">
                        {skill.endorsementCount} endorsement{skill.endorsementCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Confidence Bar */}
                <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${skill.confidence}%`,
                      background: skill.confidence >= 80
                        ? 'linear-gradient(90deg, #22D3EE, #6366F1)'
                        : skill.confidence >= 60
                        ? 'linear-gradient(90deg, #6366F1, #A855F7)'
                        : 'linear-gradient(90deg, #64748B, #6366F1)',
                    }}
                  />
                </div>
                
                {/* Hover Arrow */}
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
          
          {/* Emerging Skills */}
          {skillDNA.emergingSkills.length > 0 && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30">
              <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Emerging Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillDNA.emergingSkills.slice(0, 6).map((skill) => (
                  <div
                    key={skill.skillId}
                    className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-700 text-sm"
                  >
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="ml-2 text-cyan-400">{Math.round(skill.confidence)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
          <div className="text-2xl font-bold text-white mb-1">
            {skillDNA.totalSkills}
          </div>
          <div className="text-xs text-slate-400">Total Skills</div>
        </div>
        
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {skillDNA.verifiedSkills}
          </div>
          <div className="text-xs text-slate-400">Verified</div>
        </div>
        
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {skillDNA.domains.length}
          </div>
          <div className="text-xs text-slate-400">Domains</div>
        </div>
        
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
          <div className="text-2xl font-bold text-cyan-400 mb-1">
            {skillDNA.emergingSkills.length}
          </div>
          <div className="text-xs text-slate-400">Emerging</div>
        </div>
      </div>
    </div>
  );
};
