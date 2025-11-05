'use client';

import React, { useState } from 'react';
import { Plus, Briefcase, Award } from 'lucide-react';
import { useExperience } from '../../context/ExperienceContext';

export default function FloatingAddButton() {
  const { openAddExperience, openAddProject } = useExperience();
  const [showMenu, setShowMenu] = useState(false);
  const [isRippling, setIsRippling] = useState(false);

  const handleClick = () => {
    setShowMenu(!showMenu);
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 600);
  };

  const handleAddExperience = () => {
    openAddExperience();
    setShowMenu(false);
  };

  const handleAddProject = () => {
    openAddProject();
    setShowMenu(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      {/* Menu Options */}
      {showMenu && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2 animate-fade-in">
          <button
            onClick={handleAddExperience}
            className="
              group
              flex items-center gap-3 px-4 py-3 rounded-xl
              bg-gradient-to-r from-indigo-500 to-purple-500
              hover:from-indigo-600 hover:to-purple-600
              text-white font-medium
              shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
              transition-all duration-200
              hover:scale-105
              whitespace-nowrap
            "
          >
            <Briefcase className="w-5 h-5" />
            <span>Add Experience</span>
          </button>

          <button
            onClick={handleAddProject}
            className="
              group
              flex items-center gap-3 px-4 py-3 rounded-xl
              bg-gradient-to-r from-purple-500 to-pink-500
              hover:from-purple-600 hover:to-pink-600
              text-white font-medium
              shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
              transition-all duration-200
              hover:scale-105
              whitespace-nowrap
            "
          >
            <Award className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleClick}
        className={`
          relative
          w-16 h-16 rounded-full
          bg-gradient-to-r from-indigo-500 to-purple-500
          hover:from-indigo-600 hover:to-purple-600
          text-white
          shadow-2xl shadow-indigo-500/50
          hover:shadow-indigo-500/70
          transition-all duration-300
          hover:scale-110
          flex items-center justify-center
          overflow-hidden
          ${showMenu ? 'rotate-45' : ''}
        `}
        aria-label="Add item"
      >
        {/* Ripple Effect */}
        {isRippling && (
          <span className="absolute inset-0 bg-white/30 rounded-full animate-fab-ripple" />
        )}

        <Plus className="w-8 h-8 relative z-10 transition-transform duration-300" />

        {/* Rotating Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 hover:opacity-100 transition-opacity duration-500 animate-spin-slow" />
      </button>

      {/* Glow Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 blur-xl -z-10 animate-pulse" />
    </div>
  );
}
