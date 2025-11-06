/**
 * Enterprise Analytics Types
 * 
 * Comprehensive type definitions for enterprise HR analytics dashboard
 * including KPIs, metrics, department data, team leaderboard, and filters.
 */

/**
 * Time period for analytics data
 */
export enum TimePeriod {
  Last7Days = 'last_7_days',
  Last30Days = 'last_30_days',
  Last90Days = 'last_90_days',
  LastYear = 'last_year',
  Custom = 'custom',
}

/**
 * Department categories
 */
export enum Department {
  All = 'all',
  Engineering = 'engineering',
  Design = 'design',
  Product = 'product',
  Marketing = 'marketing',
  Sales = 'sales',
  HR = 'hr',
  Finance = 'finance',
  Operations = 'operations',
}

/**
 * Trend direction for metrics
 */
export enum TrendDirection {
  Up = 'up',
  Down = 'down',
  Stable = 'stable',
}

/**
 * KPI metric type
 */
export enum KPIType {
  Engagement = 'engagement',
  Retention = 'retention',
  SkillGaps = 'skill_gaps',
  LearningHours = 'learning_hours',
}

/**
 * Chart type for visualizations
 */
export enum ChartType {
  Bar = 'bar',
  Donut = 'donut',
  Line = 'line',
  Heatmap = 'heatmap',
}

/**
 * KPI Metric interface
 */
export interface KPIMetric {
  id: string;
  type: KPIType;
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
 * Department data for charts
 */
export interface DepartmentData {
  department: Department;
  departmentName: string;
  employeeCount: number;
  averageSkillCount: number;
  engagementRate: number;
  skillGapPercentage: number;
  topSkills: SkillSummary[];
  color: string;
}

/**
 * Skill summary
 */
export interface SkillSummary {
  id: string;
  name: string;
  count: number;
  averageStrength: number;
  trend: TrendDirection;
}

/**
 * Team leaderboard entry
 */
export interface TeamLeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  department: Department;
  memberCount: number;
  totalSkillsAcquired: number;
  averageEngagementRate: number;
  averageSkillStrength: number;
  growthRate: number;
  topPerformers: string[];
  badge?: string;
  avatar?: string;
}

/**
 * Skill gap analysis
 */
export interface SkillGap {
  id: string;
  skillName: string;
  requiredBy: string[];
  currentStrength: number;
  targetStrength: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  affectedEmployees: number;
  department: Department;
  estimatedTrainingHours: number;
}

/**
 * Retention statistics
 */
export interface RetentionStats {
  overallRetentionRate: number;
  retentionByDepartment: {
    department: Department;
    retentionRate: number;
    changePercentage: number;
  }[];
  atRiskEmployees: number;
  topRetentionFactors: {
    factor: string;
    impact: number;
  }[];
}

/**
 * Engagement metrics
 */
export interface EngagementMetrics {
  overallEngagement: number;
  activeUsers: number;
  averageSessionDuration: number;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  engagementByDepartment: {
    department: Department;
    engagementRate: number;
  }[];
}

/**
 * Learning hours breakdown
 */
export interface LearningHoursData {
  totalHours: number;
  averageHoursPerEmployee: number;
  hoursByDepartment: {
    department: Department;
    hours: number;
  }[];
  hoursBySkillCategory: {
    category: string;
    hours: number;
  }[];
  trend: {
    date: string;
    hours: number;
  }[];
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

/**
 * Filter state
 */
export interface AnalyticsFilters {
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
  departments: Department[];
  teams: string[];
  minEngagement?: number;
  maxEngagement?: number;
}

/**
 * Analytics dashboard state
 */
export interface EnterpriseAnalyticsState {
  kpis: KPIMetric[];
  departments: DepartmentData[];
  teamLeaderboard: TeamLeaderboardEntry[];
  skillGaps: SkillGap[];
  retentionStats: RetentionStats;
  engagementMetrics: EngagementMetrics;
  learningHoursData: LearningHoursData;
  filters: AnalyticsFilters;
  loading: boolean;
  error: string | null;
}

/**
 * Export data format
 */
export enum ExportFormat {
  CSV = 'csv',
  Excel = 'excel',
  PDF = 'pdf',
  JSON = 'json',
}

/**
 * Helper functions
 */

/**
 * Get department color
 */
export const getDepartmentColor = (department: Department): string => {
  const colors: Record<Department, string> = {
    [Department.All]: '#64748B',
    [Department.Engineering]: '#6366F1',
    [Department.Design]: '#A855F7',
    [Department.Product]: '#22D3EE',
    [Department.Marketing]: '#F59E0B',
    [Department.Sales]: '#10B981',
    [Department.HR]: '#EF4444',
    [Department.Finance]: '#3B82F6',
    [Department.Operations]: '#8B5CF6',
  };
  return colors[department];
};

/**
 * Get department name
 */
export const getDepartmentName = (department: Department): string => {
  const names: Record<Department, string> = {
    [Department.All]: 'All Departments',
    [Department.Engineering]: 'Engineering',
    [Department.Design]: 'Design',
    [Department.Product]: 'Product',
    [Department.Marketing]: 'Marketing',
    [Department.Sales]: 'Sales',
    [Department.HR]: 'Human Resources',
    [Department.Finance]: 'Finance',
    [Department.Operations]: 'Operations',
  };
  return names[department];
};

/**
 * Get trend icon
 */
export const getTrendIcon = (trend: TrendDirection): string => {
  const icons: Record<TrendDirection, string> = {
    [TrendDirection.Up]: '📈',
    [TrendDirection.Down]: '📉',
    [TrendDirection.Stable]: '➡️',
  };
  return icons[trend];
};

/**
 * Get trend color class
 */
export const getTrendColorClass = (trend: TrendDirection): string => {
  const classes: Record<TrendDirection, string> = {
    [TrendDirection.Up]: 'text-emerald-400',
    [TrendDirection.Down]: 'text-red-400',
    [TrendDirection.Stable]: 'text-slate-400',
  };
  return classes[trend];
};

/**
 * Get KPI icon
 */
export const getKPIIcon = (type: KPIType): string => {
  const icons: Record<KPIType, string> = {
    [KPIType.Engagement]: '⚡',
    [KPIType.Retention]: '🎯',
    [KPIType.SkillGaps]: '📊',
    [KPIType.LearningHours]: '📚',
  };
  return icons[type];
};

/**
 * Get KPI color
 */
export const getKPIColor = (type: KPIType): string => {
  const colors: Record<KPIType, string> = {
    [KPIType.Engagement]: '#6366F1',
    [KPIType.Retention]: '#10B981',
    [KPIType.SkillGaps]: '#F59E0B',
    [KPIType.LearningHours]: '#22D3EE',
  };
  return colors[type];
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with K/M suffix
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Format hours
 */
export const formatHours = (hours: number): string => {
  if (hours >= 1000) {
    return `${(hours / 1000).toFixed(1)}K hrs`;
  }
  return `${hours.toFixed(0)} hrs`;
};

/**
 * Calculate trend direction
 */
export const calculateTrend = (current: number, previous: number): TrendDirection => {
  const change = ((current - previous) / previous) * 100;
  if (change > 2) return TrendDirection.Up;
  if (change < -2) return TrendDirection.Down;
  return TrendDirection.Stable;
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get skill gap priority color
 */
export const getSkillGapPriorityColor = (priority: 'high' | 'medium' | 'low'): string => {
  const colors = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
  };
  return colors[priority];
};

/**
 * Get badge for rank
 */
export const getRankBadge = (rank: number): string => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};

/**
 * Time period labels
 */
export const getTimePeriodLabel = (period: TimePeriod): string => {
  const labels: Record<TimePeriod, string> = {
    [TimePeriod.Last7Days]: 'Last 7 Days',
    [TimePeriod.Last30Days]: 'Last 30 Days',
    [TimePeriod.Last90Days]: 'Last 90 Days',
    [TimePeriod.LastYear]: 'Last Year',
    [TimePeriod.Custom]: 'Custom Range',
  };
  return labels[period];
};
