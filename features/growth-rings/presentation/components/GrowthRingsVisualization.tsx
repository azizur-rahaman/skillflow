/**
 * Growth Rings Visualization Component
 * 
 * Main visualization with concentric rings, domain legend, and time controls.
 * Displays skill progression over time with smooth animations.
 */

'use client';

import React, { useState } from 'react';
import { Calendar, Play, Pause, RotateCcw } from 'lucide-react';
import { useGrowthRings } from '../../context/GrowthRingsContext';
import { GrowthRingComponent } from './GrowthRingComponent';
import { SkillDomain, getDomainLabel, AnimationState } from '../../types/growth-rings.types';
import type { TimeSegment } from '../../types/growth-rings.types';

interface GrowthRingsVisualizationProps {
  size?: number;
  showControls?: boolean;
  showLegend?: boolean;
}

export function GrowthRingsVisualization({
  size = 600,
  showControls = true,
  showLegend = true,
}: GrowthRingsVisualizationProps) {
  const { state, actions } = useGrowthRings();
  const [selectedMonth, setSelectedMonth] = useState(state.timeSegments.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentSegment = state.timeSegments[selectedMonth];
  const centerX = size / 2;
  const centerY = size / 2;

  // Filter rings by selected domain
  const filteredRings = currentSegment.rings.filter(ring =>
    state.selectedDomain ? ring.domain === state.selectedDomain : true
  );

  const handlePrevMonth = () => {
    if (selectedMonth > 0) {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth < state.timeSegments.length - 1) {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      actions.toggleAnimation();
    }
  };

  const handleReset = () => {
    setSelectedMonth(state.timeSegments.length - 1);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Time Controls */}
      {showControls && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#22D3EE]" />
            <span className="text-lg font-semibold text-[#F8FAFC]">
              {currentSegment.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              onClick={handlePrevMonth}
              disabled={selectedMonth === 0}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlayback}
              className="p-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#A855F7] hover:from-[#6366F1]/90 hover:to-[#A855F7]/90 text-white transition-all duration-200"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Next */}
            <button
              onClick={handleNextMonth}
              disabled={selectedMonth === state.timeSegments.length - 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#CBD5E1] hover:text-[#F8FAFC] transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#1E293B]/50 border border-white/10 backdrop-blur-sm overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6366F1]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A855F7]/20 rounded-full blur-3xl" />
        </div>

        {/* SVG Canvas */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="relative z-10"
        >
          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r={8}
            fill="url(#centerGradient)"
            className="animate-gentle-pulse"
          />

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="centerGradient">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="1" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          {/* Growth Rings */}
          {filteredRings.map((ring, index) => (
            <GrowthRingComponent
              key={ring.id}
              ring={ring}
              centerX={centerX}
              centerY={centerY}
              thickness={state.config.ringThickness}
              animated={state.animationState === AnimationState.EXPANDING}
              onHover={actions.setHoveredRing}
              delay={index * 100}
            />
          ))}

          {/* Skill Labels */}
          {state.config.showLabels && filteredRings.map((ring, index) => {
            const angle = (index * (360 / filteredRings.length)) * (Math.PI / 180);
            const labelRadius = ring.radius + 20;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);

            return (
              <text
                key={`label-${ring.id}`}
                x={x}
                y={y}
                fill="#CBD5E1"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                {ring.label}
              </text>
            );
          })}
        </svg>

        {/* Center Stats */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-4xl font-bold text-[#F8FAFC] mb-1">
            {currentSegment.totalGrowth.toFixed(1)}%
          </div>
          <div className="text-sm text-[#94A3B8]">Total Growth</div>
        </div>
      </div>

      {/* Domain Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {state.domainStats.map(domainStat => (
            <button
              key={domainStat.domain}
              onClick={() => 
                actions.filterByDomain(
                  state.selectedDomain === domainStat.domain ? null : domainStat.domain
                )
              }
              className={`
                p-3 rounded-xl border transition-all duration-200
                ${state.selectedDomain === domainStat.domain
                  ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/30'
                  : 'bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: domainStat.color }}
                />
                <span className="text-sm font-medium text-[#F8FAFC]">
                  {getDomainLabel(domainStat.domain)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">{domainStat.skillCount} skills</span>
                <span className="text-[#22D3EE] font-semibold">
                  +{domainStat.averageGrowth.toFixed(1)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Timeline */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-sm font-medium text-[#CBD5E1]">6-Month Timeline</div>
        </div>
        
        <div className="flex items-center gap-2">
          {state.timeSegments.map((segment, index) => (
            <button
              key={segment.id}
              onClick={() => setSelectedMonth(index)}
              className={`
                flex-1 h-2 rounded-full transition-all duration-300
                ${index === selectedMonth 
                  ? 'bg-gradient-to-r from-[#6366F1] to-[#A855F7]' 
                  : 'bg-white/10 hover:bg-white/20'
                }
              `}
              title={segment.label}
            />
          ))}
        </div>

        <div className="flex justify-between mt-2 text-xs text-[#64748B]">
          <span>{state.timeSegments[0].label}</span>
          <span>{state.timeSegments[state.timeSegments.length - 1].label}</span>
        </div>
      </div>
    </div>
  );
}
