'use client';

/**
 * Department Charts Component
 * 
 * Visualizes department data with bar and donut charts
 * Shows skill distribution, engagement rates, and skill gaps
 */

import React, { useState } from 'react';
import { BarChart3, PieChart, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  DepartmentData,
  formatPercentage,
  formatNumber,
} from '../../../types/enterprise-analytics.types';

interface DepartmentChartsProps {
  departments: DepartmentData[];
}

type ChartView = 'engagement' | 'skills' | 'gaps';

export const DepartmentCharts: React.FC<DepartmentChartsProps> = ({ departments }) => {
  const [activeView, setActiveView] = useState<ChartView>('engagement');

  /**
   * Calculate total employees
   */
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);

  /**
   * Get data for donut chart based on active view
   */
  const getDonutData = () => {
    if (activeView === 'engagement') {
      return departments.map(dept => ({
        label: dept.departmentName,
        value: dept.engagementRate,
        count: dept.employeeCount,
        color: dept.color,
        percentage: (dept.employeeCount / totalEmployees) * 100,
      }));
    }
    if (activeView === 'skills') {
      return departments.map(dept => ({
        label: dept.departmentName,
        value: dept.averageSkillCount,
        count: dept.employeeCount,
        color: dept.color,
        percentage: (dept.employeeCount / totalEmployees) * 100,
      }));
    }
    return departments.map(dept => ({
      label: dept.departmentName,
      value: dept.skillGapPercentage,
      count: dept.employeeCount,
      color: dept.color,
      percentage: (dept.employeeCount / totalEmployees) * 100,
    }));
  };

  /**
   * Calculate donut chart SVG path
   */
  const calculateDonutPath = (percentage: number, cumulativePercentage: number): string => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = (cumulativePercentage / 100) * circumference;
    const length = (percentage / 100) * circumference;
    
    return `M 100,100 m 0,-${radius} a ${radius},${radius} 0 1,1 0,${2 * radius} a ${radius},${radius} 0 1,1 0,-${2 * radius}`;
  };

  /**
   * Get view config
   */
  const getViewConfig = (view: ChartView) => {
    const configs = {
      engagement: {
        title: 'Engagement Rate by Department',
        icon: <TrendingUp className="w-5 h-5" />,
        unit: '%',
        color: '#6366F1',
      },
      skills: {
        title: 'Average Skills per Department',
        icon: <BarChart3 className="w-5 h-5" />,
        unit: 'skills',
        color: '#22D3EE',
      },
      gaps: {
        title: 'Skill Gaps by Department',
        icon: <AlertTriangle className="w-5 h-5" />,
        unit: '%',
        color: '#F59E0B',
      },
    };
    return configs[view];
  };

  const donutData = getDonutData();
  const viewConfig = getViewConfig(activeView);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart Card */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Department Overview
          </h3>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {formatNumber(totalEmployees)} employees
            </span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="space-y-4">
          {departments.map((dept) => {
            const maxValue = Math.max(...departments.map(d => 
              activeView === 'engagement' ? d.engagementRate : 
              activeView === 'skills' ? d.averageSkillCount : d.skillGapPercentage
            ));
            
            const value = activeView === 'engagement' ? dept.engagementRate : 
                         activeView === 'skills' ? dept.averageSkillCount : 
                         dept.skillGapPercentage;
            
            const barWidth = (value / maxValue) * 100;

            return (
              <div key={dept.department} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {dept.departmentName}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({dept.employeeCount})
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {value.toFixed(1)}{viewConfig.unit === '%' ? '%' : ` ${viewConfig.unit}`}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="relative h-3 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 group-hover:opacity-90"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, ${dept.color}, ${dept.color}CC)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donut Chart Card */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-500" />
            {viewConfig.title}
          </h3>
        </div>

        {/* View selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveView('engagement')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView === 'engagement'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Engagement
          </button>
          <button
            onClick={() => setActiveView('skills')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView === 'skills'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveView('gaps')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeView === 'gaps'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Gaps
          </button>
        </div>

        {/* Donut chart visualization (simplified) */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            {/* Donut chart with segments */}
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {donutData.reduce((acc, item, index) => {
                const cumulativePercentage = donutData.slice(0, index).reduce((sum, d) => sum + d.percentage, 0);
                const radius = 80;
                const circumference = 2 * Math.PI * radius;
                const offset = (cumulativePercentage / 100) * circumference;
                const length = (item.percentage / 100) * circumference;

                acc.push(
                  <circle
                    key={item.label}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="32"
                    strokeDasharray={`${length} ${circumference}`}
                    strokeDashoffset={-offset}
                    className="transition-all duration-500 hover:opacity-80"
                  />
                );
                return acc;
              }, [] as React.ReactElement[])}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatNumber(totalEmployees)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Total Staff
              </span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {donutData.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                  {item.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {item.count} ({item.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
