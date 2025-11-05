'use client';

/**
 * Assessment Page
 * Centered task area with timer, progress, questions, and instant feedback
 */

import React from 'react';
import { AssessmentProvider, useAssessment } from '@/features/assessment/context/AssessmentContext';
import {
  AssessmentTimer,
  AssessmentProgress,
  MultipleChoiceQuestion,
  CodingTaskQuestion,
  FeedbackToast,
  AssessmentResults,
} from '@/features/assessment/presentation/components';
import {
  QuestionType,
  AssessmentStatus,
  MultipleChoiceQuestion as MCQuestion,
  CodingQuestion,
} from '@/features/assessment/types/assessment.types';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Page Content (needs context)
 */
function AssessmentContent() {
  const { state, actions } = useAssessment();
  const {
    assessment,
    attempt,
    currentQuestion,
    loading,
    error,
  } = state;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#94A3B8]">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment || !attempt) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#EF4444] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Assessment Not Found</h2>
          <p className="text-[#94A3B8]">{error || 'Unable to load assessment'}</p>
        </div>
      </div>
    );
  }

  // Show results if submitted
  if (attempt.status === AssessmentStatus.SUBMITTED || attempt.status === AssessmentStatus.COMPLETED) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-12 px-6">
        <FeedbackToast />
        <AssessmentResults />
      </div>
    );
  }

  // Show start screen if not started
  if (attempt.status === AssessmentStatus.NOT_STARTED) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-[#F8FAFC] mb-4">{assessment.title}</h1>
            <p className="text-[#94A3B8] text-lg">{assessment.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#6366F1] mb-2">
                {assessment.totalQuestions}
              </div>
              <div className="text-sm text-[#94A3B8]">Questions</div>
            </div>
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#22D3EE] mb-2">
                {Math.floor(assessment.timeLimit / 60)} min
              </div>
              <div className="text-sm text-[#94A3B8]">Time Limit</div>
            </div>
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="text-3xl font-bold text-[#A855F7] mb-2">
                {assessment.passingScore}%
              </div>
              <div className="text-sm text-[#94A3B8]">Passing Score</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#A855F7]/10 border border-[#6366F1]/30 rounded-2xl p-6 text-left">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-3">Instructions</h3>
            <ul className="space-y-2 text-[#94A3B8]">
              <li>• Answer all questions to the best of your ability</li>
              <li>• You can navigate between questions using the arrows or question navigator</li>
              <li>• Submit each answer to receive instant feedback</li>
              <li>• The assessment will auto-submit when time expires</li>
              <li>• You need {assessment.passingScore}% to pass</li>
            </ul>
          </div>

          <button
            onClick={actions.startAssessment}
            className="px-12 py-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white text-lg font-semibold transition-all duration-200 shadow-lg shadow-[#6366F1]/30"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  // Main assessment view
  const hasNextQuestion = attempt.currentQuestionIndex < assessment.questions.length - 1;
  const hasPrevQuestion = attempt.currentQuestionIndex > 0;
  const allQuestionsAnswered = attempt.answers.length === assessment.totalQuestions;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <FeedbackToast />

      {/* Header with Timer */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-lg border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#F8FAFC] mb-1">{assessment.title}</h1>
              <p className="text-sm text-[#94A3B8]">{assessment.skillTag} Assessment</p>
            </div>
            <AssessmentTimer />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <AssessmentProgress />
        </div>

        {/* Question Area */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 mb-6">
          {currentQuestion && (
            <>
              {currentQuestion.type === QuestionType.CODING ? (
                <CodingTaskQuestion question={currentQuestion as CodingQuestion} />
              ) : (
                <MultipleChoiceQuestion question={currentQuestion as MCQuestion} />
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={actions.previousQuestion}
            disabled={!hasPrevQuestion}
            className="px-6 py-3 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#6366F1] text-[#F8FAFC] font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {hasNextQuestion ? (
            <button
              onClick={actions.nextQuestion}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold flex items-center gap-2 transition-all duration-200"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={actions.submitAssessment}
              disabled={!allQuestionsAnswered}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#22D3EE] hover:from-[#10B981]/90 hover:to-[#22D3EE]/90 text-white font-semibold flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              Submit Assessment
            </button>
          )}
        </div>

        {!allQuestionsAnswered && !hasNextQuestion && (
          <div className="mt-4 text-center">
            <p className="text-sm text-[#F59E0B]">
              You have {assessment.totalQuestions - attempt.answers.length} unanswered question(s)
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Page with Provider
 */
export default function AssessmentPage() {
  return (
    <AssessmentProvider>
      <AssessmentContent />
    </AssessmentProvider>
  );
}
