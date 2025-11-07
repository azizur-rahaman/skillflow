/**
 * Emoji Rating Component
 * Visual emoji-based rating system
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmojiRating } from "../../types";
import { cn } from "@/lib/utils";

interface EmojiRatingProps {
  value?: EmojiRating;
  onChange: (value: EmojiRating) => void;
  className?: string;
}

const emojiOptions: {
  value: EmojiRating;
  emoji: string;
  label: string;
  color: string;
}[] = [
  {
    value: "very-dissatisfied",
    emoji: "😞",
    label: "Very Dissatisfied",
    color: "hover:bg-red-500/20 hover:border-red-500/50",
  },
  {
    value: "dissatisfied",
    emoji: "😕",
    label: "Dissatisfied",
    color: "hover:bg-orange-500/20 hover:border-orange-500/50",
  },
  {
    value: "neutral",
    emoji: "😐",
    label: "Neutral",
    color: "hover:bg-yellow-500/20 hover:border-yellow-500/50",
  },
  {
    value: "satisfied",
    emoji: "😊",
    label: "Satisfied",
    color: "hover:bg-lime-500/20 hover:border-lime-500/50",
  },
  {
    value: "very-satisfied",
    emoji: "😍",
    label: "Very Satisfied",
    color: "hover:bg-green-500/20 hover:border-green-500/50",
  },
];

export const EmojiRatingComponent: React.FC<EmojiRatingProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Question */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          How was your experience?
        </h3>
        <p className="text-muted-foreground">
          Select the emoji that best describes how you feel about this
          experience.
        </p>
      </div>

      {/* Emoji Options */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl">
        <div className="grid grid-cols-5 gap-4">
          {emojiOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              onClick={() => onChange(option.value)}
              className={cn(
                "h-16 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all duration-200",
                value === option.value
                  ? "bg-primary/20 border-primary text-primary shadow-lg scale-105"
                  : "border-border/50 text-muted-foreground hover:scale-105",
                option.color
              )}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-xs font-medium">{option.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* Selected Feedback */}
      {value && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You selected:{" "}
            <span className="font-medium text-foreground">
              {emojiOptions.find((opt) => opt.value === value)?.label}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
