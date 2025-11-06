/**
 * Demo Mode Banner Component
 * Sleek banner indicating sample data mode with smooth transitions
 */

"use client";

import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DemoModeBannerProps } from "../../types";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, X, Eye } from "lucide-react";

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  message,
  type = "info",
  onClose,
  className,
}) => {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return <Eye className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transform transition-all duration-500 ease-out",
        "bg-linear-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95",
        "backdrop-blur-md border-b border-cyan-500/20 shadow-2xl",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Alert
          className={cn(
            "border-0 bg-transparent text-white py-3",
            "animate-in slide-in-from-top-2 duration-500"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0 p-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              {getIcon()}
            </div>

            <AlertDescription className="flex-1 text-sm font-medium">
              <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                Demo Mode
              </span>
              <span className="text-slate-300 ml-2">{message}</span>
            </AlertDescription>

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="shrink-0 h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Alert>
      </div>
    </div>
  );
};
