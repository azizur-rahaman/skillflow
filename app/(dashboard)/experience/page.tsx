'use client';

import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { ExperienceProvider, useExperience } from '@/features/experience/context/ExperienceContext';
import TimelineCard from '@/features/experience/presentation/components/TimelineCard';
import ExperienceModal from '@/features/experience/presentation/components/ExperienceModal';
import FloatingAddButton from '@/features/experience/presentation/components/FloatingAddButton';
import EmptyState from '@/features/experience/presentation/components/EmptyState';
import type { ExperienceType } from '@/features/experience/types/experience.types';

function ExperienceContent() {
  const { state, buildTimeline, setFilter } = useExperience();

  const timeline = buildTimeline();
  const hasItems = state.experiences.length > 0 || state.projects.length > 0;

  const filters: Array<{ value: ExperienceType | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'work', label: 'Work' },
    { value: 'project', label: 'Projects' },
    { value: 'education', label: 'Education' },
    { value: 'volunteer', label: 'Volunteer' },
  ];

  // Filter timeline based on selected filter
  const filteredTimeline = state.selectedFilter === 'all'
    ? timeline
    : timeline.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.type === state.selectedFilter),
      })).filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white/90">Experience & Projects</h1>
            <p className="text-white/60 mt-1">Your professional journey and achievements</p>
          </div>

          {hasItems && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar className="w-4 h-4" />
              <span>
                {state.experiences.length + state.projects.length} {state.experiences.length + state.projects.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          )}
        </div>

        {/* Filters */}
        {hasItems && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 text-white/60 shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <div className="flex gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFilter(filter.value)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    whitespace-nowrap
                    ${
                      state.selectedFilter === filter.value
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {!hasItems ? (
          <EmptyState />
        ) : filteredTimeline.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/60">No items match the selected filter</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredTimeline.map((group) => (
              <div key={group.year} className="space-y-4">
                {/* Year Header */}
                <div className="sticky top-0 z-10 flex items-center gap-4 py-3">
                  <div className="
                    px-4 py-2 rounded-xl
                    bg-gradient-to-r from-[#1E293B] to-[#1E293B]/80
                    border border-white/10
                    backdrop-blur-sm
                  ">
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      {group.year}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                </div>

                {/* Timeline Cards */}
                <div className="space-y-6 relative pl-6">
                  {/* Vertical Timeline Line */}
                  <div className="absolute left-[30px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-transparent" />

                  {group.items.map((item, index) => (
                    <TimelineCard key={item.id} item={item} index={index} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Spacing for FAB */}
        <div className="h-20" />
      </div>

      {/* Floating Add Button */}
      <FloatingAddButton />

      {/* Modal */}
      <ExperienceModal />
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <ExperienceProvider>
      <ExperienceContent />
    </ExperienceProvider>
  );
}
