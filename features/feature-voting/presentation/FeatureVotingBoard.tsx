/**
 * Feature Voting Board Component
 * Main component for the democratic feature voting platform
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFeatureVoting } from "../context";
import { FeatureCard } from "./components/FeatureCard";
import { FeatureFilters } from "./components/FeatureFilters";
import { CreateFeatureModal } from "./components/CreateFeatureModal";
import { FeatureCommentsModal } from "./components/FeatureCommentsModal";
import { FeatureRequest, VoteType } from "../types";
import { Plus, Sparkles, TrendingUp, Users } from "lucide-react";

export const FeatureVotingBoard: React.FC = () => {
  const {
    state,
    actions: {
      voteFeature,
      createFeature,
      addComment,
      setSortBy,
      setSearchQuery,
      toggleTag,
    },
  } = useFeatureVoting();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFeatureForComments, setSelectedFeatureForComments] = useState<
    string | null
  >(null);

  const handleCreateFeature = async (featureData: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    await createFeature(featureData);
    setShowCreateModal(false);
  };

  const handleOpenComments = (feature: FeatureRequest) => {
    setSelectedFeatureForComments(feature.id);
  };

  const handleCloseComments = () => {
    setSelectedFeatureForComments(null);
  };

  const selectedFeature = selectedFeatureForComments
    ? state.features.find((f) => f.id === selectedFeatureForComments)
    : null;

  // Filter features based on current state
  const filteredFeatures = state.features
    .filter((feature) => {
      const matchesSearch =
        !state.searchQuery ||
        feature.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        feature.description
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase());

      const matchesTags =
        state.selectedTags.length === 0 ||
        state.selectedTags.some((tag) => feature.tags.includes(tag));

      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (state.sortBy) {
        case "most-voted":
          return b.votes - a.votes;
        case "recent":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "trending":
          // Simple trending: recent features with high votes
          const aScore =
            a.votes /
            Math.max(
              1,
              (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            );
          const bScore =
            b.votes /
            Math.max(
              1,
              (Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            );
          return bScore - aScore;
        default:
          return 0;
      }
    });

  const selectedComments = selectedFeature
    ? state.comments.filter((c) => c.featureId === selectedFeature.id)
    : [];

  const handleClearFilters = () => {
    setSearchQuery("");
    // Reset tags by toggling them off
    state.selectedTags.forEach((tag) => toggleTag(tag));
  };

  // Stats
  const totalVotes = state.features.reduce(
    (sum, feature) => sum + feature.votes,
    0
  );
  const totalFeatures = state.features.length;
  const activeFeatures = state.features.filter(
    (f) => f.status === "open"
  ).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Feature Voting
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help shape the future of SkillFlow by voting on features you&apos;d
            love to see. Your voice matters in our democratic development
            process.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {totalVotes}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Total Votes Cast</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-2xl font-bold text-foreground">
                {totalFeatures}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Feature Requests</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold text-foreground">
                {activeFeatures}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Active Requests</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <FeatureFilters
            sortBy={state.sortBy}
            searchQuery={state.searchQuery}
            selectedTags={state.selectedTags}
            availableTags={Array.from(
              new Set(state.features.flatMap((f) => f.tags))
            )}
            onSortChange={setSortBy}
            onSearchChange={setSearchQuery}
            onTagToggle={toggleTag}
          />

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Suggest Feature
          </Button>
        </div>

        {/* Features Grid */}
        {filteredFeatures.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 inline-block mb-4">
              <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No features found
            </h3>
            <p className="text-muted-foreground mb-6">
              {state.searchQuery || state.selectedTags.length > 0
                ? "Try adjusting your filters or search terms."
                : "Be the first to suggest a new feature!"}
            </p>
            {state.searchQuery || state.selectedTags.length > 0 ? (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="rounded-xl border-border/50"
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary/90 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Suggest First Feature
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onVote={(featureId, voteType) =>
                  voteFeature(featureId, voteType)
                }
                onViewComments={handleOpenComments}
              />
            ))}
          </div>
        )}

        {/* Load More (if needed for pagination) */}
        {filteredFeatures.length > 0 &&
          filteredFeatures.length < state.features.length && (
            <div className="text-center mt-8">
              <Button variant="outline" className="rounded-xl border-border/50">
                Load More Features
              </Button>
            </div>
          )}
      </div>

      {/* Modals */}
      <CreateFeatureModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFeature}
        isSubmitting={state.isSubmitting}
      />

      {selectedFeature && (
        <FeatureCommentsModal
          isOpen={!!selectedFeatureForComments}
          onClose={handleCloseComments}
          feature={selectedFeature}
          comments={selectedComments}
          onAddComment={(content) => addComment(selectedFeature.id, content)}
          isSubmitting={state.isSubmitting}
          onViewComments={function (feature: FeatureRequest): void {
            throw new Error("Function not implemented.");
          }}
          onVoteComment={function (commentId: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
};
