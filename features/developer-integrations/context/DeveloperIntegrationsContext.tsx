"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import {
  DeveloperIntegrationsState,
  DeveloperIntegrationsContextType,
  APIKey,
  APIEndpoint,
  CodeSample,
} from "../types";

const generateMockAPIKeys = (): APIKey[] => [
  {
    id: "key_1",
    name: "Production API Key",
    key: "sk_prod_••••••••••••••••••••••••••••••••",
    status: "active",
    permissions: ["read", "write", "analytics"],
    createdAt: new Date("2024-01-15"),
    lastUsed: new Date("2024-01-20"),
    usageCount: 15420,
    rateLimit: 50000,
    createdBy: "admin@skillflow.com",
    environment: "production",
  },
  {
    id: "key_2",
    name: "Development API Key",
    key: "sk_dev_••••••••••••••••••••••••••••••••",
    status: "active",
    permissions: ["read", "write", "admin"],
    createdAt: new Date("2024-01-10"),
    lastUsed: new Date("2024-01-19"),
    usageCount: 2340,
    rateLimit: 10000,
    createdBy: "dev@skillflow.com",
    environment: "development",
  },
  {
    id: "key_3",
    name: "Analytics Integration",
    key: "sk_analytics_••••••••••••••••••••••••••••••••",
    status: "inactive",
    permissions: ["read", "analytics"],
    createdAt: new Date("2023-12-01"),
    lastUsed: new Date("2023-12-15"),
    usageCount: 0,
    rateLimit: 25000,
    createdBy: "analytics@skillflow.com",
    environment: "production",
  },
];

const generateMockEndpoints = (): APIEndpoint[] => [
  {
    id: "endpoint_1",
    category: "skills",
    method: "GET",
    path: "/api/skills",
    description: "Retrieve a list of skills with optional filtering",
    parameters: [
      {
        name: "limit",
        type: "number",
        required: false,
        description: "Maximum number of skills to return (default: 50)",
      },
      {
        name: "offset",
        type: "number",
        required: false,
        description: "Number of skills to skip (default: 0)",
      },
      {
        name: "category",
        type: "string",
        required: false,
        description: "Filter skills by category",
      },
    ],
    responses: [
      { status: 200, description: "Success" },
      { status: 400, description: "Bad Request" },
    ],
    authentication: true,
    rateLimited: true,
  },
  {
    id: "endpoint_2",
    category: "skills",
    method: "POST",
    path: "/api/skills",
    description: "Create a new skill in the system",
    parameters: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Name of the skill",
      },
      {
        name: "category",
        type: "string",
        required: true,
        description: "Category the skill belongs to",
      },
      {
        name: "description",
        type: "string",
        required: false,
        description: "Optional description of the skill",
      },
    ],
    responses: [
      { status: 201, description: "Created" },
      { status: 400, description: "Bad Request" },
    ],
    authentication: true,
    rateLimited: true,
  },
  {
    id: "endpoint_3",
    category: "users",
    method: "GET",
    path: "/api/users/{userId}",
    description: "Retrieve detailed information about a specific user",
    parameters: [
      {
        name: "userId",
        type: "string",
        required: true,
        description: "Unique identifier of the user",
      },
      {
        name: "includeSkills",
        type: "boolean",
        required: false,
        description: "Include user skills in the response (default: false)",
      },
    ],
    responses: [
      { status: 200, description: "Success" },
      { status: 404, description: "User not found" },
    ],
    authentication: true,
    rateLimited: true,
  },
  {
    id: "endpoint_4",
    category: "analytics",
    method: "GET",
    path: "/api/analytics/{metric}",
    description: "Retrieve analytics data for a specific metric",
    parameters: [
      {
        name: "metric",
        type: "string",
        required: true,
        description:
          'The analytics metric to retrieve (e.g., "skills_growth", "user_engagement")',
      },
      {
        name: "startDate",
        type: "string",
        required: false,
        description: "Start date for the analytics period (ISO 8601 format)",
      },
      {
        name: "endDate",
        type: "string",
        required: false,
        description: "End date for the analytics period (ISO 8601 format)",
      },
    ],
    responses: [
      { status: 200, description: "Success" },
      { status: 400, description: "Bad Request" },
    ],
    authentication: true,
    rateLimited: true,
  },
];

const generateMockCodeSamples = (): CodeSample[] => [
  {
    language: "curl",
    title: "Get Skills List",
    code: `curl -X GET "https://api.skillflow.com/v1/skills?limit=10" \\
  -H "Authorization: Bearer sk_live_your_api_key_here" \\
  -H "Content-Type: application/json"`,
    description: "Retrieve the first 10 skills from SkillFlow API",
  },
  {
    language: "javascript",
    title: "Fetch User Skills",
    code: `const API_KEY = 'sk_live_your_api_key_here';
const BASE_URL = 'https://api.skillflow.com/v1';

async function getUserSkills(userId) {
  try {
    const response = await fetch(\`\${BASE_URL}/users/\${userId}/skills\`, {
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return data.skills;
  } catch (error) {
    console.error('Error fetching user skills:', error);
  }
}`,
    description: "JavaScript example using fetch API",
  },
  {
    language: "python",
    title: "Skills Analytics",
    code: `import requests
import json

API_KEY = 'sk_live_your_api_key_here'
BASE_URL = 'https://api.skillflow.com/v1'

def get_skills_analytics():
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }

    try:
        response = requests.get(f'{BASE_URL}/analytics/skills', headers=headers)
        response.raise_for_status()

        data = response.json()
        return data['analytics']
    except requests.exceptions.RequestException as e:
        print(f'Error fetching analytics: {e}')
        return None

# Usage
analytics = get_skills_analytics()
if analytics:
    print(json.dumps(analytics, indent=2))`,
    description: "Python example with error handling",
  },
];

const initialState: DeveloperIntegrationsState = {
  apiKeys: generateMockAPIKeys(),
  endpoints: generateMockEndpoints(),
  codeSamples: generateMockCodeSamples(),
  loading: false,
  error: null,
  selectedKeyId: null,
  showCreateModal: false,
  showRegenerateModal: false,
  filters: {},
};

type DeveloperIntegrationsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_API_KEYS"; payload: APIKey[] }
  | { type: "SET_ENDPOINTS"; payload: APIEndpoint[] }
  | { type: "SET_CODE_SAMPLES"; payload: CodeSample[] }
  | { type: "ADD_API_KEY"; payload: APIKey }
  | {
      type: "UPDATE_API_KEY";
      payload: { id: string; updates: Partial<APIKey> };
    }
  | { type: "DELETE_API_KEY"; payload: string }
  | { type: "SET_SELECTED_KEY"; payload: string | null }
  | {
      type: "SET_FILTERS";
      payload: Partial<DeveloperIntegrationsState["filters"]>;
    }
  | { type: "TOGGLE_CREATE_MODAL" }
  | { type: "TOGGLE_REGENERATE_MODAL" };

function developerIntegrationsReducer(
  state: DeveloperIntegrationsState,
  action: DeveloperIntegrationsAction
): DeveloperIntegrationsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_API_KEYS":
      return { ...state, apiKeys: action.payload };
    case "SET_ENDPOINTS":
      return { ...state, endpoints: action.payload };
    case "SET_CODE_SAMPLES":
      return { ...state, codeSamples: action.payload };
    case "ADD_API_KEY":
      return { ...state, apiKeys: [...state.apiKeys, action.payload] };
    case "UPDATE_API_KEY":
      return {
        ...state,
        apiKeys: state.apiKeys.map((key) =>
          key.id === action.payload.id
            ? { ...key, ...action.payload.updates }
            : key
        ),
      };
    case "DELETE_API_KEY":
      return {
        ...state,
        apiKeys: state.apiKeys.filter((key) => key.id !== action.payload),
      };
    case "SET_SELECTED_KEY":
      return { ...state, selectedKeyId: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "TOGGLE_CREATE_MODAL":
      return { ...state, showCreateModal: !state.showCreateModal };
    case "TOGGLE_REGENERATE_MODAL":
      return { ...state, showRegenerateModal: !state.showRegenerateModal };
    default:
      return state;
  }
}

const DeveloperIntegrationsContext = createContext<
  DeveloperIntegrationsContextType | undefined
>(undefined);

export function DeveloperIntegrationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    developerIntegrationsReducer,
    initialState
  );

  const loadAPIKeys = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockKeys = generateMockAPIKeys();
      dispatch({ type: "SET_API_KEYS", payload: mockKeys });
    } catch (error) {
      console.error("Failed to load API keys:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load API keys" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const loadEndpoints = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockEndpoints = generateMockEndpoints();
      dispatch({ type: "SET_ENDPOINTS", payload: mockEndpoints });
    } catch (error) {
      console.error("Failed to load endpoints:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load endpoints" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const createAPIKey = useCallback(async (keyData: Partial<APIKey>) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name: keyData.name || "New API Key",
        description: keyData.description,
        key: `sk_${
          keyData.environment || "dev"
        }_••••••••••••••••••••••••••••••••`,
        status: "active",
        permissions: keyData.permissions || ["read"],
        createdAt: new Date(),
        usageCount: 0,
        rateLimit: keyData.rateLimit || 100,
        createdBy: "current.user@skillflow.com",
        environment: keyData.environment || "development",
        ...keyData,
      };
      dispatch({ type: "ADD_API_KEY", payload: newKey });
      dispatch({ type: "TOGGLE_CREATE_MODAL" });
    } catch (error) {
      console.error("Failed to create API key:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to create API key" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const updateAPIKey = useCallback(
    async (id: string, updates: Partial<APIKey>) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        dispatch({ type: "UPDATE_API_KEY", payload: { id, updates } });
      } catch (error) {
        console.error("Failed to update API key:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to update API key" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    []
  );

  const deleteAPIKey = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch({ type: "DELETE_API_KEY", payload: id });
    } catch (error) {
      console.error("Failed to delete API key:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to delete API key" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const regenerateAPIKey = useCallback(async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newKey = `sk_regen_${Date.now()
        .toString()
        .slice(-12)}_••••••••••••••••••••••••••••••••`;
      dispatch({
        type: "UPDATE_API_KEY",
        payload: { id, updates: { key: newKey } },
      });
      dispatch({ type: "TOGGLE_REGENERATE_MODAL" });
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to regenerate API key" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const revokeAPIKey = useCallback(
    async (id: string) => {
      await updateAPIKey(id, { status: "revoked" });
    },
    [updateAPIKey]
  );

  const copyAPIKey = useCallback(async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
    } catch (error) {
      console.error("Failed to copy API key:", error);
    }
  }, []);

  const setSelectedKey = useCallback((id: string | null) => {
    dispatch({ type: "SET_SELECTED_KEY", payload: id });
  }, []);

  const setFilters = useCallback(
    (filters: Partial<DeveloperIntegrationsState["filters"]>) => {
      dispatch({ type: "SET_FILTERS", payload: filters });
    },
    []
  );

  const toggleCreateModal = useCallback(() => {
    dispatch({ type: "TOGGLE_CREATE_MODAL" });
  }, []);

  const toggleRegenerateModal = useCallback(() => {
    dispatch({ type: "TOGGLE_REGENERATE_MODAL" });
  }, []);

  const contextValue: DeveloperIntegrationsContextType = {
    state,
    actions: {
      loadAPIKeys,
      loadEndpoints,
      createAPIKey,
      updateAPIKey,
      deleteAPIKey,
      regenerateAPIKey,
      revokeAPIKey,
      copyAPIKey,
      setSelectedKey,
      setFilters,
      toggleCreateModal,
      toggleRegenerateModal,
    },
  };

  return (
    <DeveloperIntegrationsContext.Provider value={contextValue}>
      {children}
    </DeveloperIntegrationsContext.Provider>
  );
}

export function useDeveloperIntegrations(): DeveloperIntegrationsContextType {
  const context = useContext(DeveloperIntegrationsContext);
  if (context === undefined) {
    throw new Error(
      "useDeveloperIntegrations must be used within a DeveloperIntegrationsProvider"
    );
  }
  return context;
}
