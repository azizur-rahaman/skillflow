"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Shield,
  TrendingUp,
  Calendar,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
} from "lucide-react";
import {
  ComplianceProvider,
  useCompliance,
} from "../context/ComplianceContext";
import { ComplianceCards } from "./components/ComplianceCards";
import { AuditTimeline } from "./components/AuditTimeline";

interface ComplianceDashboardProps {
  className?: string;
}

function ComplianceDashboardContent({ className }: ComplianceDashboardProps) {
  const { dashboard, refreshComplianceData, getComplianceStats } =
    useCompliance();

  const stats = getComplianceStats();

  const overallCompliance = React.useMemo(() => {
    if (stats.totalFrameworks === 0) return 0;
    return Math.round(
      (stats.compliantFrameworks / stats.totalFrameworks) * 100
    );
  }, [stats]);

  const handleRefresh = async () => {
    await refreshComplianceData();
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <Card className="p-8 bg-linear-to-r from-primary/5 via-secondary/5 to-accent/5 border-border rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Compliance Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Monitor regulatory compliance across all frameworks and
                standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {overallCompliance}%
            </div>
            <div className="text-sm text-muted-foreground">
              Overall Compliance
            </div>
            <Progress value={overallCompliance} className="mt-2 h-2" />
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {stats.compliantFrameworks}
            </div>
            <div className="text-sm text-muted-foreground">Compliant</div>
            <div className="flex justify-center mt-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {stats.warningFrameworks}
            </div>
            <div className="text-sm text-muted-foreground">Warnings</div>
            <div className="flex justify-center mt-2">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {stats.nonCompliantFrameworks}
            </div>
            <div className="text-sm text-muted-foreground">Non-Compliant</div>
            <div className="flex justify-center mt-2">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Upcoming Audits:
            </span>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {stats.upcomingAudits}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Overdue:</span>
            <Badge variant="outline" className="text-red-400 border-red-400">
              {stats.overdueAudits}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last Updated:</span>
            <span className="text-sm text-foreground">
              {dashboard.lastUpdated.toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Compliance Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Compliance Status
          </h2>
          <Badge variant="outline" className="text-xs">
            {stats.totalFrameworks} Frameworks Monitored
          </Badge>
        </div>
        <ComplianceCards />
      </div>

      {/* Audit Timeline */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Audit History
          </h2>
          <Badge variant="outline" className="text-xs">
            {dashboard.auditHistory.length} Total Audits
          </Badge>
        </div>
        <AuditTimeline limit={10} />
      </div>
    </div>
  );
}

export function ComplianceDashboard({ className }: ComplianceDashboardProps) {
  return (
    <ComplianceProvider>
      <ComplianceDashboardContent className={className} />
    </ComplianceProvider>
  );
}
