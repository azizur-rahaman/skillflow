import React, { useEffect, useCallback } from "react";
import { useEnterpriseSetup } from "../../context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Eye, FileText } from "lucide-react";

export const PreviewStep: React.FC = () => {
  const { state, goToNextStep, goToPreviousStep } = useEnterpriseSetup();

  const generatePreviewData = useCallback(async () => {
    if (!state.file) return;

    try {
      // Parse first few rows of CSV for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split("\n").filter((line) => line.trim());

        if (lines.length < 2) return;

        // In a real implementation, this would parse the data and update the context
        // For now, we'll just simulate the preview generation
      };
      reader.readAsText(state.file);
    } catch (error) {
      console.error("Error generating preview:", error);
    }
  }, [state.file]);

  useEffect(() => {
    // Generate preview data when component mounts
    if (state.file && state.fieldMappings.length > 0 && !state.previewData) {
      generatePreviewData();
    }
  }, [state.file, state.fieldMappings, state.previewData, generatePreviewData]);

  const getValidationStatus = () => {
    if (!state.previewData)
      return { status: "loading", message: "Generating preview..." };

    // Mock validation - in real implementation this would come from the backend
    const validRows = Math.floor(state.previewData.totalRows * 0.9);
    const invalidRows = state.previewData.totalRows - validRows;

    if (invalidRows === 0) {
      return { status: "success", message: "All rows are valid" };
    } else if (invalidRows < validRows) {
      return { status: "warning", message: `${invalidRows} rows have issues` };
    } else {
      return { status: "error", message: "Most rows have validation errors" };
    }
  };

  const validationStatus = getValidationStatus();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-white">Preview Your Data</h2>
        <p className="text-gray-400">
          Review how your data will be imported before confirming
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Total Rows</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {state.previewData?.totalRows || "..."}
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Valid Rows</span>
          </div>
          <p className="text-2xl font-bold text-green-400 mt-2">
            {state.previewData
              ? Math.floor(state.previewData.totalRows * 0.9)
              : "..."}
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Issues</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-2">
            {state.previewData
              ? Math.floor(state.previewData.totalRows * 0.1)
              : "..."}
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">Preview</span>
          </div>
          <p className="text-2xl font-bold text-purple-400 mt-2">
            {state.previewData?.rows.length || "..."}
          </p>
        </Card>
      </div>

      {/* Validation Status */}
      <Card className="bg-gray-800/50 border-gray-700 p-4">
        <div className="flex items-center gap-3">
          {validationStatus.status === "success" && (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
          {validationStatus.status === "warning" && (
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          )}
          {validationStatus.status === "error" && (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          )}
          <div>
            <h3 className="text-sm font-medium text-white">
              Validation Status
            </h3>
            <p
              className={`text-sm ${
                validationStatus.status === "success"
                  ? "text-green-400"
                  : validationStatus.status === "warning"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {validationStatus.message}
            </p>
          </div>
        </div>
      </Card>

      {/* Data Preview Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Data Preview</h3>

          {state.previewData?.rows && state.previewData.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-400">#</th>
                    {state.fieldMappings
                      .filter((mapping) => mapping.targetField)
                      .map((mapping) => (
                        <th
                          key={mapping.targetField}
                          className="text-left py-2 px-3 text-gray-400"
                        >
                          {mapping.targetField}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {state.previewData.rows.map((row, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-2 px-3 text-gray-400">{index + 1}</td>
                      {state.fieldMappings
                        .filter((mapping) => mapping.targetField)
                        .map((mapping) => (
                          <td
                            key={mapping.targetField}
                            className="py-2 px-3 text-white"
                          >
                            {row[mapping.targetField!] || "-"}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Generating preview...</p>
            </div>
          )}
        </div>
      </Card>

      {/* Field Mapping Summary */}
      <Card className="bg-gray-800/50 border-gray-700 p-4">
        <h3 className="text-lg font-medium text-white mb-4">Field Mappings</h3>
        <div className="flex flex-wrap gap-2">
          {state.fieldMappings
            .filter((mapping) => mapping.targetField)
            .map((mapping) => (
              <Badge
                key={mapping.sourceField}
                variant="secondary"
                className="bg-indigo-500/20 text-indigo-300"
              >
                {mapping.sourceField} → {mapping.targetField}
              </Badge>
            ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Back
        </Button>
        <Button
          onClick={goToNextStep}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Next: Confirm Import
        </Button>
      </div>
    </div>
  );
};
