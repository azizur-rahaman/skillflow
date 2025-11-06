/**
 * Team Skills Heatmap Grid Component
 * 
 * Main matrix layout with team avatars on top (columns),
 * skills on the side (rows), and color-coded proficiency cells.
 */

'use client';

import { useTeamHeatmap } from '../../../context/TeamSkillsHeatmapContext';
import { TeamAvatarRow } from './TeamAvatarHeader';
import { TeamHeatmapCellComponent } from './TeamHeatmapCell';
import { Skill, getSkillCategoryLabel } from '../../../types/team-skills-heatmap.types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TeamSkillsHeatmapGridProps {
  cellWidth?: number;
  cellHeight?: number;
  rowLabelWidth?: number;
  showAvatarDetails?: boolean;
}

export const TeamSkillsHeatmapGrid = ({
  cellWidth = 120,
  cellHeight = 90,
  rowLabelWidth = 200,
  showAvatarDetails = true,
}: TeamSkillsHeatmapGridProps) => {
  const { state, actions } = useTeamHeatmap();
  const { matrix, filters, selectedCell } = state;

  if (!matrix) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-800/50 rounded-2xl border border-slate-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-slate-400">No team data available</p>
        </div>
      </div>
    );
  }

  // Apply filters
  let filteredSkills = matrix.skills;
  let filteredCells = matrix.cells;

  // Search filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    const filteredIndices: number[] = [];
    
    filteredSkills = matrix.skills.filter((skill, index) => {
      const matches = skill.name.toLowerCase().includes(query) ||
                     skill.category.toLowerCase().includes(query);
      if (matches) filteredIndices.push(index);
      return matches;
    });
    
    filteredCells = filteredIndices.map((index) => matrix.cells[index]);
  }

  // Category filter
  if (filters.categories.length > 0) {
    const filteredIndices: number[] = [];
    
    filteredSkills = filteredSkills.filter((skill, relativeIndex) => {
      const originalIndex = matrix.skills.indexOf(skill);
      const matches = filters.categories.includes(skill.category);
      if (matches) filteredIndices.push(relativeIndex);
      return matches;
    });
    
    const tempCells = filteredCells;
    filteredCells = filteredIndices.map((index) => tempCells[index]);
  }

  // Proficiency range filter
  if (filters.minProficiency > 0 || filters.maxProficiency < 100) {
    const filteredIndices: number[] = [];
    
    filteredSkills = filteredSkills.filter((skill, relativeIndex) => {
      const row = filteredCells[relativeIndex];
      const avgProficiency = row.reduce((sum, cell) => sum + cell.proficiency, 0) / row.length;
      const matches = avgProficiency >= filters.minProficiency && avgProficiency <= filters.maxProficiency;
      if (matches) filteredIndices.push(relativeIndex);
      return matches;
    });
    
    const tempCells = filteredCells;
    filteredCells = filteredIndices.map((index) => tempCells[index]);
  }

  // Show gaps only
  if (filters.showGapsOnly) {
    const gapSkillIds = new Set(matrix.statistics.gaps.map((gap) => gap.skillId));
    const filteredIndices: number[] = [];
    
    filteredSkills = filteredSkills.filter((skill, relativeIndex) => {
      const matches = gapSkillIds.has(skill.id);
      if (matches) filteredIndices.push(relativeIndex);
      return matches;
    });
    
    const tempCells = filteredCells;
    filteredCells = filteredIndices.map((index) => tempCells[index]);
  }

  // Show strengths only
  if (filters.showStrengthsOnly) {
    const strengthSkillIds = new Set(
      matrix.statistics.strengths
        .filter((s) => s.isCoreCopetency)
        .map((s) => s.skillId)
    );
    const filteredIndices: number[] = [];
    
    filteredSkills = filteredSkills.filter((skill, relativeIndex) => {
      const matches = strengthSkillIds.has(skill.id);
      if (matches) filteredIndices.push(relativeIndex);
      return matches;
    });
    
    const tempCells = filteredCells;
    filteredCells = filteredIndices.map((index) => tempCells[index]);
  }

  // Filter team members
  let filteredMembers = matrix.members;
  let memberIndices = matrix.members.map((_, i) => i);

  if (filters.teamMemberIds.length > 0) {
    filteredMembers = matrix.members.filter((member) =>
      filters.teamMemberIds.includes(member.id)
    );
    memberIndices = filteredMembers.map((member) =>
      matrix.members.findIndex((m) => m.id === member.id)
    );
  }

  return (
    <div className="relative bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Team avatar header row */}
      <TeamAvatarRow
        members={filteredMembers}
        columnWidth={cellWidth}
        rowLabelWidth={rowLabelWidth}
        showDetails={showAvatarDetails}
      />

      {/* Scrollable heatmap grid */}
      <div className="overflow-auto max-h-[800px]">
        <div className="relative">
          {/* Skills rows */}
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, skillIndex) => {
              const row = filteredCells[skillIndex];
              const filteredRow = memberIndices.map((memberIndex) => row[memberIndex]);
              const avgProficiency = Math.round(
                filteredRow.reduce((sum, cell) => sum + cell.proficiency, 0) / filteredRow.length
              );

              // Determine skill trend
              const gap = matrix.statistics.gaps.find((g) => g.skillId === skill.id);
              const strength = matrix.statistics.strengths.find((s) => s.skillId === skill.id);
              const isGap = !!gap;
              const isStrength = strength?.isCoreCopetency || false;

              return (
                <div
                  key={skill.id}
                  className="flex items-center border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors animate-domain-fade"
                  style={{ animationDelay: `${skillIndex * 30}ms` }}
                >
                  {/* Skill label (row header) */}
                  <div
                    className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-r border-slate-700"
                    style={{ width: rowLabelWidth }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {skill.name}
                        </h4>
                        {isStrength && (
                          <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-xs font-medium text-emerald-400">
                              Strength
                            </span>
                          </div>
                        )}
                        {isGap && (
                          <div className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                            <span className="text-xs font-medium text-red-400">
                              Gap
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">
                        {getSkillCategoryLabel(skill.category)}
                      </p>
                    </div>

                    <div className="ml-3 text-right">
                      <div className="text-xs font-bold text-white mb-0.5">
                        {avgProficiency}%
                      </div>
                      <div className="text-xs text-slate-400">avg</div>
                    </div>
                  </div>

                  {/* Proficiency cells */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 p-2">
                      {filteredRow.map((cell) => (
                        <TeamHeatmapCellComponent
                          key={cell.id}
                          cell={cell}
                          size={cellWidth}
                          onHover={actions.hoverCell}
                          onClick={actions.selectCell}
                          isSelected={selectedCell?.id === cell.id}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-slate-400 mb-2">
                  No skills match your filters
                </p>
                <button
                  onClick={actions.resetFilters}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary footer */}
      <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="text-slate-400">
              Showing {filteredSkills.length} of {matrix.skills.length} skills
            </span>
            <span className="text-slate-400">
              {filteredMembers.length} team members
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400">
                {matrix.statistics.strengths.filter((s) => s.isCoreCopetency).length} strengths
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-slate-400">
                {matrix.statistics.gaps.length} gaps
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
