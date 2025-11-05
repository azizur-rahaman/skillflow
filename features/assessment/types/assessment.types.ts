/**
 * Type definitions for skill assessment system
 * Supports multiple-choice quizzes and coding tasks
 */

/**
 * Assessment types
 */
export enum AssessmentType {
  MULTIPLE_CHOICE = 'multiple-choice',
  CODING_TASK = 'coding-task',
  MIXED = 'mixed',
}

/**
 * Question difficulty levels
 */
export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

/**
 * Question types
 */
export enum QuestionType {
  SINGLE_CHOICE = 'single-choice', // Radio buttons
  MULTIPLE_CHOICE = 'multiple-choice', // Checkboxes
  CODING = 'coding', // Code editor
  TRUE_FALSE = 'true-false',
}

/**
 * Assessment status
 */
export enum AssessmentStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  SUBMITTED = 'submitted',
  COMPLETED = 'completed',
  TIME_EXPIRED = 'time-expired',
}

/**
 * Answer option for multiple choice
 */
export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

/**
 * Test case for coding tasks
 */
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  isHidden?: boolean; // Hidden test cases not shown to user
}

/**
 * Multiple choice question
 */
export interface MultipleChoiceQuestion {
  id: string;
  type: QuestionType.SINGLE_CHOICE | QuestionType.MULTIPLE_CHOICE | QuestionType.TRUE_FALSE;
  title: string;
  description?: string;
  code?: string; // Code snippet to analyze
  options: AnswerOption[];
  points: number;
  difficulty: QuestionDifficulty;
  tags: string[];
  timeLimit?: number; // seconds for this question
  explanation?: string; // Shown after submission
}

/**
 * Coding task question
 */
export interface CodingQuestion {
  id: string;
  type: QuestionType.CODING;
  title: string;
  description: string;
  starterCode: string;
  language: 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';
  testCases: TestCase[];
  points: number;
  difficulty: QuestionDifficulty;
  tags: string[];
  timeLimit?: number;
  hints?: string[];
  constraints?: string[];
}

/**
 * Union type for all question types
 */
export type Question = MultipleChoiceQuestion | CodingQuestion;

/**
 * User's answer to a question
 */
export interface UserAnswer {
  questionId: string;
  selectedOptions?: string[]; // For multiple choice
  code?: string; // For coding tasks
  timeTaken: number; // seconds
  isCorrect: boolean;
  pointsEarned: number;
  feedback?: string;
}

/**
 * Complete assessment
 */
export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  skillTag: string; // e.g., "JavaScript", "React", "Python"
  difficulty: QuestionDifficulty;
  totalQuestions: number;
  totalPoints: number;
  passingScore: number; // percentage
  timeLimit: number; // total time in seconds
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Assessment attempt/session
 */
export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  status: AssessmentStatus;
  startedAt: Date;
  submittedAt?: Date;
  timeRemaining: number; // seconds
  currentQuestionIndex: number;
  answers: UserAnswer[];
  score: number; // percentage
  pointsEarned: number;
  totalPoints: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
}

/**
 * Feedback toast data
 */
export interface FeedbackToast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number; // milliseconds
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Context state
 */
export interface AssessmentState {
  assessment: Assessment | null;
  attempt: AssessmentAttempt | null;
  currentQuestion: Question | null;
  isTimerRunning: boolean;
  showFeedback: boolean;
  feedbackToast: FeedbackToast | null;
  loading: boolean;
  error: string | null;
}

/**
 * Context actions
 */
export interface AssessmentActions {
  loadAssessment: (assessmentId: string) => Promise<void>;
  startAssessment: () => void;
  submitAnswer: (answer: Partial<UserAnswer>) => Promise<void>;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitAssessment: () => Promise<void>;
  pauseTimer: () => void;
  resumeTimer: () => void;
  showToast: (toast: Omit<FeedbackToast, 'id'>) => void;
  hideToast: () => void;
  runCode: (code: string) => Promise<TestCase[]>;
}

/**
 * Helper: Get difficulty color
 */
export const getDifficultyColor = (difficulty: QuestionDifficulty): string => {
  const colors: Record<QuestionDifficulty, string> = {
    [QuestionDifficulty.EASY]: '#10B981',
    [QuestionDifficulty.MEDIUM]: '#F59E0B',
    [QuestionDifficulty.HARD]: '#EF4444',
  };
  return colors[difficulty];
};

/**
 * Helper: Get difficulty label
 */
export const getDifficultyLabel = (difficulty: QuestionDifficulty): string => {
  const labels: Record<QuestionDifficulty, string> = {
    [QuestionDifficulty.EASY]: 'Easy',
    [QuestionDifficulty.MEDIUM]: 'Medium',
    [QuestionDifficulty.HARD]: 'Hard',
  };
  return labels[difficulty];
};

/**
 * Helper: Format time MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Helper: Calculate score percentage
 */
export const calculateScore = (pointsEarned: number, totalPoints: number): number => {
  if (totalPoints === 0) return 0;
  return Math.round((pointsEarned / totalPoints) * 100);
};

/**
 * Helper: Check if question is answered
 */
export const isQuestionAnswered = (
  questionId: string,
  answers: UserAnswer[]
): boolean => {
  return answers.some((a) => a.questionId === questionId);
};

/**
 * Helper: Get user answer for question
 */
export const getUserAnswer = (
  questionId: string,
  answers: UserAnswer[]
): UserAnswer | undefined => {
  return answers.find((a) => a.questionId === questionId);
};

/**
 * Helper: Check if multiple choice answer is correct
 */
export const checkMultipleChoiceAnswer = (
  question: MultipleChoiceQuestion,
  selectedOptions: string[]
): boolean => {
  const correctOptions = question.options.filter((o) => o.isCorrect).map((o) => o.id);
  
  if (correctOptions.length !== selectedOptions.length) return false;
  
  return correctOptions.every((id) => selectedOptions.includes(id)) &&
    selectedOptions.every((id) => correctOptions.includes(id));
};

/**
 * Helper: Check if coding answer is correct
 */
export const checkCodingAnswer = (testCases: TestCase[]): boolean => {
  return testCases.every((tc) => tc.passed);
};

/**
 * Helper: Calculate points earned
 */
export const calculatePointsEarned = (
  question: Question,
  isCorrect: boolean
): number => {
  return isCorrect ? question.points : 0;
};

/**
 * Helper: Get grade from score
 */
export const getGrade = (score: number): { label: string; color: string } => {
  if (score >= 90) return { label: 'A+', color: '#10B981' };
  if (score >= 80) return { label: 'A', color: '#10B981' };
  if (score >= 70) return { label: 'B', color: '#22D3EE' };
  if (score >= 60) return { label: 'C', color: '#F59E0B' };
  if (score >= 50) return { label: 'D', color: '#F59E0B' };
  return { label: 'F', color: '#EF4444' };
};

/**
 * Helper: Check if passed
 */
export const hasPassed = (score: number, passingScore: number): boolean => {
  return score >= passingScore;
};

/**
 * Helper: Get question type icon
 */
export const getQuestionTypeLabel = (type: QuestionType): string => {
  const labels: Record<QuestionType, string> = {
    [QuestionType.SINGLE_CHOICE]: 'Single Choice',
    [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
    [QuestionType.CODING]: 'Coding Challenge',
    [QuestionType.TRUE_FALSE]: 'True/False',
  };
  return labels[type];
};

/**
 * Helper: Get time warning threshold
 */
export const getTimeWarning = (timeRemaining: number, totalTime: number): {
  level: 'normal' | 'warning' | 'danger';
  color: string;
} => {
  const percentage = (timeRemaining / totalTime) * 100;
  
  if (percentage > 25) {
    return { level: 'normal', color: '#22D3EE' };
  } else if (percentage > 10) {
    return { level: 'warning', color: '#F59E0B' };
  } else {
    return { level: 'danger', color: '#EF4444' };
  }
};
