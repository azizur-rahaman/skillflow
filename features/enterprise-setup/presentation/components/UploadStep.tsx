'use client';
import React, { useCallback, useState } from "react";
import { useEnterpriseSetup } from "../../context";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

export const UploadStep: React.FC = () => {
  const { state, uploadFile, goToNextStep } = useEnterpriseSetup();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [uploadFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        uploadFile(files[0]);
      }
    },
    [uploadFile]
  );

  const handleNext = () => {
    goToNextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-white">Upload Your Data</h2>
        <p className="text-gray-400">
          Upload a CSV file containing your organization&apos;s data to get
          started
        </p>
      </div>

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${
            isDragOver
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-gray-600 hover:border-gray-500"
          }
          ${state.file ? "bg-green-500/5 border-green-500" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload CSV file"
        />

        <div className="space-y-4">
          {state.file ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">
                  {state.fileName}
                </p>
                <p className="text-sm text-gray-400">
                  {(state.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-white">
                  Drop your CSV file here, or click to browse
                </p>
                <p className="text-sm text-gray-400">
                  Supports CSV files up to 50MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {state.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-400">{state.error}</p>
          </div>
        </div>
      )}

      {state.file && !state.error && (
        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Next: Map Fields
          </Button>
        </div>
      )}

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Expected CSV Format
        </h3>
        <p className="text-sm text-gray-400 mb-2">
          Your CSV should include columns for employee data such as:
        </p>
        <ul className="text-sm text-gray-400 space-y-1 ml-4">
          <li>• Name, Email, Department, Job Title</li>
          <li>• Skills, Experience Level, Certifications</li>
          <li>• Manager, Location, Start Date</li>
        </ul>
      </div>
    </div>
  );
};
