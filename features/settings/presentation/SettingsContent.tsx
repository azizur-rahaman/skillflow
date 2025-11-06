"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useSettings } from "../context/SettingsContext";
import { AccountTab } from "./components/AccountTab";
import { SecurityTab } from "./components/SecurityTab";
import { PrivacyTab } from "./components/PrivacyTab";
import { SettingsTabs } from "./components/SettingsTabs";

export function SettingsContent() {
  const { activeTab } = useSettings();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "account":
        return <AccountTab />;
      case "security":
        return <SecurityTab />;
      case "privacy":
        return <PrivacyTab />;
      default:
        return <AccountTab />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, security, and privacy preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SettingsTabs />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-border rounded-2xl p-6 min-h-[600px]">
            {renderActiveTab()}
          </Card>
        </div>
      </div>
    </div>
  );
}
