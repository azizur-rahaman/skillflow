"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import {
  AdminConsoleState,
  AdminConsoleContextType,
  AdminSection,
  UserStatus,
  UserRole,
  BatchAction,
  User,
  Token,
  Role,
  AuditLog,
  AdminStats,
} from "../types";

const initialState: AdminConsoleState = {
  currentSection: "users",
  users: [],
  tokens: [],
  roles: [],
  logs: [],
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    totalTokens: 0,
    activeTokens: 0,
    totalRoles: 0,
    recentLogs: 0,
    systemHealth: "healthy",
  },
  loading: false,
  error: null,
  searchQuery: "",
  selectedItems: [],
  filters: {},
};

type AdminConsoleAction =
  | { type: "SET_CURRENT_SECTION"; payload: AdminSection }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_ITEMS"; payload: string[] }
  | { type: "TOGGLE_ITEM_SELECTION"; payload: string }
  | { type: "CLEAR_SELECTION" }
  | { type: "UPDATE_FILTERS"; payload: Partial<AdminConsoleState["filters"]> }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_TOKENS"; payload: Token[] }
  | { type: "SET_ROLES"; payload: Role[] }
  | { type: "SET_LOGS"; payload: AuditLog[] }
  | { type: "SET_STATS"; payload: AdminStats }
  | { type: "UPDATE_USER"; payload: { id: string; updates: Partial<User> } }
  | { type: "DELETE_USER"; payload: string }
  | { type: "UPDATE_TOKEN"; payload: { id: string; updates: Partial<Token> } }
  | { type: "DELETE_TOKEN"; payload: string };

function adminConsoleReducer(
  state: AdminConsoleState,
  action: AdminConsoleAction
): AdminConsoleState {
  switch (action.type) {
    case "SET_CURRENT_SECTION":
      return { ...state, currentSection: action.payload, selectedItems: [] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_SELECTED_ITEMS":
      return { ...state, selectedItems: action.payload };
    case "TOGGLE_ITEM_SELECTION":
      const isSelected = state.selectedItems.includes(action.payload);
      return {
        ...state,
        selectedItems: isSelected
          ? state.selectedItems.filter((id) => id !== action.payload)
          : [...state.selectedItems, action.payload],
      };
    case "CLEAR_SELECTION":
      return { ...state, selectedItems: [] };
    case "UPDATE_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_TOKENS":
      return { ...state, tokens: action.payload };
    case "SET_ROLES":
      return { ...state, roles: action.payload };
    case "SET_LOGS":
      return { ...state, logs: action.payload };
    case "SET_STATS":
      return { ...state, stats: action.payload };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.updates }
            : user
        ),
      };
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        selectedItems: state.selectedItems.filter(
          (id) => id !== action.payload
        ),
      };
    case "UPDATE_TOKEN":
      return {
        ...state,
        tokens: state.tokens.map((token) =>
          token.id === action.payload.id
            ? { ...token, ...action.payload.updates }
            : token
        ),
      };
    case "DELETE_TOKEN":
      return {
        ...state,
        tokens: state.tokens.filter((token) => token.id !== action.payload),
        selectedItems: state.selectedItems.filter(
          (id) => id !== action.payload
        ),
      };
    default:
      return state;
  }
}

const AdminConsoleContext = createContext<AdminConsoleContextType | undefined>(
  undefined
);

interface AdminConsoleProviderProps {
  children: ReactNode;
}

export function AdminConsoleProvider({ children }: AdminConsoleProviderProps) {
  const [state, dispatch] = useReducer(adminConsoleReducer, initialState);

  // Mock data generators
  const generateMockUsers = (): User[] => [
    {
      id: "1",
      email: "admin@skillflow.com",
      firstName: "System",
      lastName: "Administrator",
      role: "admin",
      status: "active",
      lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365), // 1 year ago
      department: "IT",
      skillsCount: 25,
      tokensCount: 3,
    },
    {
      id: "2",
      email: "sarah.manager@skillflow.com",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "manager",
      status: "active",
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180), // 6 months ago
      department: "HR",
      skillsCount: 18,
      tokensCount: 2,
    },
    {
      id: "3",
      email: "mike.developer@skillflow.com",
      firstName: "Mike",
      lastName: "Chen",
      role: "user",
      status: "active",
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 3 months ago
      department: "Engineering",
      skillsCount: 32,
      tokensCount: 1,
    },
    {
      id: "4",
      email: "inactive.user@skillflow.com",
      firstName: "Inactive",
      lastName: "User",
      role: "user",
      status: "inactive",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 1 month ago
      department: "Marketing",
      skillsCount: 8,
      tokensCount: 0,
    },
  ];

  const generateMockTokens = (): Token[] => [
    {
      id: "1",
      name: "API Access Token",
      type: "api",
      userId: "1",
      userEmail: "admin@skillflow.com",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
      lastUsed: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isActive: true,
      permissions: ["read:users", "write:users", "read:tokens", "write:tokens"],
    },
    {
      id: "2",
      name: "Mobile App Token",
      type: "access",
      userId: "2",
      userEmail: "sarah.manager@skillflow.com",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60), // 60 days from now
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      isActive: true,
      permissions: ["read:users", "read:analytics"],
    },
  ];

  const generateMockRoles = (): Role[] => [
    {
      id: "1",
      name: "Administrator",
      description: "Full system access and configuration",
      permissions: ["*"],
      userCount: 1,
      isSystemRole: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    },
    {
      id: "2",
      name: "Manager",
      description: "Team management and analytics access",
      permissions: [
        "read:users",
        "write:users",
        "read:analytics",
        "read:reports",
      ],
      userCount: 3,
      isSystemRole: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    },
    {
      id: "3",
      name: "User",
      description: "Standard user access",
      permissions: ["read:self", "write:self", "read:public"],
      userCount: 25,
      isSystemRole: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    },
  ];

  const generateMockLogs = (): AuditLog[] => [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      level: "info",
      userId: "1",
      userEmail: "admin@skillflow.com",
      action: "user.login",
      resource: "auth",
      details: { ipAddress: "192.168.1.100", userAgent: "Chrome/91.0" },
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/91.0",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      level: "warning",
      userId: "2",
      userEmail: "sarah.manager@skillflow.com",
      action: "token.revoked",
      resource: "tokens",
      details: { tokenId: "old-token-123", reason: "security" },
      ipAddress: "192.168.1.101",
      userAgent: "Safari/14.0",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      level: "error",
      action: "system.backup_failed",
      resource: "system",
      details: { error: "Disk space insufficient", backupSize: "2.5GB" },
      ipAddress: "127.0.0.1",
    },
  ];

  const generateMockStats = (): AdminStats => ({
    totalUsers: 28,
    activeUsers: 25,
    totalTokens: 45,
    activeTokens: 38,
    totalRoles: 3,
    recentLogs: 156,
    systemHealth: "healthy",
  });

  // Action handlers
  const setCurrentSection = useCallback((section: AdminSection) => {
    dispatch({ type: "SET_CURRENT_SECTION", payload: section });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  const setSelectedItems = useCallback((items: string[]) => {
    dispatch({ type: "SET_SELECTED_ITEMS", payload: items });
  }, []);

  const toggleItemSelection = useCallback((itemId: string) => {
    dispatch({ type: "TOGGLE_ITEM_SELECTION", payload: itemId });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
  }, []);

  const updateFilters = useCallback(
    (filters: Partial<AdminConsoleState["filters"]>) => {
      dispatch({ type: "UPDATE_FILTERS", payload: filters });
    },
    []
  );

  const loadUsers = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const users = generateMockUsers();
      dispatch({ type: "SET_USERS", payload: users });
    } catch (error) {
      console.error("Failed to load users:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load users" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadTokens = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const tokens = generateMockTokens();
      dispatch({ type: "SET_TOKENS", payload: tokens });
    } catch (error) {
      console.error("Failed to load tokens:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load tokens" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadRoles = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const roles = generateMockRoles();
      dispatch({ type: "SET_ROLES", payload: roles });
    } catch (error) {
      console.error("Failed to load roles:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load roles" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadLogs = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const logs = generateMockLogs();
      dispatch({ type: "SET_LOGS", payload: logs });
    } catch (error) {
      console.error("Failed to load logs:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load logs" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const stats = generateMockStats();
      dispatch({ type: "SET_STATS", payload: stats });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }, []);

  const updateUserStatus = useCallback(
    async (userId: string, status: UserStatus) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        dispatch({
          type: "UPDATE_USER",
          payload: { id: userId, updates: { status } },
        });
      } catch (error) {
        console.error("Failed to update user status:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to update user status",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    []
  );

  const updateUserRole = useCallback(async (userId: string, role: UserRole) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({
        type: "UPDATE_USER",
        payload: { id: userId, updates: { role } },
      });
    } catch (error) {
      console.error("Failed to update user role:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update user role" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const revokeToken = useCallback(async (tokenId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({
        type: "UPDATE_TOKEN",
        payload: { id: tokenId, updates: { isActive: false } },
      });
    } catch (error) {
      console.error("Failed to revoke token:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to revoke token" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const batchAction = useCallback(
    async (action: BatchAction, itemIds: string[]) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        switch (action) {
          case "activate":
            itemIds.forEach((id) => {
              dispatch({
                type: "UPDATE_USER",
                payload: { id, updates: { status: "active" } },
              });
            });
            break;
          case "deactivate":
            itemIds.forEach((id) => {
              dispatch({
                type: "UPDATE_USER",
                payload: { id, updates: { status: "inactive" } },
              });
            });
            break;
          case "delete":
            itemIds.forEach((id) => {
              dispatch({ type: "DELETE_USER", payload: id });
            });
            break;
          case "revoke_tokens":
            itemIds.forEach((id) => {
              dispatch({
                type: "UPDATE_TOKEN",
                payload: { id, updates: { isActive: false } },
              });
            });
            break;
        }
      } catch (error) {
        console.error(`Failed to perform batch ${action}:`, error);
        dispatch({
          type: "SET_ERROR",
          payload: `Failed to perform batch ${action}`,
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "CLEAR_SELECTION" });
      }
    },
    []
  );

  const deleteUser = useCallback(async (userId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: "DELETE_USER", payload: userId });
    } catch (error) {
      console.error("Failed to delete user:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to delete user" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const deleteToken = useCallback(async (tokenId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: "DELETE_TOKEN", payload: tokenId });
    } catch (error) {
      console.error("Failed to delete token:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to delete token" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const contextValue: AdminConsoleContextType = {
    state,
    actions: {
      setCurrentSection,
      setSearchQuery,
      setSelectedItems,
      toggleItemSelection,
      clearSelection,
      updateFilters,
      loadUsers,
      loadTokens,
      loadRoles,
      loadLogs,
      loadStats,
      updateUserStatus,
      updateUserRole,
      revokeToken,
      batchAction,
      deleteUser,
      deleteToken,
    },
  };

  return (
    <AdminConsoleContext.Provider value={contextValue}>
      {children}
    </AdminConsoleContext.Provider>
  );
}

export function useAdminConsole(): AdminConsoleContextType {
  const context = useContext(AdminConsoleContext);
  if (context === undefined) {
    throw new Error(
      "useAdminConsole must be used within an AdminConsoleProvider"
    );
  }
  return context;
}
