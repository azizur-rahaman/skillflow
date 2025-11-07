/**
 * Calendar Picker Component
 * Interactive calendar for selecting available dates
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { CalendarPickerProps } from "../../types";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  availableDates,
  selectedDate,
  onDateSelect,
  className,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      (availableDate) =>
        availableDate.date.toDateString() === date.toDateString() &&
        availableDate.isAvailable
    );
  };

  const isDateSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const days = getDaysInMonth(currentMonth);
  const availableDatesCount = availableDates.filter(
    (d) => d.isAvailable
  ).length;

  return (
    <Card
      className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Date
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {availableDatesCount} available
          </Badge>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToToday}
              className="text-xs h-6 px-2"
            >
              Today
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-10" />;
            }

            const available = isDateAvailable(date);
            const selected = isDateSelected(date);
            const inPast = isDateInPast(date);

            return (
              <Button
                key={date.toISOString()}
                variant="ghost"
                className={cn(
                  "h-10 w-full p-0 relative hover:bg-accent",
                  selected &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                  available && !selected && "hover:bg-green-500/10",
                  !available && !inPast && "opacity-50 cursor-not-allowed",
                  inPast &&
                    "opacity-30 cursor-not-allowed text-muted-foreground"
                )}
                onClick={() => available && !inPast && onDateSelect(date)}
                disabled={!available || inPast}
              >
                <span className="text-sm font-medium">{date.getDate()}</span>

                {/* Availability Indicator */}
                {available && !selected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-muted rounded-full" />
            <span>Unavailable</span>
          </div>
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="mt-4 p-3 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {(() => {
              const selectedDateData = availableDates.find(
                (d) => d.date.toDateString() === selectedDate.toDateString()
              );
              return selectedDateData ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {
                      selectedDateData.timeSlots.filter(
                        (slot) => slot.available
                      ).length
                    }{" "}
                    time slots available
                  </span>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
