/**
 * Mentor Marketplace Page
 * Main page for the mentor marketplace feature
 */

import { MentorMarketplaceProvider } from "@/features/mentor-marketplace/context";
import { MentorMarketplace } from "@/features/mentor-marketplace/presentation";

export default function MentorMarketplacePage() {
  return (
    <MentorMarketplaceProvider>
      <MentorMarketplace />
    </MentorMarketplaceProvider>
  );
}
