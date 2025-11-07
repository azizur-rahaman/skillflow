/**
 * Video Call Context
 * State management for real-time video conferencing
 */

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  VideoCallState,
  VideoCallContextType,
  Participant,
  ChatMessage,
  VideoQuality,
  VideoCallStatus,
} from "../types";

// Mock data generators
const generateMockParticipants = (): Participant[] => [
  {
    id: "local",
    name: "You",
    avatar: "/avatars/user.jpg",
    role: "mentee",
    isMuted: false,
    isVideoOn: true,
    isHandRaised: false,
    isScreenSharing: false,
    joinedAt: new Date(),
    networkQuality: "excellent",
  },
  {
    id: "mentor-1",
    name: "Sarah Chen",
    avatar: "/avatars/sarah-chen.jpg",
    role: "mentor",
    isMuted: false,
    isVideoOn: true,
    isHandRaised: false,
    isScreenSharing: false,
    joinedAt: new Date(Date.now() - 30000), // joined 30 seconds ago
    networkQuality: "excellent",
  },
];

const generateMockMessages = (): ChatMessage[] => [
  {
    id: "1",
    participantId: "mentor-1",
    participantName: "Sarah Chen",
    message: "Welcome to our mentoring session! How can I help you today?",
    timestamp: new Date(Date.now() - 120000),
    isSystemMessage: false,
  },
  {
    id: "2",
    participantId: "system",
    participantName: "System",
    message: "Recording started",
    timestamp: new Date(Date.now() - 60000),
    isSystemMessage: true,
  },
];

// Initial state
const initialState: VideoCallState = {
  sessionId: "",
  status: "connecting",
  startTime: null,
  duration: 0,
  participants: [],
  localParticipant: generateMockParticipants()[0],
  isMuted: false,
  isVideoOn: true,
  isScreenSharing: false,
  isRecording: false,
  chatMessages: [],
  unreadMessages: 0,
  selectedLayout: "grid",
  videoQuality: "high",
  availableAudioDevices: [
    { id: "default", label: "Default Microphone", isDefault: true },
    { id: "mic-1", label: "External Microphone", isDefault: false },
  ],
  availableVideoDevices: [
    { id: "default", label: "Built-in Camera", isDefault: true },
    { id: "cam-1", label: "External Webcam", isDefault: false },
  ],
  selectedAudioDevice: "default",
  selectedVideoDevice: "default",
  error: null,
};

// Action types
type VideoCallAction =
  | {
      type: "JOIN_CALL_SUCCESS";
      payload: { sessionId: string; participants: Participant[] };
    }
  | { type: "LEAVE_CALL" }
  | { type: "SET_STATUS"; payload: VideoCallStatus }
  | { type: "UPDATE_DURATION"; payload: number }
  | { type: "TOGGLE_MUTE" }
  | { type: "TOGGLE_VIDEO" }
  | { type: "TOGGLE_SCREEN_SHARE" }
  | { type: "TOGGLE_RECORDING" }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "MARK_MESSAGES_READ" }
  | { type: "RAISE_HAND" }
  | { type: "CHANGE_LAYOUT"; payload: VideoCallState["selectedLayout"] }
  | { type: "SET_VIDEO_QUALITY"; payload: VideoQuality }
  | { type: "SELECT_AUDIO_DEVICE"; payload: string }
  | { type: "SELECT_VIDEO_DEVICE"; payload: string }
  | {
      type: "UPDATE_PARTICIPANT";
      payload: { id: string; updates: Partial<Participant> };
    }
  | { type: "SET_ERROR"; payload: string | null };

// Reducer
const videoCallReducer = (
  state: VideoCallState,
  action: VideoCallAction
): VideoCallState => {
  switch (action.type) {
    case "JOIN_CALL_SUCCESS":
      return {
        ...state,
        sessionId: action.payload.sessionId,
        participants: action.payload.participants,
        status: "connected",
        startTime: new Date(),
        chatMessages: generateMockMessages(),
      };

    case "LEAVE_CALL":
      return {
        ...initialState,
        status: "ended",
      };

    case "SET_STATUS":
      return { ...state, status: action.payload };

    case "UPDATE_DURATION":
      return { ...state, duration: action.payload };

    case "TOGGLE_MUTE":
      return {
        ...state,
        isMuted: !state.isMuted,
        localParticipant: {
          ...state.localParticipant,
          isMuted: !state.isMuted,
        },
      };

    case "TOGGLE_VIDEO":
      return {
        ...state,
        isVideoOn: !state.isVideoOn,
        localParticipant: {
          ...state.localParticipant,
          isVideoOn: !state.isVideoOn,
        },
      };

    case "TOGGLE_SCREEN_SHARE":
      return {
        ...state,
        isScreenSharing: !state.isScreenSharing,
        localParticipant: {
          ...state.localParticipant,
          isScreenSharing: !state.isScreenSharing,
        },
      };

    case "TOGGLE_RECORDING":
      return { ...state, isRecording: !state.isRecording };

    case "ADD_MESSAGE":
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
        unreadMessages: state.unreadMessages + 1,
      };

    case "MARK_MESSAGES_READ":
      return { ...state, unreadMessages: 0 };

    case "RAISE_HAND":
      return {
        ...state,
        localParticipant: {
          ...state.localParticipant,
          isHandRaised: !state.localParticipant.isHandRaised,
        },
      };

    case "CHANGE_LAYOUT":
      return { ...state, selectedLayout: action.payload };

    case "SET_VIDEO_QUALITY":
      return { ...state, videoQuality: action.payload };

    case "SELECT_AUDIO_DEVICE":
      return { ...state, selectedAudioDevice: action.payload };

    case "SELECT_VIDEO_DEVICE":
      return { ...state, selectedVideoDevice: action.payload };

    case "UPDATE_PARTICIPANT":
      return {
        ...state,
        participants: state.participants.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

// Context
const VideoCallContext = createContext<VideoCallContextType | undefined>(
  undefined
);

// Provider component
interface VideoCallProviderProps {
  children: ReactNode;
}

export const VideoCallProvider: React.FC<VideoCallProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(videoCallReducer, initialState);

  // Duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.status === "connected" && state.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor(
          (now.getTime() - state.startTime!.getTime()) / 1000
        );
        dispatch({ type: "UPDATE_DURATION", payload: duration });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.status, state.startTime]);

  // Actions
  const actions = {
    joinCall: async (sessionId: string) => {
      try {
        dispatch({ type: "SET_STATUS", payload: "connecting" });

        // Simulate connection delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const participants = generateMockParticipants();
        dispatch({
          type: "JOIN_CALL_SUCCESS",
          payload: { sessionId, participants },
        });
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to join call" });
      }
    },

    leaveCall: async () => {
      dispatch({ type: "LEAVE_CALL" });
    },

    toggleMute: () => {
      dispatch({ type: "TOGGLE_MUTE" });
    },

    toggleVideo: () => {
      dispatch({ type: "TOGGLE_VIDEO" });
    },

    toggleScreenShare: () => {
      dispatch({ type: "TOGGLE_SCREEN_SHARE" });
    },

    toggleRecording: () => {
      dispatch({ type: "TOGGLE_RECORDING" });
    },

    sendMessage: (message: string) => {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        participantId: state.localParticipant.id,
        participantName: state.localParticipant.name,
        message,
        timestamp: new Date(),
        isSystemMessage: false,
      };
      dispatch({ type: "ADD_MESSAGE", payload: newMessage });
    },

    raiseHand: () => {
      dispatch({ type: "RAISE_HAND" });
    },

    changeLayout: (layout: VideoCallState["selectedLayout"]) => {
      dispatch({ type: "CHANGE_LAYOUT", payload: layout });
    },

    setVideoQuality: (quality: VideoQuality) => {
      dispatch({ type: "SET_VIDEO_QUALITY", payload: quality });
    },

    selectAudioDevice: (deviceId: string) => {
      dispatch({ type: "SELECT_AUDIO_DEVICE", payload: deviceId });
    },

    selectVideoDevice: (deviceId: string) => {
      dispatch({ type: "SELECT_VIDEO_DEVICE", payload: deviceId });
    },

    markMessagesAsRead: () => {
      dispatch({ type: "MARK_MESSAGES_READ" });
    },
  };

  const contextValue: VideoCallContextType = {
    state,
    actions,
  };

  return (
    <VideoCallContext.Provider value={contextValue}>
      {children}
    </VideoCallContext.Provider>
  );
};

// Hook
export const useVideoCall = (): VideoCallContextType => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error("useVideoCall must be used within a VideoCallProvider");
  }
  return context;
};
