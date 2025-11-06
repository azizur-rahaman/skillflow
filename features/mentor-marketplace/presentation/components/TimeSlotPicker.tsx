/**
 * Time Slot Picker Component
 * Interactive time slot selection for booking
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign } from "lucide-react";
import { TimeSlotPickerProps } from "../../types";
import { cn } from "@/lib/utils";

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  className,
}) => {
  const availableSlots = timeSlots.filter((slot) => slot.available);
  const unavailableSlots = timeSlots.filter((slot) => !slot.available);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes - startMinutes;
  };

  return (
    <Card
      className={cn("bg-card/50 backdrop-blur-sm border-border/50", className)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Select Time
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {availableSlots.length} available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Available Slots */}
        {availableSlots.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Available Times
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.map((slot) => {
                const duration = getDuration(slot.startTime, slot.endTime);
                const isSelected = selectedTimeSlot?.id === slot.id;

                return (
                  <Button
                    key={slot.id}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "h-auto p-3 flex flex-col items-start gap-1 text-left",
                      isSelected &&
                        "bg-primary text-primary-foreground border-primary",
                      !isSelected && "hover:border-primary/50"
                    )}
                    onClick={() => onTimeSlotSelect(slot)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span className="text-sm font-medium">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full text-xs">
                      <span className="text-muted-foreground">
                        {duration} min
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <DollarSign className="w-3 h-3" />
                        {slot.price}
                      </span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Unavailable Slots */}
        {unavailableSlots.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Unavailable Times
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {unavailableSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant="ghost"
                  disabled
                  className="h-auto p-3 flex flex-col items-start gap-1 text-left opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span className="text-sm">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full text-xs">
                    <span>Unavailable</span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {slot.price}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* No slots available */}
        {timeSlots.length === 0 && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              No time slots available
            </h4>
            <p className="text-xs text-muted-foreground">
              Please select a different date
            </p>
          </div>
        )}

        {/* Selected Slot Info */}
        {selectedTimeSlot && (
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {formatTime(selectedTimeSlot.startTime)} -{" "}
                  {formatTime(selectedTimeSlot.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-1 font-medium text-primary">
                <DollarSign className="w-3 h-3" />
                {selectedTimeSlot.price}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {getDuration(
                selectedTimeSlot.startTime,
                selectedTimeSlot.endTime
              )}{" "}
              minute session
            </p>
          </div>
        )}

        {/* Time Zone Info */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          All times shown in your local timezone
        </div>
      </CardContent>
    </Card>
  );
};
