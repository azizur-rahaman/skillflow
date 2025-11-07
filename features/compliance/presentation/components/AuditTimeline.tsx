"use client";

import React from "react";
import { useCompliance } from "../../context/ComplianceContext";
import { AuditEvent } from "../../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  User,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  Award,
  RefreshCw,
} from "lucide-react";

interface AuditTimelineProps {
  className?: string;
  limit?: number;
}

const getAuditStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "in-progress":
      return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    case "scheduled":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "failed":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  }
};

const getAuditStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-400 bg-green-500/10 border-green-500/20";
    case "in-progress":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "scheduled":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "failed":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    default:
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  }
};

const getAuditTypeLabel = (type: string) => {
  switch (type) {
    case "initial":
      return "Initial Audit";
    case "recurring":
      return "Recurring Audit";
    case "remediation":
      return "Remediation";
    case "certification":
      return "Certification";
    default:
      return "Audit";
  }
};

export function AuditTimeline({ className, limit }: AuditTimelineProps) {
  const { dashboard, downloadReport, isDownloading } = useCompliance();

  const sortedAudits = React.useMemo(() => {
    return dashboard.auditHistory
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
      .slice(0, limit);
  }, [dashboard.auditHistory, limit]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadReport = async (audit: AuditEvent) => {
    if (audit.reportUrl) {
      await downloadReport({
        frameworkId: audit.frameworkId,
        reportType: "audit-report",
        format: "pdf",
      });
    }
  };

  return (
    <Card className={cn("p-6 bg-card border-border rounded-2xl", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Audit Timeline
            </h3>
            <p className="text-sm text-muted-foreground">
              Historical compliance audits and certifications
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {dashboard.auditHistory.length} Total Audits
          </Badge>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {sortedAudits.map((audit, index) => {
            const framework = dashboard.frameworks.find(
              (f) => f.id === audit.frameworkId
            );

            return (
              <div key={audit.id} className="relative">
                {/* Timeline line */}
                {index < sortedAudits.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-16 bg-border" />
                )}

                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="shrink-0 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center">
                    {getAuditStatusIcon(audit.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">
                            {framework?.name} {getAuditTypeLabel(audit.type)}
                          </h4>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              getAuditStatusColor(audit.status)
                            )}
                          >
                            {audit.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(audit.startDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {audit.auditor}
                          </div>
                          {audit.score && (
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {audit.score}% Score
                            </div>
                          )}
                        </div>

                        {audit.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {audit.notes}
                          </p>
                        )}

                        {audit.findingsCount > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {audit.findingsCount} Finding
                              {audit.findingsCount !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {audit.reportUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReport(audit)}
                            disabled={isDownloading}
                            className="shrink-0"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}

                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Completion details */}
                    {audit.completionDate && (
                      <div className="mt-3 pl-4 border-l-2 border-muted">
                        <div className="text-xs text-muted-foreground">
                          Completed on {formatDateTime(audit.completionDate)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {sortedAudits.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-medium text-foreground mb-2">
              No Audit History
            </h4>
            <p className="text-sm text-muted-foreground">
              Audit results will appear here once compliance assessments are
              completed.
            </p>
          </div>
        )}

        {/* Load more */}
        {limit && dashboard.auditHistory.length > limit && (
          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              Load More Audits
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
