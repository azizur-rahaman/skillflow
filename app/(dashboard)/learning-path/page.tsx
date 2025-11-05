'use client';

/**
 * Learning Path Dashboard Page
 * Personalized journey visualization with milestones, modules, and progress tracking
 */

import React, { useState } from 'react';
import {
  Target,
  Flame,
  Clock,
  Award,
  TrendingUp,
  BookOpen,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import type { Milestone } from '@/features/learning-path/types/learning-path.types';
import { LearningPathProvider, useLearningPath } from '@/features/learning-path/context/LearningPathContext';
import { LearningPathFlow } from '@/features/learning-path/presentation/components/LearningPathFlow';
import { MilestoneDetail } from '@/features/learning-path/presentation/components/MilestoneDetail';

/**
 * Page Content (needs context)
 */
function LearningPathContent() {
  const { state, actions } = useLearningPath();
  const { activePath, selectedMilestone, stats, nextActions } = state;
  const { selectMilestone, startModule, completeModule } = actions;

  const [showDetail, setShowDetail] = useState(false);

  const handleMilestoneSelect = (milestone: Milestone) => {
    selectMilestone(milestone);
    setShowDetail(true);
  };

  const handleBack = () => {
    setShowDetail(false);
    selectMilestone(null);
  };

  const handleStartModule = (moduleId: string) => {
    if (activePath && selectedMilestone) {
      startModule(activePath.id, selectedMilestone.id, moduleId);
    }
  };

  const handleCompleteModule = (moduleId: string) => {
    if (activePath && selectedMilestone) {
      completeModule(activePath.id, selectedMilestone.id, moduleId);
    }
  };

  const nextAction = nextActions.length > 0 ? nextActions[0] : null;

  if (!activePath) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#6366F1] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">No Learning Path Selected</h2>
          <p className="text-[#94A3B8]">Choose a path to start your journey</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            {showDetail && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] mb-4 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Journey</span>
              </button>
            )}
            <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">{activePath.title}</h1>
            <p className="text-[#94A3B8] text-lg">{activePath.description}</p>
          </div>

          {/* Overall Progress */}
          <div className="text-right">
            <div className="text-sm text-[#94A3B8] mb-1">Overall Progress</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#22D3EE] bg-clip-text text-transparent">
              {Math.round(activePath.overallProgress)}%
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {!showDetail && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Current Streak */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-5">
              <div className="flex items-center justify-between mb-3">
                <Flame className="w-8 h-8 text-[#F59E0B]" />
                <span className="text-xs text-[#94A3B8]">Days</span>
              </div>
              <div className="text-3xl font-bold text-[#F8FAFC] mb-1">{stats.currentStreak}</div>
              <div className="text-sm text-[#94A3B8]">Current Streak</div>
            </div>

            {/* Total Hours */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-5">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-8 h-8 text-[#6366F1]" />
                <span className="text-xs text-[#94A3B8]">Hours</span>
              </div>
              <div className="text-3xl font-bold text-[#F8FAFC] mb-1">{stats.totalLearningHours}</div>
              <div className="text-sm text-[#94A3B8]">Time Invested</div>
            </div>

            {/* Completed Milestones */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-5">
              <div className="flex items-center justify-between mb-3">
                <Target className="w-8 h-8 text-[#10B981]" />
                <span className="text-xs text-[#94A3B8]">Milestones</span>
              </div>
              <div className="text-3xl font-bold text-[#F8FAFC] mb-1">
                {stats.completedMilestones}/{stats.totalMilestones}
              </div>
              <div className="text-sm text-[#94A3B8]">Milestones Completed</div>
            </div>

            {/* Certificates */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-5">
              <div className="flex items-center justify-between mb-3">
                <Award className="w-8 h-8 text-[#A855F7]" />
                <span className="text-xs text-[#94A3B8]">Earned</span>
              </div>
              <div className="text-3xl font-bold text-[#F8FAFC] mb-1">{stats.certificatesEarned}</div>
              <div className="text-sm text-[#94A3B8]">Certificates</div>
            </div>
          </div>
        )}

        {/* Next Action CTA */}
        {!showDetail && nextAction && (
          <div className="bg-gradient-to-br from-[#6366F1] via-[#A855F7] to-[#22D3EE] rounded-2xl p-[2px]">
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#10B981]" />
                    <span className="text-sm font-medium text-[#10B981]">Next Up</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-1">{nextAction.title}</h3>
                  <p className="text-[#94A3B8] mb-1">{nextAction.description}</p>
                  <div className="flex items-center gap-4 text-sm text-[#64748B]">
                    <span>📍 Milestone {nextAction.milestoneId}</span>
                    <span>⏱️ {nextAction.estimatedTime} min</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const milestone = activePath.milestones.find(m => m.id === nextAction.milestoneId);
                    if (milestone) {
                      handleMilestoneSelect(milestone);
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Learning Path Flow or Milestone Detail */}
        {showDetail && selectedMilestone ? (
          <MilestoneDetail
            milestone={selectedMilestone}
            onStartModule={handleStartModule}
            onCompleteModule={handleCompleteModule}
          />
        ) : (
          <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Your Learning Journey</h2>
              <p className="text-[#94A3B8]">
                Follow the path from foundational skills to advanced mastery
              </p>
            </div>

            <LearningPathFlow
              milestones={activePath.milestones}
              selectedMilestone={selectedMilestone}
              onMilestoneSelect={handleMilestoneSelect}
            />
          </div>
        )}

        {/* Milestones Grid - Show when not in detail view */}
        {!showDetail && (
          <div>
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">All Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePath.milestones.map((milestone: Milestone) => (
                <button
                  key={milestone.id}
                  onClick={() => handleMilestoneSelect(milestone)}
                  className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 hover:border-[#6366F1] transition-all duration-200 text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#F8FAFC] mb-1 group-hover:text-[#6366F1] transition-colors">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-[#94A3B8] line-clamp-2">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#94A3B8]">Progress</span>
                      <span className="font-semibold text-[#F8FAFC]">{milestone.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] transition-all duration-500"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span>{milestone.modules.length} modules</span>
                    <span>•</span>
                    <span>{milestone.skills.length} skills</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Page with Provider
 */
export default function LearningPathPage() {
  return (
    <LearningPathProvider>
      <LearningPathContent />
    </LearningPathProvider>
  );
}
