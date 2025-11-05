'use client';

/**
 * Issuer Signature Component
 * 
 * Displays digital signature from the issuing organization with trust indicators,
 * certificate number, and signer details in an elegant format.
 */

import React from 'react';
import Image from 'next/image';
import { Shield, Award, Calendar, CheckCircle } from 'lucide-react';
import { IssuerSignatureProps, formatCertificateNumber } from '../../types/credential-detail.types';

export const IssuerSignature: React.FC<IssuerSignatureProps> = ({
  signature,
  compact = false,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Official Certification
            </h3>
            <p className="text-sm text-slate-400">
              Digitally signed by the issuing authority
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Issuer Information */}
        <div className="flex items-start gap-4">
          {/* Issuer Logo */}
          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            {signature.issuer.logo ? (
              <Image
                src={signature.issuer.logo}
                alt={signature.issuer.name}
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <Award className="w-8 h-8 text-slate-600" />
            )}
          </div>

          {/* Issuer Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-lg font-semibold text-white">
                {signature.issuer.name}
              </h4>
              {signature.issuer.verified && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">
                    Verified
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-400 mb-2">
              Authorized Credential Issuer
            </p>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-mono text-slate-500">
                {signature.issuer.walletAddress.slice(0, 6)}...
                {signature.issuer.walletAddress.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Number */}
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Certificate Number
          </div>
          <div className="font-mono text-lg font-bold text-indigo-400 tracking-wide">
            {signature.certificateNumber}
          </div>
        </div>

        {/* Signature Image */}
        {signature.signatureImageUrl && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg" />
            <div className="relative p-6 bg-white/5 rounded-lg border border-slate-700/50">
              <div className="h-24 relative">
                <Image
                  src={signature.signatureImageUrl}
                  alt={`${signature.signerName}'s signature`}
                  fill
                  className="object-contain object-left"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/30">
                <div className="text-sm font-medium text-slate-200">
                  {signature.signerName}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {signature.signerTitle}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Signature Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Signed Date */}
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Signed On
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {signature.signedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Valid Until */}
          <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Valid Until
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {signature.validUntil
                ? signature.validUntil.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Lifetime'}
            </div>
          </div>
        </div>

        {/* Signature Hash */}
        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            Digital Signature
          </div>
          <div className="font-mono text-xs text-slate-300 break-all">
            {signature.signature}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-lg border border-emerald-500/20">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            Blockchain-Verified Signature
          </span>
        </div>

        {/* Legal Notice */}
        <div className="text-xs text-slate-500 leading-relaxed text-center">
          This digital signature is cryptographically secured and verifiable on the blockchain.
          Any tampering with this credential will invalidate the signature.
        </div>
      </div>
    </div>
  );
};
