/**
 * Thank You Animation Component
 * Celebration animation after feedback submission
 */

"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThankYouAnimationProps {
  onComplete?: () => void;
  className?: string;
}

export const ThankYouAnimation: React.FC<ThankYouAnimationProps> = ({
  onComplete,
  className,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Start animation sequence
    const timer1 = setTimeout(() => setShowConfetti(true), 200);
    const timer2 = setTimeout(() => setShowMessage(true), 600);
    const timer3 = setTimeout(() => onComplete?.(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={cn("flex items-center justify-center min-h-96", className)}>
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl text-center max-w-md w-full">
        <div className="space-y-6">
          {/* Success Icon with Animation */}
          <div className="relative">
            <div
              className={cn(
                "w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center transition-all duration-500",
                showConfetti && "bg-green-500/30 scale-110"
              )}
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            {/* Floating Icons Animation */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles
                  className="absolute top-2 left-4 w-4 h-4 text-yellow-400 animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <Heart
                  className="absolute top-6 right-6 w-3 h-3 text-pink-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <Sparkles
                  className="absolute bottom-4 left-6 w-3 h-3 text-cyan-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
                <Heart
                  className="absolute bottom-2 right-4 w-4 h-4 text-purple-400 animate-bounce"
                  style={{ animationDelay: "0.6s" }}
                />
              </div>
            )}
          </div>

          {/* Message with Fade In */}
          <div
            className={cn(
              "space-y-4 transition-all duration-500",
              showMessage
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Thank You! 🎉
              </h2>
              <p className="text-muted-foreground">
                Your feedback helps us create better learning experiences for
                everyone.
              </p>
            </div>

            {/* Impact Message */}
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <p className="text-sm text-primary font-medium">
                &ldquo;Every piece of feedback shapes the future of
                learning&rdquo;
              </p>
            </div>
          </div>

          {/* Close Button */}
          {showMessage && (
            <div className="pt-4">
              <Button
                onClick={onComplete}
                className="w-full bg-primary hover:bg-primary/90 rounded-xl"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
