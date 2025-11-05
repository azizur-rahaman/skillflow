'use client';

/**
 * Learning Path Context
 * Manages personalized learning journey state and actions
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  LearningPath,
  Milestone,
  LearningPathState,
  LearningPathActions,
  LearningPathFilters,
  LearningJourneyStats,
  NextAction,
} from '../types/learning-path.types';
import {
  CompletionStatus,
  DifficultyLevel,
  ModuleType,
} from '../types/learning-path.types';

// Mock data for demonstration
const mockLearningPath: LearningPath = {
  id: 'path-1',
  title: 'Full Stack Developer Journey',
  description: 'Transform from frontend developer to full-stack engineer',
  currentSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
  targetSkills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS'],
  targetRole: 'Senior Full Stack Developer',
  overallProgress: 45,
  startedAt: new Date('2025-09-01'),
  estimatedCompletionDate: new Date('2026-03-01'),
  createdBy: 'ai',
  lastUpdated: new Date('2025-11-05'),
  milestones: [
    {
      id: 'milestone-1',
      title: 'React Advanced Patterns',
      description: 'Master advanced React concepts and patterns',
      difficulty: DifficultyLevel.INTERMEDIATE,
      status: CompletionStatus.COMPLETED,
      progress: 100,
      estimatedDuration: 20,
      actualDuration: 18,
      skills: ['React Hooks', 'Context API', 'Performance Optimization'],
      prerequisites: [],
      startedAt: new Date('2025-09-01'),
      completedAt: new Date('2025-09-20'),
      certificate: {
        issued: true,
        url: '/certificates/react-advanced',
        issuedAt: new Date('2025-09-20'),
      },
      icon: 'react',
      color: '#61DAFB',
      modules: [],
    },
    {
      id: 'milestone-2',
      title: 'TypeScript Fundamentals',
      description: 'Learn TypeScript for type-safe development',
      difficulty: DifficultyLevel.INTERMEDIATE,
      status: CompletionStatus.COMPLETED,
      progress: 100,
      estimatedDuration: 15,
      actualDuration: 14,
      skills: ['TypeScript', 'Type System', 'Generics'],
      prerequisites: ['milestone-1'],
      startedAt: new Date('2025-09-21'),
      completedAt: new Date('2025-10-05'),
      certificate: {
        issued: true,
        url: '/certificates/typescript',
        issuedAt: new Date('2025-10-05'),
      },
      icon: 'code',
      color: '#3178C6',
      modules: [],
    },
    {
      id: 'milestone-3',
      title: 'Node.js & Express',
      description: 'Build RESTful APIs with Node.js and Express',
      difficulty: DifficultyLevel.INTERMEDIATE,
      status: CompletionStatus.IN_PROGRESS,
      progress: 60,
      estimatedDuration: 25,
      skills: ['Node.js', 'Express', 'REST API', 'Middleware'],
      prerequisites: ['milestone-2'],
      startedAt: new Date('2025-10-06'),
      icon: 'server',
      color: '#68A063',
      modules: [
        {
          id: 'module-1',
          title: 'Node.js Basics',
          description: 'Introduction to Node.js runtime',
          type: ModuleType.VIDEO,
          duration: 120,
          status: CompletionStatus.COMPLETED,
          completedAt: new Date('2025-10-08'),
          progress: 100,
          skills: ['Node.js', 'Event Loop'],
          resources: [
            { title: 'Node.js Official Docs', url: '#', type: 'documentation' },
            { title: 'Node.js Tutorial', url: '#', type: 'video' },
          ],
        },
        {
          id: 'module-2',
          title: 'Express Framework',
          description: 'Build web applications with Express',
          type: ModuleType.VIDEO,
          duration: 180,
          status: CompletionStatus.COMPLETED,
          completedAt: new Date('2025-10-15'),
          progress: 100,
          skills: ['Express', 'Routing', 'Middleware'],
          resources: [
            { title: 'Express Guide', url: '#', type: 'article' },
            { title: 'Building REST APIs', url: '#', type: 'video' },
          ],
        },
        {
          id: 'module-3',
          title: 'REST API Design',
          description: 'Learn RESTful API best practices',
          type: ModuleType.ARTICLE,
          duration: 90,
          status: CompletionStatus.IN_PROGRESS,
          progress: 70,
          skills: ['REST', 'API Design'],
          resources: [
            { title: 'REST API Tutorial', url: '#', type: 'article' },
            { title: 'API Best Practices', url: '#', type: 'documentation' },
          ],
        },
        {
          id: 'module-4',
          title: 'Build a Blog API',
          description: 'Hands-on project building a blog API',
          type: ModuleType.PROJECT,
          duration: 240,
          status: CompletionStatus.NOT_STARTED,
          progress: 0,
          skills: ['Express', 'MongoDB', 'Authentication'],
          resources: [
            { title: 'Project Starter', url: '#', type: 'exercise' },
          ],
        },
      ],
    },
    {
      id: 'milestone-4',
      title: 'Database Design & PostgreSQL',
      description: 'Master relational databases and SQL',
      difficulty: DifficultyLevel.INTERMEDIATE,
      status: CompletionStatus.NOT_STARTED,
      progress: 0,
      estimatedDuration: 20,
      skills: ['PostgreSQL', 'SQL', 'Database Design'],
      prerequisites: ['milestone-3'],
      icon: 'database',
      color: '#336791',
      modules: [],
    },
    {
      id: 'milestone-5',
      title: 'Authentication & Security',
      description: 'Implement secure authentication systems',
      difficulty: DifficultyLevel.ADVANCED,
      status: CompletionStatus.LOCKED,
      progress: 0,
      estimatedDuration: 18,
      skills: ['JWT', 'OAuth', 'Security Best Practices'],
      prerequisites: ['milestone-4'],
      icon: 'shield',
      color: '#EF4444',
      modules: [],
    },
    {
      id: 'milestone-6',
      title: 'Docker & Deployment',
      description: 'Containerize and deploy applications',
      difficulty: DifficultyLevel.ADVANCED,
      status: CompletionStatus.LOCKED,
      progress: 0,
      estimatedDuration: 22,
      skills: ['Docker', 'CI/CD', 'AWS'],
      prerequisites: ['milestone-5'],
      icon: 'package',
      color: '#2496ED',
      modules: [],
    },
  ],
};

const mockStats: LearningJourneyStats = {
  totalPaths: 3,
  activePaths: 1,
  completedPaths: 1,
  totalMilestones: 6,
  completedMilestones: 2,
  inProgressMilestones: 1,
  totalLearningHours: 52,
  currentStreak: 12,
  longestStreak: 28,
  certificatesEarned: 2,
  skillsAcquired: 8,
};

const mockNextActions: NextAction[] = [
  {
    type: 'module',
    id: 'module-3',
    title: 'Complete REST API Design',
    description: 'Finish learning REST API best practices',
    estimatedTime: 25,
    pathId: 'path-1',
    milestoneId: 'milestone-3',
    moduleId: 'module-3',
    priority: 'high',
  },
  {
    type: 'project',
    id: 'module-4',
    title: 'Build Blog API Project',
    description: 'Apply your Node.js & Express skills',
    estimatedTime: 240,
    pathId: 'path-1',
    milestoneId: 'milestone-3',
    moduleId: 'module-4',
    priority: 'high',
  },
];

interface LearningPathContextValue {
  state: LearningPathState;
  actions: LearningPathActions;
}

const LearningPathContext = createContext<LearningPathContextValue | null>(null);

export function LearningPathProvider({ children }: { children: React.ReactNode }) {
  const [paths] = useState<LearningPath[]>([mockLearningPath]);
  const [activePath, setActivePath] = useState<LearningPath | null>(mockLearningPath);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [stats] = useState<LearningJourneyStats>(mockStats);
  const [nextActions] = useState<NextAction[]>(mockNextActions);
  const [filters, setFilters] = useState<LearningPathFilters>({
    sortBy: 'progress',
    sortOrder: 'desc',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectPath = useCallback((path: LearningPath) => {
    setActivePath(path);
    setSelectedMilestone(null);
  }, []);

  const selectMilestone = useCallback((milestone: Milestone | null) => {
    setSelectedMilestone(milestone);
  }, []);

  const startMilestone = useCallback(async (pathId: string, milestoneId: string) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log('Starting milestone:', pathId, milestoneId);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to start milestone');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeMilestone = useCallback(async (pathId: string, milestoneId: string) => {
    setIsLoading(true);
    try {
      console.log('Completing milestone:', pathId, milestoneId);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to complete milestone');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startModule = useCallback(async (pathId: string, milestoneId: string, moduleId: string) => {
    setIsLoading(true);
    try {
      console.log('Starting module:', pathId, milestoneId, moduleId);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to start module');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeModule = useCallback(async (pathId: string, milestoneId: string, moduleId: string) => {
    setIsLoading(true);
    try {
      console.log('Completing module:', pathId, milestoneId, moduleId);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to complete module');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (
    pathId: string,
    milestoneId: string,
    moduleId: string,
    progress: number
  ) => {
    console.log('Updating progress:', pathId, milestoneId, moduleId, progress);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<LearningPathFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const state: LearningPathState = {
    paths,
    activePath,
    selectedMilestone,
    stats,
    nextActions,
    filters,
    isLoading,
    error,
  };

  const actions: LearningPathActions = {
    selectPath,
    selectMilestone,
    startMilestone,
    completeMilestone,
    startModule,
    completeModule,
    updateProgress,
    updateFilters,
    refreshData,
  };

  return (
    <LearningPathContext.Provider value={{ state, actions }}>
      {children}
    </LearningPathContext.Provider>
  );
}

export function useLearningPath() {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error('useLearningPath must be used within LearningPathProvider');
  }
  return context;
}
