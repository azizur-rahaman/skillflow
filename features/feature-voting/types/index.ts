/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Feature Voting Types
 * Democratic feature request and voting system
 */

export type FeatureStatus =
  | "open"
  | "under-review"
  | "planned"
  | "in-progress"
  | "completed"
  | "declined";

export type SortOption = "most-voted" | "recent" | "trending";

export type VoteType = "upvote" | "downvote";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  status: FeatureStatus;
  votes: number;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isVotedByUser?: boolean;
  userVoteType?: VoteType;
}

export interface FeatureComment {
  author: any;
  hasVoted : boolean;
  id: string;
  featureId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  votes: number;
  isEdited: boolean;
}

export interface FeatureVote {
  id: string;
  featureId: string;
  userId: string;
  voteType: VoteType;
  createdAt: Date;
}

export interface CreateFeatureRequest {
  title: string;
  description: string;
  tags: string[];
}

export interface FeatureVotingState {
  features: FeatureRequest[];
  selectedFeature: FeatureRequest | null;
  comments: FeatureComment[];
  sortBy: SortOption;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  showCreateModal: boolean;
  showCommentsModal: boolean;
  searchQuery: string;
  selectedTags: string[];
}

export interface FeatureVotingContextType {
  state: FeatureVotingState;
  actions: {
    loadFeatures: () => Promise<void>;
    createFeature: (request: CreateFeatureRequest) => Promise<void>;
    voteFeature: (featureId: string, voteType: VoteType) => Promise<void>;
    loadComments: (featureId: string) => Promise<void>;
    addComment: (featureId: string, content: string) => Promise<void>;
    setSortBy: (sort: SortOption) => void;
    setSearchQuery: (query: string) => void;
    toggleTag: (tag: string) => void;
    openCreateModal: () => void;
    closeCreateModal: () => void;
    openCommentsModal: (feature: FeatureRequest) => void;
    closeCommentsModal: () => void;
    clearError: () => void;
  };
}

export interface FeatureCardProps {
  feature: FeatureRequest;
  onVote: (featureId: string, voteType: VoteType) => void;
  onViewComments: (feature: FeatureRequest) => void;
  className?: string;
}

export interface FeatureVotingBoardProps {
  className?: string;
}

export interface CreateFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: CreateFeatureRequest) => void;
  isSubmitting: boolean;
}

export interface FeatureCommentsModalProps {
  feature: FeatureRequest | null;
  comments: FeatureComment[];
  isOpen: boolean;
  onViewComments: (feature: FeatureRequest) => void;
  onVoteComment: (commentId: string) => void;
  onClose: () => void;
  onAddComment: (content: string) => void;
  isSubmitting: boolean;
}

export interface FeatureFiltersProps {
  sortBy: SortOption;
  searchQuery: string;
  selectedTags: string[];
  availableTags: string[];
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (query: string) => void;
  onTagToggle: (tag: string) => void;
  className?: string;
}

export interface VoteButtonProps {
  featureId: string;
  votes: number;
  isVoted: boolean;
  voteType: VoteType;
  onVote: (featureId: string, voteType: VoteType) => void;
  disabled?: boolean;
  className?: string;
}

export interface StatusBadgeProps {
  status: FeatureStatus;
  className?: string;
}
