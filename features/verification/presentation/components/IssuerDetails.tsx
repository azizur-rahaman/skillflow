'use client';

/**
 * Issuer Details Component
 * 
 * Displays detailed issuer information with trust score and verification status.
 */

import React from 'react';
import Image from 'next/image';
import { 
  IssuerDetailsProps,
  getTrustLevel,
} from '../../types/verification.types';

export const IssuerDetails: React.FC<IssuerDetailsProps> = ({
  issuer,
  blockchain,
  compact = false,
}) => {
  const trustInfo = getTrustLevel(issuer.trustScore || 0);

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {issuer.logo && (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-600">
            <Image
              src={issuer.logo}
              alt={issuer.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-200">
              {issuer.name}
            </h4>
            {issuer.verified && (
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-xs text-slate-500">Trusted Issuer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        {issuer.logo && (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-600 flex-shrink-0">
            <Image
              src={issuer.logo}
              alt={issuer.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-slate-100">
              {issuer.name}
            </h3>
            {issuer.verified && (
              <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium text-emerald-400">Verified</span>
              </div>
            )}
          </div>
          {issuer.description && (
            <p className="text-sm text-slate-400 leading-relaxed">
              {issuer.description}
            </p>
          )}
        </div>
      </div>

      {/* Trust Score */}
      <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: trustInfo.color, backgroundColor: `${trustInfo.color}10` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Trust Score</span>
          <span className="text-2xl font-bold" style={{ color: trustInfo.color }}>
            {issuer.trustScore || 0}/100
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${issuer.trustScore || 0}%`,
              backgroundColor: trustInfo.color
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: trustInfo.color }}>
            {trustInfo.level}
          </span>
          <span className="text-xs text-slate-500">
            {trustInfo.description}
          </span>
        </div>
      </div>

      {/* Contact Information */}
      {(issuer.website || issuer.email) && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Contact Information</h4>
          <div className="space-y-2">
            {issuer.website && (
              <a
                href={issuer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="truncate">{issuer.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {issuer.email && (
              <a
                href={`mailto:${issuer.email}`}
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{issuer.email}</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Blockchain Information */}
      {blockchain && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Blockchain Information</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Network</p>
              <p className="text-sm font-medium text-slate-300">{blockchain.network}</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Block</p>
              <p className="text-sm font-medium text-slate-300">#{blockchain.blockNumber.toLocaleString()}</p>
            </div>
            <div className="col-span-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-500 mb-1">Contract Address</p>
              <p className="text-xs font-mono text-slate-300 truncate">{blockchain.contractAddress}</p>
            </div>
            {blockchain.ipfsMetadataUrl && (
              <div className="col-span-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs text-slate-500">IPFS Metadata</p>
                </div>
                <a
                  href={blockchain.ipfsMetadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors truncate block"
                >
                  {blockchain.ipfsMetadataUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificate Number */}
      {issuer.certificateNumber && (
        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
          <p className="text-xs text-slate-500 mb-1">Certificate Number</p>
          <p className="text-sm font-mono text-slate-300">{issuer.certificateNumber}</p>
        </div>
      )}

      {/* Wallet Address */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 mb-2">Issuer Wallet</p>
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-slate-400 truncate flex-1">
            {issuer.walletAddress}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(issuer.walletAddress)}
            className="p-1.5 rounded-md hover:bg-slate-800/50 text-slate-400 hover:text-slate-300 transition-colors flex-shrink-0"
            aria-label="Copy wallet address"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
