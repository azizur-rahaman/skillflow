import React from "react";
import { useAdminConsole } from "../../context";
import { AdminSection } from "../../types";
import { Users, Key, Shield, FileText, Settings } from "lucide-react";

const navigationItems = [
  { id: "users" as AdminSection, label: "Users", icon: Users },
  { id: "tokens" as AdminSection, label: "Tokens", icon: Key },
  { id: "roles" as AdminSection, label: "Roles", icon: Shield },
  { id: "logs" as AdminSection, label: "Audit Logs", icon: FileText },
];

export const AdminSidebar: React.FC = () => {
  const { state, actions } = useAdminConsole();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="flex items-center px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Console</h1>
              <p className="text-xs text-gray-400">SkillFlow Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = state.currentSection === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => actions.setCurrentSection(item.id)}
                    className={`
                      w-full flex items-center px-4 py-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* System Status */}
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center space-x-2">
            <div
              className={`
              w-2 h-2 rounded-full
              ${
                state.stats.systemHealth === "healthy"
                  ? "bg-green-400"
                  : state.stats.systemHealth === "warning"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }
            `}
            />
            <span className="text-sm text-gray-400">
              System {state.stats.systemHealth}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
