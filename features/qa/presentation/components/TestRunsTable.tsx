"use client";

import React, { useState } from "react";
import { useQA } from "../../context/QAContext";
import { TestRun, TEST_STATUSES, TEST_TYPES } from "../../types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Download,
  Play,
  Search,
  Clock,
  GitBranch,
  FileText,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { NoSearchResultsEmptyState } from "./EmptyStates";

interface TestRunsTableProps {
  className?: string;
}

type SortField =
  | "startTime"
  | "name"
  | "status"
  | "duration"
  | "totalTests"
  | "successRate";
type SortDirection = "asc" | "desc";

export function TestRunsTable({ className }: TestRunsTableProps) {
  const { dashboard, downloadLogs, isDownloading, runTests } = useQA();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("startTime");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

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

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getSuccessRate = (run: TestRun) => {
    if (run.totalTests === 0) return 0;
    return Math.round((run.passedTests / run.totalTests) * 100);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = TEST_STATUSES.find((s) => s.status === status);
    if (!statusConfig) return null;

    return (
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
    );
  };

  const getTypeBadge = (type: string) => {
    const testType = TEST_TYPES.find((t) => t.type === type);
    if (!testType) return null;

    return (
      <Badge
        variant="outline"
        className="text-xs"
        style={{
          borderColor: testType.color,
          color: testType.color,
        }}
      >
        {testType.label}
      </Badge>
    );
  };

  // Filter and sort runs
  const filteredRuns = dashboard.recentRuns
    .filter((run) => {
      const matchesSearch =
        run.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.triggeredBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || run.status === statusFilter;
      const matchesType = typeFilter === "all" || run.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortField) {
        case "startTime":
          aValue = a.startTime.getTime();
          bValue = b.startTime.getTime();
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "duration":
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        case "totalTests":
          aValue = a.totalTests;
          bValue = b.totalTests;
          break;
        case "successRate":
          aValue = getSuccessRate(a);
          bValue = getSuccessRate(b);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <Card className={cn("bg-card border-border rounded-2xl", className)}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Test Runs</h3>
          <Badge variant="outline" className="text-xs">
            {filteredRuns.length} of {dashboard.recentRuns.length} runs
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search runs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {TEST_STATUSES.map((status) => (
                <SelectItem key={status.status} value={status.status}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {TEST_TYPES.map((type) => (
                <SelectItem key={type.type} value={type.type}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="border-b border-border bg-muted/30">
            <div className="grid grid-cols-8 gap-4 p-4 text-sm font-medium text-muted-foreground">
              <div
                className="cursor-pointer hover:text-foreground flex items-center gap-2"
                onClick={() => handleSort("name")}
              >
                Test Name
                <SortIcon field="name" />
              </div>
              <div
                className="cursor-pointer hover:text-foreground flex items-center gap-2"
                onClick={() => handleSort("status")}
              >
                Status
                <SortIcon field="status" />
              </div>
              <div>Type</div>
              <div
                className="cursor-pointer hover:text-foreground flex items-center gap-2"
                onClick={() => handleSort("successRate")}
              >
                Success Rate
                <SortIcon field="successRate" />
              </div>
              <div
                className="cursor-pointer hover:text-foreground flex items-center gap-2"
                onClick={() => handleSort("duration")}
              >
                Duration
                <SortIcon field="duration" />
              </div>
              <div
                className="cursor-pointer hover:text-foreground flex items-center gap-2"
                onClick={() => handleSort("startTime")}
              >
                Started
                <SortIcon field="startTime" />
              </div>
              <div>Branch</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {filteredRuns.map((run) => (
              <div
                key={run.id}
                className="grid grid-cols-8 gap-4 p-4 hover:bg-muted/30"
              >
                <div className="font-medium">
                  <div>
                    <div className="font-semibold text-foreground line-clamp-1">
                      {run.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {run.triggeredBy}
                    </div>
                  </div>
                </div>
                <div>{getStatusBadge(run.status)}</div>
                <div>{getTypeBadge(run.type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-semibold",
                        getSuccessRate(run) >= 80
                          ? "text-green-500"
                          : getSuccessRate(run) >= 60
                          ? "text-yellow-500"
                          : "text-red-500"
                      )}
                    >
                      {getSuccessRate(run)}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({run.passedTests}/{run.totalTests})
                    </span>
                  </div>
                </div>
                <div>
                  {run.duration ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDuration(run.duration)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
                <div>
                  <div className="text-sm">
                    <div>{run.startTime.toLocaleDateString()}</div>
                    <div className="text-muted-foreground">
                      {run.startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-mono">{run.branch}</span>
                  </div>
                </div>
                <div>
                  <div className="flex gap-1">
                    {run.logsUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadLogs(run)}
                        disabled={isDownloading}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                    {run.reportUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadReport(run)}
                        disabled={isDownloading}
                        className="h-8 w-8 p-0"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRerun(run)}
                      className="h-8 w-8 p-0"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredRuns.length === 0 && (
        <div className="p-8">
          <NoSearchResultsEmptyState
            searchTerm={searchTerm}
            onClearFilters={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            onAdjustSearch={() => {
              // Focus search input or show search tips
              console.log("Adjust search clicked");
            }}
          />
        </div>
      )}
    </Card>
  );
}
