/**
 * Demo Mode Toggle Component
 * Sleek toggle switch for enabling/disabling demo mode
 */

"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DemoModeToggleProps } from "../../types";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export const DemoModeToggle: React.FC<DemoModeToggleProps> = ({
  isEnabled,
  onToggle,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "bg-card/50 backdrop-blur-sm border border-border/50",
        "hover:border-cyan-500/30 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {isEnabled ? (
          <Eye className="w-4 h-4 text-cyan-400" />
        ) : (
          <EyeOff className="w-4 h-4 text-muted-foreground" />
        )}
        <Label
          htmlFor="demo-mode-toggle"
          className="text-sm font-medium cursor-pointer select-none"
        >
          Demo Mode
        </Label>
      </div>

      <Switch
        id="demo-mode-toggle"
        checked={isEnabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-cyan-500"
      />

      <div className="text-xs text-muted-foreground">
        {isEnabled ? "On" : "Off"}
      </div>
    </div>
  );
};
