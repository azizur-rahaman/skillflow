/**
 * Platform Analytics Dashboard Page
 * 
 * Comprehensive analytics with KPIs, multi-chart visualizations, and filters
 */

'use client';

import { AnalyticsDashboardProvider, useAnalyticsDashboard } from '@/features/analytics-dashboard/context/AnalyticsDashboardContext';
import { KPITiles } from '@/features/analytics-dashboard/presentation/components/KPITiles';
import { AnalyticsChart } from '@/features/analytics-dashboard/presentation/components/AnalyticsCharts';
import { FilterPanel } from '@/features/analytics-dashboard/presentation/components/FilterPanel';
import { BarChart3, TrendingUp, Award, Clock } from 'lucide-react';

function AnalyticsDashboardContent() {
  const { kpiMetrics, charts, filters, isLoading, actions } = useAnalyticsDashboard();
  
  // Split KPIs into primary and secondary
  const primaryKPIs = kpiMetrics.slice(0, 4);
  const secondaryKPIs = kpiMetrics.slice(4);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
            <p className="text-slate-400">
              Comprehensive insights on engagement, retention, and outcomes
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">
                  {filters.timeRange.label}
                </span>
              </div>
            </div>
            
            <div className="px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={actions.updateFilters}
          onExport={actions.exportData}
          onRefresh={actions.refreshData}
          isLoading={isLoading}
        />
        
        {/* Primary KPIs */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Key Performance Indicators</h2>
          </div>
          <KPITiles metrics={primaryKPIs} />
        </div>
        
        {/* Charts Grid */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Detailed Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.map((chart) => (
              <AnalyticsChart key={chart.id} config={chart} />
            ))}
          </div>
        </div>
        
        {/* Secondary KPIs */}
        {secondaryKPIs.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Award className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Additional Metrics</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KPITiles metrics={secondaryKPIs} />
            </div>
          </div>
        )}
        
        {/* Insights Section */}
        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2" />
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-green-400">User retention increased by 12.3%</span> - 
                    Your gamification features are driving higher engagement
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2" />
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-amber-400">Token velocity up 24.7%</span> - 
                    Users are actively earning and spending tokens in the marketplace
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2" />
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-cyan-400">Design category leads completion</span> - 
                    Consider expanding design-related content offerings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Stats */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Total Users', value: '12.4K', change: '+8.2%', color: 'indigo' },
            { label: 'Avg. Session Time', value: '24m', change: '+12%', color: 'purple' },
            { label: 'Conversion Rate', value: '18.5%', change: '+5.1%', color: 'cyan' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-4"
            >
              <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className={`text-sm font-medium ${
                  stat.color === 'indigo' ? 'text-indigo-400' :
                  stat.color === 'purple' ? 'text-purple-400' :
                  'text-cyan-400'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PlatformAnalyticsPage() {
  return (
    <AnalyticsDashboardProvider>
      <AnalyticsDashboardContent />
    </AnalyticsDashboardProvider>
  );
}
