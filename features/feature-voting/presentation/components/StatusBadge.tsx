/**
 * Status Badge Component
 * Visual status indicator for feature requests
 */

"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { StatusBadgeProps } from "../../types";
import { cn } from "@/lib/utils";

const getStatusConfig = (status: StatusBadgeProps["status"]) => {
  switch (status) {
    case "open":
      return {
        label: "Open",
        className:
          "bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30",
      };
    case "under-review":
      return {
        label: "Under Review",
        className:
          "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30",
      };
    case "planned":
      return {
        label: "Planned",
        className:
          "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30",
      };
    case "in-progress":
      return {
        label: "In Progress",
        className:
          "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30",
      };
    case "completed":
      return {
        label: "Completed",
        className:
          "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30",
      };
    case "declined":
      return {
        label: "Declined",
        className:
          "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30",
      };
    default:
      return {
        label: "Unknown",
        className: "bg-muted/20 text-muted-foreground border-muted/30",
      };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const config = getStatusConfig(status);

  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-xs font-medium border rounded-full px-2 py-1",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
};
