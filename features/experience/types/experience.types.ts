/**
 * Experience & Projects Feature - Type Definitions
 * Timeline-based work history and project portfolio management
 */

export type ExperienceType = 'work' | 'project' | 'education' | 'volunteer';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
export type ProjectStatus = 'in-progress' | 'completed' | 'archived';

export interface DateRange {
  startDate: Date;
  endDate: Date | null; // null = current/ongoing
  isCurrent: boolean;
}

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  employmentType: EmploymentType;
  dateRange: DateRange;
  description: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
  projects: string[]; // Project IDs associated with this experience
  isVerified: boolean;
  linkedInUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  thumbnail?: string;
  status: ProjectStatus;
  dateRange: DateRange;
  role: string;
  teamSize?: number;
  skills: string[];
  technologies: string[];
  highlights: string[];
  links: ProjectLink[];
  experienceId?: string; // Associated work experience
  metrics?: ProjectMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectLink {
  id: string;
  type: 'github' | 'demo' | 'website' | 'video' | 'documentation';
  url: string;
  label: string;
}

export interface ProjectMetrics {
  users?: number;
  revenue?: string;
  performance?: string;
  impact?: string;
}

export interface TimelineItem {
  id: string;
  type: ExperienceType;
  data: Experience | Project;
  year: number;
  month: number;
  isCurrent: boolean;
}

export interface TimelineGroup {
  year: number;
  items: TimelineItem[];
}

// Modal state
export type ModalMode = 'add' | 'edit' | 'view' | 'closed';
export type ModalType = 'experience' | 'project';

export interface ModalState {
  isOpen: boolean;
  mode: ModalMode;
  type: ModalType;
  editingId?: string;
}

export interface ExperienceFormData {
  type: ExperienceType;
  title: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
}

export interface ProjectFormData {
  title: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  role: string;
  teamSize?: number;
  skills: string[];
  technologies: string[];
  highlights: string[];
  links: ProjectLink[];
}

export interface FormValidation {
  field: string;
  isValid: boolean;
  error?: string;
}

// Context types
export interface ExperienceState {
  experiences: Experience[];
  projects: Project[];
  timeline: TimelineGroup[];
  modalState: ModalState;
  selectedFilter: ExperienceType | 'all';
  isLoading: boolean;
  error: string | null;
}

export interface ExperienceContextType {
  state: ExperienceState;
  // Modal actions
  openAddExperience: () => void;
  openAddProject: () => void;
  openEditExperience: (id: string) => void;
  openEditProject: (id: string) => void;
  closeModal: () => void;
  // CRUD operations
  addExperience: (data: ExperienceFormData) => Promise<void>;
  updateExperience: (id: string, data: ExperienceFormData) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  addProject: (data: ProjectFormData) => Promise<void>;
  updateProject: (id: string, data: ProjectFormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  // Filters
  setFilter: (filter: ExperienceType | 'all') => void;
  // Utilities
  getExperience: (id: string) => Experience | undefined;
  getProject: (id: string) => Project | undefined;
  buildTimeline: () => TimelineGroup[];
  validateForm: (data: ExperienceFormData | ProjectFormData) => FormValidation[];
}

// Helper types
export interface DurationDisplay {
  text: string;
  months: number;
  isCurrent: boolean;
}

export interface SkillBadgeProps {
  skill: string;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
}
