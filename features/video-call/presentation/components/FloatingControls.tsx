/**
 * Floating Controls Component
 * Floating control bar for video call actions
 */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneOff,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingControlsProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onLeaveCall: () => void;
  className?: string;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isMuted,
  isVideoOn,
  isScreenSharing,
  isRecording,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveCall,
  className,
}) => {
  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex items-center gap-2 p-3 bg-card/90 backdrop-blur-sm border border-border/50 rounded-full shadow-lg",
          className
        )}
      >
        {/* Microphone control */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="sm"
              onClick={onToggleMute}
              className={cn(
                "w-10 h-10 rounded-full transition-all duration-200",
                isMuted && "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              {isMuted ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isMuted ? "Unmute" : "Mute"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Video control */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="sm"
              onClick={onToggleVideo}
              className={cn(
                "w-10 h-10 rounded-full transition-all duration-200",
                !isVideoOn && "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              {isVideoOn ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isVideoOn ? "Turn off camera" : "Turn on camera"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Screen share control */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="sm"
              onClick={onToggleScreenShare}
              className={cn(
                "w-10 h-10 rounded-full transition-all duration-200",
                isScreenSharing && "bg-cyan-500 hover:bg-cyan-600 text-white"
              )}
            >
              {isScreenSharing ? (
                <MonitorOff className="w-4 h-4" />
              ) : (
                <Monitor className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isScreenSharing ? "Stop sharing" : "Share screen"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-400 font-medium">REC</span>
          </div>
        )}

        {/* More options */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 rounded-full"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>More options</p>
          </TooltipContent>
        </Tooltip>

        {/* End call button */}
        <div className="w-px h-6 bg-border/50 mx-2" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={onLeaveCall}
              className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200"
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>End call</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
