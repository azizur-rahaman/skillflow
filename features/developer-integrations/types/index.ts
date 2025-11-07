/**
 * Developer Integrations Types
 * API key management and endpoint documentation for external integrations
 */

export type APIKeyStatus = "active" | "inactive" | "expired" | "revoked";

export type PermissionScope =
  | "read"
  | "write"
  | "admin"
  | "analytics"
  | "webhooks";

export type EndpointCategory =
  | "skills"
  | "users"
  | "analytics"
  | "webhooks"
  | "authentication";

export interface APIKey {
  id: string;
  name: string;
  description?: string;
  key: string; // Masked for display
  fullKey?: string; // Only shown temporarily
  status: APIKeyStatus;
  permissions: PermissionScope[];
  createdAt: Date;
  lastUsed?: Date;
  expiresAt?: Date;
  usageCount: number;
  rateLimit: number;
  createdBy: string;
  environment: "development" | "staging" | "production";
}

export interface APIEndpoint {
  id: string;
  category: EndpointCategory;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  authentication: boolean;
  rateLimited: boolean;
  exampleRequest?: string;
  exampleResponse?: string;
}

export interface APIParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface APIResponse {
  status: number;
  description: string;
  schema?: Record<string, unknown>;
  example?: string;
}

export interface CodeSample {
  language: "curl" | "javascript" | "python" | "go" | "php";
  title: string;
  code: string;
  description?: string;
}

export interface DeveloperIntegrationsState {
  apiKeys: APIKey[];
  endpoints: APIEndpoint[];
  codeSamples: CodeSample[];
  loading: boolean;
  error: string | null;
  selectedKeyId: string | null;
  showCreateModal: boolean;
  showRegenerateModal: boolean;
  filters: {
    status?: APIKeyStatus[];
    environment?: ("development" | "staging" | "production")[];
    category?: EndpointCategory[];
  };
}

export interface DeveloperIntegrationsContextType {
  state: DeveloperIntegrationsState;
  actions: {
    loadAPIKeys: () => Promise<void>;
    loadEndpoints: () => Promise<void>;
    createAPIKey: (keyData: Partial<APIKey>) => Promise<void>;
    updateAPIKey: (id: string, updates: Partial<APIKey>) => Promise<void>;
    deleteAPIKey: (id: string) => Promise<void>;
    regenerateAPIKey: (id: string) => Promise<void>;
    revokeAPIKey: (id: string) => Promise<void>;
    copyAPIKey: (key: string) => Promise<void>;
    setSelectedKey: (id: string | null) => void;
    setFilters: (
      filters: Partial<DeveloperIntegrationsState["filters"]>
    ) => void;
    toggleCreateModal: () => void;
    toggleRegenerateModal: () => void;
  };
}
