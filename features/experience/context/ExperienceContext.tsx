'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  ExperienceState,
  ExperienceContextType,
  Experience,
  Project,
  ExperienceFormData,
  ProjectFormData,
  TimelineGroup,
  TimelineItem,
  ExperienceType,
  ModalMode,
  FormValidation,
} from '../types/experience.types';

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

// Mock data
const mockExperiences: Experience[] = [
  {
    id: 'exp-1',
    type: 'work',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    companyLogo: 'https://via.placeholder.com/48',
    location: 'San Francisco, CA',
    employmentType: 'full-time',
    dateRange: {
      startDate: new Date('2022-01-01'),
      endDate: null,
      isCurrent: true,
    },
    description: 'Leading development of cloud-native applications using React and Node.js',
    responsibilities: [
      'Architect and implement scalable microservices',
      'Mentor junior developers and conduct code reviews',
      'Collaborate with product team on feature specifications',
    ],
    achievements: [
      'Reduced API response time by 40%',
      'Led team of 5 engineers on critical project',
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    projects: ['proj-1'],
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'exp-2',
    type: 'work',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    employmentType: 'contract',
    dateRange: {
      startDate: new Date('2020-06-01'),
      endDate: new Date('2021-12-31'),
      isCurrent: false,
    },
    description: 'Built MVP for B2B SaaS platform from scratch',
    responsibilities: [
      'Developed RESTful APIs using Express.js',
      'Created responsive UI with React and Tailwind CSS',
    ],
    achievements: [
      'Delivered MVP 2 weeks ahead of schedule',
      'Achieved 99.9% uptime in production',
    ],
    skills: ['React', 'Express.js', 'PostgreSQL', 'Tailwind CSS'],
    projects: ['proj-2'],
    isVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Analytics Dashboard',
    tagline: 'Real-time data visualization platform',
    description: 'Enterprise analytics platform processing 10M+ events daily',
    status: 'completed',
    dateRange: {
      startDate: new Date('2022-03-01'),
      endDate: new Date('2023-06-01'),
      isCurrent: false,
    },
    role: 'Tech Lead',
    teamSize: 5,
    skills: ['React', 'D3.js', 'WebSockets', 'Redis'],
    technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'AWS Lambda'],
    highlights: [
      'Processed 10M+ events daily with <100ms latency',
      'Increased user engagement by 60%',
      'Reduced infrastructure costs by 30%',
    ],
    links: [
      {
        id: 'link-1',
        type: 'demo',
        url: 'https://demo.example.com',
        label: 'Live Demo',
      },
    ],
    experienceId: 'exp-1',
    metrics: {
      users: 5000,
      performance: '<100ms latency',
      impact: '60% increase in engagement',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ExperienceState>({
    experiences: mockExperiences,
    projects: mockProjects,
    timeline: [],
    modalState: {
      isOpen: false,
      mode: 'closed',
      type: 'experience',
    },
    selectedFilter: 'all',
    isLoading: false,
    error: null,
  });

  // Build timeline from experiences and projects
  const buildTimeline = useCallback((): TimelineGroup[] => {
    const items: TimelineItem[] = [];

    // Add experiences
    state.experiences.forEach((exp) => {
      const startDate = exp.dateRange.startDate;
      items.push({
        id: exp.id,
        type: exp.type,
        data: exp,
        year: startDate.getFullYear(),
        month: startDate.getMonth(),
        isCurrent: exp.dateRange.isCurrent,
      });
    });

    // Add projects
    state.projects.forEach((proj) => {
      const startDate = proj.dateRange.startDate;
      items.push({
        id: proj.id,
        type: 'project',
        data: proj,
        year: startDate.getFullYear(),
        month: startDate.getMonth(),
        isCurrent: proj.dateRange.isCurrent,
      });
    });

    // Sort by date (newest first)
    items.sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    // Group by year
    const groups: TimelineGroup[] = [];
    items.forEach((item) => {
      let group = groups.find((g) => g.year === item.year);
      if (!group) {
        group = { year: item.year, items: [] };
        groups.push(group);
      }
      group.items.push(item);
    });

    return groups.sort((a, b) => b.year - a.year);
  }, [state.experiences, state.projects]);

  // Modal actions
  const openAddExperience = useCallback(() => {
    setState((prev) => ({
      ...prev,
      modalState: { isOpen: true, mode: 'add', type: 'experience' },
    }));
  }, []);

  const openAddProject = useCallback(() => {
    setState((prev) => ({
      ...prev,
      modalState: { isOpen: true, mode: 'add', type: 'project' },
    }));
  }, []);

  const openEditExperience = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      modalState: { isOpen: true, mode: 'edit', type: 'experience', editingId: id },
    }));
  }, []);

  const openEditProject = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      modalState: { isOpen: true, mode: 'edit', type: 'project', editingId: id },
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      modalState: { isOpen: false, mode: 'closed', type: 'experience' },
    }));
  }, []);

  // CRUD operations
  const addExperience = useCallback(async (data: ExperienceFormData) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      type: data.type,
      title: data.title,
      company: data.company,
      location: data.location,
      employmentType: data.employmentType,
      dateRange: {
        startDate: new Date(data.startDate),
        endDate: data.isCurrent ? null : new Date(data.endDate),
        isCurrent: data.isCurrent,
      },
      description: data.description,
      responsibilities: data.responsibilities,
      achievements: data.achievements,
      skills: data.skills,
      projects: [],
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      experiences: [newExperience, ...prev.experiences],
      isLoading: false,
      modalState: { isOpen: false, mode: 'closed', type: 'experience' },
    }));
  }, []);

  const updateExperience = useCallback(async (id: string, data: ExperienceFormData) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setState((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              type: data.type,
              title: data.title,
              company: data.company,
              location: data.location,
              employmentType: data.employmentType,
              dateRange: {
                startDate: new Date(data.startDate),
                endDate: data.isCurrent ? null : new Date(data.endDate),
                isCurrent: data.isCurrent,
              },
              description: data.description,
              responsibilities: data.responsibilities,
              achievements: data.achievements,
              skills: data.skills,
              updatedAt: new Date(),
            }
          : exp
      ),
      isLoading: false,
      modalState: { isOpen: false, mode: 'closed', type: 'experience' },
    }));
  }, []);

  const deleteExperience = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise((resolve) => setTimeout(resolve, 500));

    setState((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
      isLoading: false,
    }));
  }, []);

  const addProject = useCallback(async (data: ProjectFormData) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: data.title,
      tagline: data.tagline,
      description: data.description,
      status: data.status,
      dateRange: {
        startDate: new Date(data.startDate),
        endDate: data.isCurrent ? null : new Date(data.endDate),
        isCurrent: data.isCurrent,
      },
      role: data.role,
      teamSize: data.teamSize,
      skills: data.skills,
      technologies: data.technologies,
      highlights: data.highlights,
      links: data.links,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      isLoading: false,
      modalState: { isOpen: false, mode: 'closed', type: 'project' },
    }));
  }, []);

  const updateProject = useCallback(async (id: string, data: ProjectFormData) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id
          ? {
              ...proj,
              title: data.title,
              tagline: data.tagline,
              description: data.description,
              status: data.status,
              dateRange: {
                startDate: new Date(data.startDate),
                endDate: data.isCurrent ? null : new Date(data.endDate),
                isCurrent: data.isCurrent,
              },
              role: data.role,
              teamSize: data.teamSize,
              skills: data.skills,
              technologies: data.technologies,
              highlights: data.highlights,
              links: data.links,
              updatedAt: new Date(),
            }
          : proj
      ),
      isLoading: false,
      modalState: { isOpen: false, mode: 'closed', type: 'project' },
    }));
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await new Promise((resolve) => setTimeout(resolve, 500));

    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
      isLoading: false,
    }));
  }, []);

  // Filters
  const setFilter = useCallback((filter: ExperienceType | 'all') => {
    setState((prev) => ({ ...prev, selectedFilter: filter }));
  }, []);

  // Utilities
  const getExperience = useCallback(
    (id: string) => state.experiences.find((exp) => exp.id === id),
    [state.experiences]
  );

  const getProject = useCallback(
    (id: string) => state.projects.find((proj) => proj.id === id),
    [state.projects]
  );

  const validateForm = useCallback(
    (data: ExperienceFormData | ProjectFormData): FormValidation[] => {
      const validations: FormValidation[] = [];

      if ('title' in data && data.title.trim().length === 0) {
        validations.push({ field: 'title', isValid: false, error: 'Title is required' });
      }

      if ('company' in data && data.company.trim().length === 0) {
        validations.push({ field: 'company', isValid: false, error: 'Company is required' });
      }

      if ('startDate' in data && !data.startDate) {
        validations.push({ field: 'startDate', isValid: false, error: 'Start date is required' });
      }

      return validations;
    },
    []
  );

  const value: ExperienceContextType = {
    state,
    openAddExperience,
    openAddProject,
    openEditExperience,
    openEditProject,
    closeModal,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject,
    setFilter,
    getExperience,
    getProject,
    buildTimeline,
    validateForm,
  };

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within ExperienceProvider');
  }
  return context;
}
