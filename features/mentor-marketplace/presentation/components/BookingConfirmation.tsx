/**
 * Booking Confirmation Component
 * Final booking step with summary and confirmation
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { BookingConfirmationProps } from "../../types";
import { useMentorBooking } from "../../context";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-select";

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  mentor,
  selectedDate,
  selectedTimeSlot,
  sessionType,
  duration,
  onConfirm,
  onCancel,
  isLoading,
  className,
}) => {
  const { state: bookingState, actions: bookingActions } = useMentorBooking();
  const [showSuccess, setShowSuccess] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotal = () => {
    if (!selectedTimeSlot) return 0;
    const hourlyRate = selectedTimeSlot.price;
    const hours = duration / 60;
    return hourlyRate * hours;
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
      setShowSuccess(true);

      // Auto-hide success after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch {
      // Error handled by parent
    }
  };

  if (showSuccess) {
    return (
      <Card
        className={cn(
          "bg-card/50 backdrop-blur-sm border-border/50",
          className
        )}
      >
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            {/* Success Animation */}
            <div className="relative">
              <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-ping" />
              <div className="absolute -inset-2 rounded-full border-2 border-green-500/20 animate-pulse" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Booking Confirmed! 🎉
              </h3>
              <p className="text-muted-foreground">
                Your session with {mentor.name} has been scheduled successfully.
              </p>
            </div>

            {/* Booking Details */}
            <div className="bg-accent/50 rounded-lg p-4 max-w-md mx-auto">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mentor:</span>
                  <span className="font-medium">{mentor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {selectedDate && formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">
                    {selectedTimeSlot &&
                      `${formatTime(selectedTimeSlot.startTime)} - ${formatTime(
                        selectedTimeSlot.endTime
                      )}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">
                    {sessionType.replace("-", " ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={onCancel} variant="outline">
                Book Another Session
              </Button>
              <Button className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
                View My Sessions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!selectedDate || !selectedTimeSlot) {
    return (
      <Card
        className={cn(
          "bg-card/50 backdrop-blur-sm border-border/50",
          className
        )}
      >
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Select Date & Time
            </h3>
            <p className="text-sm text-muted-foreground">
              Please select an available date and time slot to continue
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Confirm Your Booking</h2>
          <p className="text-sm text-muted-foreground">
            Review your session details and confirm
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mentor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white">
                    {getInitials(mentor.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span>{mentor.name}</span>
                    {mentor.verified && (
                      <CheckCircle className="w-4 h-4 text-indigo-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mentor.title}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedDate && formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {formatTime(selectedTimeSlot.startTime)} -{" "}
                    {formatTime(selectedTimeSlot.endTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">
                    {sessionType.replace("-", " ")} Session
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{duration} minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Session Notes (Optional)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Share any specific topics or goals you&apos;d like to cover
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., I'd like to focus on React performance optimization and best practices..."
                value={bookingState.notes}
                onChange={(e) => bookingActions.setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {duration}-minute {sessionType.replace("-", " ")} session
                  </span>
                  <span className="font-medium">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="font-medium">$0.00</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 h-12"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Confirming...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Confirm Booking
                    </div>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-2">
                You won&apos;t be charged until the session is completed
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>• Free cancellation up to 24 hours before the session</p>
              <p>• 50% refund for cancellations within 24 hours</p>
              <p>• No refund for no-shows or last-minute cancellations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
