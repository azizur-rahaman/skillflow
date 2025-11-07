import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Clock,
  Settings,
  Trophy,
  BookOpen,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  NotificationType,
  Notification,
  NotificationPriority,
} from "../../types";

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction?: (notification: Notification, action: string) => void;
  className?: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "system":
      return <Settings className="h-4 w-4" />;
    case "social":
      return <Users className="h-4 w-4" />;
    case "learning":
      return <BookOpen className="h-4 w-4" />;
    case "achievement":
      return <Trophy className="h-4 w-4" />;
    case "security":
      return <Shield className="h-4 w-4" />;
    case "performance":
      return <TrendingUp className="h-4 w-4" />;
    case "reminder":
      return <Clock className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getPriorityIcon = (priority: NotificationPriority) => {
  switch (priority) {
    case "high":
      return <AlertTriangle className="h-3 w-3 text-red-500" />;
    case "medium":
      return <Info className="h-3 w-3 text-yellow-500" />;
    case "low":
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    default:
      return null;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case "high":
      return "border-l-red-500";
    case "medium":
      return "border-l-yellow-500";
    case "low":
      return "border-l-green-500";
    default:
      return "border-l-gray-500";
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  onAction,
  className,
}) => {
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(notification, action);
    }
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-md cursor-pointer group",
        notification.status === "unread" &&
          "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
        notification.status === "read" && "bg-white dark:bg-gray-900",
        getPriorityColor(notification.priority),
        "border-l-4",
        className
      )}
      onClick={() =>
        notification.status === "unread" && onMarkAsRead(notification.id)
      }
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            <div
              className={cn(
                "p-2 rounded-full",
                notification.status === "unread"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              )}
            >
              {getNotificationIcon(notification.type)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4
                  className={cn(
                    "text-sm font-medium leading-tight",
                    notification.status === "unread" &&
                      "text-gray-900 dark:text-gray-100",
                    notification.status === "read" &&
                      "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {/* Priority indicator */}
              {getPriorityIcon(notification.priority)}
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(notification.timestamp)}</span>
                {notification.sender && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          alt="avatar"
                          src={notification.sender.avatar}
                        />
                        <AvatarFallback className="text-xs">
                          {notification.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{notification.sender.name}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {notification.status === "unread" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead(notification.id);
                    }}
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(notification.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {notification.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.primary ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(action.id);
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
