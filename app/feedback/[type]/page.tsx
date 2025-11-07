/**
 * Feedback Page
 * Route page for feedback collection
 */

import React from "react";
import { FeedbackProvider } from "../../../features/feedback/context";
import { FeedbackForm } from "../../../features/feedback/presentation";

interface FeedbackPageProps {
  params: {
    type: "session" | "course" | "mentor" | "platform";
  };
  searchParams: {
    sessionId?: string;
    courseId?: string;
    mentorId?: string;
    mentorName?: string;
    courseName?: string;
  };
}

export default function FeedbackPage({
  params,
  searchParams,
}: FeedbackPageProps) {
  const { type } = params;
  const { sessionId, courseId, mentorId, mentorName, courseName } =
    searchParams;

  const handleSubmit = (feedback: unknown) => {
    console.log("Feedback submitted:", feedback);
    // Here you could navigate back or show a success message
  };

  const handleClose = () => {
    // Navigate back to previous page
    window.history.back();
  };

  return (
    <FeedbackProvider>
      <FeedbackForm
        type={type}
        sessionId={sessionId}
        courseId={courseId}
        mentorId={mentorId}
        mentorName={mentorName}
        courseName={courseName}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    </FeedbackProvider>
  );
}

// Metadata for SEO
export async function generateMetadata({ params }: FeedbackPageProps) {
  const { type } = params;

  const titles = {
    session: "Session Feedback",
    course: "Course Feedback",
    mentor: "Mentor Feedback",
    platform: "Platform Feedback",
  };

  return {
    title: titles[type] || "Feedback",
    description: "Help us improve by sharing your feedback",
  };
}
