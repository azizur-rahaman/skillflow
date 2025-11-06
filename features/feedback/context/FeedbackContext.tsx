/**
 * Feedback Context
 * State management for feedback collection flow
 */

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  FeedbackState,
  FeedbackContextType,
  FeedbackSubmission,
  NPSRating,
  EmojiRating,
} from "../types";

// Initial state
const initialState: FeedbackState = {
  currentStep: "rating",
  comment: "",
  isSubmitting: false,
  isSubmitted: false,
};

// Action types
type FeedbackAction =
  | { type: "SET_RATING"; payload: NPSRating | EmojiRating }
  | { type: "SET_COMMENT"; payload: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_SUBMITTED"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | undefined }
  | { type: "SET_STEP"; payload: FeedbackState["currentStep"] }
  | { type: "RESET" };

// Reducer
function feedbackReducer(
  state: FeedbackState,
  action: FeedbackAction
): FeedbackState {
  switch (action.type) {
    case "SET_RATING":
      return { ...state, selectedRating: action.payload };
    case "SET_COMMENT":
      return { ...state, comment: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_SUBMITTED":
      return { ...state, isSubmitted: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// Context
const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined
);

// Provider props
interface FeedbackProviderProps {
  children: ReactNode;
}

// Provider component
export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(feedbackReducer, initialState);

  const actions: FeedbackContextType["actions"] = {
    setRating: (rating) => {
      dispatch({ type: "SET_RATING", payload: rating });
    },

    setComment: (comment) => {
      dispatch({ type: "SET_COMMENT", payload: comment });
    },

    submitFeedback: async (feedbackData) => {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      dispatch({ type: "SET_ERROR", payload: undefined });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Create feedback submission
        const submission: FeedbackSubmission = {
          id: `feedback_${Date.now()}`,
          userId: "current_user", // This would come from auth context
          type: feedbackData.type || "platform",
          submittedAt: new Date(),
          isAnonymous: false,
          ...feedbackData,
        };

        // Here you would typically send to your API
        console.log("Feedback submitted:", submission);

        dispatch({ type: "SET_SUBMITTED", payload: true });
        dispatch({ type: "SET_SUBMITTING", payload: false });
        dispatch({ type: "SET_STEP", payload: "thank-you" });
      } catch (error) {
        console.error("Feedback submission error:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to submit feedback. Please try again.",
        });
        dispatch({ type: "SET_SUBMITTING", payload: false });
      }
    },

    reset: () => {
      dispatch({ type: "RESET" });
    },

    goToNextStep: () => {
      if (state.currentStep === "rating") {
        dispatch({ type: "SET_STEP", payload: "comment" });
      } else if (state.currentStep === "comment") {
        dispatch({ type: "SET_STEP", payload: "thank-you" });
      }
    },

    goToPreviousStep: () => {
      if (state.currentStep === "comment") {
        dispatch({ type: "SET_STEP", payload: "rating" });
      } else if (state.currentStep === "thank-you") {
        dispatch({ type: "SET_STEP", payload: "comment" });
      }
    },
  };

  const value: FeedbackContextType = {
    state,
    actions,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Hook
export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
