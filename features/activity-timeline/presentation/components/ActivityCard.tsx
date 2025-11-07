import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
} from "lucide-react";
import { ActivityType, ActivityPriority, ActivityCardProps } from "../../types";
import { cn } from "@/lib/utils";

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "skill-acquired":
      return <TrendingUp className="h-5 w-5" />;
    case "course-completed":
      return <BookOpen className="h-5 w-5" />;
    case "assessment-passed":
      return <CheckCircle className="h-5 w-5" />;
    case "credential-earned":
      return <Award className="h-5 w-5" />;
    case "job-applied":
      return <Briefcase className="h-5 w-5" />;
    case "profile-updated":
      return <User className="h-5 w-5" />;
    case "connection-made":
      return <User className="h-5 w-5" />;
    case "achievement-unlocked":
      return <Trophy className="h-5 w-5" />;
    case "learning-path-started":
      return <BookOpen className="h-5 w-5" />;
    case "marketplace-purchase":
      return <Wallet className="h-5 w-5" />;
    case "system-notification":
      return <Settings className="h-5 w-5" />;
    case "security-event":
      return <Shield className="h-5 w-5" />;
    case "wallet-transaction":
      return <Wallet className="h-5 w-5" />;
    case "gamification-event":
      return <Zap className="h-5 w-5" />;
    default:
      return <Clock className="h-5 w-5" />;
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

const getPriorityBadge = (priority: ActivityPriority) => {
  switch (priority) {
    case "urgent":
      return (
        <Badge variant="destructive" className="text-xs">
          Urgent
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="secondary"
          className="text-xs bg-red-500/20 text-red-400"
        >
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge
          variant="secondary"
          className="text-xs bg-yellow-500/20 text-yellow-400"
        >
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="text-xs">
          Low
        </Badge>
      );
    default:
      return null;
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return timestamp.toLocaleDateString();
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  event,
  onExpand,
  onAction,
  onClick,
  className,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(event);
    } else if (onExpand) {
      onExpand(event.id);
    }
  };

  const handleActionClick = (e: React.MouseEvent, actionId: string) => {
    e.stopPropagation();
    if (onAction) {
      onAction(event, actionId);
    }
  };

  return (
    <Card
      className={cn(
        "group relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 border-border/50",
        "bg-card/50 backdrop-blur-sm",
        getActivityColor(event.type),
        event.isExpanded && "ring-1 ring-primary/30",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Timeline dot and connector */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                getActivityColor(event.type),
                "group-hover:scale-110 group-hover:shadow-lg"
              )}
            >
              {getActivityIcon(event.type)}
            </div>
            {/* Timeline connector line */}
            <div className="w-px h-8 bg-border/30 mt-2" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  {getPriorityBadge(event.priority)}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                  {event.description}
                </p>

                {/* Metadata */}
                {event.metadata && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.metadata.skillName && (
                      <Badge variant="outline" className="text-xs">
                        {event.metadata.skillName}
                      </Badge>
                    )}
                    {event.metadata.courseTitle && (
                      <Badge variant="outline" className="text-xs">
                        {event.metadata.courseTitle}
                      </Badge>
                    )}
                    {event.metadata.assessmentScore && (
                      <Badge variant="outline" className="text-xs">
                        {event.metadata.assessmentScore}% Score
                      </Badge>
                    )}
                    {event.metadata.amount && (
                      <Badge variant="outline" className="text-xs">
                        +{event.metadata.amount} {event.metadata.currency}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Timestamp and actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(event.timestamp)}
                  </span>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {event.actions && event.actions.length > 0 && (
                      <div className="flex gap-1">
                        {event.actions.slice(0, 2).map((action) => (
                          <Button
                            key={action.id}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => handleActionClick(e, action.id)}
                          >
                            {action.icon === "external-link" && (
                              <ExternalLink className="h-3 w-3" />
                            )}
                            {action.icon === "eye" && (
                              <Eye className="h-3 w-3" />
                            )}
                            {!action.icon && action.label}
                          </Button>
                        ))}
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onExpand) onExpand(event.id);
                      }}
                    >
                      {event.isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded content */}
            {event.isExpanded && (
              <div className="mt-4 pt-4 border-t border-border/30 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-3">
                  {event.metadata && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                          </span>
                          <span className="text-foreground font-medium">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {event.actions && event.actions.length > 0 && (
                    <div className="flex gap-2 pt-2">
                      {event.actions.map((action) => (
                        <Button
                          key={action.id}
                          variant={action.primary ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={(e) => handleActionClick(e, action.id)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
