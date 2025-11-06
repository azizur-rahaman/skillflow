/**
 * Talent Search Types
 * 
 * Type definitions for the talent search feature including talent profiles,
 * filters, search criteria, confidence scoring, and Skill DNA summaries.
 */

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * Talent Profile Entity
 * Represents a candidate/talent with their skills, experience, and metadata
 */
export interface TalentProfile {
  id: string;
  userId: string;
  
  // Basic Info
  name: string;
  title: string;
  avatar: string;
  location: {
    city: string;
    region: string;
    country: string;
    remote: boolean;
  };
  
  // Professional Details
  experience: {
    totalYears: number;
    currentRole: string;
    currentCompany: string;
    previousRoles: Array<{
      title: string;
      company: string;
      duration: number; // months
    }>;
  };
  
  // Skill DNA
  skills: TalentSkill[];
  topSkills: TalentSkill[]; // Top 5-8 skills
  domains: string[]; // e.g., ['Frontend', 'Backend', 'DevOps']
  
  // Confidence & Verification
  confidenceScore: number; // 0-100
  verificationStatus: VerificationStatus;
  endorsementCount: number;
  certificationsCount: number;
  
  // Availability & Preferences
  availability: AvailabilityStatus;
  hourlyRate?: number;
  openToOpportunities: boolean;
  preferredRoles: string[];
  
  // Metadata
  profileCompleteness: number; // 0-100
  lastActive: Date;
  joinedDate: Date;
  verified: boolean;
}

/**
 * Talent Skill
 * Individual skill with proficiency and verification
 */
export interface TalentSkill {
  id: string;
  skillId: string;
  name: string;
  category: string;
  domain: string;
  
  // Proficiency
  proficiency: number; // 0-100
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Evidence & Verification
  yearsExperience: number;
  projectsUsed: number;
  verified: boolean;
  endorsements: number;
  certifications: number;
  
  // Trend
  trending: boolean;
  demandScore?: number; // Future demand prediction
}

/**
 * Verification Status
 */
export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  MANAGER_VERIFIED = 'manager_verified',
  PEER_VERIFIED = 'peer_verified',
  CERTIFIED = 'certified',
  FULLY_VERIFIED = 'fully_verified'
}

/**
 * Availability Status
 */
export enum AvailabilityStatus {
  AVAILABLE_NOW = 'available_now',
  AVAILABLE_2_WEEKS = 'available_2_weeks',
  AVAILABLE_1_MONTH = 'available_1_month',
  PASSIVE = 'passive',
  NOT_AVAILABLE = 'not_available'
}

// ============================================================================
// Search & Filter Types
// ============================================================================

/**
 * Search Filters
 * All available filter criteria for talent search
 */
export interface TalentSearchFilters {
  // Text Search
  searchQuery: string;
  
  // Core Filters
  domains: string[]; // Frontend, Backend, AI/ML, etc.
  skills: string[]; // React, Python, AWS, etc.
  experienceLevels: ExperienceLevel[];
  regions: string[]; // Asia, Europe, North America, etc.
  countries: string[];
  
  // Advanced Filters
  minExperience: number; // Years
  maxExperience: number;
  minConfidence: number; // 0-100
  availability: AvailabilityStatus[];
  verificationStatus: VerificationStatus[];
  
  // Preferences
  remote: boolean | null;
  openToOpportunities: boolean | null;
  hourlyRateRange?: {
    min: number;
    max: number;
  };
  
  // Special Filters
  trending: boolean; // Has trending skills
  certified: boolean; // Has certifications
  endorsed: boolean; // Has endorsements
  recentlyActive: boolean; // Active in last 7 days
}

/**
 * Experience Level
 */
export enum ExperienceLevel {
  JUNIOR = 'junior', // 0-2 years
  MID = 'mid', // 2-5 years
  SENIOR = 'senior', // 5-10 years
  LEAD = 'lead', // 10+ years
  EXPERT = 'expert' // 15+ years
}

/**
 * Sort Option
 */
export interface SortOption {
  field: SortField;
  direction: 'asc' | 'desc';
}

export enum SortField {
  RELEVANCE = 'relevance',
  CONFIDENCE = 'confidence',
  EXPERIENCE = 'experience',
  RECENT_ACTIVITY = 'recent_activity',
  PROFILE_COMPLETENESS = 'profile_completeness',
  HOURLY_RATE = 'hourly_rate'
}

// ============================================================================
// Search Results & State
// ============================================================================

/**
 * Search Results
 */
export interface TalentSearchResults {
  talents: TalentProfile[];
  totalCount: number;
  filteredCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  
  // Aggregations
  aggregations: {
    domainCounts: Record<string, number>;
    skillCounts: Record<string, number>;
    experienceLevelCounts: Record<ExperienceLevel, number>;
    regionCounts: Record<string, number>;
    availabilityCounts: Record<AvailabilityStatus, number>;
  };
}

/**
 * Search State
 */
export interface TalentSearchState {
  // Data
  results: TalentSearchResults | null;
  selectedTalent: TalentProfile | null;
  
  // Filters & Search
  filters: TalentSearchFilters;
  sortBy: SortOption;
  
  // UI State
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  
  // View Mode
  viewMode: 'grid' | 'list';
  showFilters: boolean;
}

/**
 * Search Actions
 */
export interface TalentSearchActions {
  // Search
  search: (query: string) => void;
  applyFilters: (filters: Partial<TalentSearchFilters>) => void;
  resetFilters: () => void;
  setSortBy: (sort: SortOption) => void;
  
  // Pagination
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  
  // Selection
  selectTalent: (talent: TalentProfile | null) => void;
  viewTalentProfile: (talentId: string) => void;
  
  // UI
  setViewMode: (mode: 'grid' | 'list') => void;
  toggleFilters: () => void;
  
  // Data Management
  refreshResults: () => void;
  exportResults: (format: 'json' | 'csv') => void;
}

// ============================================================================
// Confidence Scoring Types
// ============================================================================

/**
 * Confidence Breakdown
 * Detailed confidence scoring components
 */
export interface ConfidenceBreakdown {
  overall: number; // 0-100
  
  components: {
    skillVerification: number; // Weight: 30%
    endorsements: number; // Weight: 20%
    experience: number; // Weight: 25%
    certifications: number; // Weight: 15%
    activity: number; // Weight: 10%
  };
  
  factors: {
    verified: boolean;
    endorsementCount: number;
    yearsExperience: number;
    certificationCount: number;
    lastActiveDate: Date;
  };
}

/**
 * Skill DNA Summary
 * Condensed Skill DNA visualization data
 */
export interface SkillDNASummary {
  domains: Array<{
    name: string;
    color: string;
    strength: number; // 0-100
    skillCount: number;
  }>;
  
  topSkills: Array<{
    name: string;
    proficiency: number;
    trending: boolean;
  }>;
  
  totalSkills: number;
  averageProficiency: number;
  verifiedSkillsCount: number;
}

// ============================================================================
// Helper Functions & Constants
// ============================================================================

/**
 * Get experience level from years
 */
export const getExperienceLevel = (years: number): ExperienceLevel => {
  if (years < 2) return ExperienceLevel.JUNIOR;
  if (years < 5) return ExperienceLevel.MID;
  if (years < 10) return ExperienceLevel.SENIOR;
  if (years < 15) return ExperienceLevel.LEAD;
  return ExperienceLevel.EXPERT;
};

/**
 * Get experience level label
 */
export const getExperienceLevelLabel = (level: ExperienceLevel): string => {
  const labels: Record<ExperienceLevel, string> = {
    [ExperienceLevel.JUNIOR]: 'Junior (0-2 years)',
    [ExperienceLevel.MID]: 'Mid-Level (2-5 years)',
    [ExperienceLevel.SENIOR]: 'Senior (5-10 years)',
    [ExperienceLevel.LEAD]: 'Lead (10-15 years)',
    [ExperienceLevel.EXPERT]: 'Expert (15+ years)'
  };
  return labels[level];
};

/**
 * Get availability status label
 */
export const getAvailabilityLabel = (status: AvailabilityStatus): string => {
  const labels: Record<AvailabilityStatus, string> = {
    [AvailabilityStatus.AVAILABLE_NOW]: 'Available Now',
    [AvailabilityStatus.AVAILABLE_2_WEEKS]: 'Available in 2 Weeks',
    [AvailabilityStatus.AVAILABLE_1_MONTH]: 'Available in 1 Month',
    [AvailabilityStatus.PASSIVE]: 'Passive',
    [AvailabilityStatus.NOT_AVAILABLE]: 'Not Available'
  };
  return labels[status];
};

/**
 * Get availability color
 */
export const getAvailabilityColor = (status: AvailabilityStatus): string => {
  const colors: Record<AvailabilityStatus, string> = {
    [AvailabilityStatus.AVAILABLE_NOW]: '#10B981', // green
    [AvailabilityStatus.AVAILABLE_2_WEEKS]: '#22D3EE', // cyan
    [AvailabilityStatus.AVAILABLE_1_MONTH]: '#F59E0B', // amber
    [AvailabilityStatus.PASSIVE]: '#6366F1', // indigo
    [AvailabilityStatus.NOT_AVAILABLE]: '#6B7280' // gray
  };
  return colors[status];
};

/**
 * Get verification badge color
 */
export const getVerificationColor = (status: VerificationStatus): string => {
  const colors: Record<VerificationStatus, string> = {
    [VerificationStatus.UNVERIFIED]: '#6B7280',
    [VerificationStatus.PENDING]: '#F59E0B',
    [VerificationStatus.MANAGER_VERIFIED]: '#22D3EE',
    [VerificationStatus.PEER_VERIFIED]: '#6366F1',
    [VerificationStatus.CERTIFIED]: '#A855F7',
    [VerificationStatus.FULLY_VERIFIED]: '#10B981'
  };
  return colors[status];
};

/**
 * Calculate confidence score
 */
export const calculateConfidenceScore = (talent: TalentProfile): ConfidenceBreakdown => {
  const verificationWeight = 0.30;
  const endorsementWeight = 0.20;
  const experienceWeight = 0.25;
  const certificationWeight = 0.15;
  const activityWeight = 0.10;
  
  // Component scores
  const skillVerification = talent.verified ? 100 : (talent.verificationStatus === VerificationStatus.PENDING ? 50 : 0);
  const endorsements = Math.min(100, (talent.endorsementCount / 20) * 100);
  const experience = Math.min(100, (talent.experience.totalYears / 15) * 100);
  const certifications = Math.min(100, (talent.certificationsCount / 10) * 100);
  
  const daysSinceActive = (Date.now() - new Date(talent.lastActive).getTime()) / (1000 * 60 * 60 * 24);
  const activity = Math.max(0, 100 - (daysSinceActive * 2)); // 2% penalty per day
  
  const overall = Math.round(
    skillVerification * verificationWeight +
    endorsements * endorsementWeight +
    experience * experienceWeight +
    certifications * certificationWeight +
    activity * activityWeight
  );
  
  return {
    overall,
    components: {
      skillVerification: Math.round(skillVerification),
      endorsements: Math.round(endorsements),
      experience: Math.round(experience),
      certifications: Math.round(certifications),
      activity: Math.round(activity)
    },
    factors: {
      verified: talent.verified,
      endorsementCount: talent.endorsementCount,
      yearsExperience: talent.experience.totalYears,
      certificationCount: talent.certificationsCount,
      lastActiveDate: talent.lastActive
    }
  };
};

/**
 * Default filter values
 */
export const DEFAULT_FILTERS: TalentSearchFilters = {
  searchQuery: '',
  domains: [],
  skills: [],
  experienceLevels: [],
  regions: [],
  countries: [],
  minExperience: 0,
  maxExperience: 50,
  minConfidence: 0,
  availability: [],
  verificationStatus: [],
  remote: null,
  openToOpportunities: null,
  trending: false,
  certified: false,
  endorsed: false,
  recentlyActive: false
};

/**
 * Available filter options
 */
export const FILTER_OPTIONS = {
  domains: [
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'DevOps & Infrastructure',
    'Data Science',
    'AI & Machine Learning',
    'UI/UX Design',
    'Cloud Platforms',
    'Blockchain',
    'Cybersecurity'
  ],
  
  regions: [
    'North America',
    'Europe',
    'Asia',
    'South America',
    'Africa',
    'Oceania',
    'Middle East'
  ],
  
  experienceLevels: [
    ExperienceLevel.JUNIOR,
    ExperienceLevel.MID,
    ExperienceLevel.SENIOR,
    ExperienceLevel.LEAD,
    ExperienceLevel.EXPERT
  ],
  
  availability: [
    AvailabilityStatus.AVAILABLE_NOW,
    AvailabilityStatus.AVAILABLE_2_WEEKS,
    AvailabilityStatus.AVAILABLE_1_MONTH,
    AvailabilityStatus.PASSIVE
  ]
};
