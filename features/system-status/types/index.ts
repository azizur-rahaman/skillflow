/**
 * System Status Types
 * Global system status banner and health monitoring
 */

export type SystemStatus =
  | "operational"
  | "degraded"
  | "maintenance"
  | "outage";

export type StatusSeverity = "info" | "warning" | "critical";

export interface SystemStatusMessage {
  id: string;
  title: string;
  message: string;
  status: SystemStatus;
  severity: StatusSeverity;
  timestamp: Date;
  estimatedResolution?: Date;
  affectedServices?: string[];
  isDismissible: boolean;
  linkToStatusPage?: string;
}

export interface SystemStatusState {
  currentStatus: SystemStatus;
  messages: SystemStatusMessage[];
  isBannerVisible: boolean;
  lastUpdated: Date;
}

export interface SystemStatusContextType {
  state: SystemStatusState;
  actions: {
    updateStatus: (
      status: SystemStatus,
      message?: Partial<SystemStatusMessage>
    ) => void;
    addMessage: (
      message: Omit<SystemStatusMessage, "id" | "timestamp">
    ) => void;
    dismissMessage: (messageId: string) => void;
    hideBanner: () => void;
    showBanner: () => void;
    refreshStatus: () => Promise<void>;
  };
}

export interface SystemStatusBannerProps {
  className?: string;
  showLinkToStatusPage?: boolean;
  autoHideDelay?: number; // in milliseconds
}
