'use client';

import React, { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LeaderboardEntry,
  formatXP,
  getRankSuffix,
  getTrendIcon,
  getTrendColor,
} from '../../types/gamification.types';

/**
 * Props for Leaderboard component
 */
interface LeaderboardProps {
  entries: LeaderboardEntry[];
  period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  onPeriodChange?: (period: 'daily' | 'weekly' | 'monthly' | 'all-time') => void;
}

/**
 * Leaderboard list with user avatars and ranks
 * Features: animated rank changes, medal icons for top 3, current user highlight
 */
export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  period = 'all-time',
  onPeriodChange,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(period);

  const handlePeriodChange = (newPeriod: typeof period) => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  // Get medal icon for top 3
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  // Get rank color
  const getRankColor = (rank: number) => {
    if (rank === 1) return '#F59E0B'; // Gold
    if (rank === 2) return '#94A3B8'; // Silver
    if (rank === 3) return '#D97706'; // Bronze
    return '#6366F1'; // Default indigo
  };

  return (
    <div className="space-y-6">
      {/* Header with period filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Leaderboard</h2>
          <p className="text-sm text-slate-400">
            {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1).replace('-', ' ')}{' '}
            rankings
          </p>
        </div>

        {/* Period tabs */}
        <div className="flex bg-slate-800/50 rounded-lg p-1">
          {(['daily', 'weekly', 'monthly', 'all-time'] as const).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === p
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === 'all-time' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="space-y-3">
        {entries.map((entry, index) => {
          const isTop3 = entry.rank <= 3;
          const rankColor = getRankColor(entry.rank);
          const trendColor = getTrendColor(entry.trend);

          return (
            <div
              key={entry.userId}
              className={`group relative bg-gradient-to-r rounded-xl p-4 border-2 transition-all duration-300 hover:scale-[1.02] ${
                entry.isCurrentUser
                  ? 'from-indigo-900/30 to-purple-900/30 border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                  : 'from-slate-900/50 to-slate-800/30 border-slate-700 hover:border-slate-600'
              }`}
            >
              {/* Rank glow for top 3 */}
              {isTop3 && (
                <div
                  className="absolute inset-0 rounded-xl opacity-10 blur-xl"
                  style={{
                    background: `radial-gradient(circle at 20% 50%, ${rankColor}, transparent 70%)`,
                  }}
                />
              )}

              <div className="relative z-10 flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0">
                  {isTop3 ? (
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg"
                        style={{
                          background: `linear-gradient(135deg, ${rankColor}dd, ${rankColor})`,
                          boxShadow: `0 0 15px ${rankColor}60`,
                        }}
                      >
                        {entry.rank}
                      </div>
                      <div className="absolute -top-1 -right-1">{getMedalIcon(entry.rank)}</div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center font-bold text-slate-400 text-lg">
                      {entry.rank}
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br from-slate-800 to-slate-700 border-2"
                    style={{
                      borderColor: entry.isCurrentUser ? '#6366F1' : '#334155',
                    }}
                  >
                    {entry.avatar}
                  </div>
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-white truncate">
                      {entry.displayName}
                    </div>
                    {entry.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/40 rounded text-xs font-medium text-indigo-400">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>@{entry.username}</span>
                    <span>•</span>
                    <span>Level {entry.level}</span>
                    <span>•</span>
                    <span>{entry.badgesCount} badges</span>
                  </div>
                </div>

                {/* XP and trend */}
                <div className="flex items-center gap-6">
                  {/* Rank change */}
                  {entry.rankChange !== undefined && entry.rankChange !== 0 && (
                    <div className="flex items-center gap-1">
                      {entry.trend === 'up' && (
                        <TrendingUp className="w-4 h-4" style={{ color: trendColor }} />
                      )}
                      {entry.trend === 'down' && (
                        <TrendingDown className="w-4 h-4" style={{ color: trendColor }} />
                      )}
                      {entry.trend === 'same' && (
                        <Minus className="w-4 h-4" style={{ color: trendColor }} />
                      )}
                      <span className="text-sm font-semibold" style={{ color: trendColor }}>
                        {entry.rankChange > 0 ? '+' : ''}
                        {entry.rankChange}
                      </span>
                    </div>
                  )}

                  {/* XP */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{formatXP(entry.totalXP)}</div>
                    <div className="text-xs text-slate-400">XP</div>
                  </div>
                </div>
              </div>

              {/* Current user indicator */}
              {entry.isCurrentUser && (
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl" />
              )}
            </div>
          );
        })}
      </div>

      {/* Load more */}
      <div className="text-center">
        <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-white font-medium transition-colors">
          Load More
        </button>
      </div>
    </div>
  );
};
