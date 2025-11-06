/**
 * Data Export Types
 * Safe data export functionality for admins and researchers
 */

export type ExportFormat = "csv" | "json" | "pdf";

export type ExportStatus =
  | "idle"
  | "preparing"
  | "exporting"
  | "completed"
  | "failed";

export type TimeRange = "7d" | "30d" | "90d" | "1y" | "custom";

export type MetricType =
  | "skills"
  | "users"
  | "teams"
  | "assessments"
  | "transactions"
  | "learning"
  | "gamification"
  | "analytics";

export interface ExportFilters {
  timeRange: TimeRange;
  startDate?: Date;
  endDate?: Date;
  teams: string[];
  metrics: MetricType[];
  includePersonalData: boolean;
  anonymizeData: boolean;
}

export interface ExportJob {
  id: string;
  format: ExportFormat;
  filters: ExportFilters;
  status: ExportStatus;
  progress: number;
  fileSize?: number;
  downloadUrl?: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface DataExportState {
  filters: ExportFilters;
  currentJob: ExportJob | null;
  recentJobs: ExportJob[];
  availableTeams: string[];
  isLoading: boolean;
  error: string | null;
}

export interface DataExportContextType {
  state: DataExportState;
  actions: {
    updateFilters: (filters: Partial<ExportFilters>) => void;
    resetFilters: () => void;
    startExport: (format: ExportFormat) => Promise<void>;
    cancelExport: () => void;
    clearError: () => void;
    loadRecentJobs: () => Promise<void>;
    downloadFile: (jobId: string) => void;
  };
}

export interface ExportFiltersProps {
  filters: ExportFilters;
  availableTeams: string[];
  onFiltersChange: (filters: Partial<ExportFilters>) => void;
  onReset: () => void;
  className?: string;
}

export interface ExportButtonProps {
  format: ExportFormat;
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface ExportProgressModalProps {
  job: ExportJob | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (jobId: string) => void;
}

export interface DataExportDashboardProps {
  className?: string;
}

export interface PrivacyNoticeProps {
  showPersonalData: boolean;
  className?: string;
}

export interface ExportHistoryProps {
  jobs: ExportJob[];
  onDownload: (jobId: string) => void;
  className?: string;
}
