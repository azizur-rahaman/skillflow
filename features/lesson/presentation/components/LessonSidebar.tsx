'use client';

/**
 * LessonSidebar Component
 * Left-side navigation showing module structure and lesson progress
 */

import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Lock,
  Play,
  Clock,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import type { Lesson, LearningModule } from '../../types/lesson.types';
import { LessonStatus, getStatusColor, getDifficultyColor, formatDuration } from '../../types/lesson.types';

interface LessonSidebarProps {
  module: LearningModule;
  currentLesson: Lesson;
  onLessonSelect: (lessonId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function LessonSidebar({
  module,
  currentLesson,
  onLessonSelect,
  isOpen,
  onToggle,
}: LessonSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set([currentLesson.id])
  );

  const toggleSection = (lessonId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const getLessonIcon = (status: LessonStatus) => {
    switch (status) {
      case LessonStatus.COMPLETED:
        return <CheckCircle2 className="w-5 h-5" />;
      case LessonStatus.IN_PROGRESS:
        return <Play className="w-5 h-5" />;
      case LessonStatus.LOCKED:
        return <Lock className="w-4 h-4" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#6366F1] transition-colors"
      >
        {isOpen ? <X className="w-5 h-5 text-[#F8FAFC]" /> : <Menu className="w-5 h-5 text-[#F8FAFC]" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-80 bg-[#0F172A] border-r border-[#334155] 
          transform transition-transform duration-300 z-40 overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          {/* Module Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${module.color}20` }}
              >
                <BookOpen className="w-5 h-5" style={{ color: module.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-[#F8FAFC] truncate">{module.title}</h2>
                <p className="text-xs text-[#94A3B8]">
                  {module.completedLessons}/{module.totalLessons} lessons completed
                </p>
              </div>
            </div>

            {/* Module Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[#94A3B8]">Module Progress</span>
                <span className="font-semibold text-[#F8FAFC]">{module.progress}%</span>
              </div>
              <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] transition-all duration-500"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#94A3B8] mb-3">Lessons</h3>
            
            {module.lessons.map((lesson, index) => {
              const isActive = lesson.id === currentLesson.id;
              const isExpanded = expandedSections.has(lesson.id);
              const statusColor = getStatusColor(lesson.status);
              const difficultyColor = getDifficultyColor(lesson.difficulty);
              const isLocked = lesson.status === LessonStatus.LOCKED;

              return (
                <div key={lesson.id} className="space-y-1">
                  {/* Lesson Item */}
                  <button
                    onClick={() => !isLocked && onLessonSelect(lesson.id)}
                    disabled={isLocked}
                    className={`
                      w-full p-3 rounded-xl text-left transition-all duration-200
                      ${isActive 
                        ? 'bg-[#1E293B] border-2 border-[#6366F1] shadow-lg' 
                        : 'bg-transparent border border-[#334155] hover:border-[#6366F1] hover:bg-[#1E293B]/50'
                      }
                      ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Lesson Number & Icon */}
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
                          style={{
                            backgroundColor: `${statusColor}20`,
                            color: statusColor,
                          }}
                        >
                          {lesson.status === LessonStatus.COMPLETED || 
                           lesson.status === LessonStatus.IN_PROGRESS || 
                           lesson.status === LessonStatus.LOCKED ? (
                            getLessonIcon(lesson.status)
                          ) : (
                            lesson.order
                          )}
                        </div>
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-semibold mb-1 ${isActive ? 'text-[#6366F1]' : 'text-[#F8FAFC]'}`}>
                          {lesson.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(lesson.duration)}</span>
                          </div>
                          <span>•</span>
                          <span
                            className="px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${difficultyColor}20`,
                              color: difficultyColor,
                            }}
                          >
                            {lesson.difficulty}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {lesson.progress > 0 && lesson.status !== LessonStatus.LOCKED && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-[#0F172A] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] transition-all duration-500"
                                style={{ width: `${lesson.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-[#94A3B8]">
                              {lesson.progress}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Expand/Collapse Icon */}
                      {lesson.sections.length > 0 && !isLocked && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSection(lesson.id);
                          }}
                          className="flex-shrink-0 w-6 h-6 rounded-lg hover:bg-[#334155] flex items-center justify-center transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                          )}
                        </button>
                      )}
                    </div>
                  </button>

                  {/* Expanded Sections */}
                  {isExpanded && lesson.sections.length > 0 && !isLocked && (
                    <div className="ml-11 space-y-1 pl-4 border-l border-[#334155]">
                      {lesson.sections.map((section, sectionIndex) => (
                        <div
                          key={section.id}
                          className="py-2 px-3 rounded-lg hover:bg-[#1E293B]/50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                            <span className="text-xs text-[#F8FAFC]">{section.title || `Section ${sectionIndex + 1}`}</span>
                            {section.estimatedTime && (
                              <span className="text-xs text-[#64748B] ml-auto">
                                {section.estimatedTime}min
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Total Time */}
          <div className="mt-6 p-4 rounded-xl bg-[#1E293B] border border-[#334155]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                <Clock className="w-4 h-4" />
                <span>Total Duration</span>
              </div>
              <span className="text-sm font-semibold text-[#F8FAFC]">
                {formatDuration(module.estimatedDuration)}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
