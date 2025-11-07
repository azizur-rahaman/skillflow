'use client';
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Database, FileText } from "lucide-react";
import { ExportFilters } from "./components/ExportFilters";
import { ExportButton } from "./components/ExportButton";
import { ExportProgressModal } from "./components/ExportProgressModal";
import { useDataExport } from "../context";
import { ExportFormat, ExportJob } from "../types";

export const DataExportDashboard: React.FC = () => {
  const { state, actions } = useDataExport();
  const [showProgressModal, setShowProgressModal] = useState(false);

  const handleFiltersChange = (updates: Partial<typeof state.filters>) => {
    actions.updateFilters(updates);
  };

  const handleReset = () => {
    actions.resetFilters();
  };

  const handleExport = async (format: ExportFormat) => {
    await actions.startExport(format);
    setShowProgressModal(true);
  };

  const handleDownload = (jobId: string) => {
    actions.downloadFile(jobId);
  };

  const handleCloseModal = () => {
    setShowProgressModal(false);
    if (state.currentJob?.status === "completed") {
      // Clear current job logic would go here
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">
              Data Export Center
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Export clean, anonymized data for research and analysis. All exports
            include privacy controls and data protection measures.
          </p>
        </div>

        {/* Privacy Notice */}
        <Alert className="bg-blue-900/20 border-blue-800">
          <Shield className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>Privacy First:</strong> Personal data is automatically
            anonymized. Exports are logged for compliance and may be audited.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Export Configuration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your data export parameters and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExportFilters
                  filters={state.filters}
                  availableTeams={state.availableTeams}
                  onFiltersChange={handleFiltersChange}
                  onReset={handleReset}
                />
              </CardContent>
            </Card>
          </div>

          {/* Export Actions */}
          <div className="space-y-6">
            {/* Export Button */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Export Data</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose your preferred format and start the export
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExportButton
                  onExport={handleExport}
                  isLoading={state.isLoading}
                  disabled={!state.filters.metrics.length}
                />
              </CardContent>
            </Card>

            {/* Recent Exports */}
            {state.recentJobs.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Exports</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your last {state.recentJobs.length} export jobs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {state.recentJobs.slice(0, 3).map((job: ExportJob) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              job.status === "completed"
                                ? "bg-green-400"
                                : job.status === "failed"
                                ? "bg-red-400"
                                : "bg-blue-400"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium text-white uppercase">
                              {job.format}
                            </p>
                            <p className="text-xs text-gray-400">
                              {job.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {job.status === "completed" && job.downloadUrl && (
                          <button
                            onClick={() => handleDownload(job.id)}
                            className="text-blue-400 hover:text-blue-300 text-sm"
                          >
                            Download
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Progress Modal */}
        <ExportProgressModal
          isOpen={showProgressModal}
          onClose={handleCloseModal}
          job={state.currentJob}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};
