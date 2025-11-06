'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { ExportFormat } from "../../types";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  isLoading = false,
  disabled = false,
  className,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("csv");

  const handleExport = () => {
    onExport(selectedFormat);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Format Selector */}
      <Select
        value={selectedFormat}
        onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
      >
        <SelectTrigger className="w-[120px] border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-800">
          <SelectItem value="csv" className="text-gray-300 hover:bg-gray-800">
            <div className="flex flex-col">
              <span className="font-medium uppercase">CSV</span>
              <span className="text-xs text-gray-500">
                Comma-separated values
              </span>
            </div>
          </SelectItem>
          <SelectItem value="json" className="text-gray-300 hover:bg-gray-800">
            <div className="flex flex-col">
              <span className="font-medium uppercase">JSON</span>
              <span className="text-xs text-gray-500">
                JavaScript Object Notation
              </span>
            </div>
          </SelectItem>
          <SelectItem value="pdf" className="text-gray-300 hover:bg-gray-800">
            <div className="flex flex-col">
              <span className="font-medium uppercase">PDF</span>
              <span className="text-xs text-gray-500">
                Portable Document Format
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Export Button */}
      <Button
        onClick={handleExport}
        disabled={disabled || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </>
        )}
      </Button>
    </div>
  );
};
