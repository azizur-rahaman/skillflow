/**
 * Talent Card Component
 * 
 * Displays individual talent profile card with avatar, skills,
 * confidence score, and call-to-action button.
 */

'use client';

import { TalentProfile, getAvailabilityColor, getAvailabilityLabel } from '../../types/talent-search.types';
import { MapPin, Briefcase, Award, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

interface TalentCardProps {
  talent: TalentProfile;
  onViewProfile: (talentId: string) => void;
}

export const TalentCard = ({ talent, onViewProfile }: TalentCardProps) => {
  const availabilityColor = getAvailabilityColor(talent.availability);
  const availabilityLabel = getAvailabilityLabel(talent.availability);
  
  // Confidence color gradient
  const getConfidenceColor = (score: number): string => {
    if (score >= 85) return 'from-emerald-500 to-green-400';
    if (score >= 70) return 'from-cyan-500 to-blue-400';
    if (score >= 50) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };
  
  const confidenceGradient = getConfidenceColor(talent.confidenceScore);
  
  return (
    <div className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5 hover:border-indigo-700 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
      {/* Header: Avatar + Name + Verification */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-indigo-500 transition-all">
            <img
              src={talent.avatar}
              alt={talent.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Verification Badge */}
          {talent.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            </div>
          )}
        </div>
        
        {/* Name & Title */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
            {talent.name}
          </h3>
          <p className="text-sm text-slate-400 truncate">
            {talent.title}
          </p>
          
          {/* Location */}
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
            <MapPin className="w-3 h-3" />
            <span>{talent.location.city}, {talent.location.country}</span>
            {talent.location.remote && (
              <span className="ml-1 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Remote
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Experience & Availability */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Briefcase className="w-3.5 h-3.5" />
          <span>{talent.experience.totalYears} years</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: availabilityColor }}
          />
          <span className="text-slate-400">{availabilityLabel}</span>
        </div>
      </div>
      
      {/* Confidence Meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Confidence Score</span>
          <span className={`text-sm font-bold bg-gradient-to-r ${confidenceGradient} bg-clip-text text-transparent`}>
            {talent.confidenceScore}%
          </span>
        </div>
        
        <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${confidenceGradient} transition-all duration-500`}
            style={{ width: `${talent.confidenceScore}%` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${confidenceGradient} opacity-50 blur-sm`} />
          </div>
        </div>
      </div>
      
      {/* Top Skills */}
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-medium text-slate-400">Top Skills</span>
          {talent.skills.some(s => s.trending) && (
            <TrendingUp className="w-3 h-3 text-emerald-400" />
          )}
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {talent.topSkills.slice(0, 6).map((skill) => (
            <div
              key={skill.id}
              className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                skill.trending
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700'
              }`}
            >
              {skill.name}
              {skill.trending && <span className="ml-1">📈</span>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-700/50">
        {talent.endorsementCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{talent.endorsementCount} endorsements</span>
          </div>
        )}
        
        {talent.certificationsCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>{talent.certificationsCount} certs</span>
          </div>
        )}
      </div>
      
      {/* CTA Button */}
      <button
        onClick={() => onViewProfile(talent.id)}
        className="w-full px-4 py-2.5 rounded-lg bg-indigo-500 text-white font-medium hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
      >
        <span>View Profile</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-200 pointer-events-none" />
    </div>
  );
};
