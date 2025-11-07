"use client";

import { BillingProvider } from "@/features/billing-management/context";
import { BillingManagement } from "@/features/billing-management/presentation";

export default function BillingManagementPage() {
  return (
    <BillingProvider>
      <BillingManagement />
    </BillingProvider>
  );
}
