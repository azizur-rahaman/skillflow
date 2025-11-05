export type PermissionType = 
  | 'profile_data'
  | 'skill_analysis'
  | 'activity_tracking'
  | 'data_sharing'
  | 'email_notifications'
  | 'analytics'
  | 'third_party_integrations';

export type ConsentStatus = 'granted' | 'denied' | 'pending';

export interface Permission {
  id: PermissionType;
  title: string;
  description: string;
  detailedDescription: string;
  icon: string; // Lucide icon name
  isRequired: boolean;
  status: ConsentStatus;
  examples?: string[];
  dataTypes?: string[];
  retentionPeriod?: string;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
}

export interface ConsentState {
  permissions: Permission[];
  lastUpdated?: Date;
  acceptedTermsVersion?: string;
  isComplete: boolean;
}

export interface PrivacySection {
  title: string;
  content: string;
  icon: string;
}

export interface ConsentContextType {
  state: ConsentState;
  togglePermission: (permissionId: PermissionType) => void;
  grantAllPermissions: () => void;
  denyAllOptionalPermissions: () => void;
  saveConsent: () => Promise<void>;
  resetConsent: () => void;
}
