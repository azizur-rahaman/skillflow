'use client';
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import {
  NotificationState,
  NotificationContextType,
  Notification,
  NotificationGroup,
  NotificationFilters,
  NotificationSettings,
  NotificationLayout,
  ThemeMode,
} from "../types";

const initialState: NotificationState = {
  notifications: [],
  groups: [],
  filters: {
    types: {
        system: true,
        social: true,
        learning: true,
        achievement: true,
        security: true,
        billing: true,
        performance: false,
        reminder: false
    },
    readStatus: "all",
  },
  layout: "sidebar",
  theme: "dark",
  settings: {
    soundEnabled: true,
    desktopNotifications: true,
    emailNotifications: false,
    pushNotifications: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
    categories: {
        system: true,
        social: true,
        learning: true,
        achievement: true,
        security: true,
        billing: true,
        performance: false,
        reminder: false
    },
  },
  loading: false,
  error: null,
  unreadCount: 0,
  isOpen: false,
  selectedNotification: null,
};

type NotificationAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "SET_GROUPS"; payload: NotificationGroup[] }
  | {
      type: "UPDATE_NOTIFICATION";
      payload: { id: string; updates: Partial<Notification> };
    }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_FILTERS"; payload: Partial<NotificationFilters> }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_LAYOUT"; payload: NotificationLayout }
  | { type: "SET_THEME"; payload: ThemeMode }
  | { type: "SET_SETTINGS"; payload: Partial<NotificationSettings> }
  | { type: "SET_UNREAD_COUNT"; payload: number }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SELECTED_NOTIFICATION"; payload: Notification | null };

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_NOTIFICATIONS":
      const unreadCount = action.payload.filter(
        (n) => n.status === "unread"
      ).length;
      return { ...state, notifications: action.payload, unreadCount };
    case "SET_GROUPS":
      return { ...state, groups: action.payload };
    case "UPDATE_NOTIFICATION":
      const updatedNotifications = state.notifications.map((notification) =>
        notification.id === action.payload.id
          ? { ...notification, ...action.payload.updates }
          : notification
      );
      const newUnreadCount = updatedNotifications.filter(
        (n) => n.status === "unread"
      ).length;
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: newUnreadCount,
      };
    case "REMOVE_NOTIFICATION":
      const filteredNotifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
      const filteredUnreadCount = filteredNotifications.filter(
        (n) => n.status === "unread"
      ).length;
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredUnreadCount,
      };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          types: {
              system: true,
              social: true,
              learning: true,
              achievement: true,
              security: true,
              billing: true,
              performance: false,
              reminder: false
          },
          readStatus: "all",
        },
      };
    case "SET_LAYOUT":
      return { ...state, layout: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, isOpen: !state.isOpen };
    case "SET_SELECTED_NOTIFICATION":
      return { ...state, selectedNotification: action.payload };
    default:
      return state;
  }
}

// Mock data generators
const generateMockNotifications = (): Notification[] => [
  {
    id: "notif_1",
    type: "system",
    title: "System Maintenance",
    message: "Scheduled maintenance will begin in 2 hours",
    description:
      "We will be performing routine maintenance on our servers. Some services may be temporarily unavailable.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "unread",
    priority: "high",
    icon: "Settings",
    category: "System",
    actions: [
      {
        id: "acknowledge",
        label: "Got it",
        action: "acknowledge",
        primary: true,
      },
    ],
  },
  {
    id: "notif_2",
    type: "social",
    title: "New Connection Request",
    message: "Sarah Johnson wants to connect with you",
    description:
      "Sarah has 8 years of experience in React development and shares similar interests.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "unread",
    priority: "medium",
    icon: "UserPlus",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    category: "Social",
    sender: {
      id: "user_123",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    actions: [
      {
        id: "accept",
        label: "Accept",
        action: "accept_connection",
        primary: true,
      },
      { id: "decline", label: "Decline", action: "decline_connection" },
    ],
  },
  {
    id: "notif_3",
    type: "learning",
    title: "Course Completed!",
    message: 'Congratulations! You completed "Advanced React Patterns"',
    description: 'You earned 500 XP and unlocked the "React Master" badge.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: "unread",
    priority: "medium",
    icon: "Trophy",
    category: "Learning",
    actions: [
      {
        id: "view_certificate",
        label: "View Certificate",
        action: "view_certificate",
        primary: true,
      },
      { id: "share", label: "Share Achievement", action: "share_achievement" },
    ],
  },
  {
    id: "notif_4",
    type: "achievement",
    title: "New Badge Unlocked",
    message: 'You earned the "Team Player" badge!',
    description: "Awarded for collaborating on 10+ team projects this month.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    status: "read",
    priority: "low",
    icon: "Award",
    category: "Achievement",
  },
  {
    id: "notif_5",
    type: "security",
    title: "New Login Detected",
    message: "New login from Chrome on Windows",
    description: "If this wasn't you, please secure your account immediately.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    status: "read",
    priority: "high",
    icon: "Shield",
    category: "Security",
    actions: [
      {
        id: "secure_account",
        label: "Secure Account",
        action: "secure_account",
        primary: true,
      },
      { id: "view_logins", label: "View All Logins", action: "view_logins" },
    ],
  },
  {
    id: "notif_6",
    type: "billing",
    title: "Payment Successful",
    message: "Your monthly subscription payment was processed",
    description: "$99.00 was charged to your card ending in 4242.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: "read",
    priority: "low",
    icon: "CreditCard",
    category: "Billing",
    actions: [
      {
        id: "view_invoice",
        label: "View Invoice",
        action: "view_invoice",
        primary: true,
      },
    ],
  },
  {
    id: "notif_7",
    type: "learning",
    title: "Weekly Progress Report",
    message: "You've completed 3 courses this week!",
    description:
      "Keep up the great work. You're on track to reach your quarterly learning goals.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    status: "read",
    priority: "low",
    icon: "TrendingUp",
    category: "Learning",
  },
  {
    id: "notif_8",
    type: "social",
    title: "Team Invitation",
    message: 'You were added to "Frontend Development Team"',
    description:
      "Mike Chen invited you to join the team. Start collaborating on projects!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    status: "read",
    priority: "medium",
    icon: "Users",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    category: "Social",
    sender: {
      id: "user_456",
      name: "Mike Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
  },
];

const generateMockGroups = (
  notifications: Notification[]
): NotificationGroup[] => {
  const groups: Record<string, Notification[]> = {};

  notifications.forEach((notification) => {
    const key = notification.category;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(notification);
  });

  return Object.entries(groups).map(([title, notifs]) => ({
    id: title.toLowerCase().replace(/\s+/g, "-"),
    title,
    type: notifs[0].type,
    notifications: notifs.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    ),
    unreadCount: notifs.filter((n) => n.status === "unread").length,
    lastUpdated: notifs[0].timestamp,
  }));
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, {
    ...initialState,
    notifications: generateMockNotifications(),
    groups: generateMockGroups(generateMockNotifications()),
  });

  const loadNotifications = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const notifications = generateMockNotifications();
      dispatch({ type: "SET_NOTIFICATIONS", payload: notifications });
      dispatch({
        type: "SET_GROUPS",
        payload: generateMockGroups(notifications),
      });
    } catch (error) {
      console.error("Failed to load notifications:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load notifications" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    dispatch({
      type: "UPDATE_NOTIFICATION",
      payload: { id, updates: { status: "read" } },
    });
  }, []);

  const markAllAsRead = useCallback(async () => {
    state.notifications.forEach((notification) => {
      if (notification.status === "unread") {
        dispatch({
          type: "UPDATE_NOTIFICATION",
          payload: { id: notification.id, updates: { status: "read" } },
        });
      }
    });
  }, [state.notifications]);

  const dismissNotification = useCallback(async (id: string) => {
    dispatch({
      type: "UPDATE_NOTIFICATION",
      payload: { id, updates: { status: "dismissed" } },
    });
  }, []);

  const archiveNotification = useCallback(async (id: string) => {
    dispatch({
      type: "UPDATE_NOTIFICATION",
      payload: { id, updates: { status: "archived" } },
    });
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  }, []);

  const setFilters = useCallback((filters: Partial<NotificationFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_FILTERS" });
  }, []);

  const toggleLayout = useCallback(() => {
    dispatch({
      type: "SET_LAYOUT",
      payload: state.layout === "sidebar" ? "fullscreen" : "sidebar",
    });
  }, [state.layout]);

  const toggleTheme = useCallback(() => {
    dispatch({
      type: "SET_THEME",
      payload: state.theme === "dark" ? "light" : "dark",
    });
  }, [state.theme]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }, []);

  const updateSettings = useCallback(
    async (settings: Partial<NotificationSettings>) => {
      dispatch({ type: "SET_SETTINGS", payload: settings });
    },
    []
  );

  const executeAction = useCallback(
    async (notificationId: string, actionId: string) => {
      console.log(
        `Executing action ${actionId} for notification ${notificationId}`
      );
      // In real implementation, this would trigger the appropriate action
    },
    []
  );

  const searchNotifications = useCallback((query: string) => {
    dispatch({ type: "SET_FILTERS", payload: { search: query } });
  }, []);

  const selectNotification = useCallback(
    (notification: Notification | null) => {
      dispatch({ type: "SET_SELECTED_NOTIFICATION", payload: notification });
    },
    []
  );

  const value: NotificationContextType = {
    state,
    actions: {
      loadNotifications,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      archiveNotification,
      deleteNotification,
      setFilters,
      clearFilters,
      toggleLayout,
      toggleTheme,
      toggleSidebar,
      updateSettings,
      executeAction,
      searchNotifications,
      selectNotification,
    },
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
