import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, X } from "lucide-react";
import { ExportJob } from "../../types";

interface ExportProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: ExportJob | null;
  onDownload?: (jobId: string) => void;
}

export const ExportProgressModal: React.FC<ExportProgressModalProps> = ({
  isOpen,
  onClose,
  job,
  onDownload,
}) => {
  if (!job) return null;

  const getStatusMessage = () => {
    switch (job.status) {
      case "preparing":
        return "Preparing your data export...";
      case "exporting":
        return "Processing your data export...";
      case "completed":
        return "Export completed successfully!";
      case "failed":
        return "Export failed. Please try again.";
      default:
        return "Preparing export...";
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case "preparing":
      case "exporting":
        return "text-blue-400";
      case "completed":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            {job.status === "completed" && (
              <CheckCircle className="w-5 h-5 text-green-400" />
            )}
            {job.status === "failed" && <X className="w-5 h-5 text-red-400" />}
            Data Export Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Message */}
          <div className="text-center">
            <p className={`text-lg font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress</span>
              <span>{job.progress}%</span>
            </div>
            <Progress value={job.progress} className="h-2 bg-gray-800" />
          </div>

          {/* Export Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Format:</span>
              <span className="text-white uppercase">{job.format}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Size:</span>
              <span className="text-white">
                {job.fileSize || "Calculating..."}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {job.error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{job.error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {job.status === "completed" && onDownload && (
              <Button
                onClick={() => onDownload(job.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {job.status === "completed" ? "Close" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
