'use client';

/**
 * Skill Card Component
 * 
 * Floating card with image, price, seller info, and buy button.
 * Features subtle motion on hover with futuristic neon glow.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Zap, Star, BadgeCheck, TrendingUp } from 'lucide-react';
import {
  SkillCardProps,
  formatPrice,
  formatUSDPrice,
  formatRating,
  formatNumber,
  getCategoryColor,
} from '../../types/marketplace.types';

export const SkillCard: React.FC<SkillCardProps> = ({
  listing,
  onCardClick,
  onAddToCart,
  onBuyNow,
  inCart = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const categoryColor = getCategoryColor(listing.category);

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(listing);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(listing);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(listing);
    }
  };

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Floating Card with Glow Effect */}
      <div
        className={`
          relative overflow-hidden rounded-2xl border transition-all duration-300
          ${isHovered ? 'scale-[1.02] shadow-2xl' : 'scale-100 shadow-lg'}
        `}
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderColor: isHovered ? `${categoryColor}60` : '#334155',
          boxShadow: isHovered
            ? `0 20px 60px -15px ${categoryColor}40, 0 0 0 1px ${categoryColor}30`
            : '0 10px 30px -15px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-800/50">
          {listing.image ? (
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <span className="text-6xl opacity-50">🎓</span>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Category Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md"
              style={{
                backgroundColor: `${categoryColor}30`,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: `${categoryColor}60`,
                color: categoryColor,
              }}
            >
              {listing.category}
            </div>

            {/* Trending Badge */}
            {listing.totalPurchases > 200 && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 border border-amber-500/50 text-amber-400 backdrop-blur-md">
                <TrendingUp className="w-3 h-3" />
                Hot
              </div>
            )}
          </div>

          {/* Bottom Price Tag */}
          <div className="absolute bottom-3 left-3">
            <div className="inline-flex flex-col gap-0.5 px-3 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(listing.price, 0)}
                </span>
                <span className="text-sm font-medium text-indigo-400">FLOW</span>
              </div>
              <div className="text-xs text-slate-400">
                {formatUSDPrice(listing.priceUSD)}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-lg font-bold text-white line-clamp-2 mb-1 group-hover:text-indigo-400 transition-colors">
              {listing.title}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2">
              {listing.description}
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-sm">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white">{formatRating(listing.rating)}</span>
              <span className="text-slate-500">({formatNumber(listing.totalReviews)})</span>
            </div>

            {/* Purchases */}
            <div className="flex items-center gap-1.5 text-slate-400">
              <Zap className="w-4 h-4" />
              <span>{formatNumber(listing.totalPurchases)} sold</span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800/50">
            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
              {listing.seller.avatar ? (
                <Image
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-lg font-bold text-white">
                  {listing.seller.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Seller Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-white truncate">
                  {listing.seller.name}
                </span>
                {listing.seller.verified && (
                  <BadgeCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{formatRating(listing.seller.rating)}</span>
                <span>·</span>
                <span>{formatNumber(listing.seller.totalSales)} sales</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                font-semibold text-sm transition-all duration-200
                ${
                  inCart
                    ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
                }
              `}
            >
              <ShoppingCart className="w-4 h-4" />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${categoryColor}DD, ${categoryColor}99)`,
                color: '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor}, ${categoryColor}DD)`;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 8px 20px -8px ${categoryColor}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${categoryColor}DD, ${categoryColor}99)`;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Zap className="w-4 h-4" />
              Buy Now
            </button>
          </div>

          {/* Level & Duration Tags */}
          {(listing.level || listing.duration) && (
            <div className="flex gap-2 text-xs">
              {listing.level && (
                <span className="px-2.5 py-1 rounded-full bg-slate-800/50 text-slate-300 border border-slate-700/50">
                  {listing.level}
                </span>
              )}
              {listing.duration && (
                <span className="px-2.5 py-1 rounded-full bg-slate-800/50 text-slate-300 border border-slate-700/50">
                  ⏱ {listing.duration}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Neon Glow Effect on Hover */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${categoryColor}15, transparent 70%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};
