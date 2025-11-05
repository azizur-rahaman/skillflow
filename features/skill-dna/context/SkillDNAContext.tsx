'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  type SkillDNAContextType,
  type SkillDNA,
  type DNAStats,
  type DNAInsight,
  type RadarDataPoint,
  type SkillRecommendation,
  type DNAComparison,
  type DNAEvolution,
  SkillDomain,
  StrengthLevel,
  InsightType,
  RecommendationPriority,
} from '../types/skill-dna.types';

const SkillDNAContext = createContext<SkillDNAContextType | undefined>(undefined);

// Domain color mapping following design system
const DOMAIN_COLORS: Record<SkillDomain, string> = {
  [SkillDomain.FRONTEND]: '#6366F1', // Indigo
  [SkillDomain.BACKEND]: '#A855F7', // Purple
  [SkillDomain.MOBILE]: '#22D3EE', // Cyan
  [SkillDomain.DEVOPS]: '#10B981', // Green
  [SkillDomain.DATA_SCIENCE]: '#F59E0B', // Amber
  [SkillDomain.AI_ML]: '#EF4444', // Red
  [SkillDomain.DESIGN]: '#EC4899', // Pink
  [SkillDomain.CLOUD]: '#8B5CF6', // Violet
  [SkillDomain.SECURITY]: '#14B8A6', // Teal
  [SkillDomain.LEADERSHIP]: '#F97316', // Orange
  [SkillDomain.SOFT_SKILLS]: '#06B6D4', // Sky
};

// Mock DNA data generator
const generateMockDNA = (): SkillDNA => {
  const radarData: RadarDataPoint[] = [
    {
      domain: SkillDomain.FRONTEND,
      label: 'Frontend',
      strength: 92,
      skillCount: 12,
      color: DOMAIN_COLORS[SkillDomain.FRONTEND],
      topSkills: ['React', 'TypeScript', 'Next.js'],
    },
    {
      domain: SkillDomain.BACKEND,
      label: 'Backend',
      strength: 78,
      skillCount: 8,
      color: DOMAIN_COLORS[SkillDomain.BACKEND],
      topSkills: ['Node.js', 'PostgreSQL', 'GraphQL'],
    },
    {
      domain: SkillDomain.AI_ML,
      label: 'AI/ML',
      strength: 68,
      skillCount: 5,
      color: DOMAIN_COLORS[SkillDomain.AI_ML],
      topSkills: ['TensorFlow', 'Python', 'NLP'],
    },
    {
      domain: SkillDomain.DEVOPS,
      label: 'DevOps',
      strength: 75,
      skillCount: 7,
      color: DOMAIN_COLORS[SkillDomain.DEVOPS],
      topSkills: ['Docker', 'Kubernetes', 'AWS'],
    },
    {
      domain: SkillDomain.DESIGN,
      label: 'Design',
      strength: 85,
      skillCount: 6,
      color: DOMAIN_COLORS[SkillDomain.DESIGN],
      topSkills: ['Figma', 'UI/UX', 'Tailwind'],
    },
    {
      domain: SkillDomain.CLOUD,
      label: 'Cloud',
      strength: 70,
      skillCount: 6,
      color: DOMAIN_COLORS[SkillDomain.CLOUD],
      topSkills: ['AWS', 'Azure', 'Serverless'],
    },
    {
      domain: SkillDomain.SOFT_SKILLS,
      label: 'Leadership',
      strength: 82,
      skillCount: 4,
      color: DOMAIN_COLORS[SkillDomain.SOFT_SKILLS],
      topSkills: ['Communication', 'Mentoring', 'Agile'],
    },
  ];

  const insight: DNAInsight = {
    id: 'insight-1',
    type: InsightType.T_SHAPED,
    title: 'Tech Specialist – AI Core',
    description: 'Deep frontend expertise with strong foundation in AI/ML and design. T-shaped profile ideal for building intelligent user experiences.',
    icon: '🧬',
    confidence: 89,
    badges: ['Frontend Expert', 'AI Core', 'Full-Stack Ready'],
  };

  return {
    id: 'dna-1',
    userId: 'user-1',
    radarData,
    dominantDomain: SkillDomain.FRONTEND,
    secondaryDomains: [SkillDomain.DESIGN, SkillDomain.SOFT_SKILLS],
    overallStrength: 78.5,
    totalSkills: 48,
    insight,
    lastCalculated: new Date(),
    version: 1,
  };
};

// Mock recommendations
const generateMockRecommendations = (): SkillRecommendation[] => [
  {
    id: 'rec-1',
    skillName: 'Vue.js',
    domain: SkillDomain.FRONTEND,
    reason: 'Complement your React expertise with another modern framework',
    priority: RecommendationPriority.MEDIUM,
    estimatedImpact: 72,
    relatedSkills: ['React', 'TypeScript', 'Vite'],
  },
  {
    id: 'rec-2',
    skillName: 'PyTorch',
    domain: SkillDomain.AI_ML,
    reason: 'Strengthen your ML toolkit alongside TensorFlow',
    priority: RecommendationPriority.HIGH,
    estimatedImpact: 85,
    learningPath: 'Deep Learning Specialization',
    relatedSkills: ['TensorFlow', 'Python', 'Neural Networks'],
  },
  {
    id: 'rec-3',
    skillName: 'System Design',
    domain: SkillDomain.BACKEND,
    reason: 'Critical for senior engineering roles and scalability',
    priority: RecommendationPriority.CRITICAL,
    estimatedImpact: 95,
    relatedSkills: ['Architecture', 'Scalability', 'Microservices'],
  },
];

export function SkillDNAProvider({ children }: { children: React.ReactNode }) {
  const [dna, setDna] = useState<SkillDNA | null>(generateMockDNA());
  const [recommendations, setRecommendations] = useState<SkillRecommendation[]>(generateMockRecommendations());
  const [comparison, setComparison] = useState<DNAComparison | null>(null);
  const [evolution, setEvolution] = useState<DNAEvolution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get strength level from numeric value
  const getStrengthLevel = useCallback((strength: number): StrengthLevel => {
    if (strength >= 81) return StrengthLevel.EXPERT;
    if (strength >= 61) return StrengthLevel.ADVANCED;
    if (strength >= 41) return StrengthLevel.INTERMEDIATE;
    if (strength >= 21) return StrengthLevel.BEGINNER;
    return StrengthLevel.NOVICE;
  }, []);

  // Get domain color
  const getDomainColor = useCallback((domain: SkillDomain): string => {
    return DOMAIN_COLORS[domain] || '#6366F1';
  }, []);

  // Calculate statistics
  const calculateStats = useCallback((): DNAStats => {
    if (!dna) {
      return {
        totalDomains: 0,
        activeDomains: 0,
        strongestDomain: SkillDomain.FRONTEND,
        weakestDomain: null,
        averageStrength: 0,
        strengthDistribution: {
          [StrengthLevel.NOVICE]: 0,
          [StrengthLevel.BEGINNER]: 0,
          [StrengthLevel.INTERMEDIATE]: 0,
          [StrengthLevel.ADVANCED]: 0,
          [StrengthLevel.EXPERT]: 0,
        },
        balanceScore: 0,
        specializationScore: 0,
      };
    }

    const activeDomains = dna.radarData.filter(d => d.skillCount > 0);
    const totalDomains = dna.radarData.length;
    
    // Find strongest and weakest
    const sorted = [...dna.radarData].sort((a, b) => b.strength - a.strength);
    const strongestDomain = sorted[0].domain;
    const weakestDomain = activeDomains.length > 1 ? sorted[sorted.length - 1].domain : null;
    
    // Average strength
    const averageStrength = dna.overallStrength;
    
    // Strength distribution
    const strengthDistribution = dna.radarData.reduce((acc, d) => {
      const level = getStrengthLevel(d.strength);
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<StrengthLevel, number>);
    
    // Balance score (lower variance = more balanced)
    const variance = dna.radarData.reduce((sum, d) => sum + Math.pow(d.strength - averageStrength, 2), 0) / totalDomains;
    const balanceScore = Math.max(0, 100 - Math.sqrt(variance));
    
    // Specialization score (higher max - higher specialization)
    const maxStrength = Math.max(...dna.radarData.map(d => d.strength));
    const specializationScore = maxStrength;

    return {
      totalDomains,
      activeDomains: activeDomains.length,
      strongestDomain,
      weakestDomain,
      averageStrength,
      strengthDistribution,
      balanceScore: Math.round(balanceScore),
      specializationScore: Math.round(specializationScore),
    };
  }, [dna, getStrengthLevel]);

  const stats = useMemo(() => calculateStats(), [calculateStats]);

  // Calculate DNA
  const calculateDNA = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDna(generateMockDNA());
    } catch (err) {
      setError('Failed to calculate DNA');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh DNA
  const refreshDNA = useCallback(async () => {
    await calculateDNA();
  }, [calculateDNA]);

  // Generate insights
  const generateInsights = useCallback(async (): Promise<DNAInsight> => {
    if (!dna) {
      throw new Error('No DNA data available');
    }
    
    // Simulate AI insight generation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return dna.insight;
  }, [dna]);

  // Update insight
  const updateInsight = useCallback((insightUpdate: Partial<DNAInsight>) => {
    if (!dna) return;
    
    setDna(prev => prev ? {
      ...prev,
      insight: { ...prev.insight, ...insightUpdate },
    } : null);
  }, [dna]);

  // Get recommendations
  const getRecommendations = useCallback((domain?: SkillDomain) => {
    if (!domain) return recommendations;
    return recommendations.filter(rec => rec.domain === domain);
  }, [recommendations]);

  // Dismiss recommendation
  const dismissRecommendation = useCallback((id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  }, []);

  // Compare with role
  const compareWithRole = useCallback(async (roleTitle: string): Promise<DNAComparison> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock comparison data
      const mockComparison: DNAComparison = {
        userDNA: dna!,
        targetRole: roleTitle,
        gaps: [],
        matchScore: 82,
        strengths: ['Frontend Development', 'UI/UX Design', 'Leadership'],
        improvements: ['System Design', 'Cloud Architecture', 'Security Best Practices'],
      };
      
      setComparison(mockComparison);
      return mockComparison;
    } finally {
      setIsLoading(false);
    }
  }, [dna]);

  // Clear comparison
  const clearComparison = useCallback(() => {
    setComparison(null);
  }, []);

  // Load evolution
  const loadEvolution = useCallback(async (months: number) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock evolution data
      const mockEvolution: DNAEvolution = {
        userId: 'user-1',
        snapshots: [],
        growthRate: 3.5,
        trendingDomains: [SkillDomain.AI_ML, SkillDomain.CLOUD],
        decliningDomains: [],
      };
      
      setEvolution(mockEvolution);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add snapshot
  const addSnapshot = useCallback(() => {
    if (!dna || !evolution) return;
    
    const snapshot = {
      timestamp: new Date(),
      radarData: dna.radarData,
      overallStrength: dna.overallStrength,
      totalSkills: dna.totalSkills,
    };
    
    setEvolution(prev => prev ? {
      ...prev,
      snapshots: [...prev.snapshots, snapshot],
    } : null);
  }, [dna, evolution]);

  const value: SkillDNAContextType = {
    // State
    dna,
    stats,
    recommendations,
    comparison,
    evolution,
    isLoading,
    error,
    
    // Actions
    calculateDNA,
    refreshDNA,
    generateInsights,
    updateInsight,
    getRecommendations,
    dismissRecommendation,
    compareWithRole,
    clearComparison,
    loadEvolution,
    addSnapshot,
    calculateStats,
    getStrengthLevel,
    getDomainColor,
  };

  return (
    <SkillDNAContext.Provider value={value}>
      {children}
    </SkillDNAContext.Provider>
  );
}

export function useSkillDNA() {
  const context = useContext(SkillDNAContext);
  if (!context) {
    throw new Error('useSkillDNA must be used within SkillDNAProvider');
  }
  return context;
}
