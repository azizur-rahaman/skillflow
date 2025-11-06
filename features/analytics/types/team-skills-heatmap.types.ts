/**
 * Team Skills Heatmap Domain Types
 * 
 * Type definitions for team skills comparison heatmap.
 * Team members as columns, skills as rows, color-intensity for proficiency.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Proficiency levels for skill mastery
 */
export enum ProficiencyLevel {
  NONE = 'none',               // 0-10%
  NOVICE = 'novice',           // 11-30%
  BEGINNER = 'beginner',       // 31-50%
  INTERMEDIATE = 'intermediate', // 51-70%
  ADVANCED = 'advanced',       // 71-85%
  EXPERT = 'expert',           // 86-100%
}

/**
 * Skill categories for filtering
 */
export enum SkillCategory {
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
 * Verification status for skills
 */
export enum VerificationStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  SELF_REPORTED = 'self_reported',
  UNVERIFIED = 'unverified',
}

/**
 * Team member roles
 */
export enum TeamMemberRole {
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  MANAGER = 'manager',
  LEAD = 'lead',
  ARCHITECT = 'architect',
  ANALYST = 'analyst',
}

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Team member information
 */
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: TeamMemberRole;
  department: string;
  email: string;
  totalSkills: number;
  averageProficiency: number;
  topSkills: Array<{
    name: string;
    proficiency: number;
    category: SkillCategory;
  }>;
}

/**
 * Skill definition
 */
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  inDemand: boolean;
  trendingScore: number; // 0-100
}

/**
 * Individual heatmap cell data point
 */
export interface TeamHeatmapCell {
  id: string;
  skillId: string;
  skillName: string;
  teamMemberId: string;
  teamMemberName: string;
  proficiency: number; // 0-100 percentage
  proficiencyLevel: ProficiencyLevel;
  verificationStatus: VerificationStatus;
  color: string;
  metadata: {
    lastUpdated: Date;
    endorsements: number;
    certificationsCount: number;
    projectsUsed: number;
    yearsExperience: number;
    selfAssessment: number;
    managerAssessment?: number;
    peerAssessments: number[];
  };
}

/**
 * Hover detail card information
 */
export interface CellHoverDetail {
  skillName: string;
  teamMemberName: string;
  proficiency: number;
  proficiencyLevel: ProficiencyLevel;
  verificationStatus: VerificationStatus;
  endorsements: number;
  certificationsCount: number;
  projectsUsed: number;
  yearsExperience: number;
  lastUpdated: Date;
  trend: {
    direction: 'up' | 'down' | 'stable';
    changePercentage: number;
    previousValue: number;
    timePeriod: string;
  };
  recommendations: string[];
}

/**
 * Skill gap analysis
 */
export interface SkillGap {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  requiredLevel: number;
  currentAverage: number;
  gapPercentage: number;
  affectedMembers: Array<{
    memberId: string;
    memberName: string;
    currentLevel: number;
    gapAmount: number;
  }>;
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendedActions: string[];
}

/**
 * Team skill strength analysis
 */
export interface TeamStrength {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  averageProficiency: number;
  teamCoverage: number; // Percentage of team with this skill
  topPerformers: Array<{
    memberId: string;
    memberName: string;
    proficiency: number;
  }>;
  isCoreCopetency: boolean;
}

/**
 * Complete heatmap matrix
 */
export interface TeamSkillsMatrix {
  id: string;
  teamId: string;
  teamName: string;
  members: TeamMember[];
  skills: Skill[];
  cells: TeamHeatmapCell[][];
  lastUpdated: Date;
  statistics: {
    totalMembers: number;
    totalSkills: number;
    averageTeamProficiency: number;
    skillGapsCount: number;
    strengths: TeamStrength[];
    gaps: SkillGap[];
  };
}

/**
 * Filter configuration
 */
export interface TeamHeatmapFilter {
  categories: SkillCategory[];
  proficiencyLevels: ProficiencyLevel[];
  verificationStatus: VerificationStatus[];
  searchQuery: string;
  showGapsOnly: boolean;
  showStrengthsOnly: boolean;
  minProficiency: number;
  maxProficiency: number;
  teamMemberIds: string[];
}

/**
 * Legend configuration
 */
export interface ProficiencyLegend {
  levels: Array<{
    level: ProficiencyLevel;
    label: string;
    color: string;
    minValue: number;
    maxValue: number;
    description: string;
  }>;
  gradient: {
    start: string;
    end: string;
    steps: number;
  };
}

/**
 * Export configuration
 */
export interface ExportConfig {
  format: 'png' | 'svg' | 'csv' | 'json' | 'pdf' | 'excel';
  includeMetadata: boolean;
  includeLegend: boolean;
  includeAnalysis: boolean;
  resolution?: 'low' | 'medium' | 'high' | 'ultra';
}

// ============================================================================
// State Management
// ============================================================================

/**
 * Team skills heatmap state
 */
export interface TeamHeatmapState {
  matrix: TeamSkillsMatrix | null;
  filters: TeamHeatmapFilter;
  legend: ProficiencyLegend;
  selectedCell: TeamHeatmapCell | null;
  hoveredCell: TeamHeatmapCell | null;
  isLoading: boolean;
  error: string | null;
  viewMode: 'heatmap' | 'comparison' | 'gaps';
}

/**
 * Team skills heatmap actions
 */
export interface TeamHeatmapActions {
  loadTeamData: (teamId: string) => Promise<void>;
  updateFilters: (filters: Partial<TeamHeatmapFilter>) => void;
  selectCell: (cell: TeamHeatmapCell | null) => void;
  hoverCell: (cell: TeamHeatmapCell | null) => void;
  refreshData: () => Promise<void>;
  exportHeatmap: (config: ExportConfig) => void;
  resetFilters: () => void;
  setViewMode: (mode: 'heatmap' | 'comparison' | 'gaps') => void;
}

/**
 * Complete context type
 */
export interface TeamHeatmapContextType {
  state: TeamHeatmapState;
  actions: TeamHeatmapActions;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get proficiency level from percentage value
 */
export const getProficiencyLevel = (value: number): ProficiencyLevel => {
  if (value <= 10) return ProficiencyLevel.NONE;
  if (value <= 30) return ProficiencyLevel.NOVICE;
  if (value <= 50) return ProficiencyLevel.BEGINNER;
  if (value <= 70) return ProficiencyLevel.INTERMEDIATE;
  if (value <= 85) return ProficiencyLevel.ADVANCED;
  return ProficiencyLevel.EXPERT;
};

/**
 * Get color for proficiency level (enterprise data-viz style)
 */
export const getProficiencyColor = (value: number): string => {
  // Gradient from cool (low) to warm (high) with enterprise palette
  if (value <= 10) return '#1E293B'; // Very dark - almost no skill
  if (value <= 30) return '#3B82F6'; // Blue - novice
  if (value <= 50) return '#22D3EE'; // Cyan - beginner
  if (value <= 70) return '#10B981'; // Green - intermediate
  if (value <= 85) return '#F59E0B'; // Amber - advanced
  return '#EF4444'; // Red/warm - expert
};

/**
 * Get proficiency label
 */
export const getProficiencyLabel = (level: ProficiencyLevel): string => {
  const labels: Record<ProficiencyLevel, string> = {
    [ProficiencyLevel.NONE]: 'None',
    [ProficiencyLevel.NOVICE]: 'Novice',
    [ProficiencyLevel.BEGINNER]: 'Beginner',
    [ProficiencyLevel.INTERMEDIATE]: 'Intermediate',
    [ProficiencyLevel.ADVANCED]: 'Advanced',
    [ProficiencyLevel.EXPERT]: 'Expert',
  };
  return labels[level];
};

/**
 * Get skill category label
 */
export const getSkillCategoryLabel = (category: SkillCategory): string => {
  const labels: Record<SkillCategory, string> = {
    [SkillCategory.FRONTEND]: 'Frontend Development',
    [SkillCategory.BACKEND]: 'Backend Development',
    [SkillCategory.MOBILE]: 'Mobile Development',
    [SkillCategory.DEVOPS]: 'DevOps & Infrastructure',
    [SkillCategory.DATA_SCIENCE]: 'Data Science',
    [SkillCategory.AI_ML]: 'AI & Machine Learning',
    [SkillCategory.DESIGN]: 'UI/UX Design',
    [SkillCategory.CLOUD]: 'Cloud Platforms',
    [SkillCategory.SECURITY]: 'Security & Compliance',
    [SkillCategory.LEADERSHIP]: 'Leadership & Management',
    [SkillCategory.SOFT_SKILLS]: 'Soft Skills',
  };
  return labels[category];
};

/**
 * Get verification badge color
 */
export const getVerificationColor = (status: VerificationStatus): string => {
  const colors: Record<VerificationStatus, string> = {
    [VerificationStatus.VERIFIED]: '#10B981', // Green
    [VerificationStatus.PENDING]: '#F59E0B', // Amber
    [VerificationStatus.SELF_REPORTED]: '#6366F1', // Indigo
    [VerificationStatus.UNVERIFIED]: '#64748B', // Gray
  };
  return colors[status];
};

/**
 * Calculate skill gap priority
 */
export const calculateGapPriority = (
  gapPercentage: number,
  inDemand: boolean
): 'critical' | 'high' | 'medium' | 'low' => {
  if (gapPercentage >= 50 && inDemand) return 'critical';
  if (gapPercentage >= 40 || (gapPercentage >= 30 && inDemand)) return 'high';
  if (gapPercentage >= 20) return 'medium';
  return 'low';
};
