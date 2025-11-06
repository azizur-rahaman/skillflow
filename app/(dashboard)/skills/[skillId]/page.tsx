/**
 * Skill Detail Page - Complete Implementation
 * 
 * Comprehensive skill detail page with hero banner, tabs,
 * evidence carousel, endorsements, and learning resources.
 */

'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Users,
  Briefcase,
  BookOpen,
  Star,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Play,
  FileText,
} from 'lucide-react';
import { SkillDetailProvider, useSkillDetail } from '@/features/skill-detail/context/SkillDetailContext';
import {
  SkillTab,
  EvidenceType,
  ResourceType,
  getProficiencyLabel,
  getProficiencyColor,
  getEvidenceTypeLabel,
  getTabLabel,
  formatDaysAgo,
} from '@/features/skill-detail/types/skill-detail.types';

const SkillDetailContent = () => {
  const { state, actions } = useSkillDetail();
  const {
    skill,
    evidence,
    endorsements,
    learningResources,
    growth,
    marketInsights,
    activeTab,
    carouselIndex,
  } = state;
  
  if (!skill) return null;
  
  const proficiencyColor = getProficiencyColor(skill.proficiencyLevel);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-slate-800/50">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-hero-reveal" />
          <div
            className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-hero-reveal"
            style={{ animationDelay: "0.2s" }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Skills</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold animate-hero-reveal"
                  style={{
                    background: `linear-gradient(135deg, ${proficiencyColor}40, ${proficiencyColor}20)`,
                    color: proficiencyColor,
                  }}
                >
                  {skill.name.substring(0, 2)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">
                      {skill.name}
                    </h1>
                    {skill.verified && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-400 mb-4">{skill.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strength indicator */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm text-slate-400">
                      Proficiency Level
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {getProficiencyLabel(skill.proficiencyLevel)}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span
                      className="text-4xl font-bold"
                      style={{ color: proficiencyColor }}
                    >
                      {skill.strength}%
                    </span>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400">
                        +{skill.trend.changePercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${skill.strength}%`,
                      background: `linear-gradient(90deg, ${proficiencyColor}40, ${proficiencyColor})`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">Projects</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {skill.stats.totalProjects}
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span className="text-xs text-slate-400">Hours</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {skill.stats.totalHours.toLocaleString()}
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Endorsements</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {skill.stats.endorsements}
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400">Certifications</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {skill.stats.certifications}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {Object.values(SkillTab).map((tab) => (
              <button
                key={tab}
                onClick={() => actions.setActiveTab(tab)}
                className={`
                  px-6 py-4 text-sm font-medium transition-all relative
                  ${
                    activeTab === tab
                      ? "text-cyan-400"
                      : "text-slate-400 hover:text-slate-300"
                  }
                `}
              >
                {getTabLabel(tab)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 animate-tab-switch" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === SkillTab.OVERVIEW && (
          <div className="space-y-8 animate-tab-switch">
            {/* Growth Chart */}
            {growth && (
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Growth Over Time
                </h2>
                <div className="h-64 flex items-end gap-2">
                  {growth.history.map((point, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full rounded-t transition-all duration-500 hover:opacity-80"
                        style={{
                          height: `${point.strength}%`,
                          background: `linear-gradient(180deg, ${proficiencyColor}, ${proficiencyColor}40)`,
                        }}
                      />
                      {index % 2 === 0 && (
                        <span className="text-xs text-slate-500">
                          {point.date.toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Skills */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Related Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skill.relatedSkills.map((relatedSkill) => (
                  <div
                    key={relatedSkill.id}
                    className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-white">
                        {relatedSkill.name}
                      </h3>
                      <p className="text-xs text-slate-400 capitalize">
                        {relatedSkill.relationship}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-cyan-400">
                        {relatedSkill.strength}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === SkillTab.EVIDENCE && (
          <div className="space-y-6 animate-tab-switch">
            {/* Carousel */}
            <div className="relative">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 overflow-hidden">
                <div className="animate-carousel-slide">
                  {evidence[carouselIndex] && (
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                            {evidence[carouselIndex].type ===
                              EvidenceType.PROJECT && (
                              <Briefcase className="w-6 h-6 text-cyan-400" />
                            )}
                            {evidence[carouselIndex].type ===
                              EvidenceType.CERTIFICATION && (
                              <Award className="w-6 h-6 text-amber-400" />
                            )}
                            {evidence[carouselIndex].type ===
                              EvidenceType.CONTRIBUTION && (
                              <Users className="w-6 h-6 text-violet-400" />
                            )}
                            {evidence[carouselIndex].type ===
                              EvidenceType.AWARD && (
                              <Star className="w-6 h-6 text-yellow-400" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">
                              {getEvidenceTypeLabel(
                                evidence[carouselIndex].type
                              )}
                            </span>
                            <h3 className="text-2xl font-bold text-white">
                              {evidence[carouselIndex].title}
                            </h3>
                          </div>
                        </div>
                        {evidence[carouselIndex].verified && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 rounded-full">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-400">
                              Verified
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-slate-300 mb-6">
                        {evidence[carouselIndex].description}
                      </p>

                      {evidence[carouselIndex].metadata.metrics && (
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {evidence[carouselIndex].metadata.metrics?.map(
                            (metric, index) => (
                              <div
                                key={index}
                                className="text-center p-4 bg-slate-800/50 rounded-lg"
                              >
                                <p className="text-2xl font-bold text-cyan-400">
                                  {metric.value}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {metric.label}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>
                          {evidence[carouselIndex].metadata.organization}
                        </span>
                        <span>
                          {formatDaysAgo(evidence[carouselIndex].date)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Carousel controls */}
              <button
                aria-label="left"
                onClick={actions.prevCarouselItem}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/50 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                aria-label="right"
                onClick={actions.nextCarouselItem}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/50 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>

              {/* Indicators */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {evidence.map((_, index) => (
                  <button
                    aria-label="indicator"
                    key={index}
                    onClick={() => actions.selectEvidence(evidence[index])}
                    className={`
                      w-2 h-2 rounded-full transition-all
                      ${
                        index === carouselIndex
                          ? "w-8 bg-cyan-400"
                          : "bg-slate-600"
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Evidence Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidence.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => actions.selectEvidence(item)}
                  className="flex items-start gap-4 p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-cyan-500/50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                    {item.type === EvidenceType.PROJECT && (
                      <Briefcase className="w-5 h-5 text-cyan-400" />
                    )}
                    {item.type === EvidenceType.CERTIFICATION && (
                      <Award className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {formatDaysAgo(item.date)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === SkillTab.ENDORSEMENTS && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-tab-switch">
            {endorsements.map((endorsement, index) => (
              <div
                key={endorsement.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 animate-endorsement-float"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold">
                    {endorsement.endorserName.substring(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">
                      {endorsement.endorserName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {endorsement.endorserRole}
                    </p>
                    <p className="text-xs text-slate-500">
                      {endorsement.endorserCompany}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: endorsement.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                {endorsement.testimonial && (
                  <p className="text-sm text-slate-300 italic mb-4">
                    &quot;{endorsement.testimonial}&quot;
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="capitalize">{endorsement.relationship}</span>
                  <span>{formatDaysAgo(endorsement.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === SkillTab.LEARNING && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-tab-switch">
            {learningResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {resource.type === ResourceType.COURSE && (
                        <Play className="w-4 h-4 text-cyan-400" />
                      )}
                      {resource.type === ResourceType.DOCUMENTATION && (
                        <FileText className="w-4 h-4 text-violet-400" />
                      )}
                      {resource.type === ResourceType.PROJECT && (
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className="text-xs text-slate-400 capitalize">
                        {resource.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {resource.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">
                      {resource.provider}
                    </p>
                  </div>
                  {resource.price === 0 ? (
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
                      Free
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      ${resource.price}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300 mb-4">
                  {resource.description}
                </p>

                <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                  <span>{resource.duration}</span>
                  <span>•</span>
                  <span className="capitalize">{resource.difficulty}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{resource.rating}</span>
                  </div>
                </div>

                {resource.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Progress</span>
                      <span className="text-xs text-cyan-400">
                        {resource.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500"
                        style={{ width: `${resource.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all text-white text-sm font-medium"
                >
                  {resource.progress !== undefined
                    ? "Continue"
                    : "Start Learning"}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function SkillDetailPage() {
  return (
    <SkillDetailProvider>
      <SkillDetailContent />
    </SkillDetailProvider>
  );
}
