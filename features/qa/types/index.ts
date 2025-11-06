/**
 * QA Test Monitoring Dashboard Feature Types
 * Following SkillFlow Nexus architecture patterns
 */

export type TestStatus = "passed" | "failed" | "skipped" | "running" | "queued";

export type TestType =
  | "unit"
  | "integration"
  | "e2e"
  | "api"
  | "performance"
  | "security";

export type CoverageType = "line" | "branch" | "function" | "statement";

export interface TestRun {
  id: string;
  name: string;
  type: TestType;
  status: TestStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in milliseconds
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  branch: string;
  commit: string;
  triggeredBy: string;
  environment: string;
  logsUrl?: string;
  reportUrl?: string;
}

export interface TestResult {
  id: string;
  testRunId: string;
  name: string;
  status: TestStatus;
  duration: number;
  errorMessage?: string;
  stackTrace?: string;
  category: string;
  file?: string;
  line?: number;
}

export interface CoverageMetric {
  type: CoverageType;
  covered: number;
  total: number;
  percentage: number;
}

export interface CoverageReport {
  id: string;
  testRunId: string;
  timestamp: Date;
  overall: number;
  metrics: CoverageMetric[];
  files: CoverageFile[];
  reportUrl?: string;
}

export interface CoverageFile {
  name: string;
  path: string;
  coveredLines: number;
  totalLines: number;
  coverage: number;
  functions: number;
  coveredFunctions: number;
}

export interface QADashboard {
  recentRuns: TestRun[];
  coverageReport: CoverageReport | null;
  stats: QAStats;
  lastUpdated: Date;
}

export interface QAStats {
  totalRuns: number;
  successRate: number;
  averageDuration: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  coverage: number;
  trend: "up" | "down" | "stable";
}

export interface DownloadRequest {
  type: "logs" | "report" | "coverage";
  testRunId?: string;
  format: "json" | "html" | "xml" | "pdf";
}

export interface TestFilter {
  status?: TestStatus[];
  type?: TestType[];
  branch?: string;
  environment?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// Status configuration for UI
export interface StatusConfig {
  status: TestStatus;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

// Predefined status configurations
export const TEST_STATUSES: StatusConfig[] = [
  {
    status: "passed",
    label: "Passed",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    icon: "CheckCircle",
    description: "Test completed successfully",
  },
  {
    status: "failed",
    label: "Failed",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    icon: "XCircle",
    description: "Test failed with errors",
  },
  {
    status: "skipped",
    label: "Skipped",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    icon: "Minus",
    description: "Test was skipped",
  },
  {
    status: "running",
    label: "Running",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: "Loader2",
    description: "Test is currently running",
  },
  {
    status: "queued",
    label: "Queued",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/20",
    icon: "Clock",
    description: "Test is queued for execution",
  },
];

// Test type configurations
export const TEST_TYPES: {
  type: TestType;
  label: string;
  icon: string;
  color: string;
}[] = [
  { type: "unit", label: "Unit Tests", icon: "Code", color: "#10B981" },
  { type: "integration", label: "Integration", icon: "Link", color: "#3B82F6" },
  { type: "e2e", label: "E2E Tests", icon: "Monitor", color: "#8B5CF6" },
  { type: "api", label: "API Tests", icon: "Server", color: "#F59E0B" },
  { type: "performance", label: "Performance", icon: "Zap", color: "#EF4444" },
  { type: "security", label: "Security", icon: "Shield", color: "#6366F1" },
];

// Mock data for development
export const MOCK_TEST_RUNS: TestRun[] = [
  {
    id: "run-001",
    name: "CI Pipeline - Main Branch",
    type: "integration",
    status: "passed",
    startTime: new Date("2024-11-06T10:00:00Z"),
    endTime: new Date("2024-11-06T10:15:30Z"),
    duration: 930000,
    totalTests: 245,
    passedTests: 240,
    failedTests: 3,
    skippedTests: 2,
    branch: "main",
    commit: "a1b2c3d4",
    triggeredBy: "GitHub Actions",
    environment: "staging",
    logsUrl: "/logs/run-001.txt",
    reportUrl: "/reports/run-001.html",
  },
  {
    id: "run-002",
    name: "Unit Test Suite",
    type: "unit",
    status: "failed",
    startTime: new Date("2024-11-06T09:30:00Z"),
    endTime: new Date("2024-11-06T09:45:15Z"),
    duration: 915000,
    totalTests: 180,
    passedTests: 175,
    failedTests: 5,
    skippedTests: 0,
    branch: "feature/auth",
    commit: "e5f6g7h8",
    triggeredBy: "John Doe",
    environment: "development",
    logsUrl: "/logs/run-002.txt",
    reportUrl: "/reports/run-002.html",
  },
  {
    id: "run-003",
    name: "E2E Test Suite",
    type: "e2e",
    status: "running",
    startTime: new Date("2024-11-06T11:00:00Z"),
    totalTests: 45,
    passedTests: 32,
    failedTests: 0,
    skippedTests: 0,
    branch: "main",
    commit: "i9j0k1l2",
    triggeredBy: "Scheduled",
    environment: "production",
    logsUrl: "/logs/run-003.txt",
  },
  {
    id: "run-004",
    name: "API Tests",
    type: "api",
    status: "passed",
    startTime: new Date("2024-11-06T08:00:00Z"),
    endTime: new Date("2024-11-06T08:12:45Z"),
    duration: 765000,
    totalTests: 67,
    passedTests: 67,
    failedTests: 0,
    skippedTests: 0,
    branch: "main",
    commit: "m3n4o5p6",
    triggeredBy: "GitHub Actions",
    environment: "staging",
    logsUrl: "/logs/run-004.txt",
    reportUrl: "/reports/run-004.html",
  },
  {
    id: "run-005",
    name: "Performance Tests",
    type: "performance",
    status: "queued",
    startTime: new Date("2024-11-06T12:00:00Z"),
    totalTests: 12,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    branch: "main",
    commit: "q7r8s9t0",
    triggeredBy: "Scheduled",
    environment: "performance",
  },
];

export const MOCK_COVERAGE_REPORT: CoverageReport = {
  id: "coverage-001",
  testRunId: "run-001",
  timestamp: new Date("2024-11-06T10:15:30Z"),
  overall: 87.5,
  metrics: [
    { type: "line", covered: 15420, total: 17650, percentage: 87.4 },
    { type: "branch", covered: 3240, total: 3650, percentage: 88.8 },
    { type: "function", covered: 1250, total: 1420, percentage: 88.0 },
    { type: "statement", covered: 16890, total: 19200, percentage: 87.9 },
  ],
  files: [
    {
      name: "auth.service.ts",
      path: "src/services/auth.service.ts",
      coveredLines: 145,
      totalLines: 160,
      coverage: 90.6,
      functions: 12,
      coveredFunctions: 12,
    },
    {
      name: "user.model.ts",
      path: "src/models/user.model.ts",
      coveredLines: 89,
      totalLines: 95,
      coverage: 93.7,
      functions: 8,
      coveredFunctions: 8,
    },
  ],
  reportUrl: "/coverage/coverage-001.html",
};

export const MOCK_QA_STATS: QAStats = {
  totalRuns: 156,
  successRate: 92.3,
  averageDuration: 845000, // ~14 minutes
  totalTests: 12450,
  passedTests: 11480,
  failedTests: 720,
  coverage: 87.5,
  trend: "up",
};
