/**
 * Team Skills Heatmap Feature - Index
 * 
 * Exports all components, types, and context for the team skills heatmap feature.
 */

// Context
export { TeamHeatmapProvider, useTeamHeatmap } from './context/TeamSkillsHeatmapContext';

// Types
export * from './types/team-skills-heatmap.types';

// Components
export { TeamAvatarHeader, TeamAvatarRow } from './presentation/components/team-heatmap/TeamAvatarHeader';
export { TeamHeatmapCellComponent } from './presentation/components/team-heatmap/TeamHeatmapCell';
export { TeamSkillsHeatmapGrid } from './presentation/components/team-heatmap/TeamSkillsHeatmapGrid';
export { ProficiencyLegend } from './presentation/components/team-heatmap/ProficiencyLegend';
export { TeamInsightsPanel } from './presentation/components/team-heatmap/TeamInsightsPanel';
