/**
 * Node Detail Panel Component
 * 
 * Side panel showing detailed information about selected node,
 * including connections, projects, and learning paths.
 */

'use client';

import { X, ExternalLink, TrendingUp, BookOpen, Award, Users, Link as LinkIcon } from 'lucide-react';
import { useGraph } from '../../context/GraphContext';
import { getNodeTypeLabel, getEdgeTypeLabel, NODE_COLORS } from '../../types/graph.types';

export const NodeDetailPanel = () => {
  const { state, actions } = useGraph();
  const { nodeDetails, selectedNode, showDetailPanel } = state;
  
  if (!showDetailPanel || !selectedNode || !nodeDetails) {
    return null;
  }
  
  const { node, incomingEdges, outgoingEdges, connectedNodes, totalConnections } = nodeDetails;
  
  const getDaysAgo = (date?: Date): string => {
    if (!date) return 'Unknown';
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };
  
  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 shadow-2xl z-50 animate-panel-slide overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/98 backdrop-blur-xl border-b border-slate-700/50 p-6 z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full animate-node-pulse"
                style={{ backgroundColor: node.color }}
              />
              <span className="text-xs font-medium text-slate-400">
                {getNodeTypeLabel(node.type)}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{node.label}</h2>
          </div>
          <button
            onClick={() => actions.selectNode(null)}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        {node.description && (
          <p className="text-sm text-slate-400">{node.description}</p>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-slate-400">Connections</span>
            </div>
            <p className="text-2xl font-bold text-white">{totalConnections}</p>
          </div>
          
          {node.metadata.strength !== undefined && (
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">Strength</span>
              </div>
              <p className="text-2xl font-bold text-white">{node.metadata.strength}%</p>
            </div>
          )}
          
          {node.metadata.projectCount !== undefined && (
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-violet-400" />
                <span className="text-xs text-slate-400">Projects</span>
              </div>
              <p className="text-2xl font-bold text-white">{node.metadata.projectCount}</p>
            </div>
          )}
          
          {node.metadata.learningHours !== undefined && (
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-400">Hours</span>
              </div>
              <p className="text-2xl font-bold text-white">{Math.round(node.metadata.learningHours)}</p>
            </div>
          )}
        </div>
        
        {/* Metadata */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Details</h3>
          
          {node.metadata.domain && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Domain</span>
              <span className="text-sm font-medium text-white">{node.metadata.domain}</span>
            </div>
          )}
          
          {node.metadata.verified !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Verification</span>
              <span className={`text-sm font-medium ${node.metadata.verified ? 'text-emerald-400' : 'text-slate-400'}`}>
                {node.metadata.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          )}
          
          {node.metadata.lastUpdated && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Last Updated</span>
              <span className="text-sm text-slate-300">{getDaysAgo(node.metadata.lastUpdated)}</span>
            </div>
          )}
          
          {node.metadata.tags && node.metadata.tags.length > 0 && (
            <div>
              <span className="text-sm text-slate-400 mb-2 block">Tags</span>
              <div className="flex flex-wrap gap-2">
                {node.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Connected Nodes */}
        {connectedNodes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Connected Nodes ({connectedNodes.length})
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {connectedNodes.map((connectedNode) => {
                // Find the edge connecting to this node
                const edge =
                  incomingEdges.find((e) => e.source === connectedNode.id) ||
                  outgoingEdges.find((e) => e.target === connectedNode.id);
                
                return (
                  <button
                    key={connectedNode.id}
                    onClick={() => actions.selectNode(connectedNode)}
                    className="w-full flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${connectedNode.color}20` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: connectedNode.color }}
                      />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {connectedNode.label}
                      </p>
                      {edge && (
                        <p className="text-xs text-slate-400">
                          {getEdgeTypeLabel(edge.type)}
                        </p>
                      )}
                    </div>
                    
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Incoming Connections */}
        {incomingEdges.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">
              Incoming Connections ({incomingEdges.length})
            </h3>
            
            <div className="space-y-2">
              {incomingEdges.slice(0, 5).map((edge) => (
                <div
                  key={edge.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
                >
                  <div
                    className="w-6 h-1 rounded-full"
                    style={{ backgroundColor: edge.color }}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">{getEdgeTypeLabel(edge.type)}</p>
                    <p className="text-sm text-slate-300">
                      Weight: {Math.round(edge.weight * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Outgoing Connections */}
        {outgoingEdges.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">
              Outgoing Connections ({outgoingEdges.length})
            </h3>
            
            <div className="space-y-2">
              {outgoingEdges.slice(0, 5).map((edge) => (
                <div
                  key={edge.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
                >
                  <div
                    className="w-6 h-1 rounded-full"
                    style={{ backgroundColor: edge.color }}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-slate-400">{getEdgeTypeLabel(edge.type)}</p>
                    <p className="text-sm text-slate-300">
                      Weight: {Math.round(edge.weight * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
