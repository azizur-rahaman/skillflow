import { ComplianceDashboard } from "@/features/compliance";

export default function CompliancePage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <ComplianceDashboard />
    </div>
  );
}

export const metadata = {
  title: "Compliance Dashboard | SkillFlow",
  description:
    "Monitor regulatory compliance across GDPR, ISO 27001, SOC2, and other frameworks",
};
