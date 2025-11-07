import * as React from "react";

import { cn } from "@/lib/utils";

interface TooltipProviderProps {
  children: React.ReactNode;
}

const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => {
  return <>{children}</>;
};

interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return <>{children}</>;
};

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

const TooltipContent: React.FC<TooltipContentProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
