import React from "react";
import { NotificationProvider } from "@/features/notification-center/context";
import { NotificationCenter } from "@/features/notification-center/presentation";

export default function NotificationsPage() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto py-8">
          <NotificationCenter layout="fullscreen" />
        </div>
      </div>
    </NotificationProvider>
  );
}
