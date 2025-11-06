'use client';
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, CheckCircle, X } from "lucide-react";
import {
  NotificationGroup as NotificationGroupType,
  Notification,
} from "../../types";
import { NotificationCard } from "./NotificationCard";
import { cn } from "@/lib/utils";

interface NotificationGroupProps {
  group: NotificationGroupType;
  onMarkAsRead: (ids: string[]) => void;
  onDismiss: (ids: string[]) => void;
  onMarkGroupAsRead: (groupId: string) => void;
  onDismissGroup: (groupId: string) => void;
  onAction?: (notification: Notification, action: string) => void;
  className?: string;
}

export const NotificationGroup: React.FC<NotificationGroupProps> = ({
  group,
  onMarkAsRead,
  onDismiss,
  onMarkGroupAsRead,
  onDismissGroup,
  onAction,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const unreadCount = group.notifications.filter(
    (n) => n.status === "unread"
  ).length;
  const totalCount = group.notifications.length;

  const formatGroupTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleGroupAction = (action: "read" | "dismiss") => {
    if (action === "read") {
      onMarkGroupAsRead(group.id);
    } else {
      onDismissGroup(group.id);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-left">
                {group.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatGroupTimestamp(group.lastUpdated)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {totalCount} notification{totalCount !== 1 ? "s" : ""}
                </Badge>
                {unreadCount > 0 && (
                  <Badge variant="default" className="text-xs bg-blue-600">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Group actions */}
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGroupAction("read");
                }}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleGroupAction("dismiss");
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Dismiss All
            </Button>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            {group.notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={(id) => onMarkAsRead([id])}
                onDismiss={(id) => onDismiss([id])}
                onAction={onAction}
                className="border-l-0 border-r-0 border-t-0 rounded-none first:rounded-t-md last:rounded-b-md"
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
