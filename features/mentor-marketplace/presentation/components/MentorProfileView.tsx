/**
 * Mentor Profile View Component
 * Detailed mentor profile with booking interface
 */

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  MessageCircle,
  Award,
  Users,
  Calendar,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { MentorProfileViewProps } from "../../types";
import { useMentorBooking } from "../../context";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-select";
import { BookingConfirmation } from "./BookingConfirmation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const MentorProfileView: React.FC<MentorProfileViewProps> = ({
  mentor,
  reviews,
  availableDates,
  onBookSession,
  onBack,
  className,
}) => {
  const { state: bookingState, actions: bookingActions } = useMentorBooking();
  const [activeTab, setActiveTab] = useState("overview");
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleBookClick = (
    sessionType: "1-on-1" | "group" | "workshop" | "consultation"
  ) => {
    bookingActions.setSessionType(sessionType);
    setShowBookingFlow(true);
    setActiveTab("booking");
  };

  const handleBookingConfirm = async () => {
    await bookingActions.confirmBooking();
    setShowBookingFlow(false);
    setActiveTab("overview");
    onBookSession(bookingState.sessionType);
  };

  const handleBookingCancel = () => {
    setShowBookingFlow(false);
    bookingActions.resetBooking();
    setActiveTab("overview");
  };

  // Generate mock available dates if none provided
  const mockAvailableDates =
    availableDates.length > 0
      ? availableDates
      : [
          {
            date: new Date(),
            timeSlots: [
              {
                id: "1",
                startTime: "09:00",
                endTime: "10:00",
                available: true,
                price: mentor.hourlyRate,
                currency: mentor.currency,
              },
              {
                id: "2",
                startTime: "10:00",
                endTime: "11:00",
                available: true,
                price: mentor.hourlyRate,
                currency: mentor.currency,
              },
              {
                id: "3",
                startTime: "14:00",
                endTime: "15:00",
                available: true,
                price: mentor.hourlyRate,
                currency: mentor.currency,
              },
              {
                id: "4",
                startTime: "15:00",
                endTime: "16:00",
                available: false,
                price: mentor.hourlyRate,
                currency: mentor.currency,
              },
            ],
            isAvailable: true,
          },
          {
            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            timeSlots: [
              {
                id: "5",
                startTime: "11:00",
                endTime: "12:00",
                available: true,
                price: mentor.hourlyRate,
                currency: mentor.currency,
              },
              {
                id: "6",
                startTime: "16:00",
                endTime: "17:00",
                available: true,
                price: mentor.hourlyRate,
                currency: mentor.currency,
              },
            ],
            isAvailable: true,
          },
        ];

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {mentor.location || "Remote"}
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white",
                  getAvailabilityColor(mentor.availability)
                )}
              >
                <div className="w-2 h-2 rounded-full bg-current" />
                {mentor.availability}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <Avatar className="w-24 h-24 ring-4 ring-background">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white font-semibold text-2xl">
                        {getInitials(mentor.name)}
                      </AvatarFallback>
                    </Avatar>
                    {mentor.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                        <CheckCircle className="w-6 h-6 text-indigo-500" />
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-foreground">
                          {mentor.name}
                        </h1>
                        {mentor.featured && (
                          <Badge className="bg-linear-to-r from-indigo-500 to-purple-600 text-white border-0">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-xl text-muted-foreground mb-2">
                        {mentor.title}
                      </p>
                      {mentor.company && (
                        <p className="text-sm text-muted-foreground">
                          at {mentor.company}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {mentor.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {mentor.reviewCount} reviews
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {mentor.totalSessions}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Sessions
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {mentor.experience}y
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Experience
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            ${mentor.hourlyRate}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          per hour
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => handleBookClick("1-on-1")}
                        className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book 1-on-1 Session
                      </Button>
                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="expertise">Expertise</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="booking">Book Session</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Bio */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">About</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {mentor.bio}
                    </p>
                  </CardContent>
                </Card>

                {/* Education & Certifications */}
                {(mentor.education?.length ||
                  mentor.certifications?.length) && (
                  <Card>
                    <CardHeader>
                      <h3 className="text-lg font-semibold">Credentials</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mentor.education?.map((edu, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{edu}</p>
                            <p className="text-sm text-muted-foreground">
                              Education
                            </p>
                          </div>
                        </div>
                      ))}
                      {mentor.certifications?.map((cert, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{cert}</p>
                            <p className="text-sm text-muted-foreground">
                              Certification
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="expertise" className="space-y-6">
                {/* Skills */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Skills & Expertise
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mentor.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Categories</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {mentor.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="capitalize"
                        >
                          {category.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {/* Reviews */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">
                      Reviews ({reviews.length})
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.slice(0, 5).map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-border/50 last:border-0 pb-4 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {review.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {review.userName}
                                </span>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "w-3 h-3",
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {review.comment}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {review.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No reviews yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="booking" className="space-y-6">
                {showBookingFlow ? (
                  <BookingConfirmation
                    mentor={mentor}
                    selectedDate={bookingState.selectedDate}
                    selectedTimeSlot={bookingState.selectedTimeSlot}
                    sessionType={bookingState.sessionType}
                    duration={bookingState.duration}
                    onConfirm={handleBookingConfirm}
                    onCancel={handleBookingCancel}
                    isLoading={bookingState.isLoading}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Session Types */}
                    <Card>
                      <CardHeader>
                        <h3 className="text-lg font-semibold">
                          Choose Session Type
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-start gap-2 hover:border-indigo-500/50"
                            onClick={() => handleBookClick("1-on-1")}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Users className="w-5 h-5 text-indigo-500" />
                              <span className="font-medium">
                                1-on-1 Session
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground text-left">
                              Personal mentoring session tailored to your needs
                            </p>
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <DollarSign className="w-3 h-3" />$
                              {mentor.hourlyRate}/hour
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-start gap-2 hover:border-purple-500/50"
                            onClick={() => handleBookClick("group")}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Users className="w-5 h-5 text-purple-500" />
                              <span className="font-medium">Group Session</span>
                            </div>
                            <p className="text-sm text-muted-foreground text-left">
                              Learn with a small group of peers
                            </p>
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <DollarSign className="w-3 h-3" />$
                              {(mentor.hourlyRate * 0.7).toFixed(0)}/person
                            </div>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="space-y-6">
            {/* Quick Book */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <h3 className="text-lg font-semibold">Quick Book</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule a session with {mentor.name.split(" ")[0]}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleBookClick("1-on-1")}
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book 1-on-1 Session
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span className="font-medium">
                      ${mentor.hourlyRate}/hour
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Response time:
                    </span>
                    <span className="font-medium">{mentor.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Success rate:</span>
                    <span className="font-medium text-green-600">
                      {mentor.successRate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Availability</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Available now</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Typically responds {mentor.responseTime}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Languages</h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.languages.map((language) => (
                    <Badge key={language} variant="secondary">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
