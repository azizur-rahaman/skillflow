'use client';

/**
 * Team Leaderboard Component
 * 
 * Displays ranked team list with performance metrics
 * Shows skills acquired, engagement rates, and growth metrics
 */

import React from 'react';
import { Trophy, TrendingUp, Users, Award, Zap, Target } from 'lucide-react';
import {
  TeamLeaderboardEntry,
  getDepartmentColor,
  getDepartmentName,
  formatPercentage,
  getRankBadge,
} from '../../../types/enterprise-analytics.types';

interface TeamLeaderboardProps {
  teams: TeamLeaderboardEntry[];
  limit?: number;
}

export const TeamLeaderboard: React.FC<TeamLeaderboardProps> = ({ teams, limit }) => {
  const displayTeams = limit ? teams.slice(0, limit) : teams;

  /**
   * Get rank background color
   */
  const getRankBackground = (rank: number): string => {
    if (rank === 1) return 'bg-gradient-to-br from-warning/20 to-warning/10 border-warning/30';
    if (rank === 2) return 'bg-gradient-to-br from-muted/40 to-muted/20 border-muted/50';
    if (rank === 3) return 'bg-gradient-to-br from-warning/15 to-warning/5 border-warning/20';
    return 'bg-card border-border';
  };

  /**
   * Get growth indicator color
   */
  const getGrowthColor = (rate: number): string => {
    if (rate >= 15) return 'text-success';
    if (rate >= 10) return 'text-highlight';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card backdrop-blur-sm rounded-2xl border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Team Leaderboard
        </h3>
        <span className="text-sm text-muted-foreground">
          Top {displayTeams.length} Teams
        </span>
      </div>

      {/* Leaderboard table */}
      <div className="space-y-3">
        {displayTeams.map((team) => {
          const deptColor = getDepartmentColor(team.department);
          const rankBg = getRankBackground(team.rank);

          return (
            <div
              key={team.teamId}
              className={`relative rounded-xl border ${rankBg} p-4 hover:shadow-lg transition-all duration-300 group`}
            >
              {/* Rank badge - absolute positioned */}
              <div className="absolute -left-2 -top-2 w-10 h-10 rounded-full bg-background border-2 border-card flex items-center justify-center shadow-lg">
                {team.badge ? (
                  <span className="text-xl">{team.badge}</span>
                ) : (
                  <span className="text-sm font-bold text-white">#{team.rank}</span>
                )}
              </div>

              {/* Main content */}
              <div className="ml-6">
                {/* Team header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                      {team.teamName}
                      {team.rank <= 3 && (
                        <Award className="w-4 h-4 text-warning" />
                      )}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: deptColor }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {getDepartmentName(team.department)}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {team.memberCount} members
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Growth rate badge */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg bg-success/10`}
                  >
                    <TrendingUp className={`w-3.5 h-3.5 ${getGrowthColor(team.growthRate)}`} />
                    <span className={`text-xs font-semibold ${getGrowthColor(team.growthRate)}`}>
                      +{team.growthRate.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-2 rounded-lg bg-muted/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">Skills</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {team.totalSkillsAcquired}
                    </div>
                  </div>

                  <div className="text-center p-2 rounded-lg bg-muted/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-3.5 h-3.5 text-highlight" />
                      <span className="text-xs text-muted-foreground">Engagement</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {team.averageEngagementRate.toFixed(1)}%
                    </div>
                  </div>

                  <div className="text-center p-2 rounded-lg bg-muted/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-3.5 h-3.5 text-warning" />
                      <span className="text-xs text-muted-foreground">Strength</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {team.averageSkillStrength.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Top performers */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Top Performers:
                  </span>
                  <div className="flex items-center gap-1">
                    {team.topPerformers.slice(0, 3).map((performer, index) => (
                      <React.Fragment key={index}>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {performer}
                        </span>
                        {index < Math.min(team.topPerformers.length, 3) - 1 && (
                          <span className="text-xs text-slate-400">•</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              {team.rank <= 3 && (
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `0 0 20px ${
                      team.rank === 1 ? '#F59E0B' :
                      team.rank === 2 ? '#94A3B8' :
                      '#EA580C'
                    }30`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* View all button */}
      {limit && teams.length > limit && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/50">
          <button className="w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            View All {teams.length} Teams →
          </button>
        </div>
      )}
    </div>
  );
};
