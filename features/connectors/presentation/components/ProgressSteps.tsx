'use client';

import { Check } from 'lucide-react';
import { wizardSteps } from '../../context/DataConnectionContext';
import { useDataConnection } from '../../context/DataConnectionContext';

export default function ProgressSteps() {
  const { state } = useDataConnection();

  return (
    <div className="w-full mb-12">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-white/10 rounded-full" />

        {/* Active Progress Line */}
        <div
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE] rounded-full transition-all duration-500"
          style={{
            width: `${((state.currentStep + 1) / state.totalSteps) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {wizardSteps.map((step, index) => {
            const isActive = index === state.currentStep;
            const isCompleted = index < state.currentStep;
            const isPending = index > state.currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                    w-12 h-12 rounded-full
                    flex items-center justify-center
                    font-semibold text-sm
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] text-white shadow-lg shadow-[#4F46E5]/40'
                        : isActive
                        ? 'bg-gradient-to-r from-[#A855F7] to-[#22D3EE] text-white shadow-lg shadow-[#A855F7]/40 scale-110'
                        : 'bg-white/10 text-white/40 border-2 border-white/20'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center max-w-[180px]">
                  <h4
                    className={`
                      text-sm font-semibold mb-1 transition-colors
                      ${
                        isActive
                          ? 'text-white'
                          : isCompleted
                          ? 'text-[#22D3EE]'
                          : 'text-white/40'
                      }
                    `}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={`
                      text-xs transition-colors
                      ${isActive ? 'text-white/60' : 'text-white/30'}
                    `}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Optional Badge */}
                {step.isOptional && (
                  <span className="mt-2 px-2 py-0.5 bg-white/10 border border-white/20 rounded text-xs text-white/50">
                    Optional
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
