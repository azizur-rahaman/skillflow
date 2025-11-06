/**
 * Mentor Marketplace Context
 * State management for mentor marketplace functionality
 */

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  MentorMarketplaceState,
  MentorMarketplaceContextType,
  MentorProfile,
  MentorFilters,
  MentorReview,
  BookingSession,
  SessionType,
  MentorCategory,
} from "../types";

// Mock data generators
const generateMockMentors = (): MentorProfile[] => [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior Software Engineer at Google",
    avatar: "/avatars/sarah-chen.jpg",
    bio: "10+ years in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about mentoring junior developers.",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 120,
    currency: "USD",
    expertise: ["React", "Node.js", "TypeScript", "AWS", "System Design"],
    categories: ["technology", "engineering"],
    languages: ["English", "Mandarin"],
    experience: 10,
    company: "Google",
    education: ["Stanford University - Computer Science"],
    certifications: [
      "AWS Certified Solutions Architect",
      "Google Cloud Professional",
    ],
    skills: [
      "React",
      "Node.js",
      "TypeScript",
      "Python",
      "AWS",
      "Docker",
      "Kubernetes",
    ],
    availability: "available",
    responseTime: "within 2 hours",
    totalSessions: 156,
    successRate: 98,
    verified: true,
    featured: true,
    location: "San Francisco, CA",
    timezone: "PST",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    title: "Product Manager at Meta",
    avatar: "/avatars/marcus-rodriguez.jpg",
    bio: "Former startup founder turned PM at Meta. Expert in product strategy, user research, and agile methodologies.",
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 150,
    currency: "USD",
    expertise: ["Product Strategy", "User Research", "Agile", "Data Analysis"],
    categories: ["business", "technology"],
    languages: ["English", "Spanish"],
    experience: 8,
    company: "Meta",
    education: ["MIT - Business Administration"],
    skills: ["Product Management", "SQL", "Figma", "Jira", "Google Analytics"],
    availability: "available",
    responseTime: "within 4 hours",
    totalSessions: 134,
    successRate: 96,
    verified: true,
    featured: false,
    location: "Menlo Park, CA",
    timezone: "PST",
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    title: "Data Science Lead at Netflix",
    avatar: "/avatars/emily-watson.jpg",
    bio: "PhD in Statistics, leading data science initiatives at Netflix. Specializes in machine learning, A/B testing, and recommendation systems.",
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 180,
    currency: "USD",
    expertise: ["Machine Learning", "Python", "Statistics", "A/B Testing"],
    categories: ["data-science", "technology"],
    languages: ["English"],
    experience: 12,
    company: "Netflix",
    education: ["Stanford University - Statistics PhD"],
    certifications: ["TensorFlow Developer Certificate"],
    skills: ["Python", "R", "TensorFlow", "PyTorch", "SQL", "Spark"],
    availability: "busy",
    responseTime: "within 6 hours",
    totalSessions: 278,
    successRate: 97,
    verified: true,
    featured: true,
    location: "Los Gatos, CA",
    timezone: "PST",
  },
  {
    id: "4",
    name: "Alex Thompson",
    title: "UX Designer at Airbnb",
    avatar: "/avatars/alex-thompson.jpg",
    bio: "Creative UX designer with a passion for user-centered design. 7+ years creating intuitive experiences for millions of users.",
    rating: 4.7,
    reviewCount: 76,
    hourlyRate: 110,
    currency: "USD",
    expertise: ["UX Design", "User Research", "Prototyping", "Design Systems"],
    categories: ["design"],
    languages: ["English"],
    experience: 7,
    company: "Airbnb",
    education: ["Rhode Island School of Design - Graphic Design"],
    skills: [
      "Figma",
      "Sketch",
      "InVision",
      "Adobe Creative Suite",
      "Principle",
    ],
    availability: "available",
    responseTime: "within 3 hours",
    totalSessions: 98,
    successRate: 95,
    verified: true,
    featured: false,
    location: "San Francisco, CA",
    timezone: "PST",
  },
  {
    id: "5",
    name: "David Kim",
    title: "Marketing Director at Spotify",
    avatar: "/avatars/david-kim.jpg",
    bio: "Digital marketing expert specializing in growth hacking, content strategy, and performance marketing across global markets.",
    rating: 4.6,
    reviewCount: 145,
    hourlyRate: 130,
    currency: "USD",
    expertise: [
      "Digital Marketing",
      "Growth Hacking",
      "Content Strategy",
      "Analytics",
    ],
    categories: ["marketing", "business"],
    languages: ["English", "Korean"],
    experience: 9,
    company: "Spotify",
    education: ["Harvard Business School - MBA"],
    skills: [
      "Google Analytics",
      "Facebook Ads",
      "SEO",
      "Content Marketing",
      "SQL",
    ],
    availability: "available",
    responseTime: "within 5 hours",
    totalSessions: 167,
    successRate: 94,
    verified: true,
    featured: false,
    location: "New York, NY",
    timezone: "EST",
  },
  {
    id: "6",
    name: "Lisa Park",
    title: "Financial Analyst at Goldman Sachs",
    avatar: "/avatars/lisa-park.jpg",
    bio: "CFA charterholder with expertise in investment analysis, financial modeling, and risk management. Former hedge fund analyst.",
    rating: 4.8,
    reviewCount: 112,
    hourlyRate: 160,
    currency: "USD",
    expertise: [
      "Financial Analysis",
      "Investment Banking",
      "Risk Management",
      "Financial Modeling",
    ],
    categories: ["finance"],
    languages: ["English", "Korean"],
    experience: 11,
    company: "Goldman Sachs",
    education: ["University of Pennsylvania - Finance", "CFA Charterholder"],
    certifications: ["CFA", "FRM"],
    skills: ["Excel", "Python", "Bloomberg", "Financial Modeling", "Valuation"],
    availability: "offline",
    responseTime: "within 12 hours",
    totalSessions: 189,
    successRate: 96,
    verified: true,
    featured: false,
    location: "New York, NY",
    timezone: "EST",
  },
];

const generateMockReviews = (mentorId: string): MentorReview[] => [
  {
    id: "1",
    mentorId,
    userId: "user1",
    userName: "John Developer",
    rating: 5,
    comment:
      "Sarah was incredibly helpful in explaining complex React concepts. Her code examples were clear and practical.",
    sessionType: "1-on-1",
    createdAt: new Date("2024-01-15"),
    helpful: 12,
  },
  {
    id: "2",
    mentorId,
    userId: "user2",
    userName: "Maria Engineer",
    rating: 5,
    comment:
      "Great session on system design patterns. Sarah has deep knowledge and explains things very well.",
    sessionType: "1-on-1",
    createdAt: new Date("2024-01-10"),
    helpful: 8,
  },
];

// Initial state
const initialState: MentorMarketplaceState = {
  mentors: [],
  filteredMentors: [],
  filters: {
    categories: {} as Record<MentorCategory, boolean>,
    languages: {} as Record<string, boolean>,
    priceRange: { min: 0, max: 500 },
    rating: 0,
    availability: [],
    experience: { min: 0, max: 50 },
    verified: false,
    search: "",
  },
  selectedMentor: null,
  reviews: [],
  bookings: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  sortBy: "rating",
  viewMode: "grid",
};

// Action types
type MentorMarketplaceAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "LOAD_MENTORS_SUCCESS";
      payload: { mentors: MentorProfile[]; hasMore: boolean };
    }
  | { type: "SET_FILTERS"; payload: Partial<MentorFilters> }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_FILTERED_MENTORS"; payload: MentorProfile[] }
  | { type: "SELECT_MENTOR"; payload: MentorProfile | null }
  | { type: "LOAD_REVIEWS_SUCCESS"; payload: MentorReview[] }
  | { type: "ADD_BOOKING"; payload: BookingSession }
  | { type: "SET_SORT_BY"; payload: MentorMarketplaceState["sortBy"] }
  | { type: "SET_VIEW_MODE"; payload: MentorMarketplaceState["viewMode"] }
  | { type: "SET_CURRENT_PAGE"; payload: number };

// Reducer
const mentorMarketplaceReducer = (
  state: MentorMarketplaceState,
  action: MentorMarketplaceAction
): MentorMarketplaceState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "LOAD_MENTORS_SUCCESS":
      return {
        ...state,
        mentors: action.payload.mentors,
        filteredMentors: action.payload.mentors,
        loading: false,
        hasMore: action.payload.hasMore,
      };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          categories: {} as Record<MentorCategory, boolean>,
          languages: {} as Record<string, boolean>,
          priceRange: { min: 0, max: 500 },
          rating: 0,
          availability: [],
          experience: { min: 0, max: 50 },
          verified: false,
          search: "",
        },
      };

    case "SET_FILTERED_MENTORS":
      return { ...state, filteredMentors: action.payload };

    case "SELECT_MENTOR":
      return { ...state, selectedMentor: action.payload };

    case "LOAD_REVIEWS_SUCCESS":
      return { ...state, reviews: action.payload };

    case "ADD_BOOKING":
      return { ...state, bookings: [...state.bookings, action.payload] };

    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    default:
      return state;
  }
};

// Context
const MentorMarketplaceContext = createContext<
  MentorMarketplaceContextType | undefined
>(undefined);

// Provider component
interface MentorMarketplaceProviderProps {
  children: ReactNode;
}

export const MentorMarketplaceProvider: React.FC<
  MentorMarketplaceProviderProps
> = ({ children }) => {
  const [state, dispatch] = useReducer(mentorMarketplaceReducer, initialState);

  // Helper functions
  const applyFilters = (
    mentors: MentorProfile[],
    filters: MentorFilters
  ): MentorProfile[] => {
    return mentors.filter((mentor) => {
      // Category filter
      const categoryKeys = Object.keys(filters.categories).filter(
        (key) => filters.categories[key as MentorCategory]
      );
      if (
        categoryKeys.length > 0 &&
        !mentor.categories.some((cat) => categoryKeys.includes(cat))
      ) {
        return false;
      }

      // Language filter
      const languageKeys = Object.keys(filters.languages).filter(
        (key) => filters.languages[key]
      );
      if (
        languageKeys.length > 0 &&
        !mentor.languages.some((lang) => languageKeys.includes(lang))
      ) {
        return false;
      }

      // Price range filter
      if (
        mentor.hourlyRate < filters.priceRange.min ||
        mentor.hourlyRate > filters.priceRange.max
      ) {
        return false;
      }

      // Rating filter
      if (mentor.rating < filters.rating) {
        return false;
      }

      // Availability filter
      if (
        filters.availability.length > 0 &&
        !filters.availability.includes(mentor.availability)
      ) {
        return false;
      }

      // Experience filter
      if (
        mentor.experience < filters.experience.min ||
        mentor.experience > filters.experience.max
      ) {
        return false;
      }

      // Verified filter
      if (filters.verified && !mentor.verified) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          mentor.name.toLowerCase().includes(searchLower) ||
          mentor.title.toLowerCase().includes(searchLower) ||
          mentor.bio.toLowerCase().includes(searchLower) ||
          mentor.expertise.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          ) ||
          mentor.skills.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          );

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  };

  const applySorting = (
    mentors: MentorProfile[],
    sortBy: MentorMarketplaceState["sortBy"]
  ): MentorProfile[] => {
    return [...mentors].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.hourlyRate - b.hourlyRate;
        case "price-high":
          return b.hourlyRate - a.hourlyRate;
        case "experience":
          return b.experience - a.experience;
        case "popularity":
          return b.totalSessions - a.totalSessions;
        default:
          return 0;
      }
    });
  };

  // Actions
  const actions = {
    loadMentors: async (page = 1) => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mentors = generateMockMentors();
        const hasMore = page < 3; // Simulate pagination

        dispatch({
          type: "LOAD_MENTORS_SUCCESS",
          payload: { mentors, hasMore },
        });
        dispatch({ type: "SET_CURRENT_PAGE", payload: page });
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to load mentors" });
      }
    },

    loadMoreMentors: async () => {
      if (!state.hasMore || state.loading) return;

      const nextPage = state.currentPage + 1;
      await actions.loadMentors(nextPage);
    },

    setFilters: (newFilters: Partial<MentorFilters>) => {
      dispatch({ type: "SET_FILTERS", payload: newFilters });

      // Apply filters and sorting
      const filtered = applyFilters(state.mentors, {
        ...state.filters,
        ...newFilters,
      });
      const sorted = applySorting(filtered, state.sortBy);

      dispatch({ type: "SET_FILTERED_MENTORS", payload: sorted });
    },

    clearFilters: () => {
      dispatch({ type: "CLEAR_FILTERS" });
      const sorted = applySorting(state.mentors, state.sortBy);
      dispatch({ type: "SET_FILTERED_MENTORS", payload: sorted });
    },

    searchMentors: (query: string) => {
      actions.setFilters({ search: query });
    },

    selectMentor: (mentor: MentorProfile | null) => {
      dispatch({ type: "SELECT_MENTOR", payload: mentor });
    },

    bookSession: async (
      mentorId: string,
      sessionType: SessionType,
      scheduledAt: Date,
      duration: number
    ) => {
      try {
        const mentor = state.mentors.find((m) => m.id === mentorId);
        if (!mentor) throw new Error("Mentor not found");

        const booking: BookingSession = {
          id: `booking-${Date.now()}`,
          mentorId,
          userId: "current-user", // In real app, get from auth context
          sessionType,
          scheduledAt,
          duration,
          price: mentor.hourlyRate * (duration / 60),
          currency: mentor.currency,
          status: "pending",
        };

        dispatch({ type: "ADD_BOOKING", payload: booking });

        // In real app, make API call to create booking
        console.log("Booking created:", booking);
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to book session" });
      }
    },

    loadMentorReviews: async (mentorId: string) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const reviews = generateMockReviews(mentorId);
        dispatch({ type: "LOAD_REVIEWS_SUCCESS", payload: reviews });
      } catch {
        dispatch({ type: "SET_ERROR", payload: "Failed to load reviews" });
      }
    },

    setSortBy: (sortBy: MentorMarketplaceState["sortBy"]) => {
      dispatch({ type: "SET_SORT_BY", payload: sortBy });
      const sorted = applySorting(state.filteredMentors, sortBy);
      dispatch({ type: "SET_FILTERED_MENTORS", payload: sorted });
    },

    setViewMode: (viewMode: MentorMarketplaceState["viewMode"]) => {
      dispatch({ type: "SET_VIEW_MODE", payload: viewMode });
    },

    refreshMentors: async () => {
      await actions.loadMentors(1);
    },
  };

  const contextValue: MentorMarketplaceContextType = {
    state,
    actions,
  };

  return (
    <MentorMarketplaceContext.Provider value={contextValue}>
      {children}
    </MentorMarketplaceContext.Provider>
  );
};

// Hook
export const useMentorMarketplace = (): MentorMarketplaceContextType => {
  const context = useContext(MentorMarketplaceContext);
  if (!context) {
    throw new Error(
      "useMentorMarketplace must be used within a MentorMarketplaceProvider"
    );
  }
  return context;
};
