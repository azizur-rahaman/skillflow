/**
 * Mentor Booking Context
 * State management for mentor booking flow
 */

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  MentorBookingState,
  MentorBookingContextType,
  SessionType,
  TimeSlot,
} from "../types";

// Initial state
const initialState: MentorBookingState = {
  selectedDate: null,
  selectedTimeSlot: null,
  sessionType: "1-on-1",
  duration: 60, // 1 hour default
  notes: "",
  isLoading: false,
  error: null,
};

// Action types
type MentorBookingAction =
  | { type: "SELECT_DATE"; payload: Date }
  | { type: "SELECT_TIME_SLOT"; payload: TimeSlot | null }
  | { type: "SET_SESSION_TYPE"; payload: SessionType }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_NOTES"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_BOOKING" };

// Reducer
const mentorBookingReducer = (
  state: MentorBookingState,
  action: MentorBookingAction
): MentorBookingState => {
  switch (action.type) {
    case "SELECT_DATE":
      return {
        ...state,
        selectedDate: action.payload,
        selectedTimeSlot: null, // Reset time slot when date changes
      };

    case "SELECT_TIME_SLOT":
      return { ...state, selectedTimeSlot: action.payload };

    case "SET_SESSION_TYPE":
      return { ...state, sessionType: action.payload };

    case "SET_DURATION":
      return { ...state, duration: action.payload };

    case "SET_NOTES":
      return { ...state, notes: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "RESET_BOOKING":
      return initialState;

    default:
      return state;
  }
};

// Context
const MentorBookingContext = createContext<
  MentorBookingContextType | undefined
>(undefined);

// Provider component
interface MentorBookingProviderProps {
  children: ReactNode;
}

export const MentorBookingProvider: React.FC<MentorBookingProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(mentorBookingReducer, initialState);

  // Actions
  const actions = {
    selectDate: (date: Date) => {
      dispatch({ type: "SELECT_DATE", payload: date });
    },

    selectTimeSlot: (timeSlot: TimeSlot | null) => {
      dispatch({ type: "SELECT_TIME_SLOT", payload: timeSlot });
    },

    setSessionType: (type: SessionType) => {
      dispatch({ type: "SET_SESSION_TYPE", payload: type });
    },

    setDuration: (duration: number) => {
      dispatch({ type: "SET_DURATION", payload: duration });
    },

    setNotes: (notes: string) => {
      dispatch({ type: "SET_NOTES", payload: notes });
    },

    resetBooking: () => {
      dispatch({ type: "RESET_BOOKING" });
    },

    confirmBooking: async () => {
      if (!state.selectedDate || !state.selectedTimeSlot) {
        dispatch({
          type: "SET_ERROR",
          payload: "Please select a date and time slot",
        });
        return;
      }

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // In real app, make API call to create booking
        console.log("Booking confirmed:", {
          date: state.selectedDate,
          timeSlot: state.selectedTimeSlot,
          sessionType: state.sessionType,
          duration: state.duration,
          notes: state.notes,
        });

        // Reset booking state after successful booking
        dispatch({ type: "RESET_BOOKING" });
      } catch {
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to confirm booking. Please try again.",
        });
      }
    },
  };

  const contextValue: MentorBookingContextType = {
    state,
    actions,
  };

  return (
    <MentorBookingContext.Provider value={contextValue}>
      {children}
    </MentorBookingContext.Provider>
  );
};

// Hook
export const useMentorBooking = (): MentorBookingContextType => {
  const context = useContext(MentorBookingContext);
  if (!context) {
    throw new Error(
      "useMentorBooking must be used within a MentorBookingProvider"
    );
  }
  return context;
};
