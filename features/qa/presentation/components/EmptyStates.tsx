"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RefreshCw,
  HelpCircle,
  Play,
  FileText,
  BarChart3,
  TestTube,
  Zap,
  Search,
  Filter,
  Settings,
} from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "outline" | "secondary";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "outline" | "secondary";
  };
  helpLink?: {
    label: string;
    href: string;
  };
  className?: string;
  variant?: "default" | "minimal" | "card";
}

// Predefined illustrations for common empty states
const EmptyStateIllustrations = {
  tests: (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-linear-to-br from-card to-card/50 border border-border flex items-center justify-center">
        <TestTube className="w-12 h-12 text-primary" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-linear-to-br from-secondary to-highlight flex items-center justify-center animate-pulse">
        <Zap className="w-3 h-3 text-white" />
      </div>
    </div>
  ),
  coverage: (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-linear-to-br from-card to-card/50 border border-border flex items-center justify-center">
        <BarChart3 className="w-12 h-12 text-secondary" />
      </div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-linear-to-br from-highlight to-primary flex items-center justify-center animate-pulse">
        <Search className="w-3 h-3 text-white" />
      </div>
    </div>
  ),
  search: (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-linear-to-br from-card to-card/50 border border-border flex items-center justify-center">
        <Search className="w-12 h-12 text-muted-foreground" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Filter className="w-4 h-4 text-primary" />
      </div>
    </div>
  ),
  error: (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-linear-to-br from-card to-card/50 border border-border flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-destructive" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-linear-to-br from-destructive to-destructive/50 flex items-center justify-center">
        <span className="text-xs text-white font-bold">!</span>
      </div>
    </div>
  ),
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  helpLink,
  className,
  variant = "default",
}: EmptyStateProps) {
  const containerClasses = cn(
    "flex flex-col items-center justify-center text-center",
    {
      "min-h-[300px] p-8": variant === "default",
      "min-h-[200px] p-6": variant === "minimal",
      "p-8": variant === "card",
    },
    className
  );

  const Wrapper = variant === "card" ? Card : "div";

  return (
    <Wrapper className={containerClasses}>
      {/* Illustration */}
      <div className="mb-6">{icon}</div>

      {/* Content */}
      <div className="max-w-md space-y-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || "default"}
                className="min-w-[120px]"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="outline"
                className="min-w-[120px]"
              >
                {secondaryAction.icon && (
                  <span className="mr-2">{secondaryAction.icon}</span>
                )}
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}

        {/* Help Link */}
        {helpLink && (
          <div className="pt-4">
            <Button
              variant="link"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-primary"
            >
              <a href={helpLink.href} target="_blank" rel="noopener noreferrer">
                <HelpCircle className="w-4 h-4 mr-1" />
                {helpLink.label}
              </a>
            </Button>
          </div>
        )}
      </div>
    </Wrapper>
  );
}

// Specific empty state components for QA dashboard
export function NoTestRunsEmptyState({
  onRunTests,
  onImportData,
  className,
}: {
  onRunTests?: () => void;
  onImportData?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={EmptyStateIllustrations.tests}
      title="No test runs found (yet!)"
      description="Your QA dashboard is ready to track automated tests. Run your first test suite or import existing test data to get started with monitoring."
      action={
        onRunTests
          ? {
              label: "Run Tests",
              onClick: onRunTests,
              icon: <Play className="w-4 h-4" />,
            }
          : undefined
      }
      secondaryAction={
        onImportData
          ? {
              label: "Import Data",
              onClick: onImportData,
              icon: <FileText className="w-4 h-4" />,
            }
          : undefined
      }
      helpLink={{
        label: "Learn about test automation",
        href: "/docs/testing",
      }}
      className={className}
    />
  );
}

export function NoCoverageDataEmptyState({
  onGenerateReport,
  onConfigureCoverage,
  className,
}: {
  onGenerateReport?: () => void;
  onConfigureCoverage?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={EmptyStateIllustrations.coverage}
      title="Coverage data not available"
      description="Set up code coverage tracking to monitor how well your tests exercise your codebase. Configure your test runner to generate coverage reports."
      action={
        onConfigureCoverage
          ? {
              label: "Configure Coverage",
              onClick: onConfigureCoverage,
              icon: <Settings className="w-4 h-4" />,
            }
          : undefined
      }
      secondaryAction={
        onGenerateReport
          ? {
              label: "Generate Report",
              onClick: onGenerateReport,
              icon: <BarChart3 className="w-4 h-4" />,
            }
          : undefined
      }
      helpLink={{
        label: "Coverage setup guide",
        href: "/docs/coverage",
      }}
      className={className}
    />
  );
}

export function NoSearchResultsEmptyState({
  searchTerm,
  onClearFilters,
  onAdjustSearch,
  className,
}: {
  searchTerm?: string;
  onClearFilters?: () => void;
  onAdjustSearch?: () => void;
  className?: string;
}) {
  const title = searchTerm
    ? `No results for "${searchTerm}"`
    : "No matching results";

  const description = searchTerm
    ? "Try adjusting your search terms or check the spelling. You can also clear filters to see all results."
    : "No items match your current filters. Try adjusting your criteria to see more results.";

  return (
    <EmptyState
      icon={EmptyStateIllustrations.search}
      title={title}
      description={description}
      action={
        onClearFilters
          ? {
              label: "Clear Filters",
              onClick: onClearFilters,
              variant: "outline" as const,
            }
          : undefined
      }
      secondaryAction={
        onAdjustSearch
          ? {
              label: "Adjust Search",
              onClick: onAdjustSearch,
              variant: "outline" as const,
            }
          : undefined
      }
      className={className}
      variant="minimal"
    />
  );
}

export function ErrorState({
  error,
  onRetry,
  onContactSupport,
  className,
}: {
  error?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={EmptyStateIllustrations.error}
      title="Something went wrong"
      description={
        error ||
        "We encountered an error while loading the data. Please try again or contact support if the problem persists."
      }
      action={
        onRetry
          ? {
              label: "Try Again",
              onClick: onRetry,
              icon: <RefreshCw className="w-4 h-4" />,
            }
          : undefined
      }
      secondaryAction={
        onContactSupport
          ? {
              label: "Contact Support",
              onClick: onContactSupport,
              icon: <HelpCircle className="w-4 h-4" />,
            }
          : undefined
      }
      className={className}
    />
  );
}
