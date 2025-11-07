/**
 * Demo Mode Context
 * React context for managing demo mode state across the application
 */

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  DemoModeState,
  DemoModeContextType,
  DemoModeProviderProps,
} from "../types";

// Demo Mode Actions
type DemoModeAction =
  | { type: "ENABLE_DEMO_MODE" }
  | { type: "DISABLE_DEMO_MODE" }
  | { type: "TOGGLE_DEMO_MODE" }
  | {
      type: "SHOW_BANNER";
      payload: { message: string; type: "info" | "warning" | "success" };
    }
  | { type: "HIDE_BANNER" }
  | { type: "ADD_RESTRICTED_ACTION"; payload: string }
  | { type: "REMOVE_RESTRICTED_ACTION"; payload: string };

// Initial State
const initialState: DemoModeState = {
  isEnabled: false,
  isVisible: true,
  restrictedActions: [
    "delete",
    "edit",
    "create",
    "update",
    "save",
    "submit",
    "connect-wallet",
    "mint-token",
    "transfer-funds",
    "withdraw",
    "deposit",
  ],
  sampleDataBanner: {
    show: false,
    message: "",
    type: "info",
  },
};

// Reducer
function demoModeReducer(
  state: DemoModeState,
  action: DemoModeAction
): DemoModeState {
  switch (action.type) {
    case "ENABLE_DEMO_MODE":
      return {
        ...state,
        isEnabled: true,
        sampleDataBanner: {
          show: true,
          message:
            "Sample Data Mode - All actions are simulated for demonstration",
          type: "info",
        },
      };

    case "DISABLE_DEMO_MODE":
      return {
        ...state,
        isEnabled: false,
        sampleDataBanner: {
          show: false,
          message: "",
          type: "info",
        },
      };

    case "TOGGLE_DEMO_MODE":
      return {
        ...state,
        isEnabled: !state.isEnabled,
        sampleDataBanner: {
          show: !state.isEnabled,
          message: !state.isEnabled
            ? "Sample Data Mode - All actions are simulated for demonstration"
            : "",
          type: "info",
        },
      };

    case "SHOW_BANNER":
      return {
        ...state,
        sampleDataBanner: {
          show: true,
          message: action.payload.message,
          type: action.payload.type,
        },
      };

    case "HIDE_BANNER":
      return {
        ...state,
        sampleDataBanner: {
          show: false,
          message: "",
          type: "info",
        },
      };

    case "ADD_RESTRICTED_ACTION":
      return {
        ...state,
        restrictedActions: [
          ...new Set([...state.restrictedActions, action.payload]),
        ],
      };

    case "REMOVE_RESTRICTED_ACTION":
      return {
        ...state,
        restrictedActions: state.restrictedActions.filter(
          (restrictedAction) => restrictedAction !== action.payload
        ),
      };

    default:
      return state;
  }
}

// Context
const DemoModeContext = createContext<DemoModeContextType | undefined>(
  undefined
);

// Provider Component
export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({
  children,
  defaultEnabled = false,
}) => {
  const [state, dispatch] = useReducer(demoModeReducer, {
    ...initialState,
    isEnabled: defaultEnabled,
    sampleDataBanner: {
      show: defaultEnabled,
      message: defaultEnabled
        ? "Sample Data Mode - All actions are simulated for demonstration"
        : "",
      type: "info" as const,
    },
  });

  // Actions
  const enableDemoMode = useCallback(() => {
    dispatch({ type: "ENABLE_DEMO_MODE" });
  }, []);

  const disableDemoMode = useCallback(() => {
    dispatch({ type: "DISABLE_DEMO_MODE" });
  }, []);

  const toggleDemoMode = useCallback(() => {
    dispatch({ type: "TOGGLE_DEMO_MODE" });
  }, []);

  const showBanner = useCallback(
    (message: string, type: "info" | "warning" | "success" = "info") => {
      dispatch({ type: "SHOW_BANNER", payload: { message, type } });
    },
    []
  );

  const hideBanner = useCallback(() => {
    dispatch({ type: "HIDE_BANNER" });
  }, []);

  const addRestrictedAction = useCallback((action: string) => {
    dispatch({ type: "ADD_RESTRICTED_ACTION", payload: action });
  }, []);

  const removeRestrictedAction = useCallback((action: string) => {
    dispatch({ type: "REMOVE_RESTRICTED_ACTION", payload: action });
  }, []);

  const isActionRestricted = useCallback(
    (action: string) => {
      return state.restrictedActions.includes(action.toLowerCase());
    },
    [state.restrictedActions]
  );

  const contextValue: DemoModeContextType = {
    state,
    actions: {
      enableDemoMode,
      disableDemoMode,
      toggleDemoMode,
      showBanner,
      hideBanner,
      addRestrictedAction,
      removeRestrictedAction,
      isActionRestricted,
    },
  };

  return (
    <DemoModeContext.Provider value={contextValue}>
      {children}
    </DemoModeContext.Provider>
  );
};

// Hook
export const useDemoMode = (): DemoModeContextType => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return context;
};

// Export context for advanced usage
export { DemoModeContext };
