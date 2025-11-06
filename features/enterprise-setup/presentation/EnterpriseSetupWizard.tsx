import React from "react";
import { useEnterpriseSetup } from "../context";

import { Card } from "@/components/ui/card";
import { UploadStep } from "./components/UploadStep";
import { MappingStep } from "./components/MappingStep";
import { PreviewStep } from "./components/PreviewStep";
import { ConfirmStep } from "./components/ConfirmStep";
import { WizardStepper } from "./components/WizardStepper";

export const EnterpriseSetupWizard: React.FC = () => {
  const { state } = useEnterpriseSetup();

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case "upload":
        return <UploadStep />;
      case "mapping":
        return <MappingStep />;
      case "preview":
        return <PreviewStep />;
      case "confirm":
        return <ConfirmStep />;
      default:
        return <UploadStep />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Enterprise Data Import
        </h1>
        <p className="text-gray-400">
          Import your organization&apos;s data to get started with SkillFlow
        </p>
      </div>

      <WizardStepper />

      <Card className="bg-gray-900/50 border-gray-800">
        {renderCurrentStep()}
      </Card>
    </div>
  );
};
