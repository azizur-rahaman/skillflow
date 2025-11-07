/**
 * Demo Mode Showcase Page
 * Demonstrates the demo mode functionality for sales presentations
 */

"use client";

import {
  DemoModeProvider,
  DemoModeManager,
  DemoModeWrapper,
  useDemoAware,
} from "../../features/demo-mode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Plus,
  Trash2,
  Edit,
  Send,
  Download,
  Upload,
  Settings,
  User,
  Shield,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

function DemoContent() {
  const { isDemoMode, isActionAllowed, demoMessage } = useDemoAware();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-linear-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
          SkillFlow Demo Mode
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience SkillFlow in a safe demo environment. All actions are
          simulated for presentation purposes.
        </p>
        {isDemoMode && (
          <Badge
            variant="secondary"
            className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
          >
            <Shield className="w-4 h-4 mr-2" />
            Demo Mode Active
          </Badge>
        )}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Token Wallet
            </CardTitle>
            <CardDescription>Manage your SkillFlow tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Balance</span>
              <span className="font-semibold">1,250 SKILL</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!isActionAllowed("withdraw")}
                title={!isActionAllowed("withdraw") ? demoMessage : undefined}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!isActionAllowed("deposit")}
                title={!isActionAllowed("deposit") ? demoMessage : undefined}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Management
            </CardTitle>
            <CardDescription>Update your professional profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Full Name"
              defaultValue="John Doe"
              disabled={!isActionAllowed("edit")}
            />
            <Input
              placeholder="Email"
              defaultValue="john@example.com"
              disabled={!isActionAllowed("edit")}
            />
            <Button
              className="w-full"
              disabled={!isActionAllowed("save")}
              title={!isActionAllowed("save") ? demoMessage : undefined}
            >
              <Edit className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Credentials Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Credentials
            </CardTitle>
            <CardDescription>Manage your verified skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary">React Expert</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Node.js</Badge>
            </div>
            <Button
              variant="outline"
              className="w-full"
              disabled={!isActionAllowed("mint-token")}
              title={!isActionAllowed("mint-token") ? demoMessage : undefined}
            >
              <Plus className="w-4 h-4 mr-2" />
              Mint New Credential
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-border/50 my-8" />

      {/* Action Buttons Demo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Demo Actions</h2>
        <p className="text-muted-foreground">
          These buttons demonstrate how demo mode restricts certain actions
          while allowing safe exploration.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button
            disabled={!isActionAllowed("create")}
            title={!isActionAllowed("create") ? demoMessage : undefined}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>

          <Button
            variant="outline"
            disabled={!isActionAllowed("delete")}
            title={!isActionAllowed("delete") ? demoMessage : undefined}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Item
          </Button>

          <Button
            variant="secondary"
            disabled={!isActionAllowed("connect-wallet")}
            title={!isActionAllowed("connect-wallet") ? demoMessage : undefined}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>

          <Button
            disabled={!isActionAllowed("submit")}
            title={!isActionAllowed("submit") ? demoMessage : undefined}
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Form
          </Button>

          <Button
            variant="outline"
            disabled={!isActionAllowed("settings")}
            title={!isActionAllowed("settings") ? demoMessage : undefined}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="border-t border-border/50 my-8" />

      {/* Demo Mode Wrapper Example */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Component Wrapping</h2>
        <p className="text-muted-foreground">
          Components can be wrapped to show demo indicators and restrict
          interactions.
        </p>

        <DemoModeWrapper showDemoIndicator={true}>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Wrapped Component
              </CardTitle>
              <CardDescription>
                This card is wrapped with demo mode awareness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                When demo mode is active, this component shows a demo indicator
                badge.
              </p>
            </CardContent>
          </Card>
        </DemoModeWrapper>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <DemoModeProvider defaultEnabled={true}>
      <DemoModeManager showToggle={true}>
        <DemoContent />
      </DemoModeManager>
    </DemoModeProvider>
  );
}
