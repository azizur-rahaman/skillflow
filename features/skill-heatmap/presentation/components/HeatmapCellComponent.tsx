/**
 * Heatmap Cell Component
 * 
 * Interactive cell with color gradient, hover details, and click interactions.
 */

'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { HeatmapCell, getCompetencyLabel } from '../../types/heatmap.types';

interface HeatmapCellComponentProps {
  cell: HeatmapCell;
  size: number;
  onHover: (cell: HeatmapCell | null) => void;
  onClick: (cell: HeatmapCell) => void;
  isSelected: boolean;
}

export const HeatmapCellComponent = ({
  cell,
  size,
  onHover,
  onClick,
  isSelected,
}: HeatmapCellComponentProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(cell);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(null);
  };

  const handleClick = () => {
    onClick(cell);
  };

  // Calculate opacity based on value
  const opacity = 0.4 + (cell.value / 100) * 0.6;

  return (
    <div
      className={`relative group ${isHovered ? 'z-50' : ''}`}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Cell background */}
      <div
        className={`
          w-full h-full rounded transition-all duration-300 cursor-pointer
          ${isHovered ? 'scale-110 shadow-lg' : 'scale-100'}
          ${isSelected ? 'ring-2 ring-cyan-400' : ''}
          animate-cell-highlight
        `}
        style={{
          backgroundColor: cell.color,
          opacity: isHovered ? Math.min(opacity + 0.2, 1) : opacity,
          boxShadow: isHovered
            ? `0 0 20px ${cell.color}40, 0 0 40px ${cell.color}20`
            : 'none',
        }}
      >
        {/* Value label (visible on hover or for high values) */}
        {(isHovered || cell.value >= 80) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-lg">
              {cell.value}
            </span>
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      {isHovered && (
        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 z-50 animate-tooltip-appear pointer-events-none">
          <CellTooltip cell={cell} />
        </div>
      )}
    </div>
  );
};

interface CellTooltipProps {
  cell: HeatmapCell;
}

const CellTooltip = ({ cell }: CellTooltipProps) => {
  const {
    skillName,
    domain,
    lastUpdated,
    verificationStatus,
    endorsements,
    projectsUsed,
  } = cell.metadata;

  const getTrendIcon = () => {
    const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'stable' : 'down';
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getVerificationIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getDaysAgo = (date?: Date): string => {
    if (!date) return 'Unknown';
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4 shadow-2xl min-w-[280px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">{skillName || cell.row}</h4>
          {domain && (
            <p className="text-xs text-slate-400 mt-0.5">
              {domain.replace(/_/g, ' ').toUpperCase()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          {getVerificationIcon()}
        </div>
      </div>

      {/* Strength bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-400">Strength</span>
          <span className="text-xs font-semibold text-white">{cell.value}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${cell.value}%`,
              background: `linear-gradient(90deg, ${cell.color}40, ${cell.color})`,
            }}
          />
        </div>
      </div>

      {/* Competency level */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700/50">
        <span className="text-xs text-slate-400">Level</span>
        <span
          className="text-xs font-medium px-2 py-1 rounded"
          style={{
            backgroundColor: `${cell.color}20`,
            color: cell.color,
          }}
        >
          {getCompetencyLabel(cell.competencyLevel)}
        </span>
      </div>

      {/* Metadata */}
      <div className="space-y-2">
        {endorsements !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Endorsements</span>
            <span className="text-xs text-white font-medium">{endorsements}</span>
          </div>
        )}
        {projectsUsed !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Projects</span>
            <span className="text-xs text-white font-medium">{projectsUsed}</span>
          </div>
        )}
        {lastUpdated && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Updated</span>
            <span className="text-xs text-slate-300">{getDaysAgo(lastUpdated)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
