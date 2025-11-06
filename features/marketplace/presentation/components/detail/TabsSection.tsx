'use client';

/**
 * TabsSection Component
 * 
 * Tabs for Description, Reviews, and Issuer Credentials with content panels.
 */

import React from 'react';
import { Star, CheckCircle, MapPin, Globe, Mail, Award, ExternalLink, ThumbsUp } from 'lucide-react';
import { TabsSectionProps, MarketplaceDetailTab } from '../../../types/marketplace-detail.types';
import { formatRelativeTime, formatRatingPercentage, getVerificationLevelColor } from '../../../types/marketplace-detail.types';

export const TabsSection: React.FC<TabsSectionProps> = ({ skill, activeTab, onTabChange }) => {
  const tabs = [
    { id: MarketplaceDetailTab.Description, label: 'Description', icon: '📄' },
    { id: MarketplaceDetailTab.Reviews, label: 'Reviews', count: skill.totalReviews, icon: '⭐' },
    { id: MarketplaceDetailTab.Issuer, label: 'Issuer', icon: '🏛️' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-4 font-semibold transition-all ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count && (
                <span className="px-2 py-0.5 bg-slate-800 rounded-full text-xs text-slate-400">
                  {tab.count}
                </span>
              )}
            </div>
            
            {/* Active Indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Description Tab */}
        {activeTab === MarketplaceDetailTab.Description && (
          <div className="space-y-8">
            {/* Full Description */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">About This Credential</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {skill.fullDescription}
                </p>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">What You'll Learn</h3>
              <div className="grid gap-3">
                {skill.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Prerequisites</h3>
              <div className="grid gap-3">
                {skill.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-slate-900/30 rounded-xl border border-slate-800/50">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-indigo-400">{index + 1}</span>
                    </div>
                    <p className="text-slate-300">{prereq}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Skills */}
            {skill.relatedSkills && skill.relatedSkills.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Related Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {skill.relatedSkills.map((related) => (
                    <div
                      key={related.id}
                      className="group bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-all cursor-pointer"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                          {related.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">{related.price} FLOW</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-slate-400">{related.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === MarketplaceDetailTab.Reviews && (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Overall Rating */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">
                      {skill.reviewStats.averageRating.toFixed(1)}
                    </span>
                    <div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(skill.reviewStats.averageRating)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {skill.reviewStats.totalReviews} reviews
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-400">
                    {skill.reviewStats.verifiedPurchaseCount} verified purchases
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = skill.reviewStats.distribution[stars as keyof typeof skill.reviewStats.distribution];
                    const percentage = formatRatingPercentage(count, skill.reviewStats.totalReviews);
                    
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm text-slate-400 w-8">{stars}★</span>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                            style={{ width: percentage }}
                          />
                        </div>
                        <span className="text-sm text-slate-400 w-12 text-right">{percentage}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-4">
              {skill.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-slate-900/30 rounded-xl border border-slate-800 p-6 space-y-4"
                >
                  {/* Reviewer Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {review.userAvatar && (
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{review.userName}</span>
                          {review.verified && (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                          {review.userBadge && (
                            <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/50 rounded text-xs text-indigo-400">
                              {review.userBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">
                          {review.userLevel} · {formatRelativeTime(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div>
                    <h4 className="font-semibold text-white mb-2">{review.title}</h4>
                    <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                  </div>

                  {/* Helpful Button */}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
                    <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issuer Tab */}
        {activeTab === MarketplaceDetailTab.Issuer && (
          <div className="space-y-6">
            {/* Issuer Header */}
            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <img
                  src={skill.issuer.logo}
                  alt={skill.issuer.organizationName}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-slate-700"
                />
                
                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">
                        {skill.issuer.organizationName}
                      </h2>
                      {skill.issuer.verified && (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      )}
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: `${getVerificationLevelColor(skill.issuer.verificationLevel)}20`,
                          color: getVerificationLevelColor(skill.issuer.verificationLevel),
                        }}
                      >
                        {skill.issuer.verificationLevel}
                      </span>
                    </div>
                    <p className="text-slate-300">{skill.issuer.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {skill.issuer.totalCredentialsIssued.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">Credentials Issued</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{skill.issuer.rating.toFixed(1)}⭐</p>
                      <p className="text-sm text-slate-400">Issuer Rating</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {skill.issuer.followers.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {new Date().getFullYear() - skill.issuer.establishedYear}+ years
                      </p>
                      <p className="text-sm text-slate-400">In Business</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex flex-wrap gap-4">
                    {skill.issuer.website && (
                      <a
                        href={skill.issuer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {skill.issuer.email && (
                      <a
                        href={`mailto:${skill.issuer.email}`}
                        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </a>
                    )}
                    {skill.issuer.location && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span>{skill.issuer.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Accreditations */}
            {skill.issuer.accreditations && skill.issuer.accreditations.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Accreditations & Certifications</h3>
                <div className="grid gap-4">
                  {skill.issuer.accreditations.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-start gap-4 p-6 bg-slate-900/30 rounded-xl border border-slate-800"
                    >
                      {acc.logo && (
                        <img
                          src={acc.logo}
                          alt={acc.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-white mb-1">{acc.name}</h4>
                            <p className="text-sm text-slate-400">Issued by {acc.issuedBy}</p>
                          </div>
                          <Award className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Issued: {acc.issuedDate.toLocaleDateString()}</span>
                          {acc.expiryDate && (
                            <span>Expires: {acc.expiryDate.toLocaleDateString()}</span>
                          )}
                          {acc.verificationUrl && (
                            <a
                              href={acc.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              <span>Verify</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
