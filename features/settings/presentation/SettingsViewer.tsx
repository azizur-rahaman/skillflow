"use client";

import React, { useEffect } from "react";
import { SettingsProvider, useSettings } from "../context/SettingsContext";
import { SettingsContent } from "./SettingsContent";

// Mock data loader
function SettingsDataLoader({ children }: { children: React.ReactNode }) {
  const {
    setUserProfile,
    setSecuritySettings,
    setPrivacySettings,
    setSessionHistory,
    setSecurityEvents,
    setIsLoading,
  } = useSettings();

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);

      // Mock user profile
      setUserProfile({
        id: "1",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        bio: "Senior Software Engineer passionate about AI and blockchain technology.",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        company: "TechCorp",
        jobTitle: "Senior Software Engineer",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date(),
      });

      // Mock security settings
      setSecuritySettings({
        twoFactorEnabled: true,
        passwordLastChanged: new Date("2024-01-15"),
        loginAlertsEnabled: true,
        suspiciousActivityAlerts: true,
      });

      // Mock privacy settings
      setPrivacySettings({
        profileVisibility: "public",
        dataSharingEnabled: true,
        analyticsEnabled: true,
        marketingEmailsEnabled: false,
        skillDataVisibility: "verified",
        credentialVisibility: "public",
      });

      // Mock session history
      setSessionHistory([
        {
          id: "1",
          device: "MacBook Pro (Chrome)",
          browser: "Chrome 120.0",
          location: "San Francisco, CA",
          ipAddress: "192.168.1.1",
          lastActive: new Date(),
          isCurrentSession: true,
        },
        {
          id: "2",
          device: "iPhone 15 (Safari)",
          browser: "Safari Mobile",
          location: "San Francisco, CA",
          ipAddress: "192.168.1.2",
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          isCurrentSession: false,
        },
        {
          id: "3",
          device: "Windows PC (Edge)",
          browser: "Edge 120.0",
          location: "New York, NY",
          ipAddress: "10.0.0.1",
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isCurrentSession: false,
        },
      ]);

      // Mock security events
      setSecurityEvents([
        {
          id: "1",
          type: "login",
          description: "Successful login from new device",
          timestamp: new Date(),
          ipAddress: "192.168.1.1",
          location: "San Francisco, CA",
        },
        {
          id: "2",
          type: "2fa_enabled",
          description: "Two-factor authentication enabled",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          ipAddress: "192.168.1.1",
          location: "San Francisco, CA",
        },
        {
          id: "3",
          type: "password_change",
          description: "Password changed successfully",
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          ipAddress: "192.168.1.1",
          location: "San Francisco, CA",
        },
      ]);

      setIsLoading(false);
    };

    loadData();
  }, [
    setUserProfile,
    setSecuritySettings,
    setPrivacySettings,
    setSessionHistory,
    setSecurityEvents,
    setIsLoading,
  ]);

  return <>{children}</>;
}

export function SettingsViewer() {
  return (
    <SettingsProvider>
      <SettingsDataLoader>
        <SettingsContent />
      </SettingsDataLoader>
    </SettingsProvider>
  );
}
