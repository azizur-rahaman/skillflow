/**
 * Mentor Card Component
 * Displays individual mentor profile with booking CTA
 */

"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Clock,
  MapPin,
  CheckCircle,
  MessageCircle,
  Calendar,
  DollarSign,
  Users,
  Award,
} from "lucide-react";
import { MentorCardProps } from "../../types";
import { cn } from "@/lib/utils";

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  onBook,
  onViewProfile,
  className,
}) => {
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

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 border-border/50 bg-card/50 backdrop-blur-sm",
        mentor.featured && "ring-2 ring-indigo-500/20",
        className
      )}
    >
      {/* Featured Badge */}
      {mentor.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge
            variant="secondary"
            className="bg-linear-to-r from-indigo-500 to-purple-600 text-white border-0"
          >
            <Award className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Avatar with availability indicator */}
          <div className="relative">
            <Avatar className="w-16 h-16 ring-2 ring-background">
              <AvatarImage src={mentor.avatar} alt={mentor.name} />
              <AvatarFallback className="bg-linear-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                {getInitials(mentor.name)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                getAvailabilityColor(mentor.availability)
              )}
            />
          </div>

          {/* Mentor Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {mentor.name}
              </h3>
              {mentor.verified && (
                <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {mentor.title}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-sm">
                  {mentor.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({mentor.reviewCount} reviews)
              </span>
            </div>

            {/* Location */}
            {mentor.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span>{mentor.location}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {mentor.bio}
        </p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {mentor.expertise.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="text-xs px-2 py-0.5 bg-indigo-500/10 text-indigo-600 border-indigo-500/20 hover:bg-indigo-500/20"
            >
              {skill}
            </Badge>
          ))}
          {mentor.expertise.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{mentor.expertise.length - 3} more
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{mentor.totalSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{mentor.responseTime}</p>
              <p className="text-xs text-muted-foreground">Response</p>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {mentor.languages.map((language) => (
              <Badge
                key={language}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {language}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full">
          {/* Pricing */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-lg">
                ${mentor.hourlyRate}
              </span>
              <span className="text-sm text-muted-foreground">/hour</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {mentor.experience} years exp.
              </p>
              <p className="text-xs text-green-600 font-medium">
                {mentor.successRate}% success rate
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(mentor)}
              className="flex-1 hover:bg-indigo-500/10 hover:border-indigo-500/20"
            >
              View Profile
            </Button>
            <Button
              size="sm"
              onClick={() => onBook(mentor)}
              className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Book Now
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
