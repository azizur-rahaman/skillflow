'use client';

/**
 * Credential Minting Page
 * 
 * Multi-step wizard for minting verified credentials with soft futuristic design,
 * blockchain animations, and smooth step transitions.
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CredentialMintingProvider, useCredentialMinting } from '@/features/credential-minting/context/MintingContext';
import {
  StepperWizard,
  SkillSelection,
  EvidenceVerification,
  ConfirmationSummary,
  MintingProgress,
  SuccessAnimation,
} from '@/features/credential-minting/presentation/components';
import {
  MintingStep,
  validateEvidenceRequirements,
  estimateMintingCost,
  estimateMintingTime,
} from '@/features/credential-minting/types/minting.types';
import { Network } from '@/features/wallet/types/wallet.types';

/**
 * Minting Content Component
 */
const MintingContent: React.FC = () => {
  const router = useRouter();
  const {
    currentStep,
    selectedSkill,
    evidence,
    metadata,
    transaction,
    mintingStatus,
    animationState,
    loading,
    error,
    mintableSkills,
    loadMintableSkills,
    selectSkill,
    addEvidence,
    removeEvidence,
    verifyEvidence,
    nextStep,
    previousStep,
    generateMetadata,
    mintCredential,
    reset,
  } = useCredentialMinting();

  const [mintingResult, setMintingResult] = useState<any>(null);
  const [mintingProgress, setMintingProgress] = useState(0);

  // Load skills on mount
  useEffect(() => {
    loadMintableSkills();
  }, [loadMintableSkills]);

  // Update progress based on minting status
  useEffect(() => {
    const progressMap: Record<string, number> = {
      Preparing: 10,
      'Uploading Metadata': 30,
      'Waiting for Approval': 50,
      Minting: 70,
      Confirming: 90,
      Success: 100,
    };
    setMintingProgress(progressMap[mintingStatus] || 0);
  }, [mintingStatus]);

  // Handle next step
  const handleNext = async () => {
    if (currentStep === MintingStep.SkillSelection) {
      if (!selectedSkill) {
        alert('Please select a skill');
        return;
      }
      nextStep();
    } else if (currentStep === MintingStep.EvidenceVerification) {
      if (!selectedSkill) return;
      
      const validation = validateEvidenceRequirements(evidence, selectedSkill.requiredEvidence);
      if (!validation.valid) {
        alert('Please provide all required evidence');
        return;
      }
      
      await generateMetadata();
      nextStep();
    } else if (currentStep === MintingStep.Confirmation) {
      nextStep(); // Go to minting step
      
      try {
        const result = await mintCredential();
        setMintingResult(result);
        nextStep(); // Go to success step
      } catch (err) {
        console.error('Minting failed:', err);
      }
    }
  };

  // Handle back
  const handleBack = () => {
    if (currentStep === MintingStep.SkillSelection) {
      router.push('/wallet');
    } else {
      previousStep();
    }
  };

  // Can proceed to next step
  const canProceed = () => {
    if (currentStep === MintingStep.SkillSelection) {
      return !!selectedSkill;
    } else if (currentStep === MintingStep.EvidenceVerification) {
      if (!selectedSkill) return false;
      const validation = validateEvidenceRequirements(evidence, selectedSkill.requiredEvidence);
      return validation.valid;
    } else if (currentStep === MintingStep.Confirmation) {
      return !!metadata;
    }
    return false;
  };

  // Get confirmation data
  const getConfirmation = () => {
    if (!selectedSkill || !metadata) return null;
    
    return {
      skill: selectedSkill,
      metadata,
      evidence: evidence.filter(e => e.status === 'Verified'),
      network: Network.Polygon,
      estimatedGas: '0.002 MATIC',
      estimatedCost: estimateMintingCost(Network.Polygon),
      estimatedTime: estimateMintingTime(Network.Polygon),
    };
  };

  const steps = Object.values(MintingStep);
  const completedSteps = steps.slice(0, steps.indexOf(currentStep));

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <h1 className="text-lg font-semibold text-white">Mint Credential</h1>

            <div className="w-16" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        {currentStep !== MintingStep.Minting && currentStep !== MintingStep.Success && (
          <div className="mb-8">
            <StepperWizard
              currentStep={currentStep}
              steps={steps.filter(s => s !== MintingStep.Minting)}
              completedSteps={completedSteps}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="text-sm text-red-400">{error}</div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8">
          {currentStep === MintingStep.SkillSelection && (
            <SkillSelection
              skills={mintableSkills}
              selectedSkill={selectedSkill}
              onSelect={selectSkill}
              loading={loading}
            />
          )}

          {currentStep === MintingStep.EvidenceVerification && selectedSkill && (
            <EvidenceVerification
              skill={selectedSkill}
              evidence={evidence}
              requirements={selectedSkill.requiredEvidence}
              onAddEvidence={addEvidence}
              onRemoveEvidence={removeEvidence}
              onVerifyEvidence={verifyEvidence}
              loading={loading}
            />
          )}

          {currentStep === MintingStep.Confirmation && getConfirmation() && (
            <ConfirmationSummary
              confirmation={getConfirmation()!}
              onConfirm={handleNext}
              onEdit={() => previousStep()}
              loading={loading}
            />
          )}

          {currentStep === MintingStep.Minting && (
            <MintingProgress
              status={mintingStatus}
              animationState={animationState}
              transaction={transaction}
              progress={mintingProgress}
            />
          )}

          {currentStep === MintingStep.Success && mintingResult?.credential && (
            <SuccessAnimation
              credential={mintingResult.credential}
              transaction={mintingResult.transaction}
              onViewCredential={() => router.push(`/credentials/${mintingResult.credential.tokenId}`)}
              onMintAnother={() => reset()}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep !== MintingStep.Minting && currentStep !== MintingStep.Success && (
          <div className="mt-6 flex justify-between gap-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors"
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {currentStep === MintingStep.Confirmation ? 'Mint Credential' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Minting Page with Provider
 */
export default function MintCredentialPage() {
  return (
    <CredentialMintingProvider>
      <MintingContent />
    </CredentialMintingProvider>
  );
}
