/**
 * Type definitions for gamification system
 * XP tracking, levels, badges, achievements, leaderboards
 */

/**
 * Badge rarity tiers
 */
export enum BadgeRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

/**
 * Badge category
 */
export enum BadgeCategory {
  LEARNING = 'learning',
  MASTERY = 'mastery',
  CONSISTENCY = 'consistency',
  SOCIAL = 'social',
  ACHIEVEMENT = 'achievement',
  SPECIAL = 'special',
}

/**
 * Challenge type
 */
export enum ChallengeType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SPECIAL = 'special',
}

/**
 * Challenge difficulty
 */
export enum ChallengeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

/**
 * XP source (where XP comes from)
 */
export enum XPSource {
  ASSESSMENT = 'assessment',
  COURSE_COMPLETION = 'course_completion',
  PRACTICE = 'practice',
  PROJECT = 'project',
  CHALLENGE = 'challenge',
  STREAK = 'streak',
  PEER_REVIEW = 'peer_review',
  MENTORSHIP = 'mentorship',
}

/**
 * User level and XP data
 */
export interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number; // XP needed to reach current level
  xpForNextLevel: number; // XP needed to reach next level
  xpProgress: number; // Progress percentage (0-100)
  totalXP: number; // Lifetime XP
  levelTitle: string; // e.g., "Novice", "Apprentice", "Expert"
}

/**
 * XP gain event
 */
export interface XPGain {
  id: string;
  amount: number;
  source: XPSource;
  description: string;
  timestamp: Date;
  multiplier?: number; // XP bonus multiplier
}

/**
 * Badge definition
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  icon: string; // Emoji or icon name
  color: string; // Primary color
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number; // Progress percentage (0-100) for locked badges
  requirement: string; // "Complete 10 assessments"
  xpReward: number;
}

/**
 * Achievement (milestone)
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  completedAt?: Date;
  progress: number; // 0-100
  total: number; // Total required (e.g., 100 assessments)
  current: number; // Current count (e.g., 45 assessments)
  xpReward: number;
  badgeReward?: Badge;
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar: string; // URL or emoji
  level: number;
  totalXP: number;
  badgesCount: number;
  isCurrentUser: boolean;
  trend: 'up' | 'down' | 'same'; // Rank change
  rankChange?: number; // +5, -2, etc.
}

/**
 * Learning streak
 */
export interface LearningStreak {
  currentStreak: number; // Days
  longestStreak: number; // Days
  lastActivityDate: Date;
  isActiveToday: boolean;
  streakMultiplier: number; // XP bonus
}

/**
 * Challenge
 */
export interface Challenge {
  id: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  progress: number; // 0-100
  current: number;
  total: number;
  isCompleted: boolean;
  completedAt?: Date;
  expiresAt: Date;
  timeRemaining: string; // "2h 30m"
}

/**
 * Gamification summary
 */
export interface GamificationSummary {
  userLevel: UserLevel;
  streak: LearningStreak;
  totalBadges: number;
  unlockedBadges: number;
  legendaryBadges: number;
  globalRank: number;
  weeklyXP: number;
  monthlyXP: number;
  completedChallenges: number;
  activeChallenges: number;
}

/**
 * Context state
 */
export interface GamificationState {
  summary: GamificationSummary | null;
  badges: Badge[];
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  recentXPGains: XPGain[];
  activeChallenges: Challenge[];
  showLevelUpModal: boolean;
  showAchievementToast: Achievement | null;
  loading: boolean;
  error: string | null;
}

/**
 * Context actions
 */
export interface GamificationActions {
  loadGamificationData: () => Promise<void>;
  gainXP: (amount: number, source: XPSource, description: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeChallenge: (challengeId: string) => void;
  dismissLevelUpModal: () => void;
  dismissAchievementToast: () => void;
  filterLeaderboard: (period: 'daily' | 'weekly' | 'monthly' | 'all-time') => void;
}

/**
 * Helper: Get level title
 */
export const getLevelTitle = (level: number): string => {
  if (level >= 50) return 'Grandmaster';
  if (level >= 40) return 'Master';
  if (level >= 30) return 'Expert';
  if (level >= 20) return 'Professional';
  if (level >= 15) return 'Advanced';
  if (level >= 10) return 'Intermediate';
  if (level >= 5) return 'Apprentice';
  return 'Novice';
};

/**
 * Helper: Calculate XP needed for next level
 */
export const getXPForLevel = (level: number): number => {
  // Progressive XP requirement: level^2 * 100
  return level * level * 100;
};

/**
 * Helper: Get badge rarity color
 */
export const getBadgeRarityColor = (rarity: BadgeRarity): string => {
  const colors: Record<BadgeRarity, string> = {
    [BadgeRarity.COMMON]: '#94A3B8', // Slate
    [BadgeRarity.RARE]: '#22D3EE', // Cyan
    [BadgeRarity.EPIC]: '#A855F7', // Purple
    [BadgeRarity.LEGENDARY]: '#F59E0B', // Gold
  };
  return colors[rarity];
};

/**
 * Helper: Get badge rarity label
 */
export const getBadgeRarityLabel = (rarity: BadgeRarity): string => {
  const labels: Record<BadgeRarity, string> = {
    [BadgeRarity.COMMON]: 'Common',
    [BadgeRarity.RARE]: 'Rare',
    [BadgeRarity.EPIC]: 'Epic',
    [BadgeRarity.LEGENDARY]: 'Legendary',
  };
  return labels[rarity];
};

/**
 * Helper: Get challenge difficulty color
 */
export const getChallengeDifficultyColor = (difficulty: ChallengeDifficulty): string => {
  const colors: Record<ChallengeDifficulty, string> = {
    [ChallengeDifficulty.EASY]: '#10B981',
    [ChallengeDifficulty.MEDIUM]: '#22D3EE',
    [ChallengeDifficulty.HARD]: '#F59E0B',
    [ChallengeDifficulty.EXPERT]: '#EF4444',
  };
  return colors[difficulty];
};

/**
 * Helper: Format XP number
 */
export const formatXP = (xp: number): string => {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
};

/**
 * Helper: Format time remaining
 */
export const formatTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
};

/**
 * Helper: Get rank suffix (1st, 2nd, 3rd, etc.)
 */
export const getRankSuffix = (rank: number): string => {
  const j = rank % 10;
  const k = rank % 100;
  
  if (j === 1 && k !== 11) return `${rank}st`;
  if (j === 2 && k !== 12) return `${rank}nd`;
  if (j === 3 && k !== 13) return `${rank}rd`;
  return `${rank}th`;
};

/**
 * Helper: Get XP source icon
 */
export const getXPSourceIcon = (source: XPSource): string => {
  const icons: Record<XPSource, string> = {
    [XPSource.ASSESSMENT]: '🎯',
    [XPSource.COURSE_COMPLETION]: '📚',
    [XPSource.PRACTICE]: '💻',
    [XPSource.PROJECT]: '🚀',
    [XPSource.CHALLENGE]: '⚡',
    [XPSource.STREAK]: '🔥',
    [XPSource.PEER_REVIEW]: '👥',
    [XPSource.MENTORSHIP]: '🎓',
  };
  return icons[source];
};

/**
 * Helper: Get level color
 */
export const getLevelColor = (level: number): string => {
  if (level >= 50) return '#F59E0B'; // Gold
  if (level >= 40) return '#A855F7'; // Purple
  if (level >= 30) return '#6366F1'; // Indigo
  if (level >= 20) return '#22D3EE'; // Cyan
  if (level >= 10) return '#10B981'; // Green
  return '#94A3B8'; // Slate
};

/**
 * Helper: Calculate streak bonus multiplier
 */
export const getStreakMultiplier = (streakDays: number): number => {
  if (streakDays >= 30) return 2.0;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.25;
  if (streakDays >= 3) return 1.1;
  return 1.0;
};

/**
 * Helper: Get trend icon
 */
export const getTrendIcon = (trend: 'up' | 'down' | 'same'): string => {
  if (trend === 'up') return '↗';
  if (trend === 'down') return '↘';
  return '→';
};

/**
 * Helper: Get trend color
 */
export const getTrendColor = (trend: 'up' | 'down' | 'same'): string => {
  if (trend === 'up') return '#10B981';
  if (trend === 'down') return '#EF4444';
  return '#94A3B8';
};
