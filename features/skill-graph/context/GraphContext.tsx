/**
 * Skill Graph Context
 * 
 * State management for interactive skill graph with physics simulation.
 * Provides graph data, node interactions, and layout algorithms.
 */

'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import {
  GraphContextType,
  GraphState,
  GraphActions,
  SkillGraph,
  GraphNode,
  GraphEdge,
  NodeDetails,
  GraphFilters,
  GraphStats,
  GraphExportConfig,
  ViewportConfig,
  PhysicsConfig,
  LayoutAlgorithm,
  NodeType,
  EdgeType,
  NodeState,
  FilterCategory,
  NODE_COLORS,
  EDGE_COLORS,
  getNodeColor,
  getEdgeOpacity,
  getEdgeWidth,
} from '../types/graph.types';

// ============================================================================
// Mock Data Generation
// ============================================================================

/**
 * Generate mock skill graph
 */
const generateMockGraph = (): SkillGraph => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  
  const width = 1200;
  const height = 800;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create skill nodes (center cluster)
  const skills = [
    { id: 'react', label: 'React', strength: 92, domain: 'Frontend' },
    { id: 'typescript', label: 'TypeScript', strength: 88, domain: 'Frontend' },
    { id: 'nodejs', label: 'Node.js', strength: 85, domain: 'Backend' },
    { id: 'python', label: 'Python', strength: 78, domain: 'Backend' },
    { id: 'graphql', label: 'GraphQL', strength: 72, domain: 'Backend' },
    { id: 'postgres', label: 'PostgreSQL', strength: 80, domain: 'Backend' },
    { id: 'aws', label: 'AWS', strength: 75, domain: 'Cloud' },
    { id: 'docker', label: 'Docker', strength: 82, domain: 'DevOps' },
    { id: 'kubernetes', label: 'Kubernetes', strength: 65, domain: 'DevOps' },
    { id: 'tensorflow', label: 'TensorFlow', strength: 68, domain: 'AI/ML' },
    { id: 'nextjs', label: 'Next.js', strength: 90, domain: 'Frontend' },
    { id: 'tailwind', label: 'Tailwind CSS', strength: 95, domain: 'Frontend' },
  ];
  
  skills.forEach((skill, index) => {
    const angle = (index / skills.length) * Math.PI * 2;
    const radius = 200 + Math.random() * 100;
    
    nodes.push({
      id: skill.id,
      type: NodeType.SKILL,
      label: skill.label,
      description: `${skill.label} - ${skill.strength}% proficiency`,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      radius: 8 + (skill.strength / 100) * 12, // 8-20 based on strength
      color: getNodeColor({ type: NodeType.SKILL, metadata: { strength: skill.strength } } as GraphNode),
      glowIntensity: skill.strength / 100,
      vx: 0,
      vy: 0,
      metadata: {
        strength: skill.strength,
        domain: skill.domain,
        projectCount: Math.floor(Math.random() * 15) + 3,
        connections: 0,
        verified: skill.strength > 70,
        lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        tags: [skill.domain, 'verified'],
      },
      state: NodeState.IDLE,
    });
  });
  
  // Create project nodes (outer ring)
  const projects = [
    { id: 'proj-1', label: 'E-commerce Platform', skills: ['react', 'nextjs', 'nodejs', 'postgres'] },
    { id: 'proj-2', label: 'AI Dashboard', skills: ['react', 'python', 'tensorflow', 'tailwind'] },
    { id: 'proj-3', label: 'Cloud Infrastructure', skills: ['aws', 'docker', 'kubernetes', 'terraform'] },
    { id: 'proj-4', label: 'GraphQL API', skills: ['nodejs', 'graphql', 'postgres', 'typescript'] },
  ];
  
  projects.forEach((project, index) => {
    const angle = (index / projects.length) * Math.PI * 2 + Math.PI / 4;
    const radius = 350;
    
    nodes.push({
      id: project.id,
      type: NodeType.PROJECT,
      label: project.label,
      description: `Project using ${project.skills.length} skills`,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      radius: 16,
      color: NODE_COLORS[NodeType.PROJECT],
      glowIntensity: 0.8,
      vx: 0,
      vy: 0,
      metadata: {
        connections: project.skills.length,
        lastUpdated: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        tags: ['active', 'portfolio'],
      },
      state: NodeState.IDLE,
    });
    
    // Create edges from project to skills
    project.skills.forEach((skillId) => {
      edges.push({
        id: `${project.id}-${skillId}`,
        source: project.id,
        target: skillId,
        type: EdgeType.USED_IN,
        weight: 0.6 + Math.random() * 0.4,
        color: EDGE_COLORS[EdgeType.USED_IN],
        width: 2,
        opacity: 0.4,
        animated: true,
        metadata: {
          label: 'uses',
          bidirectional: false,
          createdAt: new Date(),
        },
      });
    });
  });
  
  // Create learning path nodes
  const learningPaths = [
    { id: 'path-1', label: 'Full Stack Web Dev', skills: ['react', 'nodejs', 'postgres', 'typescript'] },
    { id: 'path-2', label: 'Cloud & DevOps', skills: ['aws', 'docker', 'kubernetes'] },
  ];
  
  learningPaths.forEach((path, index) => {
    const angle = (index / learningPaths.length) * Math.PI * 2;
    const radius = 380;
    
    nodes.push({
      id: path.id,
      type: NodeType.LEARNING_PATH,
      label: path.label,
      description: `Learning path with ${path.skills.length} skills`,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      radius: 14,
      color: NODE_COLORS[NodeType.LEARNING_PATH],
      glowIntensity: 0.7,
      vx: 0,
      vy: 0,
      metadata: {
        learningHours: 40 + Math.random() * 80,
        connections: path.skills.length,
        tags: ['recommended', 'in-progress'],
      },
      state: NodeState.IDLE,
    });
    
    // Create edges from learning path to skills
    path.skills.forEach((skillId) => {
      edges.push({
        id: `${path.id}-${skillId}`,
        source: path.id,
        target: skillId,
        type: EdgeType.TEACHES,
        weight: 0.5 + Math.random() * 0.3,
        color: EDGE_COLORS[EdgeType.TEACHES],
        width: 1.5,
        opacity: 0.3,
        animated: false,
        metadata: {
          label: 'teaches',
          bidirectional: false,
          createdAt: new Date(),
        },
      });
    });
  });
  
  // Create skill-to-skill relationships
  const skillRelations = [
    ['react', 'nextjs', 0.9],
    ['react', 'typescript', 0.85],
    ['nodejs', 'typescript', 0.8],
    ['nodejs', 'graphql', 0.75],
    ['graphql', 'postgres', 0.7],
    ['docker', 'kubernetes', 0.8],
    ['aws', 'docker', 0.7],
    ['python', 'tensorflow', 0.85],
    ['react', 'tailwind', 0.8],
  ];
  
  skillRelations.forEach(([source, target, weight], index) => {
    edges.push({
      id: `skill-rel-${index}`,
      source: source as string,
      target: target as string,
      type: EdgeType.RELATED_TO,
      weight: weight as number,
      color: EDGE_COLORS[EdgeType.RELATED_TO],
      width: getEdgeWidth(weight as number),
      opacity: getEdgeOpacity(weight as number),
      animated: false,
      metadata: {
        label: 'related to',
        bidirectional: true,
        createdAt: new Date(),
      },
    });
  });
  
  // Update connection counts
  nodes.forEach((node) => {
    const connectionCount = edges.filter(
      (edge) => edge.source === node.id || edge.target === node.id
    ).length;
    node.metadata.connections = connectionCount;
  });
  
  return {
    id: 'skill-graph-1',
    name: 'My Skill Network',
    nodes,
    edges,
    layoutAlgorithm: LayoutAlgorithm.FORCE_DIRECTED,
    centerX,
    centerY,
    width,
    height,
  };
};

/**
 * Calculate graph statistics
 */
const calculateStats = (graph: SkillGraph): GraphStats => {
  const nodesByType: Record<NodeType, number> = {
    [NodeType.SKILL]: 0,
    [NodeType.PROJECT]: 0,
    [NodeType.LEARNING_PATH]: 0,
    [NodeType.DOMAIN]: 0,
    [NodeType.CERTIFICATION]: 0,
  };
  
  graph.nodes.forEach((node) => {
    nodesByType[node.type]++;
  });
  
  const edgesByType: Record<EdgeType, number> = {
    [EdgeType.REQUIRES]: 0,
    [EdgeType.RELATED_TO]: 0,
    [EdgeType.USED_IN]: 0,
    [EdgeType.TEACHES]: 0,
    [EdgeType.PART_OF]: 0,
    [EdgeType.LEADS_TO]: 0,
  };
  
  graph.edges.forEach((edge) => {
    edgesByType[edge.type]++;
  });
  
  const totalConnections = graph.edges.length;
  const avgConnections = totalConnections / graph.nodes.length;
  const maxConnections = Math.max(...graph.nodes.map((n) => n.metadata.connections || 0));
  
  const possibleEdges = (graph.nodes.length * (graph.nodes.length - 1)) / 2;
  const density = totalConnections / possibleEdges;
  
  return {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    nodesByType,
    edgesByType,
    avgConnections: Math.round(avgConnections * 10) / 10,
    maxConnections,
    clusters: 3, // Mock value
    density: Math.round(density * 1000) / 1000,
  };
};

// ============================================================================
// Context
// ============================================================================

const GraphContext = createContext<GraphContextType | undefined>(undefined);

interface GraphProviderProps {
  children: ReactNode;
}

export const GraphProvider = ({ children }: GraphProviderProps) => {
  const [graph, setGraph] = useState<SkillGraph | null>(generateMockGraph());
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [nodeDetails, setNodeDetails] = useState<NodeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [viewport, setViewport] = useState<ViewportConfig>({
    x: 0,
    y: 0,
    scale: 1,
    minScale: 0.1,
    maxScale: 5,
    transitionDuration: 300,
    smoothZoom: true,
  });
  
  const [physicsConfig, setPhysicsConfig] = useState<PhysicsConfig>({
    enabled: true,
    chargeStrength: -500,
    linkDistance: 100,
    linkStrength: 0.5,
    centerStrength: 0.05,
    collisionRadius: 30,
    alphaDecay: 0.02,
    velocityDecay: 0.4,
    iterations: 1,
  });
  
  const [filters, setFilters] = useState<GraphFilters>({
    category: FilterCategory.ALL,
    nodeTypes: [],
    edgeTypes: [],
    domains: [],
    searchQuery: '',
    minStrength: 0,
    maxStrength: 100,
    showVerifiedOnly: false,
    minConnections: 0,
  });
  
  const [stats, setStats] = useState<GraphStats | null>(
    graph ? calculateStats(graph) : null
  );
  
  // Actions
  const handleSelectNode = useCallback((node: GraphNode | null) => {
    setSelectedNode(node);
    setShowDetailPanel(!!node);
    
    if (node && graph) {
      const incomingEdges = graph.edges.filter((e) => e.target === node.id);
      const outgoingEdges = graph.edges.filter((e) => e.source === node.id);
      const connectedNodeIds = [
        ...incomingEdges.map((e) => e.source),
        ...outgoingEdges.map((e) => e.target),
      ];
      const connectedNodes = graph.nodes.filter((n) => connectedNodeIds.includes(n.id));
      
      setNodeDetails({
        node,
        incomingEdges,
        outgoingEdges,
        connectedNodes,
        totalConnections: incomingEdges.length + outgoingEdges.length,
      });
    } else {
      setNodeDetails(null);
    }
  }, [graph]);
  
  const handleHoverNode = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
  }, []);
  
  const handleDragNode = useCallback((nodeId: string, x: number, y: number) => {
    setGraph((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, fx: x, fy: y, state: NodeState.DRAGGING }
            : node
        ),
      };
    });
    setIsDragging(true);
  }, []);
  
  const handleReleaseNode = useCallback((nodeId: string) => {
    setGraph((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        nodes: prev.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, fx: undefined, fy: undefined, state: NodeState.IDLE }
            : node
        ),
      };
    });
    setIsDragging(false);
  }, []);
  
  const handleZoomIn = useCallback(() => {
    setViewport((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, prev.maxScale),
    }));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setViewport((prev) => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, prev.minScale),
    }));
  }, []);
  
  const handleResetZoom = useCallback(() => {
    setViewport((prev) => ({
      ...prev,
      scale: 1,
      x: 0,
      y: 0,
    }));
  }, []);
  
  const handlePanTo = useCallback((x: number, y: number) => {
    setViewport((prev) => ({ ...prev, x, y }));
  }, []);
  
  const handleFitToView = useCallback(() => {
    // Reset to center and scale to fit
    handleResetZoom();
  }, [handleResetZoom]);
  
  const handleUpdateFilters = useCallback((newFilters: Partial<GraphFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);
  
  const handleResetFilters = useCallback(() => {
    setFilters({
      category: FilterCategory.ALL,
      nodeTypes: [],
      edgeTypes: [],
      domains: [],
      searchQuery: '',
      minStrength: 0,
      maxStrength: 100,
      showVerifiedOnly: false,
      minConnections: 0,
    });
  }, []);
  
  const handleSetLayoutAlgorithm = useCallback((algorithm: LayoutAlgorithm) => {
    setGraph((prev) => {
      if (!prev) return prev;
      return { ...prev, layoutAlgorithm: algorithm };
    });
  }, []);
  
  const handleRegenerateLayout = useCallback(() => {
    setGraph(generateMockGraph());
    setStats(graph ? calculateStats(graph) : null);
  }, [graph]);
  
  const handleTogglePhysics = useCallback(() => {
    setIsSimulating((prev) => !prev);
    setPhysicsConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, []);
  
  const handleUpdatePhysicsConfig = useCallback((config: Partial<PhysicsConfig>) => {
    setPhysicsConfig((prev) => ({ ...prev, ...config }));
  }, []);
  
  const handleRefreshGraph = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setGraph(generateMockGraph());
    setStats(graph ? calculateStats(graph) : null);
    setIsLoading(false);
  }, [graph]);
  
  const handleExportGraph = useCallback((config: GraphExportConfig) => {
    console.log('Exporting graph with config:', config);
    // Export logic would go here
  }, []);
  
  const handleToggleDetailPanel = useCallback(() => {
    setShowDetailPanel((prev) => !prev);
  }, []);
  
  const state: GraphState = {
    graph,
    selectedNode,
    hoveredNode,
    nodeDetails,
    viewport,
    physicsConfig,
    isSimulating,
    filters,
    isPanning,
    isDragging,
    isLoading,
    showDetailPanel,
    stats,
  };
  
  const actions: GraphActions = {
    selectNode: handleSelectNode,
    hoverNode: handleHoverNode,
    dragNode: handleDragNode,
    releaseNode: handleReleaseNode,
    zoomIn: handleZoomIn,
    zoomOut: handleZoomOut,
    resetZoom: handleResetZoom,
    panTo: handlePanTo,
    fitToView: handleFitToView,
    updateFilters: handleUpdateFilters,
    resetFilters: handleResetFilters,
    setLayoutAlgorithm: handleSetLayoutAlgorithm,
    regenerateLayout: handleRegenerateLayout,
    togglePhysics: handleTogglePhysics,
    updatePhysicsConfig: handleUpdatePhysicsConfig,
    refreshGraph: handleRefreshGraph,
    exportGraph: handleExportGraph,
    toggleDetailPanel: handleToggleDetailPanel,
  };
  
  return (
    <GraphContext.Provider value={{ state, actions }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraph = (): GraphContextType => {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within GraphProvider');
  }
  return context;
};
