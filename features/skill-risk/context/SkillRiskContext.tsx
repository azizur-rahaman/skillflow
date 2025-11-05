/**
 * Skill Risk Score - Context & State Management
 * 
 * Provides risk assessment data and actions for skill obsolescence tracking
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  SkillRiskScore,
  SkillRiskState,
  SkillRiskActions,
  RiskLevel,
  TrendDirection,
  TrendPeriod,
  RiskFactor,
  RecommendationAction,
  RecommendationPriority,
  RiskFilter,
  getRiskLevel,
} from '../types/skill-risk.types';

// Mock risk data for demonstration
const mockRiskScores: SkillRiskScore[] = [
  {
    skillId: 'jquery',
    skillName: 'jQuery',
    riskScore: 85,
    riskLevel: RiskLevel.CRITICAL,
    trend: {
      direction: TrendDirection.DECLINING,
      changePercentage: -12,
      period: TrendPeriod.YEAR,
      history: [
        { date: new Date('2024-11-01'), riskScore: 73 },
        { date: new Date('2024-12-01'), riskScore: 76 },
        { date: new Date('2025-01-01'), riskScore: 78 },
        { date: new Date('2025-02-01'), riskScore: 79 },
        { date: new Date('2025-03-01'), riskScore: 80, event: 'Major frameworks shift' },
        { date: new Date('2025-04-01'), riskScore: 81 },
        { date: new Date('2025-05-01'), riskScore: 82 },
        { date: new Date('2025-06-01'), riskScore: 83 },
        { date: new Date('2025-07-01'), riskScore: 84 },
        { date: new Date('2025-08-01'), riskScore: 84 },
        { date: new Date('2025-09-01'), riskScore: 85 },
        { date: new Date('2025-10-01'), riskScore: 85 },
      ],
    },
    factors: [
      {
        factor: RiskFactor.MARKET_DEMAND,
        weight: 35,
        description: 'Job postings decreased 65% in the last year',
        severity: 'critical',
      },
      {
        factor: RiskFactor.TECHNOLOGY_SHIFT,
        weight: 30,
        description: 'Modern frameworks (React, Vue) have replaced jQuery in most use cases',
        severity: 'critical',
      },
      {
        factor: RiskFactor.INDUSTRY_ADOPTION,
        weight: 20,
        description: 'Only 12% of new projects use jQuery',
        severity: 'high',
      },
      {
        factor: RiskFactor.EMERGING_COMPETITION,
        weight: 15,
        description: 'Native browser APIs now cover most jQuery functionality',
        severity: 'high',
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        action: RecommendationAction.TRANSITION,
        priority: RecommendationPriority.URGENT,
        title: 'Transition to React',
        description: 'React is the most in-demand frontend framework with 95% market growth. Transition will reduce your risk by 60%.',
        skillsToLearn: ['React', 'JSX', 'React Hooks', 'Component Architecture'],
        estimatedTime: '2-3 months',
        resources: [
          { title: 'React Official Tutorial', url: '#', type: 'documentation' },
          { title: 'Complete React Course', url: '#', type: 'course' },
        ],
        impactScore: 60,
      },
      {
        id: 'rec-2',
        action: RecommendationAction.UPSKILL,
        priority: RecommendationPriority.HIGH,
        title: 'Learn Modern JavaScript (ES6+)',
        description: 'Master modern JavaScript features to replace jQuery patterns',
        skillsToLearn: ['ES6+', 'DOM APIs', 'Fetch API', 'Async/Await'],
        estimatedTime: '1-2 months',
        resources: [
          { title: 'JavaScript.info', url: '#', type: 'documentation' },
          { title: 'Modern JavaScript Course', url: '#', type: 'course' },
        ],
        impactScore: 40,
      },
    ],
    lastAssessment: new Date('2025-10-01'),
    nextAssessment: new Date('2025-11-01'),
    confidence: 94,
  },
  {
    skillId: 'angular-js',
    skillName: 'AngularJS',
    riskScore: 72,
    riskLevel: RiskLevel.HIGH,
    trend: {
      direction: TrendDirection.DECLINING,
      changePercentage: -8,
      period: TrendPeriod.YEAR,
      history: [
        { date: new Date('2024-11-01'), riskScore: 64 },
        { date: new Date('2024-12-01'), riskScore: 65 },
        { date: new Date('2025-01-01'), riskScore: 66 },
        { date: new Date('2025-02-01'), riskScore: 67 },
        { date: new Date('2025-03-01'), riskScore: 68 },
        { date: new Date('2025-04-01'), riskScore: 69 },
        { date: new Date('2025-05-01'), riskScore: 70 },
        { date: new Date('2025-06-01'), riskScore: 70, event: 'LTS support ending' },
        { date: new Date('2025-07-01'), riskScore: 71 },
        { date: new Date('2025-08-01'), riskScore: 71 },
        { date: new Date('2025-09-01'), riskScore: 72 },
        { date: new Date('2025-10-01'), riskScore: 72 },
      ],
    },
    factors: [
      {
        factor: RiskFactor.MARKET_DEMAND,
        weight: 30,
        description: 'Demand down 45% as companies migrate to Angular 2+',
        severity: 'high',
      },
      {
        factor: RiskFactor.TECHNOLOGY_SHIFT,
        weight: 25,
        description: 'Angular (2+) is completely different framework',
        severity: 'high',
      },
      {
        factor: RiskFactor.CERTIFICATION_AGE,
        weight: 25,
        description: 'LTS support ended, security vulnerabilities',
        severity: 'critical',
      },
      {
        factor: RiskFactor.INDUSTRY_ADOPTION,
        weight: 20,
        description: 'Legacy maintenance only, no new projects',
        severity: 'high',
      },
    ],
    recommendations: [
      {
        id: 'rec-3',
        action: RecommendationAction.UPSKILL,
        priority: RecommendationPriority.HIGH,
        title: 'Upgrade to Angular (2+)',
        description: 'Modern Angular is a complete rewrite with TypeScript, better performance, and active support',
        skillsToLearn: ['Angular', 'TypeScript', 'RxJS', 'Angular CLI'],
        estimatedTime: '3-4 months',
        impactScore: 55,
      },
    ],
    lastAssessment: new Date('2025-10-01'),
    nextAssessment: new Date('2025-11-01'),
    confidence: 91,
  },
  {
    skillId: 'react',
    skillName: 'React',
    riskScore: 15,
    riskLevel: RiskLevel.LOW,
    trend: {
      direction: TrendDirection.IMPROVING,
      changePercentage: 3,
      period: TrendPeriod.YEAR,
      history: [
        { date: new Date('2024-11-01'), riskScore: 18 },
        { date: new Date('2024-12-01'), riskScore: 18 },
        { date: new Date('2025-01-01'), riskScore: 17 },
        { date: new Date('2025-02-01'), riskScore: 17 },
        { date: new Date('2025-03-01'), riskScore: 16 },
        { date: new Date('2025-04-01'), riskScore: 16 },
        { date: new Date('2025-05-01'), riskScore: 15 },
        { date: new Date('2025-06-01'), riskScore: 15 },
        { date: new Date('2025-07-01'), riskScore: 15 },
        { date: new Date('2025-08-01'), riskScore: 15 },
        { date: new Date('2025-09-01'), riskScore: 15 },
        { date: new Date('2025-10-01'), riskScore: 15 },
      ],
    },
    factors: [
      {
        factor: RiskFactor.MARKET_DEMAND,
        weight: 10,
        description: 'Consistently high demand, 95% growth in job postings',
        severity: 'low',
      },
      {
        factor: RiskFactor.INDUSTRY_ADOPTION,
        weight: 5,
        description: 'Used by Meta, Netflix, Airbnb, and thousands of companies',
        severity: 'low',
      },
    ],
    recommendations: [
      {
        id: 'rec-4',
        action: RecommendationAction.UPSKILL,
        priority: RecommendationPriority.MEDIUM,
        title: 'Stay Current with React 19',
        description: 'Keep learning new React features like Server Components and Concurrent Features',
        skillsToLearn: ['React Server Components', 'React 19 Features', 'Next.js 15'],
        estimatedTime: '1 month',
        impactScore: 10,
      },
    ],
    lastAssessment: new Date('2025-10-01'),
    nextAssessment: new Date('2025-11-01'),
    confidence: 96,
  },
  {
    skillId: 'php',
    skillName: 'PHP',
    riskScore: 42,
    riskLevel: RiskLevel.MODERATE,
    trend: {
      direction: TrendDirection.STABLE,
      changePercentage: 0,
      period: TrendPeriod.YEAR,
      history: [
        { date: new Date('2024-11-01'), riskScore: 42 },
        { date: new Date('2024-12-01'), riskScore: 42 },
        { date: new Date('2025-01-01'), riskScore: 42 },
        { date: new Date('2025-02-01'), riskScore: 42 },
        { date: new Date('2025-03-01'), riskScore: 42 },
        { date: new Date('2025-04-01'), riskScore: 42 },
        { date: new Date('2025-05-01'), riskScore: 42 },
        { date: new Date('2025-06-01'), riskScore: 42 },
        { date: new Date('2025-07-01'), riskScore: 42 },
        { date: new Date('2025-08-01'), riskScore: 42 },
        { date: new Date('2025-09-01'), riskScore: 42 },
        { date: new Date('2025-10-01'), riskScore: 42 },
      ],
    },
    factors: [
      {
        factor: RiskFactor.MARKET_DEMAND,
        weight: 20,
        description: 'Stable demand in WordPress and Laravel ecosystems',
        severity: 'medium',
      },
      {
        factor: RiskFactor.TECHNOLOGY_SHIFT,
        weight: 15,
        description: 'Node.js, Python, and Go gaining backend market share',
        severity: 'medium',
      },
      {
        factor: RiskFactor.INDUSTRY_ADOPTION,
        weight: 7,
        description: 'Still powers 77% of websites (WordPress)',
        severity: 'low',
      },
    ],
    recommendations: [
      {
        id: 'rec-5',
        action: RecommendationAction.UPSKILL,
        priority: RecommendationPriority.MEDIUM,
        title: 'Add Modern Backend Skills',
        description: 'Complement PHP with Node.js or Python for better opportunities',
        skillsToLearn: ['Node.js', 'Express', 'Python', 'FastAPI'],
        estimatedTime: '2-3 months',
        impactScore: 25,
      },
      {
        id: 'rec-6',
        action: RecommendationAction.PRACTICE,
        priority: RecommendationPriority.LOW,
        title: 'Modernize PHP Knowledge',
        description: 'Learn modern PHP 8.x features and frameworks like Laravel',
        skillsToLearn: ['PHP 8.x', 'Laravel', 'Composer'],
        estimatedTime: '1 month',
        impactScore: 15,
      },
    ],
    lastAssessment: new Date('2025-10-01'),
    nextAssessment: new Date('2025-11-01'),
    confidence: 88,
  },
  {
    skillId: 'typescript',
    skillName: 'TypeScript',
    riskScore: 8,
    riskLevel: RiskLevel.LOW,
    trend: {
      direction: TrendDirection.IMPROVING,
      changePercentage: 5,
      period: TrendPeriod.YEAR,
      history: [
        { date: new Date('2024-11-01'), riskScore: 13 },
        { date: new Date('2024-12-01'), riskScore: 12 },
        { date: new Date('2025-01-01'), riskScore: 12 },
        { date: new Date('2025-02-01'), riskScore: 11 },
        { date: new Date('2025-03-01'), riskScore: 11 },
        { date: new Date('2025-04-01'), riskScore: 10 },
        { date: new Date('2025-05-01'), riskScore: 10 },
        { date: new Date('2025-06-01'), riskScore: 9 },
        { date: new Date('2025-07-01'), riskScore: 9 },
        { date: new Date('2025-08-01'), riskScore: 8 },
        { date: new Date('2025-09-01'), riskScore: 8 },
        { date: new Date('2025-10-01'), riskScore: 8 },
      ],
    },
    factors: [
      {
        factor: RiskFactor.MARKET_DEMAND,
        weight: 5,
        description: 'Explosive growth, now industry standard for JavaScript projects',
        severity: 'low',
      },
      {
        factor: RiskFactor.INDUSTRY_ADOPTION,
        weight: 3,
        description: 'Adopted by Google, Microsoft, Airbnb, Slack, and most major companies',
        severity: 'low',
      },
    ],
    recommendations: [
      {
        id: 'rec-7',
        action: RecommendationAction.MONITOR,
        priority: RecommendationPriority.LOW,
        title: 'Stay Updated',
        description: 'TypeScript is thriving - continue using it and stay current with new releases',
        estimatedTime: 'Ongoing',
        impactScore: 5,
      },
    ],
    lastAssessment: new Date('2025-10-01'),
    nextAssessment: new Date('2025-11-01'),
    confidence: 98,
  },
];

// Calculate summary statistics
const calculateSummary = (scores: SkillRiskScore[]) => {
  const totalSkills = scores.length;
  const averageRiskScore = scores.reduce((sum, s) => sum + s.riskScore, 0) / totalSkills;
  
  const skillsByRiskLevel = {
    [RiskLevel.LOW]: scores.filter(s => s.riskLevel === RiskLevel.LOW).length,
    [RiskLevel.MODERATE]: scores.filter(s => s.riskLevel === RiskLevel.MODERATE).length,
    [RiskLevel.HIGH]: scores.filter(s => s.riskLevel === RiskLevel.HIGH).length,
    [RiskLevel.CRITICAL]: scores.filter(s => s.riskLevel === RiskLevel.CRITICAL).length,
  };
  
  const skillsAtRisk = skillsByRiskLevel[RiskLevel.HIGH] + skillsByRiskLevel[RiskLevel.CRITICAL];
  const trendingUp = scores.filter(s => s.trend.direction === TrendDirection.DECLINING).length;
  const trendingDown = scores.filter(s => s.trend.direction === TrendDirection.IMPROVING).length;
  
  return {
    totalSkills,
    averageRiskScore,
    skillsByRiskLevel,
    skillsAtRisk,
    trendingUp,
    trendingDown,
  };
};

const defaultFilter: RiskFilter = {
  riskLevels: [RiskLevel.LOW, RiskLevel.MODERATE, RiskLevel.HIGH, RiskLevel.CRITICAL],
  trendDirections: [TrendDirection.IMPROVING, TrendDirection.STABLE, TrendDirection.DECLINING],
  sortBy: 'riskScore',
  sortOrder: 'desc',
};

interface SkillRiskContextValue {
  state: SkillRiskState;
  actions: SkillRiskActions;
}

const SkillRiskContext = createContext<SkillRiskContextValue | undefined>(undefined);

export const SkillRiskProvider = ({ children }: { children: ReactNode }) => {
  const [riskScores] = useState<SkillRiskScore[]>(mockRiskScores);
  const [selectedSkill, setSelectedSkill] = useState<SkillRiskScore | null>(null);
  const [filter, setFilter] = useState<RiskFilter>(defaultFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const summary = calculateSummary(riskScores);
  
  const state: SkillRiskState = {
    riskScores,
    selectedSkill,
    filter,
    summary,
    isLoading,
    error,
  };
  
  const actions: SkillRiskActions = {
    selectSkill: (skill: SkillRiskScore) => {
      setSelectedSkill(skill);
    },
    
    updateFilter: (newFilter: Partial<RiskFilter>) => {
      setFilter((prev) => ({ ...prev, ...newFilter }));
    },
    
    refreshRiskScores: async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // In real app, fetch fresh data here
      } catch (err) {
        setError('Failed to refresh risk scores');
      } finally {
        setIsLoading(false);
      }
    },
    
    dismissRecommendation: (skillId: string, recommendationId: string) => {
      console.log(`Dismissed recommendation ${recommendationId} for skill ${skillId}`);
      // In real app, update state and persist to backend
    },
    
    acceptRecommendation: (skillId: string, recommendationId: string) => {
      console.log(`Accepted recommendation ${recommendationId} for skill ${skillId}`);
      // In real app, create learning path or enroll in course
    },
  };
  
  return (
    <SkillRiskContext.Provider value={{ state, actions }}>
      {children}
    </SkillRiskContext.Provider>
  );
};

export const useSkillRisk = () => {
  const context = useContext(SkillRiskContext);
  if (!context) {
    throw new Error('useSkillRisk must be used within SkillRiskProvider');
  }
  return context;
};
