'use client';

/**
 * Enterprise Analytics Dashboard Page
 * 
 * Main dashboard for enterprise HR analytics
 * Displays KPIs, department charts, team leaderboard, and filters
 */

import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { EnterpriseAnalyticsProvider, useEnterpriseAnalytics } from '@/features/analytics/context/EnterpriseAnalyticsContext';
import {
  KPIOverviewCards,
  DepartmentCharts,
  TeamLeaderboard,
  FilterSidebar,
} from '@/features/analytics/presentation/components/enterprise';

/**
 * Dashboard content component
 */
const DashboardContent: React.FC = () => {
  const {
    kpis,
    departments,
    teamLeaderboard,
    filters,
    loading,
    error,
    setFilters,
    refreshData,
    exportData,
  } = useEnterpriseAnalytics();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Error Loading Analytics
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            {error}
          </p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                Enterprise Analytics Dashboard
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Monitor organizational skills, learning health, and team performance
              </p>
            </div>

            {/* Quick stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Total Employees
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {departments.reduce((sum, d) => sum + d.employeeCount, 0)}
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800" />
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Active Teams
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {teamLeaderboard.length}
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800" />
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Departments
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {departments.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onRefresh={refreshData}
              onExport={exportData}
            />
          </aside>

          {/* Main dashboard */}
          <main className="flex-1 space-y-8">
            {/* Loading state */}
            {loading && (
              <div className="fixed inset-0 bg-slate-900/10 dark:bg-slate-950/30 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg font-medium text-slate-900 dark:text-white">
                      Loading analytics...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* KPI Overview Cards */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Key Performance Indicators
                </h2>
              </div>
              <KPIOverviewCards kpis={kpis} />
            </section>

            {/* Department Charts */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Department Analytics
                </h2>
              </div>
              <DepartmentCharts departments={departments} />
            </section>

            {/* Team Leaderboard */}
            <section>
              <TeamLeaderboard teams={teamLeaderboard} limit={8} />
            </section>

            {/* Footer note */}
            <div className="text-center py-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Data updated every 24 hours • Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/**
 * Main page component with provider
 */
export default function EnterpriseAnalyticsPage() {
  return (
    <EnterpriseAnalyticsProvider>
      <DashboardContent />
    </EnterpriseAnalyticsProvider>
  );
}
