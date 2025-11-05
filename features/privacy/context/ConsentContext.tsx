'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  ConsentContextType,
  ConsentState,
  Permission,
  PermissionType,
} from '../types/consent.types';

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const initialPermissions: Permission[] = [
  {
    id: 'profile_data',
    title: 'Profile Data Collection',
    description: 'Allow us to collect and store your basic profile information',
    detailedDescription: 'We collect your name, email, profile picture, and professional information to personalize your experience and provide core platform features.',
    icon: 'User',
    isRequired: true,
    status: 'pending',
    category: 'essential',
    dataTypes: ['Name', 'Email', 'Profile Picture', 'Job Title', 'Company'],
    retentionPeriod: 'Until account deletion',
    examples: [
      'Display your name on your profile',
      'Send account-related emails',
      'Personalize dashboard experience',
    ],
  },
  {
    id: 'skill_analysis',
    title: 'AI Skill Analysis',
    description: 'Process your resume and profiles to extract skills using AI',
    detailedDescription: 'Our AI analyzes your resume, LinkedIn, and GitHub data to build your Skill DNA and provide personalized recommendations.',
    icon: 'Brain',
    isRequired: true,
    status: 'pending',
    category: 'essential',
    dataTypes: ['Resume Content', 'Work Experience', 'Projects', 'Code Repositories'],
    retentionPeriod: '5 years or until deletion',
    examples: [
      'Extract skills from your resume',
      'Analyze GitHub contributions',
      'Generate skill strength scores',
    ],
  },
  {
    id: 'activity_tracking',
    title: 'Activity Tracking',
    description: 'Track your learning progress and platform usage',
    detailedDescription: 'We monitor your activity on the platform to improve features, track learning progress, and provide analytics.',
    icon: 'Activity',
    isRequired: false,
    status: 'pending',
    category: 'functional',
    dataTypes: ['Page Views', 'Learning Progress', 'Feature Usage', 'Time Spent'],
    retentionPeriod: '2 years',
    examples: [
      'Track course completion',
      'Show learning streaks',
      'Provide usage insights',
    ],
  },
  {
    id: 'data_sharing',
    title: 'Data Sharing with Partners',
    description: 'Share anonymized data with educational and hiring partners',
    detailedDescription: 'With your consent, we may share anonymized skill data with verified partners to improve job matching and course recommendations.',
    icon: 'Share2',
    isRequired: false,
    status: 'pending',
    category: 'functional',
    dataTypes: ['Anonymized Skills', 'Learning Preferences', 'Career Goals'],
    retentionPeriod: '1 year',
    examples: [
      'Match you with relevant job opportunities',
      'Recommend personalized courses',
      'Improve platform algorithms',
    ],
  },
  {
    id: 'email_notifications',
    title: 'Email Notifications',
    description: 'Receive emails about platform updates and recommendations',
    detailedDescription: 'Get notified about new features, skill forecasts, learning opportunities, and important account updates.',
    icon: 'Mail',
    isRequired: false,
    status: 'pending',
    category: 'marketing',
    dataTypes: ['Email Address', 'Communication Preferences'],
    retentionPeriod: 'Until unsubscribe',
    examples: [
      'Weekly skill forecast updates',
      'New course recommendations',
      'Platform feature announcements',
    ],
  },
  {
    id: 'analytics',
    title: 'Performance Analytics',
    description: 'Help us improve the platform with usage analytics',
    detailedDescription: 'We use analytics tools to understand how users interact with SkillFlow and identify areas for improvement.',
    icon: 'BarChart3',
    isRequired: false,
    status: 'pending',
    category: 'analytics',
    dataTypes: ['Device Type', 'Browser', 'Session Duration', 'Click Events'],
    retentionPeriod: '90 days',
    examples: [
      'Identify popular features',
      'Detect performance issues',
      'Optimize user experience',
    ],
  },
  {
    id: 'third_party_integrations',
    title: 'Third-Party Integrations',
    description: 'Connect with external services for enhanced features',
    detailedDescription: 'Enable integrations with tools like Google Calendar, Slack, and video conferencing platforms for seamless workflows.',
    icon: 'Plug',
    isRequired: false,
    status: 'pending',
    category: 'functional',
    dataTypes: ['API Tokens', 'Integration Settings', 'Sync Preferences'],
    retentionPeriod: 'Until disconnected',
    examples: [
      'Sync learning events to calendar',
      'Send notifications to Slack',
      'Join mentorship sessions via Zoom',
    ],
  },
];

interface ConsentProviderProps {
  children: React.ReactNode;
  onComplete?: (state: ConsentState) => void;
}

export function ConsentProvider({ children, onComplete }: ConsentProviderProps) {
  const [state, setState] = useState<ConsentState>({
    permissions: initialPermissions,
    isComplete: false,
  });

  const togglePermission = useCallback((permissionId: PermissionType) => {
    setState((prev) => ({
      ...prev,
      permissions: prev.permissions.map((permission) =>
        permission.id === permissionId && !permission.isRequired
          ? {
              ...permission,
              status: permission.status === 'granted' ? 'denied' : 'granted',
            }
          : permission
      ),
    }));
  }, []);

  const grantAllPermissions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      permissions: prev.permissions.map((permission) => ({
        ...permission,
        status: 'granted',
      })),
    }));
  }, []);

  const denyAllOptionalPermissions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      permissions: prev.permissions.map((permission) => ({
        ...permission,
        status: permission.isRequired ? 'granted' : 'denied',
      })),
    }));
  }, []);

  const saveConsent = useCallback(async () => {
    // Auto-grant required permissions
    const updatedPermissions = state.permissions.map((permission) => ({
      ...permission,
      status: permission.isRequired ? 'granted' : permission.status,
    })) as Permission[];

    const updatedState: ConsentState = {
      permissions: updatedPermissions,
      lastUpdated: new Date(),
      acceptedTermsVersion: '1.0.0',
      isComplete: true,
    };

    setState(updatedState);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onComplete?.(updatedState);
  }, [state.permissions, onComplete]);

  const resetConsent = useCallback(() => {
    setState({
      permissions: initialPermissions,
      isComplete: false,
    });
  }, []);

  const value: ConsentContextType = {
    state,
    togglePermission,
    grantAllPermissions,
    denyAllOptionalPermissions,
    saveConsent,
    resetConsent,
  };

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
}
