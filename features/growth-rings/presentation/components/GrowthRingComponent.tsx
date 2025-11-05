/**
 * Growth Ring Component
 * 
 * Individual concentric ring with hover interactions and tooltips.
 * Shows skill strength via expanding radius with smooth animations.
 */

'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GrowthTrend } from '../../types/growth-rings.types';
import type { GrowthRing, RingTooltipData } from '../../types/growth-rings.types';

interface GrowthRingProps {
  ring: GrowthRing;
  centerX: number;
  centerY: number;
  thickness: number;
  animated?: boolean;
  onHover?: (ring: GrowthRing | null) => void;
  delay?: number;
}

export function GrowthRingComponent({
  ring,
  centerX,
  centerY,
  thickness,
  animated = true,
  onHover,
  delay = 0,
}: GrowthRingProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>) => {
    setIsHovered(true);
    onHover?.(ring);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGCircleElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Calculate ring opacity based on strength
  const opacity = 0.3 + (ring.strengthValue / 100) * 0.5;
  const hoverOpacity = Math.min(opacity + 0.3, 1);

  return (
    <>
      {/* Ring Circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={ring.radius}
        fill="none"
        stroke={ring.color}
        strokeWidth={thickness}
        opacity={isHovered ? hoverOpacity : opacity}
        className={`
          transition-all duration-300 cursor-pointer
          ${animated ? 'animate-ring-expand' : ''}
        `}
        style={{
          filter: isHovered 
            ? `drop-shadow(0 0 12px ${ring.color}80)` 
            : `drop-shadow(0 0 4px ${ring.color}40)`,
          animationDelay: `${delay}ms`,
          transformOrigin: `${centerX}px ${centerY}px`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      />

      {/* Tooltip */}
      {isHovered && <RingTooltip ring={ring} x={tooltipPosition.x} y={tooltipPosition.y} />}
    </>
  );
}

/**
 * Ring Tooltip Component
 */
interface RingTooltipProps {
  ring: GrowthRing;
  x: number;
  y: number;
}

function RingTooltip({ ring, x, y }: RingTooltipProps) {
  const getTrendIcon = () => {
    switch (ring.trend) {
      case GrowthTrend.RAPID:
      case GrowthTrend.STEADY:
        return <TrendingUp className="w-3 h-3 text-[#10B981]" />;
      case GrowthTrend.DECLINING:
        return <TrendingDown className="w-3 h-3 text-[#EF4444]" />;
      default:
        return <Minus className="w-3 h-3 text-[#94A3B8]" />;
    }
  };

  const getTrendColor = () => {
    switch (ring.trend) {
      case GrowthTrend.RAPID:
        return '#10B981';
      case GrowthTrend.STEADY:
        return '#22D3EE';
      case GrowthTrend.SLOW:
        return '#F59E0B';
      case GrowthTrend.DECLINING:
        return '#EF4444';
      default:
        return '#94A3B8';
    }
  };

  const daysAgo = Math.floor(
    (new Date().getTime() - ring.timestamp.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <foreignObject
      x={x + 15}
      y={y - 60}
      width="220"
      height="120"
      className="pointer-events-none animate-tooltip-appear"
    >
      <div className="p-3 rounded-xl bg-[#1E293B] border border-white/20 shadow-2xl backdrop-blur-xl">
        {/* Skill Name */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: ring.color }}
          />
          <div className="text-sm font-semibold text-[#F8FAFC]">
            {ring.skillName}
          </div>
        </div>

        {/* Strength */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
            <span>Strength</span>
            <span className="font-semibold text-[#F8FAFC]">
              {ring.strengthValue.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${ring.strengthValue}%`,
                background: `linear-gradient(90deg, ${ring.color}, ${ring.color}80)`,
              }}
            />
          </div>
        </div>

        {/* Growth */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-xs text-[#94A3B8]">Growth</span>
          </div>
          <span
            className="text-xs font-semibold"
            style={{ color: getTrendColor() }}
          >
            {ring.growthPercentage > 0 ? '+' : ''}
            {ring.growthPercentage.toFixed(1)}%
          </span>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-[#64748B] pt-2 border-t border-white/10">
          {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
        </div>
      </div>
    </foreignObject>
  );
}
