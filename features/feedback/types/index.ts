/**
 * Feedback Types
 * User feedback collection for improving learning and mentoring quality
 */

export type FeedbackType = "session" | "course" | "platform" | "mentor";

export type NPSRating = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type EmojiRating =
  | "very-dissatisfied"
  | "dissatisfied"
  | "neutral"
  | "satisfied"
  | "very-satisfied";

export interface FeedbackSubmission {
  id: string;
  userId: string;
  sessionId?: string;
  courseId?: string;
  mentorId?: string;
  type: FeedbackType;
  npsRating?: NPSRating;
  emojiRating?: EmojiRating;
  comment?: string;
  submittedAt: Date;
  isAnonymous: boolean;
}

export interface FeedbackState {
  currentStep: "rating" | "comment" | "thank-you";
  selectedRating?: NPSRating | EmojiRating;
  comment: string;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error?: string;
}

export interface FeedbackContextType {
  state: FeedbackState;
  actions: {
    setRating: (rating: NPSRating | EmojiRating) => void;
    setComment: (comment: string) => void;
    submitFeedback: (
      feedbackData: Partial<FeedbackSubmission>
    ) => Promise<void>;
    reset: () => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
  };
}

export interface FeedbackFormProps {
  type: FeedbackType;
  sessionId?: string;
  courseId?: string;
  mentorId?: string;
  mentorName?: string;
  courseName?: string;
  onSubmit?: (feedback: FeedbackSubmission) => void;
  onClose?: () => void;
  className?: string;
}

export interface NPSRatingProps {
  value?: NPSRating;
  onChange: (value: NPSRating) => void;
  className?: string;
}

export interface EmojiRatingProps {
  value?: EmojiRating;
  onChange: (value: EmojiRating) => void;
  className?: string;
}

export interface FeedbackCommentProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ThankYouAnimationProps {
  onComplete?: () => void;
  className?: string;
}
