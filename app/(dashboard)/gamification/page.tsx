'use client';

import React from 'react';
import { Loader2, AlertCircle, Flame, Trophy, Zap, Star, Calendar } from 'lucide-react';
import { GamificationProvider, useGamification } from '@/features/gamification/context/GamificationContext';
import {
  XPProgressBar,
  BadgeGallery,
  Leaderboard,
  ChallengesPanel,
} from '@/features/gamification/presentation/components';
import { formatXP, getRankSuffix } from '@/features/gamification/types/gamification.types';

/**
 * Gamification Dashboard Content (wrapped in provider)
 */
const GamificationDashboardContent: React.FC = () => {
  const {
    summary,
    badges,
    leaderboard,
    activeChallenges,
    loading,
    error,
    filterLeaderboard,
  } = useGamification();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading gamification data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Failed to load gamification data</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section: XP Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main XP Bar */}
        <div className="lg:col-span-2">
          <XPProgressBar userLevel={summary.userLevel} showAnimation />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-2 border-orange-500/50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-orange-400" />
              <div className="text-sm text-slate-400">Current Streak</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {summary.streak.currentStreak} days
            </div>
            <div className="text-xs text-slate-400">
              Longest: {summary.streak.longestStreak} days
            </div>
            <div className="mt-2 px-2 py-1 bg-orange-500/20 rounded text-xs font-semibold text-orange-400 inline-block">
              {summary.streak.streakMultiplier}x XP Bonus
            </div>
          </div>

          {/* Global Rank */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-2 border-indigo-500/50 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-indigo-400" />
              <div className="text-sm text-slate-400">Global Rank</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {getRankSuffix(summary.globalRank)}
            </div>
            <div className="text-xs text-slate-400">
              {formatXP(summary.weeklyXP)} XP this week
            </div>
            <div className="mt-2 px-2 py-1 bg-indigo-500/20 rounded text-xs font-semibold text-indigo-400 inline-block">
              Top 1% Globally
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Star className="w-6 h-6 text-yellow-400" />}
          label="Total Badges"
          value={summary.unlockedBadges}
          subtitle={`${summary.totalBadges} available`}
          color="#F59E0B"
        />
        <StatCard
          icon={<Trophy className="w-6 h-6 text-purple-400" />}
          label="Legendary Badges"
          value={summary.legendaryBadges}
          subtitle="Rare achievements"
          color="#A855F7"
        />
        <StatCard
          icon={<Zap className="w-6 h-6 text-cyan-400" />}
          label="Weekly XP"
          value={formatXP(summary.weeklyXP)}
          subtitle={`${formatXP(summary.monthlyXP)} this month`}
          color="#22D3EE"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-green-400" />}
          label="Active Challenges"
          value={summary.activeChallenges}
          subtitle={`${summary.completedChallenges} completed`}
          color="#10B981"
        />
      </div>

      {/* Challenges */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-8">
        <ChallengesPanel challenges={activeChallenges} />
      </div>

      {/* Badge Gallery */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-8">
        <BadgeGallery badges={badges} />
      </div>

      {/* Leaderboard */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-8">
        <Leaderboard
          entries={leaderboard}
          period="all-time"
          onPeriodChange={filterLeaderboard}
        />
      </div>
    </div>
  );
};

/**
 * Stat card component
 */
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle: string;
  color: string;
}> = ({ icon, label, value, subtitle, color }) => {
  return (
    <div
      className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 rounded-xl p-5 transition-all duration-300 hover:scale-105"
      style={{ borderColor: `${color}40` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500">{subtitle}</div>
    </div>
  );
};

/**
 * Main Gamification Dashboard Page
 */
const GamificationDashboard: React.FC = () => {
  return (
    <GamificationProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🎮 Gamification Dashboard
            </h1>
            <p className="text-lg text-slate-400">
              Track your progress, earn badges, and compete with other learners
            </p>
          </div>

          <GamificationDashboardContent />
        </div>
      </div>
    </GamificationProvider>
  );
};

export default GamificationDashboard;
