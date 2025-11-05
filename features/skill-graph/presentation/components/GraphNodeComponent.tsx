/**
 * Graph Node Component
 * 
 * Interactive node with drag, hover, selection, and pulsing effects.
 * Neural network aesthetic with glowing circles.
 */

'use client';

import { useState, useRef } from 'react';
import { GraphNode, NodeState, getNodeTypeLabel } from '../../types/graph.types';

interface GraphNodeComponentProps {
  node: GraphNode;
  scale: number;
  isSelected: boolean;
  isHovered: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  onMouseEnter: (node: GraphNode) => void;
  onMouseLeave: () => void;
  onClick: (node: GraphNode) => void;
  onDragStart: (node: GraphNode, event: React.MouseEvent) => void;
  onDrag: (node: GraphNode, x: number, y: number) => void;
  onDragEnd: (node: GraphNode) => void;
}

export const GraphNodeComponent = ({
  node,
  scale,
  isSelected,
  isHovered,
  isConnected,
  isDimmed,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDragStart,
  onDrag,
  onDragEnd,
}: GraphNodeComponentProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    onDragStart(node, e);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const dx = (e.clientX - dragStartPos.current.x) / scale;
    const dy = (e.clientY - dragStartPos.current.y) / scale;
    
    onDrag(node, node.x + dx, node.y + dy);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      onDragEnd(node);
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      e.stopPropagation();
      onClick(node);
    }
  };
  
  // Calculate visual properties
  const baseOpacity = isDimmed ? 0.2 : 1;
  const glowRadius = isSelected ? node.radius * 3 : isHovered ? node.radius * 2.5 : node.radius * 1.8;
  const pulseScale = isSelected || isHovered ? 1.2 : 1;
  
  // Node strength visualization (for skills)
  const showStrengthRing = node.metadata.strength !== undefined && (isHovered || isSelected);
  const strengthPercentage = node.metadata.strength || 0;
  
  return (
    <g
      onMouseEnter={() => onMouseEnter(node)}
      onMouseLeave={onMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      className="transition-opacity duration-300"
      opacity={baseOpacity}
    >
      {/* Outer glow */}
      <circle
        cx={node.x}
        cy={node.y}
        r={glowRadius}
        fill={node.color}
        opacity={(node.glowIntensity * 0.15) * (isSelected ? 2 : 1)}
        className={`
          transition-all duration-300
          ${isSelected || isHovered ? 'animate-node-pulse' : ''}
        `}
      />
      
      {/* Middle glow */}
      <circle
        cx={node.x}
        cy={node.y}
        r={glowRadius * 0.6}
        fill={node.color}
        opacity={(node.glowIntensity * 0.3) * (isSelected ? 1.5 : 1)}
        className="transition-all duration-300"
      />
      
      {/* Strength ring (for skills) */}
      {showStrengthRing && (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.radius * 2}
          fill="none"
          stroke={node.color}
          strokeWidth={2}
          strokeDasharray={`${(strengthPercentage / 100) * 2 * Math.PI * node.radius * 2}, ${2 * Math.PI * node.radius * 2}`}
          strokeDashoffset={-Math.PI * node.radius}
          opacity={0.6}
          className="animate-connection-flow"
        />
      )}
      
      {/* Main node circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.radius * pulseScale}
        fill={node.color}
        stroke={isSelected ? '#FFFFFF' : isConnected ? node.color : 'none'}
        strokeWidth={isSelected ? 3 : 2}
        opacity={0.9}
        className="transition-all duration-300"
        filter={isSelected || isHovered ? 'url(#node-glow)' : 'none'}
      />
      
      {/* Inner highlight */}
      <circle
        cx={node.x - node.radius * 0.3}
        cy={node.y - node.radius * 0.3}
        r={node.radius * 0.4}
        fill="white"
        opacity={0.3}
      />
      
      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.radius * 1.5}
          fill="none"
          stroke="#22D3EE"
          strokeWidth={2}
          opacity={0.8}
          className="animate-node-pulse"
        />
      )}
      
      {/* Connection indicator */}
      {isConnected && !isSelected && (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.radius * 1.3}
          fill="none"
          stroke={node.color}
          strokeWidth={1.5}
          opacity={0.5}
        />
      )}
      
      {/* Label (always visible for important nodes, or on hover) */}
      {(node.radius > 12 || isHovered || isSelected) && (
        <g className="animate-tooltip-appear">
          {/* Label background */}
          <rect
            x={node.x - 40}
            y={node.y + node.radius + 8}
            width={80}
            height={20}
            fill="rgba(15, 23, 42, 0.95)"
            stroke={node.color}
            strokeWidth={1}
            rx={4}
            opacity={isHovered || isSelected ? 1 : 0.8}
          />
          
          {/* Label text */}
          <text
            x={node.x}
            y={node.y + node.radius + 22}
            textAnchor="middle"
            fill="white"
            fontSize={10}
            fontWeight={isSelected ? 600 : 400}
            className="pointer-events-none"
          >
            {node.label}
          </text>
        </g>
      )}
      
      {/* Type indicator badge (for projects and learning paths) */}
      {(node.type === 'project' || node.type === 'learning_path') && (isHovered || isSelected) && (
        <g className="animate-tooltip-appear">
          <circle
            cx={node.x + node.radius}
            cy={node.y - node.radius}
            r={6}
            fill={node.color}
            stroke="rgba(15, 23, 42, 0.95)"
            strokeWidth={2}
          />
          <text
            x={node.x + node.radius}
            y={node.y - node.radius + 1}
            textAnchor="middle"
            fill="white"
            fontSize={8}
            fontWeight={700}
            className="pointer-events-none"
          >
            {node.type === 'project' ? 'P' : 'L'}
          </text>
        </g>
      )}
      
      {/* Verification badge (for verified skills) */}
      {node.metadata.verified && (isHovered || isSelected) && (
        <g className="animate-tooltip-appear">
          <circle
            cx={node.x - node.radius}
            cy={node.y - node.radius}
            r={5}
            fill="#10B981"
            stroke="rgba(15, 23, 42, 0.95)"
            strokeWidth={2}
          />
          <path
            d={`M ${node.x - node.radius - 2} ${node.y - node.radius} L ${node.x - node.radius} ${node.y - node.radius + 2} L ${node.x - node.radius + 3} ${node.y - node.radius - 2}`}
            stroke="white"
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
};

/**
 * SVG filter definitions for node effects
 */
export const NodeFilters = () => (
  <defs>
    {/* Node glow filter */}
    <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="1.5" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    
    {/* Edge glow filter */}
    <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="1.2" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);
