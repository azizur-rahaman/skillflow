/**
 * Video Call Component
 * Main video conferencing interface for mentoring sessions
 */

"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Settings,
  Users,
  MessageCircle,
  PhoneOff,
  Loader2,
} from "lucide-react";
import { VideoCallProps } from "../types";
import { cn } from "@/lib/utils";
import { useVideoCall } from "../context";
import { SessionTimer } from "./components/SessionTimer";
import { VideoGrid } from "./components/VideoGrid";
import { FloatingControls } from "./components/FloatingControls";
import { ChatPanel } from "./components/ChatPanel";
import { ParticipantList } from "./components/ParticipantList";
import { DeviceSettings } from "./components/DeviceSettings";

export const VideoCall: React.FC<VideoCallProps> = ({
  sessionId,
  mentorName,
  menteeName,
  sessionType,
  onEndCall,
  className,
}) => {
  const { state, actions } = useVideoCall();
  const [showChat, setShowChat] = React.useState(false);
  const [showParticipants, setShowParticipants] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  // Join call on mount
  useEffect(() => {
    actions.joinCall(sessionId);
  }, [sessionId, actions]);

  const handleEndCall = async () => {
    await actions.leaveCall();
    onEndCall();
  };

  const getSessionTypeLabel = () => {
    switch (sessionType) {
      case "1-on-1":
        return "1-on-1 Mentoring Session";
      case "group":
        return "Group Mentoring Session";
      case "workshop":
        return "Workshop Session";
      default:
        return "Mentoring Session";
    }
  };

  const getStatusColor = () => {
    switch (state.status) {
      case "connecting":
        return "text-yellow-500";
      case "connected":
        return "text-green-500";
      case "reconnecting":
        return "text-orange-500";
      case "ended":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = () => {
    switch (state.status) {
      case "connecting":
        return "Connecting...";
      case "connected":
        return "Connected";
      case "reconnecting":
        return "Reconnecting...";
      case "ended":
        return "Call Ended";
      default:
        return "Unknown";
    }
  };

  if (state.status === "ended") {
    return (
      <div
        className={cn(
          "min-h-screen bg-background flex items-center justify-center",
          className
        )}
      >
        <Card className="w-full max-w-md p-8 text-center bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <PhoneOff className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Call Ended
              </h2>
              <p className="text-muted-foreground mt-2">
                Your mentoring session has concluded.
              </p>
            </div>
            <Button onClick={onEndCall} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-background relative overflow-hidden",
        className
      )}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5" />

      {/* Main content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {getSessionTypeLabel()}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mentorName} ↔ {menteeName}
              </p>
            </div>
            <Badge variant="secondary" className="capitalize">
              {sessionType}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  state.status === "connected"
                    ? "bg-green-500"
                    : state.status === "connecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                )}
              />
              <span className={cn("text-sm font-medium", getStatusColor())}>
                {getStatusText()}
              </span>
            </div>

            {/* Session timer */}
            <SessionTimer
              startTime={state.startTime}
              duration={state.duration}
            />

            {/* Settings button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-1 relative">
          {state.status === "connecting" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm">
              <div className="text-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    Joining session...
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please wait while we connect you
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <VideoGrid
              participants={state.participants}
              layout={state.selectedLayout}
              className="h-full"
            />
          )}

          {/* Floating controls */}
          <FloatingControls
            isMuted={state.isMuted}
            isVideoOn={state.isVideoOn}
            isScreenSharing={state.isScreenSharing}
            isRecording={state.isRecording}
            onToggleMute={actions.toggleMute}
            onToggleVideo={actions.toggleVideo}
            onToggleScreenShare={actions.toggleScreenShare}
            onLeaveCall={handleEndCall}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
          />

          {/* Side panels */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Chat toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className={cn(
                "relative bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card",
                showChat && "bg-primary text-primary-foreground"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              {state.unreadMessages > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {state.unreadMessages > 9 ? "9+" : state.unreadMessages}
                </Badge>
              )}
            </Button>

            {/* Participants toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowParticipants(!showParticipants)}
              className={cn(
                "bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card",
                showParticipants && "bg-primary text-primary-foreground"
              )}
            >
              <Users className="w-4 h-4" />
              <span className="ml-1 text-xs">{state.participants.length}</span>
            </Button>
          </div>

          {/* Chat panel */}
          <ChatPanel
            messages={state.chatMessages}
            participants={state.participants}
            onSendMessage={actions.sendMessage}
            unreadCount={state.unreadMessages}
            isOpen={showChat}
            onToggle={() => setShowChat(!showChat)}
            className="absolute top-0 right-0 h-full w-80"
          />

          {/* Participant list */}
          <ParticipantList
            participants={state.participants}
            isOpen={showParticipants}
            onToggle={() => setShowParticipants(!showParticipants)}
            className="absolute top-0 right-0 h-full w-64"
          />

          {/* Device settings */}
          <DeviceSettings
            audioDevices={state.availableAudioDevices}
            videoDevices={state.availableVideoDevices}
            selectedAudioDevice={state.selectedAudioDevice}
            selectedVideoDevice={state.selectedVideoDevice}
            onSelectAudioDevice={actions.selectAudioDevice}
            onSelectVideoDevice={actions.selectVideoDevice}
            isOpen={showSettings}
            onToggle={() => setShowSettings(!showSettings)}
            className="absolute top-16 right-4 w-80"
          />
        </div>

        {/* Error alert */}
        {state.error && (
          <div className="absolute bottom-20 left-4 right-4">
            <Alert
              variant="destructive"
              className="bg-red-500/10 border-red-500/20"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};
