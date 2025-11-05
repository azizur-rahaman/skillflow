'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  ProfileState,
  ProfileContextType,
  UserProfile,
  ProfileSection,
  ProfileCompletion,
  ProfileAvatar,
  SocialLink,
} from '../types/profile.types';

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Initial mock profile data
const initialProfile: UserProfile = {
  id: 'profile-001',
  userId: 'user-001',
  avatar: null,
  firstName: 'Alex',
  lastName: 'Thompson',
  displayName: 'Alex Thompson',
  title: '',
  bio: '',
  location: '',
  skills: [],
  suggestedSkills: [
    'React',
    'TypeScript',
    'Node.js',
    'Machine Learning',
    'Data Science',
    'Python',
  ],
  socialLinks: [],
  profileCompletion: {
    percentage: 30,
    completedSections: ['basic_info'],
    incompleteSections: ['avatar', 'bio', 'title', 'location', 'skills', 'social_links'],
    milestones: [
      {
        id: 'milestone-1',
        title: 'Profile Started',
        description: 'Complete basic information',
        threshold: 25,
        achieved: true,
        icon: 'UserPlus',
        reward: '10 XP',
      },
      {
        id: 'milestone-2',
        title: 'Half Way There',
        description: 'Reach 50% profile completion',
        threshold: 50,
        achieved: false,
        icon: 'TrendingUp',
        reward: '25 XP',
      },
      {
        id: 'milestone-3',
        title: 'Profile Master',
        description: 'Achieve 100% profile completion',
        threshold: 100,
        achieved: false,
        icon: 'Award',
        reward: '50 XP + Badge',
      },
    ],
    status: 'partial',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProfileState>({
    profile: initialProfile,
    editState: {
      isEditing: false,
      editingField: null,
      hasUnsavedChanges: false,
      isSaving: false,
    },
    validations: [],
    isLoading: false,
    error: null,
  });

  // Calculate profile completion
  const calculateCompletion = useCallback((): ProfileCompletion => {
    if (!state.profile) {
      return {
        percentage: 0,
        completedSections: [],
        incompleteSections: [],
        milestones: [],
        status: 'incomplete',
      };
    }

    const profile = state.profile;
    const sections: ProfileSection[] = [
      'avatar',
      'basic_info',
      'bio',
      'title',
      'location',
      'skills',
      'social_links',
    ];

    const completedSections: ProfileSection[] = [];
    const incompleteSections: ProfileSection[] = [];

    sections.forEach((section) => {
      let isComplete = false;

      switch (section) {
        case 'avatar':
          isComplete = profile.avatar !== null && profile.avatar.url.length > 0;
          break;
        case 'basic_info':
          isComplete = profile.firstName.length > 0 && profile.lastName.length > 0;
          break;
        case 'bio':
          isComplete = profile.bio.length >= 50;
          break;
        case 'title':
          isComplete = profile.title.length > 0;
          break;
        case 'location':
          isComplete = profile.location.length > 0;
          break;
        case 'skills':
          isComplete = profile.skills.length >= 3;
          break;
        case 'social_links':
          isComplete = profile.socialLinks.length >= 1;
          break;
      }

      if (isComplete) {
        completedSections.push(section);
      } else {
        incompleteSections.push(section);
      }
    });

    const percentage = Math.round((completedSections.length / sections.length) * 100);

    // Update milestones
    const milestones = initialProfile.profileCompletion.milestones.map((milestone) => ({
      ...milestone,
      achieved: percentage >= milestone.threshold,
    }));

    let status: ProfileCompletion['status'] = 'incomplete';
    if (percentage === 100) {
      status = 'complete';
    } else if (percentage > 0) {
      status = 'partial';
    }

    return {
      percentage,
      completedSections,
      incompleteSections,
      milestones,
      status,
    };
  }, [state.profile]);

  // Update avatar
  const updateAvatar = useCallback(async (file: File) => {
    if (!state.profile) return;

    setState((prev) => ({
      ...prev,
      editState: { ...prev.editState, isSaving: true },
    }));

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create object URL for preview
    const url = URL.createObjectURL(file);

    setState((prev) => {
      if (!prev.profile) return prev;

      const updatedProfile = {
        ...prev.profile,
        avatar: { url, file },
        updatedAt: new Date(),
      };

      return {
        ...prev,
        profile: {
          ...updatedProfile,
          profileCompletion: calculateCompletion(),
        },
        editState: {
          ...prev.editState,
          isSaving: false,
          lastSaved: new Date(),
        },
      };
    });
  }, [state.profile, calculateCompletion]);

  // Remove avatar
  const removeAvatar = useCallback(async () => {
    if (!state.profile) return;

    setState((prev) => {
      if (!prev.profile) return prev;

      const updatedProfile = {
        ...prev.profile,
        avatar: null,
        updatedAt: new Date(),
      };

      return {
        ...prev,
        profile: {
          ...updatedProfile,
          profileCompletion: calculateCompletion(),
        },
      };
    });
  }, [state.profile, calculateCompletion]);

  // Update field
  const updateField = useCallback((field: ProfileSection, value: string) => {
    setState((prev) => {
      if (!prev.profile) return prev;

      let updatedProfile = { ...prev.profile };

      switch (field) {
        case 'title':
          updatedProfile.title = value;
          break;
        case 'bio':
          updatedProfile.bio = value;
          break;
        case 'location':
          updatedProfile.location = value;
          break;
      }

      return {
        ...prev,
        profile: updatedProfile,
        editState: {
          ...prev.editState,
          isEditing: true,
          editingField: field,
          hasUnsavedChanges: true,
        },
      };
    });
  }, []);

  // Save field
  const saveField = useCallback(async (field: ProfileSection) => {
    setState((prev) => ({
      ...prev,
      editState: { ...prev.editState, isSaving: true },
    }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setState((prev) => {
      if (!prev.profile) return prev;

      return {
        ...prev,
        profile: {
          ...prev.profile,
          profileCompletion: calculateCompletion(),
          updatedAt: new Date(),
        },
        editState: {
          isEditing: false,
          editingField: null,
          hasUnsavedChanges: false,
          isSaving: false,
          lastSaved: new Date(),
        },
      };
    });
  }, [calculateCompletion]);

  // Cancel edit
  const cancelEdit = useCallback((field: ProfileSection) => {
    setState((prev) => ({
      ...prev,
      editState: {
        ...prev.editState,
        isEditing: false,
        editingField: null,
        hasUnsavedChanges: false,
      },
    }));
  }, []);

  // Add skill
  const addSkill = useCallback((skill: string) => {
    setState((prev) => {
      if (!prev.profile) return prev;

      const trimmedSkill = skill.trim();
      if (trimmedSkill.length === 0) return prev;
      if (prev.profile.skills.includes(trimmedSkill)) return prev;

      const updatedProfile = {
        ...prev.profile,
        skills: [...prev.profile.skills, trimmedSkill],
        profileCompletion: calculateCompletion(),
        updatedAt: new Date(),
      };

      return {
        ...prev,
        profile: updatedProfile,
      };
    });
  }, [calculateCompletion]);

  // Remove skill
  const removeSkill = useCallback((skill: string) => {
    setState((prev) => {
      if (!prev.profile) return prev;

      const updatedProfile = {
        ...prev.profile,
        skills: prev.profile.skills.filter((s) => s !== skill),
        profileCompletion: calculateCompletion(),
        updatedAt: new Date(),
      };

      return {
        ...prev,
        profile: updatedProfile,
      };
    });
  }, [calculateCompletion]);

  // Accept suggested skill
  const acceptSuggestedSkill = useCallback((skill: string) => {
    setState((prev) => {
      if (!prev.profile) return prev;

      const updatedProfile = {
        ...prev.profile,
        skills: [...prev.profile.skills, skill],
        suggestedSkills: prev.profile.suggestedSkills.filter((s) => s !== skill),
        profileCompletion: calculateCompletion(),
        updatedAt: new Date(),
      };

      return {
        ...prev,
        profile: updatedProfile,
      };
    });
  }, [calculateCompletion]);

  // Dismiss suggested skill
  const dismissSuggestedSkill = useCallback((skill: string) => {
    setState((prev) => {
      if (!prev.profile) return prev;

      return {
        ...prev,
        profile: {
          ...prev.profile,
          suggestedSkills: prev.profile.suggestedSkills.filter((s) => s !== skill),
        },
      };
    });
  }, []);

  // Add social link
  const addSocialLink = useCallback((platform: SocialLink['platform'], url: string) => {
    setState((prev) => {
      if (!prev.profile) return prev;

      const newLink: SocialLink = {
        id: `link-${Date.now()}`,
        platform,
        url,
        verified: false,
      };

      const updatedProfile = {
        ...prev.profile,
        socialLinks: [...prev.profile.socialLinks, newLink],
        profileCompletion: calculateCompletion(),
        updatedAt: new Date(),
      };

      return {
        ...prev,
        profile: updatedProfile,
      };
    });
  }, [calculateCompletion]);

  // Remove social link
  const removeSocialLink = useCallback((id: string) => {
    setState((prev) => {
      if (!prev.profile) return prev;

      const updatedProfile = {
        ...prev.profile,
        socialLinks: prev.profile.socialLinks.filter((link) => link.id !== id),
        profileCompletion: calculateCompletion(),
        updatedAt: new Date(),
      };

      return {
        ...prev,
        profile: updatedProfile,
      };
    });
  }, [calculateCompletion]);

  // Validate field
  const validateField = useCallback((field: ProfileSection): boolean => {
    if (!state.profile) return false;

    switch (field) {
      case 'title':
        return state.profile.title.length > 0;
      case 'bio':
        return state.profile.bio.length >= 50;
      case 'location':
        return state.profile.location.length > 0;
      default:
        return true;
    }
  }, [state.profile]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to refresh profile',
      }));
    }
  }, []);

  const value: ProfileContextType = {
    state,
    updateAvatar,
    removeAvatar,
    updateField,
    saveField,
    cancelEdit,
    addSkill,
    removeSkill,
    acceptSuggestedSkill,
    dismissSuggestedSkill,
    addSocialLink,
    removeSocialLink,
    validateField,
    refreshProfile,
    calculateCompletion,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
