/**
 * Feature Voting Context
 * State management for democratic feature request system
 */

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  FeatureVotingState,
  FeatureVotingContextType,
  FeatureRequest,
  FeatureComment,
  CreateFeatureRequest,
  SortOption,
  VoteType,
} from "../types";

// Mock data for demonstration
const mockFeatures: FeatureRequest[] = [
  {
    id: "1",
    title: "AI-Powered Skill Matching",
    description:
      "Implement advanced AI algorithms to better match mentors with mentees based on learning styles and career goals.",
    authorId: "user1",
    authorName: "Alex Chen",
    authorAvatar: undefined,
    status: "under-review",
    votes: 42,
    upvoteCount: 45,
    downvoteCount: 3,
    commentCount: 12,
    tags: ["ai", "matching", "mentoring"],
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2025-11-05"),
    isVotedByUser: false,
  },
  {
    id: "2",
    title: "Mobile App for SkillFlow",
    description:
      "Create a native mobile app for iOS and Android to make learning more accessible on-the-go.",
    authorId: "user2",
    authorName: "Sarah Johnson",
    authorAvatar: undefined,
    status: "planned",
    votes: 67,
    upvoteCount: 70,
    downvoteCount: 3,
    commentCount: 23,
    tags: ["mobile", "app", "accessibility"],
    createdAt: new Date("2025-10-28"),
    updatedAt: new Date("2025-11-03"),
    isVotedByUser: true,
    userVoteType: "upvote",
  },
  {
    id: "3",
    title: "Integration with LinkedIn Learning",
    description:
      "Allow users to import their LinkedIn Learning courses and certifications directly into SkillFlow.",
    authorId: "user3",
    authorName: "Mike Rodriguez",
    authorAvatar: undefined,
    status: "open",
    votes: 31,
    upvoteCount: 33,
    downvoteCount: 2,
    commentCount: 8,
    tags: ["integration", "linkedin", "certification"],
    createdAt: new Date("2025-11-04"),
    updatedAt: new Date("2025-11-04"),
    isVotedByUser: false,
  },
];

const mockComments: FeatureComment[] = [
  {
    id: "1",
    featureId: "1",
    authorId: "user4",
    authorName: "Emma Davis",
    content:
      "This would be amazing! The current matching algorithm sometimes feels random.",
    createdAt: new Date("2025-11-02"),
    votes: 5,
    isEdited: false,
  },
  {
    id: "2",
    featureId: "1",
    authorId: "user5",
    authorName: "David Kim",
    content:
      "Could we also include personality assessments in the matching process?",
    createdAt: new Date("2025-11-03"),
    votes: 3,
    isEdited: false,
  },
];

// Initial state
const initialState: FeatureVotingState = {
  features: mockFeatures,
  selectedFeature: null,
  comments: [],
  sortBy: "most-voted",
  isLoading: false,
  isSubmitting: false,
  error: null,
  showCreateModal: false,
  showCommentsModal: false,
  searchQuery: "",
  selectedTags: [],
};

// Action types
type FeatureVotingAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_FEATURES"; payload: FeatureRequest[] }
  | { type: "ADD_FEATURE"; payload: FeatureRequest }
  | { type: "UPDATE_FEATURE"; payload: FeatureRequest }
  | { type: "SET_COMMENTS"; payload: FeatureComment[] }
  | { type: "ADD_COMMENT"; payload: FeatureComment }
  | { type: "SET_SORT_BY"; payload: SortOption }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "TOGGLE_TAG"; payload: string }
  | { type: "SET_SELECTED_FEATURE"; payload: FeatureRequest | null }
  | { type: "SET_SHOW_CREATE_MODAL"; payload: boolean }
  | { type: "SET_SHOW_COMMENTS_MODAL"; payload: boolean };

// Reducer
function featureVotingReducer(
  state: FeatureVotingState,
  action: FeatureVotingAction
): FeatureVotingState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_FEATURES":
      return { ...state, features: action.payload };
    case "ADD_FEATURE":
      return { ...state, features: [action.payload, ...state.features] };
    case "UPDATE_FEATURE":
      return {
        ...state,
        features: state.features.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
        selectedFeature:
          state.selectedFeature?.id === action.payload.id
            ? action.payload
            : state.selectedFeature,
      };
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.payload] };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "TOGGLE_TAG":
      const tagIndex = state.selectedTags.indexOf(action.payload);
      return {
        ...state,
        selectedTags:
          tagIndex > -1
            ? state.selectedTags.filter((t) => t !== action.payload)
            : [...state.selectedTags, action.payload],
      };
    case "SET_SELECTED_FEATURE":
      return { ...state, selectedFeature: action.payload };
    case "SET_SHOW_CREATE_MODAL":
      return { ...state, showCreateModal: action.payload };
    case "SET_SHOW_COMMENTS_MODAL":
      return { ...state, showCommentsModal: action.payload };
    default:
      return state;
  }
}

// Context
const FeatureVotingContext = createContext<
  FeatureVotingContextType | undefined
>(undefined);

// Provider props
interface FeatureVotingProviderProps {
  children: ReactNode;
}

// Provider component
export const FeatureVotingProvider: React.FC<FeatureVotingProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(featureVotingReducer, initialState);

  const actions: FeatureVotingContextType["actions"] = {
    loadFeatures: async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch({ type: "SET_FEATURES", payload: mockFeatures });
      } catch (error) {
        console.error("Failed to load features:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load features" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    createFeature: async (request: CreateFeatureRequest) => {
      dispatch({ type: "SET_SUBMITTING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newFeature: FeatureRequest = {
          id: `feature_${Date.now()}`,
          ...request,
          authorId: "current_user",
          authorName: "You",
          status: "open",
          votes: 0,
          upvoteCount: 0,
          downvoteCount: 0,
          commentCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        dispatch({ type: "ADD_FEATURE", payload: newFeature });
        dispatch({ type: "SET_SHOW_CREATE_MODAL", payload: false });
      } catch (error) {
        console.error("Failed to create feature request:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Failed to create feature request",
        });
      } finally {
        dispatch({ type: "SET_SUBMITTING", payload: false });
      }
    },

    voteFeature: async (featureId: string, voteType: VoteType) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const feature = state.features.find((f) => f.id === featureId);
        if (!feature) return;

        const updatedFeature: FeatureRequest = {
          ...feature,
          isVotedByUser: !feature.isVotedByUser,
          userVoteType: feature.isVotedByUser ? undefined : voteType,
          votes: feature.isVotedByUser ? feature.votes - 1 : feature.votes + 1,
          upvoteCount:
            voteType === "upvote"
              ? feature.isVotedByUser
                ? feature.upvoteCount - 1
                : feature.upvoteCount + 1
              : feature.upvoteCount,
          downvoteCount:
            voteType === "downvote"
              ? feature.isVotedByUser
                ? feature.downvoteCount - 1
                : feature.downvoteCount + 1
              : feature.downvoteCount,
        };

        dispatch({ type: "UPDATE_FEATURE", payload: updatedFeature });
      } catch (error) {
        console.error("Failed to vote on feature:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to vote on feature" });
      }
    },

    loadComments: async (featureId: string) => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        const featureComments = mockComments.filter(
          (c) => c.featureId === featureId
        );
        dispatch({ type: "SET_COMMENTS", payload: featureComments });
      } catch (error) {
        console.error("Failed to load comments:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load comments" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },

    addComment: async (featureId: string, content: string) => {
      dispatch({ type: "SET_SUBMITTING", payload: true });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newComment: FeatureComment = {
          id: `comment_${Date.now()}`,
          featureId,
          authorId: "current_user",
          authorName: "You",
          content,
          createdAt: new Date(),
          votes: 0,
          isEdited: false,
        };

        dispatch({ type: "ADD_COMMENT", payload: newComment });

        // Update comment count on feature
        const feature = state.features.find((f) => f.id === featureId);
        if (feature) {
          const updatedFeature: FeatureRequest = {
            ...feature,
            commentCount: feature.commentCount + 1,
          };
          dispatch({ type: "UPDATE_FEATURE", payload: updatedFeature });
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to add comment" });
      } finally {
        dispatch({ type: "SET_SUBMITTING", payload: false });
      }
    },

    setSortBy: (sort: SortOption) => {
      dispatch({ type: "SET_SORT_BY", payload: sort });
    },

    setSearchQuery: (query: string) => {
      dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    },

    toggleTag: (tag: string) => {
      dispatch({ type: "TOGGLE_TAG", payload: tag });
    },

    openCreateModal: () => {
      dispatch({ type: "SET_SHOW_CREATE_MODAL", payload: true });
    },

    closeCreateModal: () => {
      dispatch({ type: "SET_SHOW_CREATE_MODAL", payload: false });
    },

    openCommentsModal: (feature: FeatureRequest) => {
      dispatch({ type: "SET_SELECTED_FEATURE", payload: feature });
      dispatch({ type: "SET_SHOW_COMMENTS_MODAL", payload: true });
    },

    closeCommentsModal: () => {
      dispatch({ type: "SET_SELECTED_FEATURE", payload: null });
      dispatch({ type: "SET_SHOW_COMMENTS_MODAL", payload: false });
      dispatch({ type: "SET_COMMENTS", payload: [] });
    },

    clearError: () => {
      dispatch({ type: "SET_ERROR", payload: null });
    },
  };

  const value: FeatureVotingContextType = {
    state,
    actions,
  };

  return (
    <FeatureVotingContext.Provider value={value}>
      {children}
    </FeatureVotingContext.Provider>
  );
};

// Hook
export const useFeatureVoting = (): FeatureVotingContextType => {
  const context = useContext(FeatureVotingContext);
  if (!context) {
    throw new Error(
      "useFeatureVoting must be used within a FeatureVotingProvider"
    );
  }
  return context;
};
