'use client';

/**
 * Integrated Course Player Page
 * Responsive layout for third-party course content (Coursera, LinkedIn Learning)
 * Features: Sticky header, video player, transcript toggle, notes panel, minimal distractions
 */

import React from 'react';
import { IntegratedCourseProvider, useIntegratedCourse } from '@/features/integrated-course/context/IntegratedCourseContext';
import {
  StickyHeader,
  CourseVideoPlayer,
  TranscriptPanel,
  NotesPanel,
  CompletionTracker,
} from '@/features/integrated-course/presentation/components';
import { BookOpen } from 'lucide-react';

/**
 * Page Content (needs context)
 */
function IntegratedCourseContent() {
  const { state } = useIntegratedCourse();
  const { course, progress, loading, error } = state;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#94A3B8]">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course || !progress) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#EF4444] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Course Not Found</h2>
          <p className="text-[#94A3B8]">{error || 'Unable to load course content'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Sticky Header */}
      <StickyHeader />

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Column: Video + Transcript + Progress */}
        <main className="flex-1 min-w-0 p-6 lg:p-8 space-y-6">
          {/* Video Player */}
          <div className="mb-6">
            <CourseVideoPlayer />
          </div>

          {/* Transcript */}
          <TranscriptPanel />

          {/* Completion Tracker */}
          <CompletionTracker />

          {/* Course Resources */}
          {progress.currentTime > 0 && (
            <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#A855F7]/10 border border-[#6366F1]/30 rounded-2xl p-6">
              <h3 className="text-[#F8FAFC] font-semibold mb-2">💡 Learning Tip</h3>
              <p className="text-[#94A3B8] text-sm">
                Take notes while watching to retain information better. Click the notes icon to add
                timestamped notes that you can reference later.
              </p>
            </div>
          )}
        </main>

        {/* Right Column: Notes Panel (Desktop) */}
        <aside className="hidden lg:block w-96 border-l border-[#334155]">
          <div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-hidden">
            <NotesPanel />
          </div>
        </aside>
      </div>

      {/* Mobile Notes FAB */}
      <div className="lg:hidden">
        <NotesPanel />
      </div>
    </div>
  );
}

/**
 * Page with Provider
 */
export default function IntegratedCoursePage() {
  return (
    <IntegratedCourseProvider>
      <IntegratedCourseContent />
    </IntegratedCourseProvider>
  );
}
