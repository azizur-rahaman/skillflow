'use client';

/**
 * Blockchain Validation Component
 * 
 * Animated blockchain validation visualization showing the verification process.
 * Displays progress through validation steps with smooth animations.
 */

import React from 'react';
import { 
  BlockchainValidationProps,
  ValidationStep,
  getValidationStepProgress,
} from '../../types/verification.types';

export const BlockchainValidation: React.FC<BlockchainValidationProps> = ({
  progress,
  animated = true,
}) => {
  const validationSteps = [
    { step: ValidationStep.ParseInput, label: 'Parse Input', icon: '📝' },
    { step: ValidationStep.FetchMetadata, label: 'Fetch Metadata', icon: '📥' },
    { step: ValidationStep.VerifyContract, label: 'Verify Contract', icon: '📜' },
    { step: ValidationStep.CheckOwnership, label: 'Check Ownership', icon: '👤' },
    { step: ValidationStep.ValidateSignature, label: 'Validate Signature', icon: '🔐' },
    { step: ValidationStep.Complete, label: 'Complete', icon: '✅' },
  ];

  const currentStepIndex = validationSteps.findIndex(s => s.step === progress.currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      {/* Animated Rings */}
      <div className="relative h-64 mb-8 flex items-center justify-center">
        {/* Outer Ring */}
        <div 
          className={`
            absolute w-64 h-64 rounded-full 
            border-2 border-indigo-500/30
            ${animated ? 'animate-spin-slow' : ''}
          `}
          style={{
            animationDuration: '8s',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
          </div>
        </div>

        {/* Middle Ring */}
        <div 
          className={`
            absolute w-48 h-48 rounded-full 
            border-2 border-purple-500/40
            ${animated ? 'animate-spin-reverse' : ''}
          `}
          style={{
            animationDuration: '6s',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
          </div>
        </div>

        {/* Inner Ring */}
        <div 
          className={`
            absolute w-32 h-32 rounded-full 
            border-2 border-emerald-500/50
            ${animated ? 'animate-spin-slow' : ''}
          `}
          style={{
            animationDuration: '4s',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          </div>
        </div>

        {/* Center Icon */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shadow-2xl">
          <div className={animated ? 'animate-pulse' : ''}>
            <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        {/* Progress Ring */}
        <svg className="absolute w-72 h-72 -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="140"
            fill="none"
            stroke="rgba(99, 102, 241, 0.1)"
            strokeWidth="4"
          />
          <circle
            cx="144"
            cy="144"
            r="140"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 140}`}
            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress.progress / 100)}`}
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">
            {progress.message}
          </span>
          <span className="text-sm font-semibold text-indigo-400">
            {Math.round(progress.progress)}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.progress}%` }}
          />
        </div>
      </div>

      {/* Validation Steps */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {validationSteps.map((stepInfo, index) => {
          const isComplete = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={stepInfo.step}
              className={`
                p-3 rounded-lg border transition-all duration-300
                ${isComplete ? 'bg-emerald-500/10 border-emerald-500/30' : ''}
                ${isCurrent ? 'bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/20' : ''}
                ${isPending ? 'bg-slate-900/30 border-slate-700/50' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <span 
                  className={`
                    text-xl transition-all duration-300
                    ${isCurrent && animated ? 'animate-bounce' : ''}
                  `}
                >
                  {isComplete ? '✅' : isCurrent ? '⏳' : stepInfo.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p 
                    className={`
                      text-xs font-medium truncate transition-colors
                      ${isComplete ? 'text-emerald-400' : ''}
                      ${isCurrent ? 'text-indigo-400' : ''}
                      ${isPending ? 'text-slate-500' : ''}
                    `}
                  >
                    {stepInfo.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Message */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          Verifying credential authenticity on blockchain...
        </p>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse linear infinite;
        }
      `}</style>
    </div>
  );
};
