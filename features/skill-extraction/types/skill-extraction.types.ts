/**
 * Skill Extraction Types
 * Domain types for AI-powered skill extraction from resumes and profiles
 */

// ==================== Value Objects ====================

/**
 * Confidence level enum
 */
export enum ConfidenceLevel {
  LOW = 'low',       // 0-59%
  MEDIUM = 'medium', // 60-79%
  HIGH = 'high',     // 80-94%
  VERY_HIGH = 'very_high' // 95-100%
}

/**
 * AI verification status
 */
export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  MANUAL_REVIEW = 'manual_review'
}

/**
 * Source of skill extraction
 */
export enum ExtractionSource {
  RESUME = 'resume',
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  UPWORK = 'upwork',
  MANUAL = 'manual',
  PORTFOLIO = 'portfolio'
}

/**
 * Skill category
 */
export enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT_SKILL = 'soft_skill',
  LANGUAGE = 'language',
  TOOL = 'tool',
  FRAMEWORK = 'framework',
  CERTIFICATION = 'certification',
  DOMAIN = 'domain'
}

/**
 * View mode for skill display
 */
export enum ViewMode {
  GRID = 'grid',
  TABLE = 'table',
  CLOUD = 'cloud'
}

/**
 * Filter criteria
 */
export enum FilterCriteria {
  ALL = 'all',
  VERIFIED = 'verified',
  PENDING = 'pending',
  HIGH_CONFIDENCE = 'high_confidence',
  REQUIRES_REVIEW = 'requires_review'
}

// ==================== Entities ====================

/**
 * Evidence supporting a skill extraction
 */
export interface SkillEvidence {
  id: string;
  source: ExtractionSource;
  context: string; // Text snippet where skill was found
  location: string; // Section/position in source document
  timestamp: Date;
  weight: number; // Evidence strength 0-1
}

/**
 * AI analysis metadata
 */
export interface AIAnalysis {
  model: string; // GPT-4, Claude, etc.
  confidence: number; // 0-100
  reasoning: string; // Why this skill was extracted
  alternatives: string[]; // Similar/related skills considered
  timestamp: Date;
  processingTime: number; // milliseconds
}

/**
 * Extracted skill entity
 */
export interface ExtractedSkill {
  id: string;
  name: string;
  normalizedName: string; // Standardized skill name
  category: SkillCategory;
  confidence: number; // 0-100
  confidenceLevel: ConfidenceLevel;
  verificationStatus: VerificationStatus;
  sources: ExtractionSource[];
  evidence: SkillEvidence[];
  aiAnalysis: AIAnalysis;
  yearsOfExperience?: number;
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relatedSkills: string[]; // IDs of related skills
  isEndorsed: boolean;
  endorsementCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

/**
 * Skill extraction job metadata
 */
export interface ExtractionJob {
  id: string;
  userId: string;
  source: ExtractionSource;
  fileName?: string;
  fileSize?: number;
  status: 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  totalSkillsFound: number;
  startedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

/**
 * Extraction statistics
 */
export interface ExtractionStats {
  totalSkills: number;
  verifiedSkills: number;
  pendingSkills: number;
  highConfidenceSkills: number;
  mediumConfidenceSkills: number;
  lowConfidenceSkills: number;
  averageConfidence: number;
  sourceBreakdown: Record<ExtractionSource, number>;
  categoryBreakdown: Record<SkillCategory, number>;
}

/**
 * Bulk action type
 */
export type BulkActionType = 'verify' | 'reject' | 'delete' | 'export';

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors: string[];
}

// ==================== Context State ====================

/**
 * Skill extraction context state
 */
export interface SkillExtractionState {
  skills: ExtractedSkill[];
  filteredSkills: ExtractedSkill[];
  selectedSkills: Set<string>;
  activeFilter: FilterCriteria;
  viewMode: ViewMode;
  searchQuery: string;
  stats: ExtractionStats;
  currentJob: ExtractionJob | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Skill extraction context actions
 */
export interface SkillExtractionActions {
  // Skill management
  addSkill: (skill: Omit<ExtractedSkill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, updates: Partial<ExtractedSkill>) => void;
  removeSkill: (id: string) => void;
  removeSkills: (ids: string[]) => void;
  
  // Verification
  verifySkill: (id: string) => void;
  rejectSkill: (id: string) => void;
  markForReview: (id: string) => void;
  
  // Selection
  selectSkill: (id: string) => void;
  deselectSkill: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  toggleSelection: (id: string) => void;
  
  // Bulk operations
  verifySelected: () => Promise<BulkOperationResult>;
  rejectSelected: () => Promise<BulkOperationResult>;
  deleteSelected: () => Promise<BulkOperationResult>;
  exportSelected: (format: 'json' | 'csv') => void;
  
  // Filtering & search
  setFilter: (filter: FilterCriteria) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  applyFilters: () => void;
  
  // Extraction job
  startExtraction: (source: ExtractionSource, file?: File) => Promise<void>;
  cancelExtraction: () => void;
  
  // Statistics
  calculateStats: () => ExtractionStats;
  refreshStats: () => void;
}

/**
 * Complete skill extraction context
 */
export type SkillExtractionContextType = SkillExtractionState & SkillExtractionActions;

// ==================== Component Props ====================

/**
 * Skill card props
 */
export interface SkillCardProps {
  skill: ExtractedSkill;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  onVerify?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

/**
 * Confidence meter props
 */
export interface ConfidenceMeterProps {
  confidence: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
}

/**
 * Extraction summary props
 */
export interface ExtractionSummaryProps {
  stats: ExtractionStats;
  currentJob?: ExtractionJob | null;
}

/**
 * Filter bar props
 */
export interface FilterBarProps {
  activeFilter: FilterCriteria;
  onFilterChange: (filter: FilterCriteria) => void;
  stats: ExtractionStats;
}

/**
 * Bulk action bar props
 */
export interface BulkActionBarProps {
  selectedCount: number;
  onVerify: () => void;
  onReject: () => void;
  onDelete: () => void;
  onExport: () => void;
  onDeselectAll: () => void;
}
