/**
 * Mentor Marketplace Component
 * Main orchestrator for mentor marketplace functionality
 */

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Grid,
  List,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MentorMarketplaceProps,
  MentorMarketplaceState,
  MentorProfile,
} from "../types";
import { useMentorMarketplace } from "../context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MentorFilters } from "./components/MentorFilters";
import { MentorCard } from "./components/MentorCard";
import { Skeleton } from "@/components/ui/skeleton";

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "experience", label: "Most Experienced" },
  { value: "popularity", label: "Most Popular" },
] as const;

export const MentorMarketplace: React.FC<MentorMarketplaceProps> = ({
  className,
  showFilters = true,
  enableInfiniteScroll = true,
  onBooking,
}) => {
  const { state, actions } = useMentorMarketplace();
  const [showFiltersPanel, setShowFiltersPanel] = useState(showFilters);

  // Load initial mentors
  useEffect(() => {
    actions.loadMentors();
  }, [actions]);

  // Handle infinite scroll
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (!state.loading && state.hasMore) {
          actions.loadMoreMentors();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.loading, state.hasMore, enableInfiniteScroll, actions]);

  const handleBookMentor = (mentor: MentorProfile) => {
    onBooking?.(mentor, "1-on-1");
  };

  const handleViewProfile = (mentor: MentorProfile) => {
    // Navigate to mentor profile page
    window.location.href = `/mentor-marketplace/${mentor.id}`;
  };

  const handleRefresh = () => {
    actions.refreshMentors();
  };

  if (state.error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {state.error}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="ml-2"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Mentor Marketplace
              </h1>
              <p className="text-muted-foreground mt-1">
                Connect with verified expert mentors to accelerate your learning
                journey
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select
                value={state.sortBy}
                onValueChange={(value) =>
                  actions.setSortBy(value as MentorMarketplaceState["sortBy"])
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex rounded-lg border border-border/50 p-1">
                <Button
                  variant={state.viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => actions.setViewMode("grid")}
                  className="px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={state.viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => actions.setViewMode("list")}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Filters Toggle */}
              {showFilters && (
                <Button
                  variant="outline"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className="lg:hidden"
                >
                  Filters
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 ml-1 transition-transform",
                      showFiltersPanel && "rotate-180"
                    )}
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && showFiltersPanel && (
            <div className="w-full lg:w-80 shrink-0">
              <div className="sticky top-32">
                <MentorFilters
                  filters={state.filters}
                  onFiltersChange={actions.setFilters}
                  mentorCount={state.filteredMentors.length}
                />
              </div>
            </div>
          )}

          {/* Mentors Grid/List */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {state.loading
                    ? "Loading mentors..."
                    : `${state.filteredMentors.length} mentors found`}
                </h2>
                {state.loading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={state.loading}
              >
                <RefreshCw
                  className={cn(
                    "w-4 h-4 mr-1",
                    state.loading && "animate-spin"
                  )}
                />
                Refresh
              </Button>
            </div>

            {/* Mentors Grid */}
            {state.filteredMentors.length > 0 ? (
              <div
                className={cn(
                  "grid gap-6",
                  state.viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                {state.filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    onBook={handleBookMentor}
                    onViewProfile={handleViewProfile}
                    className={state.viewMode === "list" ? "max-w-none" : ""}
                  />
                ))}
              </div>
            ) : !state.loading ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No mentors found</h3>
                  <p className="text-sm">
                    Try adjusting your filters or search terms to find more
                    mentors.
                  </p>
                </div>
                <Button onClick={() => actions.clearFilters()}>
                  Clear Filters
                </Button>
              </div>
            ) : null}

            {/* Loading Skeletons */}
            {state.loading && state.filteredMentors.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Indicator */}
            {state.loading && state.filteredMentors.length > 0 && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading more mentors...</span>
                </div>
              </div>
            )}

            {/* End of Results */}
            {!state.hasMore && state.filteredMentors.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You&apos;ve reached the end of the mentor list.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
