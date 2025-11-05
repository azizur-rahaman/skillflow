/**
 * Learning Path Feature - Type Definitions
 * Personalized learning journey from current skills to future goals
 */

/**
 * Completion status for learning items
 */
export enum CompletionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  LOCKED = 'LOCKED',
}

/**
 * Difficulty levels
 */
export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

/**
 * Module types
 */
export enum ModuleType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  EXERCISE = 'EXERCISE',
  PROJECT = 'PROJECT',
  QUIZ = 'QUIZ',
  LIVE_SESSION = 'LIVE_SESSION',
}

/**
 * Individual learning module within a milestone
 */
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: ModuleType;
  duration: number; // in minutes
  status: CompletionStatus;
  completedAt?: Date;
  progress: number; // 0-100
  resources: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'documentation' | 'exercise';
  }[];
  skills: string[]; // Skills learned in this module
}

/**
 * Milestone (course or major checkpoint) in the learning path
 */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  status: CompletionStatus;
  progress: number; // 0-100
  estimatedDuration: number; // in hours
  actualDuration?: number; // in hours
  modules: LearningModule[];
  skills: string[]; // Skills gained
  prerequisites: string[]; // IDs of required milestones
  startedAt?: Date;
  completedAt?: Date;
  certificate?: {
    issued: boolean;
    url?: string;
    issuedAt?: Date;
  };
  icon?: string;
  color?: string;
}

/**
 * Complete learning path (journey)
 */
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  currentSkills: string[];
  targetSkills: string[];
  targetRole?: string;
  milestones: Milestone[];
  overallProgress: number; // 0-100
  estimatedCompletionDate: Date;
  startedAt: Date;
  completedAt?: Date;
  createdBy: 'user' | 'ai' | 'recommendation';
  lastUpdated: Date;
}

/**
 * User's overall learning journey stats
 */
export interface LearningJourneyStats {
  totalPaths: number;
  activePaths: number;
  completedPaths: number;
  totalMilestones: number;
  completedMilestones: number;
  inProgressMilestones: number;
  totalLearningHours: number;
  currentStreak: number; // days
  longestStreak: number; // days
  certificatesEarned: number;
  skillsAcquired: number;
}

/**
 * Next recommended action
 */
export interface NextAction {
  type: 'module' | 'milestone' | 'quiz' | 'project';
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // minutes
  pathId: string;
  milestoneId: string;
  moduleId?: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Learning path filters
 */
export interface LearningPathFilters {
  status?: CompletionStatus[];
  difficulty?: DifficultyLevel[];
  searchQuery?: string;
  sortBy?: 'progress' | 'startedAt' | 'estimatedCompletion' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Context state
 */
export interface LearningPathState {
  paths: LearningPath[];
  activePath: LearningPath | null;
  selectedMilestone: Milestone | null;
  stats: LearningJourneyStats;
  nextActions: NextAction[];
  filters: LearningPathFilters;
  isLoading: boolean;
  error: string | null;
}

/**
 * Context actions
 */
export interface LearningPathActions {
  selectPath: (path: LearningPath) => void;
  selectMilestone: (milestone: Milestone | null) => void;
  startMilestone: (pathId: string, milestoneId: string) => Promise<void>;
  completeMilestone: (pathId: string, milestoneId: string) => Promise<void>;
  startModule: (pathId: string, milestoneId: string, moduleId: string) => Promise<void>;
  completeModule: (pathId: string, milestoneId: string, moduleId: string) => Promise<void>;
  updateProgress: (pathId: string, milestoneId: string, moduleId: string, progress: number) => Promise<void>;
  updateFilters: (filters: Partial<LearningPathFilters>) => void;
  refreshData: () => Promise<void>;
}

/**
 * Helper to get status color
 */
export const getStatusColor = (status: CompletionStatus): string => {
  switch (status) {
    case CompletionStatus.COMPLETED:
      return '#10B981'; // Green
    case CompletionStatus.IN_PROGRESS:
      return '#6366F1'; // Indigo
    case CompletionStatus.NOT_STARTED:
      return '#94A3B8'; // Gray
    case CompletionStatus.LOCKED:
      return '#64748B'; // Darker gray
    default:
      return '#94A3B8';
  }
};

/**
 * Helper to get difficulty color
 */
export const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  switch (difficulty) {
    case DifficultyLevel.BEGINNER:
      return '#10B981'; // Green
    case DifficultyLevel.INTERMEDIATE:
      return '#F59E0B'; // Amber
    case DifficultyLevel.ADVANCED:
      return '#F97316'; // Orange
    case DifficultyLevel.EXPERT:
      return '#EF4444'; // Red
    default:
      return '#94A3B8';
  }
};

/**
 * Helper to get module type icon name
 */
export const getModuleTypeIcon = (type: ModuleType): string => {
  switch (type) {
    case ModuleType.VIDEO:
      return 'PlayCircle';
    case ModuleType.ARTICLE:
      return 'FileText';
    case ModuleType.EXERCISE:
      return 'Code';
    case ModuleType.PROJECT:
      return 'Briefcase';
    case ModuleType.QUIZ:
      return 'CheckSquare';
    case ModuleType.LIVE_SESSION:
      return 'Video';
    default:
      return 'Book';
  }
};

/**
 * Helper to calculate completion percentage
 */
export const calculatePathProgress = (path: LearningPath): number => {
  if (path.milestones.length === 0) return 0;
  
  const totalProgress = path.milestones.reduce((sum, milestone) => sum + milestone.progress, 0);
  return Math.round(totalProgress / path.milestones.length);
};

/**
 * Helper to get next milestone
 */
export const getNextMilestone = (path: LearningPath): Milestone | null => {
  return path.milestones.find(
    m => m.status === CompletionStatus.NOT_STARTED || m.status === CompletionStatus.IN_PROGRESS
  ) || null;
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
