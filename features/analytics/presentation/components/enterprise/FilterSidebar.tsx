'use client';

/**
 * Filter Sidebar Component
 * 
 * Provides filters for analytics dashboard
 * Includes time period, department, and team filters
 */

import React from 'react';
import { Calendar, Filter, RefreshCcw, Download, Building2, Users } from 'lucide-react';
import {
  AnalyticsFilters,
  TimePeriod,
  Department,
  ExportFormat,
  getDepartmentName,
  getTimePeriodLabel,
} from '../../../types/enterprise-analytics.types';

interface FilterSidebarProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: Partial<AnalyticsFilters>) => void;
  onRefresh: () => void;
  onExport: (format: ExportFormat) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  onExport,
}) => {
  const [exportMenuOpen, setExportMenuOpen] = React.useState(false);

  /**
   * Handle department toggle
   */
  const toggleDepartment = (dept: Department) => {
    const currentDepts = filters.departments;
    
    // If All is selected or clicking All, clear others
    if (dept === Department.All || currentDepts.includes(Department.All)) {
      onFiltersChange({ departments: [dept] });
      return;
    }

    // Toggle individual department
    const newDepts = currentDepts.includes(dept)
      ? currentDepts.filter(d => d !== dept)
      : [...currentDepts, dept];

    // If empty, default to All
    onFiltersChange({ 
      departments: newDepts.length === 0 ? [Department.All] : newDepts 
    });
  };

  /**
   * Available departments for filtering
   */
  const availableDepartments = [
    Department.All,
    Department.Engineering,
    Department.Design,
    Department.Product,
    Department.Marketing,
    Department.Sales,
    Department.HR,
  ];

  /**
   * Available time periods
   */
  const availableTimePeriods = [
    TimePeriod.Last7Days,
    TimePeriod.Last30Days,
    TimePeriod.Last90Days,
    TimePeriod.LastYear,
  ];

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-500" />
          Filters
        </h3>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
          title="Refresh data"
        >
          <RefreshCcw className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* Time Period Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          <Calendar className="w-4 h-4 text-slate-500" />
          Time Period
        </label>
        <div className="space-y-2">
          {availableTimePeriods.map((period) => (
            <button
              key={period}
              onClick={() => onFiltersChange({ timePeriod: period })}
              className={`w-full px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-all ${
                filters.timePeriod === period
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {getTimePeriodLabel(period)}
            </button>
          ))}
        </div>
      </div>

      {/* Department Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          <Building2 className="w-4 h-4 text-slate-500" />
          Departments
        </label>
        <div className="space-y-2">
          {availableDepartments.map((dept) => {
            const isSelected = filters.departments.includes(dept);
            const isAllSelected = filters.departments.includes(Department.All);
            const isDisabled = isAllSelected && dept !== Department.All;

            return (
              <label
                key={dept}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all ${
                  isSelected && !isDisabled
                    ? 'bg-cyan-500/10 border border-cyan-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => !isDisabled && toggleDepartment(dept)}
                  disabled={isDisabled}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {getDepartmentName(dept)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Export Section */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800/50">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          <Download className="w-4 h-4 text-slate-500" />
          Export Data
        </label>
        
        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-cyan-600 transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>

          {/* Export dropdown */}
          {exportMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-10">
              <button
                onClick={() => {
                  onExport(ExportFormat.PDF);
                  setExportMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                📄 Export as PDF
              </button>
              <button
                onClick={() => {
                  onExport(ExportFormat.Excel);
                  setExportMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                📊 Export as Excel
              </button>
              <button
                onClick={() => {
                  onExport(ExportFormat.CSV);
                  setExportMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                📋 Export as CSV
              </button>
              <button
                onClick={() => {
                  onExport(ExportFormat.JSON);
                  setExportMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                🔗 Export as JSON
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800/50">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          Active Filters
        </div>
        <div className="space-y-1">
          <div className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Period:</span> {getTimePeriodLabel(filters.timePeriod)}
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Departments:</span>{' '}
            {filters.departments.length === 1 && filters.departments[0] === Department.All
              ? 'All'
              : filters.departments.map(getDepartmentName).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};
