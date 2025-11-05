'use client';

/**
 * Public Verification Page
 * 
 * Public-facing page for third-party credential verification.
 * No authentication required - allows anyone to verify credential authenticity.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { VerificationProvider, useVerification } from '@/features/verification/context/VerificationContext';
import { TokenInput } from '@/features/verification/presentation/components/TokenInput';
import { BlockchainValidation } from '@/features/verification/presentation/components/BlockchainValidation';
import { VerifiedCard } from '@/features/verification/presentation/components/VerifiedCard';
import { InvalidCard } from '@/features/verification/presentation/components/InvalidCard';
import { IssuerDetails } from '@/features/verification/presentation/components/IssuerDetails';
import {
  VerificationState,
  VerificationInputMethod,
  VerificationRequest,
} from '@/features/verification/types/verification.types';

/**
 * Verification Page Content
 */
const VerificationPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const {
    verificationState,
    verificationResult,
    validationProgress,
    loading,
    error,
    verifyCredential,
    reset,
    shareVerification,
  } = useVerification();

  const [inputValue, setInputValue] = useState('');
  const [showIssuerDetails, setShowIssuerDetails] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Auto-verify if token in URL
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam && verificationState === VerificationState.Idle) {
      setInputValue(tokenParam);
      handleVerify(tokenParam);
    }
  }, [searchParams]);

  /**
   * Handle verification
   */
  const handleVerify = async (input: string) => {
    const request: VerificationRequest = {
      input,
      method: VerificationInputMethod.TokenID,
      timestamp: new Date(),
    };

    await verifyCredential(request);
  };

  /**
   * Handle share
   */
  const handleShare = async () => {
    try {
      await shareVerification();
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  /**
   * Handle reset
   */
  const handleReset = () => {
    reset();
    setInputValue('');
    setShowIssuerDetails(false);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">SkillFlow Verification</h1>
                <p className="text-xs text-slate-500">Verify Credential Authenticity</p>
              </div>
            </div>

            {verificationState !== VerificationState.Idle && (
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Verification
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Idle State - Input */}
        {verificationState === VerificationState.Idle && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500/20 mb-4">
                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">
                Verify Credential
              </h2>
              <p className="text-slate-400 leading-relaxed max-w-lg mx-auto">
                Enter a credential token ID or verification URL to check its authenticity on the blockchain.
                This verification is public and does not require an account.
              </p>
            </div>

            <TokenInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleVerify}
              disabled={loading}
              placeholder="Enter token ID, verification URL, or scan QR code..."
              autoFocus
            />

            <div className="mt-8 p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What is verified?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Credential exists on blockchain and hasn't been revoked</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Issuer is verified and trusted on the SkillFlow platform</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cryptographic signature matches the credential data</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-400">
                  <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Metadata is stored on IPFS and accessible</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Validating State - Animation */}
        {verificationState === VerificationState.Validating && validationProgress && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">
                Verifying Credential
              </h2>
              <p className="text-slate-400">
                Checking credential authenticity on blockchain...
              </p>
            </div>

            <BlockchainValidation
              progress={validationProgress}
              animated
            />
          </div>
        )}

        {/* Verified State - Success */}
        {verificationState === VerificationState.Verified && verificationResult?.credential && (
          <div className="space-y-6">
            <VerifiedCard
              credential={verificationResult.credential}
              verificationId={verificationResult.verificationId}
              onShare={handleShare}
              onViewDetails={() => setShowIssuerDetails(!showIssuerDetails)}
            />

            {/* Share Success Message */}
            {shareSuccess && (
              <div className="max-w-2xl mx-auto p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-emerald-300">Verification link copied to clipboard!</span>
              </div>
            )}

            {/* Issuer Details */}
            {showIssuerDetails && (
              <div className="max-w-2xl mx-auto">
                <IssuerDetails
                  issuer={verificationResult.credential.issuer}
                  blockchain={verificationResult.credential.blockchain}
                />
              </div>
            )}
          </div>
        )}

        {/* Invalid State - Error */}
        {verificationState === VerificationState.Invalid && verificationResult?.error && (
          <InvalidCard
            error={verificationResult.error}
            onTryAgain={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-2">
              Powered by blockchain technology for secure and verifiable credentials
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
              <a href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="/help" className="hover:text-slate-400 transition-colors">Help Center</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * Verification Page with Provider
 */
export default function VerificationPage() {
  return (
    <VerificationProvider>
      <VerificationPageContent />
    </VerificationProvider>
  );
}
