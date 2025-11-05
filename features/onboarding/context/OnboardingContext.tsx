'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { OnboardingContextType, OnboardingState, OnboardingStep } from '../types/onboarding.types';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: React.ReactNode;
  steps: OnboardingStep[];
  onComplete?: () => void;
}

export function OnboardingProvider({ children, steps, onComplete }: OnboardingProviderProps) {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    totalSteps: steps.length,
    isActive: true,
    isCompleted: false,
  });

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep < prev.totalSteps - 1) {
        return { ...prev, currentStep: prev.currentStep + 1 };
      } else {
        // Complete the tour
        onComplete?.();
        return { ...prev, isActive: false, isCompleted: true };
      }
    });
  }, [onComplete]);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const skipTour = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      isCompleted: false,
    }));
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, Math.min(stepIndex, prev.totalSteps - 1)),
    }));
  }, []);

  const completeTour = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isActive: false,
      isCompleted: true,
    }));
    onComplete?.();
  }, [onComplete]);

  const value: OnboardingContextType = {
    state,
    steps,
    nextStep,
    previousStep,
    skipTour,
    goToStep,
    completeTour,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
