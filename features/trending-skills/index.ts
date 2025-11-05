/**
 * Trending Skills Feature - Public API
 * Barrel export for feature components, hooks, and types
 */

// Types
export type {
  TrendingSkill,
  TrendDirection,
  TrendTimeRange,
  SkillCategory,
  Industry,
  SparklineDataPoint,
  TrendingSkillsResponse,
  TrendingSkillsFilters as TrendingSkillsFilterType,
  TrendingSkillsContextValue,
  LeaderboardOptions,
} from './types/trending-skills.types';

// Context & Hooks
export { TrendingSkillsProvider, useTrendingSkills } from './context/TrendingSkillsContext';

// Components
export { TrendingSkillCard } from './presentation/components/TrendingSkillCard';
export { TrendingSkillsFilters } from './presentation/components/TrendingSkillsFilters';
export { TrendingSkillsLeaderboard } from './presentation/components/TrendingSkillsLeaderboard';
