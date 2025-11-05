/**
 * Graph Edge Component
 * 
 * Animated connection lines with glow effects and weight-based styling.
 * Represents relationships between nodes with flowing particles.
 */

'use client';

import { GraphEdge, GraphNode } from '../../types/graph.types';

interface GraphEdgeComponentProps {
  edge: GraphEdge;
  sourceNode: GraphNode | undefined;
  targetNode: GraphNode | undefined;
  isHighlighted: boolean;
  isDimmed: boolean;
}

export const GraphEdgeComponent = ({
  edge,
  sourceNode,
  targetNode,
  isHighlighted,
  isDimmed,
}: GraphEdgeComponentProps) => {
  if (!sourceNode || !targetNode) return null;
  
  const baseOpacity = isDimmed ? 0.05 : edge.opacity;
  const highlightedOpacity = isHighlighted ? Math.min(edge.opacity * 2, 1) : baseOpacity;
  const strokeWidth = isHighlighted ? edge.width * 1.5 : edge.width;
  
  // Calculate edge path (straight line for now, could be curved)
  const x1 = sourceNode.x;
  const y1 = sourceNode.y;
  const x2 = targetNode.x;
  const y2 = targetNode.y;
  
  // Calculate midpoint for label
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Calculate angle for arrow direction
  const angle = Math.atan2(y2 - y1, x2 - x1);
  
  // Arrow position (near target node)
  const arrowDistance = targetNode.radius + 5;
  const arrowX = x2 - Math.cos(angle) * arrowDistance;
  const arrowY = y2 - Math.sin(angle) * arrowDistance;
  
  // Generate unique IDs for gradients and animations
  const gradientId = `edge-gradient-${edge.id}`;
  const flowId = `edge-flow-${edge.id}`;
  
  return (
    <g className="transition-opacity duration-300" opacity={highlightedOpacity}>
      {/* Gradient definition for the edge */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={edge.color} stopOpacity={0.3} />
          <stop offset="50%" stopColor={edge.color} stopOpacity={0.8} />
          <stop offset="100%" stopColor={edge.color} stopOpacity={0.3} />
        </linearGradient>
        
        {/* Animated gradient for flow effect */}
        {edge.animated && (
          <linearGradient id={flowId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={edge.color} stopOpacity={0}>
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor={edge.color} stopOpacity={0.8}>
              <animate
                attributeName="offset"
                values="0;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor={edge.color} stopOpacity={0}>
              <animate
                attributeName="stop-opacity"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        )}
      </defs>
      
      {/* Glow layer (visible when highlighted) */}
      {isHighlighted && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={edge.color}
          strokeWidth={strokeWidth * 2}
          opacity={0.3}
          filter="url(#edge-glow)"
          className="animate-edge-glow"
        />
      )}
      
      {/* Main edge line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={isHighlighted ? edge.color : `url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="transition-all duration-300"
      />
      
      {/* Animated flow effect */}
      {edge.animated && isHighlighted && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={`url(#${flowId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="animate-connection-flow"
        />
      )}
      
      {/* Directional arrow (for non-bidirectional edges) */}
      {!edge.metadata.bidirectional && isHighlighted && (
        <g>
          <path
            d={`
              M ${arrowX} ${arrowY}
              L ${arrowX - 8 * Math.cos(angle - Math.PI / 6)} ${arrowY - 8 * Math.sin(angle - Math.PI / 6)}
              M ${arrowX} ${arrowY}
              L ${arrowX - 8 * Math.cos(angle + Math.PI / 6)} ${arrowY - 8 * Math.sin(angle + Math.PI / 6)}
            `}
            stroke={edge.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}
      
      {/* Edge label (visible when highlighted) */}
      {isHighlighted && edge.metadata.label && (
        <g className="animate-tooltip-appear">
          {/* Label background */}
          <rect
            x={midX - 30}
            y={midY - 10}
            width={60}
            height={18}
            fill="rgba(15, 23, 42, 0.95)"
            stroke={edge.color}
            strokeWidth={1}
            rx={4}
          />
          
          {/* Label text */}
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fill="white"
            fontSize={9}
            fontWeight={500}
            className="pointer-events-none"
          >
            {edge.metadata.label}
          </text>
        </g>
      )}
      
      {/* Weight indicator (thicker line segment at midpoint) */}
      {isHighlighted && edge.weight > 0.7 && (
        <circle
          cx={midX}
          cy={midY}
          r={3}
          fill={edge.color}
          stroke="rgba(15, 23, 42, 0.95)"
          strokeWidth={1.5}
          className="animate-node-pulse"
        />
      )}
      
      {/* Particle flow animation (for high-weight connections) */}
      {edge.animated && isHighlighted && edge.weight > 0.6 && (
        <>
          <circle
            r={2}
            fill={edge.color}
            opacity={0.8}
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={`M ${x1} ${y1} L ${x2} ${y2}`}
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          
          <circle
            r={2}
            fill={edge.color}
            opacity={0.8}
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
              path={`M ${x1} ${y1} L ${x2} ${y2}`}
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="3s"
              repeatCount="indefinite"
              begin="1s"
            />
          </circle>
          
          <circle
            r={2}
            fill={edge.color}
            opacity={0.8}
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              begin="2s"
              path={`M ${x1} ${y1} L ${x2} ${y2}`}
            />
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="3s"
              repeatCount="indefinite"
              begin="2s"
            />
          </circle>
        </>
      )}
    </g>
  );
};
