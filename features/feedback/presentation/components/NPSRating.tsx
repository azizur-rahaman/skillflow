/**
 * NPS Rating Component
 * Net Promoter Score slider with visual feedback
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { NPSRating } from "../../types";
import { cn } from "@/lib/utils";

interface NPSRatingProps {
  value?: NPSRating;
  onChange: (value: NPSRating) => void;
  className?: string;
}

const getRatingLabel = (rating: NPSRating): string => {
  if (rating <= 6) return "Not Likely";
  if (rating <= 8) return "Neutral";
  return "Very Likely";
};

const getRatingColor = (rating: NPSRating): string => {
  if (rating <= 6) return "text-red-400 bg-red-500/20 border-red-500/30";
  if (rating <= 8)
    return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
  return "text-green-400 bg-green-500/20 border-green-500/30";
};

const getRatingEmoji = (rating: NPSRating): string => {
  if (rating <= 6) return "😞";
  if (rating <= 8) return "😐";
  return "😊";
};

export const NPSRatingComponent: React.FC<NPSRatingProps> = ({
  value,
  onChange,
  className,
}) => {
  const handleValueChange = (values: number[]) => {
    onChange(values[0] as NPSRating);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Question */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          How likely are you to recommend this?
        </h3>
        <p className="text-muted-foreground">
          On a scale of 0-10, how likely are you to recommend this experience to
          others?
        </p>
      </div>

      {/* Rating Display */}
      {value !== undefined && (
        <div className="flex justify-center">
          <Badge
            variant="secondary"
            className={cn(
              "px-4 py-2 text-lg font-medium rounded-full",
              getRatingColor(value)
            )}
          >
            <span className="mr-2">{getRatingEmoji(value)}</span>
            {value} - {getRatingLabel(value)}
          </Badge>
        </div>
      )}

      {/* Slider */}
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl">
        <div className="space-y-6">
          {/* Scale Labels */}
          <div className="flex justify-between text-sm text-muted-foreground px-2">
            <span>Not at all likely</span>
            <span>Extremely likely</span>
          </div>

          {/* Slider */}
          <div className="px-4">
            <Slider
              value={value !== undefined ? [value] : [5]}
              onValueChange={handleValueChange}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Number Scale */}
          <div className="flex justify-between text-xs text-muted-foreground px-2">
            {Array.from({ length: 11 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "transition-colors",
                  value === i && "text-primary font-medium"
                )}
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Additional Context */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Your feedback helps us improve the learning experience for everyone.
        </p>
      </div>
    </div>
  );
};
