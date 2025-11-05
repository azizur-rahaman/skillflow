'use client';

import React from 'react';
import { Award, TrendingUp, UserPlus, Check } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import type { Milestone } from '../../types/profile.types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  UserPlus,
  TrendingUp,
  Award,
};

export default function ProfileCompletionMeter() {
  const { state } = useProfile();
  const profile = state.profile;

  if (!profile) return null;

  const completion = profile.profileCompletion;
  const percentage = completion.percentage;

  // Calculate sections for visual breakdown
  const totalSections = 7;
  const completedCount = completion.completedSections.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white/90">Profile Completion</h3>
          <p className="text-sm text-white/60 mt-1">
            {completedCount} of {totalSections} sections completed
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {percentage}%
          </div>
          <p className="text-xs text-white/40 mt-1">
            {percentage === 100 ? 'Complete!' : `${100 - percentage}% to go`}
          </p>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="relative flex items-center justify-center">
        {/* SVG Circle */}
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
            className="transition-all duration-1000 ease-out animate-completion-fill"
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {percentage === 100 ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center animate-save-pulse">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold text-green-400">Complete!</p>
              </div>
            ) : (
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {percentage}%
              </div>
            )}
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl -z-10 animate-pulse" />
      </div>

      {/* Section Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white/70">Sections</h4>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: totalSections }).map((_, index) => {
            const isCompleted = index < completedCount;
            return (
              <div
                key={index}
                className={`
                  h-2 rounded-full transition-all duration-500
                  ${
                    isCompleted
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50'
                      : 'bg-white/10'
                  }
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              />
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-white/70">Milestones</h4>
        <div className="space-y-2">
          {completion.milestones.map((milestone) => {
            const Icon = iconMap[milestone.icon] || Award;
            return (
              <MilestoneCard key={milestone.id} milestone={milestone} Icon={Icon} />
            );
          })}
        </div>
      </div>

      {/* Incomplete Sections List */}
      {completion.incompleteSections.length > 0 && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <h4 className="text-sm font-semibold text-indigo-300 mb-2">Complete your profile:</h4>
          <ul className="space-y-1">
            {completion.incompleteSections.map((section) => (
              <li key={section} className="text-sm text-white/60 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="capitalize">{section.replace('_', ' ')}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MilestoneCard({
  milestone,
  Icon,
}: {
  milestone: Milestone;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={`
        p-3 rounded-xl border transition-all duration-300
        ${
          milestone.achieved
            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
            : 'bg-white/5 border-white/10'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
            ${
              milestone.achieved
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-white/10 text-white/40'
            }
          `}
        >
          {milestone.achieved ? (
            <Check className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h5
              className={`
                text-sm font-semibold
                ${milestone.achieved ? 'text-green-400' : 'text-white/80'}
              `}
            >
              {milestone.title}
            </h5>
            {milestone.reward && (
              <span className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
                {milestone.reward}
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-1">{milestone.description}</p>
          {!milestone.achieved && (
            <p className="text-xs text-white/40 mt-1">
              Reach {milestone.threshold}% completion
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
