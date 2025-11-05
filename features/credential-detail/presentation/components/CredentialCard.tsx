'use client';

/**
 * Credential Card Component
 * 
 * Large NFT-style display card for skill credential with gradient effects,
 * rarity indicators, and elegant visual presentation.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { Share2, Download, ExternalLink, Shield, Award } from 'lucide-react';
import {
  CredentialCardProps,
  getRarityTier,
  getRarityColor,
  calculateCredentialScore,
} from '../../types/credential-detail.types';
import { VerificationStatus } from '@/features/wallet/types/wallet.types';

export const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  onShare,
  onDownload,
  onViewBlockchain,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const score = calculateCredentialScore(credential);
  const rarityTier = getRarityTier(score);
  const rarityColor = getRarityColor(rarityTier);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Header with Actions */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-200">
              {credential.category}
            </span>
          </div>
          
          {credential.verificationStatus === VerificationStatus.Verified && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Verified</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onShare}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Share credential"
          >
            <Share2 className="w-5 h-5 text-slate-400" />
          </button>
          <button
            onClick={onDownload}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Download credential"
          >
            <Download className="w-5 h-5 text-slate-400" />
          </button>
          <button
            onClick={onViewBlockchain}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="View on blockchain"
          >
            <ExternalLink className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* NFT Image Display */}
      <div className="relative aspect-square p-8">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
        
        {/* Rarity Glow Effect */}
        <div 
          className="absolute inset-8 rounded-2xl blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${rarityColor}80, transparent)`,
          }}
        />

        {/* Token Image */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-2xl">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse" />
          )}
          
          <Image
            src={credential.imageUrl}
            alt={credential.name}
            fill
            className={`object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Rarity Badge Overlay */}
          <div className="absolute top-4 right-4">
            <div 
              className="px-4 py-2 rounded-lg backdrop-blur-md border"
              style={{
                backgroundColor: `${rarityColor}20`,
                borderColor: `${rarityColor}40`,
              }}
            >
              <div className="text-xs font-medium text-white uppercase tracking-wider">
                {rarityTier}
              </div>
              <div className="text-lg font-bold text-white">
                {score}
              </div>
            </div>
          </div>

          {/* Skill Level Badge */}
          <div className="absolute bottom-4 left-4">
            <div className="px-4 py-2 rounded-lg backdrop-blur-md bg-slate-900/80 border border-slate-700">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Skill Level
              </div>
              <div className="text-2xl font-bold text-indigo-400">
                {credential.skillLevel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credential Info */}
      <div className="p-6 space-y-4 border-t border-slate-700">
        {/* Name and Description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {credential.name}
          </h2>
          <p className="text-slate-400 leading-relaxed">
            {credential.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-indigo-400">
              {credential.viewCount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Views
            </div>
          </div>
          
          <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-purple-400">
              {credential.shareCount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Shares
            </div>
          </div>
          
          <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-2xl font-bold text-emerald-400">
              {credential.verificationCount.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              Verified
            </div>
          </div>
        </div>

        {/* Issuer Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            {credential.issuer.logo ? (
              <Image
                src={credential.issuer.logo}
                alt={credential.issuer.name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <Award className="w-5 h-5 text-slate-600" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-300">
                {credential.issuer.name}
              </span>
              {credential.issuer.verified && (
                <Shield className="w-4 h-4 text-indigo-400" />
              )}
            </div>
            <div className="text-xs text-slate-500">
              Issued {credential.issuedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
