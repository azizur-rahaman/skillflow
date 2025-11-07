/**
 * Feature Filters Component
 * Sorting, searching, and filtering controls for feature requests
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeatureFiltersProps } from "../../types";
import { cn } from "@/lib/utils";
import { Search, Filter, X, TrendingUp, Clock, ThumbsUp } from "lucide-react";

export const FeatureFilters: React.FC<FeatureFiltersProps> = ({
  sortBy,
  searchQuery,
  selectedTags,
  availableTags,
  onSortChange,
  onSearchChange,
  onTagToggle,
  className,
}) => {
  const sortOptions = [
    { value: "most-voted", label: "Most Voted", icon: ThumbsUp },
    { value: "recent", label: "Recent", icon: Clock },
    { value: "trending", label: "Trending", icon: TrendingUp },
  ];

  const handleTagRemove = (tag: string) => {
    onTagToggle(tag);
  };

  const handleTagClick = (tag: string) => {
    onTagToggle(tag);
  };

  return (
    <Card
      className={cn(
        "bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl p-6",
        className
      )}
    >
      <div className="space-y-4">
        {/* Search and Sort Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search feature requests..."
              className="pl-10 bg-background/50 border-border/50 rounded-xl"
            />
          </div>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-48 bg-background/50 border-border/50 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Filter by tags:
            </span>
          </div>

          {/* Available Tags */}
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Button
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagClick(tag)}
                  className={cn(
                    "rounded-full text-xs transition-all duration-200",
                    isSelected
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  {tag}
                </Button>
              );
            })}
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground self-center">
                Active filters:
              </span>
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTagRemove(tag)}
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="text-xs text-muted-foreground pt-2 border-t border-border/50">
          {searchQuery && (
            <span>Searching for &ldquo;{searchQuery}&rdquo; • </span>
          )}
          {selectedTags.length > 0 && (
            <span>
              {selectedTags.length} tag filter
              {selectedTags.length > 1 ? "s" : ""} active
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
