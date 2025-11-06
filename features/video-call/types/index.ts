/**
 * Video Call Types
 * Real-time mentoring and collaboration sessions
 */

export type VideoCallStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "ended";

export type ParticipantRole = "mentor" | "mentee" | "observer";

export type VideoQuality = "low" | "medium" | "high" | "ultra";

export type AudioDevice = {
  id: string;
  label: string;
  isDefault: boolean;
};

export type VideoDevice = {
  id: string;
  label: string;
  isDefault: boolean;
};

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: ParticipantRole;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  isScreenSharing: boolean;
  joinedAt: Date;
  networkQuality: "excellent" | "good" | "poor" | "disconnected";
}

export interface ChatMessage {
  id: string;
  participantId: string;
  participantName: string;
  message: string;
  timestamp: Date;
  isSystemMessage?: boolean;
}

export interface VideoCallState {
  sessionId: string;
  status: VideoCallStatus;
  startTime: Date | null;
  duration: number; // seconds
  participants: Participant[];
  localParticipant: Participant;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  chatMessages: ChatMessage[];
  unreadMessages: number;
  selectedLayout: "grid" | "spotlight" | "sidebar";
  videoQuality: VideoQuality;
  availableAudioDevices: AudioDevice[];
  availableVideoDevices: VideoDevice[];
  selectedAudioDevice: string | null;
  selectedVideoDevice: string | null;
  error: string | null;
}

export interface VideoCallContextType {
  state: VideoCallState;
  actions: {
    joinCall: (sessionId: string) => Promise<void>;
    leaveCall: () => Promise<void>;
    toggleMute: () => void;
    toggleVideo: () => void;
    toggleScreenShare: () => void;
    toggleRecording: () => void;
    sendMessage: (message: string) => void;
    raiseHand: () => void;
    changeLayout: (layout: VideoCallState["selectedLayout"]) => void;
    setVideoQuality: (quality: VideoQuality) => void;
    selectAudioDevice: (deviceId: string) => void;
    selectVideoDevice: (deviceId: string) => void;
    markMessagesAsRead: () => void;
  };
}

export interface VideoGridProps {
  participants: Participant[];
  layout: VideoCallState["selectedLayout"];
  className?: string;
}

export interface VideoTileProps {
  participant: Participant;
  isLocal?: boolean;
  isSpotlight?: boolean;
  className?: string;
}

export interface FloatingControlsProps {
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onLeaveCall: () => void;
  className?: string;
}

export interface ChatPanelProps {
  messages: ChatMessage[];
  participants: Participant[];
  onSendMessage: (message: string) => void;
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export interface ParticipantListProps {
  participants: Participant[];
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export interface SessionTimerProps {
  startTime: Date | null;
  duration: number;
  className?: string;
}

export interface DeviceSettingsProps {
  audioDevices: AudioDevice[];
  videoDevices: VideoDevice[];
  selectedAudioDevice: string | null;
  selectedVideoDevice: string | null;
  onSelectAudioDevice: (deviceId: string) => void;
  onSelectVideoDevice: (deviceId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export interface VideoCallProps {
  sessionId: string;
  mentorName: string;
  menteeName: string;
  sessionType: "1-on-1" | "group" | "workshop";
  onEndCall: () => void;
  className?: string;
}
