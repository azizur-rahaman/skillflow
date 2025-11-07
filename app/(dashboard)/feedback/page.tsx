/**
 * Feedback Index Page
 * Landing page for feedback - redirects to platform feedback by default
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to platform feedback by default
    router.push("/feedback/platform");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-slate-400">Redirecting to feedback...</p>
      </div>
    </div>
  );
}
