'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  GamificationState,
  GamificationActions,
  GamificationSummary,
  Badge,
  Achievement,
  LeaderboardEntry,
  XPGain,
  Challenge,
  UserLevel,
  LearningStreak,
  BadgeRarity,
  BadgeCategory,
  ChallengeType,
  ChallengeDifficulty,
  XPSource,
  getLevelTitle,
  getXPForLevel,
  getStreakMultiplier,
} from '../types/gamification.types';

/**
 * Mock data: User gamification profile
 */
const MOCK_USER_LEVEL: UserLevel = {
  currentLevel: 12,
  currentXP: 8750,
  xpForCurrentLevel: 8100, // 9^2 * 100
  xpForNextLevel: 10000, // 10^2 * 100
  xpProgress: 54, // (8750 - 8100) / (10000 - 8100) * 100
  totalXP: 24350,
  levelTitle: getLevelTitle(12),
};

const MOCK_STREAK: LearningStreak = {
  currentStreak: 12,
  longestStreak: 28,
  lastActivityDate: new Date(),
  isActiveToday: true,
  streakMultiplier: getStreakMultiplier(12),
};

const MOCK_BADGES: Badge[] = [
  {
    id: 'first-assessment',
    name: 'First Steps',
    description: 'Complete your first assessment',
    category: BadgeCategory.LEARNING,
    rarity: BadgeRarity.COMMON,
    icon: '🎯',
    color: '#10B981',
    isUnlocked: true,
    unlockedAt: new Date('2025-10-15'),
    requirement: 'Complete 1 assessment',
    xpReward: 100,
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: '7-day learning streak',
    category: BadgeCategory.CONSISTENCY,
    rarity: BadgeRarity.RARE,
    icon: '🔥',
    color: '#F59E0B',
    isUnlocked: true,
    unlockedAt: new Date('2025-10-22'),
    requirement: '7-day streak',
    xpReward: 500,
  },
  {
    id: 'skill-master',
    name: 'Skill Master',
    description: 'Achieve 80% mastery in 5 skills',
    category: BadgeCategory.MASTERY,
    rarity: BadgeRarity.EPIC,
    icon: '⚡',
    color: '#A855F7',
    isUnlocked: true,
    unlockedAt: new Date('2025-10-28'),
    requirement: '5 skills at 80%+ mastery',
    xpReward: 1000,
  },
  {
    id: 'perfect-score',
    name: 'Perfectionist',
    description: 'Score 100% on an assessment',
    category: BadgeCategory.ACHIEVEMENT,
    rarity: BadgeRarity.EPIC,
    icon: '💎',
    color: '#6366F1',
    isUnlocked: false,
    progress: 85,
    requirement: 'Score 100% on any assessment',
    xpReward: 1500,
  },
  {
    id: 'code-ninja',
    name: 'Code Ninja',
    description: 'Complete 50 coding challenges',
    category: BadgeCategory.LEARNING,
    rarity: BadgeRarity.RARE,
    icon: '🥷',
    color: '#22D3EE',
    isUnlocked: false,
    progress: 62,
    requirement: 'Complete 50 coding challenges',
    xpReward: 800,
  },
  {
    id: 'legendary-learner',
    name: 'Legendary Learner',
    description: 'Reach level 50',
    category: BadgeCategory.SPECIAL,
    rarity: BadgeRarity.LEGENDARY,
    icon: '👑',
    color: '#F59E0B',
    isUnlocked: false,
    progress: 24,
    requirement: 'Reach level 50',
    xpReward: 5000,
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-001',
    username: 'sarah_dev',
    displayName: 'Sarah Chen',
    avatar: '👩‍💻',
    level: 28,
    totalXP: 45280,
    badgesCount: 24,
    isCurrentUser: false,
    trend: 'same',
  },
  {
    rank: 2,
    userId: 'user-002',
    username: 'alex_codes',
    displayName: 'Alex Rodriguez',
    avatar: '👨‍💻',
    level: 25,
    totalXP: 38920,
    badgesCount: 20,
    isCurrentUser: false,
    trend: 'up',
    rankChange: 2,
  },
  {
    rank: 3,
    userId: 'current-user',
    username: 'you',
    displayName: 'You',
    avatar: '🚀',
    level: 12,
    totalXP: 24350,
    badgesCount: 8,
    isCurrentUser: true,
    trend: 'up',
    rankChange: 1,
  },
  {
    rank: 4,
    userId: 'user-004',
    username: 'emily_tech',
    displayName: 'Emily Watson',
    avatar: '👩‍🔬',
    level: 11,
    totalXP: 22100,
    badgesCount: 7,
    isCurrentUser: false,
    trend: 'down',
    rankChange: -1,
  },
  {
    rank: 5,
    userId: 'user-005',
    username: 'mike_learns',
    displayName: 'Mike Johnson',
    avatar: '👨‍🎓',
    level: 10,
    totalXP: 19800,
    badgesCount: 6,
    isCurrentUser: false,
    trend: 'same',
  },
];

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 'daily-practice',
    type: ChallengeType.DAILY,
    difficulty: ChallengeDifficulty.EASY,
    title: 'Daily Practice',
    description: 'Complete 3 coding exercises',
    icon: '💻',
    xpReward: 150,
    progress: 66,
    current: 2,
    total: 3,
    isCompleted: false,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    timeRemaining: '8h 0m',
  },
  {
    id: 'weekly-assessments',
    type: ChallengeType.WEEKLY,
    difficulty: ChallengeDifficulty.MEDIUM,
    title: 'Assessment Master',
    description: 'Complete 5 assessments this week',
    icon: '🎯',
    xpReward: 500,
    progress: 60,
    current: 3,
    total: 5,
    isCompleted: false,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    timeRemaining: '3d 0h',
  },
  {
    id: 'streak-keeper',
    type: ChallengeType.DAILY,
    difficulty: ChallengeDifficulty.EASY,
    title: 'Streak Keeper',
    description: 'Maintain your learning streak',
    icon: '🔥',
    xpReward: 100,
    progress: 100,
    current: 1,
    total: 1,
    isCompleted: true,
    completedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    timeRemaining: '24h 0m',
  },
];

const MOCK_RECENT_XP: XPGain[] = [
  {
    id: 'xp-001',
    amount: 250,
    source: XPSource.ASSESSMENT,
    description: 'Completed JavaScript Fundamentals assessment',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'xp-002',
    amount: 100,
    source: XPSource.STREAK,
    description: '12-day streak bonus',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    multiplier: 1.25,
  },
  {
    id: 'xp-003',
    amount: 150,
    source: XPSource.PRACTICE,
    description: 'Completed 3 coding challenges',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

/**
 * Context type
 */
type GamificationContextType = GamificationState & GamificationActions;

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

/**
 * Provider component
 */
export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GamificationState>({
    summary: null,
    badges: [],
    achievements: [],
    leaderboard: [],
    recentXPGains: [],
    activeChallenges: [],
    showLevelUpModal: false,
    showAchievementToast: null,
    loading: true,
    error: null,
  });

  /**
   * Load gamification data
   */
  const loadGamificationData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const summary: GamificationSummary = {
        userLevel: MOCK_USER_LEVEL,
        streak: MOCK_STREAK,
        totalBadges: MOCK_BADGES.length,
        unlockedBadges: MOCK_BADGES.filter((b) => b.isUnlocked).length,
        legendaryBadges: MOCK_BADGES.filter((b) => b.rarity === BadgeRarity.LEGENDARY && b.isUnlocked).length,
        globalRank: 3,
        weeklyXP: 3250,
        monthlyXP: 12500,
        completedChallenges: MOCK_CHALLENGES.filter((c) => c.isCompleted).length,
        activeChallenges: MOCK_CHALLENGES.filter((c) => !c.isCompleted).length,
      };

      setState({
        summary,
        badges: MOCK_BADGES,
        achievements: [],
        leaderboard: MOCK_LEADERBOARD,
        recentXPGains: MOCK_RECENT_XP,
        activeChallenges: MOCK_CHALLENGES,
        showLevelUpModal: false,
        showAchievementToast: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load gamification data',
      }));
    }
  }, []);

  /**
   * Gain XP
   */
  const gainXP = useCallback((amount: number, source: XPSource, description: string) => {
    setState((prev) => {
      if (!prev.summary) return prev;

      const newTotalXP = prev.summary.userLevel.totalXP + amount;
      const newCurrentXP = prev.summary.userLevel.currentXP + amount;

      // Check for level up
      let newLevel = prev.summary.userLevel.currentLevel;
      let xpForNextLevel = prev.summary.userLevel.xpForNextLevel;
      let showLevelUpModal = false;

      if (newCurrentXP >= xpForNextLevel) {
        newLevel += 1;
        showLevelUpModal = true;
        xpForNextLevel = getXPForLevel(newLevel + 1);
      }

      const xpForCurrentLevel = getXPForLevel(newLevel);
      const xpProgress = ((newCurrentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

      const newXPGain: XPGain = {
        id: `xp-${Date.now()}`,
        amount,
        source,
        description,
        timestamp: new Date(),
      };

      return {
        ...prev,
        summary: {
          ...prev.summary,
          userLevel: {
            ...prev.summary.userLevel,
            currentLevel: newLevel,
            currentXP: newCurrentXP,
            totalXP: newTotalXP,
            xpForNextLevel,
            xpProgress,
            levelTitle: getLevelTitle(newLevel),
          },
        },
        recentXPGains: [newXPGain, ...prev.recentXPGains].slice(0, 10),
        showLevelUpModal,
      };
    });
  }, []);

  /**
   * Unlock badge
   */
  const unlockBadge = useCallback((badgeId: string) => {
    setState((prev) => {
      const updatedBadges = prev.badges.map((badge) => {
        if (badge.id === badgeId && !badge.isUnlocked) {
          return {
            ...badge,
            isUnlocked: true,
            unlockedAt: new Date(),
          };
        }
        return badge;
      });

      return {
        ...prev,
        badges: updatedBadges,
      };
    });
  }, []);

  /**
   * Complete challenge
   */
  const completeChallenge = useCallback((challengeId: string) => {
    setState((prev) => {
      const updatedChallenges = prev.activeChallenges.map((challenge) => {
        if (challenge.id === challengeId && !challenge.isCompleted) {
          return {
            ...challenge,
            isCompleted: true,
            completedAt: new Date(),
            progress: 100,
            current: challenge.total,
          };
        }
        return challenge;
      });

      return {
        ...prev,
        activeChallenges: updatedChallenges,
      };
    });
  }, []);

  /**
   * Dismiss level up modal
   */
  const dismissLevelUpModal = useCallback(() => {
    setState((prev) => ({ ...prev, showLevelUpModal: false }));
  }, []);

  /**
   * Dismiss achievement toast
   */
  const dismissAchievementToast = useCallback(() => {
    setState((prev) => ({ ...prev, showAchievementToast: null }));
  }, []);

  /**
   * Filter leaderboard
   */
  const filterLeaderboard = useCallback((period: 'daily' | 'weekly' | 'monthly' | 'all-time') => {
    // In production, this would fetch different leaderboard data
    console.log('Filter leaderboard by:', period);
  }, []);

  // Load data on mount
  useEffect(() => {
    loadGamificationData();
  }, [loadGamificationData]);

  const value: GamificationContextType = {
    ...state,
    loadGamificationData,
    gainXP,
    unlockBadge,
    completeChallenge,
    dismissLevelUpModal,
    dismissAchievementToast,
    filterLeaderboard,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};

/**
 * Hook to use context
 */
export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};
