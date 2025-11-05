'use client';

/**
 * TokenList Component
 * 
 * Displays grid of ERC-1155 skill credentials with metadata,
 * verification badges, and hover effects. Minimalist blockchain design.
 */

import React, { useState } from 'react';
import { Trophy, GraduationCap, CheckCircle, Award, Star, ThumbsUp, FileText, Shield, ChevronDown, Search } from 'lucide-react';
import {
  TokenListProps,
  SkillToken,
  CredentialCategory,
  VerificationStatus,
  getCategoryColor,
  getCategoryIcon,
  getVerificationStatusColor,
  formatTokenId,
  calculateRarityScore,
} from '../../types/wallet.types';

export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  loading = false,
  onTokenClick,
  onMintClick,
  filters,
  onFilterChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CredentialCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tokens
  const filteredTokens = tokens.filter(token => {
    if (selectedCategory !== 'all' && token.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && token.verificationStatus !== selectedStatus) return false;
    if (searchQuery && !token.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Get icon component
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Trophy,
      GraduationCap,
      CheckCircle,
      Award,
      Star,
      ThumbsUp,
      FileText,
    };
    return icons[iconName] || FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Skill Credentials</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredTokens.length} of {tokens.length} tokens
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {Object.values(CredentialCategory).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            {Object.values(VerificationStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Token grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 animate-pulse">
              <div className="w-full aspect-square bg-slate-700 rounded-xl mb-4" />
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredTokens.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-semibold text-white mb-2">No credentials found</h4>
          <p className="text-sm text-muted-foreground mb-6">
            {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Start minting credentials to build your portfolio'}
          </p>
          {onMintClick && (
            <button
              onClick={onMintClick}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
              }}
            >
              Mint Credential
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTokens.map(token => (
            <TokenCard
              key={token.tokenId}
              token={token}
              onClick={() => onTokenClick?.(token)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Individual Token Card
 */
interface TokenCardProps {
  token: SkillToken;
  onClick?: () => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, onClick }) => {
  const categoryColor = getCategoryColor(token.category);
  const verificationColor = getVerificationStatusColor(token.verificationStatus);
  const rarityScore = calculateRarityScore(token);

  // Get icon component
  const iconName = getCategoryIcon(token.category);
  const IconComponent = {
    Trophy,
    GraduationCap,
    CheckCircle: CheckCircle,
    Award,
    Star,
    ThumbsUp,
    FileText,
  }[iconName] || FileText;

  return (
    <div
      onClick={onClick}
      className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-primary hover:scale-[1.02] transition-all cursor-pointer"
    >
      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${categoryColor}, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Token image/icon */}
        <div
          className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center text-white overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${categoryColor}33, ${categoryColor}11)`,
            border: `1px solid ${categoryColor}44`,
          }}
        >
          <IconComponent className="w-16 h-16" style={{ color: categoryColor }} />
          
          {/* Rarity badge */}
          {rarityScore >= 80 && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
              Rare
            </div>
          )}
        </div>

        {/* Token info */}
        <div className="space-y-3">
          {/* Name and ID */}
          <div>
            <h4 className="text-base font-semibold text-white mb-1 line-clamp-1">
              {token.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{formatTokenId(token.tokenId)}</span>
              <span>•</span>
              <span>x{token.amount}</span>
            </div>
          </div>

          {/* Category badge */}
          <div className="flex items-center gap-2">
            <div
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-white"
              style={{
                backgroundColor: `${categoryColor}22`,
                border: `1px solid ${categoryColor}44`,
                color: categoryColor,
              }}
            >
              {token.category}
            </div>
          </div>

          {/* Skill level bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Skill Level</span>
              <span className="font-semibold text-white">{token.skillLevel}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${token.skillLevel}%`,
                  background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}CC)`,
                }}
              />
            </div>
          </div>

          {/* Verification and issuer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            {/* Verification status */}
            <div className="flex items-center gap-1.5">
              {token.verificationStatus === VerificationStatus.Verified ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs font-medium text-green-500">Verified</span>
                </>
              ) : token.verificationStatus === VerificationStatus.Pending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-orange-500">Pending</span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">Unverified</span>
              )}
            </div>

            {/* Issuer */}
            <div className="flex items-center gap-1.5">
              {token.issuer.verified && (
                <CheckCircle className="w-3 h-3 text-primary" />
              )}
              <span className="text-xs text-muted-foreground line-clamp-1">
                {token.issuer.name}
              </span>
            </div>
          </div>

          {/* Expiry (if applicable) */}
          {token.expiresAt && (
            <div className="text-xs text-muted-foreground">
              Expires {new Date(token.expiresAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
