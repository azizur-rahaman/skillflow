/**
 * Feature Voting Page
 * Route page for the democratic feature voting platform
 */

import { FeatureVotingProvider } from "@/features/feature-voting/context";
import { FeatureVotingBoard } from "@/features/feature-voting/presentation/FeatureVotingBoard";

export default function FeatureVotingPage() {
  return (
    <FeatureVotingProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <FeatureVotingBoard />
      </div>
    </FeatureVotingProvider>
  );
}
