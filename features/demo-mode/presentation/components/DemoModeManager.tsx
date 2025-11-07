/**
 * Demo Mode Manager Component
 * Main component for managing demo mode in presentations
 */

"use client";

import React, { useEffect } from "react";
import { useDemoMode } from "../../context";
import { DemoModeBanner } from "./DemoModeBanner";
import { DemoModeToggle } from "./DemoModeToggle";
import { cn } from "@/lib/utils";
import { Settings, Monitor } from "lucide-react";

interface DemoModeManagerProps {
  children: React.ReactNode;
  className?: string;
  showToggle?: boolean;
  defaultEnabled?: boolean;
}

export const DemoModeManager: React.FC<DemoModeManagerProps> = ({
  children,
  className,
  showToggle = true,
  defaultEnabled = false,
}) => {
  const { state, actions } = useDemoMode();

  // Set default state on mount
  useEffect(() => {
    if (defaultEnabled && !state.isEnabled) {
      actions.enableDemoMode();
    }
  }, [defaultEnabled, state.isEnabled, actions]);

  return (
    <div className={cn("relative min-h-screen", className)}>
      {/* Demo Mode Banner */}
      {state.sampleDataBanner.show && (
        <DemoModeBanner
          message={state.sampleDataBanner.message}
          type={state.sampleDataBanner.type}
          onClose={actions.hideBanner}
        />
      )}

      {/* Demo Mode Toggle (for presenters) */}
      {showToggle && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Monitor className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Presentation Mode
                </h3>
                <p className="text-xs text-muted-foreground">
                  Safe demo environment
                </p>
              </div>
            </div>

            <DemoModeToggle
              isEnabled={state.isEnabled}
              onToggle={actions.toggleDemoMode}
            />

            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Settings className="w-3 h-3" />
                <span>
                  Restricted actions: {state.restrictedActions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          state.isEnabled && "opacity-95"
        )}
      >
        {children}
      </div>

      {/* Demo Mode Overlay Effect */}
      {state.isEnabled && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-cyan-400">
                Demo Mode Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
