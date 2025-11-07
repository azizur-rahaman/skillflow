/**
 * Feedback Comment Component
 * Optional comment input for detailed feedback
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackCommentProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const FeedbackComment: React.FC<FeedbackCommentProps> = ({
  value,
  onChange,
  placeholder = "Share your thoughts, suggestions, or any specific feedback...",
  className,
}) => {
  const maxLength = 500;
  const remainingChars = maxLength - value.length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">
            Additional Comments
          </h3>
        </div>
        <p className="text-muted-foreground">
          Help us understand your experience better (optional)
        </p>
      </div>

      {/* Comment Input */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl">
        <div className="space-y-4">
          <Label
            htmlFor="feedback-comment"
            className="text-sm font-medium text-foreground"
          >
            Your feedback
          </Label>

          <Textarea
            id="feedback-comment"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-32 bg-background/50 border-border/50 rounded-xl resize-none focus:ring-primary"
            maxLength={maxLength}
          />

          {/* Character Counter */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {value.length > 0
                ? `${value.length} characters`
                : "Optional field"}
            </span>

            <Badge
              variant={remainingChars < 50 ? "destructive" : "secondary"}
              className="text-xs"
            >
              {remainingChars} remaining
            </Badge>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          What worked well? What could be improved? Any specific suggestions?
        </p>
      </div>
    </div>
  );
};
