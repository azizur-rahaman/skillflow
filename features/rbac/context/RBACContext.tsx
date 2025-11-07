"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  Role,
  PermissionMatrix,
  AccessLevel,
  RBACUpdateData,
  PERMISSION_CATEGORIES,
  DEFAULT_ROLES,
  ACCESS_LEVELS,
} from "../types";

interface RBACContextValue {
  // State
  permissionMatrix: PermissionMatrix;
  selectedRole: Role | null;
  isUpdating: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  setSelectedRole: (role: Role | null) => void;
  updatePermission: (
    roleId: string,
    permissionId: string,
    accessLevel: AccessLevel
  ) => void;
  bulkUpdatePermissions: (updates: RBACUpdateData[]) => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  resetToDefaults: () => void;

  // Computed
  getAccessLevel: (roleId: string, permissionId: string) => AccessLevel;
  getRolePermissions: (roleId: string) => Record<string, AccessLevel>;
  getPermissionCategories: () => typeof PERMISSION_CATEGORIES;
  getAccessLevelConfig: (
    level: AccessLevel
  ) => (typeof ACCESS_LEVELS)[0] | undefined;
}

const RBACContext = createContext<RBACContextValue | undefined>(undefined);

// Initialize default permission matrix
const createDefaultMatrix = (): PermissionMatrix => {
  const roles = DEFAULT_ROLES;
  const permissions = PERMISSION_CATEGORIES.flatMap((cat) => cat.permissions);

  const matrix: Record<string, Record<string, AccessLevel>> = {};

  // Initialize matrix with default permissions
  roles.forEach((role) => {
    matrix[role.id] = {};

    permissions.forEach((permission) => {
      // Set default access levels based on role
      let defaultLevel: AccessLevel = "none";

      switch (role.id) {
        case "admin":
          defaultLevel = "full";
          break;
        case "manager":
          // Managers get write access to most features except system admin
          defaultLevel =
            permission.category === "system-administration" ? "read" : "write";
          break;
        case "analyst":
          // Analysts get read access to analytics and some user data
          defaultLevel = ["analytics-reporting", "skill-management"].includes(
            permission.category
          )
            ? "read"
            : "none";
          break;
        case "user":
          // Basic users get minimal access
          defaultLevel =
            permission.resource === "users" && permission.id.includes("view")
              ? "read"
              : "none";
          break;
      }

      matrix[role.id][permission.id] = defaultLevel;
    });
  });

  return { roles, permissions, matrix };
};

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const [permissionMatrix, setPermissionMatrix] =
    useState<PermissionMatrix>(createDefaultMatrix);
  const [originalMatrix, setOriginalMatrix] =
    useState<PermissionMatrix>(createDefaultMatrix);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Track unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(permissionMatrix.matrix) !==
    JSON.stringify(originalMatrix.matrix);

  // Update permission for a specific role-permission combination
  const updatePermission = useCallback(
    (roleId: string, permissionId: string, accessLevel: AccessLevel) => {
      setPermissionMatrix((prev) => ({
        ...prev,
        matrix: {
          ...prev.matrix,
          [roleId]: {
            ...prev.matrix[roleId],
            [permissionId]: accessLevel,
          },
        },
      }));
    },
    []
  );

  // Bulk update multiple permissions
  const bulkUpdatePermissions = useCallback((updates: RBACUpdateData[]) => {
    setPermissionMatrix((prev) => {
      const newMatrix = { ...prev.matrix };

      updates.forEach((update) => {
        if (!newMatrix[update.roleId]) {
          newMatrix[update.roleId] = {};
        }
        newMatrix[update.roleId][update.permissionId] = update.accessLevel;
      });

      return {
        ...prev,
        matrix: newMatrix,
      };
    });
  }, []);

  // Save changes to backend (mock implementation)
  const saveChanges = useCallback(async () => {
    setIsUpdating(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update original matrix to reflect saved state
      setOriginalMatrix(permissionMatrix);

      console.log("RBAC permissions saved:", permissionMatrix);
    } finally {
      setIsUpdating(false);
    }
  }, [permissionMatrix]);

  // Discard unsaved changes
  const discardChanges = useCallback(() => {
    setPermissionMatrix(originalMatrix);
  }, [originalMatrix]);

  // Reset to default permissions
  const resetToDefaults = useCallback(() => {
    const defaultMatrix = createDefaultMatrix();
    setPermissionMatrix(defaultMatrix);
    setOriginalMatrix(defaultMatrix);
  }, []);

  // Get access level for a specific role-permission combination
  const getAccessLevel = useCallback(
    (roleId: string, permissionId: string): AccessLevel => {
      return permissionMatrix.matrix[roleId]?.[permissionId] || "none";
    },
    [permissionMatrix.matrix]
  );

  // Get all permissions for a role
  const getRolePermissions = useCallback(
    (roleId: string): Record<string, AccessLevel> => {
      return permissionMatrix.matrix[roleId] || {};
    },
    [permissionMatrix.matrix]
  );

  // Get permission categories
  const getPermissionCategories = useCallback(() => PERMISSION_CATEGORIES, []);

  // Get access level configuration
  const getAccessLevelConfig = useCallback((level: AccessLevel) => {
    return ACCESS_LEVELS.find((config) => config.level === level);
  }, []);

  const value: RBACContextValue = {
    permissionMatrix,
    selectedRole,
    isUpdating,
    hasUnsavedChanges,
    setSelectedRole,
    updatePermission,
    bulkUpdatePermissions,
    saveChanges,
    discardChanges,
    resetToDefaults,
    getAccessLevel,
    getRolePermissions,
    getPermissionCategories,
    getAccessLevelConfig,
  };

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error("useRBAC must be used within RBACProvider");
  }
  return context;
}
