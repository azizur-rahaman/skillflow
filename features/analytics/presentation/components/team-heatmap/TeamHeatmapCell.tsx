/**
 * Team Heatmap Cell Component
 * 
 * Interactive cell with color intensity based on proficiency.
 * Shows hover cards with detailed percentages, verification status, and trends.
 */

'use client';

import { useState } from 'react';
import {
  TeamHeatmapCell,
  CellHoverDetail,
  getProficiencyLabel,
  getVerificationColor,
} from '../../../types/team-skills-heatmap.types';
import { CheckCircle2, Clock, User, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TeamHeatmapCellProps {
  cell: TeamHeatmapCell;
  size?: number;
  onHover?: (cell: TeamHeatmapCell | null) => void;
  onClick?: (cell: TeamHeatmapCell | null) => void;
  isSelected?: boolean;
}

export const TeamHeatmapCellComponent = ({
  cell,
  size = 120,
  onHover,
  onClick,
  isSelected = false,
}: TeamHeatmapCellProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    onHover?.(cell);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    onHover?.(null);
  };

  const handleClick = () => {
    onClick?.(isSelected ? null : cell);
  };

  // Determine verification icon
  const VerificationIcon =
    cell.verificationStatus === 'verified'
      ? CheckCircle2
      : cell.verificationStatus === 'pending'
      ? Clock
      : User;

  const verificationColor = getVerificationColor(cell.verificationStatus);

  // Calculate trend
  const trend = cell.metadata.managerAssessment
    ? cell.metadata.managerAssessment > cell.proficiency
      ? 'up'
      : cell.metadata.managerAssessment < cell.proficiency
      ? 'down'
      : 'stable'
    : 'stable';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="relative group">
      {/* Cell */}
      <button
        className={`
          relative flex flex-col items-center justify-center p-3 rounded-lg
          transition-all duration-200 cursor-pointer border-2
          hover:scale-105 hover:z-10 hover:shadow-xl
          ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        `}
        style={{
          width: size,
          height: size * 0.75,
          backgroundColor: cell.color,
          borderColor: isSelected ? '#6366F1' : 'transparent',
          boxShadow: showTooltip
            ? `0 0 20px ${cell.color}80`
            : isSelected
            ? `0 0 15px ${cell.color}60`
            : 'none',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-label={`${cell.skillName} - ${cell.teamMemberName}: ${cell.proficiency}%`}
      >
        {/* Proficiency percentage */}
        <div className="text-center mb-1">
          <span
            className={`text-lg font-bold ${
              cell.proficiency > 50 ? 'text-white' : 'text-slate-200'
            }`}
          >
            {cell.proficiency}%
          </span>
        </div>

        {/* Proficiency level label */}
        <div className="text-center mb-1">
          <span
            className={`text-xs font-medium ${
              cell.proficiency > 50 ? 'text-white/80' : 'text-slate-300'
            }`}
          >
            {getProficiencyLabel(cell.proficiencyLevel)}
          </span>
        </div>

        {/* Verification & Trend badges */}
        <div className="flex items-center gap-1.5 mt-auto">
          {/* Verification badge */}
          <div
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/20 backdrop-blur-sm"
            title={cell.verificationStatus}
          >
            <VerificationIcon
              className="w-3 h-3"
              style={{ color: verificationColor }}
            />
          </div>

          {/* Trend badge */}
          {trend !== 'stable' && (
            <div
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/20 backdrop-blur-sm`}
            >
              <TrendIcon
                className={`w-3 h-3 ${
                  trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}
              />
            </div>
          )}
        </div>

        {/* Endorsements count (if > 0) */}
        {cell.metadata.endorsements > 0 && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {cell.metadata.endorsements}
            </span>
          </div>
        )}
      </button>

      {/* Hover tooltip */}
      {showTooltip && (
        <div
          className="absolute z-50 w-72 p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl animate-fade-in"
          style={{
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header */}
          <div className="mb-3 pb-3 border-b border-slate-700">
            <h4 className="text-sm font-bold text-white mb-1">
              {cell.skillName}
            </h4>
            <p className="text-xs text-slate-400">
              {cell.teamMemberName}
            </p>
          </div>

          {/* Proficiency details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Proficiency</span>
              <span
                className="text-sm font-bold"
                style={{ color: cell.color }}
              >
                {cell.proficiency}% • {getProficiencyLabel(cell.proficiencyLevel)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Verification</span>
              <div className="flex items-center gap-1">
                <VerificationIcon className="w-3.5 h-3.5" style={{ color: verificationColor }} />
                <span className="text-xs capitalize" style={{ color: verificationColor }}>
                  {cell.verificationStatus.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Experience</span>
              <span className="text-xs font-medium text-white">
                {cell.metadata.yearsExperience.toFixed(1)} years
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Projects Used</span>
              <span className="text-xs font-medium text-white">
                {cell.metadata.projectsUsed}
              </span>
            </div>

            {cell.metadata.certificationsCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Certifications</span>
                <span className="text-xs font-medium text-indigo-400">
                  {cell.metadata.certificationsCount} 🏆
                </span>
              </div>
            )}
          </div>

          {/* Endorsements */}
          {cell.metadata.endorsements > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs text-slate-400">Endorsements</span>
                <div className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-xs font-bold text-indigo-400">
                    {cell.metadata.endorsements}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Manager vs Self Assessment */}
          {cell.metadata.managerAssessment && (
            <div className="pt-3 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400 mb-1">Self</p>
                  <p className="font-medium text-white">
                    {cell.metadata.selfAssessment}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Manager</p>
                  <p className="font-medium text-white flex items-center gap-1">
                    {Math.round(cell.metadata.managerAssessment)}%
                    <TrendIcon
                      className={`w-3 h-3 ${
                        trend === 'up'
                          ? 'text-emerald-400'
                          : trend === 'down'
                          ? 'text-red-400'
                          : 'text-slate-400'
                      }`}
                    />
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Last updated */}
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-400">
              Last updated:{' '}
              {new Date(cell.metadata.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
