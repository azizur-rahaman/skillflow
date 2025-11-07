/**
 * Video Call Page
 * Route page for video call sessions
 */

import React from "react";
import { VideoCallProvider } from "@/features/video-call/context";
import { VideoCall } from "@/features/video-call/presentation";

interface VideoCallPageProps {
  params: {
    sessionId: string;
  };
  searchParams: {
    mentor?: string;
    mentee?: string;
    type?: "1-on-1" | "group" | "workshop";
  };
}

export default function VideoCallPage({
  params,
  searchParams,
}: VideoCallPageProps) {
  const { sessionId } = params;
  const {
    mentor = "Mentor",
    mentee = "Mentee",
    type = "1-on-1",
  } = searchParams;

  const handleEndCall = () => {
    // Navigate back to dashboard or previous page
    window.history.back();
  };

  return (
    <VideoCallProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <VideoCall
          sessionId={sessionId}
          mentorName={mentor}
          menteeName={mentee}
          sessionType={type}
          onEndCall={handleEndCall}
        />
      </div>
    </VideoCallProvider>
  );
}

// Metadata for SEO
export async function generateMetadata({ searchParams }: VideoCallPageProps) {
  const {
    mentor = "Mentor",
    mentee = "Mentee",
    type = "1-on-1",
  } = searchParams;

  return {
    title: `Video Call - ${mentor} & ${mentee}`,
    description: `${type} mentoring session between ${mentor} and ${mentee}`,
  };
}
