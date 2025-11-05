'use client';

/**
 * Integrated Course Context
 * Manages state for third-party course player (Coursera, LinkedIn Learning)
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  IntegratedCourse,
  CourseProgress,
  CourseSection,
  CourseNote,
  PlayerState,
  PlayerSettings,
  IntegratedCourseState,
  IntegratedCourseActions,
  CoursePlatform,
  TranscriptSegment,
  calculateCourseProgress,
} from '../types/integrated-course.types';

/**
 * Mock data: Coursera Node.js course with transcript
 */
const mockCourse: IntegratedCourse = {
  id: 'course-1',
  platform: CoursePlatform.COURSERA,
  externalId: 'server-side-javascript-nodejs',
  title: 'Server-side Development with NodeJS, Express and MongoDB',
  description:
    'Learn to build server-side applications using Node.js, Express framework, and MongoDB. Master RESTful APIs, authentication, and deployment.',
  instructor: {
    name: 'Dr. Jogesh K. Muppala',
    title: 'Associate Professor, Hong Kong University',
    imageUrl: '/instructors/jogesh-muppala.jpg',
  },
  thumbnailUrl: '/courses/nodejs-course-thumb.jpg',
  totalDuration: 14400, // 4 hours
  sections: [
    {
      id: 'section-1',
      title: 'Introduction to Node.js',
      description: 'Understanding Node.js runtime and its architecture',
      duration: 720, // 12 minutes
      order: 1,
      videoUrl: 'https://www.coursera.org/lecture/nodejs-intro',
      thumbnailUrl: '/sections/nodejs-intro.jpg',
      isCompleted: true,
      completedAt: new Date('2025-11-04T10:30:00'),
      transcript: [
        {
          id: 'ts-1-1',
          startTime: 0,
          endTime: 15,
          text: "Welcome to Server-side Development with Node.js. In this course, we'll explore how to build scalable backend applications using Node.js and Express.",
          speaker: 'Dr. Muppala',
        },
        {
          id: 'ts-1-2',
          startTime: 15,
          endTime: 35,
          text: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It allows us to run JavaScript on the server, which means we can use the same language for both frontend and backend development.",
          speaker: 'Dr. Muppala',
        },
        {
          id: 'ts-1-3',
          startTime: 35,
          endTime: 58,
          text: 'One of the key features of Node.js is its non-blocking, event-driven architecture. This makes it particularly well-suited for building I/O intensive applications like web servers and APIs.',
          speaker: 'Dr. Muppala',
        },
      ],
      resources: [
        {
          id: 'res-1-1',
          title: 'Node.js Installation Guide',
          type: 'pdf',
          url: '/resources/nodejs-install.pdf',
          size: '2.3 MB',
          downloadable: true,
        },
      ],
    },
    {
      id: 'section-2',
      title: 'Building Your First Express Server',
      description: 'Setting up Express and creating basic routes',
      duration: 960, // 16 minutes
      order: 2,
      videoUrl: 'https://www.coursera.org/lecture/express-server',
      thumbnailUrl: '/sections/express-server.jpg',
      isCompleted: true,
      completedAt: new Date('2025-11-04T11:00:00'),
      transcript: [
        {
          id: 'ts-2-1',
          startTime: 0,
          endTime: 20,
          text: "Now that we understand Node.js fundamentals, let's build our first Express server. Express is a minimal and flexible Node.js web application framework.",
          speaker: 'Dr. Muppala',
        },
        {
          id: 'ts-2-2',
          startTime: 20,
          endTime: 45,
          text: "First, we'll install Express using npm. Open your terminal and run: npm install express. This will add Express to your project dependencies.",
          speaker: 'Dr. Muppala',
        },
        {
          id: 'ts-2-3',
          startTime: 45,
          endTime: 72,
          text: "Let's create a simple server. We'll require Express, create an app instance, define a route that responds with 'Hello World', and start listening on port 3000.",
          speaker: 'Dr. Muppala',
        },
      ],
      resources: [
        {
          id: 'res-2-1',
          title: 'Express.js Documentation',
          type: 'link',
          url: 'https://expressjs.com',
          downloadable: false,
        },
        {
          id: 'res-2-2',
          title: 'Starter Code',
          type: 'code',
          url: '/resources/express-starter.zip',
          size: '45 KB',
          downloadable: true,
        },
      ],
    },
    {
      id: 'section-3',
      title: 'RESTful API Design with Express',
      description: 'Creating CRUD operations and routing patterns',
      duration: 1080, // 18 minutes
      order: 3,
      videoUrl: 'https://www.coursera.org/lecture/restful-api',
      thumbnailUrl: '/sections/restful-api.jpg',
      isCompleted: false,
      transcript: [
        {
          id: 'ts-3-1',
          startTime: 0,
          endTime: 18,
          text: 'In this lesson, we will learn how to design RESTful APIs using Express. REST stands for Representational State Transfer.',
          speaker: 'Dr. Muppala',
        },
        {
          id: 'ts-3-2',
          startTime: 18,
          endTime: 42,
          text: 'RESTful APIs use HTTP methods to perform CRUD operations. GET for reading data, POST for creating, PUT or PATCH for updating, and DELETE for removing resources.',
          speaker: 'Dr. Muppala',
        },
        {
          id: 'ts-3-3',
          startTime: 42,
          endTime: 68,
          text: "Let's create a simple API for managing a collection of dishes. We'll define routes for /dishes to list all dishes, /dishes/:id to get a specific dish, and so on.",
          speaker: 'Dr. Muppala',
        },
        {
          id: 'ts-3-4',
          startTime: 68,
          endTime: 95,
          text: 'An important principle of REST is that each resource should have a unique URI. We organize our endpoints hierarchically, making the API intuitive and easy to use.',
          speaker: 'Dr. Muppala',
        },
      ],
      resources: [
        {
          id: 'res-3-1',
          title: 'REST API Best Practices',
          type: 'article',
          url: '/resources/rest-best-practices.pdf',
          size: '1.8 MB',
          downloadable: true,
        },
      ],
    },
    {
      id: 'section-4',
      title: 'MongoDB Integration',
      description: 'Connecting to MongoDB and using Mongoose ODM',
      duration: 1200, // 20 minutes
      order: 4,
      videoUrl: 'https://www.coursera.org/lecture/mongodb-integration',
      thumbnailUrl: '/sections/mongodb.jpg',
      isCompleted: false,
      transcript: [],
      resources: [],
    },
    {
      id: 'section-5',
      title: 'Authentication with JWT',
      description: 'Implementing secure authentication using JSON Web Tokens',
      duration: 1140, // 19 minutes
      order: 5,
      videoUrl: 'https://www.coursera.org/lecture/jwt-auth',
      thumbnailUrl: '/sections/jwt-auth.jpg',
      isCompleted: false,
      transcript: [],
      resources: [],
    },
  ],
  tags: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Backend Development'],
  difficulty: 'intermediate',
  certificateAvailable: true,
  enrolledAt: new Date('2025-11-01'),
  lastAccessedAt: new Date('2025-11-05'),
};

const mockProgress: CourseProgress = {
  courseId: 'course-1',
  userId: 'user-123',
  currentSectionId: 'section-3',
  currentTime: 42, // 42 seconds into section 3
  completedSections: ['section-1', 'section-2'],
  totalTimeSpent: 2145, // ~35 minutes
  completionPercentage: 40,
  lastWatchedAt: new Date('2025-11-05T09:15:00'),
  notes: [
    {
      id: 'note-1',
      timestamp: 35,
      content: 'Event-driven architecture is key for I/O operations. Remember: non-blocking!',
      createdAt: new Date('2025-11-04T10:30:00'),
      updatedAt: new Date('2025-11-04T10:30:00'),
      tags: ['architecture', 'important'],
      sectionId: 'section-1',
    },
    {
      id: 'note-2',
      timestamp: 45,
      content: 'Install Express: npm install express',
      createdAt: new Date('2025-11-04T11:00:00'),
      updatedAt: new Date('2025-11-04T11:00:00'),
      tags: ['command'],
      sectionId: 'section-2',
    },
    {
      id: 'note-3',
      timestamp: 42,
      content: 'REST API uses GET, POST, PUT/PATCH, DELETE for CRUD operations.',
      createdAt: new Date('2025-11-05T09:15:00'),
      updatedAt: new Date('2025-11-05T09:15:00'),
      tags: ['rest', 'http-methods'],
      sectionId: 'section-3',
    },
  ],
  bookmarks: [35, 45, 68],
};

const defaultPlayerSettings: PlayerSettings = {
  volume: 0.8,
  playbackSpeed: 1,
  quality: 'auto',
  subtitlesEnabled: true,
  autoplay: false,
};

type IntegratedCourseContextType = {
  state: IntegratedCourseState;
  actions: IntegratedCourseActions;
};

const IntegratedCourseContext = createContext<IntegratedCourseContextType | undefined>(
  undefined
);

export function IntegratedCourseProvider({ children }: { children: React.ReactNode }) {
  const [course, setCourse] = useState<IntegratedCourse | null>(mockCourse);
  const [progress, setProgress] = useState<CourseProgress | null>(mockProgress);
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.IDLE);
  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>(defaultPlayerSettings);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [selectedNote, setSelectedNote] = useState<CourseNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSection = course?.sections.find((s) => s.id === progress?.currentSectionId) || null;

  const loadCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCourse(mockCourse);
      setProgress(mockProgress);
    } catch (err) {
      setError('Failed to load course');
    } finally {
      setLoading(false);
    }
  }, []);

  const navigateToSection = useCallback((sectionId: string) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentSectionId: sectionId,
        currentTime: 0,
        lastWatchedAt: new Date(),
      };
    });
  }, []);

  const updateProgress = useCallback((time: number) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentTime: time,
        lastWatchedAt: new Date(),
      };
    });
  }, []);

  const completeSection = useCallback(
    (sectionId: string) => {
      setProgress((prev) => {
        if (!prev || !course) return prev;

        const completedSections = prev.completedSections.includes(sectionId)
          ? prev.completedSections
          : [...prev.completedSections, sectionId];

        const completionPercentage = calculateCourseProgress(
          completedSections,
          course.sections.length
        );

        return {
          ...prev,
          completedSections,
          completionPercentage,
        };
      });

      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === sectionId
              ? { ...section, isCompleted: true, completedAt: new Date() }
              : section
          ),
        };
      });
    },
    [course]
  );

  const updatePlayerSettings = useCallback((settings: Partial<PlayerSettings>) => {
    setPlayerSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  const toggleTranscript = useCallback(() => {
    setIsTranscriptOpen((prev) => !prev);
  }, []);

  const toggleNotes = useCallback(() => {
    setIsNotesOpen((prev) => !prev);
  }, []);

  const addNote = useCallback((content: string, timestamp: number) => {
    const newNote: CourseNote = {
      id: `note-${Date.now()}`,
      timestamp,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      sectionId: progress?.currentSectionId,
    };

    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: [...prev.notes, newNote],
      };
    });
  }, [progress?.currentSectionId]);

  const updateNote = useCallback((noteId: string, content: string) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: prev.notes.map((note) =>
          note.id === noteId ? { ...note, content, updatedAt: new Date() } : note
        ),
      };
    });
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        notes: prev.notes.filter((note) => note.id !== noteId),
      };
    });
    setSelectedNote(null);
  }, []);

  const addBookmark = useCallback((timestamp: number) => {
    setProgress((prev) => {
      if (!prev || prev.bookmarks.includes(timestamp)) return prev;
      return {
        ...prev,
        bookmarks: [...prev.bookmarks, timestamp].sort((a, b) => a - b),
      };
    });
  }, []);

  const removeBookmark = useCallback((timestamp: number) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bookmarks: prev.bookmarks.filter((b) => b !== timestamp),
      };
    });
  }, []);

  const seekToTimestamp = useCallback((timestamp: number) => {
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentTime: timestamp,
      };
    });
  }, []);

  const state: IntegratedCourseState = {
    course,
    progress,
    currentSection,
    playerState,
    playerSettings,
    isTranscriptOpen,
    isNotesOpen,
    selectedNote,
    loading,
    error,
  };

  const actions: IntegratedCourseActions = {
    loadCourse,
    navigateToSection,
    updateProgress,
    completeSection,
    setPlayerState,
    updatePlayerSettings,
    toggleTranscript,
    toggleNotes,
    addNote,
    updateNote,
    deleteNote,
    addBookmark,
    removeBookmark,
    seekToTimestamp,
  };

  return (
    <IntegratedCourseContext.Provider value={{ state, actions }}>
      {children}
    </IntegratedCourseContext.Provider>
  );
}

export function useIntegratedCourse() {
  const context = useContext(IntegratedCourseContext);
  if (!context) {
    throw new Error('useIntegratedCourse must be used within IntegratedCourseProvider');
  }
  return context;
}
