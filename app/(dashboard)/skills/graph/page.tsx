/**
 * Skill Graph Explorer Page
 * 
 * Interactive graph visualization showing relationships between
 * skills, projects, and learning paths with neural network aesthetic.
 */

'use client';

import { useState } from 'react';
import {
  RefreshCw,
  Download,
  Search,
  Filter,
  BarChart3,
  Network,
  Layers,
} from 'lucide-react';
import { GraphProvider, useGraph } from '@/features/skill-graph/context/GraphContext';
import { GraphCanvas } from '@/features/skill-graph/presentation/components/GraphCanvas';
import { NodeDetailPanel } from '@/features/skill-graph/presentation/components/NodeDetailPanel';
import {
  NodeType,
  FilterCategory,
  LayoutAlgorithm,
  GraphExportConfig,
  NODE_COLORS,
} from '@/features/skill-graph/types/graph.types';

const GraphExplorerContent = () => {
  const { state, actions } = useGraph();
  const { graph, filters, stats, isLoading, showDetailPanel } = state;
  
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const handleExport = (format: 'png' | 'svg' | 'json' | 'graphml') => {
    const config: GraphExportConfig = {
      format,
      includeMetadata: true,
      includePhysics: false,
      resolution: 'high',
    };
    actions.exportGraph(config);
    setShowExportMenu(false);
  };
  
  const nodeTypes = [
    { type: NodeType.SKILL, label: 'Skills', color: NODE_COLORS[NodeType.SKILL] },
    { type: NodeType.PROJECT, label: 'Projects', color: NODE_COLORS[NodeType.PROJECT] },
    { type: NodeType.LEARNING_PATH, label: 'Learning Paths', color: NODE_COLORS[NodeType.LEARNING_PATH] },
  ];
  
  const toggleNodeType = (type: NodeType) => {
    const newTypes = filters.nodeTypes.includes(type)
      ? filters.nodeTypes.filter((t) => t !== type)
      : [...filters.nodeTypes, type];
    actions.updateFilters({ nodeTypes: newTypes });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-gentle-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Main content */}
      <div className={`relative z-10 transition-all duration-300 ${showDetailPanel ? 'mr-96' : ''}`}>
        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Network className="w-10 h-10 text-cyan-400" />
                Skill Graph Explorer
              </h1>
              <p className="text-slate-400 max-w-2xl">
                Explore the neural map of your skills, projects, and learning paths.
                Click nodes to view details, drag to reposition, scroll to zoom.
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Refresh */}
              <button
                onClick={actions.refreshGraph}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm text-slate-300">Refresh</span>
              </button>
              
              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-slate-300">Filters</span>
              </button>
              
              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Export</span>
                </button>
                
                {showExportMenu && (
                  <div className="absolute top-full mt-2 right-0 min-w-[120px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-20">
                    {['png', 'svg', 'json', 'graphml'].map((format) => (
                      <button
                        key={format}
                        onClick={() => handleExport(format as any)}
                        className="w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors text-left"
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Filters panel */}
          {showFilters && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-6 animate-filter-slide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Search Nodes</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={filters.searchQuery}
                      onChange={(e) => actions.updateFilters({ searchQuery: e.target.value })}
                      placeholder="Type to search..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
                
                {/* Node types */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">Node Types</label>
                  <div className="flex flex-wrap gap-2">
                    {nodeTypes.map(({ type, label, color }) => (
                      <button
                        key={type}
                        onClick={() => toggleNodeType(type)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-2
                          ${
                            filters.nodeTypes.length === 0 || filters.nodeTypes.includes(type)
                              ? 'border'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }
                        `}
                        style={
                          filters.nodeTypes.length === 0 || filters.nodeTypes.includes(type)
                            ? {
                                backgroundColor: `${color}20`,
                                borderColor: `${color}50`,
                                color: color,
                              }
                            : undefined
                        }
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Strength range (for skills) */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">
                    Skill Strength: {filters.minStrength}% - {filters.maxStrength}%
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.minStrength}
                      onChange={(e) =>
                        actions.updateFilters({ minStrength: Number(e.target.value) })
                      }
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.maxStrength}
                      onChange={(e) =>
                        actions.updateFilters({ maxStrength: Number(e.target.value) })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                
                {/* Verified only */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="verified-only"
                    checked={filters.showVerifiedOnly}
                    onChange={(e) =>
                      actions.updateFilters({ showVerifiedOnly: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <label htmlFor="verified-only" className="text-sm text-slate-300">
                    Show verified nodes only
                  </label>
                </div>
              </div>
              
              {/* Reset filters */}
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <button
                  onClick={actions.resetFilters}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">Total Nodes</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalNodes}</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="w-4 h-4 text-violet-400" />
                  <span className="text-xs text-slate-400">Connections</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalEdges}</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Avg Connections</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.avgConnections}</p>
              </div>
              
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-400 to-violet-400" />
                  <span className="text-xs text-slate-400">Density</span>
                </div>
                <p className="text-2xl font-bold text-white">{Math.round(stats.density * 100)}%</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Graph Canvas */}
        <div className="container mx-auto px-6 pb-8">
          <div className="h-[calc(100vh-400px)] min-h-[600px]">
            <GraphCanvas />
          </div>
        </div>
      </div>
      
      {/* Detail Panel */}
      <NodeDetailPanel />
    </div>
  );
};

export default function SkillGraphExplorerPage() {
  return (
    <GraphProvider>
      <GraphExplorerContent />
    </GraphProvider>
  );
}
