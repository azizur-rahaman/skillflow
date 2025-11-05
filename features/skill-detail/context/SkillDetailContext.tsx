/**
 * Skill Detail Context
 * 
 * State management for comprehensive skill detail page with evidence,
 * endorsements, and learning resources.
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  SkillDetailContextType,
  SkillDetailState,
  SkillDetailActions,
  SkillDetail,
  EvidenceItem,
  Endorsement,
  LearningResource,
  SkillMilestone,
  SkillGrowth,
  MarketInsights,
  SkillTab,
  EvidenceType,
  ProficiencyLevel,
  ResourceType,
  TrendDirection,
  getProficiencyLevel,
} from '../types/skill-detail.types';

// ============================================================================
// Mock Data Generation
// ============================================================================

const generateMockSkillDetail = (): SkillDetail => {
  return {
    id: 'react',
    name: 'React',
    description: 'A JavaScript library for building user interfaces. React makes it painless to create interactive UIs with component-based architecture and efficient rendering.',
    category: 'Frontend Development',
    strength: 92,
    proficiencyLevel: getProficiencyLevel(92),
    verified: true,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    yearsOfExperience: 4.5,
    stats: {
      totalProjects: 18,
      totalHours: 2400,
      endorsements: 12,
      certifications: 3,
      marketDemand: 95,
      avgSalaryImpact: 25,
    },
    trend: {
      direction: TrendDirection.RISING,
      changePercentage: 8,
      sparklineData: [75, 78, 80, 82, 84, 85, 87, 88, 89, 90, 91, 92],
    },
    relatedSkills: [
      { id: 'typescript', name: 'TypeScript', strength: 88, relationship: 'complementary' },
      { id: 'nextjs', name: 'Next.js', strength: 90, relationship: 'advanced' },
      { id: 'javascript', name: 'JavaScript', strength: 95, relationship: 'prerequisite' },
      { id: 'tailwind', name: 'Tailwind CSS', strength: 95, relationship: 'complementary' },
    ],
    tags: ['frontend', 'javascript', 'ui', 'library', 'spa', 'verified'],
  };
};

const generateMockEvidence = (): EvidenceItem[] => {
  return [
    {
      id: 'ev-1',
      type: EvidenceType.PROJECT,
      title: 'E-commerce Platform Redesign',
      description: 'Led the frontend development of a complete e-commerce platform redesign using React, Redux, and TypeScript. Improved performance by 40% and increased conversion rate by 25%.',
      date: new Date(2025, 8, 15),
      verified: true,
      verifiedBy: 'TechCorp Engineering',
      metadata: {
        organization: 'TechCorp',
        role: 'Senior Frontend Developer',
        duration: '6 months',
        technologies: ['React', 'Redux', 'TypeScript', 'Tailwind CSS'],
        impact: 'Increased conversion rate by 25%',
        metrics: [
          { label: 'Performance', value: '+40%' },
          { label: 'Conversion', value: '+25%' },
          { label: 'Users', value: '500K+' },
        ],
      },
    },
    {
      id: 'ev-2',
      type: EvidenceType.CERTIFICATION,
      title: 'Meta React Advanced Certification',
      description: 'Advanced certification covering React patterns, performance optimization, testing strategies, and modern React features including hooks and concurrent mode.',
      date: new Date(2025, 5, 20),
      verified: true,
      verifiedBy: 'Meta',
      metadata: {
        organization: 'Meta (Coursera)',
        duration: '8 weeks',
      },
    },
    {
      id: 'ev-3',
      type: EvidenceType.PROJECT,
      title: 'Real-time Analytics Dashboard',
      description: 'Built a real-time analytics dashboard with React, Socket.io, and D3.js. Handles 10,000+ concurrent users with live data updates and interactive visualizations.',
      date: new Date(2025, 7, 10),
      verified: true,
      metadata: {
        organization: 'DataFlow Inc',
        role: 'Lead Developer',
        duration: '4 months',
        technologies: ['React', 'Socket.io', 'D3.js', 'Node.js'],
        metrics: [
          { label: 'Concurrent Users', value: '10K+' },
          { label: 'Response Time', value: '<100ms' },
        ],
      },
    },
    {
      id: 'ev-4',
      type: EvidenceType.CONTRIBUTION,
      title: 'Open Source: React Component Library',
      description: 'Core contributor to a popular React component library with 15K+ GitHub stars. Contributed accessibility improvements and custom hooks.',
      date: new Date(2025, 3, 5),
      verified: true,
      metadata: {
        organization: 'Open Source Community',
        technologies: ['React', 'TypeScript', 'Storybook'],
      },
    },
    {
      id: 'ev-5',
      type: EvidenceType.AWARD,
      title: 'Best Frontend Innovation Award',
      description: 'Received company-wide recognition for implementing cutting-edge React patterns that reduced bundle size by 60% and improved initial load time.',
      date: new Date(2025, 1, 15),
      verified: true,
      verifiedBy: 'TechCorp Awards',
      metadata: {
        organization: 'TechCorp',
        impact: 'Reduced bundle size by 60%',
      },
    },
  ];
};

const generateMockEndorsements = (): Endorsement[] => {
  return [
    {
      id: 'end-1',
      endorserName: 'Sarah Johnson',
      endorserRole: 'Engineering Manager',
      endorserCompany: 'TechCorp',
      rating: 5,
      testimonial: 'Exceptional React developer with deep understanding of performance optimization and modern patterns. Consistently delivers high-quality, maintainable code.',
      date: new Date(2025, 9, 1),
      relationship: 'manager',
      projectContext: 'E-commerce Platform',
      verified: true,
    },
    {
      id: 'end-2',
      endorserName: 'Michael Chen',
      endorserRole: 'Senior Frontend Engineer',
      endorserCompany: 'DataFlow Inc',
      rating: 5,
      testimonial: 'One of the best React developers I\'ve worked with. Great at solving complex state management challenges and mentoring junior developers.',
      date: new Date(2025, 8, 15),
      relationship: 'colleague',
      verified: true,
    },
    {
      id: 'end-3',
      endorserName: 'Emily Rodriguez',
      endorserRole: 'Product Manager',
      endorserCompany: 'TechCorp',
      rating: 5,
      testimonial: 'Incredible ability to translate designs into pixel-perfect, performant React applications. Always collaborative and proactive.',
      date: new Date(2025, 7, 20),
      relationship: 'colleague',
      projectContext: 'Analytics Dashboard',
      verified: true,
    },
    {
      id: 'end-4',
      endorserName: 'David Kim',
      endorserRole: 'Tech Lead',
      endorserCompany: 'StartupX',
      rating: 4,
      testimonial: 'Strong React skills with excellent component architecture. Helped us scale our application to handle millions of users.',
      date: new Date(2025, 6, 10),
      relationship: 'peer',
      verified: true,
    },
  ];
};

const generateMockLearningResources = (): LearningResource[] => {
  return [
    {
      id: 'lr-1',
      type: ResourceType.COURSE,
      title: 'Advanced React Patterns',
      description: 'Master advanced React patterns including render props, higher-order components, compound components, and custom hooks.',
      provider: 'Frontend Masters',
      duration: '6 hours',
      difficulty: 'advanced',
      rating: 4.8,
      enrollments: 12500,
      url: 'https://frontendmasters.com/courses/advanced-react-patterns',
      price: 39,
      currency: 'USD',
      relevanceScore: 95,
      recommendedFor: ProficiencyLevel.ADVANCED,
    },
    {
      id: 'lr-2',
      type: ResourceType.COURSE,
      title: 'React Performance Optimization',
      description: 'Learn techniques to optimize React applications for maximum performance including memoization, code splitting, and lazy loading.',
      provider: 'Udemy',
      duration: '8 hours',
      difficulty: 'advanced',
      rating: 4.7,
      enrollments: 8200,
      url: 'https://udemy.com/react-performance',
      price: 49,
      currency: 'USD',
      progress: 60,
      relevanceScore: 92,
      recommendedFor: ProficiencyLevel.ADVANCED,
    },
    {
      id: 'lr-3',
      type: ResourceType.DOCUMENTATION,
      title: 'React Beta Docs',
      description: 'Official React documentation covering all features, APIs, and best practices with interactive examples.',
      provider: 'React Team',
      duration: 'Self-paced',
      difficulty: 'intermediate',
      rating: 5.0,
      enrollments: 1000000,
      url: 'https://react.dev',
      price: 0,
      currency: 'USD',
      relevanceScore: 100,
      recommendedFor: ProficiencyLevel.INTERMEDIATE,
    },
    {
      id: 'lr-4',
      type: ResourceType.PROJECT,
      title: 'Build a Full-Stack App with React',
      description: 'Hands-on project building a complete full-stack application with React frontend and Node.js backend.',
      provider: 'Codecademy',
      duration: '20 hours',
      difficulty: 'intermediate',
      rating: 4.6,
      enrollments: 15000,
      url: 'https://codecademy.com/react-fullstack',
      price: 25,
      currency: 'USD',
      relevanceScore: 88,
      recommendedFor: ProficiencyLevel.INTERMEDIATE,
    },
  ];
};

const generateMockMilestones = (): SkillMilestone[] => {
  return [
    {
      id: 'ms-1',
      title: 'First React Project',
      description: 'Built first production React application',
      date: new Date(2021, 2, 15),
      type: 'project',
    },
    {
      id: 'ms-2',
      title: 'Meta React Certification',
      description: 'Completed advanced React certification',
      date: new Date(2025, 5, 20),
      type: 'certification',
    },
    {
      id: 'ms-3',
      title: 'Expert Level Reached',
      description: 'Achieved expert proficiency (>80%)',
      date: new Date(2024, 10, 1),
      type: 'achievement',
    },
    {
      id: 'ms-4',
      title: '10 Endorsements',
      description: 'Received 10+ peer endorsements',
      date: new Date(2025, 8, 15),
      type: 'endorsement',
    },
  ];
};

const generateMockGrowth = (): SkillGrowth => {
  return {
    skillId: 'react',
    history: [
      { date: new Date(2024, 10, 1), strength: 75 },
      { date: new Date(2024, 11, 1), strength: 78 },
      { date: new Date(2025, 0, 1), strength: 80 },
      { date: new Date(2025, 1, 1), strength: 82 },
      { date: new Date(2025, 2, 1), strength: 84 },
      { date: new Date(2025, 3, 1), strength: 85 },
      { date: new Date(2025, 4, 1), strength: 87, event: 'Completed Advanced Course' },
      { date: new Date(2025, 5, 1), strength: 88 },
      { date: new Date(2025, 6, 1), strength: 89 },
      { date: new Date(2025, 7, 1), strength: 90 },
      { date: new Date(2025, 8, 1), strength: 91 },
      { date: new Date(2025, 9, 1), strength: 92 },
    ],
    projectedGrowth: [
      { month: 'Nov 2025', projectedStrength: 93 },
      { month: 'Dec 2025', projectedStrength: 94 },
      { month: 'Jan 2026', projectedStrength: 95 },
      { month: 'Feb 2026', projectedStrength: 96 },
    ],
  };
};

const generateMockMarketInsights = (): MarketInsights => {
  return {
    demand: 95,
    trend: TrendDirection.RISING,
    avgSalary: {
      min: 90000,
      max: 180000,
      median: 125000,
      currency: 'USD',
    },
    jobOpenings: 45000,
    topCompanies: ['Meta', 'Netflix', 'Airbnb', 'Amazon', 'Google'],
    geographicDemand: [
      { location: 'San Francisco', demand: 98 },
      { location: 'New York', demand: 95 },
      { location: 'Seattle', demand: 92 },
      { location: 'Austin', demand: 88 },
    ],
  };
};

// ============================================================================
// Context
// ============================================================================

const SkillDetailContext = createContext<SkillDetailContextType | undefined>(undefined);

interface SkillDetailProviderProps {
  children: ReactNode;
}

export const SkillDetailProvider = ({ children }: SkillDetailProviderProps) => {
  const [skill] = useState<SkillDetail | null>(generateMockSkillDetail());
  const [evidence] = useState<EvidenceItem[]>(generateMockEvidence());
  const [endorsements] = useState<Endorsement[]>(generateMockEndorsements());
  const [learningResources] = useState<LearningResource[]>(generateMockLearningResources());
  const [milestones] = useState<SkillMilestone[]>(generateMockMilestones());
  const [growth] = useState<SkillGrowth | null>(generateMockGrowth());
  const [marketInsights] = useState<MarketInsights | null>(generateMockMarketInsights());
  
  const [activeTab, setActiveTab] = useState<SkillTab>(SkillTab.OVERVIEW);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const handleSetActiveTab = useCallback((tab: SkillTab) => {
    setActiveTab(tab);
  }, []);
  
  const handleSelectEvidence = useCallback((item: EvidenceItem | null) => {
    setSelectedEvidence(item);
  }, []);
  
  const handleNextCarouselItem = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % evidence.length);
  }, [evidence.length]);
  
  const handlePrevCarouselItem = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + evidence.length) % evidence.length);
  }, [evidence.length]);
  
  const handleRefreshSkillData = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);
  
  const handleAddEndorsement = useCallback((endorsement: Omit<Endorsement, 'id'>) => {
    console.log('Adding endorsement:', endorsement);
  }, []);
  
  const handleEnrollInResource = useCallback((resourceId: string) => {
    console.log('Enrolling in resource:', resourceId);
  }, []);
  
  const state: SkillDetailState = {
    skill,
    evidence,
    endorsements,
    learningResources,
    milestones,
    growth,
    marketInsights,
    activeTab,
    selectedEvidence,
    isLoading,
    carouselIndex,
  };
  
  const actions: SkillDetailActions = {
    setActiveTab: handleSetActiveTab,
    selectEvidence: handleSelectEvidence,
    nextCarouselItem: handleNextCarouselItem,
    prevCarouselItem: handlePrevCarouselItem,
    refreshSkillData: handleRefreshSkillData,
    addEndorsement: handleAddEndorsement,
    enrollInResource: handleEnrollInResource,
  };
  
  return (
    <SkillDetailContext.Provider value={{ state, actions }}>
      {children}
    </SkillDetailContext.Provider>
  );
};

export const useSkillDetail = (): SkillDetailContextType => {
  const context = useContext(SkillDetailContext);
  if (!context) {
    throw new Error('useSkillDetail must be used within SkillDetailProvider');
  }
  return context;
};
