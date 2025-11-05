'use client';

/**
 * LessonContent Component
 * Main content pane displaying video, text, code, and interactive elements
 */

import React, { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Code2,
  FileText,
  PlayCircle,
} from 'lucide-react';
import type { LessonSection, VideoContent, TextContent, CodeBlock } from '../../types/lesson.types';
import { ContentType, formatTime } from '../../types/lesson.types';

interface LessonContentProps {
  section: LessonSection;
  onComplete?: () => void;
  onVideoProgress?: (currentTime: number) => void;
}

export function LessonContent({ section, onComplete, onVideoProgress }: LessonContentProps) {
  switch (section.type) {
    case ContentType.VIDEO:
      return section.video ? (
        <VideoPlayer video={section.video} onProgress={onVideoProgress} onComplete={onComplete} />
      ) : null;
    
    case ContentType.TEXT:
      return section.text ? (
        <TextViewer text={section.text} onComplete={onComplete} />
      ) : null;
    
    case ContentType.CODE:
      return section.code ? (
        <CodeViewer code={section.code} onComplete={onComplete} />
      ) : null;
    
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-[#6366F1] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">Content Not Available</h3>
            <p className="text-[#94A3B8]">This section type is not yet supported</p>
          </div>
        </div>
      );
  }
}

/**
 * Video Player Component
 */
interface VideoPlayerProps {
  video: VideoContent;
  onProgress?: (currentTime: number) => void;
  onComplete?: () => void;
}

function VideoPlayer({ video, onProgress, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onProgress?.(time);

      // Auto-complete when video is 95% done
      if (time / video.duration > 0.95) {
        onComplete?.();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-video group">
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full"
        />

        {/* Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={video.duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-[#334155] rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6366F1]"
              />
              <div className="flex items-center justify-between text-xs text-white">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(video.duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleSkip(-10)}
                  className="text-white hover:text-[#6366F1] transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-[#6366F1] hover:bg-[#6366F1]/90 flex items-center justify-center transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => handleSkip(10)}
                  className="text-white hover:text-[#6366F1] transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleMute}
                  className="text-white hover:text-[#6366F1] transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-[#6366F1] transition-colors"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      {video.chapters && video.chapters.length > 0 && (
        <div className="bg-[#1E293B] rounded-xl border border-[#334155] p-4">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Chapters</h3>
          <div className="space-y-2">
            {video.chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = chapter.timestamp;
                  }
                }}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#0F172A] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#6366F1]/20 flex items-center justify-center flex-shrink-0">
                  <PlayCircle className="w-4 h-4 text-[#6366F1]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-[#F8FAFC]">{chapter.title}</div>
                  <div className="text-xs text-[#94A3B8]">{formatTime(chapter.timestamp)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Text Viewer Component
 */
interface TextViewerProps {
  text: TextContent;
  onComplete?: () => void;
}

function TextViewer({ text, onComplete }: TextViewerProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (contentRef.current && !hasScrolled) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setHasScrolled(true);
        onComplete?.();
      }
    }
  };

  return (
    <div
      ref={contentRef}
      onScroll={handleScroll}
      className="prose prose-invert max-w-none overflow-y-auto max-h-[calc(100vh-300px)] p-8 bg-[#1E293B] rounded-2xl border border-[#334155]"
    >
      <div
        className="text-[#F8FAFC]"
        dangerouslySetInnerHTML={{ __html: text.markdown.replace(/\n/g, '<br/>') }}
      />
      
      {text.estimatedReadTime && (
        <div className="mt-8 pt-4 border-t border-[#334155] flex items-center gap-2 text-sm text-[#94A3B8]">
          <FileText className="w-4 h-4" />
          <span>Estimated read time: {text.estimatedReadTime} minutes</span>
        </div>
      )}
    </div>
  );
}

/**
 * Code Viewer Component
 */
interface CodeViewerProps {
  code: CodeBlock;
  onComplete?: () => void;
}

function CodeViewer({ code, onComplete }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onComplete?.();
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-[#6366F1]" />
            <div>
              {code.filename && (
                <div className="text-sm font-semibold text-[#F8FAFC]">{code.filename}</div>
              )}
              <div className="text-xs text-[#94A3B8] capitalize">{code.language}</div>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#6366F1]/90 text-white text-sm font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Block */}
        <div className="p-6 overflow-x-auto">
          <pre className="text-sm text-[#F8FAFC] font-mono">
            <code>{code.code}</code>
          </pre>
        </div>
      </div>

      {!code.isEditable && (
        <div className="text-xs text-[#94A3B8] flex items-center gap-2">
          <span>💡 Tip: Copy this code and try it in your own editor</span>
        </div>
      )}
    </div>
  );
}
