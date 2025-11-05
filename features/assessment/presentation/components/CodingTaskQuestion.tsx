'use client';

/**
 * Coding Task Question Component
 * Code editor with test cases, run/submit buttons
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Code2,
  Eye,
  EyeOff,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { useAssessment } from '../../context/AssessmentContext';
import {
  CodingQuestion,
  TestCase,
  getDifficultyColor,
  getDifficultyLabel,
  getUserAnswer,
} from '../../types/assessment.types';

interface Props {
  question: CodingQuestion;
}

export function CodingTaskQuestion({ question }: Props) {
  const { state, actions } = useAssessment();
  const { attempt } = state;

  const [code, setCode] = useState(question.starterCode);
  const [testResults, setTestResults] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'constraints'>('description');

  const existingAnswer = attempt ? getUserAnswer(question.id, attempt.answers) : undefined;
  const isSubmitted = !!existingAnswer;

  // Load existing answer
  useEffect(() => {
    if (existingAnswer?.code) {
      setCode(existingAnswer.code);
    } else {
      setCode(question.starterCode);
    }
  }, [question.id, existingAnswer, question.starterCode]);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const results = await actions.runCode(code);
      setTestResults(results);
      
      actions.showToast({
        type: 'info',
        title: 'Code Executed',
        message: `${results.filter(r => r.passed).length}/${results.length} test cases passed`,
        duration: 3000,
      });
    } catch (error) {
      actions.showToast({
        type: 'error',
        title: 'Execution Error',
        message: 'Failed to run code. Check your syntax.',
        duration: 3000,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    if (code === question.starterCode) {
      actions.showToast({
        type: 'warning',
        title: 'No Code Written',
        message: 'Please write your solution before submitting.',
        duration: 2000,
      });
      return;
    }

    // Check if all test cases passed
    const allPassed = testResults.length > 0 && testResults.every((tc) => tc.passed);

    actions.submitAnswer({
      questionId: question.id,
      code,
      timeTaken: 0,
      isCorrect: allPassed,
    });
  };

  const difficultyColor = getDifficultyColor(question.difficulty);
  const visibleTestCases = question.testCases.filter((tc) => !tc.isHidden);
  const passedCount = testResults.filter((tc) => tc.passed).length;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: Problem Description */}
      <div className="space-y-6">
        {/* Header */}
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
              {question.language.toUpperCase()}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-[#F8FAFC]">{question.title}</h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-[#334155]">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'description'
                ? 'border-[#6366F1] text-[#6366F1]'
                : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Description
          </button>
          {question.hints && question.hints.length > 0 && (
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'hints'
                  ? 'border-[#6366F1] text-[#6366F1]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Hints ({question.hints.length})
            </button>
          )}
          {question.constraints && question.constraints.length > 0 && (
            <button
              onClick={() => setActiveTab('constraints')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'constraints'
                  ? 'border-[#6366F1] text-[#6366F1]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Constraints
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'description' && (
            <div className="prose prose-invert max-w-none">
              <p className="text-[#94A3B8] leading-relaxed">{question.description}</p>
            </div>
          )}

          {activeTab === 'hints' && question.hints && (
            <div className="space-y-3">
              {question.hints.map((hint, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-xl"
                >
                  <Lightbulb className="w-5 h-5 text-[#22D3EE] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#94A3B8]">{hint}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'constraints' && question.constraints && (
            <div className="space-y-2">
              {question.constraints.map((constraint, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-[#1E293B] border border-[#334155] rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#94A3B8]">{constraint}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Cases */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Test Cases</h3>
          <div className="space-y-3">
            {visibleTestCases.map((testCase, index) => {
              const result = testResults.find((r) => r.id === testCase.id);
              const hasPassed = result?.passed;
              const hasFailed = result && !result.passed;

              return (
                <div
                  key={testCase.id}
                  className={`p-3 rounded-lg border ${
                    hasPassed
                      ? 'bg-[#10B981]/10 border-[#10B981]/30'
                      : hasFailed
                      ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
                      : 'bg-[#0F172A] border-[#334155]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#94A3B8]">
                      Test Case {index + 1}
                    </span>
                    {result && (
                      <div className="flex items-center gap-1.5">
                        {hasPassed ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                            <span className="text-xs font-semibold text-[#10B981]">Passed</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-[#EF4444]" />
                            <span className="text-xs font-semibold text-[#EF4444]">Failed</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-xs font-mono">
                    <div>
                      <span className="text-[#94A3B8]">Input: </span>
                      <span className="text-[#F8FAFC]">{testCase.input}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8]">Expected: </span>
                      <span className="text-[#10B981]">{testCase.expectedOutput}</span>
                    </div>
                    {result?.actualOutput && (
                      <div>
                        <span className="text-[#94A3B8]">Your Output: </span>
                        <span className={hasPassed ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                          {result.actualOutput}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Code Editor */}
      <div className="space-y-4">
        {/* Editor */}
        <div className="bg-[#0F172A] border border-[#334155] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1E293B] border-b border-[#334155]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#6366F1]" />
              <span className="text-sm font-medium text-[#F8FAFC]">Solution</span>
            </div>
            <div className="text-xs text-[#94A3B8]">{question.language}</div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isSubmitted}
            className="w-full h-96 p-4 bg-transparent text-[#F8FAFC] font-mono text-sm resize-none focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitted}
            className="flex-1 px-6 py-3 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#6366F1] text-[#F8FAFC] font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run Code
              </>
            )}
          </button>

          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={testResults.length === 0 || isRunning}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          )}
        </div>

        {/* Results Summary */}
        {testResults.length > 0 && (
          <div className="p-4 bg-[#1E293B] border border-[#334155] rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#F8FAFC]">Test Results</span>
              <span
                className={`text-sm font-bold ${
                  passedCount === testResults.length ? 'text-[#10B981]' : 'text-[#F59E0B]'
                }`}
              >
                {passedCount} / {testResults.length} Passed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
