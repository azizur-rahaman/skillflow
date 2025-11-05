'use client';

/**
 * Course Video Player Component
 * Responsive iframe player for third-party platforms (Coursera, LinkedIn Learning)
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { useIntegratedCourse } from '../../context/IntegratedCourseContext';
import {
  buildEmbedUrl,
  formatVideoTime,
  PlayerState,
  CoursePlatform,
} from '../../types/integrated-course.types';

export function CourseVideoPlayer() {
  const { state, actions } = useIntegratedCourse();
  const { course, progress, currentSection, playerState, playerSettings } = state;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!course || !currentSection || !progress) {
    return (
      <div className="aspect-video bg-[#1E293B] rounded-2xl flex items-center justify-center">
        <p className="text-[#94A3B8]">No video selected</p>
      </div>
    );
  }

  const embedUrl = buildEmbedUrl(course.platform, course.externalId, currentSection.id);
  const currentTime = progress.currentTime;
  const duration = currentSection.duration;
  const progressPercent = (currentTime / duration) * 100;

  const handlePlayPause = () => {
    if (playerState === PlayerState.PLAYING) {
      actions.setPlayerState(PlayerState.PAUSED);
    } else {
      actions.setPlayerState(PlayerState.PLAYING);
    }
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    actions.updateProgress(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    actions.updateProgress(newTime);
  };

  const handleVolumeToggle = () => {
    actions.updatePlayerSettings({
      volume: playerSettings.volume > 0 ? 0 : 0.8,
    });
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Simulate video progress (in real app, listen to iframe postMessage)
  useEffect(() => {
    if (playerState !== PlayerState.PLAYING) return;

    const interval = setInterval(() => {
      actions.updateProgress(currentTime + 1);

      // Auto-complete at 95%
      if (currentTime >= duration * 0.95 && !currentSection.isCompleted) {
        actions.completeSection(currentSection.id);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerState, currentTime, duration, currentSection, actions]);

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Iframe */}
      <div className="aspect-video">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={currentSection.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Custom Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar - Section Title */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent">
          <h3 className="text-white font-semibold text-lg">{currentSection.title}</h3>
          <p className="text-white/70 text-sm mt-1">{currentSection.description}</p>
        </div>

        {/* Center Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
          >
            {playerState === PlayerState.PLAYING ? (
              <Pause className="w-10 h-10 text-white ml-0.5" fill="white" />
            ) : (
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#A855F7] rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-white/80">
              <span>{formatVideoTime(currentTime)}</span>
              <span>{formatVideoTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Skip Back */}
              <button
                onClick={handleSkipBack}
                className="text-white/80 hover:text-white transition-colors"
                title="Skip back 10s"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {playerState === PlayerState.PLAYING ? (
                  <Pause className="w-5 h-5 text-white" fill="white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                )}
              </button>

              {/* Skip Forward */}
              <button
                onClick={handleSkipForward}
                className="text-white/80 hover:text-white transition-colors"
                title="Skip forward 10s"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Volume */}
              <button
                onClick={handleVolumeToggle}
                className="text-white/80 hover:text-white transition-colors"
              >
                {playerSettings.volume > 0 ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </button>

              {/* Speed Badge */}
              <div className="text-white/80 text-sm font-medium px-2 py-1 bg-white/10 rounded">
                {playerSettings.playbackSpeed}x
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Settings */}
              <button className="text-white/80 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {playerState === PlayerState.LOADING && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Completion Badge */}
      {currentSection.isCompleted && (
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#10B981]/90 backdrop-blur-sm rounded-lg text-white text-sm font-semibold flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          Completed
        </div>
      )}
    </div>
  );
}
