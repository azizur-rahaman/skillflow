/**
 * Feature Voting Page
 * Route page for the democratic feature voting platform
 */

import { FeatureVotingProvider } from "../../features/feature-voting/context";
import { FeatureVotingBoard } from "../../features/feature-voting/presentation/FeatureVotingBoard";

export default function FeatureVotingPage() {
  return (
    <FeatureVotingProvider>
      <FeatureVotingBoard />
    </FeatureVotingProvider>
  );
}
