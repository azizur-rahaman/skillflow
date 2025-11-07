import React from "react";
import { ActivityTimelineProvider } from "@/features/activity-timeline/context";
import { ActivityTimeline } from "@/features/activity-timeline/presentation";

export default function ActivityTimelinePage() {
  return (
    <ActivityTimelineProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto py-8 px-4">
          <ActivityTimeline
            maxHeight="calc(100vh - 200px)"
            enableInfiniteScroll={true}
          />
        </div>
      </div>
    </ActivityTimelineProvider>
  );
}
