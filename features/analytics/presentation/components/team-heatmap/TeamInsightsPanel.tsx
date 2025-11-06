/**
 * Team Insights Panel Component
 * 
 * Displays skill gaps analysis, top performers, team averages,
 * and actionable insights for skill development.
 */

'use client';

import { useTeamHeatmap } from '../../../context/TeamSkillsHeatmapContext';
import { SkillGap, TeamStrength } from '../../../types/team-skills-heatmap.types';
import {
  AlertTriangle,
  TrendingUp,
  Users,
  Award,
  Target,
  ChevronRight,
  Crown,
  Zap,
} from 'lucide-react';

interface TeamInsightsPanelProps {
  maxGaps?: number;
  maxStrengths?: number;
}

export const TeamInsightsPanel = ({
  maxGaps = 5,
  maxStrengths = 5,
}: TeamInsightsPanelProps) => {
  const { state } = useTeamHeatmap();
  const { matrix } = state;

  if (!matrix) {
    return null;
  }

  const { statistics } = matrix;

  // Sort gaps by priority
  const criticalGaps = statistics.gaps
    .filter((gap) => gap.priority === 'critical')
    .slice(0, maxGaps);
  const highGaps = statistics.gaps
    .filter((gap) => gap.priority === 'high')
    .slice(0, maxGaps - criticalGaps.length);
  const topGaps = [...criticalGaps, ...highGaps];

  // Get top strengths
  const topStrengths = statistics.strengths
    .filter((s) => s.isCoreCopetency)
    .slice(0, maxStrengths);

  return (
    <div className="space-y-6">
      {/* Team Overview Stats */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Team Overview
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Team Size</p>
            <p className="text-2xl font-bold text-foreground">
              {statistics.totalMembers}
            </p>
          </div>

          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Total Skills</p>
            <p className="text-2xl font-bold text-foreground">
              {statistics.totalSkills}
            </p>
          </div>

          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Avg Proficiency</p>
            <p className="text-2xl font-bold text-primary">
              {statistics.averageTeamProficiency}%
            </p>
          </div>

          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Skill Gaps</p>
            <p className="text-2xl font-bold text-red-400">
              {statistics.skillGapsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Critical Skill Gaps
          </h3>
          <div className="px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20">
            <span className="text-xs font-medium text-red-400">
              {topGaps.length} identified
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {topGaps.length > 0 ? (
            topGaps.map((gap) => (
              <GapCard key={gap.skillId} gap={gap} />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm text-muted-foreground">
                No critical skill gaps identified! 🎉
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Team Strengths */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            Core Competencies
          </h3>
          <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-medium text-emerald-400">
              {topStrengths.length} strengths
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {topStrengths.length > 0 ? (
            topStrengths.map((strength) => (
              <StrengthCard key={strength.skillId} strength={strength} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No core competencies identified yet
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-primary/10 to-highlight/10 rounded-xl border border-primary/20 p-5">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Recommended Actions
        </h3>

        <div className="space-y-2">
          <ActionButton
            label="Generate Training Plan"
            description="Create personalized learning paths"
          />
          <ActionButton
            label="Schedule Skill Assessments"
            description="Verify and update proficiency levels"
          />
          <ActionButton
            label="Assign Knowledge Sharing"
            description="Pair experts with learners"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Skill Gap Card
 */
interface GapCardProps {
  gap: SkillGap;
}

const GapCard = ({ gap }: GapCardProps) => {
  const priorityColors = {
    critical: 'border-red-500/30 bg-red-500/5',
    high: 'border-orange-500/30 bg-orange-500/5',
    medium: 'border-amber-500/30 bg-amber-500/5',
    low: 'border-slate-500/30 bg-slate-500/5',
  };

  const priorityTextColors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-amber-400',
    low: 'text-slate-400',
  };

  return (
    <div
      className={`rounded-lg border p-3 transition-all hover:shadow-md ${priorityColors[gap.priority]}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-1">
            {gap.skillName}
          </h4>
          <p className="text-xs text-muted-foreground">
            {gap.affectedMembers.length} of {gap.affectedMembers.length + 1} team members
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`text-xs font-bold ${priorityTextColors[gap.priority]} uppercase`}>
            {gap.priority}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Current</span>
            <span className="text-xs font-medium text-foreground">
              {gap.currentAverage}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-red-400 rounded-full"
              style={{ width: `${gap.currentAverage}%` }}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Target</span>
            <span className="text-xs font-medium text-foreground">
              {gap.requiredLevel}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${gap.requiredLevel}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Gap: <span className="font-medium text-red-400">{gap.gapPercentage}%</span>
      </div>
    </div>
  );
};

/**
 * Team Strength Card
 */
interface StrengthCardProps {
  strength: TeamStrength;
}

const StrengthCard = ({ strength }: StrengthCardProps) => {
  return (
    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
            {strength.skillName}
            {strength.isCoreCopetency && <Crown className="w-3.5 h-3.5 text-amber-400" />}
          </h4>
          <p className="text-xs text-muted-foreground">
            {strength.teamCoverage}% team coverage
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-emerald-400">
            {strength.averageProficiency}%
          </p>
          <p className="text-xs text-muted-foreground">avg</p>
        </div>
      </div>

      {/* Top performers */}
      <div className="mt-3 pt-3 border-t border-emerald-500/20">
        <p className="text-xs text-muted-foreground mb-2">Top Performers:</p>
        <div className="flex flex-wrap gap-2">
          {strength.topPerformers.slice(0, 3).map((performer, index) => (
            <div
              key={performer.memberId}
              className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20"
            >
              <span className="text-xs font-medium text-emerald-300">
                {index === 0 && '🥇 '}
                {index === 1 && '🥈 '}
                {index === 2 && '🥉 '}
                {performer.memberName} ({performer.proficiency}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Action Button
 */
interface ActionButtonProps {
  label: string;
  description: string;
}

const ActionButton = ({ label, description }: ActionButtonProps) => {
  return (
    <button className="w-full text-left p-3 rounded-lg border border-primary/20 bg-background/50 hover:bg-background transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground mb-0.5">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};
