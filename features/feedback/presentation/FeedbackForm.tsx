/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Feedback Form Component
 * Main feedback collection interface with multi-step flow
 */

"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { FeedbackFormProps, NPSRating } from "../types";
import { useFeedback } from "../context";
import { NPSRatingComponent } from "./components/NPSRating";
import { FeedbackComment } from "./components/FeedbackComment";
import { ThankYouAnimation } from "./components/ThankYouAnimation";
import { cn } from "@/lib/utils";

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  type,
  sessionId,
  courseId,
  mentorId,
  mentorName,
  courseName,
  onSubmit,
  onClose,
  className,
}) => {
  const { state, actions } = useFeedback();

  // Auto-submit when moving to thank-you step
  useEffect(() => {
    if (state.currentStep === "thank-you" && !state.isSubmitted) {
      handleSubmit();
    }
  }, [state.currentStep, state.isSubmitted]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    const feedbackData = {
      type,
      sessionId,
      courseId,
      mentorId,
      npsRating:
        typeof state.selectedRating === "number"
          ? state.selectedRating
          : undefined,
      emojiRating:
        typeof state.selectedRating === "string"
          ? state.selectedRating
          : undefined,
      comment: state.comment || undefined,
    };

    await actions.submitFeedback(feedbackData);
    onSubmit?.({
      ...feedbackData,
      id: `feedback_${Date.now()}`,
      userId: "current_user",
      submittedAt: new Date(),
      isAnonymous: false,
    } as any);
  };

  const getStepProgress = () => {
    switch (state.currentStep) {
      case "rating":
        return 33;
      case "comment":
        return 66;
      case "thank-you":
        return 100;
      default:
        return 0;
    }
  };

  const getStepTitle = () => {
    switch (state.currentStep) {
      case "rating":
        return "Rate Your Experience";
      case "comment":
        return "Share Your Thoughts";
      case "thank-you":
        return "Thank You!";
      default:
        return "";
    }
  };

  const getContextTitle = () => {
    switch (type) {
      case "session":
        return mentorName ? `Session with ${mentorName}` : "Mentoring Session";
      case "course":
        return courseName ? `${courseName} Course` : "Course Experience";
      case "mentor":
        return mentorName ? `Mentor: ${mentorName}` : "Mentor Feedback";
      case "platform":
        return "SkillFlow Platform";
      default:
        return "Experience Feedback";
    }
  };

  const canProceedToNext = () => {
    if (state.currentStep === "rating") {
      return state.selectedRating !== undefined;
    }
    return true;
  };

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case "rating":
        return (
          <NPSRatingComponent
            value={
              typeof state.selectedRating === "number"
                ? state.selectedRating
                : undefined
            }
            onChange={(rating: number) =>
              actions.setRating(rating as NPSRating)
            }
          />
        );

      case "comment":
        return (
          <FeedbackComment
            value={state.comment}
            onChange={actions.setComment}
          />
        );

      case "thank-you":
        return <ThankYouAnimation onComplete={() => onClose?.()} />;

      default:
        return null;
    }
  };

  if (state.currentStep === "thank-you") {
    return (
      <div
        className={cn(
          "min-h-screen bg-background flex items-center justify-center p-4",
          className
        )}
      >
        <div className="w-full max-w-2xl">{renderCurrentStep()}</div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background p-4", className)}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getStepTitle()}
              </h1>
              <p className="text-muted-foreground mt-1">{getContextTitle()}</p>
            </div>

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {state.currentStep === "rating" ? "1" : "2"} of 2
              </span>
              <span>{Math.round(getStepProgress())}% Complete</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </Card>

        {/* Main Content */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl p-8">
          {renderCurrentStep()}
        </Card>

        {/* Error Alert */}
        {state.error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        {(state.currentStep === "rating" ||
          state.currentStep === "comment") && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={
                state.currentStep === "comment"
                  ? actions.goToPreviousStep
                  : onClose
              }
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {state.currentStep === "comment" ? "Back" : "Cancel"}
            </Button>

            <Button
              onClick={
                state.currentStep === "rating"
                  ? actions.goToNextStep
                  : handleSubmit
              }
              disabled={!canProceedToNext() || state.isSubmitting}
              className="bg-primary hover:bg-primary/90 rounded-xl"
            >
              {state.isSubmitting ? (
                "Submitting..."
              ) : state.currentStep === "comment" ? (
                "Submit Feedback"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
