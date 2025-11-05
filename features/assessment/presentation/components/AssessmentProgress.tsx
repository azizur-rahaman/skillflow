'use client';

/**
 * Assessment Progress Component
 * Progress bar showing question completion and current score
 */

import React from 'react';
import { CheckCircle2, Circle, XCircle, MinusCircle } from 'lucide-react';
import { useAssessment } from '../../context/AssessmentContext';
import { isQuestionAnswered, getUserAnswer } from '../../types/assessment.types';

export function AssessmentProgress() {
  const { state, actions } = useAssessment();
  const { assessment, attempt } = state;

  if (!assessment || !attempt) return null;

  const totalQuestions = assessment.totalQuestions;
  const answeredCount = attempt.answers.length;
  const currentIndex = attempt.currentQuestionIndex;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#F8FAFC] font-medium">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-[#94A3B8]">
            {answeredCount} answered • {totalQuestions - answeredCount} remaining
          </span>
        </div>
        
        <div className="h-2.5 bg-[#1E293B] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#22D3EE] rounded-full transition-all duration-500 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1E293B] to-[#1E293B]/50 border border-[#334155] rounded-xl">
        <div className="flex items-center gap-6">
          {/* Current Score */}
          <div>
            <div className="text-xs text-[#94A3B8] mb-1">Current Score</div>
            <div className="text-2xl font-bold text-[#F8FAFC]">
              {attempt.score}%
            </div>
          </div>

          {/* Points */}
          <div className="h-10 w-px bg-[#334155]" />
          <div>
            <div className="text-xs text-[#94A3B8] mb-1">Points</div>
            <div className="text-lg font-semibold text-[#6366F1]">
              {attempt.pointsEarned} / {assessment.totalPoints}
            </div>
          </div>

          {/* Stats */}
          <div className="h-10 w-px bg-[#334155]" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span className="text-sm text-[#10B981] font-medium">
                {attempt.correctAnswers}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-[#EF4444]" />
              <span className="text-sm text-[#EF4444] font-medium">
                {attempt.incorrectAnswers}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MinusCircle className="w-4 h-4 text-[#64748B]" />
              <span className="text-sm text-[#64748B] font-medium">
                {attempt.skippedAnswers}
              </span>
            </div>
          </div>
        </div>

        {/* Passing Score Indicator */}
        <div className="text-right">
          <div className="text-xs text-[#94A3B8] mb-1">Passing Score</div>
          <div className="text-lg font-semibold text-[#94A3B8]">
            {assessment.passingScore}%
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex items-center gap-2 flex-wrap">
        {assessment.questions.map((question, index) => {
          const answer = getUserAnswer(question.id, attempt.answers);
          const isAnswered = !!answer;
          const isCurrent = index === currentIndex;
          const isCorrect = answer?.isCorrect;

          return (
            <button
              key={question.id}
              onClick={() => actions.goToQuestion(index)}
              className={`relative w-12 h-12 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                isCurrent
                  ? 'border-[#6366F1] bg-[#6366F1] text-white scale-110 shadow-lg shadow-[#6366F1]/30'
                  : isAnswered
                  ? isCorrect
                    ? 'border-[#10B981] bg-[#10B981]/20 text-[#10B981] hover:bg-[#10B981]/30'
                    : 'border-[#EF4444] bg-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/30'
                  : 'border-[#334155] bg-[#1E293B] text-[#94A3B8] hover:border-[#6366F1] hover:text-[#6366F1]'
              }`}
              aria-label={`Go to question ${index + 1}`}
            >
              {index + 1}
              
              {/* Status Indicator */}
              {isAnswered && !isCurrent && (
                <div className="absolute -top-1 -right-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] bg-[#0F172A] rounded-full" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#EF4444] bg-[#0F172A] rounded-full" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
