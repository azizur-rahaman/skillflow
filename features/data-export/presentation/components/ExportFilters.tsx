/**
 * Export Filters Component
 * Filter panel for data export with time range, team, and metric selections
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, BarChart3, RotateCcw, Filter } from "lucide-react";
import { ExportFiltersProps, MetricType, TimeRange } from "../../types";
import { cn } from "@/lib/utils";

const TIME_RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
  { value: "custom", label: "Custom range" },
] as const;

const METRIC_OPTIONS: {
  value: MetricType;
  label: string;
  description: string;
}[] = [
  {
    value: "skills",
    label: "Skills Data",
    description: "Skill profiles and competencies",
  },
  {
    value: "users",
    label: "User Analytics",
    description: "User behavior and engagement",
  },
  {
    value: "teams",
    label: "Team Metrics",
    description: "Team performance and collaboration",
  },
  {
    value: "assessments",
    label: "Assessments",
    description: "Assessment results and analytics",
  },
  {
    value: "transactions",
    label: "Transactions",
    description: "Token and financial transactions",
  },
  {
    value: "learning",
    label: "Learning Data",
    description: "Course progress and learning paths",
  },
  {
    value: "gamification",
    label: "Gamification",
    description: "Badges, XP, and achievements",
  },
  {
    value: "analytics",
    label: "Platform Analytics",
    description: "System usage and performance",
  },
];

export const ExportFilters: React.FC<ExportFiltersProps> = ({
  filters,
  availableTeams,
  onFiltersChange,
  onReset,
  className,
}) => {
  const handleTimeRangeChange = (timeRange: string) => {
    onFiltersChange({ timeRange: timeRange as TimeRange });
  };

  const handleTeamToggle = (team: string) => {
    const newTeams = filters.teams.includes(team)
      ? filters.teams.filter((t) => t !== team)
      : [...filters.teams, team];
    onFiltersChange({ teams: newTeams });
  };

  const handleMetricToggle = (metric: MetricType) => {
    const newMetrics = filters.metrics.includes(metric)
      ? filters.metrics.filter((m) => m !== metric)
      : [...filters.metrics, metric];
    onFiltersChange({ metrics: newMetrics });
  };

  const handlePrivacyToggle = (
    key: "includePersonalData" | "anonymizeData",
    value: boolean
  ) => {
    onFiltersChange({ [key]: value });
  };

  return (
    <Card
      className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5 text-primary" />
          Export Filters
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              Time Range
            </label>
          </div>
          <Select
            value={filters.timeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Teams */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">Teams</label>
            {filters.teams.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {filters.teams.length} selected
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availableTeams.map((team) => (
              <div key={team} className="flex items-center space-x-2">
                <Checkbox
                  id={`team-${team}`}
                  checked={filters.teams.includes(team)}
                  onCheckedChange={() => handleTeamToggle(team)}
                />
                <label
                  htmlFor={`team-${team}`}
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  {team}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              Data Types
            </label>
            {filters.metrics.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {filters.metrics.length} selected
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            {METRIC_OPTIONS.map((metric) => (
              <div
                key={metric.value}
                className="flex items-start space-x-2 p-2 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <Checkbox
                  id={`metric-${metric.value}`}
                  checked={filters.metrics.includes(metric.value)}
                  onCheckedChange={() => handleMetricToggle(metric.value)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`metric-${metric.value}`}
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    {metric.label}
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/30">
          <h4 className="text-sm font-medium text-foreground">
            Privacy & Security
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-foreground">
                  Include Personal Data
                </label>
                <p className="text-xs text-muted-foreground">
                  Names, emails, and identifiers
                </p>
              </div>
              <Checkbox
                checked={filters.includePersonalData}
                onCheckedChange={(checked) =>
                  handlePrivacyToggle("includePersonalData", !!checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-foreground">
                  Anonymize Data
                </label>
                <p className="text-xs text-muted-foreground">
                  Remove identifying information
                </p>
              </div>
              <Checkbox
                checked={filters.anonymizeData}
                onCheckedChange={(checked) =>
                  handlePrivacyToggle("anonymizeData", !!checked)
                }
                disabled={!filters.includePersonalData}
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-2 border-t border-border/50">
          <Button
            variant="outline"
            onClick={onReset}
            className="w-full border-border/50 hover:bg-muted/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
