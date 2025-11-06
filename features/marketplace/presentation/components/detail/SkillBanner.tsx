'use client';

/**
 * SkillBanner Component
 * 
 * Large hero banner with skill graphic, gradient overlay, category badge, and title.
 */

import React from 'react';
import { ArrowLeft, Play, ExternalLink } from 'lucide-react';
import { SkillBannerProps } from '../../../types/marketplace-detail.types';
import { getCategoryColor } from '../../../types/marketplace.types';

export const SkillBanner: React.FC<SkillBannerProps> = ({ skill, onBack }) => {
  const categoryColor = getCategoryColor(skill.category);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={skill.image}
          alt={skill.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      
      {/* Animated Neon Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${categoryColor}20, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
        {/* Top Bar */}
        <div className="flex items-start justify-between">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl hover:bg-slate-800/90 hover:border-slate-600 transition-all group/btn"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400 group-hover/btn:text-cyan-400 transition-colors" />
              <span className="text-sm font-medium text-slate-300 group-hover/btn:text-white transition-colors">
                Back to Marketplace
              </span>
            </button>
          )}

          {/* Category Badge */}
          <div
            className="px-4 py-2 rounded-xl backdrop-blur-md border shadow-lg"
            style={{
              background: `${categoryColor}20`,
              borderColor: `${categoryColor}60`,
              boxShadow: `0 0 20px ${categoryColor}30`,
            }}
          >
            <span className="text-sm font-semibold" style={{ color: categoryColor }}>
              {skill.category}
            </span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {skill.tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg text-xs font-medium text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title and Description */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {skill.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl line-clamp-2">
              {skill.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {/* Issuer */}
            <div className="flex items-center gap-3">
              <img
                src={skill.issuer.logo}
                alt={skill.issuer.organizationName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
              />
              <div>
                <p className="text-sm font-medium text-white">
                  {skill.issuer.organizationName}
                </p>
                <p className="text-xs text-slate-400">Issuer</p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-700" />

            {/* Rating */}
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-white">{skill.rating.toFixed(1)}</span>
                <span className="text-amber-400">⭐</span>
              </div>
              <p className="text-xs text-slate-400">{skill.totalReviews} reviews</p>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-700" />

            {/* Purchases */}
            <div>
              <p className="text-lg font-bold text-white">{skill.totalPurchases}</p>
              <p className="text-xs text-slate-400">learners</p>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-slate-700" />

            {/* Level */}
            <div>
              <p className="text-sm font-semibold text-cyan-400">{skill.level}</p>
              <p className="text-xs text-slate-400">Level</p>
            </div>

            {/* Video Preview (if available) */}
            {skill.videoUrl && (
              <>
                <div className="w-px h-8 bg-slate-700" />
                <button
                  onClick={() => window.open(skill.videoUrl, '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-500/50 rounded-xl hover:bg-indigo-500/30 hover:border-indigo-400 transition-all group/play"
                >
                  <Play className="w-4 h-4 text-indigo-400 group-hover/play:text-indigo-300 transition-colors" />
                  <span className="text-sm font-medium text-indigo-300 group-hover/play:text-white transition-colors">
                    Preview
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Token ID Badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-full">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Token ID:</span>
          <code className="text-xs font-mono font-semibold text-cyan-400">{skill.tokenId}</code>
          <button
            onClick={() => navigator.clipboard.writeText(skill.tokenId)}
            className="text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
