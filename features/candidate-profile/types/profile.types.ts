/**
 * Candidate Profile Types
 * 
 * Comprehensive type system for 360° candidate view including
 * verified skills, blockchain tokens, projects, and endorsements.
 */

// ============================================================================
// Core Profile Types
// ============================================================================

export interface CandidateProfile {
  id: string;
  userId: string;
  
  // Basic Info
  personalInfo: PersonalInfo;
  
  // Professional
  professionalSummary: ProfessionalSummary;
  
  // Skills & Competencies
  skillDNA: SkillDNAProfile;
  skillGraph: SkillGraphData;
  
  // Credentials & Verification
  blockchainCredentials: BlockchainCredential[];
  certifications: Certification[];
  
  // Experience & Projects
  projects: Project[];
  workExperience: WorkExperience[];
  
  // Social Proof
  endorsements: Endorsement[];
  testimonials: Testimonial[];
  
  // Metrics
  profileMetrics: ProfileMetrics;
  activityMetrics: ActivityMetrics;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  profileCompleteness: number; // 0-100
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl: string;
  title: string; // Professional title
  location: {
    city: string;
    region: string;
    country: string;
    timezone: string;
    isRemote: boolean;
  };
  contact: {
    email: string;
    phone?: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
    website?: string;
  };
  bio: string;
  languages: Language[];
  preferredWorkMode: 'remote' | 'hybrid' | 'onsite' | 'flexible';
}

export interface Language {
  name: string;
  proficiency: 'native' | 'fluent' | 'professional' | 'limited';
}

export interface ProfessionalSummary {
  headline: string; // One-liner summary
  yearsOfExperience: number;
  currentRole?: string;
  currentCompany?: string;
  availability: AvailabilityStatus;
  expectedSalary?: SalaryRange;
  noticePeriod?: string; // e.g., "2 weeks", "1 month", "immediately"
  openToRoles: string[]; // e.g., ["Senior Developer", "Tech Lead"]
  preferredIndustries: string[];
}

export type AvailabilityStatus = 
  | 'available'
  | 'open-to-offers'
  | 'employed-passive'
  | 'not-available';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

// ============================================================================
// Skill DNA & Graph
// ============================================================================

export interface SkillDNAProfile {
  overallConfidence: number; // 0-100
  totalSkills: number;
  verifiedSkills: number;
  domains: DomainBreakdown[];
  topSkills: SkillWithConfidence[];
  emergingSkills: SkillWithConfidence[];
  lastUpdated: string;
}

export interface DomainBreakdown {
  domain: string;
  skillCount: number;
  avgConfidence: number;
  color: string; // Hex color for visualization
  icon: string;
}

export interface SkillWithConfidence {
  skillId: string;
  name: string;
  category: string;
  confidence: number; // 0-100
  yearsOfExperience: number;
  lastUsed: string;
  proficiencyLevel: ProficiencyLevel;
  isTrending: boolean;
  isVerified: boolean;
  endorsementCount: number;
}

export type ProficiencyLevel = 
  | 'beginner'
  | 'intermediate' 
  | 'advanced'
  | 'expert'
  | 'master';

export interface SkillGraphData {
  nodes: SkillNode[];
  edges: SkillEdge[];
  clusters: SkillCluster[];
  statistics: GraphStatistics;
}

export interface SkillNode {
  id: string;
  label: string;
  category: string;
  confidence: number;
  size: number; // Visual size based on importance
  color: string;
  x?: number; // Position for layout
  y?: number;
  metadata: {
    yearsExp: number;
    projectCount: number;
    endorsements: number;
    lastUsed: string;
  };
}

export interface SkillEdge {
  source: string; // Node ID
  target: string; // Node ID
  strength: number; // 0-1 relationship strength
  type: 'complementary' | 'prerequisite' | 'related';
}

export interface SkillCluster {
  id: string;
  name: string;
  skills: string[]; // Skill IDs
  centerSkill: string;
  color: string;
}

export interface GraphStatistics {
  totalConnections: number;
  avgConnections: number;
  densestCluster: string;
  isolatedSkills: number;
}

// ============================================================================
// Blockchain Credentials & Tokens
// ============================================================================

export interface BlockchainCredential {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  issuer: {
    name: string;
    logo: string;
    verified: boolean;
  };
  issuedDate: string;
  expiryDate?: string;
  blockchain: {
    network: 'ethereum' | 'polygon' | 'base' | 'skillchain';
    contractAddress: string;
    tokenStandard: 'ERC-721' | 'ERC-1155' | 'SBT';
    transactionHash: string;
  };
  metadata: {
    image: string;
    attributes: TokenAttribute[];
    skillsCertified: string[];
  };
  verification: {
    status: 'verified' | 'pending' | 'expired';
    verifiedBy: string[];
    verificationDate?: string;
  };
  displayBadge: BadgeStyle;
}

export interface TokenAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'string' | 'number' | 'date' | 'percentage';
}

export interface BadgeStyle {
  shape: 'circle' | 'shield' | 'hexagon' | 'square';
  gradientColors: string[];
  glowEffect: boolean;
  borderStyle: 'solid' | 'gradient' | 'none';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl?: string;
  logo: string;
  skills: string[];
  isBlockchainBacked: boolean;
  blockchainCredentialId?: string;
}

// ============================================================================
// Projects & Experience
// ============================================================================

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  company?: string;
  duration: {
    startDate: string;
    endDate?: string;
    isOngoing: boolean;
  };
  images: ProjectImage[];
  techStack: TechStackItem[];
  skillsUsed: string[];
  outcomes: ProjectOutcome[];
  links: {
    live?: string;
    github?: string;
    demo?: string;
    caseStudy?: string;
  };
  category: 'professional' | 'personal' | 'open-source' | 'academic';
  featured: boolean;
  confidenceBoost: number; // How much this project contributed to skill confidence
}

export interface ProjectImage {
  url: string;
  caption?: string;
  isPrimary: boolean;
}

export interface TechStackItem {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'platform' | 'database';
  icon?: string;
  proficiency: ProficiencyLevel;
}

export interface ProjectOutcome {
  metric: string; // e.g., "Performance improvement", "Users reached"
  value: string; // e.g., "40% faster", "10K+ users"
  impact: 'high' | 'medium' | 'low';
}

export interface WorkExperience {
  id: string;
  company: string;
  companyLogo?: string;
  position: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  duration: {
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
  };
  description: string;
  responsibilities: string[];
  achievements: string[];
  skillsUsed: string[];
  techStack: string[];
}

// ============================================================================
// Endorsements & Social Proof
// ============================================================================

export interface Endorsement {
  id: string;
  skillId: string;
  skillName: string;
  endorser: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    company?: string;
    relationship: 'colleague' | 'manager' | 'client' | 'mentor' | 'peer';
  };
  rating: number; // 1-5
  comment?: string;
  verificationMethod: 'linkedin' | 'email' | 'blockchain' | 'platform';
  isBlockchainVerified: boolean;
  endorsedDate: string;
  weight: number; // Credibility weight 0-1
}

export interface Testimonial {
  id: string;
  author: {
    name: string;
    avatar: string;
    title: string;
    company: string;
  };
  content: string;
  relationship: string; // e.g., "Worked together at XYZ Corp"
  date: string;
  rating?: number;
  featured: boolean;
}

// ============================================================================
// Metrics & Analytics
// ============================================================================

export interface ProfileMetrics {
  profileViews: number;
  profileViewsThisWeek: number;
  searchAppearances: number;
  contactRequests: number;
  endorsementRate: number; // 0-100
  responseRate: number; // 0-100
  averageResponseTime: string; // e.g., "2 hours"
}

export interface ActivityMetrics {
  lastLogin: string;
  skillsAddedLast30Days: number;
  projectsUpdatedLast30Days: number;
  endorsementsReceivedLast30Days: number;
  learningHoursLast30Days: number;
  streakDays: number;
}

// ============================================================================
// UI-Specific Types
// ============================================================================

export interface ProfileSection {
  id: string;
  title: string;
  icon: string;
  isVisible: boolean;
  order: number;
}

export interface ProfileViewConfig {
  layout: 'default' | 'compact' | 'enterprise';
  theme: 'dark' | 'light';
  visibleSections: string[];
  highlightMode: 'skills' | 'projects' | 'credentials' | 'balanced';
}

export interface DownloadResumeOptions {
  format: 'pdf' | 'docx' | 'json';
  template: 'modern' | 'classic' | 'ats-optimized' | 'creative';
  includeSections: string[];
  includeSkillGraph: boolean;
  includeTokenBadges: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

export const getProfileCompleteness = (profile: Partial<CandidateProfile>): number => {
  const weights = {
    personalInfo: 20,
    professionalSummary: 15,
    skillDNA: 20,
    projects: 15,
    workExperience: 15,
    blockchainCredentials: 10,
    endorsements: 5,
  };
  
  let score = 0;
  
  if (profile.personalInfo?.fullName) score += weights.personalInfo;
  if (profile.professionalSummary?.headline) score += weights.professionalSummary;
  if (profile.skillDNA && profile.skillDNA.totalSkills > 5) score += weights.skillDNA;
  if (profile.projects && profile.projects.length > 0) score += weights.projects;
  if (profile.workExperience && profile.workExperience.length > 0) score += weights.workExperience;
  if (profile.blockchainCredentials && profile.blockchainCredentials.length > 0) score += weights.blockchainCredentials;
  if (profile.endorsements && profile.endorsements.length > 3) score += weights.endorsements;
  
  return score;
};

export const getAvailabilityColor = (status: AvailabilityStatus): string => {
  const colors = {
    'available': '#10B981', // Green
    'open-to-offers': '#22D3EE', // Cyan
    'employed-passive': '#F59E0B', // Amber
    'not-available': '#64748B', // Slate
  };
  return colors[status];
};

export const getAvailabilityLabel = (status: AvailabilityStatus): string => {
  const labels = {
    'available': 'Available Now',
    'open-to-offers': 'Open to Offers',
    'employed-passive': 'Passively Looking',
    'not-available': 'Not Available',
  };
  return labels[status];
};

export const getProficiencyColor = (level: ProficiencyLevel): string => {
  const colors = {
    'beginner': '#64748B',
    'intermediate': '#3B82F6',
    'advanced': '#8B5CF6',
    'expert': '#EC4899',
    'master': '#F59E0B',
  };
  return colors[level];
};

export const formatDuration = (startDate: string, endDate?: string, isCurrent?: boolean): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                 (end.getMonth() - start.getMonth());
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  let result = '';
  if (years > 0) result += `${years} yr${years > 1 ? 's' : ''}`;
  if (remainingMonths > 0) {
    if (result) result += ' ';
    result += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
  }
  
  return result || '< 1 mo';
};

export const calculateSkillConfidence = (
  yearsExp: number,
  projectCount: number,
  endorsements: number,
  certifications: number,
  recentUsage: boolean
): number => {
  let confidence = 0;
  
  // Years of experience (max 40 points)
  confidence += Math.min(yearsExp * 8, 40);
  
  // Project count (max 25 points)
  confidence += Math.min(projectCount * 5, 25);
  
  // Endorsements (max 20 points)
  confidence += Math.min(endorsements * 4, 20);
  
  // Certifications (max 10 points)
  confidence += Math.min(certifications * 5, 10);
  
  // Recent usage bonus (5 points)
  if (recentUsage) confidence += 5;
  
  return Math.min(confidence, 100);
};
