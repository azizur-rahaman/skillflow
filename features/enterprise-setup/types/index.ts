/**
 * Enterprise Setup Data Import Wizard Types
 * Following SkillFlow Nexus architecture patterns
 */

export type ImportStep = "upload" | "mapping" | "preview" | "confirm";

export type ImportStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "validating"
  | "importing"
  | "completed"
  | "error";

export type FieldMapping = {
  sourceField: string;
  targetField: string;
  required: boolean;
  dataType: "string" | "number" | "date" | "boolean" | "email";
  sampleValue?: string;
  validationErrors?: string[];
};

export type ImportResult = {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  importedRows: number;
  errors: ImportError[];
  warnings: ImportWarning[];
};

export type ImportError = {
  row: number;
  field?: string;
  message: string;
  severity: "error" | "warning";
};

export type ImportWarning = {
  row: number;
  field?: string;
  message: string;
};

export type PreviewData = {
  headers: string[];
  rows: Record<string, string | number | boolean | null>[];
  totalRows: number;
  hasMore: boolean;
};

export interface EnterpriseSetupState {
  currentStep: ImportStep;
  status: ImportStatus;
  file: File | null;
  fileName: string;
  fileSize: number;
  fieldMappings: FieldMapping[];
  previewData: PreviewData | null;
  importResult: ImportResult | null;
  progress: number;
  error: string | null;
}

export interface EnterpriseSetupContextType {
  state: EnterpriseSetupState;
  uploadFile: (file: File) => Promise<void>;
  updateFieldMapping: (sourceField: string, targetField: string) => void;
  validateMappings: () => Promise<boolean>;
  startImport: () => Promise<void>;
  resetWizard: () => void;
  goToStep: (step: ImportStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

// Step configuration for the wizard
export interface WizardStep {
  id: ImportStep;
  title: string;
  description: string;
  icon: string;
  canProceed: (state: EnterpriseSetupState) => boolean;
}

// Available target fields for mapping
export const TARGET_FIELDS = [
  {
    key: "email",
    label: "Email Address",
    required: true,
    type: "email" as const,
  },
  {
    key: "firstName",
    label: "First Name",
    required: true,
    type: "string" as const,
  },
  {
    key: "lastName",
    label: "Last Name",
    required: true,
    type: "string" as const,
  },
  {
    key: "jobTitle",
    label: "Job Title",
    required: false,
    type: "string" as const,
  },
  {
    key: "department",
    label: "Department",
    required: false,
    type: "string" as const,
  },
  {
    key: "managerEmail",
    label: "Manager Email",
    required: false,
    type: "email" as const,
  },
  {
    key: "hireDate",
    label: "Hire Date",
    required: false,
    type: "date" as const,
  },
  {
    key: "employeeId",
    label: "Employee ID",
    required: false,
    type: "string" as const,
  },
  {
    key: "location",
    label: "Location",
    required: false,
    type: "string" as const,
  },
  {
    key: "skills",
    label: "Skills (comma-separated)",
    required: false,
    type: "string" as const,
  },
] as const;

// Wizard step definitions
export const WIZARD_STEPS: WizardStep[] = [
  {
    id: "upload",
    title: "Upload Data",
    description: "Upload your employee or user data file",
    icon: "Upload",
    canProceed: (state) => !!state.file,
  },
  {
    id: "mapping",
    title: "Map Fields",
    description: "Match your data columns to system fields",
    icon: "Link",
    canProceed: (state) =>
      state.fieldMappings.length > 0 &&
      state.fieldMappings.some((m) => m.targetField),
  },
  {
    id: "preview",
    title: "Preview & Validate",
    description: "Review your data before importing",
    icon: "Eye",
    canProceed: (state) => !!state.previewData && state.status === "idle",
  },
  {
    id: "confirm",
    title: "Import & Confirm",
    description: "Complete the data import process",
    icon: "CheckCircle",
    canProceed: () => true,
  },
];

// File validation
export const ACCEPTED_FILE_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFile = (
  file: File
): { valid: boolean; error?: string } => {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: "Please upload a CSV or Excel file" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 10MB" };
  }

  return { valid: true };
};
