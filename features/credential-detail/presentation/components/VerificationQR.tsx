'use client';

/**
 * Verification QR Component
 * 
 * QR code generation and verification badge for public credential verification.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { QrCode, Shield, Check, ExternalLink, Loader2 } from 'lucide-react';
import {
  VerificationQRProps,
  VerificationMethod,
  generateQRCodeUrl,
  generateVerificationUrl,
} from '../../types/credential-detail.types';

export const VerificationQR: React.FC<VerificationQRProps> = ({
  credential,
  verification,
  onVerify,
  loading = false,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>(
    VerificationMethod.QRCode
  );

  const handleVerify = async () => {
    await onVerify(selectedMethod);
  };

  const verificationUrl = generateVerificationUrl(
    credential.tokenId,
    credential.blockchainData.verificationHash
  );

  const qrCodeUrl = generateQRCodeUrl(verificationUrl);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Verification Badge
            </h3>
            <p className="text-sm text-slate-400">
              Publicly verify this credential on the blockchain
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Verification Methods */}
        <div>
          <div className="text-sm font-medium text-slate-400 mb-3">
            Verification Method
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedMethod(VerificationMethod.QRCode)}
              className={`p-3 rounded-lg border transition-all ${
                selectedMethod === VerificationMethod.QRCode
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <QrCode className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">QR Code</span>
            </button>

            <button
              onClick={() => setSelectedMethod(VerificationMethod.Blockchain)}
              className={`p-3 rounded-lg border transition-all ${
                selectedMethod === VerificationMethod.Blockchain
                  ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Shield className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Blockchain</span>
            </button>
          </div>
        </div>

        {/* QR Code Display */}
        {!verification ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="p-4 bg-slate-800 rounded-2xl border-2 border-dashed border-slate-700">
              <QrCode className="w-16 h-16 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-4">
                Generate a QR code to verify this credential
              </p>
              <button
                onClick={handleVerify}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Generate Verification
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* QR Code */}
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl">
              <div className="relative w-64 h-64">
                <Image
                  src={qrCodeUrl}
                  alt="Verification QR Code"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-slate-600 text-center mt-4 max-w-xs">
                Scan this QR code to verify the credential on the blockchain
              </p>
            </div>

            {/* Verification Status */}
            {verification.verified && (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="flex-shrink-0 p-2 bg-emerald-500/20 rounded-lg">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-emerald-400">
                    Verification Successful
                  </div>
                  <div className="text-xs text-emerald-400/80 mt-0.5">
                    Verified by {verification.proof?.verifier.name} on{' '}
                    {verification.proof?.verifiedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}

            {/* Verification Details */}
            <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex justify-between items-start">
                <span className="text-xs text-slate-400">Verification URL</span>
                <a
                  href={verification.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Open
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="font-mono text-xs text-slate-300 break-all">
                {verification.verificationUrl}
              </div>
            </div>

            {verification.proof && (
              <div className="space-y-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="text-xs text-slate-400">Proof Signature</div>
                <div className="font-mono text-xs text-slate-300 break-all">
                  {verification.proof.signature}
                </div>
              </div>
            )}

            {/* Expiration */}
            {verification.expiresAt && (
              <div className="text-center">
                <p className="text-xs text-slate-500">
                  Verification expires on{' '}
                  {verification.expiresAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Regenerate Button */}
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors"
            >
              Regenerate Verification
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="text-sm font-medium text-slate-300 mb-2">
            How to Verify
          </div>
          <ol className="space-y-2 text-sm text-slate-400">
            <li className="flex gap-2">
              <span className="flex-shrink-0">1.</span>
              <span>Generate a verification QR code or link</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0">2.</span>
              <span>Share with anyone who needs to verify this credential</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0">3.</span>
              <span>They can scan or visit the link to verify on-chain</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
