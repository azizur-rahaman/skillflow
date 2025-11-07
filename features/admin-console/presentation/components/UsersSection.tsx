import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAdminConsole } from "../../context";
import { UserStatus, UserRole } from "../../types";
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
  UserCheck,
  UserX,
  Trash2,
  Edit,
  Filter,
  Download,
} from "lucide-react";

export const UsersSection: React.FC = () => {
  const { state, actions } = useAdminConsole();
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
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

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return state.users.filter((user) => {
      const matchesSearch =
        !state.searchQuery ||
        user.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        user.firstName
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(state.searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [state.users, state.searchQuery, statusFilter, roleFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      actions.setSelectedItems(filteredUsers.map((user) => user.id));
    } else {
      actions.clearSelection();
    }
  };

  const handleUserAction = async (
    action: "activate" | "deactivate" | "delete",
    userId: string
  ) => {
    switch (action) {
      case "activate":
        await actions.updateUserStatus(userId, "active");
        break;
      case "deactivate":
        await actions.updateUserStatus(userId, "inactive");
        break;
      case "delete":
        await actions.deleteUser(userId);
        break;
    }
  };

  const handleBatchAction = async (
    action: "activate" | "deactivate" | "delete"
  ) => {
    if (state.selectedItems.length === 0) return;

    await actions.batchAction(action, state.selectedItems);
  };

  const getStatusBadge = (status: UserStatus) => {
    const variants = {
      active: "bg-green-500/20 text-green-300",
      inactive: "bg-gray-500/20 text-gray-300",
      suspended: "bg-red-500/20 text-red-300",
      pending: "bg-yellow-500/20 text-yellow-300",
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      admin: "bg-purple-500/20 text-purple-300",
      manager: "bg-blue-500/20 text-blue-300",
      user: "bg-gray-500/20 text-gray-300",
      viewer: "bg-cyan-500/20 text-cyan-300",
    };

    return (
      <Badge className={variants[role]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Users</h2>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Add User
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
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as UserStatus | "all")
            }
          >
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={roleFilter}
            onValueChange={(value) => setRoleFilter(value as UserRole | "all")}
          >
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Batch Actions */}
      {state.selectedItems.length > 0 && (
        <Card className="bg-indigo-500/10 border-indigo-500/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-indigo-300">
              {state.selectedItems.length} user
              {state.selectedItems.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBatchAction("activate")}
                className="border-green-500/20 text-green-300 hover:bg-green-500/10"
              >
                <UserCheck className="w-4 h-4 mr-1" />
                Activate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBatchAction("deactivate")}
                className="border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/10"
              >
                <UserX className="w-4 h-4 mr-1" />
                Deactivate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBatchAction("delete")}
                className="border-red-500/20 text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Users Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={
                      filteredUsers.length > 0 &&
                      state.selectedItems.length === filteredUsers.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    title="Select all users"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-700 hover:bg-gray-700/20"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={state.selectedItems.includes(user.id)}
                      onChange={() => actions.toggleItemSelection(user.id)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      title={`Select ${user.firstName} ${user.lastName}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {user.department || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {user.skillsCount}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="relative"
                      ref={dropdownOpen === user.id ? dropdownRef : null}
                    >
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === user.id ? null : user.id
                          )
                        }
                        className="text-gray-400 hover:text-white p-1"
                        title={`Actions for ${user.firstName} ${user.lastName}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {dropdownOpen === user.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                          <div className="py-1">
                            <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </button>
                            <button
                              onClick={() => {
                                handleUserAction("activate", user.id);
                                setDropdownOpen(null);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-green-300 hover:text-green-200 hover:bg-green-500/10"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activate
                            </button>
                            <button
                              onClick={() => {
                                handleUserAction("deactivate", user.id);
                                setDropdownOpen(null);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Deactivate
                            </button>
                            <button
                              onClick={() => {
                                handleUserAction("delete", user.id);
                                setDropdownOpen(null);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No users found matching your criteria.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
