/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Shield,
  Key,
  Smartphone,
  AlertTriangle,
  Eye,
  EyeOff,
  Monitor,
  MapPin,
  Clock,
  LogOut,
  Loader2,
  CheckCircle,
} from "lucide-react";

export function SecurityTab() {
  const {
    securitySettings,
    sessionHistory,
    securityEvents,
    updateSecuritySettings,
    revokeSession,
    isUpdating,
  } = useSettings();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSecurityToggle = async (field: string, value: boolean) => {
    if (securitySettings) {
      // Cast to any because updateSecuritySettings expects a different shape (e.g. UpdatePasswordData)
      // but here we need to send a settings object; casting avoids the type error.
      await updateSecuritySettings({
        ...securitySettings,
        [field]: value,
      } as any);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSecuritySettings(passwordData);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
  };

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSession(sessionId);
  };

  if (!securitySettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add an extra layer of security to your account by requiring a
                second form of authentication.
              </p>
            </div>
          </div>

          <Switch
            checked={securitySettings.twoFactorEnabled}
            onCheckedChange={(checked) =>
              handleSecurityToggle("twoFactorEnabled", checked)
            }
            disabled={isUpdating}
          />
        </div>

        {securitySettings.twoFactorEnabled && (
          <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-xl">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">2FA is enabled</span>
            </div>
          </div>
        )}
      </Card>

      {/* Password Management */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">Password</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Last changed{" "}
                {securitySettings.passwordLastChanged.toLocaleDateString()}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="rounded-xl border-border hover:bg-muted"
          >
            {showPasswordForm ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showPasswordForm ? "Cancel" : "Change Password"}
          </Button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-medium text-foreground"
              >
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="rounded-xl bg-input border-border"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-foreground"
                >
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="rounded-xl bg-input border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="rounded-xl bg-input border-border"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordForm(false)}
                className="rounded-xl border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="rounded-xl bg-primary text-primary-foreground"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Security Alerts */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Security Alerts
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Login Alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  Get notified of new logins to your account
                </p>
              </div>
            </div>
            <Switch
              checked={securitySettings.loginAlertsEnabled}
              onCheckedChange={(checked) =>
                handleSecurityToggle("loginAlertsEnabled", checked)
              }
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Suspicious Activity Alerts
                </p>
                <p className="text-xs text-muted-foreground">
                  Alert for unusual account activity
                </p>
              </div>
            </div>
            <Switch
              checked={securitySettings.suspiciousActivityAlerts}
              onCheckedChange={(checked) =>
                handleSecurityToggle("suspiciousActivityAlerts", checked)
              }
              disabled={isUpdating}
            />
          </div>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Active Sessions
        </h3>

        <div className="space-y-3">
          {sessionHistory.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50"
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {session.device}
                    {session.isCurrentSession && (
                      <Badge
                        variant="secondary"
                        className="ml-2 text-xs bg-primary/10 text-primary"
                      >
                        Current
                      </Badge>
                    )}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.lastActive.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrentSession && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                  disabled={isUpdating}
                  className="rounded-lg border-border hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Security Event Log */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <h3 className="text-lg font-medium text-foreground mb-4">
          Recent Security Events
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {securityEvents.slice(0, 10).map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/30"
            >
              <div
                className={cn(
                  "p-1.5 rounded-full",
                  event.type === "login" && "bg-success/10 text-success",
                  event.type === "password_change" &&
                    "bg-warning/10 text-warning",
                  event.type === "2fa_enabled" && "bg-primary/10 text-primary",
                  event.type === "suspicious_activity" &&
                    "bg-destructive/10 text-destructive"
                )}
              >
                {event.type === "login" && <CheckCircle className="w-3 h-3" />}
                {event.type === "password_change" && (
                  <Key className="w-3 h-3" />
                )}
                {event.type === "2fa_enabled" && <Shield className="w-3 h-3" />}
                {event.type === "suspicious_activity" && (
                  <AlertTriangle className="w-3 h-3" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span>{event.timestamp.toLocaleString()}</span>
                  <span>{event.location}</span>
                  <span>{event.ipAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
