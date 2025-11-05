'use client';

/**
 * Lesson Detail Page
 * Clean, two-column layout for focused learning experience
 * Left: Module navigation | Right: Lesson content with progress tracking
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  FileQuestion,
  ExternalLink,
  Bookmark,
  Share2,
} from 'lucide-react';
import { LessonProvider, useLesson } from '@/features/lesson/context/LessonContext';
import { LessonSidebar } from '@/features/lesson/presentation/components/LessonSidebar';
import { LessonContent } from '@/features/lesson/presentation/components/LessonContent';
import { ProgressRing } from '@/features/lesson/presentation/components/ProgressRing';
import { formatDuration } from '@/features/lesson/types/lesson.types';

/**
 * Page Content (needs context)
 */
function LessonDetailContent() {
  const { state, actions } = useLesson();
  const {
    currentLesson,
    currentModule,
    navigation,
    progress,
    currentSectionId,
    isSidebarOpen,
  } = state;

  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'quiz'>('content');

  if (!currentLesson || !currentModule || !progress) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#6366F1] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Lesson Not Found</h2>
          <p className="text-[#94A3B8]">The lesson you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  const currentSection = currentLesson.sections.find(s => s.id === currentSectionId);
  const currentSectionIndex = currentLesson.sections.findIndex(s => s.id === currentSectionId);
  const hasNextSection = currentSectionIndex < currentLesson.sections.length - 1;
  const hasPrevSection = currentSectionIndex > 0;

  const handleNextSection = () => {
    if (hasNextSection) {
      const nextSection = currentLesson.sections[currentSectionIndex + 1];
      actions.setCurrentSection(nextSection.id);
      actions.completeSection(currentSectionId!);
    } else if (navigation?.nextLesson) {
      actions.navigateToLesson(navigation.nextLesson.id);
    }
  };

  const handlePrevSection = () => {
    if (hasPrevSection) {
      const prevSection = currentLesson.sections[currentSectionIndex - 1];
      actions.setCurrentSection(prevSection.id);
    }
  };

  const handleCompleteLesson = () => {
    actions.completeLesson();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
      {/* Left Sidebar - Module Navigation */}
      <LessonSidebar
        module={currentModule}
        currentLesson={currentLesson}
        onLessonSelect={actions.navigateToLesson}
        isOpen={isSidebarOpen}
        onToggle={actions.toggleSidebar}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-6">
          {/* Header with Progress Ring */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-[#94A3B8] mb-2">
                <span>{currentModule.title}</span>
                <span>•</span>
                <span>Lesson {currentLesson.order}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#F8FAFC] mb-3">
                {currentLesson.title}
              </h1>
              <p className="text-[#94A3B8] text-lg mb-4">{currentLesson.description}</p>

              {/* Meta Info */}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(currentLesson.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <BookOpen className="w-4 h-4" />
                  <span>{currentLesson.sections.length} sections</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-[#94A3B8] hover:text-[#6366F1] transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="text-[#94A3B8] hover:text-[#6366F1] transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="hidden lg:block">
              <ProgressRing progress={progress.completionPercentage} size={120} />
            </div>
          </div>

          {/* Learning Objectives */}
          {currentLesson.objectives.length > 0 && (
            <div className="bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 rounded-2xl border border-[#334155] p-6">
              <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {currentLesson.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-[#94A3B8]">
                    <CheckCircle2 className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-[#334155]">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'content'
                  ? 'border-[#6366F1] text-[#6366F1]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Content
            </button>
            {currentLesson.resources.length > 0 && (
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'resources'
                    ? 'border-[#6366F1] text-[#6366F1]'
                    : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Resources ({currentLesson.resources.length})
              </button>
            )}
            {currentLesson.quiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'quiz'
                    ? 'border-[#6366F1] text-[#6366F1]'
                    : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Quiz
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'content' && currentSection && (
              <LessonContent
                section={currentSection}
                onComplete={() => actions.completeSection(currentSectionId!)}
                onVideoProgress={(time) => actions.updateVideoProgress(currentSectionId!, time)}
              />
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                {currentLesson.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-[#1E293B] rounded-xl border border-[#334155] hover:border-[#6366F1] transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0">
                      <ExternalLink className="w-5 h-5 text-[#6366F1]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#6366F1] transition-colors">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-[#94A3B8] capitalize">{resource.type}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#94A3B8] group-hover:text-[#6366F1] transition-colors" />
                  </a>
                ))}
              </div>
            )}

            {activeTab === 'quiz' && currentLesson.quiz && (
              <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-8 text-center">
                <FileQuestion className="w-16 h-16 text-[#6366F1] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">
                  {currentLesson.quiz.title}
                </h3>
                <p className="text-[#94A3B8] mb-6">{currentLesson.quiz.description}</p>
                <div className="flex items-center justify-center gap-6 mb-6 text-sm text-[#94A3B8]">
                  <span>{currentLesson.quiz.questions.length} questions</span>
                  <span>•</span>
                  <span>Passing score: {currentLesson.quiz.passingScore}%</span>
                  {currentLesson.quiz.timeLimit && (
                    <>
                      <span>•</span>
                      <span>{currentLesson.quiz.timeLimit} minutes</span>
                    </>
                  )}
                </div>
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold transition-all duration-200">
                  Start Quiz
                </button>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#334155]">
            <button
              onClick={handlePrevSection}
              disabled={!hasPrevSection && !navigation?.previousLesson}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#334155] text-[#94A3B8] hover:border-[#6366F1] hover:text-[#6366F1] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {!hasNextSection && !navigation?.nextLesson ? (
              <button
                onClick={handleCompleteLesson}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#22D3EE] hover:from-[#10B981]/90 hover:to-[#22D3EE]/90 text-white font-semibold transition-all duration-200"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Complete Lesson</span>
              </button>
            ) : (
              <button
                onClick={handleNextSection}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold transition-all duration-200"
              >
                <span>{hasNextSection ? 'Next Section' : 'Next Lesson'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Page with Provider
 */
export default function LessonDetailPage() {
  return (
    <LessonProvider>
      <LessonDetailContent />
    </LessonProvider>
  );
}
