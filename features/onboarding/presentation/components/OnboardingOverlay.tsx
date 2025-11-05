'use client';

import { useOnboarding } from '../../context/OnboardingContext';
import OnboardingBackdrop from './OnboardingBackdrop';
import OnboardingTooltip from './OnboardingTooltip';

interface OnboardingOverlayProps {
  children?: React.ReactNode;
}

export default function OnboardingOverlay({ children }: OnboardingOverlayProps) {
  const { state } = useOnboarding();

  return (
    <>
      {children}
      {state.isActive && (
        <>
          <OnboardingBackdrop />
          <OnboardingTooltip />
        </>
      )}
    </>
  );
}
