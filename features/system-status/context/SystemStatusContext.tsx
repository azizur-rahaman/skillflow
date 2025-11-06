/**
 * System Status Context
 * React context for managing global system status and banner state
 */

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  SystemStatusState,
  SystemStatusContextType,
  SystemStatus,
  SystemStatusMessage,
} from "../types";

// Actions
type SystemStatusAction =
  | {
      type: "UPDATE_STATUS";
      payload: { status: SystemStatus; message?: Partial<SystemStatusMessage> };
    }
  | { type: "ADD_MESSAGE"; payload: SystemStatusMessage }
  | { type: "DISMISS_MESSAGE"; payload: string }
  | { type: "HIDE_BANNER" }
  | { type: "SHOW_BANNER" }
  | { type: "REFRESH_STATUS"; payload: SystemStatusState };

// Initial state
const initialState: SystemStatusState = {
  currentStatus: "operational",
  messages: [],
  isBannerVisible: false,
  lastUpdated: new Date(),
};

// Reducer
function systemStatusReducer(
  state: SystemStatusState,
  action: SystemStatusAction
): SystemStatusState {
  switch (action.type) {
    case "UPDATE_STATUS":
      const newMessage = action.payload.message
        ? ({
            ...action.payload.message,
            id: `msg-${Date.now()}`,
            timestamp: new Date(),
          } as SystemStatusMessage)
        : undefined;

      return {
        ...state,
        currentStatus: action.payload.status,
        messages: newMessage ? [newMessage, ...state.messages] : state.messages,
        isBannerVisible:
          action.payload.status !== "operational" || !!newMessage,
        lastUpdated: new Date(),
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [action.payload, ...state.messages],
        isBannerVisible: true,
        lastUpdated: new Date(),
      };

    case "DISMISS_MESSAGE":
      const filteredMessages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
      return {
        ...state,
        messages: filteredMessages,
        isBannerVisible: filteredMessages.length > 0,
      };

    case "HIDE_BANNER":
      return {
        ...state,
        isBannerVisible: false,
      };

    case "SHOW_BANNER":
      return {
        ...state,
        isBannerVisible: true,
      };

    case "REFRESH_STATUS":
      return action.payload;

    default:
      return state;
  }
}

// Context
const SystemStatusContext = createContext<SystemStatusContextType | undefined>(
  undefined
);

// Provider Component
export const SystemStatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(systemStatusReducer, initialState);

  // Actions
  const updateStatus = useCallback(
    (status: SystemStatus, message?: Partial<SystemStatusMessage>) => {
      dispatch({ type: "UPDATE_STATUS", payload: { status, message } });
    },
    []
  );

  const addMessage = useCallback(
    (messageData: Omit<SystemStatusMessage, "id" | "timestamp">) => {
      const message: SystemStatusMessage = {
        ...messageData,
        id: `msg-${Date.now()}`,
        timestamp: new Date(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: message });
    },
    []
  );

  const dismissMessage = useCallback((messageId: string) => {
    dispatch({ type: "DISMISS_MESSAGE", payload: messageId });
  }, []);

  const hideBanner = useCallback(() => {
    dispatch({ type: "HIDE_BANNER" });
  }, []);

  const showBanner = useCallback(() => {
    dispatch({ type: "SHOW_BANNER" });
  }, []);

  const refreshStatus = useCallback(async () => {
    // Simulate API call to check system status
    try {
      // In a real implementation, this would fetch from an API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock status update - in real app this would come from API
      const mockStatus: SystemStatus =
        Math.random() > 0.8 ? "maintenance" : "operational";
      const mockState: SystemStatusState = {
        currentStatus: mockStatus,
        messages:
          mockStatus === "maintenance"
            ? [
                {
                  id: "mock-maintenance",
                  title: "Scheduled Maintenance",
                  message:
                    "System maintenance is scheduled for tonight from 2-4 AM EST.",
                  status: "maintenance",
                  severity: "info",
                  timestamp: new Date(),
                  estimatedResolution: new Date(
                    Date.now() + 4 * 60 * 60 * 1000
                  ), // 4 hours from now
                  affectedServices: ["API", "Dashboard"],
                  isDismissible: true,
                  linkToStatusPage: "/system-health",
                },
              ]
            : [],
        isBannerVisible: mockStatus !== "operational",
        lastUpdated: new Date(),
      };

      dispatch({ type: "REFRESH_STATUS", payload: mockState });
    } catch (error) {
      console.error("Failed to refresh system status:", error);
    }
  }, []);

  const contextValue: SystemStatusContextType = {
    state,
    actions: {
      updateStatus,
      addMessage,
      dismissMessage,
      hideBanner,
      showBanner,
      refreshStatus,
    },
  };

  return (
    <SystemStatusContext.Provider value={contextValue}>
      {children}
    </SystemStatusContext.Provider>
  );
};

// Hook
export const useSystemStatus = (): SystemStatusContextType => {
  const context = useContext(SystemStatusContext);
  if (context === undefined) {
    throw new Error(
      "useSystemStatus must be used within a SystemStatusProvider"
    );
  }
  return context;
};

// Export context for advanced usage
export { SystemStatusContext };
