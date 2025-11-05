'use client';

/**
 * LearningPathFlow Component
 * Horizontal flow diagram showing learning journey progression
 * Connected milestone nodes with smooth scrolling
 */

import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PathNode } from './PathNode';
import type { Milestone } from '../../types/learning-path.types';

interface LearningPathFlowProps {
  milestones: Milestone[];
  selectedMilestone: Milestone | null;
  onMilestoneSelect: (milestone: Milestone) => void;
}

export function LearningPathFlow({
  milestones,
  selectedMilestone,
  onMilestoneSelect,
}: LearningPathFlowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  // Auto-scroll to active milestone
  useEffect(() => {
    if (selectedMilestone && scrollContainerRef.current) {
      const index = milestones.findIndex(m => m.id === selectedMilestone.id);
      if (index !== -1) {
        const nodeWidth = 180; // approximate width including spacing
        const scrollPosition = index * nodeWidth - (scrollContainerRef.current.clientWidth / 2) + (nodeWidth / 2);
        
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedMilestone, milestones]);

  return (
    <div className="relative">
      {/* Gradient Overlays for Scroll Indication */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#1E293B] border border-[#334155] hover:border-[#6366F1] flex items-center justify-center transition-all duration-200 group"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[#1E293B] border border-[#334155] hover:border-[#6366F1] flex items-center justify-center transition-all duration-200 group"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-[#6366F1]" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-visible scrollbar-hide py-8 px-12"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex items-start min-w-max">
          {milestones.map((milestone, index) => (
            <PathNode
              key={milestone.id}
              milestone={milestone}
              isActive={selectedMilestone?.id === milestone.id}
              isLast={index === milestones.length - 1}
              onClick={() => onMilestoneSelect(milestone)}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar Below Flow */}
      <div className="mt-4 px-12">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-2">
          <span>Overall Progress</span>
          <span className="font-semibold text-[#F8FAFC]">
            {Math.round(
              milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length
            )}%
          </span>
        </div>
        <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#22D3EE] transition-all duration-500 rounded-full"
            style={{
              width: `${milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
