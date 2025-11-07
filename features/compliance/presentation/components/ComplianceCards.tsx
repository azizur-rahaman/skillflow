"use client";

import React from "react";
import { useCompliance } from "../../context/ComplianceContext";
import { COMPLIANCE_STATUSES } from "../../types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Download,
  ExternalLink,
  Calendar,
  User,
  Award,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Lock,
  CheckSquare,
  Heart,
  CreditCard,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ComplianceCardsProps {
  className?: string;
}

const getFrameworkIcon = (frameworkId: string) => {
  switch (frameworkId) {
    case "gdpr":
      return <Shield className="w-6 h-6" />;
    case "iso27001":
      return <Lock className="w-6 h-6" />;
    case "soc2":
      return <CheckSquare className="w-6 h-6" />;
    case "hipaa":
      return <Heart className="w-6 h-6" />;
    case "pci-dss":
      return <CreditCard className="w-6 h-6" />;
    default:
      return <Shield className="w-6 h-6" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "compliant":
      return <CheckCircle className="w-4 h-4" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4" />;
    case "non-compliant":
      return <XCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export function ComplianceCards({ className }: ComplianceCardsProps) {
  const {
    dashboard,
    downloadReport,
    isDownloading,
    downloadProgress,
    getFrameworkResults,
  } = useCompliance();

  const handleDownloadReport = async (
    frameworkId: string,
    reportType: "audit-report" | "certificate"
  ) => {
    await downloadReport({
      frameworkId: frameworkId as
        | "gdpr"
        | "iso27001"
        | "soc2"
        | "hipaa"
        | "pci-dss",
      reportType,
      format: "pdf",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {dashboard.frameworks.map((framework) => {
        const result = getFrameworkResults(framework.id);
        const statusConfig = COMPLIANCE_STATUSES.find(
          (s) => s.status === result?.status
        );
        const downloadId = `${framework.id}-audit-report`;
        const isDownloadingThis =
          isDownloading && downloadProgress[downloadId] !== undefined;
        const progress = downloadProgress[downloadId] || 0;

        return (
          <Card
            key={framework.id}
            className={cn(
              "p-6 bg-card border-border rounded-2xl hover:shadow-lg transition-all duration-200",
              result?.status === "compliant" && "hover:border-green-500/30",
              result?.status === "warning" && "hover:border-yellow-500/30",
              result?.status === "non-compliant" && "hover:border-red-500/30"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${framework.color}20` }}
                >
                  {getFrameworkIcon(framework.id)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {framework.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {framework.category}
                  </p>
                </div>
              </div>

              {result && (
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1",
                    statusConfig?.bgColor,
                    statusConfig?.borderColor,
                    statusConfig?.color
                  )}
                >
                  {getStatusIcon(result.status)}
                  {statusConfig?.label}
                </Badge>
              )}
            </div>

            {/* Status and Score */}
            {result && (
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Compliance Score
                  </span>
                  <span className="font-semibold text-foreground">
                    {result.score}%
                  </span>
                </div>
                <Progress
                  value={result.score}
                  className="h-2"
                  style={{
                    backgroundColor: `${framework.color}20`,
                  }}
                />
              </div>
            )}

            {/* Key Information */}
            {result && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Audit:</span>
                  <span className="text-foreground">
                    {formatDate(result.lastAuditDate)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Auditor:</span>
                  <span className="text-foreground">{result.auditor}</span>
                </div>

                {result.validUntil && (
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Valid Until:</span>
                    <span className="text-foreground">
                      {formatDate(result.validUntil)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Findings Summary */}
            {result && result.findings.length > 0 && (
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Open Findings
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {
                      result.findings.filter((f) => f.status !== "resolved")
                        .length
                    }
                  </Badge>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {result?.reportUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownloadReport(framework.id, "audit-report")
                  }
                  disabled={isDownloading}
                  className="w-full justify-start"
                >
                  {isDownloadingThis ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Downloading... {progress}%
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </>
                  )}
                </Button>
              )}

              {result?.certificateUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownloadReport(framework.id, "certificate")
                  }
                  disabled={isDownloading}
                  className="w-full justify-start"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Download Certificate
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                asChild
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <a
                  href={framework.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Standard
                </a>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
