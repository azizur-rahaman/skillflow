'use client';

/**
 * Confirmation Summary Step & Minting Progress & Success Animation
 * 
 * Step 3: Review details, blockchain minting animation, and success celebration.
 */

import React from 'react';
import Image from 'next/image';
import { Check, Loader2, Sparkles, ArrowRight, Eye, Download } from 'lucide-react';
import {
  ConfirmationSummaryProps,
  MintingProgressProps,
  SuccessAnimationProps,
  BlockchainAnimationState,
  MintingStatus,
  getMintingStatusMessage,
  getMintingStatusColor,
} from '../../types/minting.types';

/**
 * Confirmation Summary Component
 */
export const ConfirmationSummary: React.FC<ConfirmationSummaryProps> = ({
  confirmation,
  onConfirm,
  onEdit,
  loading = false,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Review & Confirm</h2>
        <p className="text-slate-400">Verify all details before minting your credential</p>
      </div>

      {/* Credential Preview */}
      <div className="p-6 bg-slate-900 rounded-xl border border-slate-700">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-700">
            <Image
              src={confirmation.skill.imageUrl}
              alt={confirmation.metadata.name}
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{confirmation.metadata.name}</h3>
            <p className="text-sm text-slate-400">{confirmation.metadata.description}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Network</div>
            <div className="text-sm font-semibold text-white">{confirmation.network}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Estimated Cost</div>
            <div className="text-sm font-semibold text-emerald-400">{confirmation.estimatedCost}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Estimated Time</div>
            <div className="text-sm font-semibold text-white">{confirmation.estimatedTime}</div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-500 mb-1">Evidence</div>
            <div className="text-sm font-semibold text-white">{confirmation.evidence.length} items</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors"
          >
            Edit Details
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Mint Credential
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Minting Progress Component
 */
export const MintingProgress: React.FC<MintingProgressProps> = ({
  status,
  animationState,
  transaction,
  progress,
}) => {
  const statusColor = getMintingStatusColor(status);
  const statusMessage = getMintingStatusMessage(status);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Blockchain Animation */}
      <div className="relative mb-8">
        {/* Animated Circles */}
        <div className="relative w-32 h-32">
          <div
            className="absolute inset-0 rounded-full border-4 animate-spin"
            style={{
              borderColor: `${statusColor}40`,
              borderTopColor: statusColor,
              animationDuration: '2s',
            }}
          />
          <div
            className="absolute inset-4 rounded-full border-4 animate-spin"
            style={{
              borderColor: `${statusColor}20`,
              borderTopColor: statusColor,
              animationDuration: '3s',
              animationDirection: 'reverse',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${statusColor}20` }}
            >
              {animationState === BlockchainAnimationState.Complete ? (
                <Check className="w-8 h-8" style={{ color: statusColor }} />
              ) : (
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: statusColor }} />
              )}
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ backgroundColor: statusColor }}
        />
      </div>

      {/* Status Message */}
      <h3 className="text-2xl font-bold text-white mb-2">{statusMessage}</h3>
      
      {/* Progress Bar */}
      <div className="w-full max-w-md mb-6">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: statusColor,
            }}
          />
        </div>
      </div>

      {/* Transaction Hash */}
      {transaction?.transactionHash && (
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Transaction Hash</div>
          <div className="font-mono text-sm text-slate-400">
            {transaction.transactionHash.slice(0, 10)}...{transaction.transactionHash.slice(-8)}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Success Animation Component
 */
export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  credential,
  transaction,
  onViewCredential,
  onMintAnother,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Success Icon with Animation */}
      <div className="relative mb-8">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center animate-bounce">
            <Check className="w-16 h-16 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse" />
        </div>
      </div>

      {/* Success Message */}
      <h2 className="text-3xl font-bold text-white mb-2">Credential Minted!</h2>
      <p className="text-slate-400 mb-8 text-center max-w-md">
        Your {credential.name} credential has been successfully minted on the blockchain
      </p>

      {/* Credential Card */}
      <div className="w-full max-w-md p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-700">
            <Image
              src={credential.imageUrl}
              alt={credential.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{credential.name}</h3>
            <div className="text-sm text-slate-400">Level {credential.skillLevel}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-800/50 rounded-lg">
          <div>
            <div className="text-xs text-slate-500">Token ID</div>
            <div className="text-sm font-mono text-slate-300">{credential.tokenId.slice(0, 10)}...</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Network</div>
            <div className="text-sm text-slate-300">Polygon</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-md">
        <button
          onClick={onViewCredential}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Eye className="w-5 h-5" />
          View Credential
        </button>
        <button
          onClick={onMintAnother}
          className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          Mint Another
        </button>
      </div>
    </div>
  );
};
