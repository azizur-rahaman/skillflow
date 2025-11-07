/**
 * Demo Mode Types
 * Safe presentation mode for sales teams and partners
 */

export interface DemoModeState {
  isEnabled: boolean;
  isVisible: boolean;
  restrictedActions: string[];
  sampleDataBanner: {
    show: boolean;
    message: string;
    type: "info" | "warning" | "success";
  };
}

export interface DemoModeContextType {
  state: DemoModeState;
  actions: {
    enableDemoMode: () => void;
    disableDemoMode: () => void;
    toggleDemoMode: () => void;
    showBanner: (
      message: string,
      type?: "info" | "warning" | "success"
    ) => void;
    hideBanner: () => void;
    addRestrictedAction: (action: string) => void;
    removeRestrictedAction: (action: string) => void;
    isActionRestricted: (action: string) => boolean;
  };
}

export interface DemoModeBannerProps {
  message: string;
  type: "info" | "warning" | "success";
  onClose?: () => void;
  className?: string;
}

export interface DemoModeToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

export interface DemoModeProviderProps {
  children: React.ReactNode;
  defaultEnabled?: boolean;
}

export interface WithDemoModeProps {
  demoMode?: {
    isEnabled: boolean;
    isActionRestricted: (action: string) => boolean;
  };
}
