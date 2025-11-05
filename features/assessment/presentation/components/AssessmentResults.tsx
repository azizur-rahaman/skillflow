'use client';

/**
 * Assessment Results Component
 * Summary screen with score, time taken, breakdown
 */

import React from 'react';
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAssessment } from '../../context/AssessmentContext';
import { getGrade, hasPassed, formatTime } from '../../types/assessment.types';

export function AssessmentResults() {
  const router = useRouter();
  const { state } = useAssessment();
  const { assessment, attempt } = state;

  if (!assessment || !attempt) return null;

  const grade = getGrade(attempt.score);
  const passed = hasPassed(attempt.score, assessment.passingScore);
  const timeTaken = assessment.timeLimit - attempt.timeRemaining;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        {/* Result Badge */}
        <div className="inline-flex flex-col items-center">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mb-4 relative"
            style={{
              background: `linear-gradient(135deg, ${grade.color}20, ${grade.color}10)`,
              border: `3px solid ${grade.color}`,
            }}
          >
            {passed ? (
              <Trophy className="w-16 h-16" style={{ color: grade.color }} />
            ) : (
              <Target className="w-16 h-16" style={{ color: grade.color }} />
            )}
            
            {/* Confetti Effect for Pass */}
            {passed && (
              <div className="absolute inset-0 animate-ping opacity-20">
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: grade.color }}
                />
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-[#F8FAFC] mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-[#94A3B8] text-lg">
            {passed
              ? 'You passed the assessment'
              : `You need ${assessment.passingScore}% to pass`}
          </p>
        </div>

        {/* Score Display */}
        <div className="inline-flex items-center gap-6 px-8 py-6 bg-gradient-to-r from-[#1E293B] to-[#1E293B]/50 border border-[#334155] rounded-2xl">
          <div className="text-center">
            <div className="text-6xl font-bold mb-2" style={{ color: grade.color }}>
              {attempt.score}%
            </div>
            <div className="text-sm text-[#94A3B8]">Final Score</div>
          </div>
          
          <div className="h-16 w-px bg-[#334155]" />
          
          <div className="text-center">
            <div className="text-4xl font-bold text-[#F8FAFC] mb-2">
              {grade.label}
            </div>
            <div className="text-sm text-[#94A3B8]">Grade</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Time Taken */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 text-center">
          <Clock className="w-8 h-8 text-[#22D3EE] mx-auto mb-3" />
          <div className="text-2xl font-bold text-[#F8FAFC] mb-1">
            {formatTime(timeTaken)}
          </div>
          <div className="text-xs text-[#94A3B8]">Time Taken</div>
        </div>

        {/* Correct Answers */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 text-center">
          <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto mb-3" />
          <div className="text-2xl font-bold text-[#10B981] mb-1">
            {attempt.correctAnswers}
          </div>
          <div className="text-xs text-[#94A3B8]">Correct</div>
        </div>

        {/* Incorrect Answers */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 text-center">
          <XCircle className="w-8 h-8 text-[#EF4444] mx-auto mb-3" />
          <div className="text-2xl font-bold text-[#EF4444] mb-1">
            {attempt.incorrectAnswers}
          </div>
          <div className="text-xs text-[#94A3B8]">Incorrect</div>
        </div>

        {/* Points Earned */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 text-center">
          <Target className="w-8 h-8 text-[#A855F7] mx-auto mb-3" />
          <div className="text-2xl font-bold text-[#A855F7] mb-1">
            {attempt.pointsEarned}/{attempt.totalPoints}
          </div>
          <div className="text-xs text-[#94A3B8]">Points</div>
        </div>
      </div>

      {/* Breakdown by Question */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Question Breakdown</h3>
        <div className="space-y-3">
          {assessment.questions.map((question, index) => {
            const answer = attempt.answers.find((a) => a.questionId === question.id);
            const isCorrect = answer?.isCorrect ?? false;
            const points = answer?.pointsEarned ?? 0;

            return (
              <div
                key={question.id}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  isCorrect
                    ? 'bg-[#10B981]/10 border-[#10B981]/30'
                    : answer
                    ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
                    : 'bg-[#0F172A] border-[#334155]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    isCorrect
                      ? 'bg-[#10B981] text-white'
                      : answer
                      ? 'bg-[#EF4444] text-white'
                      : 'bg-[#334155] text-[#94A3B8]'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-medium text-[#F8FAFC]">{question.title}</h4>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    {question.points} points • {question.difficulty}
                  </p>
                </div>

                <div className="text-right">
                  {answer ? (
                    <>
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-[#10B981] mx-auto mb-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-[#EF4444] mx-auto mb-1" />
                      )}
                      <div className="text-sm font-semibold text-[#F8FAFC]">
                        {points} pts
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-[#64748B]">Not answered</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {!passed && (
        <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#A855F7]/10 border border-[#6366F1]/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 text-[#6366F1] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">
                Keep Improving!
              </h3>
              <p className="text-[#94A3B8] mb-4">
                You scored {attempt.score}% but need {assessment.passingScore}% to pass. Review the
                questions you missed and try again.
              </p>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li>• Focus on {assessment.skillTag} fundamentals</li>
                <li>• Review the explanations for incorrect answers</li>
                <li>• Practice with similar problems</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/assessments')}
          className="flex-1 px-6 py-3 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#6366F1] text-[#F8FAFC] font-semibold flex items-center justify-center gap-2 transition-all duration-200"
        >
          Back to Assessments
          <ArrowRight className="w-5 h-5" />
        </button>

        {!passed && (
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Assessment
          </button>
        )}

        {passed && (
          <button
            onClick={() => router.push('/learning')}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          >
            Continue Learning
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
