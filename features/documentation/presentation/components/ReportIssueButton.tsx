"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { IssueReport } from "../../types";
import { cn } from "@/lib/utils";

export function ReportIssueButton() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<IssueReport>({
    subject: "",
    description: "",
    category: "documentation",
    priority: "medium",
    email: "",
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would make an actual API call:
      // const response = await fetch('/api/support/report-issue', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setIsSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setFormData({
          subject: "",
          description: "",
          category: "documentation",
          priority: "medium",
          email: "",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        });
      }, 2000);
    } catch (error) {
      console.error("Error submitting issue:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof IssueReport, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl border-border hover:bg-muted hover:border-primary/50 transition-all"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Report Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-card border-border rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            Report an Issue
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Help us improve by reporting bugs, requesting features, or
            suggesting documentation updates.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto text-success mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Issue Submitted Successfully!
            </h3>
            <p className="text-sm text-muted-foreground">
              Thank you for your feedback. We&apos;ll review it shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="rounded-xl bg-input border-border"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-foreground"
              >
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  handleChange("category", value as IssueReport["category"])
                }
              >
                <SelectTrigger className="rounded-xl bg-input border-border">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="documentation">
                    Documentation Issue
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-sm font-medium text-foreground"
              >
                Priority *
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  handleChange("priority", value as IssueReport["priority"])
                }
              >
                <SelectTrigger className="rounded-xl bg-input border-border">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label
                htmlFor="subject"
                className="text-sm font-medium text-foreground"
              >
                Subject *
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Brief description of the issue"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                required
                className="rounded-xl bg-input border-border"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the issue..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
                rows={5}
                className="rounded-xl bg-input border-border resize-none"
              />
            </div>

            {/* Page URL (read-only) */}
            <div className="space-y-2">
              <Label
                htmlFor="pageUrl"
                className="text-sm font-medium text-foreground"
              >
                Current Page
              </Label>
              <Input
                id="pageUrl"
                type="text"
                value={formData.pageUrl}
                readOnly
                className="rounded-xl bg-muted border-border text-muted-foreground"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="flex-1 rounded-xl border-border"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "flex-1 rounded-xl bg-primary text-primary-foreground",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Issue
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
