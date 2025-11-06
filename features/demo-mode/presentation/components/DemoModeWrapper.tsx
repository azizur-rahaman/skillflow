/**
 * Demo Mode Higher-Order Component
 * Wraps components to add demo mode behavior and restrictions
 */

"use client";

import { useDemoMode } from "../../context";
import { WithDemoModeProps } from "../../types";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

interface DemoModeWrapperProps {
  children: React.ReactNode;
  showDemoIndicator?: boolean;
  className?: string;
}

export const DemoModeWrapper: React.FC<DemoModeWrapperProps> = ({
  children,
  showDemoIndicator = true,
  className,
}) => {
  const { state } = useDemoMode();

  // If demo mode is not enabled, render children normally
  if (!state.isEnabled) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {children}

      {/* Demo Mode Indicator */}
      {showDemoIndicator && state.isEnabled && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <Eye className="w-3 h-3 text-cyan-400" />
            <span className="text-xs font-medium text-cyan-400">Demo</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for components that need demo mode awareness
export const useDemoAware = () => {
  const { state, actions } = useDemoMode();

  const isActionAllowed = (action: string) => {
    return !state.isEnabled || !actions.isActionRestricted(action);
  };

  const getDemoProps = (): WithDemoModeProps => ({
    demoMode: {
      isEnabled: state.isEnabled,
      isActionRestricted: (actionName: string) =>
        actions.isActionRestricted(actionName),
    },
  });

  return {
    isDemoMode: state.isEnabled,
    isActionAllowed,
    getDemoProps,
    demoMessage: "This action is disabled in demo mode",
  };
};
