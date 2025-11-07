import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAdminConsole } from "../../context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Shield,
  Users,
  Settings,
  Edit,
  Download,
  Plus,
} from "lucide-react";

export const RolesSection: React.FC = () => {
  const { state } = useAdminConsole();
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

  // Filter roles based on search
  const filteredRoles = useMemo(() => {
    return state.roles.filter(
      (role) =>
        !state.searchQuery ||
        role.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }, [state.roles, state.searchQuery]);

  const getPermissionBadge = (permission: string) => {
    const variants: Record<string, string> = {
      read: "bg-blue-500/20 text-blue-300",
      write: "bg-green-500/20 text-green-300",
      delete: "bg-red-500/20 text-red-300",
      admin: "bg-purple-500/20 text-purple-300",
    };

    return (
      <Badge className={variants[permission] || "bg-gray-500/20 text-gray-300"}>
        {permission.charAt(0).toUpperCase() + permission.slice(1)}
      </Badge>
    );
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return <Shield className="w-5 h-5 text-purple-400" />;
      case "manager":
        return <Settings className="w-5 h-5 text-blue-400" />;
      case "user":
        return <Users className="w-5 h-5 text-green-400" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Roles & Permissions</h2>
          <p className="text-gray-400">
            Manage user roles and access permissions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <Card
            key={role.id}
            className="bg-gray-800/50 border-gray-700 p-6 hover:bg-gray-800/70 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getRoleIcon(role.name)}
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {role.name}
                  </h3>
                  <p className="text-sm text-gray-400">{role.description}</p>
                </div>
              </div>

              <div
                className="relative"
                ref={dropdownOpen === role.id ? dropdownRef : null}
              >
                <button
                  onClick={() =>
                    setDropdownOpen(dropdownOpen === role.id ? null : role.id)
                  }
                  className="text-gray-400 hover:text-white p-1"
                  title={`Actions for ${role.name} role`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {dropdownOpen === role.id && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                    <div className="py-1">
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Role
                      </button>
                      <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">
                  Permissions
                </span>
                <Badge className="bg-gray-700 text-gray-300">
                  {role.permissions.length} permission
                  {role.permissions.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {role.permissions.slice(0, 4).map((permission) => (
                  <span key={permission} className="text-xs">
                    {getPermissionBadge(permission)}
                  </span>
                ))}
                {role.permissions.length > 4 && (
                  <Badge className="bg-gray-600/50 text-gray-400">
                    +{role.permissions.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            {/* User Count */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Assigned Users</span>
                <Badge className="bg-indigo-500/20 text-indigo-300">
                  {role.userCount} user{role.userCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Users className="w-3 h-3 mr-1" />
                Assign
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Settings className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <Card className="bg-gray-800/50 border-gray-700 p-12">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Roles Found
            </h3>
            <p className="text-gray-400 mb-6">
              No roles match your current search criteria.
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Role
            </Button>
          </div>
        </Card>
      )}

      {/* Role Creation Template */}
      <Card className="bg-linear-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              Create Custom Role
            </h3>
            <p className="text-gray-400">
              Define custom permissions and access levels for your organization
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Create Role
          </Button>
        </div>
      </Card>
    </div>
  );
};
