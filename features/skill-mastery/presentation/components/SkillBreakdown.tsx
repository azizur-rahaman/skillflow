'use client';

import React, { useState } from 'react';
import { ChevronRight, TrendingUp, Filter, Search } from 'lucide-react';
import {
  SkillMastery,
  SkillCategory,
  formatPercentage,
  getCategoryColor,
  getTrendIcon,
  getTrendColor,
  getDeltaColor,
} from '../../types/skill-mastery.types';
import { MasteryGauge } from './MasteryGauge';
import { ConfidenceGauge } from './ConfidenceGauge';
import { DeltaIndicator } from './DeltaIndicator';

/**
 * Props for SkillBreakdown component
 */
interface SkillBreakdownProps {
  skills: SkillMastery[];
  onSelectSkill?: (skillId: string) => void;
  selectedSkillId?: string | null;
}

/**
 * Skill breakdown grid showing per-skill dual scores
 * Features: mini gauges, category filters, search, detailed modal view
 */
export const SkillBreakdown: React.FC<SkillBreakdownProps> = ({
  skills,
  onSelectSkill,
  selectedSkillId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | null>(null);
  const [sortBy, setSortBy] = useState<'mastery' | 'confidence' | 'delta'>('mastery');

  // Get selected skill details
  const selectedSkill = skills.find((s) => s.id === selectedSkillId);

  // Filter and sort skills
  const filteredSkills = skills
    .filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryFilter || skill.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'mastery') return b.aiMastery - a.aiMastery;
      if (sortBy === 'confidence') return b.selfConfidence - a.selfConfidence;
      return Math.abs(b.delta) - Math.abs(a.delta);
    });

  // Get unique categories
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={categoryFilter || ''}
            onChange={(e) => setCategoryFilter((e.target.value as SkillCategory) || null)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
        >
          <option value="mastery">Sort by Mastery</option>
          <option value="confidence">Sort by Confidence</option>
          <option value="delta">Sort by Delta</option>
        </select>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => {
          const isSelected = skill.id === selectedSkillId;
          const categoryColor = getCategoryColor(skill.category);
          const deltaColor = getDeltaColor(skill.deltaType);
          const trendColor = getTrendColor(skill.trend);

          return (
            <button
              key={skill.id}
              onClick={() => onSelectSkill?.(skill.id)}
              className={`group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-2 rounded-xl p-5 text-left hover:border-indigo-500/50 transition-all duration-300 ${
                isSelected ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-1">{skill.name}</h4>
                  <div
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${categoryColor}20`,
                      color: categoryColor,
                      border: `1px solid ${categoryColor}40`,
                    }}
                  >
                    {skill.category.replace('-', ' ')}
                  </div>
                </div>

                {/* Trend indicator */}
                <div
                  className="flex items-center gap-1 px-2 py-1 rounded"
                  style={{ backgroundColor: `${trendColor}20`, color: trendColor }}
                >
                  <span className="text-sm">{getTrendIcon(skill.trend)}</span>
                </div>
              </div>

              {/* Dual mini gauges */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <MasteryGauge
                    score={skill.aiMastery}
                    size={100}
                    strokeWidth={10}
                    showLabel={false}
                    animated={false}
                  />
                  <div className="mt-2 text-center">
                    <div className="text-xs text-slate-400">AI Mastery</div>
                    <div className="text-sm font-semibold text-indigo-400">
                      {formatPercentage(skill.aiMastery)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <ConfidenceGauge
                    score={skill.selfConfidence}
                    size={100}
                    strokeWidth={10}
                    showLabel={false}
                    animated={false}
                  />
                  <div className="mt-2 text-center">
                    <div className="text-xs text-slate-400">Confidence</div>
                    <div className="text-sm font-semibold text-cyan-400">
                      {formatPercentage(skill.selfConfidence)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delta indicator */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: deltaColor }}
                  />
                  <span className="text-sm text-slate-400">Delta</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: deltaColor }}>
                    {skill.delta > 0 ? '+' : ''}{Math.round(skill.delta)}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* No results */}
      {filteredSkills.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-2">No Skills Found</p>
          <p className="text-sm">Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Selected skill detail modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedSkill.name}</h3>
                <div
                  className="inline-block px-3 py-1 rounded text-sm font-medium"
                  style={{
                    backgroundColor: `${getCategoryColor(selectedSkill.category)}20`,
                    color: getCategoryColor(selectedSkill.category),
                    border: `1px solid ${getCategoryColor(selectedSkill.category)}40`,
                  }}
                >
                  {selectedSkill.category.replace('-', ' ')}
                </div>
              </div>
              <button
                onClick={() => onSelectSkill?.('')}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 space-y-6">
              {/* Dual gauges */}
              <div className="grid grid-cols-2 gap-8">
                <MasteryGauge score={selectedSkill.aiMastery} size={240} />
                <ConfidenceGauge score={selectedSkill.selfConfidence} size={240} />
              </div>

              {/* Delta indicator */}
              <DeltaIndicator
                aiMastery={selectedSkill.aiMastery}
                selfConfidence={selectedSkill.selfConfidence}
                delta={selectedSkill.delta}
                deltaType={selectedSkill.deltaType}
                skillName={selectedSkill.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
