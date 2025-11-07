/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Main Dashboard Page
 * 
 * Personalized home hub with KPIs, skill summary, forecasts, and recommendations.
 * Features time-based greeting, modular cards, and quick actions.
 * 
 * Design System:
 * - Dark-first design (#0F172A background)
 * - Neon accents (Indigo #6366F1, Purple #A855F7, Cyan #22D3EE)
 * - Modular card layout with shadcn/ui
 * - Futuristic minimal aesthetic
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
  Zap,
  Target,
  ArrowRight,
  Bell,
  Wallet,
  Users,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/features/dashboard/context/DashboardContext';
import { KPIGrid } from '@/features/dashboard/presentation/components/KPIWidget';
import { SkillSummaryCard } from '@/features/dashboard/presentation/components/SkillSummaryCard';
import { ForecastTeaserWidget } from '@/features/dashboard/presentation/components/ForecastTeaserWidget';
import { CourseRecommendationWidget } from '@/features/dashboard/presentation/components/CourseRecommendationWidget';
import { useRouter } from 'next/navigation';

/**
 * Time-based greeting generator
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Get motivational message based on user activity
 */
function getMotivationalMessage(streak: number): string {
  if (streak >= 7) return "You're on fire! Keep the momentum going 🔥";
  if (streak >= 3) return "Great consistency this week! 💪";
  return "Welcome back! Ready to level up your skills? 🚀";
}

/**
 * Dashboard Content Component (wrapped in provider)
 */
function DashboardContent() {
  const router = useRouter();
  const { state, actions } = useDashboard();
  const [greeting, setGreeting] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await actions.refreshDashboard();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Quick actions with routing
  const quickActions = [
    {
      id: 'skill-dna',
      label: 'Skill DNA',
      description: 'View your unique skill fingerprint',
      icon: Dna,
      color: '#6366F1',
      route: '/skills/dna',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      borderColor: 'border-indigo-500/30',
    },
    {
      id: 'growth-rings',
      label: 'Growth Rings',
      description: 'Track skill progression over time',
      icon: Target,
      color: '#22D3EE',
      route: '/skills/growth',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30',
    },
    {
      id: 'forecast',
      label: 'Skill Forecast',
      description: 'Predict future demand trends',
      icon: TrendingUp,
      color: '#A855F7',
      route: '/forecast',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 'learning',
      label: 'Learning Paths',
      description: 'Personalized course recommendations',
      icon: BookOpen,
      color: '#10B981',
      route: '/learning',
      gradient: 'from-emerald-500/20 to-green-500/20',
      borderColor: 'border-emerald-500/30',
    },
    {
      id: 'wallet',
      label: 'Skill Wallet',
      description: 'Manage verified credentials',
      icon: Wallet,
      color: '#F59E0B',
      route: '/wallet',
      gradient: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      description: 'Browse and trade skill tokens',
      icon: Award,
      color: '#EF4444',
      route: '/marketplace',
      gradient: 'from-rose-500/20 to-red-500/20',
      borderColor: 'border-rose-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Page Container */}
      <div className="max-w-[1440px] mx-auto px-6 py-8 space-y-8">
        
        {/* Hero Header with Greeting */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-8">
          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#6366F1]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#A855F7]/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              {/* Time-based Greeting */}
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-[#22D3EE]" />
                <span className="text-sm text-[#94A3B8]">{greeting}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-[#F8FAFC] mb-3">
                Welcome back, {state.user.name}
              </h1>
              
              <p className="text-lg text-[#CBD5E1] mb-4">
                {getMotivationalMessage(state.learningProgress.streak)}
              </p>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#F59E0B]" />
                  <span className="text-sm text-[#94A3B8]">
                    <span className="font-semibold text-[#F8FAFC]">{state.learningProgress.streak}</span> day streak
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#10B981]" />
                  <span className="text-sm text-[#94A3B8]">
                    <span className="font-semibold text-[#F8FAFC]">{state.skillSummary.verifiedSkills}</span> verified skills
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#6366F1]" />
                  <span className="text-sm text-[#94A3B8]">
                    <span className="font-semibold text-[#F8FAFC]">{state.skillGrowth.length}</span> skills growing
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              
              <button
                onClick={() => router.push('/notifications')}
                className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {state.recentActivities.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-xs font-bold flex items-center justify-center">
                    {state.recentActivities.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#F8FAFC]">Performance Metrics</h2>
            <select
              value={state.timeRange}
              onChange={(e) => actions.setTimeRange(e.target.value as any)}
              className="px-4 py-2 rounded-xl bg-[#1E293B] border border-white/10 text-[#F8FAFC] text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="last_year">Last Year</option>
            </select>
          </div>
          
          <KPIGrid metrics={state.kpiMetrics} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Skill Overview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Skill Summary */}
            <SkillSummaryCard 
              summary={state.skillSummary} 
              topGrowth={state.skillGrowth.slice(0, 5)}
              showDistribution={true}
            />

            {/* Forecast Teasers */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#EC4899] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#F8FAFC]">Trending Skills</h3>
                    <p className="text-sm text-[#94A3B8]">Predicted demand in next 6 months</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/forecast')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] text-sm transition-all duration-200"
                >
                  <span>View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <ForecastTeaserWidget 
                forecasts={state.forecastTeasers.slice(0, 4)}
                maxItems={4}
              />
            </div>

            {/* Course Recommendations */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#10B981] to-[#22D3EE] flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#F8FAFC]">Recommended for You</h3>
                    <p className="text-sm text-[#94A3B8]">Based on your skill gaps</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/learning')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] text-sm transition-all duration-200"
                >
                  <span>Explore All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <CourseRecommendationWidget 
                recommendations={state.courseRecommendations.slice(0, 3)}
                maxItems={3}
                onDismiss={actions.dismissRecommendation}
              />
            </div>

          </div>

          {/* Right Column - Quick Actions & Activity */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-lg font-semibold text-[#F8FAFC]">Quick Actions</h3>
              </div>

              <div className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => router.push(action.route)}
                      className={`w-full group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.gradient} border ${action.borderColor} p-4 hover:scale-[1.02] transition-all duration-200`}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${action.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: action.color }} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-semibold text-[#F8FAFC] mb-0.5">
                            {action.label}
                          </div>
                          <div className="text-xs text-[#94A3B8]">
                            {action.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#F8FAFC] group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#6366F1]" />
                  <h3 className="text-lg font-semibold text-[#F8FAFC]">Recent Activity</h3>
                </div>
                <button
                  onClick={() => router.push('/activity-timeline')}
                  className="text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {state.recentActivities.slice(0, 5).map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${activity.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#F8FAFC] mb-1">
                          {activity.title}
                        </div>
                        <div className="text-xs text-[#94A3B8]">
                          {activity.description}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-[#64748B]">
                          <Clock className="w-3 h-3" />
                          <span>{getRelativeTime(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {state.recentActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-[#334155] mx-auto mb-3" />
                    <p className="text-sm text-[#64748B]">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Progress */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-lg font-semibold text-[#F8FAFC]">Learning Progress</h3>
              </div>

              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#94A3B8]">Overall Completion</span>
                    <span className="text-sm font-semibold text-[#F8FAFC]">
                      {state.learningProgress.completionRate}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#22D3EE] transition-all duration-1000"
                      style={{ width: `${state.learningProgress.completionRate}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-[#F8FAFC] mb-1">
                      {state.learningProgress.completedCourses}
                    </div>
                    <div className="text-xs text-[#94A3B8]">Completed</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-[#F8FAFC] mb-1">
                      {state.learningProgress.inProgressCourses}
                    </div>
                    <div className="text-xs text-[#94A3B8]">In Progress</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-[#F8FAFC] mb-1">
                      {state.learningProgress.completedHours}h
                    </div>
                    <div className="text-xs text-[#94A3B8]">Hours Learned</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="text-2xl font-bold text-[#F8FAFC] mb-1">
                      {state.learningProgress.plannedCourses}
                    </div>
                    <div className="text-xs text-[#94A3B8]">Planned</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="rounded-2xl bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#22D3EE] p-1">
          <div className="rounded-xl bg-[#0F172A] p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#F8FAFC] mb-2">
                  Ready to Explore Your Skill Graph?
                </h3>
                <p className="text-[#CBD5E1] mb-4">
                  Visualize your skills as an interactive network and discover hidden connections
                </p>
              </div>
              <button
                onClick={() => router.push('/skills/graph')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                <span>Open Skill Graph</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * Helper: Get icon for activity type
 */
function getActivityIcon(type: string) {
  const icons: Record<string, any> = {
    skill_verified: Award,
    course_completed: BookOpen,
    badge_earned: Sparkles,
    forecast_updated: TrendingUp,
    token_minted: Wallet,
    profile_updated: Users,
  };
  return icons[type] || Activity;
}

/**
 * Helper: Format relative time
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

/**
 * Main Dashboard Page Component
 */
export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
