"use client";

import React from "react";
import { QAProvider } from "@/features/qa/context";
import { QAMonitoringDashboard } from "@/features/qa/presentation";

export default function QAPage() {
  return (
    <QAProvider>
      <div className="container mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            QA Test Monitoring
          </h1>
          <p className="text-muted-foreground">
            Monitor automated test runs, coverage metrics, and quality assurance
            results
          </p>
        </div>

        <QAMonitoringDashboard />
      </div>
    </QAProvider>
  );
}
