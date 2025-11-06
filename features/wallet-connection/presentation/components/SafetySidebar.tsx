'use client';

/**
 * Safety Sidebar Component
 * 
 * Step-by-step safety tips and security guidance for wallet connection.
 * Adapts to current connection step with educational content.
 */

import React from 'react';
import { 
  SafetySidebarProps,
  ConnectionStep,
  SafetyTipCategory,
} from '../../types/wallet-connection.types';

export const SafetySidebar: React.FC<SafetySidebarProps> = ({
  currentStep,
  tips,
  compact = false,
}) => {
  // Filter tips based on current step
  const getRelevantTips = () => {
    switch (currentStep) {
      case ConnectionStep.Idle:
      case ConnectionStep.SelectingProvider:
        return tips.filter(t => t.priority === 'high');
      case ConnectionStep.RequestingPermission:
      case ConnectionStep.VerifyingSignature:
        return tips.filter(t => t.category === SafetyTipCategory.Security);
      case ConnectionStep.Connecting:
        return tips.filter(t => t.category === SafetyTipCategory.Verification);
      case ConnectionStep.Connected:
        return tips.filter(t => t.category === SafetyTipCategory.BestPractice);
      default:
        return tips;
    }
  };

  const relevantTips = getRelevantTips();

  if (compact) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Safety Tips</span>
        </h3>
        <div className="space-y-2">
          {relevantTips.slice(0, 3).map((tip) => (
            <div 
              key={tip.id}
              className="text-xs text-slate-400 flex items-start gap-2"
            >
              <span className="text-sm flex-shrink-0">{tip.icon}</span>
              <span>{tip.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Safety Guide</h2>
            <p className="text-sm text-slate-500">Protect your wallet</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {relevantTips.map((tip, index) => (
          <div
            key={tip.id}
            className="group relative"
          >
            {/* Glow effect for high priority */}
            {tip.priority === 'high' && (
              <div 
                className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"
                style={{
                  background: 'linear-gradient(135deg, #EF4444, #F59E0B)',
                }}
              />
            )}

            {/* Tip card */}
            <div
              className={`
                relative p-4 rounded-xl border backdrop-blur-sm
                transition-all duration-300
                ${tip.priority === 'high' ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' : ''}
                ${tip.priority === 'medium' ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40' : ''}
                ${tip.priority === 'low' ? 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600' : ''}
              `}
            >
              {/* Priority badge */}
              {tip.priority === 'high' && (
                <div className="absolute -top-2 -right-2">
                  <div className="px-2 py-0.5 rounded-md bg-red-500 text-white text-xs font-bold shadow-lg">
                    CRITICAL
                  </div>
                </div>
              )}

              {/* Icon and category */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{tip.icon}</span>
                <span 
                  className={`
                    text-xs font-semibold uppercase tracking-wide
                    ${tip.priority === 'high' ? 'text-red-400' : ''}
                    ${tip.priority === 'medium' ? 'text-amber-400' : ''}
                    ${tip.priority === 'low' ? 'text-slate-400' : ''}
                  `}
                >
                  {tip.category}
                </span>
              </div>

              {/* Content */}
              <h4 className="text-sm font-bold text-slate-200 mb-1">
                {tip.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tip.description}
              </p>

              {/* Step indicator */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-px bg-slate-700/50" />
                <span className="text-xs text-slate-600 font-mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex items-start gap-2 mb-2">
            <svg className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-indigo-300 mb-1">
                Need Help?
              </p>
              <p className="text-xs text-indigo-400/80">
                Visit our{' '}
                <a href="/help" className="underline hover:text-indigo-300 transition-colors">
                  Help Center
                </a>
                {' '}or contact support if you have questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
