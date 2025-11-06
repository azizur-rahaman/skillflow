"use client";

import React from "react";
import { useQA } from "../../context/QAContext";
import { TestRun, TEST_STATUSES, TEST_TYPES } from "../../types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Download,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
  Loader2,
  Calendar,
  GitBranch,
  Server,
  FileText,
} from "lucide-react";

interface TestSummaryCardsProps {
  className?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "passed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "failed":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "skipped":
      return <Minus className="w-5 h-5 text-yellow-500" />;
    case "running":
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    case "queued":
      return <Clock className="w-5 h-5 text-gray-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

export function TestSummaryCards({ className }: TestSummaryCardsProps) {
  const { dashboard, downloadLogs, isDownloading, runTests } = useQA();

  const handleDownloadLogs = async (run: TestRun) => {
    await downloadLogs({
      type: "logs",
      testRunId: run.id,
      format: "html",
    });
  };

  const handleDownloadReport = async (run: TestRun) => {
    await downloadLogs({
      type: "report",
      testRunId: run.id,
      format: "html",
    });
  };

  const handleRerun = async (run: TestRun) => {
    await runTests(run.type, run.branch);
  };

  const getSuccessRate = (run: TestRun) => {
    if (run.totalTests === 0) return 0;
    return Math.round((run.passedTests / run.totalTests) * 100);
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {dashboard.recentRuns.slice(0, 4).map((run) => {
        const statusConfig = TEST_STATUSES.find((s) => s.status === run.status);
        const successRate = getSuccessRate(run);
        const testType = TEST_TYPES.find((t) => t.type === run.type);

        return (
          <Card
            key={run.id}
            className={cn(
              "p-6 bg-card border-border rounded-2xl hover:shadow-lg transition-all duration-200",
              run.status === "passed" && "hover:border-green-500/30",
              run.status === "failed" && "hover:border-red-500/30",
              run.status === "running" && "hover:border-blue-500/30"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  {getStatusIcon(run.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2">
                    {run.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: testType?.color,
                        color: testType?.color,
                      }}
                    >
                      {run.type.toUpperCase()}
                    </Badge>
                    {statusConfig && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          statusConfig.bgColor,
                          statusConfig.borderColor,
                          statusConfig.color
                        )}
                      >
                        {statusConfig.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Success Rate</span>
                <span className="font-semibold text-foreground">
                  {successRate}%
                </span>
              </div>
              <Progress value={successRate} className="h-2" />

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-500">
                    {run.passedTests}
                  </div>
                  <div className="text-xs text-muted-foreground">Passed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-500">
                    {run.failedTests}
                  </div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-500">
                    {run.skippedTests}
                  </div>
                  <div className="text-xs text-muted-foreground">Skipped</div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Started:</span>
                <span className="text-foreground">
                  {run.startTime.toLocaleDateString()}{" "}
                  {run.startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {run.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-foreground">
                    {formatDuration(run.duration)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Branch:</span>
                <span className="text-foreground font-mono text-xs">
                  {run.branch}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Environment:</span>
                <span className="text-foreground">{run.environment}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {run.logsUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadLogs(run)}
                  disabled={isDownloading}
                  className="flex-1 min-w-0"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Logs
                </Button>
              )}

              {run.reportUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReport(run)}
                  disabled={isDownloading}
                  className="flex-1 min-w-0"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Report
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRerun(run)}
                className="flex-1 min-w-0"
              >
                <Play className="w-4 h-4 mr-1" />
                Re-run
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
