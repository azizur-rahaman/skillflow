/**
 * Mentor Marketplace Types
 * Connect learners with verified expert mentors
 */

export type ExpertiseLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export type SessionType = "1-on-1" | "group" | "workshop" | "consultation";

export type AvailabilityStatus = "available" | "busy" | "offline";

export type MentorCategory =
  | "technology"
  | "business"
  | "design"
  | "marketing"
  | "data-science"
  | "engineering"
  | "finance"
  | "healthcare"
  | "education"
  | "other";

export interface MentorProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  currency: string;
  expertise: string[];
  categories: MentorCategory[];
  languages: string[];
  experience: number; // years
  company?: string;
  education?: string[];
  certifications?: string[];
  skills: string[];
  availability: AvailabilityStatus;
  responseTime: string; // e.g., "within 2 hours"
  totalSessions: number;
  successRate: number; // percentage
  verified: boolean;
  featured: boolean;
  location?: string;
  timezone?: string;
}

export interface MentorReview {
  id: string;
  mentorId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  sessionType: SessionType;
  createdAt: Date;
  helpful: number;
}

export interface BookingSession {
  id: string;
  mentorId: string;
  userId: string;
  sessionType: SessionType;
  scheduledAt: Date;
  duration: number; // minutes
  price: number;
  currency: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  meetingLink?: string;
}

export interface MentorFilters {
  categories: Record<MentorCategory, boolean>;
  languages: Record<string, boolean>;
  priceRange: {
    min: number;
    max: number;
  };
  rating: number; // minimum rating (1-5)
  availability: AvailabilityStatus[];
  experience: {
    min: number;
    max: number;
  };
  verified: boolean;
  search: string;
}

export interface MentorMarketplaceState {
  mentors: MentorProfile[];
  filteredMentors: MentorProfile[];
  filters: MentorFilters;
  selectedMentor: MentorProfile | null;
  reviews: MentorReview[];
  bookings: BookingSession[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  sortBy: "rating" | "price-low" | "price-high" | "experience" | "popularity";
  viewMode: "grid" | "list";
}

export interface MentorMarketplaceContextType {
  state: MentorMarketplaceState;
  actions: {
    loadMentors: (page?: number) => Promise<void>;
    loadMoreMentors: () => Promise<void>;
    setFilters: (filters: Partial<MentorFilters>) => void;
    clearFilters: () => void;
    searchMentors: (query: string) => void;
    selectMentor: (mentor: MentorProfile | null) => void;
    bookSession: (
      mentorId: string,
      sessionType: SessionType,
      scheduledAt: Date,
      duration: number
    ) => Promise<void>;
    loadMentorReviews: (mentorId: string) => Promise<void>;
    setSortBy: (sortBy: MentorMarketplaceState["sortBy"]) => void;
    setViewMode: (viewMode: MentorMarketplaceState["viewMode"]) => void;
    refreshMentors: () => Promise<void>;
  };
}

export interface MentorCardProps {
  mentor: MentorProfile;
  onBook: (mentor: MentorProfile) => void;
  onViewProfile: (mentor: MentorProfile) => void;
  className?: string;
}

export interface MentorFiltersProps {
  filters: MentorFilters;
  onFiltersChange: (filters: Partial<MentorFilters>) => void;
  mentorCount: number;
  className?: string;
}

export interface MentorMarketplaceProps {
  className?: string;
  showFilters?: boolean;
  enableInfiniteScroll?: boolean;
  onBooking?: (mentor: MentorProfile, sessionType: SessionType) => void;
}

export interface MentorProfileModalProps {
  mentor: MentorProfile | null;
  reviews: MentorReview[];
  isOpen: boolean;
  onClose: () => void;
  onBook: (mentor: MentorProfile, sessionType: SessionType) => void;
}

export interface BookingModalProps {
  mentor: MentorProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    sessionType: SessionType,
    scheduledAt: Date,
    duration: number
  ) => void;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  available: boolean;
  price: number;
  currency: string;
}

export interface AvailableDate {
  date: Date;
  timeSlots: TimeSlot[];
  isAvailable: boolean;
}

export interface MentorBookingState {
  selectedDate: Date | null;
  selectedTimeSlot: TimeSlot | null;
  sessionType: SessionType;
  duration: number; // minutes
  notes: string;
  isLoading: boolean;
  error: string | null;
}

export interface MentorBookingContextType {
  state: MentorBookingState;
  actions: {
    selectDate: (date: Date) => void;
    selectTimeSlot: (timeSlot: TimeSlot) => void;
    setSessionType: (type: SessionType) => void;
    setDuration: (duration: number) => void;
    setNotes: (notes: string) => void;
    resetBooking: () => void;
    confirmBooking: () => Promise<void>;
  };
}

export interface MentorProfileViewProps {
  mentor: MentorProfile;
  reviews: MentorReview[];
  availableDates: AvailableDate[];
  onBookSession: (sessionType: SessionType) => void;
  onBack: () => void;
  className?: string;
}

export interface CalendarPickerProps {
  availableDates: AvailableDate[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  className?: string;
}

export interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  onTimeSlotSelect: (timeSlot: TimeSlot) => void;
  className?: string;
}

export interface BookingConfirmationProps {
  mentor: MentorProfile;
  selectedDate: Date | null;
  selectedTimeSlot: TimeSlot | null;
  sessionType: SessionType;
  duration: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}
