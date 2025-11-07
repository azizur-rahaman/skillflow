/**
 * Activity Timeline Types
 * Chronological event tracking with expandable details and categorization
 */

export type ActivityType =
  | "skill-acquired"
  | "course-completed"
  | "assessment-passed"
  | "credential-earned"
  | "job-applied"
  | "profile-updated"
  | "connection-made"
  | "achievement-unlocked"
  | "learning-path-started"
  | "marketplace-purchase"
  | "system-notification"
  | "security-event"
  | "wallet-transaction"
  | "gamification-event";

export type ActivityCategory =
  | "learning"
  | "career"
  | "social"
  | "achievement"
  | "system"
  | "financial"
  | "security";

export type ActivityPriority = "low" | "medium" | "high" | "urgent";

export interface ActivityAction {
  id: string;
  label: string;
  action: string;
  primary?: boolean;
  icon?: string;
}

export interface ActivityMetadata {
  skillName?: string;
  courseTitle?: string;
  assessmentScore?: number;
  credentialId?: string;
  jobTitle?: string;
  companyName?: string;
  connectionName?: string;
  achievementName?: string;
  learningPathName?: string;
  itemName?: string;
  amount?: number;
  currency?: string;
  transactionId?: string;
  ipAddress?: string;
  deviceInfo?: string;
  [key: string]: unknown;
}

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  category: ActivityCategory;
  title: string;
  description: string;
  timestamp: Date;
  priority: ActivityPriority;
  icon?: string;
  color?: string;
  metadata?: ActivityMetadata;
  actions?: ActivityAction[];
  isExpanded?: boolean;
  userId?: string;
  relatedEntityId?: string;
  tags?: string[];
}

export interface ActivityGroup {
  date: string; // YYYY-MM-DD format
  dateLabel: string; // "Today", "Yesterday", "2 days ago", etc.
  events: ActivityEvent[];
  totalCount: number;
}

export interface ActivityFilters {
  types: Record<ActivityType, boolean>;
  categories: Record<ActivityCategory, boolean>;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: ActivityPriority[];
  search?: string;
}

export interface ActivityTimelineState {
  events: ActivityEvent[];
  groups: ActivityGroup[];
  filters: ActivityFilters;
  loading: boolean;
  error: string | null;
  selectedEvent: ActivityEvent | null;
  isDetailModalOpen: boolean;
  currentPage: number;
  hasMore: boolean;
}

export interface ActivityTimelineContextType {
  state: ActivityTimelineState;
  actions: {
    loadActivities: (page?: number) => Promise<void>;
    loadMoreActivities: () => Promise<void>;
    setFilters: (filters: Partial<ActivityFilters>) => void;
    clearFilters: () => void;
    toggleEventExpansion: (eventId: string) => void;
    selectEvent: (event: ActivityEvent | null) => void;
    openDetailModal: (event: ActivityEvent) => void;
    closeDetailModal: () => void;
    executeAction: (eventId: string, actionId: string) => Promise<void>;
    searchActivities: (query: string) => void;
    refreshActivities: () => Promise<void>;
  };
}

export interface ActivityCardProps {
  event: ActivityEvent;
  onExpand?: (eventId: string) => void;
  onAction?: (event: ActivityEvent, actionId: string) => void;
  onClick?: (event: ActivityEvent) => void;
  className?: string;
}

export interface ActivityDetailModalProps {
  event: ActivityEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (event: ActivityEvent, actionId: string) => void;
}

export interface ActivityTimelineProps {
  className?: string;
  maxHeight?: string;
  showFilters?: boolean;
  enableInfiniteScroll?: boolean;
  onEventClick?: (event: ActivityEvent) => void;
}
