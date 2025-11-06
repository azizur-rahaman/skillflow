"use client";

import React from "react";
import { useQA } from "../../context/QAContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PassFailChartsProps {
  className?: string;
}

const COLORS = {
  passed: "text-green-500",
  failed: "text-red-500",
  skipped: "text-amber-500",
  running: "text-blue-500",
  queued: "text-gray-500",
};

export function PassFailCharts({ className }: PassFailChartsProps) {
  const { dashboard } = useQA();

  // Prepare data for bar chart (last 7 days)
  const barChartData = dashboard.recentRuns
    .slice(0, 7)
    .reverse()
    .map((run) => ({
      date: run.startTime.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }),
      passed: run.passedTests,
      failed: run.failedTests,
      skipped: run.skippedTests,
      total: run.totalTests,
    }));

  // Prepare data for pie chart (overall status distribution)
  const statusCounts = dashboard.recentRuns.reduce((acc, run) => {
    acc[run.status] = (acc[run.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: COLORS[status as keyof typeof COLORS] || COLORS.queued,
  }));

  // Calculate totals
  const totalTests = dashboard.recentRuns.reduce(
    (sum, run) => sum + run.totalTests,
    0
  );
  const totalPassed = dashboard.recentRuns.reduce(
    (sum, run) => sum + run.passedTests,
    0
  );

  const overallSuccessRate =
    totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;

  return (
    <div className={cn("grid grid-cols-1 xl:grid-cols-2 gap-6", className)}>
      {/* Bar Chart - Daily Test Results */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Daily Test Results
            </h3>
            <p className="text-sm text-muted-foreground">
              Pass/fail trends over the last 7 days
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Last 7 Days
          </Badge>
        </div>

        <div className="space-y-4">
          {barChartData.map((day, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  {day.date}
                </span>
                <span className="text-foreground">{day.total} tests</span>
              </div>
              <div className="flex h-6 bg-muted rounded-full overflow-hidden">
                <div
                  className="bg-green-500"
                  style={{
                    width: `${Math.max(
                      (day.passed / Math.max(day.total, 1)) * 100,
                      2
                    )}%`,
                  }}
                />
                <div
                  className="bg-red-500"
                  style={{
                    width: `${Math.max(
                      (day.failed / Math.max(day.total, 1)) * 100,
                      2
                    )}%`,
                  }}
                />
                <div
                  className="bg-amber-500"
                  style={{
                    width: `${Math.max(
                      (day.skipped / Math.max(day.total, 1)) * 100,
                      2
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Passed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span className="text-sm text-muted-foreground">Failed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500"></div>
            <span className="text-sm text-muted-foreground">Skipped</span>
          </div>
        </div>
      </Card>

      {/* Status Distribution */}
      <Card className="p-6 bg-card border-border rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Test Status Distribution
            </h3>
            <p className="text-sm text-muted-foreground">
              Overall status breakdown
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {dashboard.recentRuns.length} Runs
          </Badge>
        </div>

        <div className="space-y-4">
          {pieChartData.map((status, index) => {
            const percentage = Math.round(
              (status.value / dashboard.recentRuns.length) * 100
            );
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    {status.name}
                  </span>
                  <span className="text-foreground">
                    {status.value} ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {overallSuccessRate}%
            </div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {totalTests}
            </div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
