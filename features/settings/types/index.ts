/**
 * Settings Feature Types
 * Following SkillFlow Nexus architecture patterns
 */

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordLastChanged: Date;
  loginAlertsEnabled: boolean;
  suspiciousActivityAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: "public" | "private" | "connections";
  dataSharingEnabled: boolean;
  analyticsEnabled: boolean;
  marketingEmailsEnabled: boolean;
  skillDataVisibility: "public" | "private" | "verified";
  credentialVisibility: "public" | "private" | "connections";
}

export interface SessionHistory {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: Date;
  isCurrentSession: boolean;
}

export interface SecurityEvent {
  id: string;
  type:
    | "login"
    | "password_change"
    | "2fa_enabled"
    | "2fa_disabled"
    | "account_update"
    | "suspicious_activity";
  description: string;
  timestamp: Date;
  ipAddress: string;
  location: string;
  deviceInfo?: string;
}

export interface SettingsTab {
  id: "account" | "security" | "privacy";
  label: string;
  icon: string;
  description: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteAccountData {
  reason: string;
  confirmation: string;
  password: string;
}
