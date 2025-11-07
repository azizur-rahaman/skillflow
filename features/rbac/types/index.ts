/**
 * Role-Based Access Control (RBAC) Feature Types
 * Following SkillFlow Nexus architecture patterns
 */

export type AccessLevel = 'none' | 'read' | 'write' | 'admin' | 'full';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string; // For UI color coding
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  accessLevel: AccessLevel;
  grantedBy: string;
  grantedAt: Date;
}

export interface PermissionMatrix {
  roles: Role[];
  permissions: Permission[];
  matrix: Record<string, Record<string, AccessLevel>>; // roleId -> permissionId -> accessLevel
}

export interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface RBACUpdateData {
  roleId: string;
  permissionId: string;
  accessLevel: AccessLevel;
}

export interface BulkPermissionUpdate {
  updates: RBACUpdateData[];
  reason?: string;
}

export interface AccessLevelConfig {
  level: AccessLevel;
  label: string;
  color: string;
  description: string;
  icon: string;
}

// Predefined access level configurations
export const ACCESS_LEVELS: AccessLevelConfig[] = [
  {
    level: 'none',
    label: 'No Access',
    color: 'bg-gray-500',
    description: 'No access to this feature',
    icon: 'X'
  },
  {
    level: 'read',
    label: 'Read Only',
    color: 'bg-blue-500',
    description: 'Can view but not modify',
    icon: 'Eye'
  },
  {
    level: 'write',
    label: 'Read & Write',
    color: 'bg-yellow-500',
    description: 'Can view and modify',
    icon: 'Edit'
  },
  {
    level: 'admin',
    label: 'Admin',
    color: 'bg-purple-500',
    description: 'Full control including user management',
    icon: 'Shield'
  },
  {
    level: 'full',
    label: 'Full Access',
    color: 'bg-green-500',
    description: 'Complete system access',
    icon: 'Crown'
  }
];

// Predefined permissions organized by categories
export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'user-management',
    name: 'User Management',
    description: 'Control over user accounts and profiles',
    permissions: [
      {
        id: 'users.view',
        name: 'View Users',
        description: 'View user profiles and basic information',
        category: 'user-management',
        resource: 'users'
      },
      {
        id: 'users.create',
        name: 'Create Users',
        description: 'Create new user accounts',
        category: 'user-management',
        resource: 'users'
      },
      {
        id: 'users.edit',
        name: 'Edit Users',
        description: 'Modify user profiles and settings',
        category: 'user-management',
        resource: 'users'
      },
      {
        id: 'users.delete',
        name: 'Delete Users',
        description: 'Remove user accounts',
        category: 'user-management',
        resource: 'users'
      }
    ]
  },
  {
    id: 'skill-management',
    name: 'Skill Management',
    description: 'Control over skills, assessments, and learning content',
    permissions: [
      {
        id: 'skills.view',
        name: 'View Skills',
        description: 'View skill definitions and data',
        category: 'skill-management',
        resource: 'skills'
      },
      {
        id: 'skills.create',
        name: 'Create Skills',
        description: 'Define new skills in the system',
        category: 'skill-management',
        resource: 'skills'
      },
      {
        id: 'skills.edit',
        name: 'Edit Skills',
        description: 'Modify skill definitions and metadata',
        category: 'skill-management',
        resource: 'skills'
      },
      {
        id: 'assessments.manage',
        name: 'Manage Assessments',
        description: 'Create and manage skill assessments',
        category: 'skill-management',
        resource: 'assessments'
      }
    ]
  },
  {
    id: 'analytics-reporting',
    name: 'Analytics & Reporting',
    description: 'Access to analytics, reports, and insights',
    permissions: [
      {
        id: 'analytics.view',
        name: 'View Analytics',
        description: 'Access dashboard analytics and metrics',
        category: 'analytics-reporting',
        resource: 'analytics'
      },
      {
        id: 'reports.generate',
        name: 'Generate Reports',
        description: 'Create and export reports',
        category: 'analytics-reporting',
        resource: 'reports'
      },
      {
        id: 'forecast.view',
        name: 'View Forecasts',
        description: 'Access skill demand forecasting',
        category: 'analytics-reporting',
        resource: 'forecast'
      }
    ]
  },
  {
    id: 'system-administration',
    name: 'System Administration',
    description: 'System-level controls and configuration',
    permissions: [
      {
        id: 'system.config',
        name: 'System Configuration',
        description: 'Modify system settings and configuration',
        category: 'system-administration',
        resource: 'system'
      },
      {
        id: 'roles.manage',
        name: 'Manage Roles',
        description: 'Create and modify user roles and permissions',
        category: 'system-administration',
        resource: 'roles'
      },
      {
        id: 'audit.view',
        name: 'View Audit Logs',
        description: 'Access system audit logs and activity',
        category: 'system-administration',
        resource: 'audit'
      }
    ]
  }
];

// Default roles
export const DEFAULT_ROLES: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access and user management',
    color: '#EF4444',
    isSystemRole: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Team management and analytics access',
    color: '#F59E0B',
    isSystemRole: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'analyst',
    name: 'Analyst',
    description: 'Read-only access to analytics and reports',
    color: '#3B82F6',
    isSystemRole: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'user',
    name: 'User',
    description: 'Basic user access to personal features',
    color: '#10B981',
    isSystemRole: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];