/**
 * Profile Header Component
 * 
 * Hero section displaying candidate's core information, avatar,
 * verification status, contact details, and resume download CTA.
 */

'use client';

import { CandidateProfile, getAvailabilityColor, getAvailabilityLabel } from '@/features/candidate-profile/types/profile.types';
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Globe, 
  MapPin, 
  Clock, 
  Download,
  Check,
  Star,
  TrendingUp,
  Award,
  Verified
} from 'lucide-react';

interface ProfileHeaderProps {
  profile: CandidateProfile;
  onDownloadResume?: () => void;
  onContact?: () => void;
}

export const ProfileHeader = ({ profile, onDownloadResume, onContact }: ProfileHeaderProps) => {
  const { personalInfo, professionalSummary, profileMetrics, skillDNA } = profile;
  const availabilityColor = getAvailabilityColor(professionalSummary.availability);
  const availabilityLabel = getAvailabilityLabel(professionalSummary.availability);
  
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left: Avatar & Basic Info */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full opacity-75 blur group-hover:opacity-100 transition" />
              <div className="relative w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800">
                {personalInfo.avatarUrl ? (
                  <img 
                    src={personalInfo.avatarUrl} 
                    alt={personalInfo.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <span className="text-4xl font-bold text-white">
                      {personalInfo.firstName[0]}{personalInfo.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Verification Badge */}
              {skillDNA.verifiedSkills > 0 && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center border-4 border-slate-900 shadow-lg">
                  <Verified className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-3 mt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{skillDNA.totalSkills}</div>
                <div className="text-xs text-slate-400">Skills</div>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Math.round(skillDNA.overallConfidence)}</div>
                <div className="text-xs text-slate-400">Confidence</div>
              </div>
              <div className="w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{professionalSummary.yearsOfExperience}</div>
                <div className="text-xs text-slate-400">Years Exp</div>
              </div>
            </div>
          </div>
          
          {/* Center: Profile Details */}
          <div className="flex-1 space-y-4">
            {/* Name & Title */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">
                  {personalInfo.fullName}
                </h1>
                
                {/* Availability Badge */}
                <div 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${availabilityColor}20`,
                    color: availabilityColor,
                    border: `1px solid ${availabilityColor}40`
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse" 
                    style={{ backgroundColor: availabilityColor }}
                  />
                  {availabilityLabel}
                </div>
              </div>
              
              <p className="text-xl text-indigo-400 font-medium mb-2">
                {personalInfo.title}
              </p>
              
              {professionalSummary.currentCompany && (
                <p className="text-slate-400">
                  {professionalSummary.currentRole} at {professionalSummary.currentCompany}
                </p>
              )}
            </div>
            
            {/* Headline/Bio */}
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
              {professionalSummary.headline}
            </p>
            
            {/* Location & Contact */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {personalInfo.location.city}, {personalInfo.location.country}
                  {personalInfo.location.isRemote && (
                    <span className="ml-2 text-cyan-400">• Remote Available</span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{personalInfo.location.timezone}</span>
              </div>
              
              {profileMetrics.averageResponseTime && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Responds in {profileMetrics.averageResponseTime}</span>
                </div>
              )}
            </div>
            
            {/* Contact Links */}
            <div className="flex flex-wrap gap-3">
              {personalInfo.contact.email && (
                <a
                  href={`mailto:${personalInfo.contact.email}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white transition-all text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Email</span>
                </a>
              )}
              
              {personalInfo.contact.phone && (
                <a
                  href={`tel:${personalInfo.contact.phone}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white transition-all text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call</span>
                </a>
              )}
              
              {personalInfo.contact.linkedIn && (
                <a
                  href={personalInfo.contact.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white transition-all text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
              )}
              
              {personalInfo.contact.github && (
                <a
                  href={personalInfo.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white transition-all text-sm"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              
              {personalInfo.contact.portfolio && (
                <a
                  href={personalInfo.contact.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white transition-all text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Portfolio</span>
                </a>
              )}
            </div>
            
            {/* Verification Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {skillDNA.verifiedSkills > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {skillDNA.verifiedSkills} Verified Skills
                </div>
              )}
              
              {profile.blockchainCredentials.length > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium">
                  <Award className="w-3.5 h-3.5" />
                  {profile.blockchainCredentials.length} Blockchain Credentials
                </div>
              )}
              
              {profile.endorsements.length >= 10 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
                  <Star className="w-3.5 h-3.5" />
                  {profile.endorsements.length} Endorsements
                </div>
              )}
            </div>
          </div>
          
          {/* Right: CTA Buttons */}
          <div className="flex flex-col gap-3 lg:min-w-[200px]">
            <button
              onClick={onContact}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:brightness-110 transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Candidate
            </button>
            
            <button
              onClick={onDownloadResume}
              className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white font-semibold hover:border-indigo-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Resume
            </button>
            
            {/* Profile Metrics Card */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Profile Activity
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Profile Views</span>
                  <span className="text-sm font-semibold text-white">
                    {profileMetrics.profileViews.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">This Week</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    +{profileMetrics.profileViewsThisWeek}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Response Rate</span>
                  <span className="text-sm font-semibold text-cyan-400">
                    {profileMetrics.responseRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
