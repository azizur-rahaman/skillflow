'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { DataConnectionProvider, useDataConnection, wizardSteps } from '@/features/connectors/context/DataConnectionContext';
import ProgressSteps from '@/features/connectors/presentation/components/ProgressSteps';
import ConnectorCard from '@/features/connectors/presentation/components/ConnectorCard';
import ResumeUpload from '@/features/connectors/presentation/components/ResumeUpload';
import SuccessAnimation from '@/features/connectors/presentation/components/SuccessAnimation';

function ConnectDataContent() {
  const router = useRouter();
  const { state, nextStep, previousStep, skipStep, completeWizard } = useDataConnection();
  const [showSuccess, setShowSuccess] = useState(false);

  const currentWizardStep = wizardSteps[state.currentStep];
  const isFirstStep = state.currentStep === 0;
  const isLastStep = state.currentStep === state.totalSteps - 1;

  // Get connectors for current step
  const currentConnectors = state.connectors.filter((connector) =>
    currentWizardStep.connectors.includes(connector.id)
  );

  // Check if current step is complete
  const requiredConnectors = currentConnectors.filter((c) => c.isRequired);
  const isStepComplete = requiredConnectors.every((c) => c.status === 'connected');

  // Show success animation when connector connects
  useEffect(() => {
    const justConnected = state.connectors.find((c) => c.status === 'connected');
    if (justConnected) {
      setShowSuccess(true);
    }
  }, [state.connectors]);

  const handleNext = () => {
    if (isLastStep) {
      completeWizard();
      router.push('/dashboard');
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    if (currentWizardStep.isOptional) {
      skipStep();
    }
  };

  const successConnector = state.connectors.find((c) => c.status === 'connected');

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="wizard-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wizard-grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-full mb-6">
              <div className="w-2 h-2 bg-[#22D3EE] rounded-full animate-pulse" />
              <span className="text-white/70 text-sm font-medium">Setup Your Data Sources</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Connect Your Professional Profiles
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Link your accounts to extract skills automatically using AI. The more sources you connect, the more accurate your Skill DNA becomes.
            </p>
          </div>

          {/* Progress Steps */}
          <ProgressSteps />

          {/* Current Step Content */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentWizardStep.title}
              </h2>
              <p className="text-white/60">
                {currentWizardStep.description}
              </p>
            </div>

            {/* Connectors Grid or Resume Upload */}
            {currentWizardStep.connectors.includes('resume') ? (
              <ResumeUpload />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentConnectors.map((connector) => (
                  <ConnectorCard key={connector.id} connector={connector} />
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            {/* Back Button */}
            {!isFirstStep && (
              <button
                onClick={previousStep}
                className="
                  flex items-center gap-2
                  px-6 py-3
                  bg-white/5 border border-white/20
                  text-white/80
                  rounded-xl
                  hover:bg-white/10 hover:border-white/30
                  transition-all duration-200
                "
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {/* Skip Button (for optional steps) */}
            {currentWizardStep.isOptional && !isStepComplete && (
              <button
                onClick={handleSkip}
                className="
                  ml-auto mr-4
                  text-white/40 hover:text-white/60
                  transition-colors
                  text-sm
                "
              >
                Skip this step
              </button>
            )}

            {/* Next/Complete Button */}
            <button
              onClick={handleNext}
              disabled={!isStepComplete && !currentWizardStep.isOptional}
              className={`
                ${isFirstStep && !currentWizardStep.isOptional ? 'ml-auto' : ''}
                flex items-center gap-2
                px-8 py-3
                ${
                  isStepComplete || currentWizardStep.isOptional
                    ? 'bg-gradient-to-r from-[#4F46E5] via-[#A855F7] to-[#22D3EE] text-white shadow-lg shadow-[#4F46E5]/30'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }
                font-semibold rounded-xl
                hover:opacity-90
                disabled:opacity-50
                transition-all duration-200
              `}
            >
              {isStepComplete && <Check className="w-4 h-4" />}
              {isLastStep ? 'Complete Setup' : 'Continue'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Need help? Check out our{' '}
              <a href="/docs/connecting-sources" className="text-[#22D3EE] hover:underline">
                connection guide
              </a>
              {' '}or{' '}
              <a href="/support" className="text-[#22D3EE] hover:underline">
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Success Animation */}
      <SuccessAnimation
        show={showSuccess}
        title={`${successConnector?.name} Connected!`}
        description={`Successfully extracted ${successConnector?.dataPoints || 0} data points from your ${successConnector?.name} profile`}
      />
    </div>
  );
}

export default function ConnectDataPage() {
  const router = useRouter();

  const handleComplete = () => {
    console.log('Data connection wizard completed!');
    router.push('/dashboard');
  };

  return (
    <DataConnectionProvider onComplete={handleComplete}>
      <ConnectDataContent />
    </DataConnectionProvider>
  );
}
