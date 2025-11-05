/**
 * Skill DNA Types
 * Domain types for skill ecosystem visualization and identity analysis
 */

// ==================== Value Objects ====================

/**
 * Skill domain categories
 */
export enum SkillDomain {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  MOBILE = 'mobile',
  DEVOPS = 'devops',
  DATA_SCIENCE = 'data_science',
  AI_ML = 'ai_ml',
  DESIGN = 'design',
  CLOUD = 'cloud',
  SECURITY = 'security',
  LEADERSHIP = 'leadership',
  SOFT_SKILLS = 'soft_skills',
}

/**
 * Skill strength levels
 */
export enum StrengthLevel {
  NOVICE = 'novice',           // 0-20
  BEGINNER = 'beginner',       // 21-40
  INTERMEDIATE = 'intermediate', // 41-60
  ADVANCED = 'advanced',       // 61-80
  EXPERT = 'expert',           // 81-100
}

/**
 * DNA insight types
 */
export enum InsightType {
  SPECIALIST = 'specialist',     // Deep expertise in one area
  GENERALIST = 'generalist',     // Broad knowledge across domains
  T_SHAPED = 't_shaped',         // Deep in one, broad in others
  POLYMATH = 'polymath',         // Multiple deep specializations
  EMERGING = 'emerging',         // New to the field
}

/**
 * Recommendation priority
 */
export enum RecommendationPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// ==================== Entities ====================

/**
 * Radar chart data point
 */
export interface RadarDataPoint {
  domain: SkillDomain;
  label: string;
  strength: number; // 0-100
  skillCount: number;
  color: string; // Hex color
  topSkills: string[]; // Top 3 skills in this domain
}

/**
 * Skill zone (gradient area on radar)
 */
export interface SkillZone {
  id: string;
  name: string;
  level: StrengthLevel;
  minStrength: number;
  maxStrength: number;
  color: string;
  opacity: number;
}

/**
 * DNA insight badge data
 */
export interface DNAInsight {
  id: string;
  type: InsightType;
  title: string; // e.g., "Tech Specialist – AI Core"
  description: string;
  icon: string; // Emoji or icon name
  confidence: number; // 0-100
  badges: string[]; // Tags like "AI Core", "Full-Stack", "Cloud Native"
}

/**
 * Skill DNA fingerprint
 */
export interface SkillDNA {
  id: string;
  userId: string;
  radarData: RadarDataPoint[];
  dominantDomain: SkillDomain;
  secondaryDomains: SkillDomain[];
  overallStrength: number; // 0-100 average
  totalSkills: number;
  insight: DNAInsight;
  lastCalculated: Date;
  version: number; // DNA version for tracking changes
}

/**
 * DNA statistics
 */
export interface DNAStats {
  totalDomains: number;
  activeDomains: number; // Domains with skills
  strongestDomain: SkillDomain;
  weakestDomain: SkillDomain | null;
  averageStrength: number;
  strengthDistribution: Record<StrengthLevel, number>;
  balanceScore: number; // 0-100, how balanced across domains
  specializationScore: number; // 0-100, how specialized vs generalized
}

/**
 * Skill recommendation
 */
export interface SkillRecommendation {
  id: string;
  skillName: string;
  domain: SkillDomain;
  reason: string;
  priority: RecommendationPriority;
  estimatedImpact: number; // 0-100
  learningPath?: string;
  relatedSkills: string[];
}

/**
 * DNA comparison (with market/role)
 */
export interface DNAComparison {
  userDNA: SkillDNA;
  targetRole?: string;
  targetDNA?: RadarDataPoint[];
  gaps: SkillGap[];
  matchScore: number; // 0-100
  strengths: string[];
  improvements: string[];
}

/**
 * Skill gap analysis
 */
export interface SkillGap {
  domain: SkillDomain;
  currentStrength: number;
  targetStrength: number;
  gap: number;
  priority: RecommendationPriority;
  recommendations: SkillRecommendation[];
}

/**
 * DNA evolution data (over time)
 */
export interface DNAEvolution {
  userId: string;
  snapshots: DNASnapshot[];
  growthRate: number; // Skills per month
  trendingDomains: SkillDomain[];
  decliningDomains: SkillDomain[];
}

/**
 * DNA snapshot (point in time)
 */
export interface DNASnapshot {
  timestamp: Date;
  radarData: RadarDataPoint[];
  overallStrength: number;
  totalSkills: number;
}

// ==================== Context State ====================

/**
 * Skill DNA context state
 */
export interface SkillDNAState {
  dna: SkillDNA | null;
  stats: DNAStats | null;
  recommendations: SkillRecommendation[];
  comparison: DNAComparison | null;
  evolution: DNAEvolution | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Skill DNA context actions
 */
export interface SkillDNAActions {
  // DNA calculation
  calculateDNA: () => Promise<void>;
  refreshDNA: () => Promise<void>;
  
  // Insights
  generateInsights: () => Promise<DNAInsight>;
  updateInsight: (insight: Partial<DNAInsight>) => void;
  
  // Recommendations
  getRecommendations: (domain?: SkillDomain) => SkillRecommendation[];
  dismissRecommendation: (id: string) => void;
  
  // Comparison
  compareWithRole: (roleTitle: string) => Promise<DNAComparison>;
  clearComparison: () => void;
  
  // Evolution
  loadEvolution: (months: number) => Promise<void>;
  addSnapshot: () => void;
  
  // Stats
  calculateStats: () => DNAStats;
  getStrengthLevel: (strength: number) => StrengthLevel;
  getDomainColor: (domain: SkillDomain) => string;
}

/**
 * Complete Skill DNA context
 */
export type SkillDNAContextType = SkillDNAState & SkillDNAActions;

// ==================== Component Props ====================

/**
 * Radar chart props
 */
export interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  showLabels?: boolean;
  showGrid?: boolean;
  animated?: boolean;
  glowIntensity?: number;
  onAxisClick?: (domain: SkillDomain) => void;
}

/**
 * Insight badge props
 */
export interface InsightBadgeProps {
  insight: DNAInsight;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  onClick?: () => void;
}

/**
 * Skill DNA card props
 */
export interface SkillDNACardProps {
  dna: SkillDNA;
  stats: DNAStats;
  showInsight?: boolean;
  showLegend?: boolean;
  interactive?: boolean;
  onDomainClick?: (domain: SkillDomain) => void;
}

/**
 * Domain legend props
 */
export interface DomainLegendProps {
  domains: RadarDataPoint[];
  selectedDomain?: SkillDomain | null;
  onDomainSelect?: (domain: SkillDomain) => void;
}

/**
 * Strength meter props
 */
export interface StrengthMeterProps {
  strength: number;
  domain: SkillDomain;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

// ==================== Utility Types ====================

/**
 * Domain configuration
 */
export interface DomainConfig {
  domain: SkillDomain;
  label: string;
  shortLabel: string;
  color: string;
  icon: string;
  description: string;
}

/**
 * Radar point coordinates
 */
export interface RadarPoint {
  x: number;
  y: number;
  angle: number;
  strength: number;
}
