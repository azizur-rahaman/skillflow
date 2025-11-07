/**
 * Feature Card Component
 * Card displaying feature request with voting and interaction
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeatureCardProps } from "../../types";
import { StatusBadge } from "./StatusBadge";
import { VoteButton } from "./VoteButton";
import { cn } from "@/lib/utils";
import { MessageCircle, Calendar, Tag } from "lucide-react";

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onVote,
  onViewComments,
  className,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card
      className={cn(
        "bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl hover:bg-card/70 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Vote buttons */}
          <div className="flex flex-col items-center gap-2">
            <VoteButton
              featureId={feature.id}
              votes={feature.upvoteCount}
              isVoted={
                !!(feature.isVotedByUser && feature.userVoteType === "upvote")
              }
              voteType="upvote"
              onVote={onVote}
            />
            <VoteButton
              featureId={feature.id}
              votes={feature.downvoteCount}
              isVoted={
                !!(feature.isVotedByUser && feature.userVoteType === "downvote")
              }
              voteType="downvote"
              onVote={onVote}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
                {feature.title}
              </h3>
              <StatusBadge status={feature.status} />
            </div>

            <p className="text-muted-foreground text-sm line-clamp-3 mb-3 leading-relaxed">
              {feature.description}
            </p>

            {/* Tags */}
            {feature.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {feature.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {feature.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{feature.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Author and metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={feature.authorAvatar}
                    alt={feature.authorName}
                  />
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {getInitials(feature.authorName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {feature.authorName}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(feature.createdAt)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewComments(feature)}
                  className="h-auto p-1 text-muted-foreground hover:text-primary"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {feature.commentCount}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Footer with total votes */}
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total votes:</span>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {feature.votes}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewComments(feature)}
            className="text-xs rounded-xl border-border/50 hover:border-primary/50"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
