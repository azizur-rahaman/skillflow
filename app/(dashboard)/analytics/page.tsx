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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Analytics
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {error}
          </p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:brightness-110 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/50 border-b border-border backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-highlight flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                Enterprise Analytics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor organizational skills, learning health, and team performance
              </p>
            </div>

            {/* Quick stats */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Total Employees
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {departments.reduce((sum, d) => sum + d.employeeCount, 0)}
                </div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Active Teams
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {teamLeaderboard.length}
                </div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-right">
                <div className="text-xs text-muted-foreground">
                  Departments
                </div>
                <div className="text-2xl font-bold text-foreground">
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
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-lg font-medium text-foreground">
                      Loading analytics...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* KPI Overview Cards */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  Key Performance Indicators
                </h2>
              </div>
              <KPIOverviewCards kpis={kpis} />
            </section>

            {/* Department Charts */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-highlight" />
                <h2 className="text-xl font-semibold text-foreground">
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
              <p className="text-sm text-muted-foreground">
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
