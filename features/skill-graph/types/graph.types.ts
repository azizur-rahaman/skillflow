/**
 * Skill Graph Domain Types
 * 
 * Type definitions for interactive skill graph explorer with physics-based layout.
 * Neural network visualization of skills, projects, and learning paths.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Node types in the skill graph
 */
export enum NodeType {
  SKILL = 'skill',
  PROJECT = 'project',
  LEARNING_PATH = 'learning_path',
  DOMAIN = 'domain',
  CERTIFICATION = 'certification',
}

/**
 * Edge types (relationships between nodes)
 */
export enum EdgeType {
  REQUIRES = 'requires',           // Skill A requires Skill B
  RELATED_TO = 'related_to',       // Skills are related
  USED_IN = 'used_in',             // Skill used in Project
  TEACHES = 'teaches',             // Learning path teaches skill
  PART_OF = 'part_of',             // Skill part of domain
  LEADS_TO = 'leads_to',           // Path leads to certification
}

/**
 * Graph layout algorithms
 */
export enum LayoutAlgorithm {
  FORCE_DIRECTED = 'force_directed',
  HIERARCHICAL = 'hierarchical',
  RADIAL = 'radial',
  CIRCULAR = 'circular',
  TREE = 'tree',
}

/**
 * Node interaction states
 */
export enum NodeState {
  IDLE = 'idle',
  HOVERED = 'hovered',
  SELECTED = 'selected',
  DRAGGING = 'dragging',
  CONNECTED = 'connected',         // Connected to selected node
  DIMMED = 'dimmed',               // Not related to selection
}

/**
 * Filter categories
 */
export enum FilterCategory {
  ALL = 'all',
  SKILLS_ONLY = 'skills_only',
  PROJECTS_ONLY = 'projects_only',
  LEARNING_PATHS = 'learning_paths',
  BY_DOMAIN = 'by_domain',
  BY_STRENGTH = 'by_strength',
}

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Graph node representing a skill, project, or learning path
 */
export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  
  // Visual properties
  x: number;
  y: number;
  radius: number;
  color: string;
  glowIntensity: number;           // 0-1
  
  // Physics properties
  vx: number;                       // Velocity X
  vy: number;                       // Velocity Y
  fx?: number;                      // Fixed X (for dragging)
  fy?: number;                      // Fixed Y (for dragging)
  
  // Node data
  metadata: {
    strength?: number;              // For skills (0-100)
    domain?: string;
    projectCount?: number;
    learningHours?: number;
    connections?: number;
    verified?: boolean;
    lastUpdated?: Date;
    tags?: string[];
  };
  
  // State
  state: NodeState;
}

/**
 * Graph edge (connection between nodes)
 */
export interface GraphEdge {
  id: string;
  source: string;                   // Node ID
  target: string;                   // Node ID
  type: EdgeType;
  weight: number;                   // 0-1 (strength of connection)
  
  // Visual properties
  color: string;
  width: number;
  opacity: number;
  animated: boolean;
  
  // Metadata
  metadata: {
    label?: string;
    description?: string;
    bidirectional?: boolean;
    createdAt?: Date;
  };
}

/**
 * Complete graph structure
 */
export interface SkillGraph {
  id: string;
  name: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  
  // Layout configuration
  layoutAlgorithm: LayoutAlgorithm;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

/**
 * Physics simulation configuration
 */
export interface PhysicsConfig {
  enabled: boolean;
  
  // Forces
  chargeStrength: number;           // Repulsion between nodes (-100 to 0)
  linkDistance: number;             // Preferred edge length
  linkStrength: number;             // Edge elasticity (0-1)
  centerStrength: number;           // Pull to center (0-1)
  collisionRadius: number;          // Node collision buffer
  
  // Simulation
  alphaDecay: number;               // Simulation cooldown rate
  velocityDecay: number;            // Friction (0-1)
  iterations: number;               // Steps per tick
}

/**
 * Zoom and pan configuration
 */
export interface ViewportConfig {
  x: number;                        // Pan X offset
  y: number;                        // Pan Y offset
  scale: number;                    // Zoom level (0.1 - 5)
  minScale: number;
  maxScale: number;
  
  // Transitions
  transitionDuration: number;       // ms
  smoothZoom: boolean;
}

/**
 * Node detail information
 */
export interface NodeDetails {
  node: GraphNode;
  
  // Connections
  incomingEdges: GraphEdge[];
  outgoingEdges: GraphEdge[];
  connectedNodes: GraphNode[];
  
  // Statistics
  totalConnections: number;
  strongestConnection?: {
    node: GraphNode;
    edge: GraphEdge;
  };
  
  // Related items
  relatedProjects?: Array<{
    id: string;
    name: string;
    relevance: number;
  }>;
  learningPaths?: Array<{
    id: string;
    name: string;
    progress: number;
  }>;
  recommendations?: Array<{
    node: GraphNode;
    reason: string;
    relevance: number;
  }>;
}

/**
 * Graph filters
 */
export interface GraphFilters {
  category: FilterCategory;
  nodeTypes: NodeType[];
  edgeTypes: EdgeType[];
  domains: string[];
  searchQuery: string;
  minStrength: number;
  maxStrength: number;
  showVerifiedOnly: boolean;
  minConnections: number;
}

/**
 * Graph statistics
 */
export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  nodesByType: Record<NodeType, number>;
  edgesByType: Record<EdgeType, number>;
  avgConnections: number;
  maxConnections: number;
  clusters: number;
  density: number;                  // Edges / possible edges
}

/**
 * Hover card data
 */
export interface HoverCardData {
  node: GraphNode;
  position: { x: number; y: number };
  connections: number;
  strength?: number;
  preview: string;
}

/**
 * Export configuration
 */
export interface GraphExportConfig {
  format: 'png' | 'svg' | 'json' | 'graphml';
  includeMetadata: boolean;
  includePhysics: boolean;
  resolution?: 'low' | 'medium' | 'high';
}

// ============================================================================
// State Management
// ============================================================================

/**
 * Graph state
 */
export interface GraphState {
  graph: SkillGraph | null;
  selectedNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  nodeDetails: NodeDetails | null;
  
  // Viewport
  viewport: ViewportConfig;
  
  // Physics
  physicsConfig: PhysicsConfig;
  isSimulating: boolean;
  
  // Filters
  filters: GraphFilters;
  
  // UI state
  isPanning: boolean;
  isDragging: boolean;
  isLoading: boolean;
  showDetailPanel: boolean;
  
  // Statistics
  stats: GraphStats | null;
}

/**
 * Graph actions
 */
export interface GraphActions {
  // Node interactions
  selectNode: (node: GraphNode | null) => void;
  hoverNode: (node: GraphNode | null) => void;
  dragNode: (nodeId: string, x: number, y: number) => void;
  releaseNode: (nodeId: string) => void;
  
  // Viewport controls
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  panTo: (x: number, y: number) => void;
  fitToView: () => void;
  
  // Filters
  updateFilters: (filters: Partial<GraphFilters>) => void;
  resetFilters: () => void;
  
  // Layout
  setLayoutAlgorithm: (algorithm: LayoutAlgorithm) => void;
  regenerateLayout: () => void;
  
  // Physics
  togglePhysics: () => void;
  updatePhysicsConfig: (config: Partial<PhysicsConfig>) => void;
  
  // Data
  refreshGraph: () => Promise<void>;
  exportGraph: (config: GraphExportConfig) => void;
  
  // UI
  toggleDetailPanel: () => void;
}

/**
 * Graph Context (State + Actions)
 */
export interface GraphContextType {
  state: GraphState;
  actions: GraphActions;
}

// ============================================================================
// Color Mapping
// ============================================================================

/**
 * Node colors by type
 */
export const NODE_COLORS: Record<NodeType, string> = {
  [NodeType.SKILL]: '#22D3EE',           // Cyan
  [NodeType.PROJECT]: '#A855F7',         // Purple
  [NodeType.LEARNING_PATH]: '#6366F1',   // Indigo
  [NodeType.DOMAIN]: '#EC4899',          // Pink
  [NodeType.CERTIFICATION]: '#F59E0B',   // Amber
};

/**
 * Edge colors by type
 */
export const EDGE_COLORS: Record<EdgeType, string> = {
  [EdgeType.REQUIRES]: '#8B5CF6',        // Violet
  [EdgeType.RELATED_TO]: '#22D3EE',      // Cyan
  [EdgeType.USED_IN]: '#A855F7',         // Purple
  [EdgeType.TEACHES]: '#6366F1',         // Indigo
  [EdgeType.PART_OF]: '#EC4899',         // Pink
  [EdgeType.LEADS_TO]: '#10B981',        // Emerald
};

/**
 * Get node color with strength modulation
 */
export const getNodeColor = (node: GraphNode): string => {
  let baseColor = NODE_COLORS[node.type];
  
  // Modulate based on strength for skills
  if (node.type === NodeType.SKILL && node.metadata.strength !== undefined) {
    const strength = node.metadata.strength;
    if (strength < 40) {
      return '#64748B'; // Slate (low strength)
    } else if (strength < 70) {
      return '#22D3EE'; // Cyan (medium)
    } else {
      return '#10B981'; // Emerald (high)
    }
  }
  
  return baseColor;
};

/**
 * Get edge opacity based on weight
 */
export const getEdgeOpacity = (weight: number): number => {
  return 0.2 + weight * 0.6; // 0.2 - 0.8
};

/**
 * Get edge width based on weight
 */
export const getEdgeWidth = (weight: number): number => {
  return 1 + weight * 3; // 1 - 4
};

/**
 * Get node label
 */
export const getNodeTypeLabel = (type: NodeType): string => {
  const labels: Record<NodeType, string> = {
    [NodeType.SKILL]: 'Skill',
    [NodeType.PROJECT]: 'Project',
    [NodeType.LEARNING_PATH]: 'Learning Path',
    [NodeType.DOMAIN]: 'Domain',
    [NodeType.CERTIFICATION]: 'Certification',
  };
  return labels[type];
};

/**
 * Get edge label
 */
export const getEdgeTypeLabel = (type: EdgeType): string => {
  const labels: Record<EdgeType, string> = {
    [EdgeType.REQUIRES]: 'Requires',
    [EdgeType.RELATED_TO]: 'Related To',
    [EdgeType.USED_IN]: 'Used In',
    [EdgeType.TEACHES]: 'Teaches',
    [EdgeType.PART_OF]: 'Part Of',
    [EdgeType.LEADS_TO]: 'Leads To',
  };
  return labels[type];
};
