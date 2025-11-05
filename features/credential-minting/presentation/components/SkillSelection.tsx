'use client';

/**
 * Skill Selection Step
 * 
 * Step 1: Select a skill from completed milestones for credential minting.
 */

import React from 'react';
import Image from 'next/image';
import { Award, CheckCircle, XCircle, ChevronRight, TrendingUp } from 'lucide-react';
import { SkillSelectionProps } from '../../types/minting.types';

export const SkillSelection: React.FC<SkillSelectionProps> = ({
  skills,
  selectedSkill,
  onSelect,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading available skills...</p>
        </div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <Award className="w-10 h-10 text-slate-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Skills Available
        </h3>
        <p className="text-slate-400 max-w-md mx-auto">
          Complete skill milestones to become eligible for credential minting.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Select Skill to Mint
        </h2>
        <p className="text-slate-400">
          Choose a skill from your completed milestones to create a verified credential
        </p>
      </div>

      {/* Skill Cards Grid */}
      <div className="grid gap-4">
        {skills.map((skill) => {
          const isSelected = selectedSkill?.id === skill.id;

          return (
            <button
              key={skill.id}
              onClick={() => skill.eligible && onSelect(skill.id)}
              disabled={!skill.eligible}
              className={`group relative p-6 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500'
                  : skill.eligible
                  ? 'bg-slate-900 border-slate-700 hover:border-slate-600'
                  : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Skill Image */}
                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-800">
                  {skill.imageUrl ? (
                    <Image
                      src={skill.imageUrl}
                      alt={skill.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-10 h-10 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Skill Info */}
                <div className="flex-1 min-w-0">
                  {/* Name and Category */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {skill.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-300">
                          {skill.category}
                        </span>
                        {!skill.eligible && skill.reason && (
                          <span className="text-xs text-red-400">
                            {skill.reason}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Eligibility Badge */}
                    {skill.eligible ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">Eligible</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-medium text-red-400">Not Eligible</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {skill.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Skill Level */}
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-xs text-slate-500 uppercase tracking-wider">
                          Level
                        </span>
                      </div>
                      <div className="text-lg font-bold text-indigo-400">
                        {skill.level}%
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-xs text-slate-500 uppercase tracking-wider">
                          Milestones
                        </span>
                      </div>
                      <div className="text-lg font-bold text-purple-400">
                        {skill.milestones.length}
                      </div>
                    </div>

                    {/* Value */}
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">
                          Value
                        </span>
                      </div>
                      <div className="text-lg font-bold text-emerald-400">
                        ${skill.estimatedValue}
                      </div>
                    </div>
                  </div>

                  {/* Milestones Preview */}
                  {skill.milestones.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                        Recent Milestones
                      </div>
                      <div className="space-y-2">
                        {skill.milestones.slice(0, 2).map((milestone) => (
                          <div
                            key={milestone.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="text-slate-400 truncate">
                              {milestone.title}
                            </span>
                            <span className="text-xs text-slate-600 ml-auto">
                              +{milestone.xpEarned} XP
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Arrow Indicator */}
                {skill.eligible && (
                  <div className={`flex-shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    <ChevronRight className="w-6 h-6 text-indigo-400" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
