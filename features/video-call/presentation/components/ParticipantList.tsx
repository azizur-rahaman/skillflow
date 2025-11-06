/**
 * Participant List Component
 * Sidebar showing all participants and their status
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Crown,
  User,
  Monitor,
  MoreVertical,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Participant } from "../../types";
import { cn } from "@/lib/utils";

interface ParticipantListProps {
  participants: Participant[];
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

interface ParticipantItemProps {
  participant: Participant;
  isLocal?: boolean;
}

const ParticipantItem: React.FC<ParticipantItemProps> = ({
  participant,
  isLocal = false,
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

  const getNetworkIcon = () => {
    switch (participant.networkQuality) {
      case "excellent":
        return <Wifi className="w-4 h-4 text-green-500" />;
      case "good":
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case "poor":
        return <WifiOff className="w-4 h-4 text-orange-500" />;
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="w-10 h-10">
        <AvatarImage src={participant.avatar} alt={participant.name} />
        <AvatarFallback className="bg-primary/20 text-primary">
          {getInitials(participant.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground truncate">
            {participant.name}
          </span>
          {isLocal && (
            <Badge variant="secondary" className="text-xs">
              You
            </Badge>
          )}
          {getRoleIcon()}
        </div>

        <div className="flex items-center gap-2">
          {/* Audio status */}
          <div className="flex items-center gap-1">
            {participant.isMuted ? (
              <MicOff className="w-3 h-3 text-red-500" />
            ) : (
              <Mic className="w-3 h-3 text-green-500" />
            )}
          </div>

          {/* Video status */}
          <div className="flex items-center gap-1">
            {participant.isVideoOn ? (
              <Video className="w-3 h-3 text-green-500" />
            ) : (
              <VideoOff className="w-3 h-3 text-red-500" />
            )}
          </div>

          {/* Network quality */}
          {getNetworkIcon()}

          {/* Screen sharing */}
          {participant.isScreenSharing && (
            <Monitor className="w-3 h-3 text-cyan-500" />
          )}

          {/* Hand raised */}
          {participant.isHandRaised && <span className="text-sm">✋</span>}
        </div>
      </div>

      {/* More options */}
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  isOpen,
  onToggle,
  className,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Card
      className={cn(
        "fixed top-0 right-0 h-full w-64 bg-card/95 backdrop-blur-sm border-l border-border/50 shadow-xl z-40 flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Participants</h3>
          <Badge variant="secondary" className="text-xs">
            {participants.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Participants list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {participants.map((participant) => (
            <ParticipantItem key={participant.id} participant={participant} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Mic className="w-3 h-3" />
            <span>Microphone on</span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="w-3 h-3" />
            <span>Camera on</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-3 h-3" />
            <span>Screen sharing</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
