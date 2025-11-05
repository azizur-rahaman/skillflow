'use client';

/**
 * Verification Context
 * 
 * State management for public credential verification with blockchain
 * validation and secure authentication.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  VerificationContextState,
  VerificationRequest,
  VerificationResult,
  VerificationState,
  ValidationProgress,
  ValidationStep,
  VerifiedCredential,
  VerificationError,
  VerificationErrorType,
  parseVerificationInput,
  validateInputFormat,
  getValidationStepProgress,
  formatExplorerUrl,
  calculateTrustScore,
  formatAttributeForDisplay,
} from '../types/verification.types';
import {
  CredentialCategory,
  Network,
  VerificationStatus,
} from '@/features/wallet/types/wallet.types';

// Create context
const VerificationContext = createContext<VerificationContextState | undefined>(undefined);

/**
 * Verification Provider
 */
export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [verificationState, setVerificationState] = useState<VerificationState>(VerificationState.Idle);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [validationProgress, setValidationProgress] = useState<ValidationProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Update validation progress
   */
  const updateProgress = (step: ValidationStep, message: string) => {
    const progress = getValidationStepProgress(step);
    setValidationProgress({
      currentStep: step,
      progress,
      message,
    });
  };

  /**
   * Verify credential
   */
  const verifyCredential = useCallback(async (
    request: VerificationRequest
  ): Promise<VerificationResult> => {
    try {
      setLoading(true);
      setError(null);
      setVerificationState(VerificationState.Validating);

      // Validate input format
      if (!validateInputFormat(request.input)) {
        throw {
          type: VerificationErrorType.InvalidFormat,
          message: 'Invalid input format',
        };
      }

      // Parse input
      updateProgress(ValidationStep.ParseInput, 'Parsing verification input...');
      await new Promise(resolve => setTimeout(resolve, 500));

      const { tokenId } = parseVerificationInput(request.input);

      // Fetch metadata
      updateProgress(ValidationStep.FetchMetadata, 'Fetching credential metadata...');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simulate credential lookup
      // In production, this would call blockchain/API
      const mockCredential: VerifiedCredential = {
        tokenId: tokenId || '0x1a2b3c4d5e6f7g8h9i0j',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        name: 'React.js Expert',
        description: 'Advanced mastery in React.js framework including hooks, context API, performance optimization, and modern React patterns.',
        category: CredentialCategory.SkillMastery,
        skillName: 'React.js',
        skillLevel: 92,
        imageUrl: '/tokens/react-expert.png',
        issuer: {
          id: 'skillflow',
          name: 'SkillFlow Platform',
          logo: '/issuers/skillflow.png',
          verified: true,
          walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
          website: 'https://skillflow.io',
          email: 'verify@skillflow.io',
          description: 'Leading blockchain-based skill credentialing platform',
          certificateNumber: 'SF-202510-REACT92',
          trustScore: 95,
        },
        owner: {
          walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          displayName: 'Alex Johnson',
          verifiedIdentity: true,
        },
        blockchain: {
          network: Network.Polygon,
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          tokenId: tokenId || '0x1a2b3c4d5e6f7g8h9i0j',
          blockNumber: 45123456,
          transactionHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
          mintedAt: new Date('2025-10-15'),
          verificationHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          ipfsMetadataUrl: 'ipfs://QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3',
          ipfsImageUrl: 'ipfs://QmT3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P',
          explorerUrl: '',
          lastVerified: new Date(),
        },
        metadata: {
          name: 'React.js Expert',
          description: 'Advanced mastery in React.js framework',
          image: 'ipfs://QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3',
          external_url: 'https://skillflow.io/credentials/0x1a2b3c4d',
          attributes: [
            { trait_type: 'Skill', value: 'React.js' },
            { trait_type: 'Level', value: 92, display_type: 'number' },
            { trait_type: 'Category', value: 'Frontend Development' },
            { trait_type: 'Framework Version', value: 'React 18+' },
            { trait_type: 'Experience Years', value: 5, display_type: 'number' },
            { trait_type: 'Projects Completed', value: 28, display_type: 'number' },
          ],
          properties: {
            skill_id: 'react-js',
            skill_name: 'React.js',
            skill_level: 92,
            issued_by: 'SkillFlow Platform',
            issued_at: '2025-10-15T10:30:00Z',
            expires_at: null,
            verification_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          },
        },
        issuedAt: new Date('2025-10-15'),
        expiresAt: null,
        status: VerificationStatus.Verified,
        attributes: [
          formatAttributeForDisplay('Skill', 'React.js'),
          formatAttributeForDisplay('Level', 92, 'number'),
          formatAttributeForDisplay('Experience Years', 5, 'number'),
          formatAttributeForDisplay('Projects Completed', 28, 'number'),
        ],
      };

      // Set explorer URL
      mockCredential.blockchain.explorerUrl = formatExplorerUrl(
        mockCredential.blockchain.network,
        mockCredential.tokenId,
        mockCredential.contractAddress
      );

      // Calculate trust score if not provided
      if (!mockCredential.issuer.trustScore) {
        mockCredential.issuer.trustScore = calculateTrustScore(
          mockCredential.issuer,
          mockCredential.blockchain
        );
      }

      // Verify contract
      updateProgress(ValidationStep.VerifyContract, 'Verifying smart contract...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check ownership
      updateProgress(ValidationStep.CheckOwnership, 'Checking credential ownership...');
      await new Promise(resolve => setTimeout(resolve, 700));

      // Validate signature
      updateProgress(ValidationStep.ValidateSignature, 'Validating cryptographic signature...');
      await new Promise(resolve => setTimeout(resolve, 900));

      // Complete
      updateProgress(ValidationStep.Complete, 'Verification complete!');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create result
      const result: VerificationResult = {
        valid: true,
        state: VerificationState.Verified,
        credential: mockCredential,
        verifiedAt: new Date(),
        verificationId: `vrf_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };

      setVerificationState(VerificationState.Verified);
      setVerificationResult(result);
      setValidationProgress(null);

      return result;
    } catch (err: any) {
      const verificationError: VerificationError = {
        type: err.type || VerificationErrorType.NetworkError,
        message: err.message || 'Verification failed',
        details: err.details,
        code: err.code,
      };

      const result: VerificationResult = {
        valid: false,
        state: VerificationState.Invalid,
        error: verificationError,
        verifiedAt: new Date(),
        verificationId: `vrf_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      };

      setVerificationState(VerificationState.Invalid);
      setVerificationResult(result);
      setValidationProgress(null);
      setError(verificationError.message);

      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset verification
   */
  const reset = useCallback(() => {
    setVerificationState(VerificationState.Idle);
    setVerificationResult(null);
    setValidationProgress(null);
    setError(null);
  }, []);

  /**
   * Share verification
   */
  const shareVerification = useCallback(async (): Promise<string> => {
    if (!verificationResult?.credential) {
      throw new Error('No verification result to share');
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://skillflow.io'}/verify?token=${verificationResult.credential.tokenId}`;
    
    // Copy to clipboard
    await navigator.clipboard.writeText(shareUrl);
    
    return shareUrl;
  }, [verificationResult]);

  const value: VerificationContextState = {
    verificationState,
    verificationResult,
    validationProgress,
    loading,
    error,
    verifyCredential,
    reset,
    shareVerification,
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
};

/**
 * Hook to use verification context
 */
export const useVerification = (): VerificationContextState => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};
