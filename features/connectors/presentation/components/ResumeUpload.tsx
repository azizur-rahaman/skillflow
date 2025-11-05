'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { useDataConnection } from '../../context/DataConnectionContext';

export default function ResumeUpload() {
  const { uploadResume, state } = useDataConnection();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const resumeConnector = state.connectors.find((c) => c.id === 'resume');
  const isUploading = resumeConnector?.status === 'connecting';
  const isUploaded = resumeConnector?.status === 'connected';

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];

      if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        setSelectedFile(file);
        await handleUpload(file);
      }
    },
    []
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        await handleUpload(file);
      }
    },
    []
  );

  const handleUpload = async (file: File) => {
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    await uploadResume(file);
    setUploadProgress(100);
    clearInterval(interval);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  if (isUploaded) {
    return (
      <div className="w-full p-8 rounded-2xl bg-[#10B981]/10 border-2 border-[#10B981]/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">
                Resume Uploaded Successfully
              </h3>
              <p className="text-white/60 text-sm">
                {selectedFile?.name || 'Resume.pdf'} • {resumeConnector?.dataPoints} skills extracted
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative p-12 rounded-2xl
          border-2 border-dashed transition-all duration-300
          ${
            isDragging
              ? 'border-[#22D3EE] bg-[#22D3EE]/10'
              : isUploading
              ? 'border-[#A855F7]/40 bg-[#A855F7]/5'
              : 'border-white/20 hover:border-white/40 bg-white/5'
          }
        `}
      >
        {isUploading ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#A855F7]/20 border-2 border-[#A855F7] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#A855F7] animate-spin" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Uploading Resume...
            </h3>
            <p className="text-white/60 text-sm mb-4">
              {selectedFile?.name}
            </p>
            {/* Progress Bar */}
            <div className="max-w-xs mx-auto">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-white/40 text-xs mt-2">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#A855F7]/20 border-2 border-[#A855F7]/40 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[#A855F7]" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Upload Your Resume
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Drag and drop your PDF or DOCX file here, or click to browse
            </p>

            {/* File Input Button */}
            <label className="inline-block">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="
                inline-flex items-center gap-2
                px-6 py-3
                bg-gradient-to-r from-[#A855F7] to-[#22D3EE]
                text-white font-semibold rounded-xl
                hover:opacity-90
                cursor-pointer
                transition-all duration-200
                shadow-lg shadow-[#A855F7]/30
              ">
                <FileText className="w-4 h-4" />
                Choose File
              </span>
            </label>

            <p className="text-white/40 text-xs mt-4">
              Supported formats: PDF, DOCX (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[#22D3EE] font-semibold text-sm mb-1">AI Extraction</div>
          <div className="text-white/60 text-xs">Automatic skill parsing using GPT-4</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[#4F46E5] font-semibold text-sm mb-1">Privacy First</div>
          <div className="text-white/60 text-xs">Your data is encrypted and secure</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[#A855F7] font-semibold text-sm mb-1">Fast Processing</div>
          <div className="text-white/60 text-xs">Results in under 30 seconds</div>
        </div>
      </div>
    </div>
  );
}
