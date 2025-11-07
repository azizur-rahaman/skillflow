"use client";

import { DeveloperIntegrationsProvider } from "@/features/developer-integrations/context";
import { DeveloperIntegrations } from "@/features/developer-integrations/presentation";

export default function DeveloperIntegrationsPage() {
  return (
    <DeveloperIntegrationsProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <DeveloperIntegrations />
      </div>
    </DeveloperIntegrationsProvider>
  );
}
