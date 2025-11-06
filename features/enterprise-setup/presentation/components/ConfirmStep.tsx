import React, { useEffect, useCallback } from "react";
import { useEnterpriseSetup } from "../../context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  Users,
  Database,
  ArrowLeft,
  Play,
} from "lucide-react";

export const ConfirmStep: React.FC = () => {
  const { state, startImport, goToPreviousStep, resetWizard } =
    useEnterpriseSetup();

  const handleStartImport = useCallback(async () => {
    await startImport();
  }, [startImport]);

  useEffect(() => {
    // Auto-start import when component mounts if not already started
    if (
      state.currentStep === "confirm" &&
      state.status === "idle" &&
      !state.importResult
    ) {
      handleStartImport();
    }
  }, [state.currentStep, state.status, state.importResult, handleStartImport]);

  const handleFinish = () => {
    // Navigate back to dashboard or wherever makes sense
    resetWizard();
  };

  const getImportStatus = () => {
    switch (state.status) {
      case "importing":
        return {
          status: "in-progress",
          message: "Importing your data...",
          icon: Database,
          color: "text-blue-400",
        };
      case "completed":
        return {
          status: "success",
          message: "Import completed successfully!",
          icon: CheckCircle,
          color: "text-green-400",
        };
      case "error":
        return {
          status: "error",
          message: "Import failed. Please try again.",
          icon: AlertTriangle,
          color: "text-red-400",
        };
      default:
        return {
          status: "ready",
          message: "Ready to import your data",
          icon: Play,
          color: "text-indigo-400",
        };
    }
  };

  const importStatus = getImportStatus();
  const StatusIcon = importStatus.icon;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-white">Confirm Import</h2>
        <p className="text-gray-400">
          Review the import summary and start the data import process
        </p>
      </div>

      {/* Import Status */}
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <StatusIcon className={`w-8 h-8 ${importStatus.color}`} />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white">Import Status</h3>
            <p className="text-gray-400">{importStatus.message}</p>
          </div>
          {state.status === "importing" && (
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-1">
                {state.progress}%
              </div>
              <Progress value={state.progress} className="w-32" />
            </div>
          )}
        </div>
      </Card>

      {/* Import Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Data Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Records</span>
              <Badge
                variant="secondary"
                className="bg-blue-500/20 text-blue-300"
              >
                {state.importResult?.totalRows ||
                  state.previewData?.totalRows ||
                  "..."}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Valid Records</span>
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-300"
              >
                {state.importResult?.validRows || "..."}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Records with Issues</span>
              <Badge
                variant="secondary"
                className="bg-yellow-500/20 text-yellow-300"
              >
                {state.importResult?.invalidRows || "..."}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Successfully Imported</span>
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-300"
              >
                {state.importResult?.importedRows || "..."}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Field Mappings
          </h3>
          <div className="space-y-2">
            {state.fieldMappings
              .filter((mapping) => mapping.targetField)
              .map((mapping) => (
                <div
                  key={mapping.sourceField}
                  className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded"
                >
                  <span className="text-sm text-gray-300">
                    {mapping.sourceField}
                  </span>
                  <ArrowLeft className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-white">
                    {mapping.targetField}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Import Results */}
      {state.importResult && (
        <Card className="bg-gray-900/50 border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Import Results
          </h3>

          {state.importResult.errors.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-400 mb-2">Errors</h4>
              <div className="space-y-1">
                {state.importResult.errors.slice(0, 5).map((error, index) => (
                  <div
                    key={index}
                    className="text-sm text-red-300 bg-red-500/10 p-2 rounded"
                  >
                    Row {error.row}: {error.message}
                  </div>
                ))}
                {state.importResult.errors.length > 5 && (
                  <div className="text-sm text-red-400">
                    ... and {state.importResult.errors.length - 5} more errors
                  </div>
                )}
              </div>
            </div>
          )}

          {state.importResult.warnings.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-yellow-400 mb-2">
                Warnings
              </h4>
              <div className="space-y-1">
                {state.importResult.warnings
                  .slice(0, 5)
                  .map((warning, index) => (
                    <div
                      key={index}
                      className="text-sm text-yellow-300 bg-yellow-500/10 p-2 rounded"
                    >
                      Row {warning.row}: {warning.message}
                    </div>
                  ))}
                {state.importResult.warnings.length > 5 && (
                  <div className="text-sm text-yellow-400">
                    ... and {state.importResult.warnings.length - 5} more
                    warnings
                  </div>
                )}
              </div>
            </div>
          )}

          {state.importResult.errors.length === 0 &&
            state.importResult.warnings.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-medium">
                  All records imported successfully!
                </p>
              </div>
            )}
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={state.status === "importing"}
          className="border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
        >
          Back
        </Button>

        {state.status === "completed" ? (
          <Button
            onClick={handleFinish}
            className="bg-green-600 hover:bg-green-700"
          >
            Finish Setup
          </Button>
        ) : state.status === "idle" ? (
          <Button
            onClick={handleStartImport}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Start Import
          </Button>
        ) : (
          <Button disabled className="bg-gray-600">
            {state.status === "importing" ? "Importing..." : "Processing..."}
          </Button>
        )}
      </div>
    </div>
  );
};
