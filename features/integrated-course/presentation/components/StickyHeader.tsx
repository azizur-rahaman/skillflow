'use client';

/**
 * Sticky Header Component
 * Minimal header showing course title, platform logo, and progress
 */

import React from 'react';
import { ChevronLeft, BookOpen, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIntegratedCourse } from '../../context/IntegratedCourseContext';
import { getPlatformLogo, getPlatformColor } from '../../types/integrated-course.types';

export function StickyHeader() {
  const router = useRouter();
  const { state } = useIntegratedCourse();
  const { course, progress } = state;

  if (!course || !progress) return null;

  const platformColor = getPlatformColor(course.platform);

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-lg border-b border-[#334155]">
      <div className="max-w-screen-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Back Button + Course Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#94A3B8] hover:text-[#6366F1] hover:border-[#6366F1] transition-all duration-200"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Platform Logo */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: platformColor }}
            >
              {course.platform === 'coursera' && 'C'}
              {course.platform === 'linkedin-learning' && 'in'}
              {course.platform === 'udemy' && 'U'}
              {course.platform === 'edx' && 'edX'}
              {course.platform === 'skillshare' && 'S'}
            </div>

            {/* Course Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[#F8FAFC] font-semibold text-lg truncate">
                {course.title}
              </h1>
              <p className="text-[#94A3B8] text-sm truncate">
                {course.instructor.name}
              </p>
            </div>
          </div>

          {/* Right: Progress + Certificate */}
          <div className="flex items-center gap-6">
            {/* Progress Indicator */}
            <div className="flex items-center gap-3">
              {/* Circular Progress */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  {/* Background circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="url(#headerProgressGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress.completionPercentage / 100)}`}
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="headerProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#F8FAFC] text-xs font-bold">
                    {progress.completionPercentage}%
                  </span>
                </div>
              </div>

              {/* Progress Details */}
              <div className="hidden lg:block">
                <p className="text-[#F8FAFC] text-sm font-semibold">
                  {progress.completedSections.length} / {course.sections.length} sections
                </p>
                <p className="text-[#94A3B8] text-xs">
                  {progress.completionPercentage}% complete
                </p>
              </div>
            </div>

            {/* Certificate Badge */}
            {course.certificateAvailable && (
              <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1]/10 to-[#A855F7]/10 border border-[#6366F1]/30 rounded-xl">
                <Award className="w-5 h-5 text-[#6366F1]" />
                <span className="text-[#F8FAFC] text-sm font-medium">
                  Certificate Course
                </span>
              </div>
            )}

            {/* Current Section Indicator */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1E293B] border border-[#334155] rounded-xl">
              <BookOpen className="w-4 h-4 text-[#6366F1]" />
              <span className="text-[#94A3B8] text-sm">
                Section {course.sections.findIndex((s) => s.id === progress.currentSectionId) + 1}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar (Mobile Only) */}
        <div className="lg:hidden mt-3">
          <div className="h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] rounded-full transition-all duration-500"
              style={{ width: `${progress.completionPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-[#94A3B8]">
            <span>
              {progress.completedSections.length} / {course.sections.length} sections
            </span>
            <span>{progress.completionPercentage}% complete</span>
          </div>
        </div>
      </div>
    </header>
  );
}
