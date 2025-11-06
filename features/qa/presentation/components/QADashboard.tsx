"use client";

import React from "react";
import { useQA } from "../../context";
import { TestSummaryCards } from "./TestSummaryCards";
import { PassFailCharts } from "./PassFailCharts";
import { CoverageGauges } from "./CoverageGauges";
import { TestRunsTable } from "./TestRunsTable";
import { NoTestRunsEmptyState } from "./EmptyStates";

interface QAMonitoringDashboardProps {
  className?: string;
}

export function QAMonitoringDashboard({
  className,
}: QAMonitoringDashboardProps) {
  const { dashboard } = useQA();

  // Show empty state if no test runs at all
  if (dashboard.recentRuns.length === 0) {
    return (
      <div className={className}>
        <NoTestRunsEmptyState
          onRunTests={() => {
            // TODO: Implement run tests functionality
            console.log("Run tests clicked");
          }}
          onImportData={() => {
            // TODO: Implement import data functionality
            console.log("Import data clicked");
          }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Test Summary Cards */}
      <div className="mb-8">
        <TestSummaryCards />
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <PassFailCharts />
      </div>

      {/* Coverage Gauges */}
      <div className="mb-8">
        <CoverageGauges />
      </div>

      {/* Test Runs Table */}
      <div>
        <TestRunsTable />
      </div>
    </div>
  );
}
