/**
 * Team Avatar Column Header Component
 * 
 * Displays team member avatars, names, roles, and average proficiency
 * as column headers in the heatmap.
 */

'use client';

import { TeamMember, getProficiencyColor } from '../../../types/team-skills-heatmap.types';
import { User, Crown, Shield, Code, Palette, BarChart3 } from 'lucide-react';

interface TeamAvatarHeaderProps {
  member: TeamMember;
  columnWidth?: number;
  showDetails?: boolean;
}

/**
 * Get role icon based on team member role
 */
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'lead':
      return Crown;
    case 'architect':
      return Shield;
    case 'developer':
      return Code;
    case 'designer':
      return Palette;
    case 'analyst':
      return BarChart3;
    default:
      return User;
  }
};

export const TeamAvatarHeader = ({
  member,
  columnWidth = 120,
  showDetails = true,
}: TeamAvatarHeaderProps) => {
  const RoleIcon = getRoleIcon(member.role);
  const avgColor = getProficiencyColor(member.averageProficiency);

  return (
    <div
      className="flex flex-col items-center py-4 px-2 transition-all hover:bg-slate-800/50 rounded-t-xl group"
      style={{ width: columnWidth }}
    >
      {/* Avatar */}
      <div className="relative mb-3">
        <div
          className="w-16 h-16 rounded-full overflow-hidden border-2 transition-all group-hover:scale-110 group-hover:shadow-lg"
          style={{
            borderColor: avgColor,
            boxShadow: `0 0 20px ${avgColor}40`,
          }}
        >
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Role badge */}
        <div
          className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-900"
          style={{ backgroundColor: avgColor }}
        >
          <RoleIcon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Name */}
      <div className="text-center mb-2">
        <h3 className="text-sm font-semibold text-white truncate max-w-full px-1">
          {member.name}
        </h3>
        <p className="text-xs text-slate-400 capitalize mt-0.5">
          {member.role.replace('_', ' ')}
        </p>
      </div>

      {showDetails && (
        <>
          {/* Average proficiency */}
          <div className="w-full mb-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs text-slate-400">Avg</span>
              <span
                className="text-xs font-bold"
                style={{ color: avgColor }}
              >
                {member.averageProficiency}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${member.averageProficiency}%`,
                  backgroundColor: avgColor,
                  boxShadow: `0 0 8px ${avgColor}80`,
                }}
              />
            </div>
          </div>

          {/* Skills count */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-slate-400">
                {member.totalSkills} skills
              </span>
            </div>
          </div>

          {/* Top skill badge */}
          {member.topSkills.length > 0 && (
            <div className="mt-2 px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-xs font-medium text-indigo-400 truncate max-w-full">
                ⭐ {member.topSkills[0].name}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Team Avatar Row Component
 * Displays all team member avatars in a horizontal row
 */
interface TeamAvatarRowProps {
  members: TeamMember[];
  columnWidth?: number;
  rowLabelWidth?: number;
  showDetails?: boolean;
}

export const TeamAvatarRow = ({
  members,
  columnWidth = 120,
  rowLabelWidth = 200,
  showDetails = true,
}: TeamAvatarRowProps) => {
  return (
    <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="flex items-start">
        {/* Empty space for row labels */}
        <div
          className="flex-shrink-0 border-r border-slate-700"
          style={{ width: rowLabelWidth }}
        >
          <div className="h-full flex items-end justify-end p-4">
            <div className="text-right">
              <h3 className="text-sm font-bold text-white mb-1">
                Team Members →
              </h3>
              <p className="text-xs text-slate-400">
                {members.length} members
              </p>
            </div>
          </div>
        </div>

        {/* Team member avatars */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex">
            {members.map((member, index) => (
              <div
                key={member.id}
                className="flex-shrink-0 animate-domain-fade"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TeamAvatarHeader
                  member={member}
                  columnWidth={columnWidth}
                  showDetails={showDetails}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
