'use client';
import React, { useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  RefreshCw,
  Calendar,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useActivityTimeline } from "../context";
import { ActivityCard } from "./components/ActivityCard";
import { ActivityDetailModal } from "./components/ActivityDetailModal";
import { ActivityTimelineProps, ActivityEvent } from "../types";
import { cn } from "@/lib/utils";

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  className,
  maxHeight = "600px",
  enableInfiniteScroll = true,
  onEventClick,
}) => {
  const { state, actions } = useActivityTimeline();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    actions.loadActivities();
  }, [actions]);

  useEffect(() => {
    actions.searchActivities(searchQuery);
  }, [searchQuery, actions]);

  const handleScroll = useCallback(() => {
    if (
      !enableInfiniteScroll ||
      !scrollAreaRef.current ||
      state.loading ||
      !state.hasMore
    )
      return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom) {
      actions.loadMoreActivities();
    }
  }, [enableInfiniteScroll, state.loading, state.hasMore, actions]);

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleEventClick = (event: ActivityEvent) => {
    if (onEventClick) {
      onEventClick(event);
    } else {
      actions.openDetailModal(event);
    }
  };

  const handleEventAction = (event: ActivityEvent, actionId: string) => {
    actions.executeAction(event.id, actionId);
  };

  const handleRefresh = () => {
    actions.refreshActivities();
    setSearchQuery("");
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">
                Activity Timeline
              </CardTitle>
              <Badge variant="secondary" className="ml-2">
                {state.events.length} events
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={state.loading}
                className="flex items-center gap-2"
              >
                <RefreshCw
                  className={cn("h-4 w-4", state.loading && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Timeline */}
      <Card className="relative">
        <ScrollArea
          className={cn("w-full", maxHeight && `h-[${maxHeight}]`)}
          ref={scrollAreaRef}
          onScrollCapture={handleScroll}
        >
          <div className="p-6">
            {state.loading && state.events.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">
                  Loading activities...
                </span>
              </div>
            ) : state.groups.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No activities found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : "Your activity timeline will appear here."}
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline vertical line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-8">
                  {state.groups.map((group) => (
                    <div key={group.date} className="relative">
                      {/* Date Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleGroupExpansion(group.date)}
                          className="flex items-center gap-2 h-auto p-2 hover:bg-muted/50"
                        >
                          {expandedGroups.has(group.date) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <div className="text-left">
                            <h3 className="font-semibold text-foreground">
                              {group.dateLabel}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {group.totalCount} activit
                              {group.totalCount !== 1 ? "ies" : "y"}
                            </p>
                          </div>
                        </Button>
                      </div>

                      {/* Activities */}
                      {expandedGroups.has(group.date) && (
                        <div className="space-y-4 ml-12">
                          {group.events.map((event, index) => (
                            <ActivityCard
                              key={event.id}
                              event={event}
                              onExpand={actions.toggleEventExpansion}
                              onAction={handleEventAction}
                              onClick={handleEventClick}
                              className={cn(
                                "transition-all duration-300",
                                index === group.events.length - 1 && "mb-8"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Loading more indicator */}
                {state.loading && state.events.length > 0 && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-3 text-sm text-muted-foreground">
                      Loading more activities...
                    </span>
                  </div>
                )}

                {/* End of timeline */}
                {!state.hasMore && state.events.length > 0 && (
                  <div className="text-center py-8">
                    <div className="text-sm text-muted-foreground">
                      You&apos;ve reached the end of your activity timeline
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Detail Modal */}
      <ActivityDetailModal
        event={state.selectedEvent}
        isOpen={state.isDetailModalOpen}
        onClose={actions.closeDetailModal}
        onAction={handleEventAction}
      />

      {/* Error State */}
      {state.error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}
    </div>
  );
};
