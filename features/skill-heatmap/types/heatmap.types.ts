/**
 * Skill Heatmap Domain Types
 * 
 * Type definitions for interactive skill comparison heatmap.
 * Shows skill strength across domains with color-coded intensity.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Competency level categories
 */
export enum CompetencyLevel {
  NOVICE = 'novice',           // 0-20%
  BEGINNER = 'beginner',       // 21-40%
  INTERMEDIATE = 'intermediate', // 41-60%
  ADVANCED = 'advanced',       // 61-80%
  EXPERT = 'expert',           // 81-100%
}

/**
 * View modes for heatmap
 */
export enum ViewMode {
  SKILLS_BY_DOMAIN = 'skills_by_domain',
  SKILLS_BY_TEAM = 'skills_by_team',
  DOMAINS_BY_TIME = 'domains_by_time',
  TEAM_COMPARISON = 'team_comparison',
}

/**
 * Time frame options
 */
export enum TimeFrame {
  CURRENT = 'current',
  LAST_MONTH = 'last_month',
  LAST_QUARTER = 'last_quarter',
  LAST_YEAR = 'last_year',
  ALL_TIME = 'all_time',
}

/**
 * Color scheme for heatmap
 */
export enum ColorScheme {
  COOL_TO_WARM = 'cool_to_warm',      // Blue → Red
  MONOCHROME = 'monochrome',          // Dark → Bright
  VIRIDIS = 'viridis',                // Perceptually uniform
  CUSTOM = 'custom',                  // User defined
}

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

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Individual heatmap cell data
 */
export interface HeatmapCell {
  id: string;
  row: string;
  column: string;
  value: number;              // 0-100 strength
  competencyLevel: CompetencyLevel;
  color: string;
  label: string;
  metadata: {
    skillName?: string;
    domain?: SkillDomain;
    teamMember?: string;
    lastUpdated?: Date;
    verificationStatus?: 'verified' | 'pending' | 'unverified';
    endorsements?: number;
    projectsUsed?: number;
  };
}

/**
 * Heatmap row definition
 */
export interface HeatmapRow {
  id: string;
  label: string;
  domain?: SkillDomain;
  cells: HeatmapCell[];
  averageValue: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Heatmap column definition
 */
export interface HeatmapColumn {
  id: string;
  label: string;
  category?: string;
  cells: HeatmapCell[];
  averageValue: number;
}

/**
 * Complete heatmap matrix
 */
export interface HeatmapMatrix {
  id: string;
  title: string;
  rows: HeatmapRow[];
  columns: HeatmapColumn[];
  cells: HeatmapCell[][];
  viewMode: ViewMode;
  timeFrame: TimeFrame;
}

/**
 * Filter configuration
 */
export interface HeatmapFilter {
  domains: SkillDomain[];
  timeFrame: TimeFrame;
  competencyLevels: CompetencyLevel[];
  searchQuery: string;
  showVerifiedOnly: boolean;
  minValue: number;
  maxValue: number;
}

/**
 * Legend configuration
 */
export interface LegendConfig {
  colorScheme: ColorScheme;
  minValue: number;
  maxValue: number;
  steps: Array<{
    value: number;
    color: string;
    label: string;
  }>;
  showValues: boolean;
}

/**
 * Comparison data for team/domain
 */
export interface ComparisonData {
  id: string;
  name: string;
  type: 'team' | 'domain' | 'individual';
  totalSkills: number;
  averageStrength: number;
  topSkills: Array<{
    name: string;
    strength: number;
    domain: SkillDomain;
  }>;
  weakestSkills: Array<{
    name: string;
    strength: number;
    domain: SkillDomain;
  }>;
  domainDistribution: Record<SkillDomain, number>;
}

/**
 * Hover detail information
 */
export interface CellHoverDetail {
  skillName: string;
  strength: number;
  competencyLevel: CompetencyLevel;
  domain: SkillDomain;
  lastUpdated: Date;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  endorsements: number;
  projectsUsed: number;
  trend: {
    direction: 'up' | 'down' | 'stable';
    changePercentage: number;
    previousValue: number;
  };
}

/**
 * Export configuration
 */
export interface ExportConfig {
  format: 'png' | 'svg' | 'csv' | 'json' | 'pdf';
  includeFilters: boolean;
  includeLegend: boolean;
  includeMetadata: boolean;
  resolution?: 'low' | 'medium' | 'high';
}

// ============================================================================
// State Management
// ============================================================================

/**
 * Heatmap state
 */
export interface HeatmapState {
  matrix: HeatmapMatrix | null;
  filters: HeatmapFilter;
  legendConfig: LegendConfig;
  viewMode: ViewMode;
  selectedCell: HeatmapCell | null;
  hoveredCell: HeatmapCell | null;
  comparisonData: ComparisonData[];
  isLoading: boolean;
  colorScheme: ColorScheme;
}

/**
 * Heatmap actions
 */
export interface HeatmapActions {
  setViewMode: (mode: ViewMode) => void;
  updateFilters: (filters: Partial<HeatmapFilter>) => void;
  setTimeFrame: (timeFrame: TimeFrame) => void;
  selectCell: (cell: HeatmapCell | null) => void;
  hoverCell: (cell: HeatmapCell | null) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  refreshData: () => Promise<void>;
  exportHeatmap: (config: ExportConfig) => void;
  compareTeams: (teamIds: string[]) => void;
  resetFilters: () => void;
}

/**
 * Heatmap Context (State + Actions)
 */
export interface HeatmapContextType {
  state: HeatmapState;
  actions: HeatmapActions;
}

// ============================================================================
// Color Mapping
// ============================================================================

/**
 * Get color for competency value (0-100)
 */
export const getCompetencyColor = (value: number, scheme: ColorScheme = ColorScheme.COOL_TO_WARM): string => {
  const colorMaps: Record<ColorScheme, string[]> = {
    [ColorScheme.COOL_TO_WARM]: [
      '#3B82F6', // 0-20: Blue (cool)
      '#22D3EE', // 21-40: Cyan
      '#10B981', // 41-60: Green
      '#F59E0B', // 61-80: Amber
      '#EF4444', // 81-100: Red (warm)
    ],
    [ColorScheme.MONOCHROME]: [
      '#1E293B', // 0-20: Dark
      '#334155', // 21-40
      '#64748B', // 41-60
      '#94A3B8', // 61-80
      '#F8FAFC', // 81-100: Bright
    ],
    [ColorScheme.VIRIDIS]: [
      '#440154', // 0-20: Dark purple
      '#31688E', // 21-40: Blue
      '#35B779', // 41-60: Green
      '#FDE724', // 61-80: Yellow
      '#FDE724', // 81-100: Bright yellow
    ],
    [ColorScheme.CUSTOM]: [
      '#6366F1', // 0-20: Indigo
      '#8B5CF6', // 21-40: Violet
      '#A855F7', // 41-60: Purple
      '#D946EF', // 61-80: Fuchsia
      '#F0ABFC', // 81-100: Pink
    ],
  };

  const colors = colorMaps[scheme];
  const index = Math.min(Math.floor(value / 20), 4);
  return colors[index];
};

/**
 * Get competency level from value
 */
export const getCompetencyLevel = (value: number): CompetencyLevel => {
  if (value <= 20) return CompetencyLevel.NOVICE;
  if (value <= 40) return CompetencyLevel.BEGINNER;
  if (value <= 60) return CompetencyLevel.INTERMEDIATE;
  if (value <= 80) return CompetencyLevel.ADVANCED;
  return CompetencyLevel.EXPERT;
};

/**
 * Get competency label
 */
export const getCompetencyLabel = (level: CompetencyLevel): string => {
  const labels: Record<CompetencyLevel, string> = {
    [CompetencyLevel.NOVICE]: 'Novice',
    [CompetencyLevel.BEGINNER]: 'Beginner',
    [CompetencyLevel.INTERMEDIATE]: 'Intermediate',
    [CompetencyLevel.ADVANCED]: 'Advanced',
    [CompetencyLevel.EXPERT]: 'Expert',
  };
  return labels[level];
};

/**
 * Domain labels
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
