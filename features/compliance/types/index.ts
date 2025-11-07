/**
 * Compliance Dashboard Feature Types
 * Following SkillFlow Nexus architecture patterns
 */

export type ComplianceStatus =
  | "compliant"
  | "warning"
  | "non-compliant"
  | "pending";

export type ComplianceStandard =
  | "gdpr"
  | "iso27001"
  | "soc2"
  | "hipaa"
  | "pci-dss";

export interface ComplianceFramework {
  id: ComplianceStandard;
  name: string;
  fullName: string;
  description: string;
  category: "privacy" | "security" | "financial";
  icon: string;
  website: string;
  color: string;
}

export interface ComplianceResult {
  id: string;
  frameworkId: ComplianceStandard;
  status: ComplianceStatus;
  score: number; // 0-100
  lastAuditDate: Date;
  nextAuditDate: Date;
  auditor: string;
  findings: ComplianceFinding[];
  reportUrl?: string;
  certificateUrl?: string;
  validUntil?: Date;
}

export interface ComplianceFinding {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  recommendation: string;
  status: "open" | "in-progress" | "resolved";
  dueDate?: Date;
  assignedTo?: string;
}

export interface AuditEvent {
  id: string;
  frameworkId: ComplianceStandard;
  type: "initial" | "recurring" | "remediation" | "certification";
  status: "scheduled" | "in-progress" | "completed" | "failed";
  startDate: Date;
  completionDate?: Date;
  auditor: string;
  score?: number;
  findingsCount: number;
  reportUrl?: string;
  notes?: string;
}

export interface ComplianceDashboard {
  frameworks: ComplianceFramework[];
  results: ComplianceResult[];
  auditHistory: AuditEvent[];
  overallScore: number;
  lastUpdated: Date;
}

export interface DownloadRequest {
  frameworkId: ComplianceStandard;
  reportType: "audit-report" | "certificate" | "findings" | "evidence";
  format: "pdf" | "json" | "csv";
}

export interface ComplianceStats {
  totalFrameworks: number;
  compliantFrameworks: number;
  warningFrameworks: number;
  nonCompliantFrameworks: number;
  upcomingAudits: number;
  overdueAudits: number;
}

// Status configuration for UI
export interface StatusConfig {
  status: ComplianceStatus;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

// Predefined status configurations
export const COMPLIANCE_STATUSES: StatusConfig[] = [
  {
    status: "compliant",
    label: "Compliant",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    icon: "CheckCircle",
    description: "Fully compliant with all requirements",
  },
  {
    status: "warning",
    label: "Warning",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    icon: "AlertTriangle",
    description: "Minor issues requiring attention",
  },
  {
    status: "non-compliant",
    label: "Non-Compliant",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    icon: "XCircle",
    description: "Critical issues requiring immediate action",
  },
  {
    status: "pending",
    label: "Pending",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: "Clock",
    description: "Audit in progress or scheduled",
  },
];

// Predefined compliance frameworks
export const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: "gdpr",
    name: "GDPR",
    fullName: "General Data Protection Regulation",
    description: "European Union data protection and privacy regulation",
    category: "privacy",
    icon: "Shield",
    website: "https://gdpr.eu/",
    color: "#6366F1",
  },
  {
    id: "iso27001",
    name: "ISO 27001",
    fullName: "ISO/IEC 27001 Information Security Management",
    description:
      "International standard for information security management systems",
    category: "security",
    icon: "Lock",
    website: "https://www.iso.org/isoiec-27001-information-security.html",
    color: "#10B981",
  },
  {
    id: "soc2",
    name: "SOC 2",
    fullName: "System and Organization Controls 2",
    description:
      "Trust Services Criteria for security, availability, and confidentiality",
    category: "security",
    icon: "CheckSquare",
    website:
      "https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/sorhome.html",
    color: "#F59E0B",
  },
  {
    id: "hipaa",
    name: "HIPAA",
    fullName: "Health Insurance Portability and Accountability Act",
    description: "US healthcare data privacy and security regulation",
    category: "privacy",
    icon: "Heart",
    website: "https://www.hhs.gov/hipaa/index.html",
    color: "#EF4444",
  },
  {
    id: "pci-dss",
    name: "PCI DSS",
    fullName: "Payment Card Industry Data Security Standard",
    description: "Global standard for payment card data security",
    category: "financial",
    icon: "CreditCard",
    website: "https://www.pcisecuritystandards.org/",
    color: "#8B5CF6",
  },
];

// Mock data for development
export const MOCK_COMPLIANCE_RESULTS: ComplianceResult[] = [
  {
    id: "gdpr-2024",
    frameworkId: "gdpr",
    status: "compliant",
    score: 95,
    lastAuditDate: new Date("2024-10-15"),
    nextAuditDate: new Date("2025-10-15"),
    auditor: "Deloitte",
    findings: [
      {
        id: "gdpr-001",
        severity: "low",
        title: "Data retention policy documentation",
        description: "Minor updates needed to data retention documentation",
        recommendation:
          "Update retention policy document to reflect new EU guidelines",
        status: "resolved",
        dueDate: new Date("2024-11-30"),
      },
    ],
    reportUrl: "/reports/gdpr-2024.pdf",
    certificateUrl: "/certificates/gdpr-2024.pdf",
    validUntil: new Date("2025-10-15"),
  },
  {
    id: "iso27001-2024",
    frameworkId: "iso27001",
    status: "warning",
    score: 87,
    lastAuditDate: new Date("2024-09-20"),
    nextAuditDate: new Date("2025-09-20"),
    auditor: "PwC",
    findings: [
      {
        id: "iso-001",
        severity: "medium",
        title: "Access control review",
        description: "Quarterly access control reviews not fully documented",
        recommendation: "Implement automated access review system",
        status: "in-progress",
        dueDate: new Date("2024-12-15"),
        assignedTo: "Security Team",
      },
    ],
    reportUrl: "/reports/iso27001-2024.pdf",
    validUntil: new Date("2025-09-20"),
  },
  {
    id: "soc2-2024",
    frameworkId: "soc2",
    status: "compliant",
    score: 92,
    lastAuditDate: new Date("2024-08-30"),
    nextAuditDate: new Date("2025-08-30"),
    auditor: "KPMG",
    findings: [],
    reportUrl: "/reports/soc2-2024.pdf",
    certificateUrl: "/certificates/soc2-2024.pdf",
    validUntil: new Date("2025-08-30"),
  },
];

export const MOCK_AUDIT_HISTORY: AuditEvent[] = [
  {
    id: "audit-001",
    frameworkId: "gdpr",
    type: "recurring",
    status: "completed",
    startDate: new Date("2024-10-01"),
    completionDate: new Date("2024-10-15"),
    auditor: "Deloitte",
    score: 95,
    findingsCount: 1,
    reportUrl: "/reports/gdpr-2024.pdf",
    notes: "Successful annual GDPR compliance audit with minor findings",
  },
  {
    id: "audit-002",
    frameworkId: "iso27001",
    type: "recurring",
    status: "completed",
    startDate: new Date("2024-09-01"),
    completionDate: new Date("2024-09-20"),
    auditor: "PwC",
    score: 87,
    findingsCount: 2,
    reportUrl: "/reports/iso27001-2024.pdf",
    notes:
      "ISO 27001 surveillance audit completed with recommendations for improvement",
  },
  {
    id: "audit-003",
    frameworkId: "soc2",
    type: "certification",
    status: "completed",
    startDate: new Date("2024-08-01"),
    completionDate: new Date("2024-08-30"),
    auditor: "KPMG",
    score: 92,
    findingsCount: 0,
    reportUrl: "/reports/soc2-2024.pdf",
    notes: "SOC 2 Type II certification successfully renewed",
  },
  {
    id: "audit-004",
    frameworkId: "hipaa",
    type: "initial",
    status: "scheduled",
    startDate: new Date("2024-12-01"),
    auditor: "EY",
    findingsCount: 0,
    notes: "Initial HIPAA compliance assessment scheduled",
  },
];
