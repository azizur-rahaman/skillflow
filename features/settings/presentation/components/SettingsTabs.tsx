"use client";

import React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Shield, Lock, ChevronRight } from "lucide-react";
import { SettingsTab } from "../../types";
import { useSettings } from "../../context/SettingsContext";

const settingsTabs: SettingsTab[] = [
  {
    id: "account",
    label: "Account Info",
    icon: "User",
    description: "Manage your personal information and profile",
  },
  {
    id: "security",
    label: "Security",
    icon: "Shield",
    description: "Control your account security and sessions",
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: "Lock",
    description: "Manage your data visibility and privacy settings",
  },
];

const iconMap: Record<string, React.ElementType> = {
  User,
  Shield,
  Lock,
};

export function SettingsTabs() {
  const { activeTab, setActiveTab } = useSettings();

  return (
    <div className="space-y-2">
      {settingsTabs.map((tab) => {
        const Icon = iconMap[tab.icon];
        const isActive = activeTab === tab.id;

        return (
          <Card
            key={tab.id}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200",
              "hover:border-primary/50 hover:bg-muted/30",
              isActive
                ? "bg-primary/5 border-primary/50 ring-1 ring-primary/20"
                : "bg-card border-border"
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    "font-medium transition-colors",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {tab.label}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tab.description}
                </p>
              </div>

              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-all duration-200",
                  isActive
                    ? "text-primary translate-x-1"
                    : "text-muted-foreground"
                )}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
