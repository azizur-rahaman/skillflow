'use client';

import React, { useRef, useState } from 'react';
import { Camera, User, Loader2, X } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';

export default function AvatarUpload() {
  const { state, updateAvatar, removeAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const profile = state.profile;
  const isSaving = state.editState.isSaving;

  const handleFileSelect = (file: File) => {
    setUploadError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB max)
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    updateAvatar(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeAvatar();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Circle */}
      <div
        className={`
          relative group cursor-pointer
          transition-all duration-300
          ${isDragging ? 'scale-105' : 'hover:scale-105'}
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Main Avatar */}
        <div
          className={`
            w-32 h-32 rounded-full overflow-hidden
            border-4 transition-all duration-300
            ${
              profile?.avatar
                ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/25 animate-avatar-glow'
                : 'border-white/10'
            }
            ${isDragging ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' : ''}
            ${isSaving ? 'opacity-50' : ''}
          `}
        >
          {profile?.avatar?.url ? (
            <img
              src={profile.avatar.url}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
              <User className="w-12 h-12 text-white/40" />
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        <div
          className={`
            absolute inset-0 rounded-full
            bg-black/60 backdrop-blur-sm
            flex flex-col items-center justify-center
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            ${isDragging ? 'opacity-100' : ''}
          `}
        >
          {isSaving ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <>
              <Camera className="w-8 h-8 text-white mb-1" />
              <span className="text-xs text-white font-medium">
                {profile?.avatar ? 'Change' : 'Upload'}
              </span>
            </>
          )}
        </div>

        {/* Remove Button */}
        {profile?.avatar && !isSaving && (
          <button
            onClick={handleRemove}
            className="
              absolute -top-2 -right-2
              w-8 h-8 rounded-full
              bg-red-500 hover:bg-red-600
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-all duration-200
              shadow-lg hover:scale-110
            "
            aria-label="Remove avatar"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Glow Ring */}
        {profile?.avatar && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-20 blur-xl -z-10 animate-pulse" />
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />

      {/* Upload Instructions */}
      <div className="text-center">
        <button
          onClick={handleClick}
          disabled={isSaving}
          className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {profile?.avatar ? 'Change Photo' : 'Upload Photo'}
        </button>
        <p className="text-xs text-white/40 mt-1">
          JPG, PNG or WebP. Max 5MB.
        </p>
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {uploadError}
        </div>
      )}

      {/* Upload Progress */}
      {profile?.avatar?.uploadProgress !== undefined && profile.avatar.uploadProgress < 100 && (
        <div className="w-full max-w-[200px]">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${profile.avatar.uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-white/60 mt-1 text-center">
            Uploading... {profile.avatar.uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
}
