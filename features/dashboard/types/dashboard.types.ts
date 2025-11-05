/**
 * Dashboard Domain Types
 * 
 * Type definitions for the personalized dashboard home hub.
 * Includes KPIs, metrics, performance tracking, and recommendations.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Types of KPI metrics displayed on dashboard
 */
export enum MetricType {
  SKILL_GROWTH = 'skill_growth',
  LEARNING_PROGRESS = 'learning_progress',
  COMPLETION_RATE = 'completion_rate',
  FORECAST_ACCURACY = 'forecast_accuracy',
  ENGAGEMENT_SCORE = 'engagement_score',
  SKILL_VELOCITY = 'skill_velocity',
}

/**
 * Trend direction for metrics
 */
export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  STABLE = 'stable',
}

/**
 * Dashboard widget types
 */
export enum WidgetType {
  KPI_CARD = 'kpi_card',
  SKILL_SUMMARY = 'skill_summary',
  FORECAST_TEASER = 'forecast_teaser',
  COURSE_RECOMMENDATION = 'course_recommendation',
  RECENT_ACTIVITY = 'recent_activity',
  QUICK_ACTIONS = 'quick_actions',
}

/**
 * Activity event types
 */
export enum ActivityType {
  SKILL_VERIFIED = 'skill_verified',
  COURSE_COMPLETED = 'course_completed',
  BADGE_EARNED = 'badge_earned',
  FORECAST_UPDATED = 'forecast_updated',
  TOKEN_MINTED = 'token_minted',
  PROFILE_UPDATED = 'profile_updated',
}

/**
 * Time range for metrics
 */
export enum TimeRange {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  LAST_YEAR = 'last_year',
}

// ============================================================================
// Core Entities
// ============================================================================

/**
 * KPI Metric data point
 */
export interface KPIMetric {
  id: string;
  type: MetricType;
  label: string;
  value: number;
  unit: string;
  previousValue: number;
  trend: TrendDirection;
  changePercentage: number;
  icon: string;
  color: string;
  description: string;
}

/**
 * Skill Growth Data
 */
export interface SkillGrowth {
  skillName: string;
  domain: string;
  previousStrength: number;
  currentStrength: number;
  growthRate: number;
  trend: TrendDirection;
  daysTracked: number;
}

/**
 * Learning Progress Tracking
 */
export interface LearningProgress {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  plannedCourses: number;
  totalHours: number;
  completedHours: number;
  completionRate: number;
  streak: number;
  lastActivityDate: Date;
}

/**
 * Skill Summary Statistics
 */
export interface SkillSummary {
  totalSkills: number;
  verifiedSkills: number;
  topDomain: string;
  topDomainStrength: number;
  averageStrength: number;
  emergingSkills: number;
  obsoleteRisk: number;
  strengthDistribution: {
    expert: number;
    advanced: number;
    intermediate: number;
    beginner: number;
  };
}

/**
 * Forecast Teaser Data
 */
export interface ForecastTeaser {
  id: string;
  skillName: string;
  domain: string;
  currentDemand: number;
  predictedDemand: number;
  growthRate: number;
  confidence: number;
  timeHorizon: string;
  trend: TrendDirection;
  emergingStatus: 'hot' | 'rising' | 'stable' | 'declining';
}

/**
 * Course Recommendation
 */
export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  skillsCovered: string[];
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  enrollments: number;
  matchScore: number;
  reason: string;
  thumbnail: string;
  url: string;
}

/**
 * Activity Event
 */
export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
  metadata: Record<string, any>;
}

/**
 * Quick Action Item
 */
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  badge?: string | number;
}

// ============================================================================
// Dashboard State
// ============================================================================

/**
 * Complete dashboard state
 */
export interface DashboardState {
  user: {
    name: string;
    avatar: string;
    memberSince: Date;
    lastLogin: Date;
  };
  kpiMetrics: KPIMetric[];
  skillGrowth: SkillGrowth[];
  learningProgress: LearningProgress;
  skillSummary: SkillSummary;
  forecastTeasers: ForecastTeaser[];
  courseRecommendations: CourseRecommendation[];
  recentActivities: ActivityEvent[];
  quickActions: QuickAction[];
  isLoading: boolean;
  timeRange: TimeRange;
}

/**
 * Dashboard Actions
 */
export interface DashboardActions {
  refreshDashboard: () => Promise<void>;
  setTimeRange: (range: TimeRange) => void;
  dismissRecommendation: (id: string) => void;
  trackActivity: (activity: ActivityEvent) => void;
  updateKPIs: () => Promise<void>;
}

/**
 * Dashboard Context (State + Actions)
 */
export interface DashboardContextType {
  state: DashboardState;
  actions: DashboardActions;
}

// ============================================================================
// Widget Configuration
// ============================================================================

/**
 * Widget configuration
 */
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
  refreshInterval?: number;
}

/**
 * Dashboard Layout Configuration
 */
export interface DashboardLayout {
  widgets: WidgetConfig[];
  greeting: {
    enabled: boolean;
    timeBasedMessage: boolean;
  };
  sidebar: {
    visible: boolean;
    collapsed: boolean;
  };
  theme: 'dark' | 'light';
}
