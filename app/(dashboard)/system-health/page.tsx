"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SystemStatusProvider,
  useSystemStatus,
  StatusDemoCard,
} from "@/features/system-status";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  Activity,
} from "lucide-react";

const StatusCard: React.FC<{
  title: string;
  status: "operational" | "degraded" | "outage";
  description: string;
  lastChecked: string;
}> = ({ title, status, description, lastChecked }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "operational":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-900/20",
          borderColor: "border-green-800",
          badgeColor: "bg-green-600",
        };
      case "degraded":
        return {
          icon: AlertTriangle,
          color: "text-yellow-400",
          bgColor: "bg-yellow-900/20",
          borderColor: "border-yellow-800",
          badgeColor: "bg-yellow-600",
        };
      case "outage":
        return {
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-red-900/20",
          borderColor: "border-red-800",
          badgeColor: "bg-red-600",
        };
      default:
        return {
          icon: Info,
          color: "text-gray-400",
          bgColor: "bg-gray-900/20",
          borderColor: "border-gray-800",
          badgeColor: "bg-gray-600",
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${config.color}`} />
            {title}
          </CardTitle>
          <Badge className={`${config.badgeColor} text-white`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300 mb-2">
          {description}
        </CardDescription>
        <p className="text-xs text-gray-400">Last checked: {lastChecked}</p>
      </CardContent>
    </Card>
  );
};

const SystemHealthDashboard: React.FC = () => {
  const { state, actions } = useSystemStatus();

  const services = [
    {
      title: "API Services",
      status: "operational" as const,
      description: "Core API endpoints and data processing",
      lastChecked: "2 minutes ago",
    },
    {
      title: "Database",
      status: "operational" as const,
      description: "Primary and replica database instances",
      lastChecked: "1 minute ago",
    },
    {
      title: "Authentication",
      status: "operational" as const,
      description: "User login and session management",
      lastChecked: "30 seconds ago",
    },
    {
      title: "File Storage",
      status: "degraded" as const,
      description: "File upload and storage services",
      lastChecked: "5 minutes ago",
    },
    {
      title: "Email Service",
      status: "operational" as const,
      description: "Notification and email delivery",
      lastChecked: "1 minute ago",
    },
    {
      title: "Analytics Engine",
      status: "operational" as const,
      description: "Data processing and analytics pipeline",
      lastChecked: "3 minutes ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Activity className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">
              System Health Dashboard
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Real-time monitoring of all SkillFlow system components and services
          </p>
        </div>

        {/* Overall Status */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Overall System Status
              </span>
              <Button
                onClick={actions.refreshStatus}
                variant="outline"
                size="sm"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current system health and recent updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Badge
                className={`${
                  state.currentStatus === "operational"
                    ? "bg-green-600"
                    : state.currentStatus === "degraded"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                } text-white px-3 py-1`}
              >
                {state.currentStatus.charAt(0).toUpperCase() +
                  state.currentStatus.slice(1)}
              </Badge>
              <span className="text-sm text-gray-400">
                Last updated: {state.lastUpdated.toLocaleString()}
              </span>
            </div>

            {state.messages.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Active Messages</h4>
                {state.messages.map((message) => (
                  <div key={message.id} className="p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-white font-medium">
                        {message.title}
                      </h5>
                      <Badge variant="secondary" className="text-xs">
                        {message.status}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service Status Grid */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">
            Service Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <StatusCard key={index} {...service} />
            ))}
          </div>
        </div>

        {/* Demo Controls */}
        <div className="max-w-2xl">
          <StatusDemoCard />
        </div>
      </div>
    </div>
  );
};

export default function SystemHealthPage() {
  return (
    <SystemStatusProvider>
      <SystemHealthDashboard />
    </SystemStatusProvider>
  );
}
