/**
 * Skill Detail Domain Types
 * 
 * Type definitions for comprehensive skill detail page with evidence,
 * endorsements, and learning resources.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Evidence types for skill proof
 */
export enum EvidenceType {
  PROJECT = 'project',
  CERTIFICATION = 'certification',
  COURSE = 'course',
  CONTRIBUTION = 'contribution',
  PUBLICATION = 'publication',
  AWARD = 'award',
}

/**
 * Skill proficiency levels
 */
export enum ProficiencyLevel {
  NOVICE = 'novice',           // 0-20%
  BEGINNER = 'beginner',       // 21-40%
  INTERMEDIATE = 'intermediate', // 41-60%
  ADVANCED = 'advanced',       // 61-80%
  EXPERT = 'expert',           // 81-100%
}

/**
 * Detail page tabs
 */
export enum SkillTab {
  OVERVIEW = 'overview',
  EVIDENCE = 'evidence',
  ENDORSEMENTS = 'endorsements',
  LEARNING = 'learning',
}

/**
 * Learning resource types
 */
export enum ResourceType {
  COURSE = 'course',
  TUTORIAL = 'tutorial',
  DOCUMENTATION = 'documentation',
  BOOK = 'book',
  VIDEO = 'video',
  PROJECT = 'project',
}

/**
 * Skill trend direction
 */
export enum TrendDirection {
  RISING = 'rising',
  STABLE = 'stable',
  DECLINING = 'declining',
}

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Comprehensive skill data
 */
export interface SkillDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  
  // Proficiency
  strength: number;              // 0-100
  proficiencyLevel: ProficiencyLevel;
  
  // Metadata
  verified: boolean;
  lastUsed: Date;
  yearsOfExperience: number;
  
  // Statistics
  stats: {
    totalProjects: number;
    totalHours: number;
    endorsements: number;
    certifications: number;
    marketDemand: number;        // 0-100
    avgSalaryImpact: number;     // Percentage increase
  };
  
  // Trend
  trend: {
    direction: TrendDirection;
    changePercentage: number;    // +/- percentage
    sparklineData: number[];     // Last 12 months
  };
  
  // Related
  relatedSkills: Array<{
    id: string;
    name: string;
    strength: number;
    relationship: 'prerequisite' | 'complementary' | 'advanced';
  }>;
  
  tags: string[];
}

/**
 * Evidence item (proof of skill)
 */
export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  date: Date;
  
  // Visual
  thumbnail?: string;
  url?: string;
  
  // Metadata
  metadata: {
    organization?: string;
    role?: string;
    duration?: string;
    technologies?: string[];
    impact?: string;
    metrics?: Array<{
      label: string;
      value: string;
    }>;
  };
  
  // Verification
  verified: boolean;
  verifiedBy?: string;
}

/**
 * Endorsement from peer/manager
 */
export interface Endorsement {
  id: string;
  endorserName: string;
  endorserRole: string;
  endorserCompany: string;
  endorserAvatar?: string;
  
  // Endorsement details
  rating: number;                // 1-5 stars
  testimonial?: string;
  date: Date;
  
  // Relationship
  relationship: 'colleague' | 'manager' | 'client' | 'mentor' | 'peer';
  
  // Context
  projectContext?: string;
  verified: boolean;
}

/**
 * Learning resource recommendation
 */
export interface LearningResource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  provider: string;
  
  // Details
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;               // 0-5
  enrollments: number;
  
  // Visual
  thumbnail?: string;
  url: string;
  
  // Cost
  price: number;
  currency: string;
  
  // Progress
  progress?: number;            // 0-100 if enrolled
  completed?: boolean;
  
  // Relevance
  relevanceScore: number;       // 0-100
  recommendedFor: ProficiencyLevel;
}

/**
 * Skill milestone/achievement
 */
export interface SkillMilestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'certification' | 'project' | 'achievement' | 'endorsement';
  icon?: string;
}

/**
 * Skill growth data
 */
export interface SkillGrowth {
  skillId: string;
  history: Array<{
    date: Date;
    strength: number;
    event?: string;
  }>;
  projectedGrowth: Array<{
    month: string;
    projectedStrength: number;
  }>;
}

/**
 * Market insights for skill
 */
export interface MarketInsights {
  demand: number;               // 0-100
  trend: TrendDirection;
  avgSalary: {
    min: number;
    max: number;
    median: number;
    currency: string;
  };
  jobOpenings: number;
  topCompanies: string[];
  geographicDemand: Array<{
    location: string;
    demand: number;
  }>;
}

// ============================================================================
// State Management
// ============================================================================

/**
 * Skill detail state
 */
export interface SkillDetailState {
  skill: SkillDetail | null;
  evidence: EvidenceItem[];
  endorsements: Endorsement[];
  learningResources: LearningResource[];
  milestones: SkillMilestone[];
  growth: SkillGrowth | null;
  marketInsights: MarketInsights | null;
  
  // UI state
  activeTab: SkillTab;
  selectedEvidence: EvidenceItem | null;
  isLoading: boolean;
  
  // Carousel
  carouselIndex: number;
}

/**
 * Skill detail actions
 */
export interface SkillDetailActions {
  setActiveTab: (tab: SkillTab) => void;
  selectEvidence: (evidence: EvidenceItem | null) => void;
  nextCarouselItem: () => void;
  prevCarouselItem: () => void;
  refreshSkillData: () => Promise<void>;
  addEndorsement: (endorsement: Omit<Endorsement, 'id'>) => void;
  enrollInResource: (resourceId: string) => void;
}

/**
 * Skill detail context
 */
export interface SkillDetailContextType {
  state: SkillDetailState;
  actions: SkillDetailActions;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get proficiency level from strength
 */
export const getProficiencyLevel = (strength: number): ProficiencyLevel => {
  if (strength <= 20) return ProficiencyLevel.NOVICE;
  if (strength <= 40) return ProficiencyLevel.BEGINNER;
  if (strength <= 60) return ProficiencyLevel.INTERMEDIATE;
  if (strength <= 80) return ProficiencyLevel.ADVANCED;
  return ProficiencyLevel.EXPERT;
};

/**
 * Get proficiency label
 */
export const getProficiencyLabel = (level: ProficiencyLevel): string => {
  const labels: Record<ProficiencyLevel, string> = {
    [ProficiencyLevel.NOVICE]: 'Novice',
    [ProficiencyLevel.BEGINNER]: 'Beginner',
    [ProficiencyLevel.INTERMEDIATE]: 'Intermediate',
    [ProficiencyLevel.ADVANCED]: 'Advanced',
    [ProficiencyLevel.EXPERT]: 'Expert',
  };
  return labels[level];
};

/**
 * Get proficiency color
 */
export const getProficiencyColor = (level: ProficiencyLevel): string => {
  const colors: Record<ProficiencyLevel, string> = {
    [ProficiencyLevel.NOVICE]: '#64748B',      // Slate
    [ProficiencyLevel.BEGINNER]: '#3B82F6',    // Blue
    [ProficiencyLevel.INTERMEDIATE]: '#22D3EE', // Cyan
    [ProficiencyLevel.ADVANCED]: '#10B981',     // Emerald
    [ProficiencyLevel.EXPERT]: '#F59E0B',       // Amber
  };
  return colors[level];
};

/**
 * Get evidence type icon
 */
export const getEvidenceTypeLabel = (type: EvidenceType): string => {
  const labels: Record<EvidenceType, string> = {
    [EvidenceType.PROJECT]: 'Project',
    [EvidenceType.CERTIFICATION]: 'Certification',
    [EvidenceType.COURSE]: 'Course',
    [EvidenceType.CONTRIBUTION]: 'Contribution',
    [EvidenceType.PUBLICATION]: 'Publication',
    [EvidenceType.AWARD]: 'Award',
  };
  return labels[type];
};

/**
 * Get tab label
 */
export const getTabLabel = (tab: SkillTab): string => {
  const labels: Record<SkillTab, string> = {
    [SkillTab.OVERVIEW]: 'Overview',
    [SkillTab.EVIDENCE]: 'Evidence',
    [SkillTab.ENDORSEMENTS]: 'Endorsements',
    [SkillTab.LEARNING]: 'Learning',
  };
  return labels[tab];
};

/**
 * Format days ago
 */
export const formatDaysAgo = (date: Date): string => {
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return years === 1 ? '1 year ago' : `${years} years ago`;
};
