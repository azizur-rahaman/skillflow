"use client";

import React from "react";
import { useRBAC } from "../../context/RBACContext";
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
import { cn } from "@/lib/utils";
import { Users, Shield, Eye, Crown } from "lucide-react";

interface RoleSelectorProps {
  className?: string;
}

const getRoleIcon = (roleId: string) => {
  switch (roleId) {
    case "admin":
      return <Crown className="w-4 h-4" />;
    case "manager":
      return <Shield className="w-4 h-4" />;
    case "analyst":
      return <Eye className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
};

export function RoleSelector({ className }: RoleSelectorProps) {
  const { permissionMatrix, selectedRole, setSelectedRole } = useRBAC();

  const handleRoleSelect = (roleId: string) => {
    const role = permissionMatrix.roles.find((r) => r.id === roleId) || null;
    setSelectedRole(role);
  };

  return (
    <Card className={cn("p-6 bg-card border-border rounded-2xl", className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Role Selection
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a role to view and modify its permissions
          </p>
        </div>

        <Select value={selectedRole?.id || ""} onValueChange={handleRoleSelect}>
          <SelectTrigger className="w-full bg-input border-border rounded-xl">
            <SelectValue placeholder="Select a role to manage permissions">
              {selectedRole && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedRole.color }}
                  />
                  <div className="flex items-center gap-2">
                    {getRoleIcon(selectedRole.id)}
                    <span className="font-medium">{selectedRole.name}</span>
                  </div>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-card border-border rounded-xl">
            {permissionMatrix.roles.map((role) => (
              <SelectItem
                key={role.id}
                value={role.id}
                className="hover:bg-accent focus:bg-accent"
              >
                <div className="flex items-center gap-3 py-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <div className="flex items-center gap-2">
                    {getRoleIcon(role.id)}
                    <span className="font-medium">{role.name}</span>
                    {role.isSystemRole && (
                      <Badge variant="secondary" className="text-xs">
                        System
                      </Badge>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedRole && (
          <div className="space-y-3 pt-4 border-t border-border">
            <div>
              <h4 className="font-medium text-foreground mb-1">
                {selectedRole.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedRole.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: selectedRole.color,
                  color: selectedRole.color,
                }}
              >
                {selectedRole.isSystemRole ? "System Role" : "Custom Role"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Created {selectedRole.createdAt.toLocaleDateString()}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setSelectedRole(null)}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Role Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {permissionMatrix.roles.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Roles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">
              {permissionMatrix.permissions.length}
            </div>
            <div className="text-xs text-muted-foreground">Permissions</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
