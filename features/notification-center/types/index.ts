/**
 * Notification Center Types
 * System and activity notifications with filtering and state management
 */

export type NotificationType =
  | "system"
  | "social"
  | "learning"
  | "achievement"
  | "security"
  | "billing"
    | "performance"
    | "reminder";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export type NotificationStatus = "unread" | "read" | "archived" | "dismissed";

export type NotificationLayout = "sidebar" | "fullscreen";

export type ThemeMode = "light" | "dark";

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  primary?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  description?: string;
  timestamp: Date;
  status: NotificationStatus;
  priority: NotificationPriority;
  icon?: string;
  avatar?: string;
  actions?: NotificationAction[];
  metadata?: Record<string, unknown>;
  expiresAt?: Date;
  category: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface NotificationGroup {
  id: string;
  title: string;
  type: NotificationType;
  notifications: Notification[];
  unreadCount: number;
  lastUpdated: Date;
}

export interface NotificationFilters {
  types: Record<NotificationType, boolean>;
  readStatus: "all" | "unread" | "read";
  priority?: NotificationPriority;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface NotificationSettings {
  soundEnabled: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  categories: Record<NotificationType, boolean>;
}

export interface NotificationState {
  notifications: Notification[];
  groups: NotificationGroup[];
  filters: NotificationFilters;
  layout: NotificationLayout;
  theme: ThemeMode;
  settings: NotificationSettings;
  loading: boolean;
  error: string | null;
  unreadCount: number;
  isOpen: boolean;
  selectedNotification: Notification | null;
}

export interface NotificationContextType {
  state: NotificationState;
  actions: {
    loadNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    dismissNotification: (id: string) => Promise<void>;
    archiveNotification: (id: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
    setFilters: (filters: Partial<NotificationFilters>) => void;
    clearFilters: () => void;
    toggleLayout: () => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
    executeAction: (notificationId: string, actionId: string) => Promise<void>;
    searchNotifications: (query: string) => void;
    selectNotification: (notification: Notification | null) => void;
  };
}
