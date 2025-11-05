/**
 * Profile Feature - Type Definitions
 * User identity, bio, skills, and profile completion tracking
 */

export type ProfileSection = 
  | 'avatar'
  | 'basic_info'
  | 'bio'
  | 'title'
  | 'location'
  | 'skills'
  | 'social_links';

export type ProfileCompletionStatus = 'incomplete' | 'partial' | 'complete';

export interface ProfileAvatar {
  url: string;
  file?: File;
  uploadProgress?: number;
}

export interface UserProfile {
  id: string;
  userId: string;
  avatar: ProfileAvatar | null;
  firstName: string;
  lastName: string;
  displayName: string;
  title: string;
  bio: string;
  location: string;
  skills: string[];
  suggestedSkills: string[];
  socialLinks: SocialLink[];
  profileCompletion: ProfileCompletion;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialLink {
  id: string;
  platform: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'other';
  url: string;
  verified: boolean;
}

export interface ProfileCompletion {
  percentage: number;
  completedSections: ProfileSection[];
  incompleteSections: ProfileSection[];
  milestones: Milestone[];
  status: ProfileCompletionStatus;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  threshold: number;
  achieved: boolean;
  icon: string;
  reward?: string;
}

export interface ProfileEditState {
  isEditing: boolean;
  editingField: ProfileSection | null;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  lastSaved?: Date;
}

export interface ProfileValidation {
  field: ProfileSection;
  isValid: boolean;
  error?: string;
}

export interface SkillSuggestion {
  skill: string;
  confidence: number;
  source: 'linkedin' | 'github' | 'resume' | 'ai';
  category?: string;
}

// Context types
export interface ProfileState {
  profile: UserProfile | null;
  editState: ProfileEditState;
  validations: ProfileValidation[];
  isLoading: boolean;
  error: string | null;
}

export interface ProfileContextType {
  state: ProfileState;
  // Profile actions
  updateAvatar: (file: File) => Promise<void>;
  removeAvatar: () => Promise<void>;
  updateField: (field: ProfileSection, value: string) => void;
  saveField: (field: ProfileSection) => Promise<void>;
  cancelEdit: (field: ProfileSection) => void;
  // Skills management
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  acceptSuggestedSkill: (skill: string) => void;
  dismissSuggestedSkill: (skill: string) => void;
  // Social links
  addSocialLink: (platform: SocialLink['platform'], url: string) => void;
  removeSocialLink: (id: string) => void;
  // Validation
  validateField: (field: ProfileSection) => boolean;
  // Utilities
  refreshProfile: () => Promise<void>;
  calculateCompletion: () => ProfileCompletion;
}

// Helper types
export interface AvatarUploadOptions {
  maxSizeMB: number;
  acceptedFormats: string[];
  quality: number;
}

export interface ProfileFieldConfig {
  field: ProfileSection;
  label: string;
  placeholder: string;
  maxLength: number;
  required: boolean;
  multiline: boolean;
}
