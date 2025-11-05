'use client';

/**
 * Verified Card Component
 * 
 * Success card displayed when credential is successfully verified.
 * Shows credential details, issuer info, and trust indicators.
 */

import React from 'react';
import Image from 'next/image';
import { 
  VerifiedCardProps,
  getTrustLevel,
  formatVerificationId,
} from '../../types/verification.types';

export const VerifiedCard: React.FC<VerifiedCardProps> = ({
  credential,
  verificationId,
  onShare,
  onViewDetails,
}) => {
  const trustInfo = getTrustLevel(credential.issuer.trustScore || 0);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Success Banner */}
      <div className="mb-6 p-6 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* Checkmark */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-scale-in">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-emerald-400 mb-1">
              Credential Verified!
            </h3>
            <p className="text-sm text-emerald-300/80">
              This credential is authentic and has been verified on the blockchain.
            </p>
            <p className="text-xs text-emerald-400/60 mt-1 font-mono">
              {formatVerificationId(verificationId)}
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex-shrink-0">
            <div 
              className="px-4 py-2 rounded-lg border-2 bg-slate-800/50"
              style={{ 
                borderColor: trustInfo.color,
                color: trustInfo.color 
              }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-0.5">
                  {credential.issuer.trustScore || 0}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide">
                  {trustInfo.level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credential Card */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
        {/* Credential Header with Image */}
        <div className="relative h-48 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 border-b border-slate-700/50">
          <div className="absolute inset-0 flex items-center justify-center">
            {credential.imageUrl ? (
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl">
                <Image
                  src={credential.imageUrl}
                  alt={credential.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-xl bg-slate-800 border-4 border-white/10 flex items-center justify-center shadow-2xl">
                <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            )}
          </div>

          {/* Verified Badge Overlay */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Credential Details */}
        <div className="p-6">
          {/* Credential Name */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              {credential.name}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {credential.description}
            </p>
          </div>

          {/* Skill Level */}
          {credential.skillLevel && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Skill Level</span>
                <span className="text-sm font-bold text-indigo-400">{credential.skillLevel}/100</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
                  style={{ width: `${credential.skillLevel}%` }}
                />
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div>
              <p className="text-xs text-slate-500 mb-1">Category</p>
              <p className="text-sm font-medium text-slate-300">{credential.category}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Issued</p>
              <p className="text-sm font-medium text-slate-300">
                {credential.issuedAt.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Network</p>
              <p className="text-sm font-medium text-slate-300">{credential.blockchain.network}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Status</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-medium text-emerald-400">{credential.status}</p>
              </div>
            </div>
          </div>

          {/* Issuer Info */}
          <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <div className="flex items-center gap-3 mb-3">
              {credential.issuer.logo && (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-600">
                  <Image
                    src={credential.issuer.logo}
                    alt={credential.issuer.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-200">
                    {credential.issuer.name}
                  </h4>
                  {credential.issuer.verified && (
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-slate-500">Trusted Issuer</p>
              </div>
            </div>
            {credential.issuer.certificateNumber && (
              <p className="text-xs text-slate-500 font-mono">
                Certificate: {credential.issuer.certificateNumber}
              </p>
            )}
          </div>

          {/* Owner Info */}
          <div className="mb-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <p className="text-xs text-slate-500 mb-2">Owner</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-slate-300 truncate flex-1">
                {credential.owner.displayName || credential.owner.walletAddress}
              </p>
              {credential.owner.verifiedIdentity && (
                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {credential.owner.displayName && (
              <p className="text-xs text-slate-500 font-mono mt-1 truncate">
                {credential.owner.walletAddress}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            )}
          </div>

          {/* Blockchain Explorer Link */}
          {credential.blockchain.explorerUrl && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <a
                href={credential.blockchain.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Blockchain Explorer
              </a>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
