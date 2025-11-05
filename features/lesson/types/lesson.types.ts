/**
 * Lesson Feature - Type Definitions
 * Individual lesson detail page with content, navigation, and progress tracking
 */

/**
 * Content types supported in lessons
 */
export enum ContentType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  CODE = 'CODE',
  INTERACTIVE = 'INTERACTIVE',
  QUIZ = 'QUIZ',
}

/**
 * Lesson completion status
 */
export enum LessonStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  LOCKED = 'LOCKED',
}

/**
 * Quiz question types
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  CODE_CHALLENGE = 'CODE_CHALLENGE',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

/**
 * Code block metadata
 */
export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
  highlightLines?: number[];
  isEditable?: boolean;
}

/**
 * Video metadata
 */
export interface VideoContent {
  url: string;
  duration: number; // in seconds
  thumbnail?: string;
  subtitles?: {
    language: string;
    url: string;
  }[];
  chapters?: {
    title: string;
    timestamp: number; // in seconds
  }[];
}

/**
 * Text content block
 */
export interface TextContent {
  markdown: string;
  estimatedReadTime?: number; // in minutes
}

/**
 * Quiz question
 */
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

/**
 * Quiz metadata
 */
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  timeLimit?: number; // in minutes
  attemptsAllowed: number;
  userAttempts?: QuizAttempt[];
}

/**
 * User's quiz attempt
 */
export interface QuizAttempt {
  id: string;
  quizId: string;
  attemptNumber: number;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  passed: boolean;
  answers: {
    questionId: string;
    userAnswer: string | string[];
    isCorrect: boolean;
  }[];
}

/**
 * Lesson content section
 */
export interface LessonSection {
  id: string;
  type: ContentType;
  title?: string;
  order: number;
  video?: VideoContent;
  text?: TextContent;
  code?: CodeBlock;
  quiz?: Quiz;
  estimatedTime?: number; // in minutes
}

/**
 * Individual lesson
 */
export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  status: LessonStatus;
  order: number;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sections: LessonSection[];
  objectives: string[];
  prerequisites?: string[];
  tags: string[];
  quiz?: Quiz;
  resources: {
    title: string;
    url: string;
    type: 'article' | 'documentation' | 'video' | 'github';
  }[];
  completedAt?: Date;
  lastAccessedAt?: Date;
  progress: number; // 0-100
}

/**
 * Learning module containing multiple lessons
 */
export interface LearningModule {
  id: string;
  pathId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0-100
  estimatedDuration: number; // total minutes
}

/**
 * User's lesson progress tracking
 */
export interface LessonProgress {
  lessonId: string;
  userId: string;
  status: LessonStatus;
  completionPercentage: number;
  currentSectionId?: string;
  videoProgress?: {
    sectionId: string;
    currentTime: number;
    duration: number;
  };
  sectionsCompleted: string[];
  quizAttempts: QuizAttempt[];
  timeSpent: number; // in seconds
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
  notes?: string;
  bookmarks?: {
    sectionId: string;
    timestamp?: number;
    note?: string;
  }[];
}

/**
 * Lesson navigation state
 */
export interface LessonNavigation {
  currentLesson: Lesson;
  previousLesson?: Lesson;
  nextLesson?: Lesson;
  module: LearningModule;
  allLessons: Lesson[];
}

/**
 * Context state
 */
export interface LessonState {
  currentLesson: Lesson | null;
  currentModule: LearningModule | null;
  navigation: LessonNavigation | null;
  progress: LessonProgress | null;
  currentSectionId: string | null;
  isPlaying: boolean;
  isSidebarOpen: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Context actions
 */
export interface LessonActions {
  loadLesson: (lessonId: string) => Promise<void>;
  setCurrentSection: (sectionId: string) => void;
  completeSection: (sectionId: string) => void;
  completeLesson: () => Promise<void>;
  navigateToLesson: (lessonId: string) => void;
  updateVideoProgress: (sectionId: string, currentTime: number) => void;
  submitQuiz: (quizId: string, answers: Record<string, string | string[]>) => Promise<QuizAttempt>;
  addBookmark: (sectionId: string, timestamp?: number, note?: string) => void;
  updateNotes: (notes: string) => void;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  togglePlay: () => void;
}

/**
 * Helper to get status color
 */
export const getStatusColor = (status: LessonStatus): string => {
  switch (status) {
    case LessonStatus.COMPLETED:
      return '#10B981'; // Green
    case LessonStatus.IN_PROGRESS:
      return '#6366F1'; // Indigo
    case LessonStatus.NOT_STARTED:
      return '#94A3B8'; // Gray
    case LessonStatus.LOCKED:
      return '#64748B'; // Darker gray
    default:
      return '#94A3B8';
  }
};

/**
 * Helper to get difficulty color
 */
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return '#10B981'; // Green
    case 'intermediate':
      return '#F59E0B'; // Amber
    case 'advanced':
      return '#EF4444'; // Red
    default:
      return '#94A3B8';
  }
};

/**
 * Helper to format duration
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Helper to format time (seconds to mm:ss)
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Helper to calculate quiz score
 */
export const calculateQuizScore = (attempt: QuizAttempt): number => {
  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
  return Math.round((correctAnswers / attempt.answers.length) * 100);
};
