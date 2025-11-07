/**
 * Feature Comments Modal Component
 * Modal for viewing and adding comments to feature requests
 */

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FeatureCommentsModalProps } from "../../types";
import { cn } from "@/lib/utils";
import { MessageCircle, ThumbsUp, Send, Loader2, User } from "lucide-react";

export const FeatureCommentsModal: React.FC<FeatureCommentsModalProps> = ({
  isOpen,
  onClose,
  feature,
  comments,
  onAddComment,
  onVoteComment,
  isSubmitting,
}) => {
  const [newComment, setNewComment] = useState("");

  if (!feature) return null;

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    await onAddComment(newComment.trim());
    setNewComment("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      Math.floor((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-sm border-border/50 rounded-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="w-5 h-5 text-primary" />
            Comments on &ldquo;{feature.title}&rdquo;
          </DialogTitle>
        </DialogHeader>

        {/* Feature Summary */}
        <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-foreground">{feature.title}</h3>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {feature.votes} votes
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {feature.description}
          </p>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-4 bg-muted/20 rounded-xl border border-border/30"
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage
                    src={comment?.author?.avatar}
                    alt={comment?.author?.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onVoteComment(comment.id)}
                      className={cn(
                        "h-8 px-2 text-xs hover:bg-primary/10",
                        comment.hasVoted
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {comment.votes}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment */}
        <div className="border-t border-border/50 pt-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts on this feature request..."
                className="min-h-20 bg-background/50 border-border/50 rounded-xl resize-none"
                maxLength={500}
              />

              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {newComment.length}/500
                </span>

                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
