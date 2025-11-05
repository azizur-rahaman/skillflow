'use client';

/**
 * Assessment Context
 * Manages state for skill assessments (quizzes and coding tasks)
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  Assessment,
  AssessmentAttempt,
  Question,
  UserAnswer,
  FeedbackToast,
  AssessmentState,
  AssessmentActions,
  AssessmentType,
  AssessmentStatus,
  QuestionType,
  QuestionDifficulty,
  calculateScore,
  checkMultipleChoiceAnswer,
  calculatePointsEarned,
} from '../types/assessment.types';

/**
 * Mock assessment: JavaScript Fundamentals Quiz
 */
const mockAssessment: Assessment = {
  id: 'assessment-1',
  title: 'JavaScript Fundamentals Assessment',
  description: 'Test your knowledge of core JavaScript concepts including data types, functions, closures, and async programming.',
  type: AssessmentType.MIXED,
  skillTag: 'JavaScript',
  difficulty: QuestionDifficulty.MEDIUM,
  totalQuestions: 5,
  totalPoints: 100,
  passingScore: 70,
  timeLimit: 1200, // 20 minutes
  questions: [
    {
      id: 'q1',
      type: QuestionType.SINGLE_CHOICE,
      title: 'What is the output of the following code?',
      code: `console.log(typeof null);`,
      options: [
        { id: 'a', text: '"null"', isCorrect: false },
        { id: 'b', text: '"object"', isCorrect: true, explanation: 'This is a known quirk in JavaScript. typeof null returns "object" due to a legacy bug.' },
        { id: 'c', text: '"undefined"', isCorrect: false },
        { id: 'd', text: '"number"', isCorrect: false },
      ],
      points: 10,
      difficulty: QuestionDifficulty.EASY,
      tags: ['data-types', 'quirks'],
      explanation: 'The typeof operator returns "object" for null, which is a well-known JavaScript quirk that exists for historical reasons.',
    },
    {
      id: 'q2',
      type: QuestionType.MULTIPLE_CHOICE,
      title: 'Which of the following are falsy values in JavaScript? (Select all that apply)',
      options: [
        { id: 'a', text: '0', isCorrect: true },
        { id: 'b', text: '""', isCorrect: true },
        { id: 'c', text: 'null', isCorrect: true },
        { id: 'd', text: '[]', isCorrect: false, explanation: 'Empty arrays are truthy in JavaScript' },
        { id: 'e', text: 'false', isCorrect: true },
        { id: 'f', text: 'undefined', isCorrect: true },
      ],
      points: 20,
      difficulty: QuestionDifficulty.MEDIUM,
      tags: ['data-types', 'truthy-falsy'],
      explanation: 'JavaScript has 6 falsy values: false, 0, "", null, undefined, and NaN. Empty arrays and objects are truthy.',
    },
    {
      id: 'q3',
      type: QuestionType.CODING,
      title: 'Implement a function to reverse a string',
      description: 'Write a function called `reverseString` that takes a string as input and returns the reversed string.',
      starterCode: `function reverseString(str) {
  // Your code here
  
}`,
      language: 'javascript',
      testCases: [
        {
          id: 'tc1',
          input: 'reverseString("hello")',
          expectedOutput: '"olleh"',
          isHidden: false,
        },
        {
          id: 'tc2',
          input: 'reverseString("JavaScript")',
          expectedOutput: '"tpircSavaJ"',
          isHidden: false,
        },
        {
          id: 'tc3',
          input: 'reverseString("")',
          expectedOutput: '""',
          isHidden: true,
        },
      ],
      points: 30,
      difficulty: QuestionDifficulty.EASY,
      tags: ['strings', 'algorithms'],
      hints: [
        'You can use the split(), reverse(), and join() methods',
        'Or iterate through the string backwards',
      ],
      constraints: [
        'Time complexity should be O(n)',
        'Space complexity should be O(n)',
      ],
    },
    {
      id: 'q4',
      type: QuestionType.SINGLE_CHOICE,
      title: 'What will be logged to the console?',
      code: `let count = 0;
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}`,
      options: [
        { id: 'a', text: '0, 1, 2', isCorrect: true, explanation: 'let creates a new binding for each iteration' },
        { id: 'b', text: '3, 3, 3', isCorrect: false },
        { id: 'c', text: '0, 0, 0', isCorrect: false },
        { id: 'd', text: 'undefined, undefined, undefined', isCorrect: false },
      ],
      points: 20,
      difficulty: QuestionDifficulty.MEDIUM,
      tags: ['closures', 'async', 'scoping'],
      explanation: 'Using let in a for loop creates a new binding for each iteration, so each setTimeout callback captures a different value of i.',
    },
    {
      id: 'q5',
      type: QuestionType.CODING,
      title: 'Implement debounce function',
      description: 'Create a debounce function that delays executing a function until after a specified wait time has elapsed since the last time it was invoked.',
      starterCode: `function debounce(func, wait) {
  // Your code here
  
}`,
      language: 'javascript',
      testCases: [
        {
          id: 'tc1',
          input: 'debounce should return a function',
          expectedOutput: 'typeof debounce(() => {}, 100) === "function"',
          isHidden: false,
        },
        {
          id: 'tc2',
          input: 'debounced function should delay execution',
          expectedOutput: 'function executes after wait time',
          isHidden: false,
        },
      ],
      points: 20,
      difficulty: QuestionDifficulty.HARD,
      tags: ['functions', 'closures', 'timers'],
      hints: [
        'Use setTimeout to delay execution',
        'Clear the previous timeout on each call',
        'Return a function that wraps the original function',
      ],
    },
  ],
  createdAt: new Date('2025-11-01'),
  updatedAt: new Date('2025-11-05'),
};

const initialAttempt: AssessmentAttempt = {
  id: 'attempt-1',
  assessmentId: 'assessment-1',
  userId: 'user-123',
  status: AssessmentStatus.NOT_STARTED,
  startedAt: new Date(),
  timeRemaining: 1200, // 20 minutes
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  pointsEarned: 0,
  totalPoints: 100,
  correctAnswers: 0,
  incorrectAnswers: 0,
  skippedAnswers: 0,
};

type AssessmentContextType = {
  state: AssessmentState;
  actions: AssessmentActions;
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [assessment, setAssessment] = useState<Assessment | null>(mockAssessment);
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(initialAttempt);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<FeedbackToast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = assessment && attempt
    ? assessment.questions[attempt.currentQuestionIndex]
    : null;

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning || !attempt) return;

    timerRef.current = setInterval(() => {
      setAttempt((prev) => {
        if (!prev || prev.timeRemaining <= 0) {
          setIsTimerRunning(false);
          // Auto-submit when time expires
          submitAssessment();
          return prev;
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning]);

  const loadAssessment = useCallback(async (assessmentId: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAssessment(mockAssessment);
      setAttempt(initialAttempt);
    } catch (err) {
      setError('Failed to load assessment');
    } finally {
      setLoading(false);
    }
  }, []);

  const startAssessment = useCallback(() => {
    setAttempt((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: AssessmentStatus.IN_PROGRESS,
        startedAt: new Date(),
      };
    });
    setIsTimerRunning(true);
  }, []);

  const submitAnswer = useCallback(async (answer: Partial<UserAnswer>) => {
    if (!currentQuestion || !attempt) return;

    const questionId = currentQuestion.id;
    let isCorrect = false;
    let pointsEarned = 0;

    // Check if answer is correct
    if (currentQuestion.type === QuestionType.CODING) {
      // For coding, we'll assume the test cases have been run
      isCorrect = answer.isCorrect || false;
      pointsEarned = calculatePointsEarned(currentQuestion, isCorrect);
    } else {
      // For multiple choice
      const mcQuestion = currentQuestion as any;
      isCorrect = checkMultipleChoiceAnswer(mcQuestion, answer.selectedOptions || []);
      pointsEarned = calculatePointsEarned(currentQuestion, isCorrect);
    }

    const newAnswer: UserAnswer = {
      questionId,
      selectedOptions: answer.selectedOptions,
      code: answer.code,
      timeTaken: answer.timeTaken || 0,
      isCorrect,
      pointsEarned,
      feedback: isCorrect ? 'Correct!' : 'Incorrect',
    };

    setAttempt((prev) => {
      if (!prev) return prev;

      // Remove existing answer for this question if any
      const filteredAnswers = prev.answers.filter((a) => a.questionId !== questionId);
      const updatedAnswers = [...filteredAnswers, newAnswer];

      const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;
      const incorrectCount = updatedAnswers.filter((a) => !a.isCorrect).length;
      const totalPoints = updatedAnswers.reduce((sum, a) => sum + a.pointsEarned, 0);
      const score = calculateScore(totalPoints, assessment?.totalPoints || 100);

      return {
        ...prev,
        answers: updatedAnswers,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        pointsEarned: totalPoints,
        score,
      };
    });

    // Show instant feedback
    showToast({
      type: isCorrect ? 'success' : 'error',
      title: isCorrect ? '✓ Correct!' : '✗ Incorrect',
      message: isCorrect
        ? `Great job! You earned ${pointsEarned} points.`
        : `The correct answer has been recorded. Review the explanation after submission.`,
      duration: 3000,
    });

    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  }, [currentQuestion, attempt, assessment]);

  const nextQuestion = useCallback(() => {
    setAttempt((prev) => {
      if (!prev || !assessment) return prev;
      const nextIndex = Math.min(prev.currentQuestionIndex + 1, assessment.questions.length - 1);
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
      };
    });
  }, [assessment]);

  const previousQuestion = useCallback(() => {
    setAttempt((prev) => {
      if (!prev) return prev;
      const prevIndex = Math.max(prev.currentQuestionIndex - 1, 0);
      return {
        ...prev,
        currentQuestionIndex: prevIndex,
      };
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setAttempt((prev) => {
      if (!prev || !assessment) return prev;
      const validIndex = Math.max(0, Math.min(index, assessment.questions.length - 1));
      return {
        ...prev,
        currentQuestionIndex: validIndex,
      };
    });
  }, [assessment]);

  const submitAssessment = useCallback(async () => {
    setIsTimerRunning(false);
    setAttempt((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: AssessmentStatus.SUBMITTED,
        submittedAt: new Date(),
      };
    });

    showToast({
      type: 'info',
      title: 'Assessment Submitted',
      message: 'Your answers have been recorded. Review your results below.',
      duration: 4000,
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const showToast = useCallback((toast: Omit<FeedbackToast, 'id'>) => {
    const newToast: FeedbackToast = {
      ...toast,
      id: `toast-${Date.now()}`,
    };
    setFeedbackToast(newToast);

    if (toast.duration) {
      setTimeout(() => {
        setFeedbackToast(null);
      }, toast.duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setFeedbackToast(null);
  }, []);

  const runCode = useCallback(async (code: string): Promise<any[]> => {
    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock test results
    return [
      { id: 'tc1', input: 'test', expectedOutput: 'output', actualOutput: 'output', passed: true },
      { id: 'tc2', input: 'test2', expectedOutput: 'output2', actualOutput: 'output2', passed: true },
    ];
  }, []);

  const state: AssessmentState = {
    assessment,
    attempt,
    currentQuestion,
    isTimerRunning,
    showFeedback,
    feedbackToast,
    loading,
    error,
  };

  const actions: AssessmentActions = {
    loadAssessment,
    startAssessment,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitAssessment,
    pauseTimer,
    resumeTimer,
    showToast,
    hideToast,
    runCode,
  };

  return (
    <AssessmentContext.Provider value={{ state, actions }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
}
