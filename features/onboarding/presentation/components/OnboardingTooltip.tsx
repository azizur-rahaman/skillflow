'use client';

import { useOnboarding } from '../../context/OnboardingContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OnboardingTooltip() {
  const { state, steps, nextStep, previousStep, skipTour } = useOnboarding();

  if (!state.isActive) return null;

  const currentStepData = steps[state.currentStep];
  const isFirstStep = state.currentStep === 0;
  const isLastStep = state.currentStep === state.totalSteps - 1;

  return (
    <div
      className="
        fixed z-50
        bg-gradient-to-br from-[#1E293B] to-[#0F172A]
        border border-white/20
        rounded-2xl
        p-6
        shadow-2xl shadow-[#4F46E5]/30
        max-w-md
        animate-slide-up
      "
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Close Button */}
      <button
        onClick={skipTour}
        className="
          absolute top-4 right-4
          text-white/40 hover:text-white/80
          transition-colors
        "
        aria-label="Skip tour"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Step Counter */}
      <div className="flex items-center gap-2 mb-4">
        {steps.map((_: any, index: number) => (
          <div
            key={index}
            className={`
              h-1 flex-1 rounded-full transition-all duration-300
              ${index === state.currentStep 
                ? 'bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]' 
                : index < state.currentStep 
                  ? 'bg-[#22D3EE]/50' 
                  : 'bg-white/10'
              }
            `}
          />
        ))}
      </div>

      {/* Icon */}
      {currentStepData.illustration && (
        <div className="mb-4 flex justify-center">
          {currentStepData.illustration}
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-2">
        {currentStepData.title}
      </h3>

      {/* Description */}
      <p className="text-white/70 text-sm leading-relaxed mb-4">
        {currentStepData.description}
      </p>

      {/* Feature List */}
      {currentStepData.features && currentStepData.features.length > 0 && (
        <ul className="space-y-2 mb-6">
          {currentStepData.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start text-sm text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mt-1.5 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Step Counter Text */}
      <div className="text-xs text-white/40 mb-4 text-center">
        Step {state.currentStep + 1} of {state.totalSteps}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">
        {!isFirstStep && (
          <button
            onClick={previousStep}
            className="
              flex items-center gap-2
              px-4 py-2
              bg-white/5 border border-white/20
              text-white/80
              rounded-xl
              hover:bg-white/10 hover:border-white/30
              transition-all duration-200
            "
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <button
          onClick={nextStep}
          className="
            flex-1 flex items-center justify-center gap-2
            px-6 py-3
            bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE]
            text-white font-semibold rounded-xl
            hover:opacity-90
            transition-all duration-200
            shadow-lg shadow-[#4F46E5]/30
          "
        >
          {isLastStep ? 'Get Started' : 'Next'}
          {!isLastStep && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Skip Button */}
      <button
        onClick={skipTour}
        className="
          w-full mt-3
          text-sm text-white/40 hover:text-white/60
          transition-colors
        "
      >
        Skip tour
      </button>
    </div>
  );
}
