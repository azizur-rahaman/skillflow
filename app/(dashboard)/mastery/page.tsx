'use client';

import React from 'react';
import { Brain, User, TrendingUp, Award, AlertCircle, Loader2 } from 'lucide-react';
import { SkillMasteryProvider, useSkillMastery } from '@/features/skill-mastery/context/SkillMasteryContext';
import {
  MasteryGauge,
  ConfidenceGauge,
  DeltaIndicator,
  ComparisonChart,
  ActionSuggestions,
  SkillBreakdown,
} from '@/features/skill-mastery/presentation/components';
import { formatPercentage, getDeltaColor, DeltaType } from '@/features/skill-mastery/types/skill-mastery.types';

/**
 * Mastery Dashboard Content (wrapped in provider)
 */
const MasteryDashboardContent: React.FC = () => {
  const {
    skills,
    summary,
    selectedSkill,
    suggestions,
    loading,
    error,
    selectSkill,
    dismissSuggestion,
  } = useSkillMastery();

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading mastery data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Failed to load mastery data</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const deltaColor = getDeltaColor(
    summary.overallDelta > 20
      ? DeltaType.OVERCONFIDENT
      : summary.overallDelta < -20
      ? DeltaType.UNDERCONFIDENT
      : DeltaType.ALIGNED
  );

  return (
    <div className="space-y-8">
      {/* Hero Section: Dual Gauges */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Skill Mastery Dashboard</h1>
          <p className="text-slate-400">
            AI-evaluated mastery vs self-assessed confidence
          </p>
        </div>

        {/* Dual circular gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-8">
          {/* AI Mastery Gauge */}
          <div className="flex flex-col items-center">
            <MasteryGauge score={summary.overallAIMastery} size={280} strokeWidth={20} />
            <div className="mt-4 text-center">
              <div className="text-sm text-slate-400 mb-1">Based on</div>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>Assessments</span>
                <span>•</span>
                <span>Projects</span>
                <span>•</span>
                <span>Code Reviews</span>
              </div>
            </div>
          </div>

          {/* Self-Confidence Gauge */}
          <div className="flex flex-col items-center">
            <ConfidenceGauge score={summary.overallSelfConfidence} size={280} strokeWidth={20} />
            <div className="mt-4 text-center">
              <div className="text-sm text-slate-400 mb-1">Self-assessed across</div>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>{summary.totalSkills} skills</span>
                <span>•</span>
                <span>Updated regularly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {summary.masteredSkills}
            </div>
            <div className="text-xs text-slate-400">Mastered Skills</div>
            <div className="text-xs text-slate-500 mt-1">≥80% mastery</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="w-6 h-6 mx-auto mb-2 text-2xl">✓</div>
            <div className="text-2xl font-bold text-white mb-1">
              {summary.alignedSkills}
            </div>
            <div className="text-xs text-slate-400">Well-Calibrated</div>
            <div className="text-xs text-slate-500 mt-1">Delta ≤20%</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="w-6 h-6 mx-auto mb-2 text-2xl">⚠️</div>
            <div className="text-2xl font-bold text-white mb-1">
              {summary.overconfidentSkills}
            </div>
            <div className="text-xs text-slate-400">Overconfident</div>
            <div className="text-xs text-slate-500 mt-1">Need practice</div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="w-6 h-6 mx-auto mb-2 text-2xl">💡</div>
            <div className="text-2xl font-bold text-white mb-1">
              {summary.underconfidentSkills}
            </div>
            <div className="text-xs text-slate-400">Underconfident</div>
            <div className="text-xs text-slate-500 mt-1">Hidden strengths</div>
          </div>
        </div>
      </div>

      {/* Delta Indicator - Overall */}
      <DeltaIndicator
        aiMastery={summary.overallAIMastery}
        selfConfidence={summary.overallSelfConfidence}
        delta={summary.overallDelta}
        deltaType={
          summary.overallDelta > 20
            ? DeltaType.OVERCONFIDENT
            : summary.overallDelta < -20
            ? DeltaType.UNDERCONFIDENT
            : DeltaType.ALIGNED
        }
      />

      {/* Comparison Chart - Selected Skill or Top Skill */}
      {(selectedSkill || summary.topSkills[0]) && (
        <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-8">
          <ComparisonChart
            history={(selectedSkill || summary.topSkills[0]).history}
            skillName={(selectedSkill || summary.topSkills[0]).name}
          />
        </div>
      )}

      {/* Action Suggestions */}
      <ActionSuggestions
        suggestions={suggestions}
        onDismiss={dismissSuggestion}
        maxSuggestions={6}
      />

      {/* Skills Breakdown */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">All Skills</h2>
          <p className="text-slate-400">
            Click any skill to view detailed metrics and history
          </p>
        </div>
        <SkillBreakdown
          skills={skills}
          onSelectSkill={selectSkill}
          selectedSkillId={selectedSkill?.id || null}
        />
      </div>

      {/* Top Skills Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Top Skills</h3>
              <p className="text-sm text-slate-400">Your strongest areas</p>
            </div>
          </div>
          <div className="space-y-3">
            {summary.topSkills.map((skill, index) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl font-bold text-indigo-400">#{index + 1}</div>
                  <div>
                    <div className="font-medium text-white">{skill.name}</div>
                    <div className="text-xs text-slate-400">{skill.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-400">
                    {formatPercentage(skill.aiMastery)}
                  </div>
                  <div className="text-xs text-slate-500">AI Mastery</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Needing Work */}
        <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Focus Areas</h3>
              <p className="text-sm text-slate-400">Skills to improve</p>
            </div>
          </div>
          <div className="space-y-3">
            {summary.skillsNeedingWork.map((skill, index) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl font-bold text-orange-400">
                    {summary.totalSkills - index}
                  </div>
                  <div>
                    <div className="font-medium text-white">{skill.name}</div>
                    <div className="text-xs text-slate-400">{skill.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-400">
                    {formatPercentage(skill.aiMastery)}
                  </div>
                  <div className="text-xs text-slate-500">AI Mastery</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Mastery Dashboard Page
 */
const MasteryDashboard: React.FC = () => {
  return (
    <SkillMasteryProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <MasteryDashboardContent />
        </div>
      </div>
    </SkillMasteryProvider>
  );
};

export default MasteryDashboard;
