'use client';

import React, { useState } from 'react';
import { Lock, Sparkles, Star } from 'lucide-react';
import {
  Badge,
  BadgeCategory,
  BadgeRarity,
  getBadgeRarityColor,
  getBadgeRarityLabel,
} from '../../types/gamification.types';

/**
 * Props for BadgeGallery component
 */
interface BadgeGalleryProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
}

/**
 * Badge gallery with soft lighting effects and rarity tiers
 * Features: glow effects, unlock animations, progress bars for locked badges
 */
export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ badges, onBadgeClick }) => {
  const [filter, setFilter] = useState<BadgeCategory | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<BadgeRarity | 'all'>('all');

  // Filter badges
  const filteredBadges = badges.filter((badge) => {
    const matchesCategory = filter === 'all' || badge.category === filter;
    const matchesRarity = rarityFilter === 'all' || badge.rarity === rarityFilter;
    return matchesCategory && matchesRarity;
  });

  // Group by rarity
  const badgesByRarity = filteredBadges.reduce((acc, badge) => {
    if (!acc[badge.rarity]) acc[badge.rarity] = [];
    acc[badge.rarity].push(badge);
    return acc;
  }, {} as Record<BadgeRarity, Badge[]>);

  const rarityOrder = [
    BadgeRarity.LEGENDARY,
    BadgeRarity.EPIC,
    BadgeRarity.RARE,
    BadgeRarity.COMMON,
  ];

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Badge Collection</h2>
          <p className="text-sm text-slate-400">
            {badges.filter((b) => b.isUnlocked).length} / {badges.length} unlocked
          </p>
        </div>

        <div className="flex gap-3">
          {/* Category filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as BadgeCategory | 'all')}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value={BadgeCategory.LEARNING}>Learning</option>
            <option value={BadgeCategory.MASTERY}>Mastery</option>
            <option value={BadgeCategory.CONSISTENCY}>Consistency</option>
            <option value={BadgeCategory.ACHIEVEMENT}>Achievement</option>
            <option value={BadgeCategory.SOCIAL}>Social</option>
            <option value={BadgeCategory.SPECIAL}>Special</option>
          </select>

          {/* Rarity filter */}
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as BadgeRarity | 'all')}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Rarities</option>
            <option value={BadgeRarity.LEGENDARY}>Legendary</option>
            <option value={BadgeRarity.EPIC}>Epic</option>
            <option value={BadgeRarity.RARE}>Rare</option>
            <option value={BadgeRarity.COMMON}>Common</option>
          </select>
        </div>
      </div>

      {/* Badges by rarity */}
      {rarityOrder.map((rarity) => {
        const badgesInRarity = badgesByRarity[rarity] || [];
        if (badgesInRarity.length === 0) return null;

        const rarityColor = getBadgeRarityColor(rarity);

        return (
          <div key={rarity} className="space-y-4">
            {/* Rarity header */}
            <div className="flex items-center gap-3">
              <div
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: `${rarityColor}20`,
                  color: rarityColor,
                  border: `1px solid ${rarityColor}40`,
                }}
              >
                {getBadgeRarityLabel(rarity)}
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
            </div>

            {/* Badge grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {badgesInRarity.map((badge) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  onClick={() => onBadgeClick?.(badge)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-2">No Badges Found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

/**
 * Individual badge card
 */
const BadgeCard: React.FC<{ badge: Badge; onClick: () => void }> = ({ badge, onClick }) => {
  const rarityColor = getBadgeRarityColor(badge.rarity);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative aspect-square bg-gradient-to-br from-slate-900 to-slate-800 border-2 rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
      style={{
        borderColor: badge.isUnlocked ? `${rarityColor}80` : '#334155',
        opacity: badge.isUnlocked ? 1 : 0.6,
      }}
    >
      {/* Glow effect (unlocked only) */}
      {badge.isUnlocked && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
          style={{
            background: `radial-gradient(circle, ${rarityColor}40, transparent 70%)`,
          }}
        />
      )}

      {/* Soft lighting effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-20"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${badge.color}60, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Lock overlay for locked badges */}
        {!badge.isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-xl backdrop-blur-sm">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
        )}

        {/* Badge icon */}
        <div
          className="text-5xl mb-2 transition-transform duration-300 group-hover:scale-110"
          style={{
            filter: badge.isUnlocked
              ? `drop-shadow(0 0 8px ${badge.color}80)`
              : 'grayscale(100%)',
          }}
        >
          {badge.icon}
        </div>

        {/* Badge name */}
        <div className="text-center">
          <div className="text-sm font-semibold text-white mb-1 line-clamp-1">
            {badge.name}
          </div>

          {/* XP reward */}
          {badge.isUnlocked && (
            <div className="flex items-center justify-center gap-1 text-xs">
              <Sparkles className="w-3 h-3" style={{ color: rarityColor }} />
              <span style={{ color: rarityColor }}>+{badge.xpReward} XP</span>
            </div>
          )}
        </div>

        {/* Progress bar for locked badges */}
        {!badge.isUnlocked && badge.progress !== undefined && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${badge.progress}%` }}
              />
            </div>
            <div className="text-xs text-slate-400 text-center mt-1">
              {badge.progress}%
            </div>
          </div>
        )}

        {/* Sparkle effect for legendary */}
        {badge.isUnlocked && badge.rarity === BadgeRarity.LEGENDARY && (
          <Sparkles
            className="absolute top-2 right-2 w-4 h-4 animate-pulse"
            style={{ color: rarityColor, animationDuration: '2s' }}
          />
        )}
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white whitespace-nowrap z-20 pointer-events-none">
          <div className="font-semibold mb-1">{badge.name}</div>
          <div className="text-slate-400 mb-1">{badge.description}</div>
          <div className="text-slate-500">{badge.requirement}</div>
          
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45" />
          </div>
        </div>
      )}
    </button>
  );
};
