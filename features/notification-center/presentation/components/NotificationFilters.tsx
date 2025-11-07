import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Filter,
  CheckCircle,
  Circle,
  Settings,
  Users,
  BookOpen,
  Trophy,
  Shield,
  TrendingUp,
  Clock,
  X,
} from "lucide-react";
import { NotificationFilters, NotificationType } from "../../types";
import { cn } from "@/lib/utils";

interface NotificationFiltersProps {
  filters: NotificationFilters;
  onFiltersChange: (filters: NotificationFilters) => void;
  unreadCount: number;
  totalCount: number;
  className?: string;
}

const filterOptions: Array<{
  key: NotificationType;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  {
    key: "system",
    label: "System",
    icon: <Settings className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "social",
    label: "Social",
    icon: <Users className="h-4 w-4" />,
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    key: "learning",
    label: "Learning",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
  },
  {
    key: "achievement",
    label: "Achievements",
    icon: <Trophy className="h-4 w-4" />,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    key: "security",
    label: "Security",
    icon: <Shield className="h-4 w-4" />,
    color: "text-red-600 dark:text-red-400",
  },
  {
    key: "performance",
    label: "Performance",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    key: "reminder",
    label: "Reminders",
    icon: <Clock className="h-4 w-4" />,
    color: "text-gray-600 dark:text-gray-400",
  },
];

export const NotificationFiltersComponent: React.FC<
  NotificationFiltersProps
> = ({ filters, onFiltersChange, unreadCount, totalCount, className }) => {
  const handleTypeToggle = (type: NotificationType) => {
    onFiltersChange({
      ...filters,
      types: {
        ...filters.types,
        [type]: !filters.types[type],
      },
    });
  };

  const handleReadFilterToggle = (readFilter: "all" | "unread" | "read") => {
    onFiltersChange({
      ...filters,
      readStatus: readFilter,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      types: Object.keys(filters.types).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {} as NotificationFilters["types"]
      ),
      readStatus: "all",
    });
  };

  const hasActiveFilters = () => {
    const allTypesEnabled = Object.values(filters.types).every(Boolean);
    return !allTypesEnabled || filters.readStatus !== "all";
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs h-6 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Read Status Filter */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Status
        </Label>
        <div className="flex gap-2">
          <Button
            variant={filters.readStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleReadFilterToggle("all")}
            className="text-xs"
          >
            All ({totalCount})
          </Button>
          <Button
            variant={filters.readStatus === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => handleReadFilterToggle("unread")}
            className="text-xs"
          >
            <Circle className="h-3 w-3 mr-1" />
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filters.readStatus === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => handleReadFilterToggle("read")}
            className="text-xs"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Read ({totalCount - unreadCount})
          </Button>
        </div>
      </div>

      {/* Type Filters */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Categories
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.map(({ key, label, icon, color }) => (
            <Button
              key={String(key)}
              variant={filters.types[key] ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeToggle(key)}
              className={cn(
                "justify-start text-xs h-8",
                filters.types[key] && color
              )}
            >
              {icon}
              <span className="ml-2">{label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex-1"
            onClick={() => {
              // Mark all as read
              onFiltersChange({
                ...filters,
                readStatus: "read",
              });
            }}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Mark All Read
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex-1"
            onClick={() => {
              // This would trigger bulk dismiss in parent
            }}
          >
            <X className="h-3 w-3 mr-1" />
            Dismiss All
          </Button>
        </div>
      </div>
    </div>
  );
};
