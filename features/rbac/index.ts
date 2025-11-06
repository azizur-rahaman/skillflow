/**
 * RBAC Feature Exports
 * Role-Based Access Control management interface
 */

// Context
export { RBACProvider, useRBAC } from "./context/RBACContext";

// Components
export { RBACViewer } from "./presentation/RBACViewer";
export { PermissionMatrixTable } from "./presentation/components/PermissionMatrixTable";
export { RoleSelector } from "./presentation/components/RoleSelector";
export { SaveActions } from "./presentation/components/SaveActions";

// Types
export type {
  Role,
  Permission,
  PermissionMatrix,
  AccessLevel,
  RBACUpdateData,
  BulkPermissionUpdate,
  PermissionCategory,
  ACCESS_LEVELS,
} from "./types";

// Constants
export { PERMISSION_CATEGORIES, DEFAULT_ROLES } from "./types";
