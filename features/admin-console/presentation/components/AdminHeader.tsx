import React from "react";
import { useAdminConsole } from "../../context";
import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const AdminHeader: React.FC = () => {
  const { state, actions } = useAdminConsole();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={`Search ${state.currentSection}...`}
              value={state.searchQuery}
              onChange={handleSearchChange}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Selected Items Count */}
          {state.selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">
                {state.selectedItems.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={actions.clearSelection}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Clear
              </Button>
            </div>
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Bell className="w-4 h-4" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-300">Admin</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-sm text-red-400">{state.error}</span>
          </div>
        </div>
      )}
    </header>
  );
};
