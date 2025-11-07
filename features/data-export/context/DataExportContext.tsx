/**
 * Data Export Context
 * React context for managing data export state and operations
 */

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  DataExportState,
  DataExportContextType,
  ExportFilters,
  ExportJob,
  ExportFormat,
} from "../types";

// Data Export Actions
type DataExportAction =
  | { type: "UPDATE_FILTERS"; payload: Partial<ExportFilters> }
  | { type: "RESET_FILTERS" }
  | { type: "START_EXPORT"; payload: { format: ExportFormat; job: ExportJob } }
  | {
      type: "UPDATE_JOB_PROGRESS";
      payload: { jobId: string; progress: number };
    }
  | {
      type: "COMPLETE_EXPORT";
      payload: { jobId: string; downloadUrl: string; fileSize: number };
    }
  | { type: "FAIL_EXPORT"; payload: { jobId: string; error: string } }
  | { type: "CANCEL_EXPORT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_RECENT_JOBS"; payload: ExportJob[] }
  | { type: "SET_AVAILABLE_TEAMS"; payload: string[] };

// Default Filters
const defaultFilters: ExportFilters = {
  timeRange: "30d",
  teams: [],
  metrics: ["skills", "users", "analytics"],
  includePersonalData: false,
  anonymizeData: true,
};

// Initial State
const initialState: DataExportState = {
  filters: defaultFilters,
  currentJob: null,
  recentJobs: [],
  availableTeams: [],
  isLoading: false,
  error: null,
};

// Reducer
function dataExportReducer(
  state: DataExportState,
  action: DataExportAction
): DataExportState {
  switch (action.type) {
    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: defaultFilters,
      };

    case "START_EXPORT":
      return {
        ...state,
        currentJob: action.payload.job,
        isLoading: true,
        error: null,
      };

    case "UPDATE_JOB_PROGRESS":
      return {
        ...state,
        currentJob:
          state.currentJob?.id === action.payload.jobId
            ? { ...state.currentJob, progress: action.payload.progress }
            : state.currentJob,
      };

    case "COMPLETE_EXPORT":
      if (!state.currentJob || state.currentJob.id !== action.payload.jobId) {
        return state;
      }
      const completedJob: ExportJob = {
        ...state.currentJob,
        status: "completed",
        progress: 100,
        downloadUrl: action.payload.downloadUrl,
        fileSize: action.payload.fileSize,
        completedAt: new Date(),
      };
      return {
        ...state,
        currentJob: null,
        recentJobs: [completedJob, ...state.recentJobs.slice(0, 9)], // Keep last 10
        isLoading: false,
      };

    case "FAIL_EXPORT":
      if (!state.currentJob || state.currentJob.id !== action.payload.jobId) {
        return state;
      }
      const failedJob: ExportJob = {
        ...state.currentJob,
        status: "failed",
        error: action.payload.error,
        completedAt: new Date(),
      };
      return {
        ...state,
        currentJob: null,
        recentJobs: [failedJob, ...state.recentJobs.slice(0, 9)],
        isLoading: false,
        error: action.payload.error,
      };

    case "CANCEL_EXPORT":
      return {
        ...state,
        currentJob: null,
        isLoading: false,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "SET_RECENT_JOBS":
      return {
        ...state,
        recentJobs: action.payload,
      };

    case "SET_AVAILABLE_TEAMS":
      return {
        ...state,
        availableTeams: action.payload,
      };

    default:
      return state;
  }
}

// Context
const DataExportContext = createContext<DataExportContextType | undefined>(
  undefined
);

// Mock data for demonstration
const mockTeams = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "HR",
];
const mockRecentJobs: ExportJob[] = [
  {
    id: "job-1",
    format: "csv",
    filters: { ...defaultFilters, timeRange: "7d" },
    status: "completed",
    progress: 100,
    fileSize: 2457600, // 2.4MB
    downloadUrl: "#",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    completedAt: new Date(Date.now() - 82800000), // 23 hours ago
  },
  {
    id: "job-2",
    format: "json",
    filters: { ...defaultFilters, timeRange: "30d", metrics: ["analytics"] },
    status: "completed",
    progress: 100,
    fileSize: 512000, // 512KB
    downloadUrl: "#",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    completedAt: new Date(Date.now() - 169200000), // 1.97 days ago
  },
];

// Provider Component
export const DataExportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(dataExportReducer, initialState);

  // Actions
  const updateFilters = useCallback((filters: Partial<ExportFilters>) => {
    dispatch({ type: "UPDATE_FILTERS", payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const startExport = useCallback(
    async (format: ExportFormat) => {
      const jobId = `job-${Date.now()}`;
      const job: ExportJob = {
        id: jobId,
        format,
        filters: state.filters,
        status: "preparing",
        progress: 0,
        createdAt: new Date(),
      };

      dispatch({ type: "START_EXPORT", payload: { format, job } });

      // Simulate export process
      try {
        // Preparing phase
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch({
          type: "UPDATE_JOB_PROGRESS",
          payload: { jobId, progress: 25 },
        });

        // Exporting phase
        await new Promise((resolve) => setTimeout(resolve, 2000));
        dispatch({
          type: "UPDATE_JOB_PROGRESS",
          payload: { jobId, progress: 75 },
        });

        // Finalizing
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Complete
        const fileSize = Math.floor(Math.random() * 5000000) + 100000; // 100KB - 5MB
        dispatch({
          type: "COMPLETE_EXPORT",
          payload: { jobId, downloadUrl: "#", fileSize },
        });
      } catch (error) {
        console.error("Export error:", error);
        dispatch({
          type: "FAIL_EXPORT",
          payload: { jobId, error: "Export failed" },
        });
      }
    },
    [state.filters]
  );

  const cancelExport = useCallback(() => {
    dispatch({ type: "CANCEL_EXPORT" });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const loadRecentJobs = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch({ type: "SET_RECENT_JOBS", payload: mockRecentJobs });
    dispatch({ type: "SET_AVAILABLE_TEAMS", payload: mockTeams });
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  const downloadFile = useCallback((jobId: string) => {
    // In a real app, this would trigger a download
    console.log(`Downloading file for job ${jobId}`);
  }, []);

  // Load initial data
  React.useEffect(() => {
    loadRecentJobs();
  }, [loadRecentJobs]);

  const contextValue: DataExportContextType = {
    state,
    actions: {
      updateFilters,
      resetFilters,
      startExport,
      cancelExport,
      clearError,
      loadRecentJobs,
      downloadFile,
    },
  };

  return (
    <DataExportContext.Provider value={contextValue}>
      {children}
    </DataExportContext.Provider>
  );
};

// Hook
export const useDataExport = (): DataExportContextType => {
  const context = useContext(DataExportContext);
  if (context === undefined) {
    throw new Error("useDataExport must be used within a DataExportProvider");
  }
  return context;
};

// Export context for advanced usage
export { DataExportContext };
