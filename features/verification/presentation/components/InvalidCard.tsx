'use client';

/**
 * Invalid Card Component
 * 
 * Error card displayed when credential verification fails.
 * Shows error details and provides helpful guidance.
 */

import React from 'react';
import { 
  InvalidCardProps,
  getErrorMessage,
} from '../../types/verification.types';

export const InvalidCard: React.FC<InvalidCardProps> = ({
  error,
  onTryAgain,
}) => {
  const errorMessage = getErrorMessage(error.type);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Error Banner */}
      <div className="mb-6 p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* Error Icon */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/50 animate-shake">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-red-400 mb-1">
              Verification Failed
            </h3>
            <p className="text-sm text-red-300/80">
              {error.message || errorMessage}
            </p>
            {error.code && (
              <p className="text-xs text-red-400/60 mt-1 font-mono">
                Error Code: {error.code}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error Details Card */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-slate-200 mb-4">What went wrong?</h4>

        <div className="space-y-4 mb-6">
          {/* Error Type */}
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-300 mb-1">Error Type</p>
                <p className="text-sm text-slate-400">{error.type}</p>
              </div>
            </div>
          </div>

          {/* Error Details */}
          {error.details && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-300 mb-1">Details</p>
                  <p className="text-sm text-slate-400">{error.details}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Troubleshooting Tips */}
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-slate-300 mb-3">Troubleshooting Tips</h5>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Double-check that you entered the correct token ID or verification URL</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Ensure the credential hasn't been revoked or expired</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Verify the credential was issued on a supported blockchain network</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-slate-400">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Contact the issuer if you believe this is a legitimate credential</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onTryAgain && (
            <button
              onClick={onTryAgain}
              className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          )}
          <button
            className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Get Help
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-slate-700/50">
          <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-300 mb-1">Security Notice</p>
              <p className="text-xs text-amber-300/80">
                If you suspect fraud or believe this credential should be valid, contact the issuer immediately.
                Do not share your wallet credentials with anyone claiming to help verify this credential.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
