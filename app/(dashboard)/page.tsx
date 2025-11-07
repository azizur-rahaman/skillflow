/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Main Dashboard Page
 * 
 * Personalized home hub with KPIs, skill summary, forecasts, and recommendations.
 * Features time-based greeting, modular cards, and quick actions.
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
  BookOpen,
  Dna,
  Award,
  Calendar,
  Activity,
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/features/dashboard/context/DashboardContext';
import { KPIGrid } from '@/features/dashboard/presentation/components/KPIWidget';
import { SkillSummaryCard } from '@/features/dashboard/presentation/components/SkillSummaryCard';
import { ForecastTeaserWidget } from '@/features/dashboard/presentation/components/ForecastTeaserWidget';
import { CourseRecommendationWidget } from '@/features/dashboard/presentation/components/CourseRecommendationWidget';

function DashboardContent() {
  const { state, actions } = useDashboard();
  const [greeting, setGreeting] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  // Calculate greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
      setGreeting('Good afternoon');
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('evening');
      setGreeting('Good evening');
    } else {
      setTimeOfDay('night');
      setGreeting('Good night');
    }
  }, []);

  const getTimeEmoji = () => {
    switch (timeOfDay) {
      case 'morning':
        return '☀️';
      case 'afternoon':
        return '🌤️';
      case 'evening':
        return '🌆';
      case 'night':
        return '🌙';
    }
  };

  const handleRefresh = async () => {
    await actions.refreshDashboard();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#6366F1]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#A855F7]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Banner - Greeting */}
          <div className="rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#22D3EE] p-[1px] shadow-2xl shadow-[#6366F1]/25 animate-fade-in">
            <div className="rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTimeEmoji()}</span>
                    <h1 className="text-2xl font-bold text-[#F8FAFC]">
                      {greeting}, {state.user.name}!
                    </h1>
                  </div>
                  <p className="text-[#94A3B8]">
                    Here&apos;s your skill performance overview
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Last Updated */}
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-[#CBD5E1] text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      Updated{" "}
                      {new Date(state.user.lastLogin).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    disabled={state.isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#F8FAFC] transition-all duration-200 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        state.isLoading ? "animate-spin" : ""
                      }`}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Metrics Grid */}
          <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
            <KPIGrid metrics={state.kpiMetrics} columns={4} size="medium" />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Skill Summary */}
            <div
              className="lg:col-span-1 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <SkillSummaryCard
                summary={state.skillSummary}
                topGrowth={state.skillGrowth}
                showDistribution={true}
              />
            </div>

            {/* Middle Column - Forecast Teaser */}
            <div
              className="lg:col-span-1 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              <ForecastTeaserWidget
                forecasts={state.forecastTeasers}
                maxItems={3}
              />
            </div>

            {/* Right Column - Course Recommendations */}
            <div
              className="lg:col-span-1 animate-slide-up"
              style={{ animationDelay: "400ms" }}
            >
              <CourseRecommendationWidget
                recommendations={state.courseRecommendations}
                onDismiss={actions.dismissRecommendation}
                maxItems={2}
              />
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-[#22D3EE]" />
                <h3 className="text-lg font-semibold text-[#F8FAFC]">
                  Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {state.quickActions.map((action, index) => {
                  const iconMap: Record<string, any> = {
                    Dna,
                    BookOpen,
                    TrendingUp,
                    Coins: Award,
                  };
                  const Icon = iconMap[action.icon] || Sparkles;

                  return (
                    <button
                      key={action.id}
                      onClick={() => (window.location.href = action.route)}
                      className="group relative p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-300 text-left"
                      style={{ animationDelay: `${500 + index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${action.color}40, ${action.color}20)`,
                          }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: action.color }}
                          />
                        </div>

                        {action.badge && (
                          <div
                            className="px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: `${action.color}20`,
                              color: action.color,
                            }}
                          >
                            {action.badge}
                          </div>
                        )}
                      </div>

                      <div className="font-semibold text-[#F8FAFC] mb-1 group-hover:text-[#22D3EE] transition-colors duration-200">
                        {action.label}
                      </div>
                      <div className="text-xs text-[#64748B]">
                        {action.description}
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-[#22D3EE]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="animate-slide-up" style={{ animationDelay: "600ms" }}>
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-[#A855F7]" />
                <h3 className="text-lg font-semibold text-[#F8FAFC]">
                  Recent Activity
                </h3>
              </div>

              <div className="space-y-3">
                {state.recentActivities.slice(0, 4).map((activity, index) => {
                  const iconMap: Record<string, any> = {
                    CheckCircle2: Award,
                    GraduationCap: BookOpen,
                    Award,
                    TrendingUp,
                  };
                  const Icon = iconMap[activity.icon] || Activity;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
                      style={{ animationDelay: `${600 + index * 50}ms` }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${activity.color}20`,
                        }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: activity.color }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#F8FAFC] mb-0.5">
                          {activity.title}
                        </div>
                        <div className="text-xs text-[#94A3B8]">
                          {activity.description}
                        </div>
                      </div>

                      <div className="text-xs text-[#64748B] flex-shrink-0">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Learning Progress Banner */}
          <div className="animate-slide-up" style={{ animationDelay: "700ms" }}>
            <div className="rounded-2xl bg-gradient-to-r from-[#10B981]/20 via-[#6366F1]/20 to-[#A855F7]/20 border border-white/10 backdrop-blur-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
                    {state.learningProgress.completionRate}%
                  </div>
                  <div className="text-sm text-[#94A3B8]">Completion Rate</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
                    {state.learningProgress.completedCourses}/
                    {state.learningProgress.totalCourses}
                  </div>
                  <div className="text-sm text-[#94A3B8]">
                    Courses Completed
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
                    {state.learningProgress.completedHours}h
                  </div>
                  <div className="text-sm text-[#94A3B8]">Learning Hours</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Flame className="w-6 h-6 text-[#F59E0B]" />
                    <span className="text-3xl font-bold text-[#F8FAFC]">
                      {state.learningProgress.streak}
                    </span>
                  </div>
                  <div className="text-sm text-[#94A3B8]">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
