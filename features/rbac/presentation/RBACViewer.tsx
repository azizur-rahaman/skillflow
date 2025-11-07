"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Shield, Users, Settings } from "lucide-react";
import { RoleSelector } from "./components/RoleSelector";
import { SaveActions } from "./components/SaveActions";
import { PermissionMatrixTable } from "./components/PermissionMatrixTable";
import { RBACProvider } from "../context/RBACContext";

interface RBACViewerProps {
  className?: string;
}

function RBACContent({ className }: RBACViewerProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <Card className="p-6 bg-linear-to-r from-primary/5 to-secondary/5 border-border rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Role-Based Access Control
              </h1>
              <p className="text-muted-foreground">
                Manage permissions and access levels for all user roles in your
                organization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              <Users className="w-4 h-4 mr-2" />
              Enterprise Security
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Settings className="w-4 h-4 mr-2" />
              Admin Panel
            </Badge>
          </div>
        </div>
      </Card>

      {/* Controls Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RoleSelector />
        </div>
        <div className="lg:col-span-2">
          <SaveActions />
        </div>
      </div>

      {/* Permission Matrix */}
      <PermissionMatrixTable />
    </div>
  );
}

export function RBACViewer({ className }: RBACViewerProps) {
  return (
    <RBACProvider>
      <RBACContent className={className} />
    </RBACProvider>
  );
}
