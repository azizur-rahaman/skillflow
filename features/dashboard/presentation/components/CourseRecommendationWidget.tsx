/**
 * Course Recommendation Widget
 * 
 * Displays personalized course suggestions based on skill gaps and forecasts.
 * Shows match scores, provider info, and learning paths.
 */

'use client';

import React from 'react';
import { BookOpen, Star, Users, Clock, X, ExternalLink, Target } from 'lucide-react';
import type { CourseRecommendation } from '../../types/dashboard.types';

interface CourseRecommendationWidgetProps {
  recommendations: CourseRecommendation[];
  onDismiss?: (id: string) => void;
  maxItems?: number;
}

export function CourseRecommendationWidget({
  recommendations,
  onDismiss,
  maxItems = 3,
}: CourseRecommendationWidgetProps) {
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: { bg: '#10B98110', text: '#10B981', border: '#10B98120' },
      intermediate: { bg: '#22D3EE10', text: '#22D3EE', border: '#22D3EE20' },
      advanced: { bg: '#A855F710', text: '#A855F7', border: '#A855F720' },
    };
    return colors[difficulty as keyof typeof colors] || colors.intermediate;
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#10B981] to-[#22D3EE] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#F8FAFC]">Recommended Courses</h3>
            <p className="text-sm text-[#94A3B8]">Personalized for your growth</p>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="p-6 space-y-4">
        {recommendations.slice(0, maxItems).map((course, index) => {
          const difficultyStyle = getDifficultyColor(course.difficulty);

          return (
            <div
              key={course.id}
              className="group relative rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Course Card */}
              <div className="p-4 bg-gradient-to-br from-white/5 to-transparent">
                {/* Top Section */}
                <div className="flex items-start gap-4 mb-3">
                  {/* Thumbnail Placeholder */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#6366F1]/20 to-[#A855F7]/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-7 h-7 text-[#6366F1]" />
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-[#F8FAFC] line-clamp-2 leading-tight">
                        {course.title}
                      </h4>

                      {/* Dismiss Button */}
                      {onDismiss && (
                        <button aria-label='x'
                          onClick={() => onDismiss(course.id)}
                          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 text-[#64748B] hover:text-[#F8FAFC] transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-[#64748B] mb-2">
                      {course.provider}
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Target className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-xs font-semibold text-[#10B981]">
                          {course.matchScore}% match
                        </span>
                      </div>

                      <div className="w-1 h-1 rounded-full bg-white/20" />

                      <div
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: difficultyStyle.bg,
                          color: difficultyStyle.text,
                          border: `1px solid ${difficultyStyle.border}`,
                        }}
                      >
                        {course.difficulty}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-3 p-2 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20">
                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    <span className="text-[#6366F1] font-medium">Why: </span>
                    {course.reason}
                  </p>
                </div>

                {/* Skills Covered */}
                <div className="mb-3">
                  <div className="text-xs text-[#94A3B8] mb-2">Skills covered:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {course.skillsCovered.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md bg-white/5 text-xs text-[#CBD5E1] border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skillsCovered.length > 4 && (
                      <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-[#64748B] border border-white/10">
                        +{course.skillsCovered.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                    <span>{course.rating}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{(course.enrollments / 1000).toFixed(1)}k</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}h</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => window.open(course.url, '_blank')}
                  className="w-full mt-3 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Start Learning</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#64748B]" />
          </div>
          <p className="text-sm text-[#94A3B8]">
            No recommendations available yet
          </p>
          <p className="text-xs text-[#64748B] mt-1">
            Complete your profile to get personalized suggestions
          </p>
        </div>
      )}
    </div>
  );
}
