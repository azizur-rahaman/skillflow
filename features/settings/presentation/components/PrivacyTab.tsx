"use client";

import React from "react";
import { useSettings } from "../../context/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Lock,
  Eye,
  BarChart3,
  Mail,
  Users,
  Award,
  Loader2,
} from "lucide-react";

export function PrivacyTab() {
  const { privacySettings, updatePrivacySettings, isUpdating } = useSettings();

  const handlePrivacyToggle = async (field: string, value: boolean) => {
    if (privacySettings) {
      await updatePrivacySettings({
        ...privacySettings,
        [field]: value,
      });
    }
  };

  const handleVisibilityChange = async (field: string, value: string) => {
    if (privacySettings) {
      await updatePrivacySettings({
        ...privacySettings,
        [field]: value,
      });
    }
  };

  if (!privacySettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Eye className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-foreground">
              Profile Visibility
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Control who can see your profile information and activity.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Profile Visibility
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Who can view your profile
                  </p>
                </div>
                <Select
                  value={privacySettings.profileVisibility}
                  onValueChange={(value) =>
                    handleVisibilityChange("profileVisibility", value)
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-32 rounded-xl bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="connections">Connections</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Sharing */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-foreground">
              Data Sharing
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose how your data is used to improve your experience and help
              others.
            </p>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      Analytics
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Help improve SkillFlow with usage data
                    </p>
                  </div>
                </div>
                <Switch
                  checked={privacySettings.analyticsEnabled}
                  onCheckedChange={(checked) =>
                    handlePrivacyToggle("analyticsEnabled", checked)
                  }
                  disabled={isUpdating}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      Marketing Emails
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Receive updates about new features
                    </p>
                  </div>
                </div>
                <Switch
                  checked={privacySettings.marketingEmailsEnabled}
                  onCheckedChange={(checked) =>
                    handlePrivacyToggle("marketingEmailsEnabled", checked)
                  }
                  disabled={isUpdating}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Skill Data Visibility */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-foreground">
              Skill Data Visibility
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Control how your skills and learning progress are displayed to
              others.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Skill Profile
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Who can see your skill assessments
                  </p>
                </div>
                <Select
                  value={privacySettings.skillDataVisibility}
                  onValueChange={(value) =>
                    handleVisibilityChange("skillDataVisibility", value)
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-32 rounded-xl bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Credentials
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Who can view your blockchain credentials
                  </p>
                </div>
                <Select
                  value={privacySettings.credentialVisibility}
                  onValueChange={(value) =>
                    handleVisibilityChange("credentialVisibility", value)
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-32 rounded-xl bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="connections">Connections</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Export */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-foreground">
              Data Management
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Download your data or manage your account.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="rounded-xl border-border hover:bg-muted"
              >
                Export Data
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-border hover:bg-muted"
              >
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 bg-destructive/5 border-destructive/20 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-destructive/10 rounded-xl">
            <Lock className="w-6 h-6 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-destructive">
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Irreversible actions that will affect your account permanently.
            </p>

            <div className="mt-4">
              <Button
                variant="destructive"
                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  // This would typically open a confirmation dialog
                  console.log("Delete account clicked");
                }}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
