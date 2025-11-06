'use client';

/**
 * Sort Dropdown Component
 * 
 * Sort options dropdown with selected state.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check } from 'lucide-react';
import { SortDropdownProps, SortOption } from '../../types/marketplace.types';

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  options = Object.values(SortOption),
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white font-medium text-sm hover:bg-slate-800 hover:border-slate-600 transition-all"
      >
        <ArrowUpDown className="w-4 h-4 text-indigo-400" />
        <span className="hidden sm:inline">{value}</span>
        <span className="sm:hidden">Sort</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-10">
          <div className="p-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">
              Sort By
            </div>
            {options.map((option) => {
              const isSelected = value === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all
                    ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }
                  `}
                >
                  <span>{option}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
