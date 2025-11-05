'use client';

import React from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';

export default function EmptyState() {
  const { openAddExperience, openAddProject } = useExperience();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-full" />

        {/* Icon Container */}
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 flex items-center justify-center">
          <Briefcase className="w-16 h-16 text-white/40" strokeWidth={1.5} />

          {/* Floating Sparkles */}
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-cyan-400 animate-pulse" />
          <Sparkles className="absolute bottom-6 left-2 w-4 h-4 text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute top-8 left-6 w-5 h-5 text-indigo-400 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-2xl font-bold text-white/90 mb-3">
        Build Your Professional Timeline
      </h3>
      <p className="text-white/60 max-w-md mb-8">
        Start showcasing your experience and projects. Add your work history, achievements, and
        portfolio to stand out.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={openAddExperience}
          className="
            px-6 py-3 rounded-xl
            bg-gradient-to-r from-indigo-500 to-purple-500
            hover:from-indigo-600 hover:to-purple-600
            text-white font-medium
            shadow-lg shadow-indigo-500/25
            hover:shadow-indigo-500/40
            transition-all duration-200
            hover:scale-105
            flex items-center gap-2
          "
        >
          <Briefcase className="w-5 h-5" />
          Add Work Experience
        </button>

        <button
          onClick={openAddProject}
          className="
            px-6 py-3 rounded-xl
            bg-white/5 border border-white/10
            hover:bg-white/10 hover:border-purple-500/30
            text-white/80 hover:text-white
            font-medium
            transition-all duration-200
            hover:scale-105
            flex items-center gap-2
          "
        >
          <Sparkles className="w-5 h-5" />
          Add Project
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-white/40 mt-8 max-w-sm">
        💡 <span className="font-medium">Tip:</span> Include measurable achievements and relevant
        skills to boost your profile visibility
      </p>
    </div>
  );
}
