"use client";

import { DeveloperIntegrationsProvider } from "../../features/developer-integrations/context";
import { DeveloperIntegrations } from "../../features/developer-integrations/presentation";

export default function DeveloperIntegrationsPage() {
  return (
    <DeveloperIntegrationsProvider>
      <DeveloperIntegrations />
    </DeveloperIntegrationsProvider>
  );
}
