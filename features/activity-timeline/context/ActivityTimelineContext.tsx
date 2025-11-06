import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import {
  ActivityTimelineState,
  ActivityTimelineContextType,
  ActivityEvent,
  ActivityGroup,
  ActivityFilters,
  ActivityType,
  ActivityCategory,
  ActivityPriority,
} from "../types";

// Action types
type ActivityAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_EVENTS"; payload: ActivityEvent[] }
  | { type: "SET_GROUPS"; payload: ActivityGroup[] }
  | { type: "APPEND_EVENTS"; payload: ActivityEvent[] }
  | { type: "SET_FILTERS"; payload: Partial<ActivityFilters> }
  | { type: "CLEAR_FILTERS" }
  | { type: "TOGGLE_EVENT_EXPANSION"; payload: string }
  | { type: "SELECT_EVENT"; payload: ActivityEvent | null }
  | { type: "SET_DETAIL_MODAL"; payload: boolean }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_HAS_MORE"; payload: boolean };

// Mock data generators
const generateMockActivities = (count: number = 50): ActivityEvent[] => {
  const activityTemplates: Array<{
    type: ActivityType;
    category: ActivityCategory;
    title: string;
    description: string;
    priority: ActivityPriority;
    metadata?: Record<string, unknown>;
  }> = [
    {
      type: "skill-acquired",
      category: "learning",
      title: "New Skill Acquired",
      description: "You've successfully acquired the React Development skill",
      priority: "medium",
      metadata: { skillName: "React Development" },
    },
    {
      type: "course-completed",
      category: "learning",
      title: "Course Completed",
      description: "Congratulations on completing Advanced TypeScript Patterns",
      priority: "high",
      metadata: { courseTitle: "Advanced TypeScript Patterns" },
    },
    {
      type: "assessment-passed",
      category: "learning",
      title: "Assessment Passed",
      description:
        "You passed the Machine Learning Fundamentals assessment with 95%",
      priority: "high",
      metadata: { assessmentScore: 95 },
    },
    {
      type: "credential-earned",
      category: "achievement",
      title: "Credential Earned",
      description: "You've earned the AWS Solutions Architect certification",
      priority: "high",
      metadata: { credentialId: "aws-sa-001" },
    },
    {
      type: "job-applied",
      category: "career",
      title: "Job Application Submitted",
      description:
        "Your application for Senior Frontend Developer at TechCorp has been submitted",
      priority: "medium",
      metadata: {
        jobTitle: "Senior Frontend Developer",
        companyName: "TechCorp",
      },
    },
    {
      type: "connection-made",
      category: "social",
      title: "New Connection",
      description: "You are now connected with Sarah Johnson",
      priority: "low",
      metadata: { connectionName: "Sarah Johnson" },
    },
    {
      type: "achievement-unlocked",
      category: "achievement",
      title: "Achievement Unlocked",
      description: 'You\'ve unlocked the "Learning Champion" achievement',
      priority: "medium",
      metadata: { achievementName: "Learning Champion" },
    },
    {
      type: "wallet-transaction",
      category: "financial",
      title: "Token Transaction",
      description: "You received 500 SKILL tokens for completing a course",
      priority: "medium",
      metadata: { amount: 500, currency: "SKILL", transactionId: "tx_123456" },
    },
    {
      type: "system-notification",
      category: "system",
      title: "System Update",
      description: "SkillFlow platform has been updated with new features",
      priority: "low",
    },
    {
      type: "security-event",
      category: "security",
      title: "Security Alert",
      description: "New device login detected from Chrome on Windows",
      priority: "urgent",
      metadata: { ipAddress: "192.168.1.1", deviceInfo: "Chrome on Windows" },
    },
  ];

  const activities: ActivityEvent[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const template =
      activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
    const timestamp = new Date(
      now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ); // Random date within last 30 days

    activities.push({
      id: `activity_${i + 1}`,
      type: template.type,
      category: template.category,
      title: template.title,
      description: template.description,
      timestamp,
      priority: template.priority,
      metadata: template.metadata,
      isExpanded: false,
      userId: "user_123",
      tags: ["featured"],
    });
  }

  return activities.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
};

const groupActivitiesByDate = (
  activities: ActivityEvent[]
): ActivityGroup[] => {
  const groups: Record<string, ActivityEvent[]> = {};

  activities.forEach((activity) => {
    const dateKey = activity.timestamp.toISOString().split("T")[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(activity);
  });

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return Object.entries(groups)
    .map(([date, events]) => {
      let dateLabel: string;
      if (date === today) {
        dateLabel = "Today";
      } else if (date === yesterday) {
        dateLabel = "Yesterday";
      } else {
        const diffTime = now.getTime() - new Date(date).getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        dateLabel = diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
      }

      return {
        date,
        dateLabel,
        events: events.sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        ),
        totalCount: events.length,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
};

// Initial state
const initialState: ActivityTimelineState = {
  events: [],
  groups: [],
  filters: {
    types: {
      "skill-acquired": true,
      "course-completed": true,
      "assessment-passed": true,
      "credential-earned": true,
      "job-applied": true,
      "profile-updated": true,
      "connection-made": true,
      "achievement-unlocked": true,
      "learning-path-started": true,
      "marketplace-purchase": true,
      "system-notification": true,
      "security-event": true,
      "wallet-transaction": true,
      "gamification-event": true,
    },
    categories: {
      learning: true,
      career: true,
      social: true,
      achievement: true,
      system: true,
      financial: true,
      security: true,
    },
  },
  loading: false,
  error: null,
  selectedEvent: null,
  isDetailModalOpen: false,
  currentPage: 1,
  hasMore: true,
};

// Reducer
function activityReducer(
  state: ActivityTimelineState,
  action: ActivityAction
): ActivityTimelineState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_EVENTS":
      const groups = groupActivitiesByDate(action.payload);
      return {
        ...state,
        events: action.payload,
        groups,
        loading: false,
      };

    case "SET_GROUPS":
      return { ...state, groups: action.payload };

    case "APPEND_EVENTS":
      const allEvents = [...state.events, ...action.payload];
      const updatedGroups = groupActivitiesByDate(allEvents);
      return {
        ...state,
        events: allEvents,
        groups: updatedGroups,
        loading: false,
      };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          types: Object.keys(state.filters.types).reduce(
            (acc, key) => ({
              ...acc,
              [key]: true,
            }),
            {} as Record<ActivityType, boolean>
          ),
          categories: Object.keys(state.filters.categories).reduce(
            (acc, key) => ({
              ...acc,
              [key]: true,
            }),
            {} as Record<ActivityCategory, boolean>
          ),
        },
      };

    case "TOGGLE_EVENT_EXPANSION":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload
            ? { ...event, isExpanded: !event.isExpanded }
            : event
        ),
      };

    case "SELECT_EVENT":
      return { ...state, selectedEvent: action.payload };

    case "SET_DETAIL_MODAL":
      return { ...state, isDetailModalOpen: action.payload };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_HAS_MORE":
      return { ...state, hasMore: action.payload };

    default:
      return state;
  }
}

// Context
const ActivityTimelineContext = createContext<
  ActivityTimelineContextType | undefined
>(undefined);

// Provider component
interface ActivityTimelineProviderProps {
  children: ReactNode;
}

export const ActivityTimelineProvider: React.FC<
  ActivityTimelineProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(activityReducer, initialState);

  const loadActivities = useCallback(async (page: number = 1) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockActivities = generateMockActivities(20);
      dispatch({ type: "SET_EVENTS", payload: mockActivities });
      dispatch({ type: "SET_CURRENT_PAGE", payload: page });
      dispatch({ type: "SET_HAS_MORE", payload: page < 5 }); // Simulate pagination
    } catch (error) {
      console.error("Failed to load activities:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load activities" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadMoreActivities = useCallback(async () => {
    if (!state.hasMore || state.loading) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newActivities = generateMockActivities(10);
      dispatch({ type: "APPEND_EVENTS", payload: newActivities });
      dispatch({ type: "SET_CURRENT_PAGE", payload: state.currentPage + 1 });
      dispatch({ type: "SET_HAS_MORE", payload: state.currentPage + 1 < 5 });
    } catch (error) {
      console.error("Failed to load more activities:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to load more activities",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.hasMore, state.loading, state.currentPage]);

  const setFilters = useCallback((filters: Partial<ActivityFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: "CLEAR_FILTERS" });
  }, []);

  const toggleEventExpansion = useCallback((eventId: string) => {
    dispatch({ type: "TOGGLE_EVENT_EXPANSION", payload: eventId });
  }, []);

  const selectEvent = useCallback((event: ActivityEvent | null) => {
    dispatch({ type: "SELECT_EVENT", payload: event });
  }, []);

  const openDetailModal = useCallback((event: ActivityEvent) => {
    dispatch({ type: "SELECT_EVENT", payload: event });
    dispatch({ type: "SET_DETAIL_MODAL", payload: true });
  }, []);

  const closeDetailModal = useCallback(() => {
    dispatch({ type: "SET_DETAIL_MODAL", payload: false });
    dispatch({ type: "SELECT_EVENT", payload: null });
  }, []);

  const executeAction = useCallback(
    async (eventId: string, actionId: string) => {
      // Simulate API call for action execution
      console.log(`Executing action ${actionId} for event ${eventId}`);
      // In a real app, this would make an API call
    },
    []
  );

  const searchActivities = useCallback((query: string) => {
    dispatch({ type: "SET_FILTERS", payload: { search: query } });
  }, []);

  const refreshActivities = useCallback(async () => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
    dispatch({ type: "SET_HAS_MORE", payload: true });
    await loadActivities(1);
  }, [loadActivities]);

  const contextValue: ActivityTimelineContextType = {
    state,
    actions: {
      loadActivities,
      loadMoreActivities,
      setFilters,
      clearFilters,
      toggleEventExpansion,
      selectEvent,
      openDetailModal,
      closeDetailModal,
      executeAction,
      searchActivities,
      refreshActivities,
    },
  };

  return (
    <ActivityTimelineContext.Provider value={contextValue}>
      {children}
    </ActivityTimelineContext.Provider>
  );
};

// Hook
export const useActivityTimeline = (): ActivityTimelineContextType => {
  const context = useContext(ActivityTimelineContext);
  if (context === undefined) {
    throw new Error(
      "useActivityTimeline must be used within an ActivityTimelineProvider"
    );
  }
  return context;
};
