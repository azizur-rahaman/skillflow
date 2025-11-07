/**
 * Feedback Demo Component
 * Demonstration of the feedback form for different use cases
 */

"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedbackProvider } from "../context";
import { FeedbackForm } from "../presentation";
import { FeedbackType } from "../types";

const demoScenarios = [
  {
    type: "session" as FeedbackType,
    title: "Mentoring Session Feedback",
    description: "After a 1-on-1 mentoring session",
    mentorName: "Sarah Johnson",
    sessionId: "session_123",
  },
  {
    type: "course" as FeedbackType,
    title: "Course Completion Feedback",
    description: "After completing a learning course",
    courseName: "Advanced React Patterns",
    courseId: "course_456",
  },
  {
    type: "mentor" as FeedbackType,
    title: "Mentor Rating",
    description: "Rate a specific mentor",
    mentorName: "Dr. Michael Chen",
    mentorId: "mentor_789",
  },
  {
    type: "platform" as FeedbackType,
    title: "Platform Experience",
    description: "General platform feedback",
  },
];

export const FeedbackDemo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<
    (typeof demoScenarios)[0] | null
  >(null);

  if (selectedScenario) {
    return (
      <FeedbackProvider>
        <FeedbackForm
          {...selectedScenario}
          onSubmit={(feedback) => {
            console.log("Demo feedback submitted:", feedback);
            alert("Feedback submitted! Check console for details.");
            setSelectedScenario(null);
          }}
          onClose={() => setSelectedScenario(null)}
        />
      </FeedbackProvider>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Feedback Form Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Experience the feedback collection interface for different scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoScenarios.map((scenario, index) => (
            <Card
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl hover:bg-card/70 transition-colors cursor-pointer"
              onClick={() => setSelectedScenario(scenario)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {scenario.type}
                  </Badge>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Try It
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {scenario.description}
                  </p>
                </div>

                {(scenario.mentorName || scenario.courseName) && (
                  <div className="text-sm text-primary">
                    {scenario.mentorName && `Mentor: ${scenario.mentorName}`}
                    {scenario.courseName && `Course: ${scenario.courseName}`}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-card/30 rounded-2xl p-6 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Design Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">NPS Slider:</strong> 0-10
                rating scale with visual feedback
              </div>
              <div>
                <strong className="text-foreground">Optional Comments:</strong>{" "}
                Rich text input with character counter
              </div>
              <div>
                <strong className="text-foreground">
                  Thank You Animation:
                </strong>{" "}
                Celebration with floating icons
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
