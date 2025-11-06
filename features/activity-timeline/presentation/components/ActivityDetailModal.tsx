import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Award,
  CheckCircle,
  Briefcase,
  User,
  Trophy,
  TrendingUp,
  Shield,
  Wallet,
  Zap,
  Settings,
  Clock,
  ExternalLink,
  Eye,
} from "lucide-react";
import { ActivityDetailModalProps, ActivityType } from "../../types";
import { cn } from "@/lib/utils";

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "skill-acquired":
      return <TrendingUp className="h-6 w-6" />;
    case "course-completed":
      return <BookOpen className="h-6 w-6" />;
    case "assessment-passed":
      return <CheckCircle className="h-6 w-6" />;
    case "credential-earned":
      return <Award className="h-6 w-6" />;
    case "job-applied":
      return <Briefcase className="h-6 w-6" />;
    case "profile-updated":
      return <User className="h-6 w-6" />;
    case "connection-made":
      return <User className="h-6 w-6" />;
    case "achievement-unlocked":
      return <Trophy className="h-6 w-6" />;
    case "learning-path-started":
      return <BookOpen className="h-6 w-6" />;
    case "marketplace-purchase":
      return <Wallet className="h-6 w-6" />;
    case "system-notification":
      return <Settings className="h-6 w-6" />;
    case "security-event":
      return <Shield className="h-6 w-6" />;
    case "wallet-transaction":
      return <Wallet className="h-6 w-6" />;
    case "gamification-event":
      return <Zap className="h-6 w-6" />;
    default:
      return <Clock className="h-6 w-6" />;
  }
};

const getActivityColor = (type: ActivityType) => {
  switch (type) {
    case "skill-acquired":
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    case "course-completed":
      return "text-green-400 bg-green-500/10 border-green-500/20";
    case "assessment-passed":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "credential-earned":
      return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    case "job-applied":
      return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
    case "profile-updated":
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    case "connection-made":
      return "text-pink-400 bg-pink-500/10 border-pink-500/20";
    case "achievement-unlocked":
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "learning-path-started":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "marketplace-purchase":
      return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    case "system-notification":
      return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    case "security-event":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    case "wallet-transaction":
      return "text-teal-400 bg-teal-500/10 border-teal-500/20";
    case "gamification-event":
      return "text-violet-400 bg-violet-500/10 border-violet-500/20";
    default:
      return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
};

const formatDetailedTimestamp = (timestamp: Date) => {
  return timestamp.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onAction,
}) => {
  if (!event) return null;

  const handleAction = (actionId: string) => {
    if (onAction) {
      onAction(event, actionId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl border",
                getActivityColor(event.type)
              )}
            >
              {getActivityIcon(event.type)}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">
                {event.title}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                {event.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Type
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {event.type.replace("-", " ")}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Priority
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    event.priority === "urgent" ? "destructive" : "secondary"
                  }
                  className="capitalize"
                >
                  {event.priority}
                </Badge>
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                Timestamp
              </label>
              <p className="text-sm mt-1 font-mono">
                {formatDetailedTimestamp(event.timestamp)}
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Detailed Metadata */}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(event.metadata).map(([key, value]) => (
                  <div key={key} className="bg-muted/50 rounded-lg p-3">
                    <label className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </label>
                    <p className="text-sm font-semibold mt-1 overflow-wrap-anywhere">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {event.actions && event.actions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                {event.actions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.primary ? "default" : "outline"}
                    onClick={() => handleAction(action.id)}
                    className="flex items-center gap-2"
                  >
                    {action.icon === "external-link" && (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    {action.icon === "eye" && <Eye className="h-4 w-4" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
