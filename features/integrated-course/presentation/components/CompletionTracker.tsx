'use client';

/**
 * Completion Tracker Component
 * Progress bar showing course completion with section breakdown
 */

import React from 'react';
import { CheckCircle2, Circle, Lock, PlayCircle } from 'lucide-react';
import { useIntegratedCourse } from '../../context/IntegratedCourseContext';
import { formatDuration } from '../../types/integrated-course.types';
import type { CourseSection } from '../../types/integrated-course.types';

export function CompletionTracker() {
  const { state, actions } = useIntegratedCourse();
  const { course, progress } = state;

  if (!course || !progress) return null;

  const completedCount = progress.completedSections.length;
  const totalCount = course.sections.length;
  const completionPercent = progress.completionPercentage;

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[#F8FAFC] font-semibold text-lg">Course Progress</h3>
          <p className="text-[#94A3B8] text-sm mt-1">
            {completedCount} of {totalCount} sections completed
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#F8FAFC]">{completionPercent}%</div>
          <p className="text-[#94A3B8] text-xs mt-1">Complete</p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="h-3 bg-[#0F172A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#22D3EE] rounded-full transition-all duration-500 relative"
            style={{ width: `${completionPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-[#94A3B8]">
          <span>Started {new Date(course.enrolledAt).toLocaleDateString()}</span>
          {completionPercent === 100 && (
            <span className="text-[#10B981] font-semibold">✓ Completed!</span>
          )}
        </div>
      </div>

      {/* Section List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {course.sections.map((section, index) => (
          <SectionRow
            key={section.id}
            section={section}
            index={index}
            isCompleted={progress.completedSections.includes(section.id)}
            isCurrent={progress.currentSectionId === section.id}
            onSelect={actions.navigateToSection}
          />
        ))}
      </div>

      {/* Stats Footer */}
      <div className="pt-4 border-t border-[#334155] grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-[#10B981]">{completedCount}</div>
          <p className="text-xs text-[#94A3B8] mt-1">Completed</p>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#6366F1]">
            {totalCount - completedCount}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">Remaining</p>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#22D3EE]">
            {formatDuration(course.totalDuration)}
          </div>
          <p className="text-xs text-[#94A3B8] mt-1">Total Time</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Section Row
 */
function SectionRow({
  section,
  index,
  isCompleted,
  isCurrent,
  onSelect,
}: {
  section: CourseSection;
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  onSelect: (sectionId: string) => void;
}) {
  const isLocked = index > 0 && !isCompleted && !isCurrent;

  return (
    <button
      onClick={() => !isLocked && onSelect(section.id)}
      disabled={isLocked}
      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
        isCurrent
          ? 'bg-gradient-to-r from-[#6366F1]/20 to-[#A855F7]/20 border-[#6366F1]'
          : isCompleted
          ? 'bg-[#10B981]/5 border-[#10B981]/30 hover:border-[#10B981]'
          : isLocked
          ? 'bg-[#0F172A]/50 border-[#334155] cursor-not-allowed opacity-50'
          : 'bg-[#0F172A] border-[#334155] hover:border-[#6366F1]'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
          ) : isCurrent ? (
            <PlayCircle className="w-6 h-6 text-[#6366F1]" />
          ) : isLocked ? (
            <Lock className="w-6 h-6 text-[#64748B]" />
          ) : (
            <Circle className="w-6 h-6 text-[#64748B]" />
          )}
        </div>

        {/* Section Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold ${
                isCurrent ? 'text-[#6366F1]' : 'text-[#94A3B8]'
              }`}
            >
              Section {section.order}
            </span>
            {isCurrent && (
              <span className="px-2 py-0.5 bg-[#6366F1] text-white text-xs font-medium rounded-full">
                Playing
              </span>
            )}
          </div>
          <h4
            className={`font-semibold text-sm mb-1 ${
              isCurrent ? 'text-[#F8FAFC]' : isCompleted ? 'text-[#94A3B8]' : 'text-[#F8FAFC]'
            }`}
          >
            {section.title}
          </h4>
          {section.description && (
            <p className="text-xs text-[#64748B] line-clamp-1">{section.description}</p>
          )}
        </div>

        {/* Duration */}
        <div className="flex-shrink-0 text-right">
          <span className="text-xs text-[#94A3B8]">{formatDuration(section.duration)}</span>
          {section.isCompleted && section.completedAt && (
            <p className="text-xs text-[#10B981] mt-1">
              ✓ {new Date(section.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
