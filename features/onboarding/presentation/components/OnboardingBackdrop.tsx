'use client';

import { useOnboarding } from '../../context/OnboardingContext';

export default function OnboardingBackdrop() {
  const { state } = useOnboarding();

  if (!state.isActive) return null;

  return (
    <div 
      className="
        fixed inset-0 z-40
        bg-[#0F172A]/90
        backdrop-blur-sm
        transition-opacity duration-500
        animate-fade-in
      "
      aria-hidden="true"
    />
  );
}
