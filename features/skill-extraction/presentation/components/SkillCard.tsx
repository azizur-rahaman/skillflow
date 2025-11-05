'use client';

import React from 'react';
import { Edit2, Trash2, Check, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import type { SkillCardProps } from '../../types/skill-extraction.types';
import { VerificationStatus, ExtractionSource } from '../../types/skill-extraction.types';
import { ConfidenceMeter } from './ConfidenceMeter';

export function SkillCard({
  skill,
  isSelected = false,
  onSelect,
  onEdit,
  onRemove,
  onVerify,
  onReject,
  showActions = true,
}: SkillCardProps) {
  // Source icons mapping
  const getSourceIcon = (source: ExtractionSource) => {
    switch (source) {
      case ExtractionSource.RESUME:
        return '📄';
      case ExtractionSource.LINKEDIN:
        return '💼';
      case ExtractionSource.GITHUB:
        return '⚡';
      case ExtractionSource.UPWORK:
        return '🎯';
      case ExtractionSource.PORTFOLIO:
        return '🌐';
      case ExtractionSource.MANUAL:
        return '✏️';
      default:
        return '📋';
    }
  };

  // Verification status badge
  const renderVerificationBadge = () => {
    switch (skill.verificationStatus) {
      case VerificationStatus.VERIFIED:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#10B981]/20 to-[#10B981]/10 border border-[#10B981]/30 backdrop-blur-sm animate-badge-shimmer">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-xs font-medium text-[#10B981]">AI Verified</span>
          </div>
        );
      case VerificationStatus.PENDING:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/10 border border-[#F59E0B]/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-xs font-medium text-[#F59E0B]">Pending</span>
          </div>
        );
      case VerificationStatus.MANUAL_REVIEW:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#A855F7]/20 to-[#A855F7]/10 border border-[#A855F7]/30 backdrop-blur-sm">
            <AlertCircle className="w-3.5 h-3.5 text-[#A855F7]" />
            <span className="text-xs font-medium text-[#A855F7]">Review</span>
          </div>
        );
      case VerificationStatus.REJECTED:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#EF4444]/20 to-[#EF4444]/10 border border-[#EF4444]/30 backdrop-blur-sm">
            <X className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-xs font-medium text-[#EF4444]">Rejected</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`
        group relative bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 
        rounded-2xl border transition-all duration-300
        ${isSelected 
          ? 'border-[#6366F1] shadow-lg shadow-[#6366F1]/20' 
          : 'border-[#334155] hover:border-[#6366F1]/50'
        }
        hover:shadow-xl hover:shadow-[#6366F1]/10 hover:-translate-y-1
        animate-skill-card-appear cursor-pointer
        backdrop-blur-sm
      `}
      onClick={onSelect}
    >
      {/* Selection indicator */}
      {onSelect && (
        <div
          className={`
            absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all duration-200
            ${isSelected 
              ? 'bg-[#6366F1] border-[#6366F1]' 
              : 'border-[#475569] group-hover:border-[#6366F1]/50'
            }
          `}
        >
          {isSelected && <Check className="w-3 h-3 text-white m-auto mt-0.5" />}
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-1">
              {skill.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#334155]/50 text-[#CBD5E1] font-medium">
                {skill.category.replace('_', ' ')}
              </span>
              {skill.yearsOfExperience && (
                <span className="text-xs text-[#94A3B8]">
                  {skill.yearsOfExperience}+ years
                </span>
              )}
              {skill.proficiencyLevel && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-gradient-to-r from-[#6366F1]/20 to-[#A855F7]/20 text-[#22D3EE] font-medium capitalize">
                  {skill.proficiencyLevel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="flex items-center justify-center mb-4 py-2">
          <ConfidenceMeter 
            confidence={skill.confidence} 
            size="medium" 
            showLabel={true}
            animated={true}
          />
        </div>

        {/* Verification Badge */}
        <div className="flex justify-center mb-4">
          {renderVerificationBadge()}
        </div>

        {/* Sources */}
        <div className="mb-4">
          <div className="text-xs text-[#94A3B8] mb-2">Extracted from:</div>
          <div className="flex items-center gap-2 flex-wrap">
            {skill.sources.map((source, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F172A]/60 border border-[#334155]/50"
              >
                <span className="text-sm">{getSourceIcon(source)}</span>
                <span className="text-xs text-[#CBD5E1] capitalize">
                  {source.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Context */}
        {skill.evidence.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-[#0F172A]/40 border border-[#334155]/30">
            <div className="text-xs text-[#94A3B8] mb-1">Evidence:</div>
            <p className="text-xs text-[#CBD5E1] line-clamp-2 italic">
              "{skill.evidence[0].context}"
            </p>
            <div className="text-xs text-[#64748B] mt-1">
              — {skill.evidence[0].location}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-[#6366F1]/10 to-[#A855F7]/10 border border-[#6366F1]/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span className="text-xs font-medium text-[#22D3EE]">
              AI Analysis ({skill.aiAnalysis.model})
            </span>
          </div>
          <p className="text-xs text-[#CBD5E1] line-clamp-2">
            {skill.aiAnalysis.reasoning}
          </p>
          <div className="text-xs text-[#64748B] mt-1">
            Processing: {skill.aiAnalysis.processingTime}ms
          </div>
        </div>

        {/* Endorsements */}
        {skill.isEndorsed && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[...Array(Math.min(3, skill.endorsementCount))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] border-2 border-[#1E293B] flex items-center justify-center"
                >
                  <span className="text-xs text-white font-semibold">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-xs text-[#94A3B8]">
              {skill.endorsementCount} endorsement{skill.endorsementCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {skill.verificationStatus === VerificationStatus.PENDING && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerify?.();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#10B981]/80 hover:from-[#10B981]/90 hover:to-[#10B981]/70 text-white text-xs font-medium transition-all duration-200"
                >
                  <Check className="w-3.5 h-3.5" />
                  Verify
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject?.();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#EF4444] to-[#EF4444]/80 hover:from-[#EF4444]/90 hover:to-[#EF4444]/70 text-white text-xs font-medium transition-all duration-200"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#6366F1]/50 hover:bg-[#6366F1]/10 text-[#6366F1] text-xs font-medium transition-all duration-200"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[#EF4444]/50 hover:bg-[#EF4444]/10 text-[#EF4444] text-xs font-medium transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6366F1]/0 to-[#A855F7]/0 group-hover:from-[#6366F1]/5 group-hover:to-[#A855F7]/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
}
