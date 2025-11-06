/**
 * Analytics Dashboard Context
 * 
 * State management with comprehensive mock analytics data
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  KPIMetric,
  ChartConfig,
  AnalyticsFilters,
  getTimeRangePresets,
  generateSparklineData,
} from '../types/analytics.types';

interface AnalyticsDashboardContextType {
  kpiMetrics: KPIMetric[];
  charts: ChartConfig[];
  filters: AnalyticsFilters;
  isLoading: boolean;
  actions: {
    updateFilters: (filters: AnalyticsFilters) => void;
    refreshData: () => void;
    exportData: (format: 'pdf' | 'csv' | 'excel' | 'png') => void;
  };
}

const AnalyticsDashboardContext = createContext<AnalyticsDashboardContextType | undefined>(undefined);

export const useAnalyticsDashboard = () => {
  const context = useContext(AnalyticsDashboardContext);
  if (!context) throw new Error('useAnalyticsDashboard must be used within provider');
  return context;
};

// Mock KPI Metrics
const mockKPIMetrics: KPIMetric[] = [
  {
    id: 'retention',
    label: 'User Retention',
    value: 85.2,
    formattedValue: '85.2%',
    unit: 'percentage',
    trend: { direction: 'up', percentage: 12.3, period: 'vs last month' },
    target: 90,
    icon: 'Users',
    color: 'indigo',
    description: 'Monthly active user retention rate',
    sparklineData: generateSparklineData(12),
  },
  {
    id: 'completion',
    label: 'Course Completion',
    value: 72.8,
    formattedValue: '72.8%',
    unit: 'percentage',
    trend: { direction: 'up', percentage: 8.5, period: 'vs last month' },
    target: 80,
    icon: 'CheckCircle',
    color: 'green',
    description: 'Overall course completion rate',
    sparklineData: generateSparklineData(12),
  },
  {
    id: 'tokens',
    label: 'Token Usage',
    value: 145600,
    formattedValue: '145.6K',
    unit: 'tokens',
    trend: { direction: 'up', percentage: 24.7, period: 'vs last month' },
    icon: 'Coins',
    color: 'amber',
    description: 'Total tokens earned this month',
    sparklineData: generateSparklineData(12),
  },
  {
    id: 'engagement',
    label: 'Daily Active Users',
    value: 8420,
    formattedValue: '8.42K',
    trend: { direction: 'up', percentage: 15.2, period: 'vs last week' },
    icon: 'Activity',
    color: 'purple',
    description: 'Average daily active users',
    sparklineData: generateSparklineData(12),
  },
  {
    id: 'skills-learned',
    label: 'Skills Learned',
    value: 3240,
    formattedValue: '3.24K',
    trend: { direction: 'up', percentage: 18.9, period: 'vs last month' },
    icon: 'Target',
    color: 'cyan',
    description: 'New skills acquired this month',
    sparklineData: generateSparklineData(12),
  },
  {
    id: 'credentials',
    label: 'Credentials Issued',
    value: 1850,
    formattedValue: '1.85K',
    trend: { direction: 'up', percentage: 22.1, period: 'vs last month' },
    icon: 'Zap',
    color: 'indigo',
    description: 'Blockchain credentials issued',
    sparklineData: generateSparklineData(12),
  },
];

// Mock Chart Configs
const mockCharts: ChartConfig[] = [
  {
    id: 'retention-trend',
    title: 'Retention Trend (90 Days)',
    type: 'line',
    series: [
      {
        id: 'retention',
        name: 'Retention Rate',
        data: [
          { label: 'Week 1', value: 78, formattedValue: '78%' },
          { label: 'Week 2', value: 82, formattedValue: '82%' },
          { label: 'Week 3', value: 80, formattedValue: '80%' },
          { label: 'Week 4', value: 83, formattedValue: '83%' },
          { label: 'Week 5', value: 85, formattedValue: '85%' },
          { label: 'Week 6', value: 84, formattedValue: '84%' },
          { label: 'Week 7', value: 86, formattedValue: '86%' },
          { label: 'Week 8', value: 85, formattedValue: '85%' },
        ],
        color: '#6366F1',
      },
    ],
    showLegend: true,
    showGrid: true,
    height: 300,
    colors: ['#6366F1'],
    animation: { enabled: true, duration: 1000, easing: 'ease-out' },
    tooltip: { enabled: true, format: 'percentage' },
  },
  {
    id: 'completion-comparison',
    title: 'Completion Rates by Category',
    type: 'bar',
    series: [
      {
        id: 'current',
        name: 'Current Period',
        data: [
          { label: 'Frontend', value: 78 },
          { label: 'Backend', value: 82 },
          { label: 'DevOps', value: 71 },
          { label: 'Data Science', value: 69 },
          { label: 'Design', value: 85 },
        ],
        color: '#A855F7',
      },
      {
        id: 'previous',
        name: 'Previous Period',
        data: [
          { label: 'Frontend', value: 72 },
          { label: 'Backend', value: 75 },
          { label: 'DevOps', value: 68 },
          { label: 'Data Science', value: 65 },
          { label: 'Design', value: 80 },
        ],
        color: '#334155',
      },
    ],
    showLegend: true,
    showGrid: true,
    height: 300,
    colors: ['#A855F7', '#334155'],
    animation: { enabled: true, duration: 800, easing: 'ease-out' },
    tooltip: { enabled: true, format: 'percentage' },
  },
  {
    id: 'token-distribution',
    title: 'Token Usage Distribution',
    type: 'donut',
    series: [
      {
        id: 'token-dist',
        name: 'Token Distribution',
        data: [
          { label: 'Learning Rewards', value: 45600, formattedValue: '45.6K', color: '#6366F1' },
          { label: 'Skill Verification', value: 32400, formattedValue: '32.4K', color: '#A855F7' },
          { label: 'Assessments', value: 28900, formattedValue: '28.9K', color: '#22D3EE' },
          { label: 'Marketplace', value: 22100, formattedValue: '22.1K', color: '#10B981' },
          { label: 'Referrals', value: 16600, formattedValue: '16.6K', color: '#F59E0B' },
        ],
        color: '#6366F1',
      },
    ],
    showLegend: true,
    showGrid: false,
    height: 300,
    colors: ['#6366F1', '#A855F7', '#22D3EE', '#10B981', '#F59E0B'],
    animation: { enabled: true, duration: 1200, easing: 'ease-out' },
    tooltip: { enabled: true, format: 'value' },
  },
  {
    id: 'engagement-trend',
    title: 'User Engagement Over Time',
    type: 'area',
    series: [
      {
        id: 'dau',
        name: 'Daily Active Users',
        data: [
          { label: 'Mon', value: 7800 },
          { label: 'Tue', value: 8200 },
          { label: 'Wed', value: 8500 },
          { label: 'Thu', value: 8900 },
          { label: 'Fri', value: 9200 },
          { label: 'Sat', value: 7100 },
          { label: 'Sun', value: 6800 },
        ],
        color: '#22D3EE',
      },
    ],
    showLegend: true,
    showGrid: true,
    height: 300,
    colors: ['#22D3EE'],
    animation: { enabled: true, duration: 1000, easing: 'ease-out' },
    tooltip: { enabled: true, format: 'value' },
  },
];

export const AnalyticsDashboardProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    timeRange: getTimeRangePresets()[1], // Default to 30 days
    comparisonEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const actions = {
    updateFilters: (newFilters: AnalyticsFilters) => {
      setFilters(newFilters);
    },
    
    refreshData: () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    },
    
    exportData: (format: 'pdf' | 'csv' | 'excel' | 'png') => {
      console.log(`Exporting analytics data as ${format}`);
      // Implementation would generate and download the file
    },
  };
  
  return (
    <AnalyticsDashboardContext.Provider value={{
      kpiMetrics: mockKPIMetrics,
      charts: mockCharts,
      filters,
      isLoading,
      actions,
    }}>
      {children}
    </AnalyticsDashboardContext.Provider>
  );
};
