'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  SkillMastery,
  SkillMasteryState,
  SkillMasteryActions,
  MasterySummary,
  ActionSuggestion,
  SkillCategory,
  MasteryHistoryPoint,
  getMasteryLevel,
  getConfidenceLevel,
  getDeltaType,
  generateSuggestions,
  calculateOverallDelta,
} from '../types/skill-mastery.types';

/**
 * Mock data: Skills with dual scores (AI mastery vs self-confidence)
 */
const MOCK_SKILLS: SkillMastery[] = [
  {
    id: 'react',
    name: 'React',
    category: SkillCategory.FRAMEWORKS,
    aiMastery: 78,
    selfConfidence: 85,
    delta: 7,
    deltaType: getDeltaType(7),
    masteryLevel: getMasteryLevel(78),
    confidenceLevel: getConfidenceLevel(85),
    lastEvaluated: new Date('2025-11-01'),
    lastAssessed: new Date('2025-11-03'),
    trend: 'improving',
    history: [
      { date: new Date('2025-08-01'), aiMastery: 65, selfConfidence: 70 },
      { date: new Date('2025-09-01'), aiMastery: 70, selfConfidence: 75 },
      { date: new Date('2025-10-01'), aiMastery: 75, selfConfidence: 80 },
      { date: new Date('2025-11-01'), aiMastery: 78, selfConfidence: 85 },
    ],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: SkillCategory.PROGRAMMING,
    aiMastery: 85,
    selfConfidence: 65,
    delta: -20,
    deltaType: getDeltaType(-20),
    masteryLevel: getMasteryLevel(85),
    confidenceLevel: getConfidenceLevel(65),
    lastEvaluated: new Date('2025-11-02'),
    lastAssessed: new Date('2025-11-04'),
    trend: 'improving',
    history: [
      { date: new Date('2025-08-01'), aiMastery: 75, selfConfidence: 60 },
      { date: new Date('2025-09-01'), aiMastery: 78, selfConfidence: 62 },
      { date: new Date('2025-10-01'), aiMastery: 82, selfConfidence: 63 },
      { date: new Date('2025-11-01'), aiMastery: 85, selfConfidence: 65 },
    ],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: SkillCategory.FRAMEWORKS,
    aiMastery: 72,
    selfConfidence: 90,
    delta: 18,
    deltaType: getDeltaType(18),
    masteryLevel: getMasteryLevel(72),
    confidenceLevel: getConfidenceLevel(90),
    lastEvaluated: new Date('2025-10-28'),
    lastAssessed: new Date('2025-11-01'),
    trend: 'stable',
    history: [
      { date: new Date('2025-08-01'), aiMastery: 70, selfConfidence: 88 },
      { date: new Date('2025-09-01'), aiMastery: 71, selfConfidence: 89 },
      { date: new Date('2025-10-01'), aiMastery: 72, selfConfidence: 90 },
      { date: new Date('2025-11-01'), aiMastery: 72, selfConfidence: 90 },
    ],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: SkillCategory.PROGRAMMING,
    aiMastery: 80,
    selfConfidence: 78,
    delta: -2,
    deltaType: getDeltaType(-2),
    masteryLevel: getMasteryLevel(80),
    confidenceLevel: getConfidenceLevel(78),
    lastEvaluated: new Date('2025-11-03'),
    lastAssessed: new Date('2025-11-03'),
    trend: 'improving',
    history: [
      { date: new Date('2025-08-01'), aiMastery: 72, selfConfidence: 70 },
      { date: new Date('2025-09-01'), aiMastery: 75, selfConfidence: 73 },
      { date: new Date('2025-10-01'), aiMastery: 78, selfConfidence: 75 },
      { date: new Date('2025-11-01'), aiMastery: 80, selfConfidence: 78 },
    ],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: SkillCategory.DATABASES,
    aiMastery: 55,
    selfConfidence: 40,
    delta: -15,
    deltaType: getDeltaType(-15),
    masteryLevel: getMasteryLevel(55),
    confidenceLevel: getConfidenceLevel(40),
    lastEvaluated: new Date('2025-10-30'),
    lastAssessed: new Date('2025-11-02'),
    trend: 'stable',
    history: [
      { date: new Date('2025-08-01'), aiMastery: 52, selfConfidence: 38 },
      { date: new Date('2025-09-01'), aiMastery: 53, selfConfidence: 39 },
      { date: new Date('2025-10-01'), aiMastery: 54, selfConfidence: 40 },
      { date: new Date('2025-11-01'), aiMastery: 55, selfConfidence: 40 },
    ],
  },
  {
    id: 'docker',
    name: 'Docker',
    category: SkillCategory.DEVOPS,
    aiMastery: 45,
    selfConfidence: 70,
    delta: 25,
    deltaType: getDeltaType(25),
    masteryLevel: getMasteryLevel(45),
    confidenceLevel: getConfidenceLevel(70),
    lastEvaluated: new Date('2025-11-01'),
    lastAssessed: new Date('2025-11-04'),
    trend: 'declining',
    history: [
      { date: new Date('2025-08-01'), aiMastery: 50, selfConfidence: 68 },
      { date: new Date('2025-09-01'), aiMastery: 48, selfConfidence: 69 },
      { date: new Date('2025-10-01'), aiMastery: 46, selfConfidence: 70 },
      { date: new Date('2025-11-01'), aiMastery: 45, selfConfidence: 70 },
    ],
  },
];

/**
 * Calculate summary statistics
 */
const calculateSummary = (skills: SkillMastery[]): MasterySummary => {
  const totalSkills = skills.length;
  const overallAIMastery = skills.reduce((sum, s) => sum + s.aiMastery, 0) / totalSkills;
  const overallSelfConfidence = skills.reduce((sum, s) => sum + s.selfConfidence, 0) / totalSkills;
  const overallDelta = calculateOverallDelta(skills);

  const masteredSkills = skills.filter((s) => s.aiMastery >= 80).length;
  const overconfidentSkills = skills.filter((s) => s.delta > 20).length;
  const underconfidentSkills = skills.filter((s) => s.delta < -20).length;
  const alignedSkills = skills.filter((s) => Math.abs(s.delta) <= 20).length;

  const topSkills = [...skills].sort((a, b) => b.aiMastery - a.aiMastery).slice(0, 3);
  const skillsNeedingWork = [...skills].sort((a, b) => a.aiMastery - b.aiMastery).slice(0, 3);

  return {
    overallAIMastery,
    overallSelfConfidence,
    overallDelta,
    totalSkills,
    masteredSkills,
    overconfidentSkills,
    underconfidentSkills,
    alignedSkills,
    topSkills,
    skillsNeedingWork,
  };
};

/**
 * Generate all suggestions
 */
const generateAllSuggestions = (skills: SkillMastery[]): ActionSuggestion[] => {
  const suggestions: ActionSuggestion[] = [];
  
  skills.forEach((skill) => {
    suggestions.push(...generateSuggestions(skill));
  });

  // Sort by priority
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

/**
 * Context type
 */
type SkillMasteryContextType = SkillMasteryState & SkillMasteryActions;

const SkillMasteryContext = createContext<SkillMasteryContextType | undefined>(undefined);

/**
 * Provider component
 */
export const SkillMasteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SkillMasteryState>({
    skills: [],
    summary: null,
    selectedSkill: null,
    suggestions: [],
    loading: true,
    error: null,
  });

  /**
   * Load mastery data
   */
  const loadMasteryData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const skills = MOCK_SKILLS;
      const summary = calculateSummary(skills);
      const suggestions = generateAllSuggestions(skills);

      setState({
        skills,
        summary,
        selectedSkill: null,
        suggestions,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load mastery data',
      }));
    }
  }, []);

  /**
   * Select a skill
   */
  const selectSkill = useCallback((skillId: string) => {
    setState((prev) => {
      const skill = prev.skills.find((s) => s.id === skillId) || null;
      return { ...prev, selectedSkill: skill };
    });
  }, []);

  /**
   * Update self-confidence
   */
  const updateSelfConfidence = useCallback(async (skillId: string, confidenceScore: number) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));

      setState((prev) => {
        const updatedSkills = prev.skills.map((skill) => {
          if (skill.id === skillId) {
            const delta = confidenceScore - skill.aiMastery;
            return {
              ...skill,
              selfConfidence: confidenceScore,
              delta,
              deltaType: getDeltaType(delta),
              confidenceLevel: getConfidenceLevel(confidenceScore),
              lastAssessed: new Date(),
            };
          }
          return skill;
        });

        const summary = calculateSummary(updatedSkills);
        const suggestions = generateAllSuggestions(updatedSkills);

        return {
          ...prev,
          skills: updatedSkills,
          summary,
          suggestions,
        };
      });
    } catch (error) {
      console.error('Failed to update confidence:', error);
    }
  }, []);

  /**
   * Dismiss a suggestion
   */
  const dismissSuggestion = useCallback((suggestionId: string) => {
    setState((prev) => ({
      ...prev,
      suggestions: prev.suggestions.filter((s) => s.id !== suggestionId),
    }));
  }, []);

  /**
   * Filter by category
   */
  const filterByCategory = useCallback((category: SkillCategory | null) => {
    if (!category) {
      loadMasteryData();
      return;
    }

    setState((prev) => {
      const filteredSkills = MOCK_SKILLS.filter((s) => s.category === category);
      const summary = calculateSummary(filteredSkills);
      const suggestions = generateAllSuggestions(filteredSkills);

      return {
        ...prev,
        skills: filteredSkills,
        summary,
        suggestions,
      };
    });
  }, [loadMasteryData]);

  /**
   * Sort skills
   */
  const sortBy = useCallback((field: 'mastery' | 'confidence' | 'delta') => {
    setState((prev) => {
      const sortedSkills = [...prev.skills].sort((a, b) => {
        if (field === 'mastery') return b.aiMastery - a.aiMastery;
        if (field === 'confidence') return b.selfConfidence - a.selfConfidence;
        return Math.abs(b.delta) - Math.abs(a.delta);
      });

      return { ...prev, skills: sortedSkills };
    });
  }, []);

  // Load data on mount
  useEffect(() => {
    loadMasteryData();
  }, [loadMasteryData]);

  const value: SkillMasteryContextType = {
    ...state,
    loadMasteryData,
    selectSkill,
    updateSelfConfidence,
    dismissSuggestion,
    filterByCategory,
    sortBy,
  };

  return <SkillMasteryContext.Provider value={value}>{children}</SkillMasteryContext.Provider>;
};

/**
 * Hook to use context
 */
export const useSkillMastery = (): SkillMasteryContextType => {
  const context = useContext(SkillMasteryContext);
  if (!context) {
    throw new Error('useSkillMastery must be used within SkillMasteryProvider');
  }
  return context;
};
