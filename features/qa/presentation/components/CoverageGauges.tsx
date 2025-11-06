"use client";

import React from "react";
import { useQA } from "../../context/QAContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, Target } from "lucide-react";
import { NoCoverageDataEmptyState } from "./EmptyStates";

interface CoverageGaugesProps {
  className?: string;
}

const getCoverageColor = (percentage: number) => {
  if (percentage >= 80) return "text-green-500";
  if (percentage >= 60) return "text-yellow-500";
  return "text-red-500";
};

const getCoverageStatus = (percentage: number) => {
  if (percentage >= 80)
    return { icon: CheckCircle, text: "Excellent", color: "text-green-500" };
  if (percentage >= 60)
    return { icon: AlertTriangle, text: "Good", color: "text-yellow-500" };
  return {
    icon: AlertTriangle,
    text: "Needs Improvement",
    color: "text-red-500",
  };
};

export function CoverageGauges({ className }: CoverageGaugesProps) {
  const { dashboard } = useQA();

  const coverageReport = dashboard.coverageReport;

  if (!coverageReport) {
    return (
      <NoCoverageDataEmptyState
        onConfigureCoverage={() => {
          // TODO: Implement coverage configuration
          console.log("Configure coverage clicked");
        }}
        onGenerateReport={() => {
          // TODO: Implement report generation
          console.log("Generate report clicked");
        }}
        className={className}
      />
    );
  }

  const coverageMetrics = [
    {
      label: "Line Coverage",
      value:
        coverageReport.metrics.find((m) => m.type === "line")?.percentage || 0,
      target: 80,
      description: "Percentage of code lines executed",
    },
    {
      label: "Branch Coverage",
      value:
        coverageReport.metrics.find((m) => m.type === "branch")?.percentage ||
        0,
      target: 75,
      description: "Percentage of branches executed",
    },
    {
      label: "Function Coverage",
      value:
        coverageReport.metrics.find((m) => m.type === "function")?.percentage ||
        0,
      target: 85,
      description: "Percentage of functions called",
    },
    {
      label: "Statement Coverage",
      value:
        coverageReport.metrics.find((m) => m.type === "statement")
          ?.percentage || 0,
      target: 80,
      description: "Percentage of statements executed",
    },
  ];

  const overallCoverage = Math.round(coverageReport.overall);

  const overallStatus = getCoverageStatus(overallCoverage);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        className
      )}
    >
      {/* Overall Coverage Card */}
      <Card className="p-6 bg-card border-border rounded-2xl md:col-span-2 lg:col-span-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Overall Test Coverage
            </h3>
            <p className="text-sm text-muted-foreground">
              Combined coverage across all metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={cn("text-xs", overallStatus.color)}
            >
              {overallStatus.text}
            </Badge>
            <overallStatus.icon
              className={cn("w-5 h-5", overallStatus.color)}
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Coverage</span>
              <span
                className={cn(
                  "text-lg font-bold",
                  getCoverageColor(overallCoverage)
                )}
              >
                {overallCoverage}%
              </span>
            </div>
            <Progress value={overallCoverage} className="h-3" />
          </div>

          <div className="text-center min-w-0">
            <div
              className={cn(
                "text-3xl font-bold mb-1",
                getCoverageColor(overallCoverage)
              )}
            >
              {overallCoverage}%
            </div>
            <div className="text-xs text-muted-foreground">Target: 80%</div>
          </div>
        </div>
      </Card>

      {/* Individual Coverage Gauges */}
      {coverageMetrics.map((metric, index) => {
        const status = getCoverageStatus(metric.value);
        const StatusIcon = status.icon;

        return (
          <Card key={index} className="p-6 bg-card border-border rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-foreground">
                {metric.label}
              </h4>
              <StatusIcon className={cn("w-4 h-4", status.color)} />
            </div>

            <div className="space-y-4">
              {/* Gauge */}
              <div className="relative">
                <div className="w-24 h-24 mx-auto relative">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    {/* Background circle */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="2"
                    />
                    {/* Progress circle */}
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={
                        metric.value >= metric.target
                          ? "#10B981"
                          : metric.value >= 60
                          ? "#F59E0B"
                          : "#EF4444"
                      }
                      strokeWidth="2"
                      strokeDasharray={`${metric.value}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={cn(
                        "text-lg font-bold",
                        getCoverageColor(metric.value)
                      )}
                    >
                      {metric.value}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="text-center space-y-1">
                <div className="text-xs text-muted-foreground">
                  {metric.description}
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Target className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Target: {metric.target}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <Progress value={metric.value} className="h-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span className={cn(getCoverageColor(metric.target))}>
                    {metric.target}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
