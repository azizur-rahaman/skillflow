/**
 * Skill Risk Score - Domain Types
 * 
 * Defines types for skill obsolescence risk assessment,
 * trend indicators, and AI-powered recommendations.
 */

/**
 * Risk level categories based on obsolescence probability
 */
export enum RiskLevel {
  LOW = 'LOW',           // 0-25% - Skill is growing or stable
  MODERATE = 'MODERATE', // 26-50% - Some decline, monitor closely
  HIGH = 'HIGH',         // 51-75% - Significant decline, upskill needed
  CRITICAL = 'CRITICAL', // 76-100% - Rapidly obsoleting, urgent action
}

/**
 * Trend direction over the past period
 */
export enum TrendDirection {
  IMPROVING = 'IMPROVING',   // Risk decreasing
  STABLE = 'STABLE',         // Risk unchanged
  DECLINING = 'DECLINING',   // Risk increasing
}

/**
 * Time periods for trend analysis
 */
export enum TrendPeriod {
  MONTH = '1M',
  QUARTER = '3M',
  HALF_YEAR = '6M',
  YEAR = '1Y',
}

/**
 * Categories of risk factors
 */
export enum RiskFactor {
  MARKET_DEMAND = 'MARKET_DEMAND',             // Declining job postings
  TECHNOLOGY_SHIFT = 'TECHNOLOGY_SHIFT',       // New tech replacing old
  INDUSTRY_ADOPTION = 'INDUSTRY_ADOPTION',     // Companies migrating away
  LAST_USAGE = 'LAST_USAGE',                   // Skill not used recently
  CERTIFICATION_AGE = 'CERTIFICATION_AGE',     // Outdated certifications
  EMERGING_COMPETITION = 'EMERGING_COMPETITION', // Better alternatives emerging
}

/**
 * Action types for recommendations
 */
export enum RecommendationAction {
  UPSKILL = 'UPSKILL',               // Learn complementary skills
  TRANSITION = 'TRANSITION',         // Switch to related skill
  CERTIFY = 'CERTIFY',               // Get updated certification
  PRACTICE = 'PRACTICE',             // Use skill in projects
  MONITOR = 'MONITOR',               // Watch for changes
}

/**
 * Priority levels for recommendations
 */
export enum RecommendationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Gauge color zone configuration
 */
export interface GaugeZone {
  min: number;           // 0-100
  max: number;           // 0-100
  color: string;         // Hex color
  label: string;         // Zone label
}

/**
 * Data point for trend chart
 */
export interface TrendPoint {
  date: Date;
  riskScore: number;     // 0-100
  event?: string;        // Optional event label
}

/**
 * Risk factor contribution
 */
export interface RiskFactorContribution {
  factor: RiskFactor;
  weight: number;        // 0-100 (percentage contribution)
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * AI-generated recommendation
 */
export interface Recommendation {
  id: string;
  action: RecommendationAction;
  priority: RecommendationPriority;
  title: string;
  description: string;
  skillsToLearn?: string[];         // Recommended skills
  estimatedTime?: string;           // e.g., "2-3 months"
  resources?: {
    title: string;
    url: string;
    type: 'course' | 'tutorial' | 'documentation' | 'certification';
  }[];
  impactScore?: number;             // 0-100 (expected risk reduction)
}

/**
 * Complete skill risk assessment
 */
export interface SkillRiskScore {
  skillId: string;
  skillName: string;
  riskScore: number;                // 0-100
  riskLevel: RiskLevel;
  trend: {
    direction: TrendDirection;
    changePercentage: number;       // +/- percentage change
    period: TrendPeriod;
    history: TrendPoint[];
  };
  factors: RiskFactorContribution[];
  recommendations: Recommendation[];
  lastAssessment: Date;
  nextAssessment: Date;
  confidence: number;               // 0-100 (AI confidence)
}

/**
 * Risk dashboard filters
 */
export interface RiskFilter {
  riskLevels: RiskLevel[];
  trendDirections: TrendDirection[];
  skillDomains?: string[];
  searchQuery?: string;
  sortBy: 'riskScore' | 'skillName' | 'lastAssessment' | 'trend';
  sortOrder: 'asc' | 'desc';
}

/**
 * Risk summary statistics
 */
export interface RiskSummary {
  totalSkills: number;
  averageRiskScore: number;
  skillsByRiskLevel: {
    [K in RiskLevel]: number;
  };
  skillsAtRisk: number;             // HIGH + CRITICAL
  trendingUp: number;               // DECLINING trend
  trendingDown: number;             // IMPROVING trend
}

/**
 * State for risk score feature
 */
export interface SkillRiskState {
  riskScores: SkillRiskScore[];
  selectedSkill: SkillRiskScore | null;
  filter: RiskFilter;
  summary: RiskSummary;
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions for risk score management
 */
export interface SkillRiskActions {
  selectSkill: (skill: SkillRiskScore) => void;
  updateFilter: (filter: Partial<RiskFilter>) => void;
  refreshRiskScores: () => Promise<void>;
  dismissRecommendation: (skillId: string, recommendationId: string) => void;
  acceptRecommendation: (skillId: string, recommendationId: string) => void;
}

/**
 * Helper function to get risk level from score
 */
export const getRiskLevel = (score: number): RiskLevel => {
  if (score >= 0 && score <= 25) return RiskLevel.LOW;
  if (score >= 26 && score <= 50) return RiskLevel.MODERATE;
  if (score >= 51 && score <= 75) return RiskLevel.HIGH;
  return RiskLevel.CRITICAL;
};

/**
 * Helper function to get risk color
 */
export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case RiskLevel.LOW:
      return '#10B981'; // Emerald
    case RiskLevel.MODERATE:
      return '#F59E0B'; // Amber
    case RiskLevel.HIGH:
      return '#F97316'; // Orange
    case RiskLevel.CRITICAL:
      return '#EF4444'; // Red
    default:
      return '#64748B'; // Slate
  }
};

/**
 * Helper function to get trend icon
 */
export const getTrendIcon = (direction: TrendDirection): string => {
  switch (direction) {
    case TrendDirection.IMPROVING:
      return 'trending-down'; // Risk going down is good
    case TrendDirection.DECLINING:
      return 'trending-up'; // Risk going up is bad
    case TrendDirection.STABLE:
      return 'minus';
    default:
      return 'minus';
  }
};

/**
 * Helper function to get risk level label
 */
export const getRiskLevelLabel = (level: RiskLevel): string => {
  switch (level) {
    case RiskLevel.LOW:
      return 'Low Risk';
    case RiskLevel.MODERATE:
      return 'Moderate Risk';
    case RiskLevel.HIGH:
      return 'High Risk';
    case RiskLevel.CRITICAL:
      return 'Critical Risk';
    default:
      return 'Unknown';
  }
};

/**
 * Helper function to get recommendation action label
 */
export const getActionLabel = (action: RecommendationAction): string => {
  switch (action) {
    case RecommendationAction.UPSKILL:
      return 'Upskill';
    case RecommendationAction.TRANSITION:
      return 'Transition';
    case RecommendationAction.CERTIFY:
      return 'Get Certified';
    case RecommendationAction.PRACTICE:
      return 'Practice';
    case RecommendationAction.MONITOR:
      return 'Monitor';
    default:
      return 'Action';
  }
};

/**
 * Helper function to get priority color
 */
export const getPriorityColor = (priority: RecommendationPriority): string => {
  switch (priority) {
    case RecommendationPriority.LOW:
      return '#64748B'; // Slate
    case RecommendationPriority.MEDIUM:
      return '#F59E0B'; // Amber
    case RecommendationPriority.HIGH:
      return '#F97316'; // Orange
    case RecommendationPriority.URGENT:
      return '#EF4444'; // Red
    default:
      return '#64748B';
  }
};

/**
 * Helper function to get gauge zones
 */
export const getGaugeZones = (): GaugeZone[] => {
  return [
    { min: 0, max: 25, color: '#10B981', label: 'Low' },
    { min: 26, max: 50, color: '#F59E0B', label: 'Moderate' },
    { min: 51, max: 75, color: '#F97316', label: 'High' },
    { min: 76, max: 100, color: '#EF4444', label: 'Critical' },
  ];
};

/**
 * Helper function to format days ago
 */
export const formatDaysAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
};
