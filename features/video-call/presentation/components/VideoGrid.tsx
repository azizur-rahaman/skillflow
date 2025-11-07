/**
 * Video Grid Component
 * Displays participant video streams in a responsive grid layout
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, VideoOff, Crown, User, Monitor } from "lucide-react";
import { Participant } from "../../types";
import { cn } from "@/lib/utils";

interface VideoGridProps {
  participants: Participant[];
  layout: "grid" | "spotlight" | "sidebar";
  className?: string;
}

interface VideoTileProps {
  participant: Participant;
  isLarge?: boolean;
  className?: string;
}

const VideoTile: React.FC<VideoTileProps> = ({
  participant,
  isLarge = false,
  className,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleIcon = () => {
    switch (participant.role) {
      case "mentor":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "mentee":
        return <User className="w-4 h-4 text-blue-500" />;
      case "observer":
        return <Monitor className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-200",
        isLarge ? "aspect-video" : "aspect-square",
        participant.isScreenSharing && "ring-2 ring-cyan-500/50",
        className
      )}
    >
      {/* Video stream placeholder */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10">
        {participant.isVideoOn ? (
          <div className="w-full h-full bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-white/60">
              <Monitor className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Video Stream</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {getInitials(participant.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>

      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium truncate">
              {participant.name}
            </span>
            {getRoleIcon()}
          </div>

          <div className="flex items-center gap-1">
            {/* Audio status */}
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                participant.isMuted ? "bg-red-500/80" : "bg-green-500/80"
              )}
            >
              {participant.isMuted ? (
                <MicOff className="w-3 h-3 text-white" />
              ) : (
                <Mic className="w-3 h-3 text-white" />
              )}
            </div>

            {/* Video status */}
            {!participant.isVideoOn && (
              <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                <VideoOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Screen sharing indicator */}
        {participant.isScreenSharing && (
          <div className="mt-2">
            <Badge
              variant="secondary"
              className="text-xs bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
            >
              <Monitor className="w-3 h-3 mr-1" />
              Sharing Screen
            </Badge>
          </div>
        )}
      </div>

      {/* Speaking indicator */}
      {participant.networkQuality === "excellent" && (
        <div className="absolute top-3 left-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}

      {/* Hand raised indicator */}
      {participant.isHandRaised && (
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-black text-sm font-bold">✋</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  layout,
  className,
}) => {
  const getGridClasses = () => {
    const count = participants.length;

    switch (layout) {
      case "spotlight":
        return "grid-cols-1 grid-rows-1";
      case "grid":
        if (count === 1) return "grid-cols-1";
        if (count === 2) return "grid-cols-2";
        if (count <= 4) return "grid-cols-2";
        if (count <= 9) return "grid-cols-3";
        return "grid-cols-4";
      case "sidebar":
        return "grid-cols-1";
      default:
        return "grid-cols-1";
    }
  };

  const getTileSize = (index: number) => {
    if (layout === "spotlight" && index === 0) return true;
    if (layout === "sidebar" && index === 0) return true;
    return false;
  };

  if (participants.length === 0) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center bg-card/20",
          className
        )}
      >
        <div className="text-center text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No participants yet</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full p-4 grid gap-4 auto-rows-fr",
        getGridClasses(),
        className
      )}
    >
      {participants.map((participant, index) => (
        <VideoTile
          key={participant.id}
          participant={participant}
          isLarge={getTileSize(index)}
          className="min-h-0"
        />
      ))}
    </div>
  );
};
