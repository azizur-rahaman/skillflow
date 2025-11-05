/**
 * Dashboard Context
 * 
 * State management for personalized dashboard with KPIs, metrics, and recommendations.
 * Provides comprehensive data for home hub visualization.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  MetricType,
  TrendDirection,
  TimeRange,
  ActivityType,
} from '../types/dashboard.types';
import type {
  DashboardContextType,
  DashboardState,
  DashboardActions,
  KPIMetric,
  SkillGrowth,
  LearningProgress,
  SkillSummary,
  ForecastTeaser,
  CourseRecommendation,
  ActivityEvent,
  QuickAction,
} from '../types/dashboard.types';

// ============================================================================
// Context
// ============================================================================

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// ============================================================================
// Mock Data Generators
// ============================================================================

const generateMockKPIMetrics = (): KPIMetric[] => [
  {
    id: 'skill-growth',
    type: MetricType.SKILL_GROWTH,
    label: 'Skills Growth',
    value: 12,
    unit: 'skills',
    previousValue: 8,
    trend: TrendDirection.UP,
    changePercentage: 50,
    icon: 'TrendingUp',
    color: '#10B981',
    description: 'New skills acquired this month',
  },
  {
    id: 'learning-progress',
    type: MetricType.LEARNING_PROGRESS,
    label: 'Learning Progress',
    value: 68,
    unit: '%',
    previousValue: 52,
    trend: TrendDirection.UP,
    changePercentage: 31,
    icon: 'BookOpen',
    color: '#6366F1',
    description: 'Course completion rate',
  },
  {
    id: 'engagement-score',
    type: MetricType.ENGAGEMENT_SCORE,
    label: 'Engagement Score',
    value: 92,
    unit: 'pts',
    previousValue: 88,
    trend: TrendDirection.UP,
    changePercentage: 5,
    icon: 'Zap',
    color: '#22D3EE',
    description: 'Platform engagement level',
  },
  {
    id: 'skill-velocity',
    type: MetricType.SKILL_VELOCITY,
    label: 'Skill Velocity',
    value: 3.2,
    unit: 'pts/week',
    previousValue: 2.8,
    trend: TrendDirection.UP,
    changePercentage: 14,
    icon: 'Rocket',
    color: '#A855F7',
    description: 'Average skill growth rate',
  },
];

const generateMockSkillGrowth = (): SkillGrowth[] => [
  {
    skillName: 'React',
    domain: 'Frontend',
    previousStrength: 82,
    currentStrength: 92,
    growthRate: 12.2,
    trend: TrendDirection.UP,
    daysTracked: 30,
  },
  {
    skillName: 'TypeScript',
    domain: 'Frontend',
    previousStrength: 75,
    currentStrength: 88,
    growthRate: 17.3,
    trend: TrendDirection.UP,
    daysTracked: 30,
  },
  {
    skillName: 'Python',
    domain: 'Backend',
    previousStrength: 70,
    currentStrength: 78,
    growthRate: 11.4,
    trend: TrendDirection.UP,
    daysTracked: 30,
  },
  {
    skillName: 'Machine Learning',
    domain: 'AI/ML',
    previousStrength: 60,
    currentStrength: 72,
    growthRate: 20.0,
    trend: TrendDirection.UP,
    daysTracked: 30,
  },
  {
    skillName: 'System Design',
    domain: 'Backend',
    previousStrength: 65,
    currentStrength: 75,
    growthRate: 15.4,
    trend: TrendDirection.UP,
    daysTracked: 30,
  },
];

const generateMockLearningProgress = (): LearningProgress => ({
  totalCourses: 15,
  completedCourses: 8,
  inProgressCourses: 4,
  plannedCourses: 3,
  totalHours: 180,
  completedHours: 122,
  completionRate: 68,
  streak: 12,
  lastActivityDate: new Date('2025-11-05'),
});

const generateMockSkillSummary = (): SkillSummary => ({
  totalSkills: 48,
  verifiedSkills: 32,
  topDomain: 'Frontend',
  topDomainStrength: 92,
  averageStrength: 78.5,
  emergingSkills: 5,
  obsoleteRisk: 2,
  strengthDistribution: {
    expert: 8,
    advanced: 15,
    intermediate: 18,
    beginner: 7,
  },
});

const generateMockForecastTeasers = (): ForecastTeaser[] => [
  {
    id: 'forecast-1',
    skillName: 'Next.js 15',
    domain: 'Frontend',
    currentDemand: 72,
    predictedDemand: 95,
    growthRate: 31.9,
    confidence: 89,
    timeHorizon: '6 months',
    trend: TrendDirection.UP,
    emergingStatus: 'hot',
  },
  {
    id: 'forecast-2',
    skillName: 'LangChain',
    domain: 'AI/ML',
    currentDemand: 65,
    predictedDemand: 88,
    growthRate: 35.4,
    confidence: 85,
    timeHorizon: '6 months',
    trend: TrendDirection.UP,
    emergingStatus: 'hot',
  },
  {
    id: 'forecast-3',
    skillName: 'Rust',
    domain: 'Backend',
    currentDemand: 58,
    predictedDemand: 78,
    growthRate: 34.5,
    confidence: 82,
    timeHorizon: '6 months',
    trend: TrendDirection.UP,
    emergingStatus: 'rising',
  },
];

const generateMockCourseRecommendations = (): CourseRecommendation[] => [
  {
    id: 'course-1',
    title: 'Advanced Next.js 15 & Server Actions',
    provider: 'Udemy',
    skillsCovered: ['Next.js', 'React Server Components', 'TypeScript'],
    duration: 24,
    difficulty: 'advanced',
    rating: 4.8,
    enrollments: 12543,
    matchScore: 95,
    reason: 'Aligns with your Frontend growth trajectory',
    thumbnail: '/course-nextjs.jpg',
    url: 'https://udemy.com/course/nextjs-advanced',
  },
  {
    id: 'course-2',
    title: 'LangChain & AI Agents Masterclass',
    provider: 'Coursera',
    skillsCovered: ['LangChain', 'OpenAI', 'Python', 'AI Agents'],
    duration: 32,
    difficulty: 'intermediate',
    rating: 4.9,
    enrollments: 8932,
    matchScore: 92,
    reason: 'Trending skill with 89% forecast confidence',
    thumbnail: '/course-langchain.jpg',
    url: 'https://coursera.org/langchain',
  },
  {
    id: 'course-3',
    title: 'System Design for Senior Engineers',
    provider: 'Educative',
    skillsCovered: ['System Design', 'Scalability', 'Architecture'],
    duration: 28,
    difficulty: 'advanced',
    rating: 4.7,
    enrollments: 15234,
    matchScore: 88,
    reason: 'Fills gap in your Backend domain',
    thumbnail: '/course-system-design.jpg',
    url: 'https://educative.io/system-design',
  },
];

const generateMockRecentActivities = (): ActivityEvent[] => [
  {
    id: 'activity-1',
    type: ActivityType.SKILL_VERIFIED,
    title: 'React skill verified',
    description: 'Your React proficiency reached 92% strength',
    timestamp: new Date('2025-11-05T14:30:00'),
    icon: 'CheckCircle2',
    color: '#10B981',
    metadata: { skillName: 'React', strength: 92 },
  },
  {
    id: 'activity-2',
    type: ActivityType.COURSE_COMPLETED,
    title: 'Course completed',
    description: 'Finished "Advanced TypeScript Patterns"',
    timestamp: new Date('2025-11-04T18:45:00'),
    icon: 'GraduationCap',
    color: '#6366F1',
    metadata: { courseName: 'Advanced TypeScript Patterns' },
  },
  {
    id: 'activity-3',
    type: ActivityType.BADGE_EARNED,
    title: 'Badge unlocked',
    description: 'Earned "Frontend Master" achievement',
    timestamp: new Date('2025-11-03T10:20:00'),
    icon: 'Award',
    color: '#A855F7',
    metadata: { badgeName: 'Frontend Master' },
  },
  {
    id: 'activity-4',
    type: ActivityType.FORECAST_UPDATED,
    title: 'Forecast updated',
    description: 'New predictions available for 5 skills',
    timestamp: new Date('2025-11-02T09:15:00'),
    icon: 'TrendingUp',
    color: '#22D3EE',
    metadata: { skillCount: 5 },
  },
];

const generateMockQuickActions = (): QuickAction[] => [
  {
    id: 'action-1',
    label: 'View Skill DNA',
    description: 'Explore your skill ecosystem',
    icon: 'Dna',
    color: '#6366F1',
    route: '/skills/dna',
  },
  {
    id: 'action-2',
    label: 'Continue Learning',
    description: '4 courses in progress',
    icon: 'BookOpen',
    color: '#10B981',
    route: '/learning',
    badge: 4,
  },
  {
    id: 'action-3',
    label: 'View Forecasts',
    description: 'See trending skills',
    icon: 'TrendingUp',
    color: '#22D3EE',
    route: '/forecast',
  },
  {
    id: 'action-4',
    label: 'Manage Tokens',
    description: 'Your skill credentials',
    icon: 'Coins',
    color: '#A855F7',
    route: '/wallet',
    badge: '8',
  },
];

// ============================================================================
// Initial State
// ============================================================================

const initialState: DashboardState = {
  user: {
    name: 'Alex Chen',
    avatar: '/avatar-placeholder.jpg',
    memberSince: new Date('2024-06-15'),
    lastLogin: new Date('2025-11-05T14:30:00'),
  },
  kpiMetrics: generateMockKPIMetrics(),
  skillGrowth: generateMockSkillGrowth(),
  learningProgress: generateMockLearningProgress(),
  skillSummary: generateMockSkillSummary(),
  forecastTeasers: generateMockForecastTeasers(),
  courseRecommendations: generateMockCourseRecommendations(),
  recentActivities: generateMockRecentActivities(),
  quickActions: generateMockQuickActions(),
  isLoading: false,
  timeRange: TimeRange.LAST_30_DAYS,
};

// ============================================================================
// Provider Component
// ============================================================================

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DashboardState>(initialState);

  // Refresh entire dashboard
  const refreshDashboard = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setState((prev) => ({
      ...prev,
      kpiMetrics: generateMockKPIMetrics(),
      skillGrowth: generateMockSkillGrowth(),
      learningProgress: generateMockLearningProgress(),
      skillSummary: generateMockSkillSummary(),
      forecastTeasers: generateMockForecastTeasers(),
      courseRecommendations: generateMockCourseRecommendations(),
      recentActivities: generateMockRecentActivities(),
      isLoading: false,
    }));
  }, []);

  // Update time range
  const setTimeRange = useCallback((range: TimeRange) => {
    setState((prev) => ({ ...prev, timeRange: range }));
  }, []);

  // Dismiss course recommendation
  const dismissRecommendation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      courseRecommendations: prev.courseRecommendations.filter((rec) => rec.id !== id),
    }));
  }, []);

  // Track activity
  const trackActivity = useCallback((activity: ActivityEvent) => {
    setState((prev) => ({
      ...prev,
      recentActivities: [activity, ...prev.recentActivities].slice(0, 10),
    }));
  }, []);

  // Update KPIs
  const updateKPIs = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise((resolve) => setTimeout(resolve, 500));

    setState((prev) => ({
      ...prev,
      kpiMetrics: generateMockKPIMetrics(),
      isLoading: false,
    }));
  }, []);

  const actions: DashboardActions = {
    refreshDashboard,
    setTimeRange,
    dismissRecommendation,
    trackActivity,
    updateKPIs,
  };

  const value: DashboardContextType = {
    state,
    actions,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
