"use client";

import React from "react";
import { useRBAC } from "../../context/RBACContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface SaveActionsProps {
  className?: string;
}

export function SaveActions({ className }: SaveActionsProps) {
  const {
    hasUnsavedChanges,
    isUpdating,
    saveChanges,
    discardChanges,
    resetToDefaults,
  } = useRBAC();

  const handleSave = async () => {
    await saveChanges();
  };

  const handleDiscard = () => {
    discardChanges();
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all permissions to their default values? This action cannot be undone."
      )
    ) {
      resetToDefaults();
    }
  };

  return (
    <Card className={cn("p-6 bg-card border-border rounded-2xl", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Actions</h3>
            <p className="text-sm text-muted-foreground">
              Save or discard your permission changes
            </p>
          </div>

          {hasUnsavedChanges && (
            <Badge
              variant="outline"
              className="text-yellow-600 border-yellow-600"
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}

          {!hasUnsavedChanges && (
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              All Saved
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isUpdating}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>

          <Button
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges || isUpdating}
            variant="outline"
            className="flex-1 border-border hover:bg-accent rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Discard Changes
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground mb-1">Danger Zone</h4>
              <p className="text-sm text-muted-foreground">
                Reset all permissions to system defaults
              </p>
            </div>
            <Button
              onClick={handleReset}
              variant="destructive"
              size="sm"
              className="rounded-xl"
              disabled={isUpdating}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>

        {hasUnsavedChanges && (
          <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <div className="font-medium text-yellow-800 dark:text-yellow-200">
                Unsaved Changes Detected
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                You have modified permissions that haven&apos;t been saved yet.
                Don&apos;t forget to save your changes before leaving this page.
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
