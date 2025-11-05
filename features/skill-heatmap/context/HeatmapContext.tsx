/**
 * Skill Heatmap Context
 * 
 * State management for interactive skill comparison heatmap.
 * Provides matrix data, filters, and comparison functionality.
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  HeatmapContextType,
  HeatmapState,
  HeatmapActions,
  HeatmapMatrix,
  HeatmapCell,
  HeatmapRow,
  HeatmapColumn,
  HeatmapFilter,
  LegendConfig,
  ComparisonData,
  ExportConfig,
  ViewMode,
  TimeFrame,
  ColorScheme,
  SkillDomain,
  CompetencyLevel,
  getCompetencyColor,
  getCompetencyLevel,
  getDomainLabel,
} from '../types/heatmap.types';

// ============================================================================
// Mock Data Generation
// ============================================================================

const SKILLS_BY_DOMAIN: Record<SkillDomain, string[]> = {
  [SkillDomain.FRONTEND]: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js'],
  [SkillDomain.BACKEND]: ['Node.js', 'Python', 'PostgreSQL', 'Express', 'Django'],
  [SkillDomain.MOBILE]: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Expo'],
  [SkillDomain.DEVOPS]: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Jenkins'],
  [SkillDomain.DATA_SCIENCE]: ['Pandas', 'NumPy', 'Jupyter', 'R', 'Data Analysis'],
  [SkillDomain.AI_ML]: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision'],
  [SkillDomain.DESIGN]: ['Figma', 'Photoshop', 'UI/UX', 'Prototyping', 'Design Systems'],
  [SkillDomain.CLOUD]: ['AWS', 'Azure', 'GCP', 'Lambda', 'S3'],
  [SkillDomain.SECURITY]: ['OAuth', 'JWT', 'Encryption', 'Penetration Testing', 'OWASP'],
  [SkillDomain.LEADERSHIP]: ['Team Management', 'Mentoring', 'Strategy', 'Agile', 'Scrum'],
  [SkillDomain.SOFT_SKILLS]: ['Communication', 'Problem Solving', 'Creativity', 'Critical Thinking', 'Collaboration'],
};

const TEAM_MEMBERS = ['Alice Chen', 'Bob Smith', 'Carol Johnson', 'David Lee', 'Emma Wilson'];

/**
 * Generate mock heatmap matrix
 */
const generateMockMatrix = (viewMode: ViewMode, timeFrame: TimeFrame): HeatmapMatrix => {
  let rows: HeatmapRow[] = [];
  let columns: HeatmapColumn[] = [];
  let cells: HeatmapCell[][] = [];

  if (viewMode === ViewMode.SKILLS_BY_DOMAIN) {
    // Rows: Skills, Columns: Domains
    const allSkills: string[] = [];
    const domains = Object.keys(SKILLS_BY_DOMAIN) as SkillDomain[];
    
    domains.forEach((domain) => {
      allSkills.push(...SKILLS_BY_DOMAIN[domain]);
    });

    // Create columns for each domain
    columns = domains.map((domain) => ({
      id: domain,
      label: getDomainLabel(domain),
      category: domain,
      cells: [],
      averageValue: 0,
    }));

    // Create rows for each skill
    rows = allSkills.slice(0, 20).map((skill, skillIndex) => {
      const rowCells: HeatmapCell[] = [];
      
      columns.forEach((column) => {
        const domain = column.id as SkillDomain;
        const value = SKILLS_BY_DOMAIN[domain].includes(skill)
          ? 50 + Math.random() * 50 // 50-100 for matching domain
          : Math.random() * 40; // 0-40 for non-matching
        
        const competencyLevel = getCompetencyLevel(value);
        const color = getCompetencyColor(value);

        const cell: HeatmapCell = {
          id: `${skill}-${domain}`,
          row: skill,
          column: domain,
          value: Math.round(value),
          competencyLevel,
          color,
          label: `${skill} - ${getDomainLabel(domain)}`,
          metadata: {
            skillName: skill,
            domain,
            lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending',
            endorsements: Math.floor(Math.random() * 20),
            projectsUsed: Math.floor(Math.random() * 15),
          },
        };

        rowCells.push(cell);
      });

      const averageValue = rowCells.reduce((sum, c) => sum + c.value, 0) / rowCells.length;

      return {
        id: skill,
        label: skill,
        cells: rowCells,
        averageValue: Math.round(averageValue),
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'stable' : 'down',
      };
    });

    // Build 2D cells array
    cells = rows.map((row) => row.cells);

  } else if (viewMode === ViewMode.SKILLS_BY_TEAM) {
    // Rows: Skills, Columns: Team Members
    const topSkills = [
      'React', 'TypeScript', 'Node.js', 'Python', 'Docker',
      'AWS', 'PostgreSQL', 'Next.js', 'TensorFlow', 'Figma',
    ];

    columns = TEAM_MEMBERS.map((member) => ({
      id: member,
      label: member,
      category: 'team',
      cells: [],
      averageValue: 0,
    }));

    rows = topSkills.map((skill) => {
      const rowCells: HeatmapCell[] = [];

      columns.forEach((column) => {
        const value = 30 + Math.random() * 70; // 30-100
        const competencyLevel = getCompetencyLevel(value);
        const color = getCompetencyColor(value);

        const cell: HeatmapCell = {
          id: `${skill}-${column.id}`,
          row: skill,
          column: column.id,
          value: Math.round(value),
          competencyLevel,
          color,
          label: `${skill} - ${column.label}`,
          metadata: {
            skillName: skill,
            teamMember: column.label,
            lastUpdated: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
            verificationStatus: Math.random() > 0.2 ? 'verified' : 'unverified',
            endorsements: Math.floor(Math.random() * 30),
            projectsUsed: Math.floor(Math.random() * 20),
          },
        };

        rowCells.push(cell);
      });

      const averageValue = rowCells.reduce((sum, c) => sum + c.value, 0) / rowCells.length;

      return {
        id: skill,
        label: skill,
        cells: rowCells,
        averageValue: Math.round(averageValue),
        trend: Math.random() > 0.5 ? 'up' : 'stable',
      };
    });

    cells = rows.map((row) => row.cells);
  }

  // Update column average values
  columns.forEach((column, colIndex) => {
    const columnCells = rows.map((row) => row.cells[colIndex]);
    column.averageValue = Math.round(
      columnCells.reduce((sum, c) => sum + c.value, 0) / columnCells.length
    );
    column.cells = columnCells;
  });

  return {
    id: `matrix-${viewMode}-${timeFrame}`,
    title: `Skill Heatmap - ${viewMode.replace(/_/g, ' ').toUpperCase()}`,
    rows,
    columns,
    cells,
    viewMode,
    timeFrame,
  };
};

/**
 * Generate comparison data
 */
const generateComparisonData = (): ComparisonData[] => {
  const domains = Object.keys(SKILLS_BY_DOMAIN) as SkillDomain[];

  return domains.slice(0, 4).map((domain) => {
    const skills = SKILLS_BY_DOMAIN[domain];
    const totalSkills = skills.length;
    const averageStrength = 50 + Math.random() * 30;

    return {
      id: domain,
      name: getDomainLabel(domain),
      type: 'domain',
      totalSkills,
      averageStrength: Math.round(averageStrength),
      topSkills: skills.slice(0, 3).map((skill) => ({
        name: skill,
        strength: 70 + Math.random() * 30,
        domain,
      })),
      weakestSkills: skills.slice(-2).map((skill) => ({
        name: skill,
        strength: 20 + Math.random() * 30,
        domain,
      })),
      domainDistribution: {
        [domain]: 100,
      } as Record<SkillDomain, number>,
    };
  });
};

// ============================================================================
// Context
// ============================================================================

const HeatmapContext = createContext<HeatmapContextType | undefined>(undefined);

interface HeatmapProviderProps {
  children: ReactNode;
}

export const HeatmapProvider = ({ children }: HeatmapProviderProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SKILLS_BY_DOMAIN);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.CURRENT);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(ColorScheme.COOL_TO_WARM);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState<HeatmapFilter>({
    domains: [],
    timeFrame: TimeFrame.CURRENT,
    competencyLevels: [],
    searchQuery: '',
    showVerifiedOnly: false,
    minValue: 0,
    maxValue: 100,
  });

  const [legendConfig] = useState<LegendConfig>({
    colorScheme: ColorScheme.COOL_TO_WARM,
    minValue: 0,
    maxValue: 100,
    steps: [
      { value: 0, color: '#3B82F6', label: 'Novice (0-20)' },
      { value: 20, color: '#22D3EE', label: 'Beginner (21-40)' },
      { value: 40, color: '#10B981', label: 'Intermediate (41-60)' },
      { value: 60, color: '#F59E0B', label: 'Advanced (61-80)' },
      { value: 80, color: '#EF4444', label: 'Expert (81-100)' },
    ],
    showValues: true,
  });

  const [matrix, setMatrix] = useState<HeatmapMatrix | null>(
    generateMockMatrix(viewMode, timeFrame)
  );

  const [comparisonData, setComparisonData] = useState<ComparisonData[]>(
    generateComparisonData()
  );

  // Actions
  const handleSetViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setMatrix(generateMockMatrix(mode, timeFrame));
  }, [timeFrame]);

  const handleUpdateFilters = useCallback((newFilters: Partial<HeatmapFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleSetTimeFrame = useCallback((newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
    setFilters((prev) => ({ ...prev, timeFrame: newTimeFrame }));
    setMatrix(generateMockMatrix(viewMode, newTimeFrame));
  }, [viewMode]);

  const handleSelectCell = useCallback((cell: HeatmapCell | null) => {
    setSelectedCell(cell);
  }, []);

  const handleHoverCell = useCallback((cell: HeatmapCell | null) => {
    setHoveredCell(cell);
  }, []);

  const handleSetColorScheme = useCallback((scheme: ColorScheme) => {
    setColorScheme(scheme);
    // Regenerate matrix with new color scheme
    if (matrix) {
      const updatedMatrix = { ...matrix };
      updatedMatrix.cells.forEach((row) => {
        row.forEach((cell) => {
          cell.color = getCompetencyColor(cell.value, scheme);
        });
      });
      setMatrix(updatedMatrix);
    }
  }, [matrix]);

  const handleRefreshData = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setMatrix(generateMockMatrix(viewMode, timeFrame));
    setComparisonData(generateComparisonData());
    setIsLoading(false);
  }, [viewMode, timeFrame]);

  const handleExportHeatmap = useCallback((config: ExportConfig) => {
    console.log('Exporting heatmap with config:', config);
    // Export logic would go here
  }, []);

  const handleCompareTeams = useCallback((teamIds: string[]) => {
    console.log('Comparing teams:', teamIds);
    // Comparison logic would go here
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      domains: [],
      timeFrame: TimeFrame.CURRENT,
      competencyLevels: [],
      searchQuery: '',
      showVerifiedOnly: false,
      minValue: 0,
      maxValue: 100,
    });
  }, []);

  const state: HeatmapState = {
    matrix,
    filters,
    legendConfig,
    viewMode,
    selectedCell,
    hoveredCell,
    comparisonData,
    isLoading,
    colorScheme,
  };

  const actions: HeatmapActions = {
    setViewMode: handleSetViewMode,
    updateFilters: handleUpdateFilters,
    setTimeFrame: handleSetTimeFrame,
    selectCell: handleSelectCell,
    hoverCell: handleHoverCell,
    setColorScheme: handleSetColorScheme,
    refreshData: handleRefreshData,
    exportHeatmap: handleExportHeatmap,
    compareTeams: handleCompareTeams,
    resetFilters: handleResetFilters,
  };

  return (
    <HeatmapContext.Provider value={{ state, actions }}>
      {children}
    </HeatmapContext.Provider>
  );
};

export const useHeatmap = (): HeatmapContextType => {
  const context = useContext(HeatmapContext);
  if (!context) {
    throw new Error('useHeatmap must be used within HeatmapProvider');
  }
  return context;
};
