/**
 * Proficiency Legend Component
 * 
 * Displays color-intensity scale with proficiency levels (0-100).
 * Shows gradient visualization and level descriptions.
 */

'use client';

import { useTeamHeatmap } from '../../../context/TeamSkillsHeatmapContext';
import { ProficiencyLevel } from '../../../types/team-skills-heatmap.types';

interface ProficiencyLegendProps {
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
  compact?: boolean;
}

export const ProficiencyLegend = ({
  orientation = 'vertical',
  showDescriptions = true,
  compact = false,
}: ProficiencyLegendProps) => {
  const { state } = useTeamHeatmap();
  const { legend } = state;

  if (orientation === 'horizontal') {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">
          Proficiency Scale
        </h3>

        {/* Gradient bar */}
        <div className="relative h-8 rounded-lg overflow-hidden mb-3">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${legend.levels
                .map((level) => level.color)
                .join(', ')})`,
            }}
          />
          
          {/* Scale markers */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {legend.levels.map((level, index) => (
              <div
                key={level.level}
                className="flex flex-col items-center"
                style={{ width: `${100 / legend.levels.length}%` }}
              >
                <div className="w-px h-4 bg-white/50" />
                <span className="text-xs font-medium text-white mt-1">
                  {level.minValue}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center">
              <div className="w-px h-4 bg-white/50" />
              <span className="text-xs font-medium text-white mt-1">100</span>
            </div>
          </div>
        </div>

        {/* Level labels */}
        <div className="grid grid-cols-6 gap-2">
          {legend.levels.map((level) => (
            <div key={level.level} className="text-center">
              <div
                className="w-full h-2 rounded mb-1"
                style={{ backgroundColor: level.color }}
              />
              <p className="text-xs font-medium text-white">
                {level.label}
              </p>
              {!compact && (
                <p className="text-xs text-slate-400">
                  {level.minValue}-{level.maxValue}%
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vertical orientation (default)
  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 rounded-xl border border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">
          Proficiency Legend
        </h3>
        <div className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-xs font-medium text-indigo-400">0-100%</span>
        </div>
      </div>

      {/* Gradient visualization */}
      <div className="relative mb-6">
        <div
          className="w-full h-32 rounded-lg"
          style={{
            background: `linear-gradient(to top, ${legend.levels
              .map((level) => level.color)
              .join(', ')})`,
          }}
        />
        
        {/* Scale markers */}
        <div className="absolute inset-0 flex flex-col justify-between py-2 px-2">
          <div className="flex items-center justify-end">
            <div className="h-px w-4 bg-white/50 mr-2" />
            <span className="text-xs font-bold text-white">100%</span>
          </div>
          <div className="flex items-center justify-end">
            <div className="h-px w-4 bg-white/50 mr-2" />
            <span className="text-xs font-bold text-white">50%</span>
          </div>
          <div className="flex items-center justify-end">
            <div className="h-px w-4 bg-white/50 mr-2" />
            <span className="text-xs font-bold text-white">0%</span>
          </div>
        </div>
      </div>

      {/* Level details */}
      <div className="space-y-3">
        {legend.levels.map((level) => (
          <div
            key={level.level}
            className="group hover:bg-slate-700/30 p-2 rounded-lg transition-colors cursor-default"
          >
            <div className="flex items-start gap-3">
              {/* Color indicator */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-6 h-6 rounded-md border border-white/20 shadow-sm"
                  style={{
                    backgroundColor: level.color,
                    boxShadow: `0 0 10px ${level.color}40`,
                  }}
                />
              </div>

              {/* Level info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="text-sm font-semibold text-white">
                    {level.label}
                  </h4>
                  <span className="text-xs font-medium text-slate-400">
                    {level.minValue}-{level.maxValue}%
                  </span>
                </div>
                
                {showDescriptions && !compact && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {level.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional info */}
      {!compact && (
        <div className="mt-5 pt-5 border-t border-slate-700">
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Verified skills have manager/peer confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Pending verification in progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <span>Self-reported without verification</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
