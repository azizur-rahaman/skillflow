'use client';

import React from 'react';
import { Clock, Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import {
  Challenge,
  ChallengeType,
  getChallengeDifficultyColor,
  formatTimeRemaining,
} from '../../types/gamification.types';

/**
 * Props for ChallengesPanel component
 */
interface ChallengesPanelProps {
  challenges: Challenge[];
  onChallengeClick?: (challenge: Challenge) => void;
}

/**
 * Daily/weekly challenges panel with progress tracking
 * Features: countdown timers, progress circles, XP rewards, completion animations
 */
export const ChallengesPanel: React.FC<ChallengesPanelProps> = ({
  challenges,
  onChallengeClick,
}) => {
  // Group by type
  const dailyChallenges = challenges.filter((c) => c.type === ChallengeType.DAILY);
  const weeklyChallenges = challenges.filter((c) => c.type === ChallengeType.WEEKLY);
  const specialChallenges = challenges.filter((c) => c.type === ChallengeType.SPECIAL);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Active Challenges</h2>
        <p className="text-sm text-slate-400">
          Complete challenges to earn bonus XP and unlock badges
        </p>
      </div>

      {/* Daily Challenges */}
      {dailyChallenges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-sm font-semibold text-green-400">
              ⚡ Daily Challenges
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-green-500/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => onChallengeClick?.(challenge)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Weekly Challenges */}
      {weeklyChallenges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-sm font-semibold text-indigo-400">
              🎯 Weekly Challenges
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => onChallengeClick?.(challenge)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Special Challenges */}
      {specialChallenges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-sm font-semibold text-purple-400">
              ⭐ Special Challenges
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => onChallengeClick?.(challenge)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {challenges.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-2">No Active Challenges</p>
          <p className="text-sm">Check back later for new challenges!</p>
        </div>
      )}
    </div>
  );
};

/**
 * Individual challenge card
 */
const ChallengeCard: React.FC<{ challenge: Challenge; onClick: () => void }> = ({
  challenge,
  onClick,
}) => {
  const difficultyColor = getChallengeDifficultyColor(challenge.difficulty);
  const isExpiringSoon = challenge.expiresAt.getTime() - Date.now() < 3 * 60 * 60 * 1000; // < 3 hours

  return (
    <button
      onClick={onClick}
      disabled={challenge.isCompleted}
      className={`group relative bg-gradient-to-br from-slate-900 to-slate-800 border-2 rounded-xl p-5 text-left transition-all duration-300 ${
        challenge.isCompleted
          ? 'opacity-60 cursor-default'
          : 'hover:scale-[1.02] hover:border-indigo-500/50'
      }`}
      style={{
        borderColor: challenge.isCompleted ? '#10B981' : '#334155',
      }}
    >
      {/* Completion overlay */}
      {challenge.isCompleted && (
        <div className="absolute inset-0 bg-green-500/10 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold">Completed!</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {/* Icon */}
            <div className="text-3xl">{challenge.icon}</div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white mb-1">{challenge.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{challenge.description}</p>
            </div>
          </div>

          {/* Difficulty badge */}
          <div
            className="px-2 py-1 rounded text-xs font-semibold shrink-0"
            style={{
              backgroundColor: `${difficultyColor}20`,
              color: difficultyColor,
              border: `1px solid ${difficultyColor}40`,
            }}
          >
            {challenge.difficulty}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Progress: {challenge.current}/{challenge.total}
            </span>
            <span className="font-semibold text-white">{challenge.progress}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${challenge.progress}%` }}
            >
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          {/* Time remaining */}
          <div
            className={`flex items-center gap-1.5 text-sm ${
              isExpiringSoon ? 'text-orange-400' : 'text-slate-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className={isExpiringSoon ? 'font-semibold' : ''}>
              {formatTimeRemaining(challenge.expiresAt)}
            </span>
          </div>

          {/* XP reward */}
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">
              +{challenge.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      {/* Expiring soon pulse */}
      {isExpiringSoon && !challenge.isCompleted && (
        <div className="absolute top-2 right-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" />
        </div>
      )}
    </button>
  );
};
