export type OnboardingStepId = 
  | 'welcome'
  | 'skill-dna'
  | 'forecast'
  | 'marketplace'
  | 'complete';

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  targetElement?: string; // CSS selector for spotlight
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  offset?: { x: number; y: number };
  illustration?: React.ReactNode;
  features?: string[];
}

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  isActive: boolean;
  isCompleted: boolean;
}

export interface OnboardingContextType {
  state: OnboardingState;
  steps: OnboardingStep[];
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  goToStep: (stepIndex: number) => void;
  completeTour: () => void;
}
