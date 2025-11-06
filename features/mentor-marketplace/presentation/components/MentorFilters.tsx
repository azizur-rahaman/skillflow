/**
 * Mentor Filters Component
 * Advanced filtering system for mentor marketplace
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Star,
  Users,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import {
  MentorFiltersProps,
  MentorCategory,
  AvailabilityStatus,
} from "../../types";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const CATEGORY_OPTIONS: {
  value: MentorCategory;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "technology",
    label: "Technology",
    icon: <Users className="w-4 h-4" />,
  },
  { value: "business", label: "Business", icon: <Users className="w-4 h-4" /> },
  { value: "design", label: "Design", icon: <Users className="w-4 h-4" /> },
  {
    value: "marketing",
    label: "Marketing",
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: "data-science",
    label: "Data Science",
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: "engineering",
    label: "Engineering",
    icon: <Users className="w-4 h-4" />,
  },
  { value: "finance", label: "Finance", icon: <Users className="w-4 h-4" /> },
  {
    value: "healthcare",
    label: "Healthcare",
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: "education",
    label: "Education",
    icon: <Users className="w-4 h-4" />,
  },
];

const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Portuguese",
  "Italian",
  "Russian",
  "Arabic",
  "Hindi",
];

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available Now", color: "bg-green-500" },
  { value: "busy", label: "Busy", color: "bg-yellow-500" },
  { value: "offline", label: "Offline", color: "bg-gray-500" },
];

export const MentorFilters: React.FC<MentorFiltersProps> = ({
  filters,
  onFiltersChange,
  mentorCount,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleCategoryChange = (category: MentorCategory, checked: boolean) => {
    const newCategories = { ...localFilters.categories, [category]: checked };
    setLocalFilters((prev) => ({ ...prev, categories: newCategories }));
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    const newLanguages = { ...localFilters.languages, [language]: checked };
    setLocalFilters((prev) => ({ ...prev, languages: newLanguages }));
  };

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    const newAvailability = checked
      ? [...localFilters.availability, availability as AvailabilityStatus]
      : localFilters.availability.filter((a) => a !== availability);
    setLocalFilters((prev) => ({ ...prev, availability: newAvailability }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      priceRange: { min: value[0], max: value[1] },
    }));
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters((prev) => ({ ...prev, rating }));
  };

  const handleExperienceChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      experience: { min: value[0], max: value[1] },
    }));
  };

  const handleVerifiedChange = (checked: boolean) => {
    setLocalFilters((prev) => ({ ...prev, verified: checked }));
  };

  const handleSearchChange = (search: string) => {
    setLocalFilters((prev) => ({ ...prev, search }));
    onFiltersChange({ search });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: {} as Record<MentorCategory, boolean>,
      languages: {} as Record<string, boolean>,
      priceRange: { min: 0, max: 500 },
      rating: 0,
      availability: [],
      experience: { min: 0, max: 50 },
      verified: false,
      search: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;

    // Categories
    count += Object.values(localFilters.categories).filter(Boolean).length;

    // Languages
    count += Object.values(localFilters.languages).filter(Boolean).length;

    // Availability
    count += localFilters.availability.length;

    // Price range (if not default)
    if (localFilters.priceRange.min > 0 || localFilters.priceRange.max < 500)
      count++;

    // Rating (if not default)
    if (localFilters.rating > 0) count++;

    // Experience (if not default)
    if (localFilters.experience.min > 0 || localFilters.experience.max < 50)
      count++;

    // Verified
    if (localFilters.verified) count++;

    // Search
    if (localFilters.search) count++;

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Card
      className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search mentors, skills, or companies..."
            value={localFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="text-sm text-muted-foreground">
          {mentorCount} mentor{mentorCount !== 1 ? "s" : ""} available
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Categories</Label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={localFilters.categories[category.value] || false}
                  onCheckedChange={(checked: boolean) =>
                    handleCategoryChange(category.value, checked)
                  }
                />
                <Label
                  htmlFor={`category-${category.value}`}
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  {category.icon}
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Hourly Rate: ${localFilters.priceRange.min} - $
            {localFilters.priceRange.max}
          </Label>
          <Slider
            value={[localFilters.priceRange.min, localFilters.priceRange.max]}
            onValueChange={handlePriceRangeChange}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>$0</span>
            <span>$500+</span>
          </div>
        </div>

        <Separator />

        {/* Minimum Rating */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Minimum Rating:{" "}
            {localFilters.rating > 0 ? `${localFilters.rating}+ stars` : "Any"}
          </Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={localFilters.rating >= rating ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleRatingChange(
                    localFilters.rating >= rating ? rating - 1 : rating
                  )
                }
                className="flex items-center gap-1"
              >
                <Star
                  className={cn(
                    "w-3 h-3",
                    localFilters.rating >= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : ""
                  )}
                />
                {rating}
              </Button>
            ))}
          </div>
        </div>

        {isExpanded && (
          <>
            <Separator />

            {/* Languages */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Languages
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {LANGUAGE_OPTIONS.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={localFilters.languages[language] || false}
                      onCheckedChange={(checked: boolean) =>
                        handleLanguageChange(language, checked)
                      }
                    />
                    <Label
                      htmlFor={`language-${language}`}
                      className="text-sm cursor-pointer"
                    >
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Availability */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Availability
              </Label>
              <div className="space-y-2">
                {AVAILABILITY_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`availability-${option.value}`}
                      checked={localFilters.availability.includes(
                        option.value as AvailabilityStatus
                      )}
                      onCheckedChange={(checked: boolean) =>
                        handleAvailabilityChange(option.value, checked)
                      }
                    />
                    <Label
                      htmlFor={`availability-${option.value}`}
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <div
                        className={cn("w-2 h-2 rounded-full", option.color)}
                      />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Experience */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Years of Experience: {localFilters.experience.min} -{" "}
                {localFilters.experience.max} years
              </Label>
              <Slider
                value={[
                  localFilters.experience.min,
                  localFilters.experience.max,
                ]}
                onValueChange={handleExperienceChange}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 years</span>
                <span>50+ years</span>
              </div>
            </div>

            <Separator />

            {/* Verified Only */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verified"
                checked={localFilters.verified}
                onCheckedChange={handleVerifiedChange}
              />
              <Label
                htmlFor="verified"
                className="text-sm cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-indigo-500" />
                Verified mentors only
              </Label>
            </div>
          </>
        )}

        {/* Apply Filters Button */}
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};
