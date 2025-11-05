'use client';

import React from 'react';
import { User, Briefcase, MapPin, FileText } from 'lucide-react';
import { ProfileProvider, useProfile } from '@/features/profile/context/ProfileContext';
import AvatarUpload from '@/features/profile/presentation/components/AvatarUpload';
import EditableField from '@/features/profile/presentation/components/EditableField';
import SkillTagInput from '@/features/profile/presentation/components/SkillTagInput';
import ProfileCompletionMeter from '@/features/profile/presentation/components/ProfileCompletionMeter';

function ProfileContent() {
  const { state } = useProfile();
  const profile = state.profile;

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white/90">Your Profile</h1>
            <p className="text-white/60 mt-1">Manage your identity and skills</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Completion */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm">
              <AvatarUpload />
              
              {/* Display Name */}
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-white/90">
                  {profile.displayName}
                </h2>
                {profile.title && (
                  <p className="text-sm text-white/60 mt-1">{profile.title}</p>
                )}
                {profile.location && (
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <MapPin className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/60">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Completion Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm">
              <ProfileCompletionMeter />
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90">Basic Information</h3>
                  <p className="text-sm text-white/60">Your professional identity</p>
                </div>
              </div>

              <div className="space-y-5">
                <EditableField
                  field="title"
                  label="Job Title"
                  placeholder="e.g., Senior Software Engineer"
                  value={profile.title}
                  icon={<Briefcase className="w-4 h-4" />}
                  maxLength={100}
                  required
                />

                <EditableField
                  field="location"
                  label="Location"
                  placeholder="e.g., San Francisco, CA"
                  value={profile.location}
                  icon={<MapPin className="w-4 h-4" />}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Bio Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90">Professional Summary</h3>
                  <p className="text-sm text-white/60">Tell us about yourself</p>
                </div>
              </div>

              <EditableField
                field="bio"
                label="Bio"
                placeholder="Write a brief summary about your experience, expertise, and career goals (min 50 characters)"
                value={profile.bio}
                multiline
                maxLength={500}
                required
              />

              {profile.bio.length > 0 && profile.bio.length < 50 && (
                <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-300/90">
                    Add {50 - profile.bio.length} more characters to complete this section
                  </p>
                </div>
              )}
            </div>

            {/* Skills Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90">Skills & Expertise</h3>
                  <p className="text-sm text-white/60">Showcase your abilities</p>
                </div>
              </div>

              <SkillTagInput />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/40">
            Last updated: {new Date(profile.updatedAt).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/60">Auto-saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
}
