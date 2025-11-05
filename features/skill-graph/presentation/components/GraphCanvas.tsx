/**
 * Graph Canvas Component
 * 
 * Main SVG canvas with zoom, pan, and interactive rendering.
 * Handles node and edge rendering with physics-based interactions.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Play, Pause } from 'lucide-react';
import { useGraph } from '../../context/GraphContext';
import { GraphNodeComponent, NodeFilters } from './GraphNodeComponent';
import { GraphEdgeComponent } from './GraphEdgeComponent';
import { GraphNode, NodeState } from '../../types/graph.types';

interface GraphCanvasProps {
  width?: number;
  height?: number;
}

export const GraphCanvas = ({ width = 1200, height = 800 }: GraphCanvasProps) => {
  const { state, actions } = useGraph();
  const {
    graph,
    selectedNode,
    hoveredNode,
    viewport,
    isSimulating,
    filters,
  } = state;
  
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<GraphNode | null>(null);
  
  if (!graph) return null;
  
  // Filter nodes and edges based on filters
  let filteredNodes = graph.nodes;
  let filteredEdges = graph.edges;
  
  if (filters.searchQuery) {
    filteredNodes = filteredNodes.filter((node) =>
      node.label.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
  }
  
  if (filters.nodeTypes.length > 0) {
    filteredNodes = filteredNodes.filter((node) =>
      filters.nodeTypes.includes(node.type)
    );
  }
  
  if (filters.minStrength > 0 || filters.maxStrength < 100) {
    filteredNodes = filteredNodes.filter((node) => {
      const strength = node.metadata.strength || 0;
      return strength >= filters.minStrength && strength <= filters.maxStrength;
    });
  }
  
  // Filter edges to only show connections between visible nodes
  const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
  filteredEdges = filteredEdges.filter(
    (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  );
  
  // Determine which edges are highlighted
  const getHighlightedEdges = () => {
    if (!selectedNode && !hoveredNode) return new Set<string>();
    
    const node = selectedNode || hoveredNode;
    return new Set(
      filteredEdges
        .filter((edge) => edge.source === node?.id || edge.target === node?.id)
        .map((edge) => edge.id)
    );
  };
  
  const highlightedEdgeIds = getHighlightedEdges();
  
  // Determine which nodes are connected to selected/hovered
  const getConnectedNodeIds = () => {
    if (!selectedNode && !hoveredNode) return new Set<string>();
    
    const node = selectedNode || hoveredNode;
    const connected = new Set<string>();
    
    filteredEdges.forEach((edge) => {
      if (edge.source === node?.id) connected.add(edge.target);
      if (edge.target === node?.id) connected.add(edge.source);
    });
    
    return connected;
  };
  
  const connectedNodeIds = getConnectedNodeIds();
  
  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 0 && !draggedNode) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      actions.panTo(e.clientX - panStart.x, e.clientY - panStart.y);
    }
  };
  
  const handleMouseUp = () => {
    setIsPanning(false);
  };
  
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      actions.zoomIn();
    } else {
      actions.zoomOut();
    }
  };
  
  // Node drag handlers
  const handleNodeDragStart = (node: GraphNode, e: React.MouseEvent) => {
    setDraggedNode(node);
  };
  
  const handleNodeDrag = (node: GraphNode, x: number, y: number) => {
    actions.dragNode(node.id, x, y);
  };
  
  const handleNodeDragEnd = (node: GraphNode) => {
    setDraggedNode(null);
    actions.releaseNode(node.id);
  };
  
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-800/50">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#334155"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Zoom controls */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-lg p-2 flex flex-col gap-1">
          <button
            onClick={actions.zoomIn}
            className="p-2 hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={actions.zoomOut}
            className="p-2 hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={actions.fitToView}
            className="p-2 hover:bg-slate-800 rounded transition-colors"
            title="Fit to View"
          >
            <Maximize2 className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
        
        {/* Physics toggle */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-lg p-2">
          <button
            onClick={actions.togglePhysics}
            className="p-2 hover:bg-slate-800 rounded transition-colors"
            title={isSimulating ? 'Pause Physics' : 'Resume Physics'}
          >
            {isSimulating ? (
              <Pause className="w-4 h-4 text-violet-400" />
            ) : (
              <Play className="w-4 h-4 text-violet-400" />
            )}
          </button>
        </div>
      </div>
      
      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-lg px-3 py-1.5">
          <span className="text-xs text-slate-400">
            {Math.round(viewport.scale * 100)}%
          </span>
        </div>
      </div>
      
      {/* Stats overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-lg px-4 py-2 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs text-slate-400">
              {filteredNodes.length} nodes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="text-xs text-slate-400">
              {filteredEdges.length} connections
            </span>
          </div>
        </div>
      </div>
      
      {/* Main SVG Canvas */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        className="relative z-0"
      >
        <NodeFilters />
        
        <g
          transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.scale})`}
          className="transition-transform duration-300"
        >
          {/* Render edges first (below nodes) */}
          {filteredEdges.map((edge) => {
            const sourceNode = filteredNodes.find((n) => n.id === edge.source);
            const targetNode = filteredNodes.find((n) => n.id === edge.target);
            const isHighlighted = highlightedEdgeIds.has(edge.id);
            const isDimmed =
              !!(selectedNode || hoveredNode) && !isHighlighted;
            
            return (
              <GraphEdgeComponent
                key={edge.id}
                edge={edge}
                sourceNode={sourceNode}
                targetNode={targetNode}
                isHighlighted={isHighlighted}
                isDimmed={isDimmed}
              />
            );
          })}
          
          {/* Render nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHovered = hoveredNode?.id === node.id;
            const isConnected = connectedNodeIds.has(node.id);
            const isDimmed =
              !!(selectedNode || hoveredNode) &&
              !isSelected &&
              !isHovered &&
              !isConnected;
            
            return (
              <GraphNodeComponent
                key={node.id}
                node={node}
                scale={viewport.scale}
                isSelected={isSelected}
                isHovered={isHovered}
                isConnected={isConnected}
                isDimmed={isDimmed}
                onMouseEnter={actions.hoverNode}
                onMouseLeave={() => actions.hoverNode(null)}
                onClick={actions.selectNode}
                onDragStart={handleNodeDragStart}
                onDrag={handleNodeDrag}
                onDragEnd={handleNodeDragEnd}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
