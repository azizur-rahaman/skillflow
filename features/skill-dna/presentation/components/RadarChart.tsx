'use client';

import React, { useMemo } from 'react';
import type { RadarChartProps, RadarPoint } from '../../types/skill-dna.types';

export function RadarChart({
  data,
  size = 400,
  showLabels = true,
  showGrid = true,
  animated = true,
  glowIntensity = 0.6,
  onAxisClick,
}: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.35; // Leave space for labels
  const levels = 5; // Number of concentric circles

  // Calculate radar points
  const radarPoints = useMemo((): RadarPoint[] => {
    return data.map((item, index) => {
      const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2; // Start from top
      const strength = item.strength / 100;
      const x = center + radius * strength * Math.cos(angle);
      const y = center + radius * strength * Math.sin(angle);
      
      return { x, y, angle, strength: item.strength };
    });
  }, [data, center, radius]);

  // Create polygon path for filled area
  const polygonPath = useMemo(() => {
    return radarPoints.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
  }, [radarPoints]);

  // Generate grid circles
  const gridCircles = useMemo(() => {
    return Array.from({ length: levels }, (_, i) => {
      const r = (radius / levels) * (i + 1);
      return r;
    });
  }, [radius, levels]);

  // Generate axis lines
  const axisLines = useMemo(() => {
    return data.map((_, index) => {
      const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
      const endX = center + radius * Math.cos(angle);
      const endY = center + radius * Math.sin(angle);
      
      return { x1: center, y1: center, x2: endX, y2: endY };
    });
  }, [data, center, radius]);

  // Label positions
  const labelPositions = useMemo(() => {
    return data.map((item, index) => {
      const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
      const labelRadius = radius * 1.25; // Outside the chart
      const x = center + labelRadius * Math.cos(angle);
      const y = center + labelRadius * Math.sin(angle);
      
      // Determine text anchor based on position
      let anchor: 'start' | 'middle' | 'end' = 'middle';
      if (x < center - 10) anchor = 'end';
      else if (x > center + 10) anchor = 'start';
      
      return { x, y, anchor, label: item.label, color: item.color, strength: item.strength };
    });
  }, [data, center, radius]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="overflow-visible"
        style={{ filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))' }}
      >
        {/* Definitions */}
        <defs>
          {/* Gradient for filled area */}
          <radialGradient id="radar-gradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.2" />
          </radialGradient>
          
          {/* Glow filter */}
          <filter id="radar-glow">
            <feGaussianBlur stdDeviation={glowIntensity * 4} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Individual domain gradients */}
          {data.map((item, i) => (
            <linearGradient key={`gradient-${i}`} id={`domain-gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={item.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={item.color} stopOpacity="0.4" />
            </linearGradient>
          ))}
        </defs>

        {/* Grid circles */}
        {showGrid && gridCircles.map((r, i) => (
          <circle
            key={`grid-${i}`}
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth="1"
            className={animated ? 'animate-zone-fade' : ''}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="1"
            className={animated ? 'animate-zone-fade' : ''}
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}

        {/* Individual domain segments (hover areas) */}
        {data.map((item, index) => {
          const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
          const nextAngle = (Math.PI * 2 * (index + 1)) / data.length - Math.PI / 2;
          
          const strength = item.strength / 100;
          const x1 = center + radius * strength * Math.cos(angle);
          const y1 = center + radius * strength * Math.sin(angle);
          const x2 = center + radius * strength * Math.cos(nextAngle);
          const y2 = center + radius * strength * Math.sin(nextAngle);
          
          // Create a segment path
          const segmentPath = `
            M ${center} ${center}
            L ${x1} ${y1}
            A ${radius * strength} ${radius * strength} 0 0 1 ${x2} ${y2}
            Z
          `;
          
          return (
            <path
              key={`segment-${index}`}
              d={segmentPath}
              fill={`url(#domain-gradient-${index})`}
              opacity="0"
              className={`transition-all duration-300 ${onAxisClick ? 'cursor-pointer hover:opacity-30' : ''}`}
              onClick={() => onAxisClick?.(item.domain)}
            />
          );
        })}

        {/* Filled polygon */}
        <path
          d={polygonPath}
          fill="url(#radar-gradient)"
          stroke="#6366F1"
          strokeWidth="2"
          filter="url(#radar-glow)"
          className={animated ? 'animate-radar-draw' : ''}
          style={{
            strokeDasharray: animated ? 1000 : undefined,
            strokeDashoffset: animated ? 1000 : undefined,
          }}
        />

        {/* Data points */}
        {radarPoints.map((point, i) => (
          <g key={`point-${i}`}>
            {/* Outer glow */}
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill={data[i].color}
              opacity="0.2"
              className={animated ? 'animate-dna-glow' : ''}
              style={{ animationDelay: `${i * 100}ms` }}
            />
            {/* Main point */}
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill={data[i].color}
              stroke="#0F172A"
              strokeWidth="2"
              className={`transition-all duration-300 ${onAxisClick ? 'cursor-pointer hover:r-7' : ''} ${animated ? 'animate-dna-glow' : ''}`}
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => onAxisClick?.(data[i].domain)}
            />
            {/* Inner highlight */}
            <circle
              cx={point.x}
              cy={point.y}
              r="2"
              fill="white"
              opacity="0.6"
            />
          </g>
        ))}
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none">
          {labelPositions.map((pos, i) => (
            <div
              key={`label-${i}`}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${animated ? 'animate-zone-fade' : ''}`}
              style={{
                left: pos.x,
                top: pos.y,
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div className="flex flex-col items-center gap-1 pointer-events-auto">
                <div
                  className={`text-xs font-semibold px-2 py-1 rounded-md ${onAxisClick ? 'cursor-pointer hover:scale-110' : ''} transition-transform duration-200`}
                  style={{
                    color: pos.color,
                    backgroundColor: `${pos.color}15`,
                    border: `1px solid ${pos.color}40`,
                  }}
                  onClick={() => onAxisClick?.(data[i].domain)}
                >
                  {pos.label}
                </div>
                <div
                  className="text-xs font-bold"
                  style={{ color: pos.color }}
                >
                  {pos.strength}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Center indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[#6366F1] to-[#A855F7] animate-pulse" />
      </div>
    </div>
  );
}
