/**
 * Growth Rings Domain Types
 * 
 * Type definitions for skill progression visualization via concentric rings.
 * Shows temporal growth patterns with color-coded domains.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Skill domain categories (matches DNA domains)
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
 * Time period granularity
 */
export enum TimePeriod {
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

/**
 * Growth trend direction
 */
export enum GrowthTrend {
  RAPID = 'rapid',
  STEADY = 'steady',
  SLOW = 'slow',
  STAGNANT = 'stagnant',
  DECLINING = 'declining',
}

/**
 * Ring animation state
 */
export enum AnimationState {
  IDLE = 'idle',
  EXPANDING = 'expanding',
  PULSING = 'pulsing',
  HIGHLIGHTED = 'highlighted',
}

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Individual growth ring data point
 */
export interface GrowthRing {
  id: string;
  skillName: string;
  domain: SkillDomain;
  timestamp: Date;
  strengthValue: number;
  previousStrength: number;
  growthPercentage: number;
  trend: GrowthTrend;
  radius: number;
  color: string;
  label: string;
}

/**
 * Time segment (e.g., January 2025, Q1 2025)
 */
export interface TimeSegment {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  period: TimePeriod;
  rings: GrowthRing[];
  totalGrowth: number;
  dominantDomain: SkillDomain;
}

/**
 * Skill progression history
 */
export interface SkillProgression {
  skillName: string;
  domain: SkillDomain;
  dataPoints: Array<{
    date: Date;
    strength: number;
    growthRate: number;
  }>;
  overallGrowth: number;
  peakStrength: number;
  currentStrength: number;
}

/**
 * Domain statistics for a time period
 */
export interface DomainStats {
  domain: SkillDomain;
  skillCount: number;
  averageGrowth: number;
  totalStrength: number;
  color: string;
  trend: GrowthTrend;
}

/**
 * Growth insight
 */
export interface GrowthInsight {
  id: string;
  type: 'milestone' | 'streak' | 'acceleration' | 'plateau' | 'shift';
  title: string;
  description: string;
  timestamp: Date;
  relatedSkills: string[];
  icon: string;
  color: string;
}

/**
 * Tooltip data for ring hover
 */
export interface RingTooltipData {
  skillName: string;
  domain: string;
  strength: number;
  growthPercentage: number;
  timestamp: Date;
  trend: GrowthTrend;
  previousValue: number;
  daysAgo: number;
}

// ============================================================================
// Visualization Configuration
// ============================================================================

/**
 * Ring visualization settings
 */
export interface RingVisualizationConfig {
  centerX: number;
  centerY: number;
  minRadius: number;
  maxRadius: number;
  ringThickness: number;
  ringGap: number;
  showLabels: boolean;
  showTooltips: boolean;
  animationDuration: number;
  colorScheme: 'domain' | 'gradient' | 'monochrome';
}

/**
 * Animation settings
 */
export interface AnimationConfig {
  enabled: boolean;
  expandOnLoad: boolean;
  pulseOnHover: boolean;
  duration: number;
  delay: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// ============================================================================
// State Management
// ============================================================================

/**
 * Growth Rings state
 */
export interface GrowthRingsState {
  timeSegments: TimeSegment[];
  selectedSegment: TimeSegment | null;
  skillProgressions: SkillProgression[];
  domainStats: DomainStats[];
  insights: GrowthInsight[];
  timePeriod: TimePeriod;
  selectedDomain: SkillDomain | null;
  hoveredRing: GrowthRing | null;
  isLoading: boolean;
  animationState: AnimationState;
  config: RingVisualizationConfig;
}

/**
 * Growth Rings actions
 */
export interface GrowthRingsActions {
  selectTimeSegment: (segmentId: string) => void;
  setTimePeriod: (period: TimePeriod) => void;
  filterByDomain: (domain: SkillDomain | null) => void;
  setHoveredRing: (ring: GrowthRing | null) => void;
  refreshData: () => Promise<void>;
  exportData: (format: 'png' | 'svg' | 'json') => void;
  updateConfig: (config: Partial<RingVisualizationConfig>) => void;
  toggleAnimation: () => void;
}

/**
 * Growth Rings Context (State + Actions)
 */
export interface GrowthRingsContextType {
  state: GrowthRingsState;
  actions: GrowthRingsActions;
}

// ============================================================================
// Domain Color Mapping
// ============================================================================

export const DOMAIN_COLORS: Record<SkillDomain, string> = {
  [SkillDomain.FRONTEND]: '#6366F1',       // Indigo
  [SkillDomain.BACKEND]: '#8B5CF6',        // Violet
  [SkillDomain.MOBILE]: '#EC4899',         // Pink
  [SkillDomain.DEVOPS]: '#F59E0B',         // Amber
  [SkillDomain.DATA_SCIENCE]: '#10B981',   // Emerald
  [SkillDomain.AI_ML]: '#22D3EE',          // Cyan
  [SkillDomain.DESIGN]: '#A855F7',         // Purple
  [SkillDomain.CLOUD]: '#3B82F6',          // Blue
  [SkillDomain.SECURITY]: '#EF4444',       // Red
  [SkillDomain.LEADERSHIP]: '#F97316',     // Orange
  [SkillDomain.SOFT_SKILLS]: '#14B8A6',    // Teal
};

/**
 * Helper to get domain display name
 */
export const getDomainLabel = (domain: SkillDomain): string => {
  const labels: Record<SkillDomain, string> = {
    [SkillDomain.FRONTEND]: 'Frontend',
    [SkillDomain.BACKEND]: 'Backend',
    [SkillDomain.MOBILE]: 'Mobile',
    [SkillDomain.DEVOPS]: 'DevOps',
    [SkillDomain.DATA_SCIENCE]: 'Data Science',
    [SkillDomain.AI_ML]: 'AI/ML',
    [SkillDomain.DESIGN]: 'Design',
    [SkillDomain.CLOUD]: 'Cloud',
    [SkillDomain.SECURITY]: 'Security',
    [SkillDomain.LEADERSHIP]: 'Leadership',
    [SkillDomain.SOFT_SKILLS]: 'Soft Skills',
  };
  return labels[domain];
};
