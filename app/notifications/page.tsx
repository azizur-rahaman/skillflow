import React from "react";
import { NotificationProvider } from "@/features/notification-center/context";
import { NotificationCenter } from "@/features/notification-center/presentation";

export default function NotificationsPage() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-8">
          <NotificationCenter layout="fullscreen" />
        </div>
      </div>
    </NotificationProvider>
  );
}
