'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Grid3x3, 
  List, 
  Cloud, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Download,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';
import { SkillExtractionProvider, useSkillExtraction } from '@/features/skill-extraction/context/SkillExtractionContext';
import { SkillCard } from '@/features/skill-extraction/presentation/components/SkillCard';
import { ExtractionSummary } from '@/features/skill-extraction/presentation/components/ExtractionSummary';
import { EmptyState } from '@/features/skill-extraction/presentation/components/EmptyState';
import { FilterCriteria, ViewMode } from '@/features/skill-extraction/types/skill-extraction.types';

function SkillExtractionContent() {
  const {
    filteredSkills,
    selectedSkills,
    activeFilter,
    viewMode,
    searchQuery,
    stats,
    currentJob,
    setFilter,
    setViewMode,
    setSearchQuery,
    toggleSelection,
    selectAll,
    deselectAll,
    verifySkill,
    rejectSkill,
    removeSkill,
    verifySelected,
    rejectSelected,
    deleteSelected,
    exportSelected,
  } = useSkillExtraction();

  const [showBulkActions, setShowBulkActions] = useState(false);

  // Toggle bulk actions bar
  React.useEffect(() => {
    setShowBulkActions(selectedSkills.size > 0);
  }, [selectedSkills]);

  // Filter tabs configuration
  const filterTabs = [
    { id: FilterCriteria.ALL, label: 'All Skills', count: stats.totalSkills, icon: Sparkles },
    { id: FilterCriteria.VERIFIED, label: 'Verified', count: stats.verifiedSkills, icon: CheckCircle2 },
    { id: FilterCriteria.PENDING, label: 'Pending', count: stats.pendingSkills, icon: Clock },
    { id: FilterCriteria.HIGH_CONFIDENCE, label: 'High Confidence', count: stats.highConfidenceSkills, icon: TrendingUp },
  ];

  // View mode buttons
  const viewModes = [
    { id: ViewMode.GRID, icon: Grid3x3, label: 'Grid' },
    { id: ViewMode.TABLE, icon: List, label: 'List' },
    { id: ViewMode.CLOUD, icon: Cloud, label: 'Cloud' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">
              Skill Extraction
            </h1>
            <p className="text-[#94A3B8]">
              AI-powered skill extraction from your resume and profiles
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <ExtractionSummary stats={stats} currentJob={currentJob} />

        {/* Filters & Search */}
        {stats.totalSkills > 0 && (
          <>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {filterTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeFilter === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white shadow-lg shadow-[#6366F1]/25'
                          : 'bg-[#1E293B] border border-[#334155] text-[#CBD5E1] hover:border-[#6366F1]/50'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        ${isActive ? 'bg-white/20' : 'bg-[#0F172A]/60'}
                      `}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* View Mode & Search */}
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[#1E293B] border border-[#334155]">
                  {viewModes.map((mode) => {
                    const Icon = mode.icon;
                    const isActive = viewMode === mode.id;
                    
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setViewMode(mode.id)}
                        className={`
                          p-2 rounded-md transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white'
                            : 'text-[#94A3B8] hover:text-[#CBD5E1]'
                          }
                        `}
                        title={mode.label}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition-all duration-200 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {showBulkActions && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
                <div className="bg-gradient-to-r from-[#1E293B] to-[#1E293B]/95 border border-[#6366F1]/50 rounded-2xl shadow-2xl shadow-[#6366F1]/20 backdrop-blur-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {selectedSkills.size}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#F8FAFC]">
                        {selectedSkills.size} selected
                      </span>
                    </div>

                    <div className="w-px h-8 bg-[#334155]" />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          await verifySelected();
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#10B981] to-[#10B981]/80 hover:from-[#10B981]/90 hover:to-[#10B981]/70 text-white text-sm font-medium transition-all duration-200"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Verify
                      </button>

                      <button
                        onClick={async () => {
                          await rejectSelected();
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#EF4444] to-[#EF4444]/80 hover:from-[#EF4444]/90 hover:to-[#EF4444]/70 text-white text-sm font-medium transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>

                      <button
                        onClick={() => exportSelected('json')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#6366F1]/50 hover:bg-[#6366F1]/10 text-[#6366F1] text-sm font-medium transition-all duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Delete ${selectedSkills.size} selected skills?`)) {
                            await deleteSelected();
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#EF4444]/50 hover:bg-[#EF4444]/10 text-[#EF4444] text-sm font-medium transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>

                    <div className="w-px h-8 bg-[#334155]" />

                    <button
                      onClick={deselectAll}
                      className="p-2 rounded-lg hover:bg-[#334155]/50 text-[#94A3B8] hover:text-[#F8FAFC] transition-all duration-200"
                      title="Clear selection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className={`
            ${viewMode === ViewMode.GRID 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : viewMode === ViewMode.TABLE
                ? 'space-y-4'
                : 'flex flex-wrap gap-3'
            }
          `}>
            {filteredSkills.map((skill, index) => (
              <div
                key={skill.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SkillCard
                  skill={skill}
                  isSelected={selectedSkills.has(skill.id)}
                  onSelect={() => toggleSelection(skill.id)}
                  onVerify={() => verifySkill(skill.id)}
                  onReject={() => rejectSkill(skill.id)}
                  onRemove={() => {
                    if (confirm(`Remove skill "${skill.name}"?`)) {
                      removeSkill(skill.id);
                    }
                  }}
                  showActions={true}
                />
              </div>
            ))}
          </div>
        ) : stats.totalSkills === 0 ? (
          <EmptyState />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">
              No skills match your filters
            </h3>
            <p className="text-[#94A3B8] mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setFilter(FilterCriteria.ALL);
                setSearchQuery('');
              }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white font-medium hover:shadow-lg hover:shadow-[#6366F1]/25 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SkillExtractionPage() {
  return (
    <SkillExtractionProvider>
      <SkillExtractionContent />
    </SkillExtractionProvider>
  );
}
