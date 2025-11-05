/**
 * Trending Skills Feature - Type Definitions
 * Follows vertical slice architecture pattern
 */

/**
 * Trend direction indicator
 */
export type TrendDirection = 'up' | 'down' | 'stable';

/**
 * Time range for trending analysis
 */
export type TrendTimeRange = '7d' | '30d' | '90d' | '1y';

/**
 * Skill category/domain filter
 */
export type SkillCategory = 
  | 'all'
  | 'programming'
  | 'data-science'
  | 'ai-ml'
  | 'cloud'
  | 'devops'
  | 'design'
  | 'product'
  | 'business'
  | 'soft-skills';

/**
 * Industry filter
 */
export type Industry = 
  | 'all'
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'manufacturing'
  | 'retail'
  | 'consulting';

/**
 * Sparkline data point for growth trend visualization
 */
export interface SparklineDataPoint {
  timestamp: string;
  value: number;
}

/**
 * Core trending skill entity
 */
export interface TrendingSkill {
  id: string;
  name: string;
  category: Exclude<SkillCategory, 'all'>;
  rank: number;
  previousRank?: number;
  growthPercentage: number;
  trendDirection: TrendDirection;
  demandScore: number; // 0-100
  sparklineData: SparklineDataPoint[];
  relatedSkills: string[];
  averageSalaryImpact?: number; // % increase
  jobPostings: number;
  learningResources: number;
}

/**
 * Trending skills response from API
 */
export interface TrendingSkillsResponse {
  skills: TrendingSkill[];
  timeRange: TrendTimeRange;
  category: SkillCategory;
  industry: Industry;
  lastUpdated: string;
  totalSkillsTracked: number;
}

/**
 * Filter state for trending skills
 */
export interface TrendingSkillsFilters {
  timeRange: TrendTimeRange;
  category: SkillCategory;
  industry: Industry;
  searchQuery?: string;
  sortBy?: 'rank' | 'growth' | 'demand';
}

/**
 * Context value for trending skills feature
 */
export interface TrendingSkillsContextValue {
  skills: TrendingSkill[];
  filters: TrendingSkillsFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateFilters: (filters: Partial<TrendingSkillsFilters>) => void;
  refreshData: () => Promise<void>;
  loadMore: () => Promise<void>;
  
  // Metadata
  hasMore: boolean;
  lastUpdated: string | null;
  totalSkillsTracked: number;
}

/**
 * Leaderboard display options
 */
export interface LeaderboardOptions {
  showSparklines: boolean;
  showSalaryImpact: boolean;
  showRelatedSkills: boolean;
  compact: boolean;
  itemsPerPage: number;
}
