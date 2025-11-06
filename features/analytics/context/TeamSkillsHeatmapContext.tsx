/**
 * Team Skills Heatmap Context
 * 
 * State management for team skills comparison heatmap.
 * Provides matrix data, filters, gaps analysis, and team insights.
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  TeamHeatmapContextType,
  TeamHeatmapState,
  TeamHeatmapActions,
  TeamSkillsMatrix,
  TeamMember,
  Skill,
  TeamHeatmapCell,
  TeamHeatmapFilter,
  ProficiencyLegend,
  SkillGap,
  TeamStrength,
  ExportConfig,
  SkillCategory,
  ProficiencyLevel,
  VerificationStatus,
  TeamMemberRole,
  getProficiencyLevel,
  getProficiencyColor,
  getProficiencyLabel,
  calculateGapPriority,
} from '../types/team-skills-heatmap.types';

// ============================================================================
// Mock Data Generation
// ============================================================================

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: TeamMemberRole.LEAD,
    department: 'Engineering',
    email: 'sarah.chen@company.com',
    totalSkills: 12,
    averageProficiency: 82,
    topSkills: [
      { name: 'React', proficiency: 95, category: SkillCategory.FRONTEND },
      { name: 'TypeScript', proficiency: 90, category: SkillCategory.FRONTEND },
      { name: 'Leadership', proficiency: 88, category: SkillCategory.LEADERSHIP },
    ],
  },
  {
    id: 'tm-2',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    role: TeamMemberRole.DEVELOPER,
    department: 'Engineering',
    email: 'marcus.j@company.com',
    totalSkills: 10,
    averageProficiency: 75,
    topSkills: [
      { name: 'Node.js', proficiency: 88, category: SkillCategory.BACKEND },
      { name: 'Docker', proficiency: 85, category: SkillCategory.DEVOPS },
      { name: 'PostgreSQL', proficiency: 80, category: SkillCategory.BACKEND },
    ],
  },
  {
    id: 'tm-3',
    name: 'Priya Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    role: TeamMemberRole.DESIGNER,
    department: 'Design',
    email: 'priya.patel@company.com',
    totalSkills: 9,
    averageProficiency: 78,
    topSkills: [
      { name: 'Figma', proficiency: 92, category: SkillCategory.DESIGN },
      { name: 'UI/UX Design', proficiency: 90, category: SkillCategory.DESIGN },
      { name: 'User Research', proficiency: 85, category: SkillCategory.SOFT_SKILLS },
    ],
  },
  {
    id: 'tm-4',
    name: 'Alex Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: TeamMemberRole.DEVELOPER,
    department: 'Engineering',
    email: 'alex.r@company.com',
    totalSkills: 11,
    averageProficiency: 70,
    topSkills: [
      { name: 'Python', proficiency: 85, category: SkillCategory.BACKEND },
      { name: 'TensorFlow', proficiency: 78, category: SkillCategory.AI_ML },
      { name: 'AWS', proficiency: 72, category: SkillCategory.CLOUD },
    ],
  },
  {
    id: 'tm-5',
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    role: TeamMemberRole.ARCHITECT,
    department: 'Engineering',
    email: 'emma.wilson@company.com',
    totalSkills: 14,
    averageProficiency: 84,
    topSkills: [
      { name: 'System Design', proficiency: 93, category: SkillCategory.BACKEND },
      { name: 'Kubernetes', proficiency: 90, category: SkillCategory.DEVOPS },
      { name: 'Microservices', proficiency: 88, category: SkillCategory.BACKEND },
    ],
  },
  {
    id: 'tm-6',
    name: 'James Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    role: TeamMemberRole.DEVELOPER,
    department: 'Engineering',
    email: 'james.kim@company.com',
    totalSkills: 8,
    averageProficiency: 68,
    topSkills: [
      { name: 'React Native', proficiency: 82, category: SkillCategory.MOBILE },
      { name: 'Swift', proficiency: 75, category: SkillCategory.MOBILE },
      { name: 'Redux', proficiency: 70, category: SkillCategory.FRONTEND },
    ],
  },
];

const MOCK_SKILLS: Skill[] = [
  { id: 's-1', name: 'React', category: SkillCategory.FRONTEND, description: 'React.js library', inDemand: true, trendingScore: 95 },
  { id: 's-2', name: 'TypeScript', category: SkillCategory.FRONTEND, description: 'TypeScript language', inDemand: true, trendingScore: 92 },
  { id: 's-3', name: 'Node.js', category: SkillCategory.BACKEND, description: 'Node.js runtime', inDemand: true, trendingScore: 88 },
  { id: 's-4', name: 'Python', category: SkillCategory.BACKEND, description: 'Python programming', inDemand: true, trendingScore: 90 },
  { id: 's-5', name: 'Docker', category: SkillCategory.DEVOPS, description: 'Container platform', inDemand: true, trendingScore: 85 },
  { id: 's-6', name: 'Kubernetes', category: SkillCategory.DEVOPS, description: 'Container orchestration', inDemand: true, trendingScore: 87 },
  { id: 's-7', name: 'AWS', category: SkillCategory.CLOUD, description: 'Amazon Web Services', inDemand: true, trendingScore: 91 },
  { id: 's-8', name: 'PostgreSQL', category: SkillCategory.BACKEND, description: 'PostgreSQL database', inDemand: true, trendingScore: 80 },
  { id: 's-9', name: 'Figma', category: SkillCategory.DESIGN, description: 'Design tool', inDemand: true, trendingScore: 86 },
  { id: 's-10', name: 'TensorFlow', category: SkillCategory.AI_ML, description: 'ML framework', inDemand: true, trendingScore: 89 },
  { id: 's-11', name: 'System Design', category: SkillCategory.BACKEND, description: 'Architecture design', inDemand: true, trendingScore: 93 },
  { id: 's-12', name: 'Leadership', category: SkillCategory.LEADERSHIP, description: 'Team leadership', inDemand: false, trendingScore: 75 },
];

/**
 * Generate mock heatmap matrix with realistic team data
 */
const generateMockMatrix = (): TeamSkillsMatrix => {
  const cells: TeamHeatmapCell[][] = [];

  // Generate cells for each skill x team member combination
  MOCK_SKILLS.forEach((skill) => {
    const row: TeamHeatmapCell[] = [];

    MOCK_TEAM_MEMBERS.forEach((member) => {
      // Determine proficiency based on member's specialty
      let baseProficiency = 40; // Default base

      // Higher proficiency for matching categories
      const memberTopSkill = member.topSkills.find((s) => s.name === skill.name);
      if (memberTopSkill) {
        baseProficiency = memberTopSkill.proficiency;
      } else if (member.topSkills.some((s) => s.category === skill.category)) {
        baseProficiency = 55 + Math.random() * 25; // 55-80
      } else {
        baseProficiency = 15 + Math.random() * 40; // 15-55
      }

      const proficiency = Math.round(baseProficiency);
      const proficiencyLevel = getProficiencyLevel(proficiency);
      const color = getProficiencyColor(proficiency);

      const cell: TeamHeatmapCell = {
        id: `${skill.id}-${member.id}`,
        skillId: skill.id,
        skillName: skill.name,
        teamMemberId: member.id,
        teamMemberName: member.name,
        proficiency,
        proficiencyLevel,
        verificationStatus:
          proficiency >= 70
            ? VerificationStatus.VERIFIED
            : proficiency >= 50
            ? VerificationStatus.PENDING
            : VerificationStatus.SELF_REPORTED,
        color,
        metadata: {
          lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          endorsements: Math.floor(proficiency / 10),
          certificationsCount: proficiency >= 80 ? Math.floor(Math.random() * 3) + 1 : 0,
          projectsUsed: Math.floor(proficiency / 15),
          yearsExperience: proficiency >= 80 ? 3 + Math.random() * 5 : Math.random() * 3,
          selfAssessment: proficiency,
          managerAssessment: proficiency >= 60 ? proficiency + Math.random() * 10 - 5 : undefined,
          peerAssessments: Array.from({ length: 3 }, () => proficiency + Math.random() * 20 - 10),
        },
      };

      row.push(cell);
    });

    cells.push(row);
  });

  // Calculate statistics
  const allProficiencies = cells.flat().map((c) => c.proficiency);
  const averageTeamProficiency = Math.round(
    allProficiencies.reduce((sum, p) => sum + p, 0) / allProficiencies.length
  );

  // Identify gaps (skills below 60% average)
  const gaps: SkillGap[] = MOCK_SKILLS.map((skill, skillIndex) => {
    const skillCells = cells[skillIndex];
    const averageProficiency = Math.round(
      skillCells.reduce((sum, c) => sum + c.proficiency, 0) / skillCells.length
    );
    const requiredLevel = 70;
    const gapPercentage = Math.max(0, requiredLevel - averageProficiency);

    return {
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      requiredLevel,
      currentAverage: averageProficiency,
      gapPercentage,
      affectedMembers: skillCells
        .filter((c) => c.proficiency < requiredLevel)
        .map((c) => ({
          memberId: c.teamMemberId,
          memberName: c.teamMemberName,
          currentLevel: c.proficiency,
          gapAmount: requiredLevel - c.proficiency,
        })),
      priority: calculateGapPriority(gapPercentage, skill.inDemand),
      recommendedActions: [
        'Assign mentor for knowledge transfer',
        'Enroll in targeted training program',
        'Provide hands-on project experience',
      ],
    };
  }).filter((gap) => gap.gapPercentage > 0);

  // Identify strengths (skills above 75% average)
  const strengths: TeamStrength[] = MOCK_SKILLS.map((skill, skillIndex) => {
    const skillCells = cells[skillIndex];
    const averageProficiency = Math.round(
      skillCells.reduce((sum, c) => sum + c.proficiency, 0) / skillCells.length
    );
    const teamCoverage = Math.round(
      (skillCells.filter((c) => c.proficiency >= 50).length / skillCells.length) * 100
    );

    return {
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      averageProficiency,
      teamCoverage,
      topPerformers: skillCells
        .sort((a, b) => b.proficiency - a.proficiency)
        .slice(0, 3)
        .map((c) => ({
          memberId: c.teamMemberId,
          memberName: c.teamMemberName,
          proficiency: c.proficiency,
        })),
      isCoreCopetency: averageProficiency >= 75 && teamCoverage >= 70,
    };
  }).filter((strength) => strength.averageProficiency >= 65);

  return {
    id: 'matrix-team-1',
    teamId: 'team-1',
    teamName: 'Product Engineering Team',
    members: MOCK_TEAM_MEMBERS,
    skills: MOCK_SKILLS,
    cells,
    lastUpdated: new Date(),
    statistics: {
      totalMembers: MOCK_TEAM_MEMBERS.length,
      totalSkills: MOCK_SKILLS.length,
      averageTeamProficiency,
      skillGapsCount: gaps.length,
      strengths,
      gaps,
    },
  };
};

// ============================================================================
// Context
// ============================================================================

const TeamHeatmapContext = createContext<TeamHeatmapContextType | undefined>(undefined);

interface TeamHeatmapProviderProps {
  children: ReactNode;
}

export const TeamHeatmapProvider = ({ children }: TeamHeatmapProviderProps) => {
  const [matrix, setMatrix] = useState<TeamSkillsMatrix | null>(generateMockMatrix());
  const [selectedCell, setSelectedCell] = useState<TeamHeatmapCell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<TeamHeatmapCell | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'comparison' | 'gaps'>('heatmap');

  const [filters, setFilters] = useState<TeamHeatmapFilter>({
    categories: [],
    proficiencyLevels: [],
    verificationStatus: [],
    searchQuery: '',
    showGapsOnly: false,
    showStrengthsOnly: false,
    minProficiency: 0,
    maxProficiency: 100,
    teamMemberIds: [],
  });

  const [legend] = useState<ProficiencyLegend>({
    levels: [
      {
        level: ProficiencyLevel.NONE,
        label: 'None',
        color: '#1E293B',
        minValue: 0,
        maxValue: 10,
        description: 'No experience with this skill',
      },
      {
        level: ProficiencyLevel.NOVICE,
        label: 'Novice',
        color: '#3B82F6',
        minValue: 11,
        maxValue: 30,
        description: 'Basic understanding, limited application',
      },
      {
        level: ProficiencyLevel.BEGINNER,
        label: 'Beginner',
        color: '#22D3EE',
        minValue: 31,
        maxValue: 50,
        description: 'Can work with guidance',
      },
      {
        level: ProficiencyLevel.INTERMEDIATE,
        label: 'Intermediate',
        color: '#10B981',
        minValue: 51,
        maxValue: 70,
        description: 'Can work independently',
      },
      {
        level: ProficiencyLevel.ADVANCED,
        label: 'Advanced',
        color: '#F59E0B',
        minValue: 71,
        maxValue: 85,
        description: 'Deep expertise, can mentor others',
      },
      {
        level: ProficiencyLevel.EXPERT,
        label: 'Expert',
        color: '#EF4444',
        minValue: 86,
        maxValue: 100,
        description: 'Subject matter expert, thought leader',
      },
    ],
    gradient: {
      start: '#1E293B',
      end: '#EF4444',
      steps: 6,
    },
  });

  // Actions
  const handleLoadTeamData = useCallback(async (teamId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMatrix(generateMockMatrix());
    } catch (err) {
      setError('Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateFilters = useCallback((newFilters: Partial<TeamHeatmapFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleSelectCell = useCallback((cell: TeamHeatmapCell | null) => {
    setSelectedCell(cell);
  }, []);

  const handleHoverCell = useCallback((cell: TeamHeatmapCell | null) => {
    setHoveredCell(cell);
  }, []);

  const handleRefreshData = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setMatrix(generateMockMatrix());
    setIsLoading(false);
  }, []);

  const handleExportHeatmap = useCallback((config: ExportConfig) => {
    console.log('Exporting team skills heatmap:', config);
    // Export implementation would go here
    const dataToExport = {
      matrix,
      filters,
      timestamp: new Date().toISOString(),
    };
    
    if (config.format === 'json') {
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `team-skills-heatmap-${Date.now()}.json`;
      a.click();
    }
  }, [matrix, filters]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      categories: [],
      proficiencyLevels: [],
      verificationStatus: [],
      searchQuery: '',
      showGapsOnly: false,
      showStrengthsOnly: false,
      minProficiency: 0,
      maxProficiency: 100,
      teamMemberIds: [],
    });
  }, []);

  const handleSetViewMode = useCallback((mode: 'heatmap' | 'comparison' | 'gaps') => {
    setViewMode(mode);
  }, []);

  const state: TeamHeatmapState = {
    matrix,
    filters,
    legend,
    selectedCell,
    hoveredCell,
    isLoading,
    error,
    viewMode,
  };

  const actions: TeamHeatmapActions = {
    loadTeamData: handleLoadTeamData,
    updateFilters: handleUpdateFilters,
    selectCell: handleSelectCell,
    hoverCell: handleHoverCell,
    refreshData: handleRefreshData,
    exportHeatmap: handleExportHeatmap,
    resetFilters: handleResetFilters,
    setViewMode: handleSetViewMode,
  };

  return (
    <TeamHeatmapContext.Provider value={{ state, actions }}>
      {children}
    </TeamHeatmapContext.Provider>
  );
};

export const useTeamHeatmap = (): TeamHeatmapContextType => {
  const context = useContext(TeamHeatmapContext);
  if (!context) {
    throw new Error('useTeamHeatmap must be used within TeamHeatmapProvider');
  }
  return context;
};
