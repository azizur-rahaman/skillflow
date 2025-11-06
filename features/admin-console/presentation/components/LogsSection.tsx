import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAdminConsole } from "../../context";
import { LogLevel, AuditLog } from "../../types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  AlertTriangle,
  Info,
  AlertCircle,
  XCircle,
  Filter,
  Download,
  Search,
  Calendar,
} from "lucide-react";

export const LogsSection: React.FC = () => {
  const { state } = useAdminConsole();
  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter logs based on search and level
  const filteredLogs = useMemo(() => {
    return state.logs.filter((log) => {
      const matchesSearch =
        !state.searchQuery ||
        log.action.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        (log.userEmail &&
          log.userEmail
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase()));

      const matchesLevel = levelFilter === "all" || log.level === levelFilter;

      return matchesSearch && matchesLevel;
    });
  }, [state.logs, state.searchQuery, levelFilter]);

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "info":
        return <Info className="w-4 h-4 text-blue-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "critical":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelBadge = (level: LogLevel) => {
    const variants = {
      info: "bg-blue-500/20 text-blue-300",
      warning: "bg-yellow-500/20 text-yellow-300",
      error: "bg-red-500/20 text-red-300",
      critical: "bg-red-600/20 text-red-400",
    };

    return (
      <Badge className={variants[level]}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp);
  };

  const getLogDetails = (log: AuditLog) => {
    const details = [];
    if (log.ipAddress) details.push(`IP: ${log.ipAddress}`);
    if (log.userAgent) details.push(`User Agent: ${log.userAgent}`);
    if (Object.keys(log.details).length > 0) {
      details.push(`Details: ${JSON.stringify(log.details, null, 2)}`);
    }
    return details;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
          <p className="text-gray-400">System activity and security events</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filters:</span>
          </div>

          <Select
            value={levelFilter}
            onValueChange={(value) => setLevelFilter(value as LogLevel | "all")}
          >
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Logs Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-700 hover:bg-gray-700/20"
                >
                  <td className="px-6 py-4 text-gray-300">
                    <div className="text-sm">
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(log.level)}
                      {getLevelBadge(log.level)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {log.userEmail || "System"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <code className="bg-gray-700 px-2 py-1 rounded text-xs">
                      {log.resource}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="max-w-xs truncate">
                      {getLogDetails(log).join(" • ")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="relative"
                      ref={dropdownOpen === log.id ? dropdownRef : null}
                    >
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === log.id ? null : log.id
                          )
                        }
                        className="text-gray-400 hover:text-white p-1"
                        title={`Actions for log ${log.id}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {dropdownOpen === log.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                          <div className="py-1">
                            <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                              <Search className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                              <Download className="w-4 h-4 mr-2" />
                              Export Log
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Logs Found
            </h3>
            <p className="text-gray-400">
              No audit logs match your current filters.
            </p>
          </div>
        )}
      </Card>

      {/* Log Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/20 p-4">
          <div className="flex items-center space-x-3">
            <Info className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-blue-300">
                {state.logs.filter((log) => log.level === "info").length}
              </div>
              <div className="text-sm text-blue-400">Info Logs</div>
            </div>
          </div>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/20 p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-2xl font-bold text-yellow-300">
                {state.logs.filter((log) => log.level === "warning").length}
              </div>
              <div className="text-sm text-yellow-400">Warnings</div>
            </div>
          </div>
        </Card>

        <Card className="bg-red-500/10 border-red-500/20 p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <div>
              <div className="text-2xl font-bold text-red-300">
                {state.logs.filter((log) => log.level === "error").length}
              </div>
              <div className="text-sm text-red-400">Errors</div>
            </div>
          </div>
        </Card>

        <Card className="bg-red-600/10 border-red-600/20 p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <div className="text-2xl font-bold text-red-400">
                {state.logs.filter((log) => log.level === "critical").length}
              </div>
              <div className="text-sm text-red-500">Critical</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
