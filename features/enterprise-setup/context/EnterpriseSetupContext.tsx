"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  EnterpriseSetupState,
  EnterpriseSetupContextType,
  ImportStep,
  ImportStatus,
  FieldMapping,
  PreviewData,
  ImportResult,
  WIZARD_STEPS,
  validateFile,
} from "../types";

const initialState: EnterpriseSetupState = {
  currentStep: "upload",
  status: "idle",
  file: null,
  fileName: "",
  fileSize: 0,
  fieldMappings: [],
  previewData: null,
  importResult: null,
  progress: 0,
  error: null,
};

type EnterpriseSetupAction =
  | { type: "SET_STEP"; payload: ImportStep }
  | { type: "SET_STATUS"; payload: ImportStatus }
  | {
      type: "SET_FILE";
      payload: { file: File; fileName: string; fileSize: number };
    }
  | { type: "SET_FIELD_MAPPINGS"; payload: FieldMapping[] }
  | {
      type: "UPDATE_FIELD_MAPPING";
      payload: { sourceField: string; targetField: string };
    }
  | { type: "SET_PREVIEW_DATA"; payload: PreviewData }
  | { type: "SET_IMPORT_RESULT"; payload: ImportResult }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

function enterpriseSetupReducer(
  state: EnterpriseSetupState,
  action: EnterpriseSetupAction
): EnterpriseSetupState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload, error: null };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_FILE":
      return {
        ...state,
        file: action.payload.file,
        fileName: action.payload.fileName,
        fileSize: action.payload.fileSize,
        error: null,
      };
    case "SET_FIELD_MAPPINGS":
      return { ...state, fieldMappings: action.payload };
    case "UPDATE_FIELD_MAPPING":
      return {
        ...state,
        fieldMappings: state.fieldMappings.map((mapping) =>
          mapping.sourceField === action.payload.sourceField
            ? { ...mapping, targetField: action.payload.targetField }
            : mapping
        ),
      };
    case "SET_PREVIEW_DATA":
      return { ...state, previewData: action.payload };
    case "SET_IMPORT_RESULT":
      return { ...state, importResult: action.payload };
    case "SET_PROGRESS":
      return { ...state, progress: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const EnterpriseSetupContext = createContext<
  EnterpriseSetupContextType | undefined
>(undefined);

interface EnterpriseSetupProviderProps {
  children: ReactNode;
}

export function EnterpriseSetupProvider({
  children,
}: EnterpriseSetupProviderProps) {
  const [state, dispatch] = useReducer(enterpriseSetupReducer, initialState);

  const uploadFile = async (file: File): Promise<void> => {
    const validation = validateFile(file);
    if (!validation.valid) {
      dispatch({ type: "SET_ERROR", payload: validation.error! });
      return;
    }

    dispatch({ type: "SET_STATUS", payload: "uploading" });
    dispatch({ type: "SET_PROGRESS", payload: 0 });

    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        dispatch({ type: "SET_PROGRESS", payload: i });
      }

      dispatch({
        type: "SET_FILE",
        payload: { file, fileName: file.name, fileSize: file.size },
      });

      // Parse CSV headers and create initial field mappings
      const headers = await parseCSVHeaders(file);
      const fieldMappings: FieldMapping[] = headers.map((header) => ({
        sourceField: header,
        targetField: "",
        required: false,
        dataType: "string" as const,
        sampleValue: "",
      }));

      dispatch({ type: "SET_FIELD_MAPPINGS", payload: fieldMappings });
      dispatch({ type: "SET_STATUS", payload: "idle" });
      dispatch({ type: "SET_PROGRESS", payload: 100 });
    } catch (error) {
      console.error("File upload error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to upload file. Please try again.",
      });
      dispatch({ type: "SET_STATUS", payload: "error" });
    }
  };

  const updateFieldMapping = (sourceField: string, targetField: string) => {
    dispatch({
      type: "UPDATE_FIELD_MAPPING",
      payload: { sourceField, targetField },
    });
  };

  const validateMappings = async (): Promise<boolean> => {
    dispatch({ type: "SET_STATUS", payload: "validating" });

    // Check if required fields are mapped
    const requiredFields = ["email", "firstName", "lastName"];
    const mappedFields = state.fieldMappings
      .map((m) => m.targetField)
      .filter(Boolean);

    const missingRequired = requiredFields.filter(
      (field) => !mappedFields.includes(field)
    );

    if (missingRequired.length > 0) {
      dispatch({
        type: "SET_ERROR",
        payload: `Please map the following required fields: ${missingRequired.join(
          ", "
        )}`,
      });
      dispatch({ type: "SET_STATUS", payload: "idle" });
      return false;
    }

    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_STATUS", payload: "idle" });
    return true;
  };

  const startImport = async (): Promise<void> => {
    if (!state.file || !state.previewData) return;

    dispatch({ type: "SET_STATUS", payload: "importing" });
    dispatch({ type: "SET_PROGRESS", payload: 0 });

    try {
      // Simulate import process
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        dispatch({ type: "SET_PROGRESS", payload: i });
      }

      // Mock import result
      const importResult: ImportResult = {
        totalRows: state.previewData.totalRows,
        validRows: Math.floor(state.previewData.totalRows * 0.9),
        invalidRows: Math.floor(state.previewData.totalRows * 0.1),
        importedRows: Math.floor(state.previewData.totalRows * 0.9),
        errors: [],
        warnings: [],
      };

      dispatch({ type: "SET_IMPORT_RESULT", payload: importResult });
      dispatch({ type: "SET_STATUS", payload: "completed" });
      dispatch({ type: "SET_PROGRESS", payload: 100 });
    } catch (error) {
      console.error("Import error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Import failed. Please try again.",
      });
      dispatch({ type: "SET_STATUS", payload: "error" });
    }
  };

  const resetWizard = () => {
    dispatch({ type: "RESET" });
  };

  const goToStep = (step: ImportStep) => {
    dispatch({ type: "SET_STEP", payload: step });
  };

  const goToNextStep = () => {
    const currentIndex = WIZARD_STEPS.findIndex(
      (step) => step.id === state.currentStep
    );
    if (currentIndex < WIZARD_STEPS.length - 1) {
      dispatch({
        type: "SET_STEP",
        payload: WIZARD_STEPS[currentIndex + 1].id,
      });
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = WIZARD_STEPS.findIndex(
      (step) => step.id === state.currentStep
    );
    if (currentIndex > 0) {
      dispatch({
        type: "SET_STEP",
        payload: WIZARD_STEPS[currentIndex - 1].id,
      });
    }
  };

  const contextValue: EnterpriseSetupContextType = {
    state,
    uploadFile,
    updateFieldMapping,
    validateMappings,
    startImport,
    resetWizard,
    goToStep,
    goToNextStep,
    goToPreviousStep,
  };

  return (
    <EnterpriseSetupContext.Provider value={contextValue}>
      {children}
    </EnterpriseSetupContext.Provider>
  );
}

export function useEnterpriseSetup(): EnterpriseSetupContextType {
  const context = useContext(EnterpriseSetupContext);
  if (context === undefined) {
    throw new Error(
      "useEnterpriseSetup must be used within an EnterpriseSetupProvider"
    );
  }
  return context;
}

// Helper function to parse CSV headers
async function parseCSVHeaders(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n");
        if (lines.length === 0) {
          resolve([]);
          return;
        }

        // Simple CSV header parsing (basic implementation)
        const headers = lines[0]
          .split(",")
          .map((header) => header.trim().replace(/"/g, ""));
        resolve(headers);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
