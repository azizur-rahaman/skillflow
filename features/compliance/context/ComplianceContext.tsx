"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  ComplianceDashboard,
  ComplianceResult,
  AuditEvent,
  DownloadRequest,
  ComplianceStats,
  COMPLIANCE_FRAMEWORKS,
  MOCK_COMPLIANCE_RESULTS,
  MOCK_AUDIT_HISTORY,
} from "../types";

interface ComplianceContextValue {
  // State
  dashboard: ComplianceDashboard;
  selectedFramework: string | null;
  isDownloading: boolean;
  downloadProgress: Record<string, number>;

  // Actions
  setSelectedFramework: (frameworkId: string | null) => void;
  downloadReport: (request: DownloadRequest) => Promise<void>;
  refreshComplianceData: () => Promise<void>;
  getComplianceStats: () => ComplianceStats;
  getFrameworkResults: (frameworkId: string) => ComplianceResult | undefined;
  getFrameworkAudits: (frameworkId: string) => AuditEvent[];
}

const ComplianceContext = createContext<ComplianceContextValue | undefined>(
  undefined
);

// Create initial dashboard data
const createInitialDashboard = (): ComplianceDashboard => {
  const results = MOCK_COMPLIANCE_RESULTS;
  const auditHistory = MOCK_AUDIT_HISTORY;
  const overallScore =
    results.reduce((sum, result) => sum + result.score, 0) / results.length;

  return {
    frameworks: COMPLIANCE_FRAMEWORKS,
    results,
    auditHistory,
    overallScore: Math.round(overallScore),
    lastUpdated: new Date(),
  };
};

export function ComplianceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dashboard, setDashboard] = useState<ComplianceDashboard>(
    createInitialDashboard
  );
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    null
  );
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<
    Record<string, number>
  >({});

  // Download report with progress tracking
  const downloadReport = useCallback(async (request: DownloadRequest) => {
    const downloadId = `${request.frameworkId}-${request.reportType}`;
    setIsDownloading(true);
    setDownloadProgress((prev) => ({ ...prev, [downloadId]: 0 }));

    try {
      // Simulate download progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setDownloadProgress((prev) => ({ ...prev, [downloadId]: progress }));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Simulate file download
      const fileName = `${request.frameworkId}-${request.reportType}-${
        new Date().toISOString().split("T")[0]
      }.${request.format}`;
      console.log(`Downloading ${fileName}...`);

      // In a real implementation, this would trigger a file download
      // For now, we'll just log the download request
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

  // Refresh compliance data
  const refreshComplianceData = useCallback(async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, this would fetch fresh data from the API
    const freshDashboard = createInitialDashboard();
    freshDashboard.lastUpdated = new Date();
    setDashboard(freshDashboard);
  }, []);

  // Get compliance statistics
  const getComplianceStats = useCallback((): ComplianceStats => {
    const results = dashboard.results;
    const audits = dashboard.auditHistory;

    const compliantFrameworks = results.filter(
      (r) => r.status === "compliant"
    ).length;
    const warningFrameworks = results.filter(
      (r) => r.status === "warning"
    ).length;
    const nonCompliantFrameworks = results.filter(
      (r) => r.status === "non-compliant"
    ).length;

    const upcomingAudits = audits.filter(
      (a) => a.status === "scheduled" && a.startDate > new Date()
    ).length;

    const overdueAudits = audits.filter(
      (a) => a.status === "scheduled" && a.startDate < new Date()
    ).length;

    return {
      totalFrameworks: results.length,
      compliantFrameworks,
      warningFrameworks,
      nonCompliantFrameworks,
      upcomingAudits,
      overdueAudits,
    };
  }, [dashboard]);

  // Get results for a specific framework
  const getFrameworkResults = useCallback(
    (frameworkId: string): ComplianceResult | undefined => {
      return dashboard.results.find((r) => r.frameworkId === frameworkId);
    },
    [dashboard.results]
  );

  // Get audit history for a specific framework
  const getFrameworkAudits = useCallback(
    (frameworkId: string): AuditEvent[] => {
      return dashboard.auditHistory
        .filter((a) => a.frameworkId === frameworkId)
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    },
    [dashboard.auditHistory]
  );

  const value: ComplianceContextValue = {
    dashboard,
    selectedFramework,
    isDownloading,
    downloadProgress,
    setSelectedFramework,
    downloadReport,
    refreshComplianceData,
    getComplianceStats,
    getFrameworkResults,
    getFrameworkAudits,
  };

  return (
    <ComplianceContext.Provider value={value}>
      {children}
    </ComplianceContext.Provider>
  );
}

export function useCompliance() {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error("useCompliance must be used within ComplianceProvider");
  }
  return context;
}
