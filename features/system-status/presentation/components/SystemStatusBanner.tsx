'use client';
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useSystemStatus } from "../../context";
import { SystemStatusBannerProps, SystemStatusMessage } from "../../types";

const getStatusConfig = (status: SystemStatusMessage["status"]) => {
  switch (status) {
    case "operational":
      return {
        icon: CheckCircle,
        color: "text-green-400",
        bgColor: "bg-green-900/20",
        borderColor: "border-green-800",
        badgeVariant: "default" as const,
        badgeColor: "bg-green-600",
      };
    case "degraded":
      return {
        icon: AlertTriangle,
        color: "text-yellow-400",
        bgColor: "bg-yellow-900/20",
        borderColor: "border-yellow-800",
        badgeVariant: "secondary" as const,
        badgeColor: "bg-yellow-600",
      };
    case "maintenance":
      return {
        icon: Info,
        color: "text-blue-400",
        bgColor: "bg-blue-900/20",
        borderColor: "border-blue-800",
        badgeVariant: "secondary" as const,
        badgeColor: "bg-blue-600",
      };
    case "outage":
      return {
        icon: XCircle,
        color: "text-red-400",
        bgColor: "bg-red-900/20",
        borderColor: "border-red-800",
        badgeVariant: "destructive" as const,
        badgeColor: "bg-red-600",
      };
    default:
      return {
        icon: Info,
        color: "text-gray-400",
        bgColor: "bg-gray-900/20",
        borderColor: "border-gray-800",
        badgeVariant: "secondary" as const,
        badgeColor: "bg-gray-600",
      };
  }
};

const formatTimeRemaining = (targetDate: Date): string => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) return "Completed";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }
  return `${minutes}m remaining`;
};

export const SystemStatusBanner: React.FC<SystemStatusBannerProps> = ({
  className = "",
  showLinkToStatusPage = true,
  autoHideDelay,
}) => {
  const { state, actions } = useSystemStatus();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-hide functionality
  useEffect(() => {
    if (autoHideDelay && state.isBannerVisible) {
      const timer = setTimeout(() => {
        actions.hideBanner();
      }, autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHideDelay, state.isBannerVisible, actions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await actions.refreshStatus();
    setIsRefreshing(false);
  };

  if (!state.isBannerVisible || state.messages.length === 0) {
    return null;
  }

  const currentMessage = state.messages[0]; // Show the most recent message
  const config = getStatusConfig(currentMessage.status);
  const StatusIcon = config.icon;

  return (
    <div className={`w-full ${className}`}>
      <Alert
        className={`${config.bgColor} ${config.borderColor} border-l-4 relative`}
      >
        <div className="flex items-start justify-between gap-4">
          {/* Status Icon and Content */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <StatusIcon className={`w-5 h-5 ${config.color} mt-0.5 shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white text-sm">
                  {currentMessage.title}
                </h4>
                <Badge
                  variant={config.badgeVariant}
                  className={`${config.badgeColor} text-white text-xs px-2 py-0.5`}
                >
                  {currentMessage.status.charAt(0).toUpperCase() +
                    currentMessage.status.slice(1)}
                </Badge>
              </div>

              <AlertDescription className="text-gray-300 text-sm mb-2">
                {currentMessage.message}
              </AlertDescription>

              {/* Additional Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                {currentMessage.estimatedResolution && (
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    {formatTimeRemaining(currentMessage.estimatedResolution)}
                  </span>
                )}

                {currentMessage.affectedServices &&
                  currentMessage.affectedServices.length > 0 && (
                    <span>
                      Affected: {currentMessage.affectedServices.join(", ")}
                    </span>
                  )}

                <span>
                  Updated {currentMessage.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-gray-400 hover:text-white hover:bg-gray-800 p-1 h-8 w-8"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>

            {/* Status Page Link */}
            {showLinkToStatusPage &&
              (currentMessage.linkToStatusPage || "/system-health") && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 h-8"
                >
                  <a
                    href={currentMessage.linkToStatusPage || "/system-health"}
                    className="flex items-center gap-1 text-xs"
                  >
                    <span>System Health</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}

            {/* Dismiss Button */}
            {currentMessage.isDismissible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => actions.dismissMessage(currentMessage.id)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
};
