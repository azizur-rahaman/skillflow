import React, { useState, useEffect } from "react";
import { useEnterpriseSetup } from "../../context";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle, AlertTriangle, Info } from "lucide-react";

const TARGET_FIELDS = [
  { value: "firstName", label: "First Name", required: true },
  { value: "lastName", label: "Last Name", required: true },
  { value: "email", label: "Email Address", required: true },
  { value: "department", label: "Department", required: false },
  { value: "jobTitle", label: "Job Title", required: false },
  { value: "manager", label: "Manager", required: false },
  { value: "location", label: "Location", required: false },
  { value: "startDate", label: "Start Date", required: false },
  { value: "skills", label: "Skills", required: false },
  { value: "experience", label: "Experience Level", required: false },
  { value: "certifications", label: "Certifications", required: false },
];

export const MappingStep: React.FC = () => {
  const {
    state,
    updateFieldMapping,
    validateMappings,
    goToNextStep,
    goToPreviousStep,
  } = useEnterpriseSetup();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Validate mappings when component mounts or mappings change
    const validate = async () => {
      const isValid = await validateMappings();
      if (!isValid && state.error) {
        setValidationErrors([state.error]);
      } else {
        setValidationErrors([]);
      }
    };
    validate();
  }, [state.fieldMappings, validateMappings, state.error]);

  const handleMappingChange = (sourceField: string, targetField: string) => {
    updateFieldMapping(sourceField, targetField);
  };

  const handleNext = async () => {
    const isValid = await validateMappings();
    if (isValid) {
      goToNextStep();
    }
  };

  const getMappedFields = () => {
    return state.fieldMappings.filter((mapping) => mapping.targetField);
  };

  const getRequiredFields = () => {
    return TARGET_FIELDS.filter((field) => field.required);
  };

  const getMappedRequiredFields = () => {
    const mappedTargets = state.fieldMappings.map((m) => m.targetField);
    return getRequiredFields().filter((field) =>
      mappedTargets.includes(field.value)
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-white">Map Your Fields</h2>
        <p className="text-gray-400">
          Match your CSV columns to SkillFlow fields to ensure proper data
          import
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">Total Fields</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {state.fieldMappings.length}
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Mapped</span>
          </div>
          <p className="text-2xl font-bold text-green-400 mt-2">
            {getMappedFields().length}
          </p>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">Required</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400 mt-2">
            {getMappedRequiredFields().length}/{getRequiredFields().length}
          </p>
        </Card>
      </div>

      {/* Field Mapping Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Field Mappings
          </h3>

          <div className="space-y-4">
            {state.fieldMappings.map((mapping) => {
              const targetField = TARGET_FIELDS.find(
                (f) => f.value === mapping.targetField
              );
              const isRequired = targetField?.required;
              const isMapped = !!mapping.targetField;

              return (
                <div
                  key={mapping.sourceField}
                  className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">
                        {mapping.sourceField}
                      </span>
                      {mapping.sampleValue && (
                        <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                          Sample: {mapping.sampleValue}
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-400" />

                  <div className="flex-1">
                    <Select
                      value={mapping.targetField}
                      onValueChange={(value) =>
                        handleMappingChange(mapping.sourceField, value)
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Don&apos;t import</SelectItem>
                        {TARGET_FIELDS.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            <div className="flex items-center gap-2">
                              <span>{field.label}</span>
                              {field.required && (
                                <span className="text-xs text-red-400">*</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-20 text-right">
                    {isMapped && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                    {isRequired && !isMapped && (
                      <AlertTriangle className="w-5 h-5 text-yellow-400 ml-auto" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h4 className="text-sm font-medium text-red-400">
              Required Fields Missing
            </h4>
          </div>
          <ul className="text-sm text-red-400 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={validationErrors.length > 0}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          Next: Preview Data
        </Button>
      </div>
    </div>
  );
};
