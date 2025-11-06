/**
 * Create Feature Modal Component
 * Modal for submitting new feature requests with confetti celebration
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CreateFeatureModalProps } from "../../types";
import { cn } from "@/lib/utils";
import { Sparkles, X, Plus, Loader2 } from "lucide-react";

export const CreateFeatureModal: React.FC<CreateFeatureModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setTagInput("");
      setTags([]);
      setShowConfetti(false);
    }
  }, [isOpen]);

  // Show confetti on successful submission
  useEffect(() => {
    if (!isSubmitting && title && description) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, title, description]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      tags,
    });
  };

  const isFormValid = title.trim() && description.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-sm border-border/50 rounded-2xl">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "-10px",
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles
                  className={cn(
                    "w-4 h-4",
                    i % 4 === 0 && "text-yellow-400",
                    i % 4 === 1 && "text-pink-400",
                    i % 4 === 2 && "text-cyan-400",
                    i % 4 === 3 && "text-purple-400"
                  )}
                />
              </div>
            ))}
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            Suggest a New Feature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label
              htmlFor="feature-title"
              className="text-sm font-medium text-foreground"
            >
              Feature Title *
            </label>
            <Input
              id="feature-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief, descriptive title for your feature request"
              className="bg-background/50 border-border/50 rounded-xl"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/100
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label
              htmlFor="feature-description"
              className="text-sm font-medium text-foreground"
            >
              Description *
            </label>
            <Textarea
              id="feature-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your feature idea in detail. What problem does it solve? How would it work?"
              className="min-h-32 bg-background/50 border-border/50 rounded-xl resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {description.length}/1000
            </div>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Tags (Optional)
            </label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add relevant tags (e.g., mobile, ai, ui)"
                className="bg-background/50 border-border/50 rounded-xl"
                disabled={tags.length >= 5}
              />
              <Button
                onClick={handleAddTag}
                disabled={
                  !tagInput.trim() ||
                  tags.includes(tagInput.trim().toLowerCase()) ||
                  tags.length >= 5
                }
                variant="outline"
                className="rounded-xl border-border/50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Tags Display */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTag(tag)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Add up to 5 tags to help categorize your feature request
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-2">
              💡 Tips for Great Feature Requests
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be specific about what you want and why</li>
              <li>• Include examples or use cases</li>
              <li>• Consider how it benefits the community</li>
              <li>• Check if a similar request already exists</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border-border/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="bg-primary hover:bg-primary/90 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Submit Feature Request
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
