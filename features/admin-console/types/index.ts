/**
 * Admin Console Types
 * System-wide control for user, data, and platform configuration
 */

export type AdminSection = "users" | "tokens" | "roles" | "logs";

export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export type UserRole = "admin" | "manager" | "user" | "viewer";

export type TokenType = "access" | "refresh" | "api" | "service";

export type LogLevel = "info" | "warning" | "error" | "critical";

export type BatchAction =
  | "activate"
  | "deactivate"
  | "delete"
  | "assign_role"
  | "revoke_tokens";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
  avatar?: string;
  department?: string;
  skillsCount: number;
  tokensCount: number;
}

export interface Token {
  id: string;
  name: string;
  type: TokenType;
  userId: string;
  userEmail: string;
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
  isActive: boolean;
  permissions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystemRole: boolean;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTokens: number;
  activeTokens: number;
  totalRoles: number;
  recentLogs: number;
  systemHealth: "healthy" | "warning" | "critical";
}

export interface AdminConsoleState {
  currentSection: AdminSection;
  users: User[];
  tokens: Token[];
  roles: Role[];
  logs: AuditLog[];
  stats: AdminStats;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedItems: string[];
  filters: {
    userStatus?: UserStatus[];
    tokenType?: TokenType[];
    logLevel?: LogLevel[];
    dateRange?: {
      start: Date;
      end: Date;
    };
  };
}

export interface AdminConsoleContextType {
  state: AdminConsoleState;
  actions: {
    setCurrentSection: (section: AdminSection) => void;
    setSearchQuery: (query: string) => void;
    setSelectedItems: (items: string[]) => void;
    toggleItemSelection: (itemId: string) => void;
    clearSelection: () => void;
    updateFilters: (filters: Partial<AdminConsoleState["filters"]>) => void;
    loadUsers: () => Promise<void>;
    loadTokens: () => Promise<void>;
    loadRoles: () => Promise<void>;
    loadLogs: () => Promise<void>;
    loadStats: () => Promise<void>;
    updateUserStatus: (userId: string, status: UserStatus) => Promise<void>;
    updateUserRole: (userId: string, role: UserRole) => Promise<void>;
    revokeToken: (tokenId: string) => Promise<void>;
    batchAction: (action: BatchAction, itemIds: string[]) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    deleteToken: (tokenId: string) => Promise<void>;
  };
}

// Table column definitions
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

// Filter options
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

// Batch action configuration
export interface BatchActionConfig {
  id: BatchAction;
  label: string;
  icon: string;
  variant: "default" | "destructive" | "secondary";
  requiresConfirmation: boolean;
  confirmationMessage?: string;
}
