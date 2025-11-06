import React, { useState, useEffect, useMemo } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Search,
  Sun,
  Moon,
  X,
  CheckCircle,
  Filter,
  RefreshCw,
} from "lucide-react";
import { NotificationFiltersComponent } from "./components/NotificationFilters";
import { NotificationGroup } from "./components/NotificationGroup";
import {
  Notification,
  NotificationGroup as NotificationGroupType,
  NotificationType,
} from "../types";
import { cn } from "@/lib/utils";
import { useNotification } from "../context";

interface NotificationCenterProps {
  className?: string;
  layout?: "sidebar" | "fullscreen";
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className,
  layout = "sidebar",
}) => {
  const { state, actions } = useNotification();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    actions.loadNotifications();
  }, [actions]);

  const filteredNotifications = useMemo(() => {
    let filtered = state.notifications;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query) ||
          notification.category.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (state.filters.readStatus !== "all") {
      filtered = filtered.filter((notification) =>
        state.filters.readStatus === "unread"
          ? notification.status === "unread"
          : notification.status === "read"
      );
    }

    // Apply type filter
    const enabledTypes = Object.entries(state.filters.types)
      .filter(([, enabled]) => enabled)
      .map(([type]) => type as NotificationType);

    if (enabledTypes.length < Object.keys(state.filters.types).length) {
      filtered = filtered.filter((notification: Notification) =>
        enabledTypes.includes(notification.type)
      );
    }

    return filtered;
  }, [state.notifications, state.filters, searchQuery]);

  const groupedNotifications = useMemo(() => {
    // Group by type and recent activity
    const grouped = filteredNotifications.reduce(
      (
        acc: Record<string, NotificationGroupType>,
        notification: Notification
      ) => {
        const key = `${notification.type}-${notification.category}`;
        if (!acc[key]) {
          acc[key] = {
            id: key,
            title: `${notification.category} ${notification.type}`,
            type: notification.type,
            notifications: [],
            unreadCount: 0,
            lastUpdated: notification.timestamp,
          };
        }

        acc[key].notifications.push(notification);
        if (notification.status === "unread") {
          acc[key].unreadCount++;
        }
        if (notification.timestamp > acc[key].lastUpdated) {
          acc[key].lastUpdated = notification.timestamp;
        }

        return acc;
      },
      {} as Record<string, NotificationGroupType>
    );

    return Object.values(grouped).sort(
      (a: NotificationGroupType, b: NotificationGroupType) =>
        b.lastUpdated.getTime() - a.lastUpdated.getTime()
    );
  }, [filteredNotifications]);

  const handleMarkAsRead = async (ids: string[]) => {
    for (const id of ids) {
      await actions.markAsRead(id);
    }
  };

  const handleDismiss = async (ids: string[]) => {
    for (const id of ids) {
      await actions.dismissNotification(id);
    }
  };

  const handleMarkGroupAsRead = async (groupId: string) => {
    const group = groupedNotifications.find((g) => g.id === groupId) as
      | NotificationGroupType
      | undefined;
    if (group) {
      const unreadIds = group.notifications
        .filter((n) => n.status === "unread")
        .map((n) => n.id);
      await handleMarkAsRead(unreadIds);
    }
  };

  const handleDismissGroup = async (groupId: string) => {
    const group = groupedNotifications.find((g) => g.id === groupId) as
      | NotificationGroupType
      | undefined;
    if (group) {
      const ids = group.notifications.map((n) => n.id);
      await handleDismiss(ids);
    }
  };

  const handleAction = async (notification: Notification, actionId: string) => {
    await actions.executeAction(notification.id, actionId);
  };

  const toggleTheme = () => {
    actions.toggleTheme();
  };

  const unreadCount = state.notifications.filter(
    (n: Notification) => n.status === "unread"
  ).length;

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white dark:bg-gray-900",
        layout === "sidebar" ? "w-96" : "w-full max-w-4xl mx-auto",
        className
      )}
    >
      {/* Header */}
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg font-semibold">
              Notifications
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0"
            >
              {state.theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 w-8 p-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={actions.loadNotifications}
              className="h-8 w-8 p-0"
              disabled={state.loading}
            >
              <RefreshCw
                className={cn("h-4 w-4", state.loading && "animate-spin")}
              />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <div className="flex flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
            <NotificationFiltersComponent
              filters={state.filters}
              onFiltersChange={actions.setFilters}
              unreadCount={unreadCount}
              totalCount={state.notifications.length}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {state.loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-500">
                    Loading notifications...
                  </span>
                </div>
              ) : groupedNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "No notifications match your search."
                      : "You're all caught up!"}
                  </p>
                </div>
              ) : (
                groupedNotifications.map((group) => (
                  <NotificationGroup
                    key={group.id}
                    group={group as NotificationGroupType}
                    onMarkAsRead={handleMarkAsRead}
                    onDismiss={handleDismiss}
                    onMarkGroupAsRead={handleMarkGroupAsRead}
                    onDismissGroup={handleDismissGroup}
                    onAction={handleAction}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          {unreadCount > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.markAllAsRead}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would dismiss all visible notifications
                    const allIds = filteredNotifications.map(
                      (n: Notification) => n.id
                    );
                    handleDismiss(allIds);
                  }}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Dismiss All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
