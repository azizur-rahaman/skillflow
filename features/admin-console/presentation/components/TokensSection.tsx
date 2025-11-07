import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAdminConsole } from "../../context";
import { TokenType } from "../../types";
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
  Key,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Download,
} from "lucide-react";

export const TokensSection: React.FC = () => {
  const { state, actions } = useAdminConsole();
  const [typeFilter, setTypeFilter] = useState<TokenType | "all">("all");
  const [activeFilter, setActiveFilter] = useState<boolean | "all">("all");
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

  // Filter and search tokens
  const filteredTokens = useMemo(() => {
    return state.tokens.filter((token) => {
      const matchesSearch =
        !state.searchQuery ||
        token.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        token.userEmail.toLowerCase().includes(state.searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || token.type === typeFilter;
      const matchesActive =
        activeFilter === "all" || token.isActive === activeFilter;

      return matchesSearch && matchesType && matchesActive;
    });
  }, [state.tokens, state.searchQuery, typeFilter, activeFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      actions.setSelectedItems(filteredTokens.map((token) => token.id));
    } else {
      actions.clearSelection();
    }
  };

  const handleTokenAction = async (
    action: "revoke" | "delete",
    tokenId: string
  ) => {
    switch (action) {
      case "revoke":
        await actions.revokeToken(tokenId);
        break;
      case "delete":
        await actions.deleteToken(tokenId);
        break;
    }
  };

  const handleBatchAction = async (action: "revoke" | "delete") => {
    if (state.selectedItems.length === 0) return;

    // For now, handle revoke as a batch action on individual tokens
    if (action === "revoke") {
      for (const tokenId of state.selectedItems) {
        await actions.revokeToken(tokenId);
      }
    } else if (action === "delete") {
      for (const tokenId of state.selectedItems) {
        await actions.deleteToken(tokenId);
      }
    }
  };

  const getTypeBadge = (type: TokenType) => {
    const variants: Record<TokenType, string> = {
      api: "bg-blue-500/20 text-blue-300",
      access: "bg-purple-500/20 text-purple-300",
      refresh: "bg-cyan-500/20 text-cyan-300",
      service: "bg-indigo-500/20 text-indigo-300",
    };

    return (
      <Badge className={variants[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getActiveBadge = (isActive: boolean) => {
    return (
      <Badge
        className={
          isActive
            ? "bg-green-500/20 text-green-300"
            : "bg-red-500/20 text-red-300"
        }
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">API Tokens</h2>
          <p className="text-gray-400">
            Manage authentication tokens and API access
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Key className="w-4 h-4 mr-2" />
            Create Token
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
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as TokenType | "all")}
          >
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="access">Access</SelectItem>
              <SelectItem value="refresh">Refresh</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={activeFilter.toString()}
            onValueChange={(value) =>
              setActiveFilter(value === "all" ? "all" : value === "true")
            }
          >
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Batch Actions */}
      {state.selectedItems.length > 0 && (
        <Card className="bg-indigo-500/10 border-indigo-500/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-indigo-300">
              {state.selectedItems.length} token
              {state.selectedItems.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBatchAction("revoke")}
                className="border-red-500/20 text-red-300 hover:bg-red-500/10"
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Revoke
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

      {/* Tokens Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-6 py-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={
                      filteredTokens.length > 0 &&
                      state.selectedItems.length === filteredTokens.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    title="Select all tokens"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token) => (
                <tr
                  key={token.id}
                  className="border-b border-gray-700 hover:bg-gray-700/20"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={state.selectedItems.includes(token.id)}
                      onChange={() => actions.toggleItemSelection(token.id)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      title={`Select token ${token.name}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Key className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white truncate">
                          {token.name}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          Permissions: {token.permissions.join(", ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTypeBadge(token.type)}</td>
                  <td className="px-6 py-4">
                    {getActiveBadge(token.isActive)}
                  </td>
                  <td className="px-6 py-4 text-gray-300">{token.userEmail}</td>
                  <td className="px-6 py-4 text-gray-300">
                    {token.expiresAt
                      ? new Date(token.expiresAt).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {token.lastUsed
                      ? new Date(token.lastUsed).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="relative"
                      ref={dropdownOpen === token.id ? dropdownRef : null}
                    >
                      <button
                        onClick={() =>
                          setDropdownOpen(
                            dropdownOpen === token.id ? null : token.id
                          )
                        }
                        className="text-gray-400 hover:text-white p-1"
                        title={`Actions for ${token.name}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {dropdownOpen === token.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                          <div className="py-1">
                            <button className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                handleTokenAction("revoke", token.id);
                                setDropdownOpen(null);
                              }}
                              className="w-full flex items-center px-4 py-2 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10"
                            >
                              <EyeOff className="w-4 h-4 mr-2" />
                              Revoke
                            </button>
                            <button
                              onClick={() => {
                                handleTokenAction("delete", token.id);
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

        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No tokens found matching your criteria.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
