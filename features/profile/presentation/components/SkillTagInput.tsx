'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export default function SkillTagInput() {
  const { state, addSkill, removeSkill, acceptSuggestedSkill, dismissSuggestedSkill } = useProfile();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const profile = state.profile;
  const skills = profile?.skills || [];
  const suggestedSkills = profile?.suggestedSkills || [];

  const handleAddSkill = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue.length > 0) {
      addSkill(trimmedValue);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim().length > 0) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleAcceptSuggestion = (skill: string) => {
    acceptSuggestedSkill(skill);
    // Trigger animation
    setTimeout(() => {
      const element = document.querySelector(`[data-skill="${skill}"]`);
      element?.classList.add('animate-tag-pop');
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Current Skills */}
      <div>
        <label className="text-sm font-medium text-white/80 mb-3 block">
          Your Skills
          <span className="ml-2 text-xs text-white/40">
            ({skills.length} {skills.length === 1 ? 'skill' : 'skills'})
          </span>
        </label>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[48px] p-3 rounded-xl bg-white/5 border border-white/10">
          {skills.length === 0 ? (
            <p className="text-white/40 text-sm italic">Add your skills below</p>
          ) : (
            skills.map((skill) => (
              <div
                key={skill}
                data-skill={skill}
                className="
                  group
                  px-3 py-1.5 rounded-lg
                  bg-gradient-to-r from-indigo-500/20 to-purple-500/20
                  border border-indigo-500/30
                  flex items-center gap-2
                  transition-all duration-200
                  hover:from-indigo-500/30 hover:to-purple-500/30
                  hover:border-indigo-400/50
                  animate-tag-pop
                "
              >
                <span className="text-sm font-medium text-white/90">{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="
                    text-white/40 hover:text-red-400
                    transition-colors duration-200
                    opacity-0 group-hover:opacity-100
                  "
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Skill Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Type a skill (e.g., React, Python, UX Design)"
            className="
              flex-1 px-4 py-2.5 rounded-xl
              bg-white/5 border border-white/10
              text-white placeholder-white/40 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              transition-all duration-200
            "
          />
          <button
            onClick={handleAddSkill}
            disabled={inputValue.trim().length === 0}
            className="
              px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-indigo-500 to-purple-500
              hover:from-indigo-600 hover:to-purple-600
              text-white text-sm font-medium
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
              shadow-lg shadow-indigo-500/25
              hover:shadow-indigo-500/40
            "
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Suggested Skills */}
      {suggestedSkills.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <label className="text-sm font-medium text-white/80">
              Suggested Skills
            </label>
            <span className="text-xs text-white/40">
              Based on your profile
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill) => (
              <div
                key={skill}
                className="
                  group
                  px-3 py-1.5 rounded-lg
                  bg-cyan-500/10 border border-cyan-500/30
                  flex items-center gap-2
                  transition-all duration-200
                  hover:bg-cyan-500/20 hover:border-cyan-400/50
                "
              >
                <span className="text-sm font-medium text-cyan-300">{skill}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleAcceptSuggestion(skill)}
                    className="
                      text-green-400 hover:text-green-300
                      transition-colors duration-200
                    "
                    aria-label={`Add ${skill}`}
                    title="Add skill"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => dismissSuggestedSkill(skill)}
                    className="
                      text-white/40 hover:text-red-400
                      transition-colors duration-200
                    "
                    aria-label={`Dismiss ${skill}`}
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/40 italic">
            💡 Hover over a suggested skill to add or dismiss it
          </p>
        </div>
      )}

      {/* Skill Guidelines */}
      {skills.length < 3 && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-300/90">
            <span className="font-semibold">Tip:</span> Add at least 3 skills to help us provide better recommendations
          </p>
        </div>
      )}
    </div>
  );
}
