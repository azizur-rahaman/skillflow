"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  QADashboard,
  TestRun,
  DownloadRequest,
  TestFilter,
  MOCK_TEST_RUNS,
  MOCK_COVERAGE_REPORT,
  MOCK_QA_STATS,
} from "../types";

interface QAContextValue {
  // State
  dashboard: QADashboard;
  selectedRun: TestRun | null;
  filters: TestFilter;
  isDownloading: boolean;
  downloadProgress: Record<string, number>;

  // Actions
  setSelectedRun: (run: TestRun | null) => void;
  updateFilters: (filters: Partial<TestFilter>) => void;
  downloadLogs: (request: DownloadRequest) => Promise<void>;
  refreshData: () => Promise<void>;
  runTests: (type: string, branch: string) => Promise<void>;
  getFilteredRuns: () => TestRun[];
  getRunDetails: (runId: string) => TestRun | undefined;
}

const QAContext = createContext<QAContextValue | undefined>(undefined);

// Create initial dashboard data
const createInitialDashboard = (): QADashboard => {
  return {
    recentRuns: MOCK_TEST_RUNS,
    coverageReport: MOCK_COVERAGE_REPORT,
    stats: MOCK_QA_STATS,
    lastUpdated: new Date(),
  };
};

export function QAProvider({ children }: { children: React.ReactNode }) {
  const [dashboard, setDashboard] = useState<QADashboard>(
    createInitialDashboard
  );
  const [selectedRun, setSelectedRun] = useState<TestRun | null>(null);
  const [filters, setFilters] = useState<TestFilter>({});
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<
    Record<string, number>
  >({});

  // Download logs/reports with progress tracking
  const downloadLogs = useCallback(async (request: DownloadRequest) => {
    const downloadId = `${request.type}-${request.testRunId || "general"}`;
    setIsDownloading(true);
    setDownloadProgress((prev) => ({ ...prev, [downloadId]: 0 }));

    try {
      // Simulate download progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setDownloadProgress((prev) => ({ ...prev, [downloadId]: progress }));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Simulate file download
      const fileName = `${request.type}-${request.testRunId || "latest"}-${
        new Date().toISOString().split("T")[0]
      }.${request.format}`;
      console.log(`Downloading ${fileName}...`);

      // In a real implementation, this would trigger a file download
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsDownloading(false);
      setDownloadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[downloadId];
        return newProgress;
      });
    }
  }, []);

  // Refresh QA data
  const refreshData = useCallback(async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, this would fetch fresh data from the API
    const freshDashboard = createInitialDashboard();
    freshDashboard.lastUpdated = new Date();
    setDashboard(freshDashboard);
  }, []);

  // Run tests
  const runTests = useCallback(async (type: string, branch: string) => {
    console.log(`Running ${type} tests on branch ${branch}...`);

    // Simulate test execution
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real implementation, this would trigger a test run via API
    console.log("Test run completed");
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TestFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Get filtered test runs
  const getFilteredRuns = useCallback((): TestRun[] => {
    let runs = dashboard.recentRuns;

    if (filters.status && filters.status.length > 0) {
      runs = runs.filter((run) => filters.status!.includes(run.status));
    }

    if (filters.type && filters.type.length > 0) {
      runs = runs.filter((run) => filters.type!.includes(run.type));
    }

    if (filters.branch) {
      runs = runs.filter((run) => run.branch === filters.branch);
    }

    if (filters.environment) {
      runs = runs.filter((run) => run.environment === filters.environment);
    }

    if (filters.dateRange) {
      runs = runs.filter(
        (run) =>
          run.startTime >= filters.dateRange!.start &&
          run.startTime <= filters.dateRange!.end
      );
    }

    return runs;
  }, [dashboard.recentRuns, filters]);

  // Get run details
  const getRunDetails = useCallback(
    (runId: string): TestRun | undefined => {
      return dashboard.recentRuns.find((run) => run.id === runId);
    },
    [dashboard.recentRuns]
  );

  const value: QAContextValue = {
    dashboard,
    selectedRun,
    filters,
    isDownloading,
    downloadProgress,
    setSelectedRun,
    updateFilters,
    downloadLogs,
    refreshData,
    runTests,
    getFilteredRuns,
    getRunDetails,
  };

  return <QAContext.Provider value={value}>{children}</QAContext.Provider>;
}

export function useQA() {
  const context = useContext(QAContext);
  if (!context) {
    throw new Error("useQA must be used within QAProvider");
  }
  return context;
}
