import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Key, RefreshCw, Trash2, Plus, Code, Zap } from "lucide-react";
import { useDeveloperIntegrations } from "../context";

export function DeveloperIntegrations() {
  const { state, actions } = useDeveloperIntegrations();
  const [activeTab, setActiveTab] = React.useState("api-keys");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30">
              <Code className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Developer Integrations
              </h1>
              <p className="text-slate-400 mt-2">
                Manage API keys and explore our developer tools
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab("api-keys")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "api-keys"
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Key className="w-4 h-4" />
              API Keys
            </button>
            <button
              onClick={() => setActiveTab("endpoints")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "endpoints"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Zap className="w-4 h-4" />
              Endpoints
            </button>
            <button
              onClick={() => setActiveTab("code-samples")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "code-samples"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <Code className="w-4 h-4" />
              Code Samples
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "api-keys" && <APIKeysSection />}
          {activeTab === "endpoints" && <EndpointsSection />}
          {activeTab === "code-samples" && <CodeSamplesSection />}
        </div>
      </div>
    </div>
  );
}

function APIKeysSection() {
  const { state, actions } = useDeveloperIntegrations();

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">API Keys</h2>
          <p className="text-slate-400">
            Manage your API keys for accessing SkillFlow data
          </p>
        </div>
        <Button
          onClick={actions.toggleCreateModal}
          className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* API Keys Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.apiKeys.map((key) => (
          <Card
            key={key.id}
            className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{key.name}</CardTitle>
                <Badge
                  variant={key.status === "active" ? "default" : "secondary"}
                  className={
                    key.status === "active"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-slate-500/20 text-slate-300"
                  }
                >
                  {key.status}
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                Created {key.createdAt.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Key Display */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-300">API Key</Label>
                <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded border border-slate-600">
                  <code className="flex-1 text-sm font-mono text-slate-300">
                    {key.key}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => actions.copyAPIKey(key.key)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-slate-400">Usage</Label>
                  <p className="text-white font-semibold">
                    {key.usageCount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-400">Rate Limit</Label>
                  <p className="text-white font-semibold">
                    {key.rateLimit.toLocaleString()}/hr
                  </p>
                </div>
              </div>

              {/* Permissions */}
              <div className="space-y-2">
                <Label className="text-sm text-slate-300">Permissions</Label>
                <div className="flex flex-wrap gap-1">
                  {key.permissions.map((permission) => (
                    <Badge
                      key={permission}
                      variant="outline"
                      className="text-xs border-slate-600 text-slate-300"
                    >
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => actions.regenerateAPIKey(key.id)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Regenerate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => actions.revokeAPIKey(key.id)}
                  className="border-red-600 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Revoke
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create API Key Modal */}
      <CreateAPIKeyModal />
    </div>
  );
}

function EndpointsSection() {
  const { state } = useDeveloperIntegrations();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">API Endpoints</h2>
        <p className="text-slate-400">
          Explore available endpoints and their specifications
        </p>
      </div>

      <div className="grid gap-6">
        {state.endpoints.map((endpoint) => (
          <Card key={endpoint.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${
                      endpoint.method === "GET"
                        ? "bg-green-500/20 text-green-300"
                        : endpoint.method === "POST"
                        ? "bg-blue-500/20 text-blue-300"
                        : endpoint.method === "PUT"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {endpoint.method}
                  </Badge>
                  <CardTitle className="text-white font-mono">
                    {endpoint.path}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  {endpoint.category}
                </Badge>
              </div>
              <CardDescription className="text-slate-400">
                {endpoint.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Parameters */}
              {endpoint.parameters.length > 0 && (
                <div>
                  <Label className="text-sm text-slate-300 mb-2 block">
                    Parameters
                  </Label>
                  <div className="space-y-2">
                    {endpoint.parameters.map((param, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <code className="text-indigo-300">{param.name}</code>
                        <Badge
                          variant="outline"
                          className="text-xs border-slate-600"
                        >
                          {param.type}
                        </Badge>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        )}
                        <span className="text-slate-400 text-xs">
                          {param.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Responses */}
              <div>
                <Label className="text-sm text-slate-300 mb-2 block">
                  Responses
                </Label>
                <div className="space-y-1">
                  {endpoint.responses.map((response, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Badge
                        className={`${
                          response.status >= 200 && response.status < 300
                            ? "bg-green-500/20 text-green-300"
                            : response.status >= 400
                            ? "bg-red-500/20 text-red-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {response.status}
                      </Badge>
                      <span className="text-slate-300">
                        {response.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="flex gap-4 text-sm">
                {endpoint.authentication && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Key className="w-4 h-4" />
                    Requires Auth
                  </div>
                )}
                {endpoint.rateLimited && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Zap className="w-4 h-4" />
                    Rate Limited
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CodeSamplesSection() {
  const { state } = useDeveloperIntegrations();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Code Samples</h2>
        <p className="text-slate-400">
          Ready-to-use code examples for common integrations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {state.codeSamples.map((sample, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{sample.title}</CardTitle>
                <Badge
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  {sample.language}
                </Badge>
              </div>
              {sample.description && (
                <CardDescription className="text-slate-400">
                  {sample.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-900/50 p-4 rounded border border-slate-600 overflow-x-auto">
                <code className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
                  {sample.code}
                </code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigator.clipboard.writeText(sample.code)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CreateAPIKeyModal() {
  const { state, actions } = useDeveloperIntegrations();
  const [formData, setFormData] = React.useState<{
    name: string;
    environment: "development" | "staging" | "production";
    permissions: string[];
  }>({
    name: "",
    environment: "development",
    permissions: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.createAPIKey({
      ...formData,
      permissions: formData.permissions as (
        | "read"
        | "write"
        | "admin"
        | "analytics"
      )[],
    });
    actions.toggleCreateModal();
    setFormData({ name: "", environment: "development", permissions: [] });
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <Dialog
      open={state.showCreateModal}
      onOpenChange={actions.toggleCreateModal}
    >
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create New API Key</DialogTitle>
          <DialogDescription className="text-slate-400">
            Generate a new API key for accessing SkillFlow data
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              Key Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Production API Key"
              className="bg-slate-900 border-slate-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Environment</Label>
            <Select
              value={formData.environment}
              onValueChange={(
                value: "development" | "staging" | "production"
              ) => setFormData((prev) => ({ ...prev, environment: value }))}
            >
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="production">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-300">Permissions</Label>
            <div className="grid grid-cols-2 gap-3">
              {["read", "write", "admin", "analytics"].map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Switch
                    id={permission}
                    checked={formData.permissions.includes(permission)}
                    onCheckedChange={() => togglePermission(permission)}
                  />
                  <Label
                    htmlFor={permission}
                    className="text-slate-300 capitalize"
                  >
                    {permission}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={actions.toggleCreateModal}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              disabled={state.loading}
            >
              {state.loading ? "Creating..." : "Create Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
