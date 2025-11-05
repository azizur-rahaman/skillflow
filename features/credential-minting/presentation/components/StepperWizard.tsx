'use client';

/**
 * Stepper Wizard Component
 * 
 * Visual step navigation with progress indicators and soft futuristic design.
 */

import React from 'react';
import { Check } from 'lucide-react';
import {
  StepperWizardProps,
  MintingStep,
  getStepIndex,
  isStepCompleted,
  getStepProgress,
} from '../../types/minting.types';

export const StepperWizard: React.FC<StepperWizardProps> = ({
  currentStep,
  steps,
  onStepClick,
  completedSteps = [],
}) => {
  const currentIndex = getStepIndex(currentStep);
  const progress = getStepProgress(currentStep);

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = step === currentStep;
            const isCompleted = completedSteps.includes(step) || isStepCompleted(step, currentStep);
            const isAccessible = index <= currentIndex;

            return (
              <button
                key={step}
                onClick={() => onStepClick && isAccessible && onStepClick(step)}
                disabled={!isAccessible || !onStepClick}
                className={`group flex flex-col items-center ${
                  onStepClick && isAccessible ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Step Circle */}
                <div className="relative mb-3">
                  {/* Glow Effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-lg opacity-50 animate-pulse" />
                  )}

                  {/* Circle */}
                  <div
                    className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-transparent'
                        : isActive
                        ? 'bg-slate-900 border-indigo-500'
                        : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span
                        className={`text-sm font-semibold ${
                          isActive ? 'text-indigo-400' : 'text-slate-500'
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Animated Ring */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-ping opacity-20" />
                  )}
                </div>

                {/* Step Label */}
                <div className="text-center">
                  <div
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : isCompleted
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {step}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
