"use client";

import React from "react";
import { useRBAC } from "../../context/RBACContext";
import { AccessLevel } from "../../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Eye,
  Edit,
  Shield,
  Crown,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface PermissionMatrixTableProps {
  className?: string;
}

const getAccessLevelIcon = (level: AccessLevel) => {
  switch (level) {
    case "read":
      return <Eye className="w-4 h-4" />;
    case "write":
      return <Edit className="w-4 h-4" />;
    case "admin":
      return <Shield className="w-4 h-4" />;
    case "full":
      return <Crown className="w-4 h-4" />;
    default:
      return <X className="w-4 h-4" />;
  }
};

const getAccessLevelBadgeColor = (level: AccessLevel) => {
  switch (level) {
    case "read":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "write":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "admin":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "full":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export function PermissionMatrixTable({
  className,
}: PermissionMatrixTableProps) {
  const { permissionMatrix, updatePermission, getAccessLevelConfig } =
    useRBAC();
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set(["user-management"]));

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handlePermissionChange = (
    roleId: string,
    permissionId: string,
    newLevel: AccessLevel
  ) => {
    updatePermission(roleId, permissionId, newLevel);
  };

  const cycleAccessLevel = (currentLevel: AccessLevel): AccessLevel => {
    const levels: AccessLevel[] = ["none", "read", "write", "admin", "full"];
    const currentIndex = levels.indexOf(currentLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    return levels[nextIndex];
  };

  const categories = permissionMatrix.permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = {
        id: permission.category,
        name: permission.category
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        permissions: [],
      };
    }
    acc[permission.category].permissions.push(permission);
    return acc;
  }, {} as Record<string, { id: string; name: string; permissions: typeof permissionMatrix.permissions }>);

  return (
    <TooltipProvider>
      <Card className={cn("p-6 bg-card border-border rounded-2xl", className)}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Permission Matrix
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage role-based access control across all system features
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {permissionMatrix.roles.length} Roles
              </Badge>
              <Badge variant="outline" className="text-xs">
                {permissionMatrix.permissions.length} Permissions
              </Badge>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Header Row */}
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground w-80">
                    Feature / Permission
                  </th>
                  {permissionMatrix.roles.map((role) => (
                    <th
                      key={role.id}
                      className="text-center py-3 px-4 min-w-32"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full bg-current"
                          style={{ color: role.color }}
                        />
                        <span className="font-medium text-sm text-foreground">
                          {role.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Permission Rows */}
              <tbody>
                {Object.values(categories).map((category) => (
                  <React.Fragment key={category.id}>
                    {/* Category Header */}
                    <tr className="border-b border-border/50 bg-muted/20">
                      <td
                        colSpan={permissionMatrix.roles.length + 1}
                        className="py-2"
                      >
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {expandedCategories.has(category.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          {category.name}
                          <Badge variant="secondary" className="text-xs">
                            {category.permissions.length}
                          </Badge>
                        </button>
                      </td>
                    </tr>

                    {/* Permission Rows */}
                    {expandedCategories.has(category.id) &&
                      category.permissions.map((permission) => (
                        <tr
                          key={permission.id}
                          className="border-b border-border/30 hover:bg-muted/10 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="font-medium text-sm text-foreground">
                                {permission.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {permission.description}
                              </div>
                            </div>
                          </td>

                          {permissionMatrix.roles.map((role) => {
                            const accessLevel =
                              permissionMatrix.matrix[role.id]?.[
                                permission.id
                              ] || "none";
                            const config = getAccessLevelConfig(accessLevel);

                            return (
                              <td
                                key={`${role.id}-${permission.id}`}
                                className="text-center py-3 px-4"
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() =>
                                        handlePermissionChange(
                                          role.id,
                                          permission.id,
                                          cycleAccessLevel(accessLevel)
                                        )
                                      }
                                      className={cn(
                                        "inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all hover:scale-105",
                                        getAccessLevelBadgeColor(accessLevel),
                                        "hover:shadow-md"
                                      )}
                                    >
                                      {getAccessLevelIcon(accessLevel)}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    className="max-w-xs"
                                  >
                                    <div className="space-y-1">
                                      <div className="font-medium">
                                        {config?.label || "No Access"}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {config?.description ||
                                          "No access to this feature"}
                                      </div>
                                      <div className="text-xs opacity-75">
                                        Click to cycle access levels
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <span className="text-sm font-medium text-muted-foreground">
              Access Levels:
            </span>
            {["none", "read", "write", "admin", "full"].map((level) => {
              const config = getAccessLevelConfig(level as AccessLevel);
              return (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center w-6 h-6 rounded border",
                      getAccessLevelBadgeColor(level as AccessLevel)
                    )}
                  >
                    {getAccessLevelIcon(level as AccessLevel)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {config?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
