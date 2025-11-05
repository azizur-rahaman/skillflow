/**
 * Type definitions for skill mastery and confidence tracking
 * Dual-score visualization: AI-evaluated mastery vs self-assessed confidence
 */

/**
 * Skill category
 */
export enum SkillCategory {
  PROGRAMMING = 'programming',
  FRAMEWORKS = 'frameworks',
  DATABASES = 'databases',
  DEVOPS = 'devops',
  SOFT_SKILLS = 'soft-skills',
  DESIGN = 'design',
}

/**
 * Mastery level
 */
export enum MasteryLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

/**
 * Confidence level
 */
export enum ConfidenceLevel {
  NOT_CONFIDENT = 'not-confident',
  SOMEWHAT_CONFIDENT = 'somewhat-confident',
  CONFIDENT = 'confident',
  VERY_CONFIDENT = 'very-confident',
}

/**
 * Delta type (comparison between AI and self-assessment)
 */
export enum DeltaType {
  OVERCONFIDENT = 'overconfident', // Confidence > Mastery
  ALIGNED = 'aligned', // Confidence ≈ Mastery
  UNDERCONFIDENT = 'underconfident', // Confidence < Mastery
}

/**
 * AI evaluation data point
 */
export interface AIEvaluation {
  skillId: string;
  score: number; // 0-100
  evaluatedAt: Date;
  basedOn: {
    assessments: number;
    projects: number;
    codingChallenges: number;
    peerReviews: number;
  };
  strengths: string[];
  weaknesses: string[];
  confidence: number; // AI confidence in its own evaluation, 0-100
}

/**
 * Self-assessment data point
 */
export interface SelfAssessment {
  skillId: string;
  confidenceScore: number; // 0-100
  assessedAt: Date;
  notes?: string;
}

/**
 * Skill with dual scores
 */
export interface SkillMastery {
  id: string;
  name: string;
  category: SkillCategory;
  aiMastery: number; // 0-100, from AI evaluation
  selfConfidence: number; // 0-100, from self-assessment
  delta: number; // Difference (confidence - mastery)
  deltaType: DeltaType;
  masteryLevel: MasteryLevel;
  confidenceLevel: ConfidenceLevel;
  lastEvaluated: Date;
  lastAssessed: Date;
  trend: 'improving' | 'stable' | 'declining';
  history: MasteryHistoryPoint[];
}

/**
 * Historical data point for tracking
 */
export interface MasteryHistoryPoint {
  date: Date;
  aiMastery: number;
  selfConfidence: number;
}

/**
 * Personalized action suggestion
 */
export interface ActionSuggestion {
  id: string;
  type: 'practice' | 'learn' | 'assess' | 'validate' | 'mentor';
  title: string;
  description: string;
  skillId: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string; // e.g., "2 hours", "1 week"
  resources?: {
    title: string;
    url: string;
    type: 'course' | 'article' | 'video' | 'practice';
  }[];
}

/**
 * Overall mastery summary
 */
export interface MasterySummary {
  overallAIMastery: number; // Average across all skills
  overallSelfConfidence: number; // Average across all skills
  overallDelta: number;
  totalSkills: number;
  masteredSkills: number; // AI mastery >= 80
  overconfidentSkills: number; // Delta > 20
  underconfidentSkills: number; // Delta < -20
  alignedSkills: number; // Delta between -20 and 20
  topSkills: SkillMastery[]; // Top 3 by AI mastery
  skillsNeedingWork: SkillMastery[]; // Bottom 3 by AI mastery
}

/**
 * Context state
 */
export interface SkillMasteryState {
  skills: SkillMastery[];
  summary: MasterySummary | null;
  selectedSkill: SkillMastery | null;
  suggestions: ActionSuggestion[];
  loading: boolean;
  error: string | null;
}

/**
 * Context actions
 */
export interface SkillMasteryActions {
  loadMasteryData: () => Promise<void>;
  selectSkill: (skillId: string) => void;
  updateSelfConfidence: (skillId: string, confidenceScore: number) => Promise<void>;
  dismissSuggestion: (suggestionId: string) => void;
  filterByCategory: (category: SkillCategory | null) => void;
  sortBy: (field: 'mastery' | 'confidence' | 'delta') => void;
}

/**
 * Helper: Get mastery level from score
 */
export const getMasteryLevel = (score: number): MasteryLevel => {
  if (score >= 80) return MasteryLevel.EXPERT;
  if (score >= 60) return MasteryLevel.ADVANCED;
  if (score >= 40) return MasteryLevel.INTERMEDIATE;
  return MasteryLevel.BEGINNER;
};

/**
 * Helper: Get confidence level from score
 */
export const getConfidenceLevel = (score: number): ConfidenceLevel => {
  if (score >= 80) return ConfidenceLevel.VERY_CONFIDENT;
  if (score >= 60) return ConfidenceLevel.CONFIDENT;
  if (score >= 40) return ConfidenceLevel.SOMEWHAT_CONFIDENT;
  return ConfidenceLevel.NOT_CONFIDENT;
};

/**
 * Helper: Calculate delta type
 */
export const getDeltaType = (delta: number): DeltaType => {
  if (delta > 20) return DeltaType.OVERCONFIDENT;
  if (delta < -20) return DeltaType.UNDERCONFIDENT;
  return DeltaType.ALIGNED;
};

/**
 * Helper: Get delta color
 */
export const getDeltaColor = (deltaType: DeltaType): string => {
  const colors: Record<DeltaType, string> = {
    [DeltaType.OVERCONFIDENT]: '#F59E0B', // Yellow/Orange - caution
    [DeltaType.ALIGNED]: '#10B981', // Green - good
    [DeltaType.UNDERCONFIDENT]: '#6366F1', // Blue - opportunity
  };
  return colors[deltaType];
};

/**
 * Helper: Get delta label
 */
export const getDeltaLabel = (deltaType: DeltaType): string => {
  const labels: Record<DeltaType, string> = {
    [DeltaType.OVERCONFIDENT]: 'Overconfident',
    [DeltaType.ALIGNED]: 'Well-Calibrated',
    [DeltaType.UNDERCONFIDENT]: 'Underconfident',
  };
  return labels[deltaType];
};

/**
 * Helper: Get delta message
 */
export const getDeltaMessage = (deltaType: DeltaType, delta: number): string => {
  if (deltaType === DeltaType.OVERCONFIDENT) {
    return `Your confidence is ${Math.abs(delta)}% higher than your evaluated mastery. Consider more practice.`;
  } else if (deltaType === DeltaType.UNDERCONFIDENT) {
    return `You're ${Math.abs(delta)}% more skilled than you think! Great opportunity to take on challenges.`;
  } else {
    return 'Your self-assessment aligns well with your evaluated mastery. Great awareness!';
  }
};

/**
 * Helper: Get mastery level color
 */
export const getMasteryLevelColor = (level: MasteryLevel): string => {
  const colors: Record<MasteryLevel, string> = {
    [MasteryLevel.BEGINNER]: '#94A3B8',
    [MasteryLevel.INTERMEDIATE]: '#22D3EE',
    [MasteryLevel.ADVANCED]: '#6366F1',
    [MasteryLevel.EXPERT]: '#A855F7',
  };
  return colors[level];
};

/**
 * Helper: Get category color
 */
export const getCategoryColor = (category: SkillCategory): string => {
  const colors: Record<SkillCategory, string> = {
    [SkillCategory.PROGRAMMING]: '#6366F1',
    [SkillCategory.FRAMEWORKS]: '#A855F7',
    [SkillCategory.DATABASES]: '#10B981',
    [SkillCategory.DEVOPS]: '#F59E0B',
    [SkillCategory.SOFT_SKILLS]: '#22D3EE',
    [SkillCategory.DESIGN]: '#EC4899',
  };
  return colors[category];
};

/**
 * Helper: Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

/**
 * Helper: Calculate overall delta
 */
export const calculateOverallDelta = (skills: SkillMastery[]): number => {
  if (skills.length === 0) return 0;
  const totalDelta = skills.reduce((sum, skill) => sum + skill.delta, 0);
  return totalDelta / skills.length;
};

/**
 * Helper: Generate suggestions based on delta
 */
export const generateSuggestions = (skill: SkillMastery): ActionSuggestion[] => {
  const suggestions: ActionSuggestion[] = [];

  if (skill.deltaType === DeltaType.OVERCONFIDENT) {
    suggestions.push({
      id: `${skill.id}-practice`,
      type: 'practice',
      title: `Practice ${skill.name}`,
      description: `Your confidence outpaces your evaluated mastery. Complete hands-on projects to bridge the gap.`,
      skillId: skill.id,
      priority: 'high',
      estimatedTime: '2-3 weeks',
      resources: [
        {
          title: `${skill.name} Practice Challenges`,
          url: '/practice',
          type: 'practice',
        },
      ],
    });
  } else if (skill.deltaType === DeltaType.UNDERCONFIDENT) {
    suggestions.push({
      id: `${skill.id}-validate`,
      type: 'validate',
      title: `Validate Your ${skill.name} Skills`,
      description: `You're more skilled than you realize! Take on a challenging project to boost your confidence.`,
      skillId: skill.id,
      priority: 'medium',
      estimatedTime: '1 week',
    });
  }

  if (skill.aiMastery < 60) {
    suggestions.push({
      id: `${skill.id}-learn`,
      type: 'learn',
      title: `Deepen ${skill.name} Knowledge`,
      description: `Focus on fundamentals to improve your mastery score.`,
      skillId: skill.id,
      priority: 'high',
      estimatedTime: '4-6 weeks',
    });
  }

  return suggestions;
};

/**
 * Helper: Get trend icon
 */
export const getTrendIcon = (trend: 'improving' | 'stable' | 'declining'): string => {
  const icons: Record<typeof trend, string> = {
    improving: '↗',
    stable: '→',
    declining: '↘',
  };
  return icons[trend];
};

/**
 * Helper: Get trend color
 */
export const getTrendColor = (trend: 'improving' | 'stable' | 'declining'): string => {
  const colors: Record<typeof trend, string> = {
    improving: '#10B981',
    stable: '#94A3B8',
    declining: '#EF4444',
  };
  return colors[trend];
};
