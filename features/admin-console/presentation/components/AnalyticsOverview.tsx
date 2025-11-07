import React from "react";
import { useAdminConsole } from "../../context";
import { Card } from "@/components/ui/card";
import {
  Users,
  Key,
  Shield,
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export const AnalyticsOverview: React.FC = () => {
  const { state } = useAdminConsole();

  const stats = [
    {
      label: "Total Users",
      value: state.stats.totalUsers,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      changeType: "positive" as "positive" | "negative" | "neutral",
    },
    {
      label: "Active Users",
      value: state.stats.activeUsers,
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      change: "+8%",
      changeType: "positive" as "positive" | "negative" | "neutral",
    },
    {
      label: "Active Tokens",
      value: state.stats.activeTokens,
      icon: Key,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      change: "+15%",
      changeType: "positive" as "positive" | "negative" | "neutral",
    },
    {
      label: "Total Roles",
      value: state.stats.totalRoles,
      icon: Shield,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      change: "0%",
      changeType: "neutral" as "positive" | "negative" | "neutral",
    },
    {
      label: "Recent Logs",
      value: state.stats.recentLogs,
      icon: FileText,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      change: "+23%",
      changeType: "positive" as "positive" | "negative" | "neutral",
    },
    {
      label: "System Health",
      value:
        state.stats.systemHealth === "healthy"
          ? "Healthy"
          : state.stats.systemHealth === "warning"
          ? "Warning"
          : "Critical",
      icon:
        state.stats.systemHealth === "healthy" ? CheckCircle : AlertTriangle,
      color:
        state.stats.systemHealth === "healthy"
          ? "text-green-400"
          : state.stats.systemHealth === "warning"
          ? "text-yellow-400"
          : "text-red-400",
      bgColor:
        state.stats.systemHealth === "healthy"
          ? "bg-green-500/10"
          : state.stats.systemHealth === "warning"
          ? "bg-yellow-500/10"
          : "bg-red-500/10",
      change: "",
      changeType: "neutral" as "positive" | "negative" | "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <Card
            key={index}
            className="bg-gray-800/50 border-gray-700 p-6 hover:bg-gray-800/70 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-sm font-medium text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white mb-1">
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
                {stat.change && (
                  <div className="flex items-center space-x-1">
                    <TrendingUp
                      className={`w-3 h-3 ${
                        stat.changeType === "positive"
                          ? "text-green-400"
                          : stat.changeType === "negative"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        stat.changeType === "positive"
                          ? "text-green-400"
                          : stat.changeType === "negative"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
