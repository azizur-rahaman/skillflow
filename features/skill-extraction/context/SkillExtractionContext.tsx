'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  type SkillExtractionContextType,
  type SkillExtractionState,
  type ExtractedSkill,
  type ExtractionStats,
  FilterCriteria,
  ViewMode,
  ExtractionSource,
  type BulkOperationResult,
  ConfidenceLevel,
  VerificationStatus,
  SkillCategory,
} from '../types/skill-extraction.types';

const SkillExtractionContext = createContext<SkillExtractionContextType | undefined>(undefined);

// Mock data for demonstration
const generateMockSkills = (): ExtractedSkill[] => [
  {
    id: '1',
    name: 'React',
    normalizedName: 'react',
    category: SkillCategory.FRAMEWORK,
    confidence: 95,
    confidenceLevel: ConfidenceLevel.VERY_HIGH,
    verificationStatus: VerificationStatus.VERIFIED,
    sources: [ExtractionSource.RESUME, ExtractionSource.GITHUB],
    evidence: [
      {
        id: 'e1',
        source: ExtractionSource.RESUME,
        context: 'Built scalable web applications using React and TypeScript',
        location: 'Work Experience - Senior Frontend Developer',
        timestamp: new Date(),
        weight: 0.9,
      },
    ],
    aiAnalysis: {
      model: 'GPT-4',
      confidence: 95,
      reasoning: 'Strong evidence from multiple sources with project descriptions',
      alternatives: ['ReactJS', 'React.js'],
      timestamp: new Date(),
      processingTime: 245,
    },
    yearsOfExperience: 4,
    proficiencyLevel: 'expert',
    relatedSkills: ['2', '3', '5'],
    isEndorsed: true,
    endorsementCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-1',
  },
  {
    id: '2',
    name: 'TypeScript',
    normalizedName: 'typescript',
    category: SkillCategory.TECHNICAL,
    confidence: 92,
    confidenceLevel: ConfidenceLevel.HIGH,
    verificationStatus: VerificationStatus.VERIFIED,
    sources: [ExtractionSource.RESUME, ExtractionSource.GITHUB, ExtractionSource.LINKEDIN],
    evidence: [
      {
        id: 'e2',
        source: ExtractionSource.GITHUB,
        context: '98% of repositories use TypeScript',
        location: 'GitHub Profile Analysis',
        timestamp: new Date(),
        weight: 0.95,
      },
    ],
    aiAnalysis: {
      model: 'GPT-4',
      confidence: 92,
      reasoning: 'Frequent usage across multiple repositories and mentions in work experience',
      alternatives: ['TS', 'TypeScript Language'],
      timestamp: new Date(),
      processingTime: 198,
    },
    yearsOfExperience: 4,
    proficiencyLevel: 'expert',
    relatedSkills: ['1', '3'],
    isEndorsed: true,
    endorsementCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-1',
  },
  {
    id: '3',
    name: 'Next.js',
    normalizedName: 'nextjs',
    category: SkillCategory.FRAMEWORK,
    confidence: 88,
    confidenceLevel: ConfidenceLevel.HIGH,
    verificationStatus: VerificationStatus.VERIFIED,
    sources: [ExtractionSource.RESUME, ExtractionSource.GITHUB],
    evidence: [
      {
        id: 'e3',
        source: ExtractionSource.RESUME,
        context: 'Developed enterprise applications with Next.js 14 and App Router',
        location: 'Recent Projects',
        timestamp: new Date(),
        weight: 0.85,
      },
    ],
    aiAnalysis: {
      model: 'GPT-4',
      confidence: 88,
      reasoning: 'Recent project experience with modern features',
      alternatives: ['Next', 'Next.js Framework'],
      timestamp: new Date(),
      processingTime: 210,
    },
    yearsOfExperience: 3,
    proficiencyLevel: 'advanced',
    relatedSkills: ['1', '2'],
    isEndorsed: true,
    endorsementCount: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-1',
  },
  {
    id: '4',
    name: 'Machine Learning',
    normalizedName: 'machine_learning',
    category: SkillCategory.DOMAIN,
    confidence: 72,
    confidenceLevel: ConfidenceLevel.MEDIUM,
    verificationStatus: VerificationStatus.PENDING,
    sources: [ExtractionSource.RESUME],
    evidence: [
      {
        id: 'e4',
        source: ExtractionSource.RESUME,
        context: 'Implemented ML models for predictive analytics',
        location: 'Skills Section',
        timestamp: new Date(),
        weight: 0.7,
      },
    ],
    aiAnalysis: {
      model: 'GPT-4',
      confidence: 72,
      reasoning: 'Mentioned in skills section but limited project evidence',
      alternatives: ['ML', 'AI/ML', 'Artificial Intelligence'],
      timestamp: new Date(),
      processingTime: 267,
    },
    yearsOfExperience: 2,
    proficiencyLevel: 'intermediate',
    relatedSkills: ['6', '7'],
    isEndorsed: false,
    endorsementCount: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-1',
  },
  {
    id: '5',
    name: 'Tailwind CSS',
    normalizedName: 'tailwind_css',
    category: SkillCategory.FRAMEWORK,
    confidence: 90,
    confidenceLevel: ConfidenceLevel.HIGH,
    verificationStatus: VerificationStatus.VERIFIED,
    sources: [ExtractionSource.RESUME, ExtractionSource.GITHUB],
    evidence: [
      {
        id: 'e5',
        source: ExtractionSource.GITHUB,
        context: 'Extensive use of Tailwind CSS in UI projects',
        location: 'Repository Analysis',
        timestamp: new Date(),
        weight: 0.88,
      },
    ],
    aiAnalysis: {
      model: 'GPT-4',
      confidence: 90,
      reasoning: 'Consistent usage pattern across frontend projects',
      alternatives: ['TailwindCSS', 'Tailwind'],
      timestamp: new Date(),
      processingTime: 189,
    },
    yearsOfExperience: 3,
    proficiencyLevel: 'advanced',
    relatedSkills: ['1', '3'],
    isEndorsed: true,
    endorsementCount: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-1',
  },
  {
    id: '6',
    name: 'Python',
    normalizedName: 'python',
    category: SkillCategory.TECHNICAL,
    confidence: 65,
    confidenceLevel: ConfidenceLevel.MEDIUM,
    verificationStatus: VerificationStatus.PENDING,
    sources: [ExtractionSource.RESUME],
    evidence: [
      {
        id: 'e6',
        source: ExtractionSource.RESUME,
        context: 'Used Python for data analysis scripts',
        location: 'Projects',
        timestamp: new Date(),
        weight: 0.65,
      },
    ],
    aiAnalysis: {
      model: 'GPT-4',
      confidence: 65,
      reasoning: 'Limited evidence, mentioned in context of supporting tools',
      alternatives: ['Python3', 'Python Programming'],
      timestamp: new Date(),
      processingTime: 234,
    },
    yearsOfExperience: 1,
    proficiencyLevel: 'intermediate',
    relatedSkills: ['4'],
    isEndorsed: false,
    endorsementCount: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-1',
  },
  {
    id: '7',
    name: 'Docker',
    normalizedName: 'docker',
    category: SkillCategory.TOOL,
    confidence: 78,
    confidenceLevel: ConfidenceLevel.MEDIUM,
    verificationStatus: VerificationStatus.VERIFIED,
    sources: [ExtractionSource.RESUME, ExtractionSource.GITHUB],
    evidence: [
      {
        id: 'e7',
        source: ExtractionSource.GITHUB,
        context: 'Dockerfiles present in multiple repositories',
        location: 'Repository Files',
        timestamp: new Date(),
        weight: 0.75,
      },
    ],
    aiAnalysis: {
      model: 'GPT-4',
      confidence: 78,
      reasoning: 'Practical evidence from repository infrastructure',
      alternatives: ['Docker Containers', 'Containerization'],
      timestamp: new Date(),
      processingTime: 201,
    },
    yearsOfExperience: 2,
    proficiencyLevel: 'intermediate',
    relatedSkills: [],
    isEndorsed: true,
    endorsementCount: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-1',
  },
  {
    id: '8',
    name: 'Project Management',
    normalizedName: 'project_management',
    category: SkillCategory.SOFT_SKILL,
    confidence: 55,
    confidenceLevel: ConfidenceLevel.LOW,
    verificationStatus: VerificationStatus.MANUAL_REVIEW,
    sources: [ExtractionSource.LINKEDIN],
    evidence: [
      {
        id: 'e8',
        source: ExtractionSource.LINKEDIN,
        context: 'Led team of 5 developers',
        location: 'Work Experience',
        timestamp: new Date(),
        weight: 0.55,
      },
    ],
    aiAnalysis: {
      model: 'GPT-4',
      confidence: 55,
      reasoning: 'Implied from leadership role, needs manual verification',
      alternatives: ['Team Leadership', 'Agile Project Management'],
      timestamp: new Date(),
      processingTime: 298,
    },
    proficiencyLevel: 'intermediate',
    relatedSkills: [],
    isEndorsed: false,
    endorsementCount: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-1',
  },
];

export function SkillExtractionProvider({ children }: { children: React.ReactNode }) {
  const [skills, setSkills] = useState<ExtractedSkill[]>(generateMockSkills());
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<FilterCriteria>(FilterCriteria.ALL);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentJob, setCurrentJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate statistics
  const calculateStats = useCallback((): ExtractionStats => {
    const stats: ExtractionStats = {
      totalSkills: skills.length,
      verifiedSkills: skills.filter(s => s.verificationStatus === VerificationStatus.VERIFIED).length,
      pendingSkills: skills.filter(s => s.verificationStatus === VerificationStatus.PENDING).length,
      highConfidenceSkills: skills.filter(s => s.confidence >= 80).length,
      mediumConfidenceSkills: skills.filter(s => s.confidence >= 60 && s.confidence < 80).length,
      lowConfidenceSkills: skills.filter(s => s.confidence < 60).length,
      averageConfidence: skills.reduce((sum, s) => sum + s.confidence, 0) / skills.length || 0,
      sourceBreakdown: {} as Record<ExtractionSource, number>,
      categoryBreakdown: {} as Record<SkillCategory, number>,
    };

    // Count by source
    skills.forEach(skill => {
      skill.sources.forEach(source => {
        stats.sourceBreakdown[source] = (stats.sourceBreakdown[source] || 0) + 1;
      });
    });

    // Count by category
    skills.forEach(skill => {
      stats.categoryBreakdown[skill.category] = (stats.categoryBreakdown[skill.category] || 0) + 1;
    });

    return stats;
  }, [skills]);

  const stats = useMemo(() => calculateStats(), [calculateStats]);

  // Filter skills based on active filter and search query
  const filteredSkills = useMemo(() => {
    let filtered = [...skills];

    // Apply filter
    switch (activeFilter) {
      case FilterCriteria.VERIFIED:
        filtered = filtered.filter(s => s.verificationStatus === VerificationStatus.VERIFIED);
        break;
      case FilterCriteria.PENDING:
        filtered = filtered.filter(s => s.verificationStatus === VerificationStatus.PENDING);
        break;
      case FilterCriteria.HIGH_CONFIDENCE:
        filtered = filtered.filter(s => s.confidence >= 80);
        break;
      case FilterCriteria.REQUIRES_REVIEW:
        filtered = filtered.filter(s => s.verificationStatus === VerificationStatus.MANUAL_REVIEW);
        break;
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.normalizedName.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [skills, activeFilter, searchQuery]);

  // Skill management
  const addSkill = useCallback((skillData: Omit<ExtractedSkill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSkill: ExtractedSkill = {
      ...skillData,
      id: `skill-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSkills(prev => [...prev, newSkill]);
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<ExtractedSkill>) => {
    setSkills(prev => prev.map(skill =>
      skill.id === id
        ? { ...skill, ...updates, updatedAt: new Date() }
        : skill
    ));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
    setSelectedSkills(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const removeSkills = useCallback((ids: string[]) => {
    setSkills(prev => prev.filter(skill => !ids.includes(skill.id)));
    setSelectedSkills(new Set());
  }, []);

  // Verification
  const verifySkill = useCallback((id: string) => {
    updateSkill(id, { verificationStatus: VerificationStatus.VERIFIED });
  }, [updateSkill]);

  const rejectSkill = useCallback((id: string) => {
    updateSkill(id, { verificationStatus: VerificationStatus.REJECTED });
  }, [updateSkill]);

  const markForReview = useCallback((id: string) => {
    updateSkill(id, { verificationStatus: VerificationStatus.MANUAL_REVIEW });
  }, [updateSkill]);

  // Selection
  const selectSkill = useCallback((id: string) => {
    setSelectedSkills(prev => new Set(prev).add(id));
  }, []);

  const deselectSkill = useCallback((id: string) => {
    setSelectedSkills(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedSkills(new Set(filteredSkills.map(s => s.id)));
  }, [filteredSkills]);

  const deselectAll = useCallback(() => {
    setSelectedSkills(new Set());
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Bulk operations
  const verifySelected = useCallback(async (): Promise<BulkOperationResult> => {
    const ids = Array.from(selectedSkills);
    try {
      ids.forEach(id => verifySkill(id));
      setSelectedSkills(new Set());
      return { success: true, processedCount: ids.length, failedCount: 0, errors: [] };
    } catch (err) {
      return {
        success: false,
        processedCount: 0,
        failedCount: ids.length,
        errors: ['Failed to verify skills'],
      };
    }
  }, [selectedSkills, verifySkill]);

  const rejectSelected = useCallback(async (): Promise<BulkOperationResult> => {
    const ids = Array.from(selectedSkills);
    try {
      ids.forEach(id => rejectSkill(id));
      setSelectedSkills(new Set());
      return { success: true, processedCount: ids.length, failedCount: 0, errors: [] };
    } catch (err) {
      return {
        success: false,
        processedCount: 0,
        failedCount: ids.length,
        errors: ['Failed to reject skills'],
      };
    }
  }, [selectedSkills, rejectSkill]);

  const deleteSelected = useCallback(async (): Promise<BulkOperationResult> => {
    const ids = Array.from(selectedSkills);
    try {
      removeSkills(ids);
      return { success: true, processedCount: ids.length, failedCount: 0, errors: [] };
    } catch (err) {
      return {
        success: false,
        processedCount: 0,
        failedCount: ids.length,
        errors: ['Failed to delete skills'],
      };
    }
  }, [selectedSkills, removeSkills]);

  const exportSelected = useCallback((format: 'json' | 'csv') => {
    const selectedSkillsData = skills.filter(s => selectedSkills.has(s.id));
    
    if (format === 'json') {
      const dataStr = JSON.stringify(selectedSkillsData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `skills-${Date.now()}.json`;
      link.click();
    } else {
      // CSV export
      const headers = ['Name', 'Category', 'Confidence', 'Status', 'Sources'];
      const rows = selectedSkillsData.map(s => [
        s.name,
        s.category,
        s.confidence,
        s.verificationStatus,
        s.sources.join('; '),
      ]);
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const dataBlob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `skills-${Date.now()}.csv`;
      link.click();
    }
  }, [skills, selectedSkills]);

  // Filtering & search
  const setFilter = useCallback((filter: FilterCriteria) => {
    setActiveFilter(filter);
    setSelectedSkills(new Set());
  }, []);

  const applyFilters = useCallback(() => {
    // Filters are automatically applied via useMemo
  }, []);

  // Extraction job
  const startExtraction = useCallback(async (source: ExtractionSource, file?: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate extraction process
      const job = {
        id: `job-${Date.now()}`,
        userId: 'user-1',
        source,
        fileName: file?.name,
        fileSize: file?.size,
        status: 'processing' as const,
        progress: 0,
        totalSkillsFound: 0,
        startedAt: new Date(),
      };
      
      setCurrentJob(job);
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setCurrentJob((prev: any) => prev ? { ...prev, progress: i } : null);
      }
      
      setCurrentJob((prev: any) => prev ? { ...prev, status: 'completed', completedAt: new Date() } : null);
    } catch (err) {
      setError('Failed to extract skills');
      setCurrentJob(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelExtraction = useCallback(() => {
    setCurrentJob(null);
    setIsLoading(false);
  }, []);

  const refreshStats = useCallback(() => {
    // Stats are automatically refreshed via useMemo
  }, []);

  const value: SkillExtractionContextType = {
    // State
    skills,
    filteredSkills,
    selectedSkills,
    activeFilter,
    viewMode,
    searchQuery,
    stats,
    currentJob,
    isLoading,
    error,
    
    // Actions
    addSkill,
    updateSkill,
    removeSkill,
    removeSkills,
    verifySkill,
    rejectSkill,
    markForReview,
    selectSkill,
    deselectSkill,
    selectAll,
    deselectAll,
    toggleSelection,
    verifySelected,
    rejectSelected,
    deleteSelected,
    exportSelected,
    setFilter,
    setViewMode,
    setSearchQuery,
    applyFilters,
    startExtraction,
    cancelExtraction,
    calculateStats,
    refreshStats,
  };

  return (
    <SkillExtractionContext.Provider value={value}>
      {children}
    </SkillExtractionContext.Provider>
  );
}

export function useSkillExtraction() {
  const context = useContext(SkillExtractionContext);
  if (!context) {
    throw new Error('useSkillExtraction must be used within SkillExtractionProvider');
  }
  return context;
}
