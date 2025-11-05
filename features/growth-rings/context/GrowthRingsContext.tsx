/**
 * Growth Rings Context
 * 
 * State management for skill progression visualization.
 * Provides multi-month growth data with domain categorization.
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  SkillDomain,
  TimePeriod,
  GrowthTrend,
  AnimationState,
  DOMAIN_COLORS,
} from '../types/growth-rings.types';
import type {
  GrowthRingsContextType,
  GrowthRingsState,
  GrowthRingsActions,
  TimeSegment,
  GrowthRing,
  SkillProgression,
  DomainStats,
  GrowthInsight,
  RingVisualizationConfig,
} from '../types/growth-rings.types';

// ============================================================================
// Context
// ============================================================================

const GrowthRingsContext = createContext<GrowthRingsContextType | undefined>(undefined);

// ============================================================================
// Mock Data Generators
// ============================================================================

const generateMockTimeSegments = (): TimeSegment[] => {
  const segments: TimeSegment[] = [];
  const now = new Date('2025-11-05');
  
  // Generate 6 months of data
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    segments.push({
      id: `segment-${i}`,
      label,
      startDate,
      endDate,
      period: TimePeriod.MONTH,
      rings: generateMonthRings(date, 6 - i),
      totalGrowth: 0,
      dominantDomain: SkillDomain.FRONTEND,
    });
  }
  
  // Calculate total growth for each segment
  segments.forEach(segment => {
    segment.totalGrowth = segment.rings.reduce((sum, ring) => sum + ring.growthPercentage, 0);
  });
  
  return segments;
};

const generateMonthRings = (monthDate: Date, segmentIndex: number): GrowthRing[] => {
  const skills = [
    { name: 'React', domain: SkillDomain.FRONTEND },
    { name: 'TypeScript', domain: SkillDomain.FRONTEND },
    { name: 'Node.js', domain: SkillDomain.BACKEND },
    { name: 'Python', domain: SkillDomain.BACKEND },
    { name: 'Machine Learning', domain: SkillDomain.AI_ML },
    { name: 'AWS', domain: SkillDomain.CLOUD },
    { name: 'Docker', domain: SkillDomain.DEVOPS },
    { name: 'Figma', domain: SkillDomain.DESIGN },
  ];
  
  const rings: GrowthRing[] = [];
  const baseRadius = 80;
  const radiusIncrement = 35;
  
  skills.forEach((skill, index) => {
    const baseStrength = 60 + segmentIndex * 3 + index * 2;
    const growthRate = 2 + Math.random() * 8;
    const previousStrength = Math.max(0, baseStrength - growthRate);
    const currentStrength = Math.min(100, baseStrength + growthRate);
    
    const trend = growthRate > 6 ? GrowthTrend.RAPID 
                : growthRate > 4 ? GrowthTrend.STEADY 
                : growthRate > 2 ? GrowthTrend.SLOW 
                : GrowthTrend.STAGNANT;
    
    rings.push({
      id: `ring-${segmentIndex}-${index}`,
      skillName: skill.name,
      domain: skill.domain,
      timestamp: monthDate,
      strengthValue: currentStrength,
      previousStrength,
      growthPercentage: growthRate,
      trend,
      radius: baseRadius + index * radiusIncrement,
      color: DOMAIN_COLORS[skill.domain],
      label: skill.name,
    });
  });
  
  return rings;
};

const generateSkillProgressions = (): SkillProgression[] => {
  const skills = [
    { name: 'React', domain: SkillDomain.FRONTEND },
    { name: 'TypeScript', domain: SkillDomain.FRONTEND },
    { name: 'Python', domain: SkillDomain.BACKEND },
    { name: 'Machine Learning', domain: SkillDomain.AI_ML },
  ];
  
  return skills.map(skill => {
    const dataPoints = [];
    let strength = 65;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date('2025-11-05');
      date.setMonth(date.getMonth() - i);
      
      const growthRate = 2 + Math.random() * 6;
      strength = Math.min(100, strength + growthRate);
      
      dataPoints.push({
        date,
        strength,
        growthRate,
      });
    }
    
    return {
      skillName: skill.name,
      domain: skill.domain,
      dataPoints,
      overallGrowth: dataPoints[dataPoints.length - 1].strength - dataPoints[0].strength,
      peakStrength: Math.max(...dataPoints.map(d => d.strength)),
      currentStrength: dataPoints[dataPoints.length - 1].strength,
    };
  });
};

const generateDomainStats = (): DomainStats[] => [
  {
    domain: SkillDomain.FRONTEND,
    skillCount: 8,
    averageGrowth: 12.5,
    totalStrength: 720,
    color: DOMAIN_COLORS[SkillDomain.FRONTEND],
    trend: GrowthTrend.RAPID,
  },
  {
    domain: SkillDomain.BACKEND,
    skillCount: 6,
    averageGrowth: 10.2,
    totalStrength: 580,
    color: DOMAIN_COLORS[SkillDomain.BACKEND],
    trend: GrowthTrend.STEADY,
  },
  {
    domain: SkillDomain.AI_ML,
    skillCount: 5,
    averageGrowth: 15.8,
    totalStrength: 420,
    color: DOMAIN_COLORS[SkillDomain.AI_ML],
    trend: GrowthTrend.RAPID,
  },
  {
    domain: SkillDomain.CLOUD,
    skillCount: 4,
    averageGrowth: 8.5,
    totalStrength: 340,
    color: DOMAIN_COLORS[SkillDomain.CLOUD],
    trend: GrowthTrend.STEADY,
  },
];

const generateInsights = (): GrowthInsight[] => [
  {
    id: 'insight-1',
    type: 'milestone',
    title: 'React Mastery Achieved',
    description: 'Your React skills have grown 25% in the last 3 months, reaching expert level',
    timestamp: new Date('2025-11-01'),
    relatedSkills: ['React', 'TypeScript'],
    icon: 'Award',
    color: '#6366F1',
  },
  {
    id: 'insight-2',
    type: 'acceleration',
    title: 'AI/ML Growth Spike',
    description: 'Machine Learning skills accelerating at 15.8% per month',
    timestamp: new Date('2025-10-15'),
    relatedSkills: ['Machine Learning', 'Python'],
    icon: 'TrendingUp',
    color: '#22D3EE',
  },
  {
    id: 'insight-3',
    type: 'streak',
    title: 'Consistent Growth Streak',
    description: '6 months of continuous skill development across all domains',
    timestamp: new Date('2025-10-01'),
    relatedSkills: [],
    icon: 'Flame',
    color: '#F59E0B',
  },
];

// ============================================================================
// Initial State
// ============================================================================

const defaultConfig: RingVisualizationConfig = {
  centerX: 300,
  centerY: 300,
  minRadius: 80,
  maxRadius: 400,
  ringThickness: 28,
  ringGap: 7,
  showLabels: true,
  showTooltips: true,
  animationDuration: 800,
  colorScheme: 'domain',
};

const initialState: GrowthRingsState = {
  timeSegments: generateMockTimeSegments(),
  selectedSegment: null,
  skillProgressions: generateSkillProgressions(),
  domainStats: generateDomainStats(),
  insights: generateInsights(),
  timePeriod: TimePeriod.MONTH,
  selectedDomain: null,
  hoveredRing: null,
  isLoading: false,
  animationState: AnimationState.IDLE,
  config: defaultConfig,
};

// ============================================================================
// Provider Component
// ============================================================================

export function GrowthRingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GrowthRingsState>(initialState);

  const selectTimeSegment = useCallback((segmentId: string) => {
    setState(prev => ({
      ...prev,
      selectedSegment: prev.timeSegments.find(s => s.id === segmentId) || null,
    }));
  }, []);

  const setTimePeriod = useCallback((period: TimePeriod) => {
    setState(prev => ({ ...prev, timePeriod: period }));
  }, []);

  const filterByDomain = useCallback((domain: SkillDomain | null) => {
    setState(prev => ({ ...prev, selectedDomain: domain }));
  }, []);

  const setHoveredRing = useCallback((ring: GrowthRing | null) => {
    setState(prev => ({
      ...prev,
      hoveredRing: ring,
      animationState: ring ? AnimationState.HIGHLIGHTED : AnimationState.IDLE,
    }));
  }, []);

  const refreshData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setState(prev => ({
      ...prev,
      timeSegments: generateMockTimeSegments(),
      skillProgressions: generateSkillProgressions(),
      domainStats: generateDomainStats(),
      insights: generateInsights(),
      isLoading: false,
    }));
  }, []);

  const exportData = useCallback((format: 'png' | 'svg' | 'json') => {
    console.log(`Exporting growth rings as ${format}...`);
    // Implementation would handle actual export
  }, []);

  const updateConfig = useCallback((configUpdate: Partial<RingVisualizationConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...configUpdate },
    }));
  }, []);

  const toggleAnimation = useCallback(() => {
    setState(prev => ({
      ...prev,
      animationState: prev.animationState === AnimationState.EXPANDING 
        ? AnimationState.IDLE 
        : AnimationState.EXPANDING,
    }));
  }, []);

  const actions: GrowthRingsActions = {
    selectTimeSegment,
    setTimePeriod,
    filterByDomain,
    setHoveredRing,
    refreshData,
    exportData,
    updateConfig,
    toggleAnimation,
  };

  const value: GrowthRingsContextType = {
    state,
    actions,
  };

  return (
    <GrowthRingsContext.Provider value={value}>
      {children}
    </GrowthRingsContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useGrowthRings() {
  const context = useContext(GrowthRingsContext);
  if (!context) {
    throw new Error('useGrowthRings must be used within GrowthRingsProvider');
  }
  return context;
}
