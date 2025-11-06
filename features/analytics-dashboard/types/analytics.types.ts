/**
 * Analytics Dashboard Types
 * 
 * Comprehensive type system for analytics, KPIs, metrics, and visualizations
 */

// ==================== Time Range & Filters ====================

export type TimeRangePreset = '7d' | '30d' | '90d' | '1y' | 'all' | 'custom';

export interface TimeRange {
  preset: TimeRangePreset;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  label: string;
}

export interface AnalyticsFilters {
  timeRange: TimeRange;
  skillCategories?: string[];
  userSegments?: string[];
  credentialTypes?: string[];
  comparisonEnabled: boolean;
  comparisonTimeRange?: TimeRange;
}

// ==================== KPI Metrics ====================

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface MetricTrend {
  direction: TrendDirection;
  percentage: number; // e.g., 12.5 for +12.5%
  period: string; // e.g., "vs last month"
}

export interface KPIMetric {
  id: string;
  label: string;
  value: number;
  formattedValue: string; // e.g., "85.2%", "$12.5K", "1,234"
  unit?: string;
  trend?: MetricTrend;
  target?: number;
  icon: string; // Lucide icon name
  color: 'indigo' | 'purple' | 'cyan' | 'green' | 'amber' | 'red';
  description?: string;
  sparklineData?: number[]; // Mini trend line data
}

export type KPICategory = 
  | 'retention'
  | 'completion'
  | 'engagement'
  | 'token-usage'
  | 'growth'
  | 'acquisition';

export interface KPIGroup {
  category: KPICategory;
  title: string;
  metrics: KPIMetric[];
}

// ==================== Chart Data ====================

export type ChartType = 
  | 'line'
  | 'bar'
  | 'donut'
  | 'pie'
  | 'area'
  | 'stacked-bar'
  | 'scatter'
  | 'heatmap';

export interface ChartDataPoint {
  label: string;
  value: number;
  formattedValue?: string;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface ChartSeries {
  id: string;
  name: string;
  data: ChartDataPoint[];
  color: string;
  type?: ChartType;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: ChartType;
  series: ChartSeries[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend: boolean;
  showGrid: boolean;
  height: number;
  colors: string[];
  animation: {
    enabled: boolean;
    duration: number; // milliseconds
    easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  };
  tooltip: {
    enabled: boolean;
    format: 'value' | 'percentage' | 'currency';
  };
}

// ==================== Analytics Widgets ====================

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface AnalyticsWidget {
  id: string;
  title: string;
  subtitle?: string;
  type: 'kpi' | 'chart' | 'table' | 'heatmap' | 'comparison';
  size: WidgetSize;
  data: KPIMetric | ChartConfig | TableData | HeatmapData;
  refreshInterval?: number; // seconds, 0 = manual only
  lastUpdated: string; // ISO 8601
  isLoading: boolean;
  error?: string;
}

export interface TableData {
  columns: Array<{
    id: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'badge' | 'progress';
    sortable: boolean;
  }>;
  rows: Array<Record<string, unknown>>;
  totalRows: number;
  pageSize: number;
  currentPage: number;
}

export interface HeatmapData {
  rows: string[];
  columns: string[];
  values: number[][];
  colorScale: {
    min: string;
    mid: string;
    max: string;
  };
}

// ==================== Specific Analytics Types ====================

export interface RetentionMetrics {
  overallRate: number; // percentage
  weeklyRetention: number[];
  monthlyRetention: number[];
  cohortRetention: Array<{
    cohort: string;
    week1: number;
    week2: number;
    week4: number;
    week8: number;
  }>;
  churnRate: number;
  churnReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
}

export interface CompletionMetrics {
  overallRate: number;
  courseCompletionRate: number;
  lessonCompletionRate: number;
  assessmentCompletionRate: number;
  averageTimeToComplete: number; // days
  completionByCategory: Array<{
    category: string;
    rate: number;
    count: number;
  }>;
  completionTrend: Array<{
    date: string;
    completed: number;
    started: number;
    rate: number;
  }>;
}

export interface TokenUsageMetrics {
  totalTokensEarned: number;
  totalTokensSpent: number;
  currentBalance: number;
  avgTokensPerUser: number;
  tokenVelocity: number; // tokens/day
  topEarningActivities: Array<{
    activity: string;
    tokens: number;
    users: number;
  }>;
  topSpendingCategories: Array<{
    category: string;
    tokens: number;
    transactions: number;
  }>;
  tokenTrend: Array<{
    date: string;
    earned: number;
    spent: number;
    balance: number;
  }>;
}

export interface EngagementMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: number; // minutes
  avgSessionsPerUser: number;
  topFeatures: Array<{
    feature: string;
    usage: number;
    users: number;
  }>;
  engagementByTimeOfDay: Array<{
    hour: number;
    sessions: number;
  }>;
  engagementTrend: Array<{
    date: string;
    dau: number;
    wau: number;
    mau: number;
  }>;
}

// ==================== Dashboard Layout ====================

export type DashboardLayout = 'grid' | 'masonry' | 'flex';

export interface DashboardSection {
  id: string;
  title: string;
  description?: string;
  layout: DashboardLayout;
  widgets: AnalyticsWidget[];
  collapsible: boolean;
  collapsed: boolean;
}

export interface AnalyticsDashboard {
  id: string;
  name: string;
  description?: string;
  sections: DashboardSection[];
  filters: AnalyticsFilters;
  lastRefreshed: string;
  autoRefresh: boolean;
  refreshInterval: number; // seconds
}

// ==================== Export & Sharing ====================

export type ExportFormat = 'pdf' | 'csv' | 'excel' | 'png' | 'json';

export interface ExportConfig {
  format: ExportFormat;
  sections: string[]; // widget IDs to include
  includeCharts: boolean;
  includeRawData: boolean;
  dateRange: TimeRange;
  filename?: string;
}

export interface ShareConfig {
  isPublic: boolean;
  allowedUsers: string[];
  allowedTeams: string[];
  expiresAt?: string;
  requiresAuth: boolean;
  shareUrl?: string;
}

// ==================== Real-time Updates ====================

export interface MetricUpdate {
  metricId: string;
  newValue: number;
  timestamp: string;
  changeType: 'increase' | 'decrease' | 'stable';
}

export interface DashboardUpdate {
  dashboardId: string;
  updates: MetricUpdate[];
  timestamp: string;
}

// ==================== Helper Functions ====================

export const getTimeRangePresets = (): TimeRange[] => {
  const now = new Date();
  const today = now.toISOString();
  
  return [
    {
      preset: '7d',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: today,
      label: 'Last 7 days',
    },
    {
      preset: '30d',
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: today,
      label: 'Last 30 days',
    },
    {
      preset: '90d',
      startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: today,
      label: 'Last 90 days',
    },
    {
      preset: '1y',
      startDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: today,
      label: 'Last year',
    },
    {
      preset: 'all',
      startDate: new Date('2024-01-01').toISOString(),
      endDate: today,
      label: 'All time',
    },
  ];
};

export const formatMetricValue = (value: number, unit?: string): string => {
  if (unit === 'percentage') {
    return `${value.toFixed(1)}%`;
  }
  if (unit === 'currency') {
    return `$${value.toLocaleString()}`;
  }
  if (unit === 'time') {
    return `${Math.floor(value)}m`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};

export const getTrendColor = (direction: TrendDirection): string => {
  switch (direction) {
    case 'up': return 'text-green-400';
    case 'down': return 'text-red-400';
    case 'neutral': return 'text-slate-400';
  }
};

export const getTrendIcon = (direction: TrendDirection): string => {
  switch (direction) {
    case 'up': return 'TrendingUp';
    case 'down': return 'TrendingDown';
    case 'neutral': return 'Minus';
  }
};

export const getKPIColor = (color: KPIMetric['color']): { bg: string; text: string; glow: string } => {
  const colors = {
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
    green: { bg: 'bg-green-500/10', text: 'text-green-400', glow: 'shadow-green-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', glow: 'shadow-red-500/20' },
  };
  return colors[color];
};

export const calculateTrend = (current: number, previous: number): MetricTrend => {
  const change = ((current - previous) / previous) * 100;
  return {
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
    percentage: Math.abs(change),
    period: 'vs previous period',
  };
};

export const generateSparklineData = (count: number = 10): number[] => {
  const data: number[] = [];
  let value = 50 + Math.random() * 50;
  
  for (let i = 0; i < count; i++) {
    data.push(value);
    value += (Math.random() - 0.5) * 20;
    value = Math.max(0, Math.min(100, value));
  }
  
  return data;
};
