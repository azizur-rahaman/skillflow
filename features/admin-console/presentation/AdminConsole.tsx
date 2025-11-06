import React, { useEffect } from "react";
import { useAdminConsole } from "../context";
import { UsersSection } from "./components/UsersSection";
import { TokensSection } from "./components/TokensSection";
import { RolesSection } from "./components/RolesSection";
import { LogsSection } from "./components/LogsSection";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { AnalyticsOverview } from "./components/AnalyticsOverview";

export const AdminConsole: React.FC = () => {
  const { state, actions } = useAdminConsole();

  useEffect(() => {
    // Load initial data
    actions.loadStats();
    actions.loadUsers();
  }, [actions]);

  const renderCurrentSection = () => {
    switch (state.currentSection) {
      case "users":
        return <UsersSection />;
      case "tokens":
        return <TokensSection />;
      case "roles":
        return <RolesSection />;
      case "logs":
        return <LogsSection />;
      default:
        return <UsersSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminSidebar />

      <div className="ml-64">
        <AdminHeader />

        <main className="p-6">
          <div className="mb-8">
            <AnalyticsOverview />
          </div>

          <div className="space-y-6">{renderCurrentSection()}</div>
        </main>
      </div>
    </div>
  );
};
