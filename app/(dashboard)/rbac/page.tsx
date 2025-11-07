import { RBACViewer } from "@/features/rbac";

export default function RBACPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <RBACViewer />
    </div>
  );
}

export const metadata = {
  title: "Role-Based Access Control | SkillFlow",
  description:
    "Manage permissions and access levels for all user roles in your organization",
};
