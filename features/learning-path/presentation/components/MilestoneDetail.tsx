'use client';

/**
 * MilestoneDetail Component
 * Detailed view of selected milestone with modules, progress, and resources
 */

import React from 'react';
import {
  PlayCircle,
  FileText,
  Code,
  Briefcase,
  CheckSquare,
  Video,
  Clock,
  CheckCircle2,
  Circle,
  Award,
  ExternalLink,
  Book,
} from 'lucide-react';
import type { Milestone, LearningModule } from '../../types/learning-path.types';
import { CompletionStatus, ModuleType, getStatusColor, getDifficultyColor, formatDuration } from '../../types/learning-path.types';

interface MilestoneDetailProps {
  milestone: Milestone;
  onStartModule?: (moduleId: string) => void;
  onCompleteModule?: (moduleId: string) => void;
}

export function MilestoneDetail({ milestone, onStartModule, onCompleteModule }: MilestoneDetailProps) {
  const statusColor = getStatusColor(milestone.status);
  const difficultyColor = getDifficultyColor(milestone.difficulty);

  const getModuleIcon = (type: ModuleType) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case ModuleType.VIDEO:
        return <PlayCircle className={iconClass} />;
      case ModuleType.ARTICLE:
        return <FileText className={iconClass} />;
      case ModuleType.EXERCISE:
        return <Code className={iconClass} />;
      case ModuleType.PROJECT:
        return <Briefcase className={iconClass} />;
      case ModuleType.QUIZ:
        return <CheckSquare className={iconClass} />;
      case ModuleType.LIVE_SESSION:
        return <Video className={iconClass} />;
      default:
        return <Book className={iconClass} />;
    }
  };

  const getResourceIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'video':
        return <PlayCircle className={iconClass} />;
      case 'article':
        return <FileText className={iconClass} />;
      case 'documentation':
        return <Book className={iconClass} />;
      case 'exercise':
        return <Code className={iconClass} />;
      default:
        return <ExternalLink className={iconClass} />;
    }
  };

  const totalDuration = milestone.modules.reduce((sum, m) => sum + m.duration, 0);
  const completedModules = milestone.modules.filter(m => m.status === CompletionStatus.COMPLETED).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">{milestone.title}</h2>
            <p className="text-[#94A3B8] mb-4">{milestone.description}</p>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Status Badge */}
              <span
                className="px-3 py-1 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${statusColor}20`,
                  color: statusColor,
                }}
              >
                {milestone.status.replace('_', ' ').toLowerCase()}
              </span>

              {/* Difficulty Badge */}
              <span
                className="px-3 py-1 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: `${difficultyColor}20`,
                  color: difficultyColor,
                }}
              >
                {milestone.difficulty.toLowerCase()}
              </span>

              {/* Duration */}
              <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(totalDuration)}</span>
              </div>

              {/* Certificate */}
              {milestone.certificate?.issued && (
                <div className="flex items-center gap-2 text-sm text-[#F59E0B]">
                  <Award className="w-4 h-4" />
                  <span>Certificate Earned</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Circle */}
          <div className="relative w-24 h-24">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#334155"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke={statusColor}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - milestone.progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-[#F8FAFC]">{milestone.progress}%</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        {milestone.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-[#94A3B8] mb-2">Skills You'll Learn</h3>
            <div className="flex flex-wrap gap-2">
              {milestone.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg bg-[#6366F1]/20 text-[#6366F1] text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modules List */}
      {milestone.modules.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#F8FAFC]">
              Modules ({completedModules}/{milestone.modules.length})
            </h3>
          </div>

          <div className="space-y-3">
            {milestone.modules.map((module, index) => (
              <ModuleCard
                key={module.id}
                module={module}
                index={index}
                onStart={() => onStartModule?.(module.id)}
                onComplete={() => onCompleteModule?.(module.id)}
                getIcon={getModuleIcon}
                getResourceIcon={getResourceIcon}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual Module Card
 */
interface ModuleCardProps {
  module: LearningModule;
  index: number;
  onStart: () => void;
  onComplete: () => void;
  getIcon: (type: ModuleType) => React.ReactElement;
  getResourceIcon: (type: string) => React.ReactElement;
}

function ModuleCard({ module, index, onStart, onComplete, getIcon, getResourceIcon }: ModuleCardProps) {
  const statusColor = getStatusColor(module.status);
  const isCompleted = module.status === CompletionStatus.COMPLETED;
  const isInProgress = module.status === CompletionStatus.IN_PROGRESS;

  return (
    <div
      className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 hover:border-[#6366F1]/50 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Number & Icon */}
        <div className="flex-shrink-0">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: `${statusColor}20`,
              color: statusColor,
            }}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              getIcon(module.type)
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-[#F8FAFC] mb-1">{module.title}</h4>
              <p className="text-sm text-[#94A3B8]">{module.description}</p>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 text-xs text-[#64748B] flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(module.duration)}</span>
            </div>
          </div>

          {/* Progress Bar for In Progress */}
          {isInProgress && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[#94A3B8]">Progress</span>
                <span className="font-semibold text-[#F8FAFC]">{module.progress}%</span>
              </div>
              <div className="h-1.5 bg-[#0F172A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] transition-all duration-500"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Resources */}
          {module.resources.length > 0 && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-[#94A3B8] mb-2">Resources</h5>
              <div className="flex flex-wrap gap-2">
                {module.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0F172A]/60 hover:bg-[#0F172A] border border-[#334155] hover:border-[#6366F1] text-xs text-[#94A3B8] hover:text-[#6366F1] transition-all duration-200"
                  >
                    {getResourceIcon(resource.type)}
                    <span>{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isCompleted && (
              <button
                onClick={onStart}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white text-sm font-medium transition-all duration-200"
              >
                {isInProgress ? 'Continue' : 'Start Module'}
              </button>
            )}

            {isInProgress && (
              <button
                onClick={onComplete}
                className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#10B981]/90 text-white text-sm font-medium transition-all duration-200"
              >
                Mark Complete
              </button>
            )}

            {isCompleted && module.completedAt && (
              <span className="text-xs text-[#10B981]">
                Completed on {module.completedAt.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
