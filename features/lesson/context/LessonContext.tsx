'use client';

/**
 * Lesson Context
 * Manages lesson viewing state, progress tracking, and navigation
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  Lesson,
  LearningModule,
  LessonProgress,
  LessonNavigation,
  LessonState,
  LessonActions,
  QuizAttempt,
} from '../types/lesson.types';
import {
  LessonStatus,
  ContentType,
  QuestionType,
} from '../types/lesson.types';

// Mock data for demonstration
const mockModule: LearningModule = {
  id: 'module-1',
  pathId: 'path-1',
  title: 'Node.js & Express Fundamentals',
  description: 'Build RESTful APIs with Node.js and Express',
  icon: 'server',
  color: '#68A063',
  totalLessons: 5,
  completedLessons: 2,
  progress: 40,
  estimatedDuration: 300,
  lessons: [
    {
      id: 'lesson-1',
      moduleId: 'module-1',
      title: 'Introduction to Node.js',
      description: 'Understanding the Node.js runtime and event loop',
      status: LessonStatus.COMPLETED,
      order: 1,
      duration: 45,
      difficulty: 'beginner',
      objectives: [
        'Understand what Node.js is and how it works',
        'Learn about the event loop and asynchronous programming',
        'Set up a Node.js development environment',
      ],
      tags: ['nodejs', 'javascript', 'backend'],
      progress: 100,
      completedAt: new Date('2025-11-01'),
      lastAccessedAt: new Date('2025-11-01'),
      sections: [],
      resources: [],
    },
    {
      id: 'lesson-2',
      moduleId: 'module-1',
      title: 'Working with Express Framework',
      description: 'Build your first Express server and understand middleware',
      status: LessonStatus.COMPLETED,
      order: 2,
      duration: 60,
      difficulty: 'beginner',
      objectives: [
        'Create an Express application',
        'Understand routing and middleware',
        'Handle HTTP requests and responses',
      ],
      tags: ['express', 'nodejs', 'middleware'],
      progress: 100,
      completedAt: new Date('2025-11-03'),
      lastAccessedAt: new Date('2025-11-03'),
      sections: [],
      resources: [],
    },
    {
      id: 'lesson-3',
      moduleId: 'module-1',
      title: 'RESTful API Design Principles',
      description: 'Learn REST architecture and design patterns',
      status: LessonStatus.IN_PROGRESS,
      order: 3,
      duration: 75,
      difficulty: 'intermediate',
      objectives: [
        'Understand REST architectural constraints',
        'Design resource-oriented APIs',
        'Implement proper HTTP methods and status codes',
        'Version your APIs effectively',
      ],
      tags: ['rest', 'api-design', 'architecture'],
      progress: 65,
      lastAccessedAt: new Date('2025-11-05'),
      sections: [
        {
          id: 'section-1',
          type: ContentType.VIDEO,
          title: 'What is REST?',
          order: 1,
          estimatedTime: 12,
          video: {
            url: 'https://example.com/videos/rest-intro.mp4',
            duration: 720,
            thumbnail: 'https://example.com/thumbnails/rest-intro.jpg',
            chapters: [
              { title: 'Introduction', timestamp: 0 },
              { title: 'REST Principles', timestamp: 180 },
              { title: 'Real-world Examples', timestamp: 420 },
            ],
          },
        },
        {
          id: 'section-2',
          type: ContentType.TEXT,
          title: 'REST Architectural Constraints',
          order: 2,
          estimatedTime: 15,
          text: {
            markdown: `# REST Architectural Constraints

REST (Representational State Transfer) is an architectural style that defines a set of constraints for creating web services.

## The Six Constraints

### 1. Client-Server Architecture
The client and server are separated, allowing them to evolve independently.

### 2. Stateless
Each request from client to server must contain all information needed to understand the request.

### 3. Cacheable
Responses must define themselves as cacheable or non-cacheable.

### 4. Uniform Interface
The interface between components is standardized, simplifying the overall architecture.

### 5. Layered System
A client cannot tell whether it's connected directly to the server or an intermediary.

### 6. Code on Demand (Optional)
Servers can extend client functionality by transferring executable code.

## Why REST?

- **Scalability**: Stateless nature allows easy scaling
- **Simplicity**: Uses standard HTTP methods
- **Performance**: Caching support improves efficiency
- **Flexibility**: Separation of concerns allows independent evolution`,
            estimatedReadTime: 15,
          },
        },
        {
          id: 'section-3',
          type: ContentType.CODE,
          title: 'REST API Example',
          order: 3,
          estimatedTime: 10,
          code: {
            language: 'javascript',
            filename: 'server.js',
            code: `const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// In-memory data store
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET /users - Retrieve all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// GET /users/:id - Retrieve specific user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// POST /users - Create new user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id - Update user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json(user);
});

// DELETE /users/:id - Delete user
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => console.log('Server running on port 3000'));`,
            highlightLines: [7, 8, 13, 14, 20, 21, 27, 28, 37, 38, 46, 47],
          },
        },
        {
          id: 'section-4',
          type: ContentType.TEXT,
          title: 'HTTP Methods and Status Codes',
          order: 4,
          estimatedTime: 10,
          text: {
            markdown: `# HTTP Methods and Status Codes

## Common HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|-----------|------|
| GET | Retrieve resource | ✅ | ✅ |
| POST | Create resource | ❌ | ❌ |
| PUT | Update/Replace resource | ✅ | ❌ |
| PATCH | Partial update | ❌ | ❌ |
| DELETE | Remove resource | ✅ | ❌ |

## HTTP Status Codes

### 2xx Success
- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **204 No Content**: Success, no content to return

### 4xx Client Errors
- **400 Bad Request**: Invalid request syntax
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: No permission
- **404 Not Found**: Resource doesn't exist
- **422 Unprocessable Entity**: Validation failed

### 5xx Server Errors
- **500 Internal Server Error**: Server-side error
- **502 Bad Gateway**: Invalid upstream response
- **503 Service Unavailable**: Server temporarily unavailable`,
            estimatedReadTime: 10,
          },
        },
      ],
      quiz: {
        id: 'quiz-1',
        title: 'REST API Fundamentals Quiz',
        description: 'Test your understanding of REST principles and API design',
        passingScore: 70,
        timeLimit: 15,
        attemptsAllowed: 3,
        questions: [
          {
            id: 'q1',
            type: QuestionType.MULTIPLE_CHOICE,
            question: 'Which HTTP method is idempotent and safe?',
            options: ['GET', 'POST', 'PUT', 'DELETE'],
            correctAnswer: 'GET',
            explanation: 'GET is both idempotent (same result on repeated calls) and safe (no side effects).',
            points: 10,
          },
          {
            id: 'q2',
            type: QuestionType.MULTIPLE_CHOICE,
            question: 'What HTTP status code indicates a resource was successfully created?',
            options: ['200', '201', '204', '404'],
            correctAnswer: '201',
            explanation: '201 Created indicates that a new resource has been successfully created.',
            points: 10,
          },
          {
            id: 'q3',
            type: QuestionType.TRUE_FALSE,
            question: 'In REST architecture, each request must be stateless.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'Statelessness is one of the core constraints of REST architecture.',
            points: 10,
          },
        ],
      },
      resources: [
        {
          title: 'REST API Tutorial',
          url: 'https://restfulapi.net/',
          type: 'documentation',
        },
        {
          title: 'HTTP Status Codes Reference',
          url: 'https://httpstatuses.com/',
          type: 'documentation',
        },
        {
          title: 'Express.js Documentation',
          url: 'https://expressjs.com/',
          type: 'documentation',
        },
      ],
    },
    {
      id: 'lesson-4',
      moduleId: 'module-1',
      title: 'Database Integration with MongoDB',
      description: 'Connect Express with MongoDB and build CRUD operations',
      status: LessonStatus.NOT_STARTED,
      order: 4,
      duration: 90,
      difficulty: 'intermediate',
      objectives: [
        'Set up MongoDB connection',
        'Create database models with Mongoose',
        'Implement CRUD operations',
      ],
      tags: ['mongodb', 'mongoose', 'database'],
      progress: 0,
      sections: [],
      resources: [],
    },
    {
      id: 'lesson-5',
      moduleId: 'module-1',
      title: 'Authentication & Authorization',
      description: 'Implement JWT-based authentication in Express',
      status: LessonStatus.LOCKED,
      order: 5,
      duration: 80,
      difficulty: 'advanced',
      objectives: [
        'Understand authentication vs authorization',
        'Implement JWT token generation and validation',
        'Protect routes with middleware',
      ],
      tags: ['jwt', 'authentication', 'security'],
      progress: 0,
      sections: [],
      resources: [],
    },
  ],
};

const mockProgress: LessonProgress = {
  lessonId: 'lesson-3',
  userId: 'user-1',
  status: LessonStatus.IN_PROGRESS,
  completionPercentage: 65,
  currentSectionId: 'section-3',
  sectionsCompleted: ['section-1', 'section-2'],
  quizAttempts: [],
  timeSpent: 1800,
  startedAt: new Date('2025-11-05T10:00:00'),
  lastAccessedAt: new Date('2025-11-05T14:30:00'),
  bookmarks: [
    {
      sectionId: 'section-1',
      timestamp: 420,
      note: 'Important: REST principles explained here',
    },
  ],
};

interface LessonContextValue {
  state: LessonState;
  actions: LessonActions;
}

const LessonContext = createContext<LessonContextValue | null>(null);

export function LessonProvider({ children }: { children: React.ReactNode }) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(mockModule.lessons[2]);
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(mockModule);
  const [progress, setProgress] = useState<LessonProgress | null>(mockProgress);
  const [currentSectionId, setCurrentSectionId] = useState<string | null>('section-1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation: LessonNavigation | null = currentLesson && currentModule ? {
    currentLesson,
    previousLesson: currentModule.lessons.find(l => l.order === currentLesson.order - 1),
    nextLesson: currentModule.lessons.find(l => l.order === currentLesson.order + 1),
    module: currentModule,
    allLessons: currentModule.lessons,
  } : null;

  const loadLesson = useCallback(async (lessonId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const lesson = mockModule.lessons.find(l => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setCurrentSectionId(lesson.sections[0]?.id || null);
      }
    } catch (err) {
      setError('Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setCurrentSection = useCallback((sectionId: string) => {
    setCurrentSectionId(sectionId);
  }, []);

  const completeSection = useCallback((sectionId: string) => {
    setProgress(prev => {
      if (!prev) return prev;
      const sectionsCompleted = [...prev.sectionsCompleted];
      if (!sectionsCompleted.includes(sectionId)) {
        sectionsCompleted.push(sectionId);
      }
      const completionPercentage = currentLesson 
        ? Math.round((sectionsCompleted.length / currentLesson.sections.length) * 100)
        : prev.completionPercentage;
      
      return {
        ...prev,
        sectionsCompleted,
        completionPercentage,
        lastAccessedAt: new Date(),
      };
    });
  }, [currentLesson]);

  const completeLesson = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(prev => prev ? {
        ...prev,
        status: LessonStatus.COMPLETED,
        completionPercentage: 100,
        completedAt: new Date(),
      } : null);
      console.log('Lesson completed!');
    } catch (err) {
      setError('Failed to complete lesson');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const navigateToLesson = useCallback((lessonId: string) => {
    loadLesson(lessonId);
  }, [loadLesson]);

  const updateVideoProgress = useCallback((sectionId: string, currentTime: number) => {
    setProgress(prev => {
      if (!prev) return prev;
      const section = currentLesson?.sections.find(s => s.id === sectionId);
      if (!section?.video) return prev;

      return {
        ...prev,
        videoProgress: {
          sectionId,
          currentTime,
          duration: section.video.duration,
        },
        lastAccessedAt: new Date(),
      };
    });
  }, [currentLesson]);

  const submitQuiz = useCallback(async (
    quizId: string,
    answers: Record<string, string | string[]>
  ): Promise<QuizAttempt> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const quiz = currentLesson?.quiz;
      if (!quiz) throw new Error('Quiz not found');

      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        quizId,
        attemptNumber: (progress?.quizAttempts.length || 0) + 1,
        startedAt: new Date(),
        completedAt: new Date(),
        score: 0,
        passed: false,
        answers: quiz.questions.map(q => {
          const userAnswer = answers[q.id];
          const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer);
          return {
            questionId: q.id,
            userAnswer,
            isCorrect,
          };
        }),
      };

      const correctCount = attempt.answers.filter(a => a.isCorrect).length;
      attempt.score = Math.round((correctCount / quiz.questions.length) * 100);
      attempt.passed = attempt.score >= quiz.passingScore;

      setProgress(prev => prev ? {
        ...prev,
        quizAttempts: [...prev.quizAttempts, attempt],
      } : null);

      return attempt;
    } catch (err) {
      setError('Failed to submit quiz');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentLesson, progress]);

  const addBookmark = useCallback((sectionId: string, timestamp?: number, note?: string) => {
    setProgress(prev => {
      if (!prev) return prev;
      const bookmarks = prev.bookmarks || [];
      bookmarks.push({ sectionId, timestamp, note });
      return { ...prev, bookmarks };
    });
  }, []);

  const updateNotes = useCallback((notes: string) => {
    setProgress(prev => prev ? { ...prev, notes } : null);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const state: LessonState = {
    currentLesson,
    currentModule,
    navigation,
    progress,
    currentSectionId,
    isPlaying,
    isSidebarOpen,
    isFullscreen,
    isLoading,
    error,
  };

  const actions: LessonActions = {
    loadLesson,
    setCurrentSection,
    completeSection,
    completeLesson,
    navigateToLesson,
    updateVideoProgress,
    submitQuiz,
    addBookmark,
    updateNotes,
    toggleSidebar,
    toggleFullscreen,
    togglePlay,
  };

  return (
    <LessonContext.Provider value={{ state, actions }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within LessonProvider');
  }
  return context;
}
