"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  UserProfile,
  SecuritySettings,
  PrivacySettings,
  SessionHistory,
  SecurityEvent,
  UpdateProfileData,
  UpdatePasswordData,
  DeleteAccountData,
} from "../types";

interface SettingsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  securitySettings: SecuritySettings | null;
  setSecuritySettings: (settings: SecuritySettings | null) => void;
  privacySettings: PrivacySettings | null;
  setPrivacySettings: (settings: PrivacySettings | null) => void;
  sessionHistory: SessionHistory[];
  setSessionHistory: (sessions: SessionHistory[]) => void;
  securityEvents: SecurityEvent[];
  setSecurityEvents: (events: SecurityEvent[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isUpdating: boolean;
  setIsUpdating: (updating: boolean) => void;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  updateSecuritySettings: (data: UpdatePasswordData) => Promise<void>;
  updatePrivacySettings: (data: Partial<PrivacySettings>) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  deleteAccount: (data: DeleteAccountData) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("account");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] =
    useState<SecuritySettings | null>(null);
  const [privacySettings, setPrivacySettings] =
    useState<PrivacySettings | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Mock API functions - replace with actual API calls
  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    setIsUpdating(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Updating profile:", data);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const updateSecuritySettings = useCallback(
    async (data: UpdatePasswordData) => {
      setIsUpdating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Updating security settings:", data);
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const updatePrivacySettings = useCallback(
    async (data: Partial<PrivacySettings>) => {
      setIsUpdating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Updating privacy settings:", data);
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const revokeSession = useCallback(async (sessionId: string) => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Revoking session:", sessionId);
      setSessionHistory((prev) => prev.filter((s) => s.id !== sessionId));
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteAccount = useCallback(async (data: DeleteAccountData) => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Deleting account:", data);
      // This would typically redirect to a goodbye page
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const value: SettingsContextValue = {
    activeTab,
    setActiveTab,
    userProfile,
    setUserProfile,
    securitySettings,
    setSecuritySettings,
    privacySettings,
    setPrivacySettings,
    sessionHistory,
    setSessionHistory,
    securityEvents,
    setSecurityEvents,
    isLoading,
    setIsLoading,
    isUpdating,
    setIsUpdating,
    updateProfile,
    updateSecuritySettings,
    updatePrivacySettings,
    revokeSession,
    deleteAccount,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
