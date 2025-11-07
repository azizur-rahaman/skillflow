/**
 * Mentor Marketplace Page
 * Main page for the mentor marketplace feature
 */

import { MentorMarketplaceProvider } from "@/features/mentor-marketplace/context";
import { MentorMarketplace } from "@/features/mentor-marketplace/presentation";

export default function MentorMarketplacePage() {
  return (
    <MentorMarketplaceProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <MentorMarketplace />
      </div>
    </MentorMarketplaceProvider>
  );
}
