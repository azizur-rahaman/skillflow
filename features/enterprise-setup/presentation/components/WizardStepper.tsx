"use client";

import React from "react";
import { useEnterpriseSetup } from "../../context";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, MapPin, Eye, CheckSquare } from "lucide-react";

const steps = [
  { id: "upload", label: "Upload CSV", icon: Upload },
  { id: "mapping", label: "Map Fields", icon: MapPin },
  { id: "preview", label: "Preview Data", icon: Eye },
  { id: "confirm", label: "Confirm Import", icon: CheckSquare },
] as const;

export const WizardStepper: React.FC = () => {
  const { state } = useEnterpriseSetup();

  const getStepIndex = (stepId: string) =>
    steps.findIndex((step) => step.id === stepId);
  const currentIndex = getStepIndex(state.currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  const getStepStatus = (stepId: string) => {
    const stepIndex = getStepIndex(stepId);
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-2" />

      <div className="flex justify-between">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center space-y-2">
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                ${
                  status === "completed"
                    ? "bg-green-500 border-green-500 text-white"
                    : status === "current"
                    ? "bg-indigo-500 border-indigo-500 text-white"
                    : "bg-gray-800 border-gray-600 text-gray-400"
                }
              `}
              >
                {status === "completed" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`
                text-sm font-medium transition-colors
                ${
                  status === "completed" || status === "current"
                    ? "text-white"
                    : "text-gray-400"
                }
              `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
