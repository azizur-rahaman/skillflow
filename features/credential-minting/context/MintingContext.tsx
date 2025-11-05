'use client';

/**
 * Credential Minting Context
 * 
 * State management for multi-step credential minting flow with evidence verification,
 * blockchain transaction handling, and soft futuristic animations.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CredentialMintingContextState,
  MintingStep,
  MintableSkill,
  EvidenceSubmission,
  CredentialMetadata,
  MintingTransaction,
  MintingStatus,
  BlockchainAnimationState,
  MintingResult,
  EvidenceStatus,
  EvidenceType,
  getStepIndex,
  validateSkillEligibility,
  validateEvidenceRequirements,
  generateCredentialName,
  generateCredentialDescription,
  generateMetadataAttributes,
  estimateMintingCost,
  estimateMintingTime,
} from '../types/minting.types';
import {
  CredentialCategory,
  Network,
  TokenStandard,
  VerificationStatus,
} from '@/features/wallet/types/wallet.types';

// Create context
const CredentialMintingContext = createContext<CredentialMintingContextState | undefined>(undefined);

/**
 * Credential Minting Provider
 */
export const CredentialMintingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<MintingStep>(MintingStep.SkillSelection);
  const [selectedSkill, setSelectedSkill] = useState<MintableSkill | null>(null);
  const [evidence, setEvidence] = useState<EvidenceSubmission[]>([]);
  const [metadata, setMetadata] = useState<CredentialMetadata | null>(null);
  const [transaction, setTransaction] = useState<MintingTransaction | null>(null);
  const [mintingStatus, setMintingStatus] = useState<MintingStatus>(MintingStatus.Idle);
  const [animationState, setAnimationState] = useState<BlockchainAnimationState>(BlockchainAnimationState.Idle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintableSkills, setMintableSkills] = useState<MintableSkill[]>([]);

  /**
   * Load mintable skills
   */
  const loadMintableSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock mintable skills
      const mockSkills: MintableSkill[] = [
        {
          id: 'react-expert',
          name: 'React.js',
          category: CredentialCategory.SkillMastery,
          level: 92,
          description: 'Advanced React.js development with hooks, context, and performance optimization',
          imageUrl: '/tokens/react-expert.png',
          completedAt: new Date('2025-10-15'),
          milestones: [
            {
              id: '1',
              title: 'React Fundamentals',
              description: 'Completed React basics course',
              completedAt: new Date('2025-06-01'),
              xpEarned: 500,
              verified: true,
            },
            {
              id: '2',
              title: 'Advanced Hooks',
              description: 'Mastered custom hooks and optimization',
              completedAt: new Date('2025-07-15'),
              xpEarned: 1000,
              verified: true,
            },
            {
              id: '3',
              title: 'Production Projects',
              description: 'Built 5 production-ready applications',
              completedAt: new Date('2025-09-01'),
              xpEarned: 2000,
              verified: true,
            },
          ],
          requiredEvidence: [
            {
              type: EvidenceType.Project,
              required: true,
              description: 'At least one production React project',
              minCount: 1,
            },
            {
              type: EvidenceType.GitHub,
              required: true,
              description: 'GitHub repository with React code',
              minCount: 1,
            },
            {
              type: EvidenceType.Certificate,
              required: false,
              description: 'Optional React certification',
            },
          ],
          estimatedValue: 150,
          eligible: true,
        },
        {
          id: 'typescript-advanced',
          name: 'TypeScript',
          category: CredentialCategory.Certification,
          level: 88,
          description: 'TypeScript type system mastery with advanced patterns',
          imageUrl: '/tokens/typescript-advanced.png',
          completedAt: new Date('2025-09-20'),
          milestones: [
            {
              id: '1',
              title: 'TypeScript Basics',
              description: 'Learned TypeScript fundamentals',
              completedAt: new Date('2025-05-10'),
              xpEarned: 400,
              verified: true,
            },
            {
              id: '2',
              title: 'Advanced Types',
              description: 'Mastered generics and utility types',
              completedAt: new Date('2025-07-01'),
              xpEarned: 800,
              verified: true,
            },
          ],
          requiredEvidence: [
            {
              type: EvidenceType.Assessment,
              required: true,
              description: 'TypeScript proficiency assessment',
              minCount: 1,
            },
            {
              type: EvidenceType.Project,
              required: true,
              description: 'TypeScript project',
              minCount: 1,
            },
          ],
          estimatedValue: 120,
          eligible: true,
        },
        {
          id: 'nodejs-backend',
          name: 'Node.js Backend',
          category: CredentialCategory.CourseCompletion,
          level: 75,
          description: 'Backend development with Node.js and Express',
          imageUrl: '/tokens/nodejs-backend.png',
          completedAt: new Date('2025-08-10'),
          milestones: [
            {
              id: '1',
              title: 'Node.js Fundamentals',
              description: 'Learned Node.js basics',
              completedAt: new Date('2025-06-15'),
              xpEarned: 600,
              verified: true,
            },
          ],
          requiredEvidence: [
            {
              type: EvidenceType.Project,
              required: true,
              description: 'Backend API project',
              minCount: 1,
            },
          ],
          estimatedValue: 100,
          eligible: true,
        },
      ];

      setMintableSkills(mockSkills);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select skill for minting
   */
  const selectSkill = useCallback((skillId: string) => {
    const skill = mintableSkills.find(s => s.id === skillId);
    if (!skill) return;

    if (!validateSkillEligibility(skill)) {
      setError('This skill is not eligible for minting');
      return;
    }

    setSelectedSkill(skill);
    setError(null);
  }, [mintableSkills]);

  /**
   * Add evidence
   */
  const addEvidence = useCallback(async (
    newEvidence: Omit<EvidenceSubmission, 'id' | 'uploadedAt' | 'status'>
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      const evidenceWithId: EvidenceSubmission = {
        ...newEvidence,
        id: `evidence_${Date.now()}`,
        uploadedAt: new Date(),
        status: EvidenceStatus.Pending,
      };

      setEvidence(prev => [...prev, evidenceWithId]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add evidence');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove evidence
   */
  const removeEvidence = useCallback((evidenceId: string) => {
    setEvidence(prev => prev.filter(e => e.id !== evidenceId));
  }, []);

  /**
   * Update evidence
   */
  const updateEvidence = useCallback((evidenceId: string, updates: Partial<EvidenceSubmission>) => {
    setEvidence(prev => prev.map(e => e.id === evidenceId ? { ...e, ...updates } : e));
  }, []);

  /**
   * Verify evidence
   */
  const verifyEvidence = useCallback(async (evidenceId: string): Promise<void> => {
    try {
      setLoading(true);

      // Update to verifying
      updateEvidence(evidenceId, { status: EvidenceStatus.Verifying });

      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update to verified
      updateEvidence(evidenceId, {
        status: EvidenceStatus.Verified,
        verifiedAt: new Date(),
        verifiedBy: 'SkillFlow AI Verifier',
        verificationNotes: 'Evidence validated successfully',
      });
    } catch (err) {
      updateEvidence(evidenceId, {
        status: EvidenceStatus.Rejected,
        verificationNotes: 'Verification failed',
      });
      setError(err instanceof Error ? err.message : 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateEvidence]);

  /**
   * Next step
   */
  const nextStep = useCallback(() => {
    const steps = Object.values(MintingStep);
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  /**
   * Previous step
   */
  const previousStep = useCallback(() => {
    const steps = Object.values(MintingStep);
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  /**
   * Go to specific step
   */
  const goToStep = useCallback((step: MintingStep) => {
    setCurrentStep(step);
  }, []);

  /**
   * Generate metadata
   */
  const generateMetadata = useCallback(async (): Promise<void> => {
    if (!selectedSkill) return;

    try {
      setLoading(true);
      setError(null);

      const credentialMetadata: CredentialMetadata = {
        name: generateCredentialName(selectedSkill.name, selectedSkill.level),
        description: generateCredentialDescription(selectedSkill),
        skillName: selectedSkill.name,
        skillLevel: selectedSkill.level,
        category: selectedSkill.category,
        attributes: generateMetadataAttributes(selectedSkill),
        evidence: evidence.filter(e => e.status === EvidenceStatus.Verified),
        issuer: 'SkillFlow Platform',
      };

      setMetadata(credentialMetadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate metadata');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedSkill, evidence]);

  /**
   * Mint credential
   */
  const mintCredential = useCallback(async (): Promise<MintingResult> => {
    if (!selectedSkill || !metadata) {
      throw new Error('Missing required data for minting');
    }

    try {
      setError(null);
      setAnimationState(BlockchainAnimationState.Connecting);

      // Create transaction
      const newTransaction: MintingTransaction = {
        id: `tx_${Date.now()}`,
        status: MintingStatus.Preparing,
        network: Network.Polygon,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTransaction(newTransaction);
      setMintingStatus(MintingStatus.Preparing);

      // Step 1: Preparing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Upload metadata
      setMintingStatus(MintingStatus.UploadingMetadata);
      setAnimationState(BlockchainAnimationState.Processing);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const ipfsHash = `Qm${Math.random().toString(36).substring(2, 15)}`;
      setTransaction(prev => prev ? {
        ...prev,
        ipfsHash,
        ipfsUrl: `ipfs://${ipfsHash}`,
        updatedAt: new Date(),
      } : null);

      // Step 3: Wait for approval
      setMintingStatus(MintingStatus.WaitingApproval);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 4: Minting
      setMintingStatus(MintingStatus.Minting);
      setAnimationState(BlockchainAnimationState.Processing);
      await new Promise(resolve => setTimeout(resolve, 2500));

      const transactionHash = `0x${Math.random().toString(16).substring(2)}`;
      setTransaction(prev => prev ? {
        ...prev,
        transactionHash,
        updatedAt: new Date(),
      } : null);

      // Step 5: Confirming
      setMintingStatus(MintingStatus.Confirming);
      setAnimationState(BlockchainAnimationState.Confirming);
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Step 6: Success
      const tokenId = `0x${Math.random().toString(16).substring(2, 22)}`;
      setMintingStatus(MintingStatus.Success);
      setAnimationState(BlockchainAnimationState.Complete);

      const finalTransaction: MintingTransaction = {
        ...newTransaction,
        status: MintingStatus.Success,
        ipfsHash,
        ipfsUrl: `ipfs://${ipfsHash}`,
        transactionHash,
        blockNumber: 45123456,
        tokenId,
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        gasUsed: '0.002',
        gasPrice: '$0.03',
        updatedAt: new Date(),
      };

      setTransaction(finalTransaction);

      // Create credential
      const credential = {
        tokenId,
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        standard: TokenStandard.ERC1155,
        name: metadata.name,
        description: metadata.description,
        category: metadata.category,
        skillName: metadata.skillName,
        skillLevel: metadata.skillLevel,
        imageUrl: selectedSkill.imageUrl,
        metadata: {
          name: metadata.name,
          description: metadata.description,
          image: `ipfs://${ipfsHash}`,
          external_url: `https://skillflow.io/credentials/${tokenId}`,
          attributes: metadata.attributes.map(attr => ({
            trait_type: attr.trait_type,
            value: attr.value,
            display_type: attr.display_type as any,
          })),
          properties: {
            skill_id: selectedSkill.id,
            skill_name: metadata.skillName,
            skill_level: metadata.skillLevel,
            issued_by: 'SkillFlow Platform',
            issued_at: new Date().toISOString(),
            expires_at: null,
            verification_hash: `0x${Math.random().toString(16).substring(2)}`,
          },
        },
        amount: 1,
        verificationStatus: VerificationStatus.Verified,
        issuer: {
          id: 'skillflow',
          name: 'SkillFlow Platform',
          logo: '/issuers/skillflow.png',
          verified: true,
          walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
        },
        issuedAt: new Date(),
        expiresAt: null,
        attributes: metadata.attributes.map(attr => ({
          trait_type: attr.trait_type,
          value: attr.value,
          display_type: attr.display_type as any,
        })),
      };

      return {
        success: true,
        transaction: finalTransaction,
        credential,
        message: 'Credential minted successfully!',
      };
    } catch (err) {
      setMintingStatus(MintingStatus.Failed);
      setAnimationState(BlockchainAnimationState.Error);
      setError(err instanceof Error ? err.message : 'Minting failed');
      
      if (transaction) {
        setTransaction({
          ...transaction,
          status: MintingStatus.Failed,
          error: err instanceof Error ? err.message : 'Minting failed',
          updatedAt: new Date(),
        });
      }

      throw err;
    }
  }, [selectedSkill, metadata, transaction]);

  /**
   * Reset minting flow
   */
  const reset = useCallback(() => {
    setCurrentStep(MintingStep.SkillSelection);
    setSelectedSkill(null);
    setEvidence([]);
    setMetadata(null);
    setTransaction(null);
    setMintingStatus(MintingStatus.Idle);
    setAnimationState(BlockchainAnimationState.Idle);
    setError(null);
  }, []);

  const value: CredentialMintingContextState = {
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
    updateEvidence,
    verifyEvidence,
    nextStep,
    previousStep,
    goToStep,
    generateMetadata,
    mintCredential,
    reset,
  };

  return (
    <CredentialMintingContext.Provider value={value}>
      {children}
    </CredentialMintingContext.Provider>
  );
};

/**
 * Hook to use credential minting context
 */
export const useCredentialMinting = (): CredentialMintingContextState => {
  const context = useContext(CredentialMintingContext);
  if (!context) {
    throw new Error('useCredentialMinting must be used within a CredentialMintingProvider');
  }
  return context;
};
