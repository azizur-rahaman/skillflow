'use client';

/**
 * Multiple Choice Question Component
 * Radio buttons for single choice, checkboxes for multiple choice
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Square, CheckSquare, Code2, Lightbulb } from 'lucide-react';
import { useAssessment } from '../../context/AssessmentContext';
import {
  MultipleChoiceQuestion as MCQuestion,
  QuestionType,
  getDifficultyColor,
  getDifficultyLabel,
  getUserAnswer,
} from '../../types/assessment.types';

interface Props {
  question: MCQuestion;
}

export function MultipleChoiceQuestion({ question }: Props) {
  const { state, actions } = useAssessment();
  const { attempt } = state;

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const existingAnswer = attempt ? getUserAnswer(question.id, attempt.answers) : undefined;
  const isSubmitted = !!existingAnswer;
  const isSingleChoice = question.type === QuestionType.SINGLE_CHOICE || question.type === QuestionType.TRUE_FALSE;

  // Load existing answer
  useEffect(() => {
    if (existingAnswer?.selectedOptions) {
      setSelectedOptions(existingAnswer.selectedOptions);
      setShowExplanation(true);
    } else {
      setSelectedOptions([]);
      setShowExplanation(false);
    }
  }, [question.id, existingAnswer]);

  const handleOptionToggle = (optionId: string) => {
    if (isSubmitted) return;

    if (isSingleChoice) {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      actions.showToast({
        type: 'warning',
        title: 'No Answer Selected',
        message: 'Please select an answer before submitting.',
        duration: 2000,
      });
      return;
    }

    actions.submitAnswer({
      questionId: question.id,
      selectedOptions,
      timeTaken: 0,
    });
  };

  const difficultyColor = getDifficultyColor(question.difficulty);

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{
              backgroundColor: `${difficultyColor}20`,
              color: difficultyColor,
              borderColor: `${difficultyColor}40`,
              borderWidth: '1px',
            }}
          >
            {getDifficultyLabel(question.difficulty)}
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30">
            {question.points} points
          </span>
          <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1E293B] text-[#94A3B8] border border-[#334155]">
            {isSingleChoice ? 'Single Choice' : 'Multiple Choice'}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-[#F8FAFC]">{question.title}</h2>

        {question.description && (
          <p className="text-[#94A3B8] text-lg leading-relaxed">{question.description}</p>
        )}

        {/* Code Snippet */}
        {question.code && (
          <div className="bg-[#0F172A] border border-[#334155] rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-4 h-4 text-[#6366F1]" />
              <span className="text-xs text-[#94A3B8] font-medium">Code to analyze:</span>
            </div>
            <pre className="text-[#F8FAFC] font-mono text-sm">
              <code>{question.code}</code>
            </pre>
          </div>
        )}

        {!isSingleChoice && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-lg">
            <Lightbulb className="w-4 h-4 text-[#22D3EE]" />
            <span className="text-sm text-[#22D3EE]">Select all that apply</span>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const showCorrect = isSubmitted && option.isCorrect;
          const showIncorrect = isSubmitted && isSelected && !option.isCorrect;

          return (
            <button
              key={option.id}
              onClick={() => handleOptionToggle(option.id)}
              disabled={isSubmitted}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                showCorrect
                  ? 'border-[#10B981] bg-[#10B981]/10'
                  : showIncorrect
                  ? 'border-[#EF4444] bg-[#EF4444]/10'
                  : isSelected
                  ? 'border-[#6366F1] bg-[#6366F1]/10'
                  : 'border-[#334155] bg-[#1E293B] hover:border-[#6366F1] hover:bg-[#1E293B]/50'
              } ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox/Radio */}
                <div className="flex-shrink-0 mt-0.5">
                  {isSingleChoice ? (
                    isSelected ? (
                      <CheckCircle2
                        className="w-6 h-6"
                        style={{
                          color: showCorrect
                            ? '#10B981'
                            : showIncorrect
                            ? '#EF4444'
                            : '#6366F1',
                        }}
                      />
                    ) : (
                      <Circle className="w-6 h-6 text-[#64748B]" />
                    )
                  ) : isSelected ? (
                    <CheckSquare
                      className="w-6 h-6"
                      style={{
                        color: showCorrect
                          ? '#10B981'
                          : showIncorrect
                          ? '#EF4444'
                          : '#6366F1',
                      }}
                    />
                  ) : (
                    <Square className="w-6 h-6 text-[#64748B]" />
                  )}
                </div>

                {/* Option Text */}
                <div className="flex-1">
                  <p
                    className={`text-base font-medium ${
                      showCorrect
                        ? 'text-[#10B981]'
                        : showIncorrect
                        ? 'text-[#EF4444]'
                        : isSelected
                        ? 'text-[#F8FAFC]'
                        : 'text-[#94A3B8]'
                    }`}
                  >
                    {option.text}
                  </p>

                  {/* Option Explanation (shown after submission) */}
                  {isSubmitted && option.explanation && (isSelected || option.isCorrect) && (
                    <p className="mt-2 text-sm text-[#94A3B8] leading-relaxed">
                      {option.explanation}
                    </p>
                  )}
                </div>

                {/* Correct/Incorrect Badge */}
                {showCorrect && (
                  <div className="flex-shrink-0 px-2 py-1 bg-[#10B981] text-white text-xs font-semibold rounded-md">
                    Correct
                  </div>
                )}
                {showIncorrect && (
                  <div className="flex-shrink-0 px-2 py-1 bg-[#EF4444] text-white text-xs font-semibold rounded-md">
                    Wrong
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Overall Explanation (shown after submission) */}
      {isSubmitted && question.explanation && (
        <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#A855F7]/10 border border-[#6366F1]/30 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#6366F1] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[#F8FAFC] mb-2">Explanation</h4>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="flex items-center justify-end pt-4">
          <button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}
