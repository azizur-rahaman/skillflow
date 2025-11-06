/**
 * Vote Button Component
 * Interactive upvote/downvote button with animated counters
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { VoteButtonProps } from "../../types";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

export const VoteButton: React.FC<VoteButtonProps> = ({
  featureId,
  votes,
  isVoted,
  voteType,
  onVote,
  disabled = false,
  className,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = async () => {
    if (disabled) return;

    setIsAnimating(true);
    await onVote(featureId, voteType);

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  const Icon = voteType === "upvote" ? ChevronUp : ChevronDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleVote}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center gap-1 h-auto p-2 rounded-lg transition-all duration-200",
        "hover:bg-primary/10 hover:scale-105 active:scale-95",
        isVoted && "bg-primary/20 text-primary",
        isAnimating && "animate-pulse",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Icon
        className={cn(
          "w-4 h-4 transition-transform duration-200",
          isVoted && "scale-110",
          isAnimating && "animate-bounce"
        )}
      />
      <span
        className={cn(
          "text-xs font-medium transition-all duration-200",
          isVoted && "text-primary font-semibold",
          isAnimating && "scale-110"
        )}
      >
        {votes}
      </span>
    </Button>
  );
};
