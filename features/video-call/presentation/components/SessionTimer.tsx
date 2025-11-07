/**
 * Session Timer Component
 * Displays the current session duration
 */

"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionTimerProps {
  startTime: Date | null;
  duration: number; // seconds
  className?: string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  startTime,
  duration,
  className,
}) => {
  const [currentDuration, setCurrentDuration] = useState(duration);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setCurrentDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    const hours = Math.floor(currentDuration / 3600);
    if (hours >= 2) return "text-red-500 bg-red-500/20 border-red-500/30";
    if (hours >= 1)
      return "text-yellow-500 bg-yellow-500/20 border-yellow-500/30";
    return "text-green-500 bg-green-500/20 border-green-500/30";
  };

  if (!startTime) {
    return null;
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 text-xs font-medium",
        getTimerColor(),
        className
      )}
    >
      <Clock className="w-3 h-3" />
      {formatDuration(currentDuration)}
    </Badge>
  );
};
