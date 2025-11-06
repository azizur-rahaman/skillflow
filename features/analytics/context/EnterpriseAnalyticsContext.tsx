'use client';

/**
 * Enterprise Analytics Context
 * 
 * Manages state and data for enterprise HR analytics dashboard
 * Provides mock data for KPIs, departments, teams, and skill gaps
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  EnterpriseAnalyticsState,
  KPIMetric,
  KPIType,
  Department,
  DepartmentData,
  TeamLeaderboardEntry,
  SkillGap,
  RetentionStats,
  EngagementMetrics,
  LearningHoursData,
  AnalyticsFilters,
  TimePeriod,
  TrendDirection,
  ExportFormat,
  getDepartmentColor,
  getDepartmentName,
  calculatePercentageChange,
  calculateTrend,
} from '../types/enterprise-analytics.types';

interface EnterpriseAnalyticsContextValue extends EnterpriseAnalyticsState {
  setFilters: (filters: Partial<AnalyticsFilters>) => void;
  refreshData: () => Promise<void>;
  exportData: (format: ExportFormat) => Promise<void>;
}

const EnterpriseAnalyticsContext = createContext<EnterpriseAnalyticsContextValue | undefined>(
  undefined
);

export const useEnterpriseAnalytics = () => {
  const context = useContext(EnterpriseAnalyticsContext);
  if (!context) {
    throw new Error('useEnterpriseAnalytics must be used within EnterpriseAnalyticsProvider');
  }
  return context;
};

interface EnterpriseAnalyticsProviderProps {
  children: ReactNode;
}

export const EnterpriseAnalyticsProvider: React.FC<EnterpriseAnalyticsProviderProps> = ({
  children,
}) => {
  // Mock KPI data
  const mockKPIs: KPIMetric[] = [
    {
      id: 'kpi-1',
      type: KPIType.Engagement,
      label: 'Employee Engagement',
      value: 87.5,
      unit: '%',
      previousValue: 82.3,
      trend: TrendDirection.Up,
      changePercentage: 6.3,
      icon: '⚡',
      color: '#6366F1',
      description: 'Active participation in learning and skill development',
    },
    {
      id: 'kpi-2',
      type: KPIType.Retention,
      label: 'Skill Retention Rate',
      value: 92.8,
      unit: '%',
      previousValue: 94.2,
      trend: TrendDirection.Down,
      changePercentage: -1.5,
      icon: '🎯',
      color: '#10B981',
      description: 'Employees maintaining and applying learned skills',
    },
    {
      id: 'kpi-3',
      type: KPIType.SkillGaps,
      label: 'Critical Skill Gaps',
      value: 23,
      unit: 'gaps',
      previousValue: 31,
      trend: TrendDirection.Down,
      changePercentage: -25.8,
      icon: '📊',
      color: '#F59E0B',
      description: 'Number of identified critical skill deficiencies',
    },
    {
      id: 'kpi-4',
      type: KPIType.LearningHours,
      label: 'Learning Hours (This Month)',
      value: 12450,
      unit: 'hrs',
      previousValue: 11230,
      trend: TrendDirection.Up,
      changePercentage: 10.9,
      icon: '📚',
      color: '#22D3EE',
      description: 'Total hours invested in skill development',
    },
  ];

  // Mock department data
  const mockDepartments: DepartmentData[] = [
    {
      department: Department.Engineering,
      departmentName: getDepartmentName(Department.Engineering),
      employeeCount: 245,
      averageSkillCount: 18.7,
      engagementRate: 91.2,
      skillGapPercentage: 12.3,
      topSkills: [
        { id: 's1', name: 'React.js', count: 156, averageStrength: 82, trend: TrendDirection.Up },
        { id: 's2', name: 'Python', count: 189, averageStrength: 88, trend: TrendDirection.Up },
        { id: 's3', name: 'AWS', count: 134, averageStrength: 76, trend: TrendDirection.Stable },
        { id: 's4', name: 'TypeScript', count: 142, averageStrength: 85, trend: TrendDirection.Up },
        { id: 's5', name: 'Docker', count: 128, averageStrength: 79, trend: TrendDirection.Stable },
      ],
      color: getDepartmentColor(Department.Engineering),
    },
    {
      department: Department.Design,
      departmentName: getDepartmentName(Department.Design),
      employeeCount: 87,
      averageSkillCount: 14.2,
      engagementRate: 88.4,
      skillGapPercentage: 15.8,
      topSkills: [
        { id: 's6', name: 'Figma', count: 78, averageStrength: 90, trend: TrendDirection.Up },
        { id: 's7', name: 'UI/UX Design', count: 82, averageStrength: 86, trend: TrendDirection.Up },
        { id: 's8', name: 'Adobe XD', count: 61, averageStrength: 81, trend: TrendDirection.Down },
        { id: 's9', name: 'Prototyping', count: 73, averageStrength: 84, trend: TrendDirection.Up },
        { id: 's10', name: 'Design Systems', count: 45, averageStrength: 78, trend: TrendDirection.Up },
      ],
      color: getDepartmentColor(Department.Design),
    },
    {
      department: Department.Product,
      departmentName: getDepartmentName(Department.Product),
      employeeCount: 62,
      averageSkillCount: 16.5,
      engagementRate: 85.7,
      skillGapPercentage: 18.2,
      topSkills: [
        { id: 's11', name: 'Product Management', count: 58, averageStrength: 87, trend: TrendDirection.Up },
        { id: 's12', name: 'Data Analysis', count: 52, averageStrength: 83, trend: TrendDirection.Up },
        { id: 's13', name: 'SQL', count: 48, averageStrength: 80, trend: TrendDirection.Stable },
        { id: 's14', name: 'Agile/Scrum', count: 59, averageStrength: 89, trend: TrendDirection.Up },
        { id: 's15', name: 'User Research', count: 42, averageStrength: 85, trend: TrendDirection.Up },
      ],
      color: getDepartmentColor(Department.Product),
    },
    {
      department: Department.Marketing,
      departmentName: getDepartmentName(Department.Marketing),
      employeeCount: 118,
      averageSkillCount: 12.8,
      engagementRate: 82.1,
      skillGapPercentage: 21.5,
      topSkills: [
        { id: 's16', name: 'Digital Marketing', count: 102, averageStrength: 84, trend: TrendDirection.Up },
        { id: 's17', name: 'SEO', count: 89, averageStrength: 79, trend: TrendDirection.Up },
        { id: 's18', name: 'Content Strategy', count: 95, averageStrength: 86, trend: TrendDirection.Up },
        { id: 's19', name: 'Analytics', count: 78, averageStrength: 77, trend: TrendDirection.Stable },
        { id: 's20', name: 'Social Media', count: 105, averageStrength: 82, trend: TrendDirection.Up },
      ],
      color: getDepartmentColor(Department.Marketing),
    },
    {
      department: Department.Sales,
      departmentName: getDepartmentName(Department.Sales),
      employeeCount: 156,
      averageSkillCount: 11.3,
      engagementRate: 79.6,
      skillGapPercentage: 24.7,
      topSkills: [
        { id: 's21', name: 'Sales Strategy', count: 142, averageStrength: 85, trend: TrendDirection.Up },
        { id: 's22', name: 'CRM (Salesforce)', count: 138, averageStrength: 81, trend: TrendDirection.Up },
        { id: 's23', name: 'Negotiation', count: 145, averageStrength: 88, trend: TrendDirection.Stable },
        { id: 's24', name: 'Lead Generation', count: 128, averageStrength: 79, trend: TrendDirection.Up },
        { id: 's25', name: 'Account Management', count: 119, averageStrength: 84, trend: TrendDirection.Up },
      ],
      color: getDepartmentColor(Department.Sales),
    },
    {
      department: Department.HR,
      departmentName: getDepartmentName(Department.HR),
      employeeCount: 45,
      averageSkillCount: 13.6,
      engagementRate: 90.3,
      skillGapPercentage: 14.2,
      topSkills: [
        { id: 's26', name: 'Talent Acquisition', count: 38, averageStrength: 87, trend: TrendDirection.Up },
        { id: 's27', name: 'Employee Relations', count: 42, averageStrength: 89, trend: TrendDirection.Stable },
        { id: 's28', name: 'Performance Management', count: 40, averageStrength: 85, trend: TrendDirection.Up },
        { id: 's29', name: 'HR Analytics', count: 28, averageStrength: 76, trend: TrendDirection.Up },
        { id: 's30', name: 'HRIS Systems', count: 35, averageStrength: 82, trend: TrendDirection.Up },
      ],
      color: getDepartmentColor(Department.HR),
    },
  ];

  // Mock team leaderboard
  const mockTeamLeaderboard: TeamLeaderboardEntry[] = [
    {
      rank: 1,
      teamId: 'team-1',
      teamName: 'Platform Engineering',
      department: Department.Engineering,
      memberCount: 28,
      totalSkillsAcquired: 156,
      averageEngagementRate: 94.5,
      averageSkillStrength: 87.2,
      growthRate: 18.3,
      topPerformers: ['Sarah Chen', 'Alex Thompson', 'Marcus Rodriguez'],
      badge: '🥇',
    },
    {
      rank: 2,
      teamId: 'team-2',
      teamName: 'Product Design',
      department: Department.Design,
      memberCount: 22,
      totalSkillsAcquired: 142,
      averageEngagementRate: 92.1,
      averageSkillStrength: 89.4,
      growthRate: 16.7,
      topPerformers: ['Emma Wilson', 'David Park', 'Lisa Anderson'],
      badge: '🥈',
    },
    {
      rank: 3,
      teamId: 'team-3',
      teamName: 'Data Science',
      department: Department.Engineering,
      memberCount: 18,
      totalSkillsAcquired: 134,
      averageEngagementRate: 91.8,
      averageSkillStrength: 88.9,
      growthRate: 15.4,
      topPerformers: ['Michael Zhang', 'Sophia Lee', 'Ryan Miller'],
      badge: '🥉',
    },
    {
      rank: 4,
      teamId: 'team-4',
      teamName: 'Product Analytics',
      department: Department.Product,
      memberCount: 16,
      totalSkillsAcquired: 128,
      averageEngagementRate: 90.3,
      averageSkillStrength: 86.5,
      growthRate: 14.2,
      topPerformers: ['Jennifer Davis', 'Kevin Johnson', 'Amanda White'],
    },
    {
      rank: 5,
      teamId: 'team-5',
      teamName: 'Growth Marketing',
      department: Department.Marketing,
      memberCount: 24,
      totalSkillsAcquired: 118,
      averageEngagementRate: 88.7,
      averageSkillStrength: 84.3,
      growthRate: 13.1,
      topPerformers: ['Chris Martinez', 'Nicole Taylor', 'Brian Anderson'],
    },
    {
      rank: 6,
      teamId: 'team-6',
      teamName: 'Enterprise Sales',
      department: Department.Sales,
      memberCount: 32,
      totalSkillsAcquired: 112,
      averageEngagementRate: 85.4,
      averageSkillStrength: 85.7,
      growthRate: 11.8,
      topPerformers: ['Robert Brown', 'Jessica Moore', 'Daniel Garcia'],
    },
    {
      rank: 7,
      teamId: 'team-7',
      teamName: 'Talent Acquisition',
      department: Department.HR,
      memberCount: 14,
      totalSkillsAcquired: 98,
      averageEngagementRate: 92.6,
      averageSkillStrength: 88.1,
      growthRate: 10.5,
      topPerformers: ['Ashley Wilson', 'James Taylor', 'Michelle Lee'],
    },
    {
      rank: 8,
      teamId: 'team-8',
      teamName: 'Mobile Development',
      department: Department.Engineering,
      memberCount: 20,
      totalSkillsAcquired: 94,
      averageEngagementRate: 87.2,
      averageSkillStrength: 83.6,
      growthRate: 9.7,
      topPerformers: ['Tyler Harris', 'Olivia Martinez', 'Nathan Clark'],
    },
  ];

  // Mock skill gaps
  const mockSkillGaps: SkillGap[] = [
    {
      id: 'gap-1',
      skillName: 'Machine Learning',
      requiredBy: ['Data Science Team', 'Product Analytics Team'],
      currentStrength: 45,
      targetStrength: 80,
      gap: 35,
      priority: 'high',
      affectedEmployees: 42,
      department: Department.Engineering,
      estimatedTrainingHours: 120,
    },
    {
      id: 'gap-2',
      skillName: 'Cloud Security',
      requiredBy: ['Platform Engineering', 'DevOps Team'],
      currentStrength: 58,
      targetStrength: 85,
      gap: 27,
      priority: 'high',
      affectedEmployees: 38,
      department: Department.Engineering,
      estimatedTrainingHours: 80,
    },
    {
      id: 'gap-3',
      skillName: 'Advanced SQL',
      requiredBy: ['Product Team', 'Marketing Analytics'],
      currentStrength: 62,
      targetStrength: 85,
      gap: 23,
      priority: 'medium',
      affectedEmployees: 56,
      department: Department.Product,
      estimatedTrainingHours: 60,
    },
    {
      id: 'gap-4',
      skillName: 'Design Systems',
      requiredBy: ['Product Design', 'Frontend Engineering'],
      currentStrength: 55,
      targetStrength: 80,
      gap: 25,
      priority: 'medium',
      affectedEmployees: 28,
      department: Department.Design,
      estimatedTrainingHours: 40,
    },
    {
      id: 'gap-5',
      skillName: 'Sales Automation',
      requiredBy: ['Enterprise Sales', 'SMB Sales'],
      currentStrength: 48,
      targetStrength: 75,
      gap: 27,
      priority: 'high',
      affectedEmployees: 64,
      department: Department.Sales,
      estimatedTrainingHours: 50,
    },
  ];

  // Mock retention stats
  const mockRetentionStats: RetentionStats = {
    overallRetentionRate: 92.8,
    retentionByDepartment: [
      { department: Department.Engineering, retentionRate: 94.2, changePercentage: 1.8 },
      { department: Department.Design, retentionRate: 93.5, changePercentage: 2.3 },
      { department: Department.Product, retentionRate: 91.8, changePercentage: -0.5 },
      { department: Department.Marketing, retentionRate: 89.4, changePercentage: -2.1 },
      { department: Department.Sales, retentionRate: 90.7, changePercentage: 0.8 },
      { department: Department.HR, retentionRate: 95.3, changePercentage: 3.2 },
    ],
    atRiskEmployees: 18,
    topRetentionFactors: [
      { factor: 'Career Growth Opportunities', impact: 87 },
      { factor: 'Skill Development Programs', impact: 82 },
      { factor: 'Work-Life Balance', impact: 78 },
      { factor: 'Competitive Compensation', impact: 75 },
      { factor: 'Recognition & Rewards', impact: 71 },
    ],
  };

  // Mock engagement metrics
  const mockEngagementMetrics: EngagementMetrics = {
    overallEngagement: 87.5,
    activeUsers: 612,
    averageSessionDuration: 42.5,
    dailyActiveUsers: 456,
    weeklyActiveUsers: 589,
    monthlyActiveUsers: 612,
    engagementByDepartment: [
      { department: Department.Engineering, engagementRate: 91.2 },
      { department: Department.Design, engagementRate: 88.4 },
      { department: Department.Product, engagementRate: 85.7 },
      { department: Department.Marketing, engagementRate: 82.1 },
      { department: Department.Sales, engagementRate: 79.6 },
      { department: Department.HR, engagementRate: 90.3 },
    ],
  };

  // Mock learning hours data
  const mockLearningHoursData: LearningHoursData = {
    totalHours: 12450,
    averageHoursPerEmployee: 20.3,
    hoursByDepartment: [
      { department: Department.Engineering, hours: 4580 },
      { department: Department.Design, hours: 1740 },
      { department: Department.Product, hours: 1260 },
      { department: Department.Marketing, hours: 2360 },
      { department: Department.Sales, hours: 1890 },
      { department: Department.HR, hours: 620 },
    ],
    hoursBySkillCategory: [
      { category: 'Technical Skills', hours: 5240 },
      { category: 'Design & Creative', hours: 2180 },
      { category: 'Business & Management', hours: 2840 },
      { category: 'Sales & Marketing', hours: 1560 },
      { category: 'Soft Skills', hours: 630 },
    ],
    trend: [
      { date: '2024-05', hours: 9850 },
      { date: '2024-06', hours: 10230 },
      { date: '2024-07', hours: 10780 },
      { date: '2024-08', hours: 11230 },
      { date: '2024-09', hours: 11650 },
      { date: '2024-10', hours: 12450 },
    ],
  };

  const [state, setState] = useState<EnterpriseAnalyticsState>({
    kpis: mockKPIs,
    departments: mockDepartments,
    teamLeaderboard: mockTeamLeaderboard,
    skillGaps: mockSkillGaps,
    retentionStats: mockRetentionStats,
    engagementMetrics: mockEngagementMetrics,
    learningHoursData: mockLearningHoursData,
    filters: {
      timePeriod: TimePeriod.Last30Days,
      departments: [Department.All],
      teams: [],
    },
    loading: false,
    error: null,
  });

  const setFilters = useCallback((filters: Partial<AnalyticsFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...filters,
      },
    }));
  }, []);

  const refreshData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setState((prev) => ({
      ...prev,
      loading: false,
    }));
  }, []);

  const exportData = useCallback(async (format: ExportFormat) => {
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`Exporting data as ${format}`);
  }, []);

  const value: EnterpriseAnalyticsContextValue = {
    ...state,
    setFilters,
    refreshData,
    exportData,
  };

  return (
    <EnterpriseAnalyticsContext.Provider value={value}>
      {children}
    </EnterpriseAnalyticsContext.Provider>
  );
};
