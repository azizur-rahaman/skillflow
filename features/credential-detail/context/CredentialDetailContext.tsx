'use client';

/**
 * Credential Detail Context
 * 
 * State management for NFT-style credential detail view with verification,
 * sharing, and download capabilities.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  CredentialDetailContextState,
  CredentialDetail,
  DetailTab,
  VerificationRequest,
  VerificationResponse,
  ShareRequest,
  ShareResponse,
  DisplaySettings,
  VerificationMethod,
  SharePlatform,
  BlockchainData,
  IssuerSignatureData,
  AchievementMilestone,
  RelatedCredential,
  generateQRCodeUrl,
  generateVerificationUrl,
  formatCertificateNumber,
} from '../types/credential-detail.types';
import {
  CredentialCategory,
  VerificationStatus,
  Network,
  TokenStandard,
} from '@/features/wallet/types/wallet.types';

// Create context
const CredentialDetailContext = createContext<CredentialDetailContextState | undefined>(undefined);

/**
 * Credential Detail Provider
 */
export const CredentialDetailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credential, setCredential] = useState<CredentialDetail | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>(DetailTab.Overview);
  const [verification, setVerification] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load credential detail
   */
  const loadCredential = useCallback(async (tokenId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock credential detail data
      const mockCredential: CredentialDetail = {
        tokenId: '0x1a2b3c4d5e6f7g8h9i0j',
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        standard: TokenStandard.ERC1155,
        name: 'React.js Expert',
        description: 'Advanced mastery in React.js framework including hooks, context API, performance optimization, server components, and modern React patterns. Demonstrated through multiple production projects and peer-reviewed code contributions.',
        category: CredentialCategory.SkillMastery,
        skillName: 'React.js',
        skillLevel: 92,
        imageUrl: '/tokens/react-expert.png',
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
            { trait_type: 'Code Reviews', value: 156, display_type: 'number' },
            { trait_type: 'Performance Score', value: 95, display_type: 'boost_percentage' },
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
        amount: 1,
        verificationStatus: VerificationStatus.Verified,
        issuer: {
          id: 'skillflow',
          name: 'SkillFlow Platform',
          logo: '/issuers/skillflow.png',
          verified: true,
          walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
        },
        issuedAt: new Date('2025-10-15'),
        expiresAt: null,
        attributes: [
          { trait_type: 'Skill', value: 'React.js' },
          { trait_type: 'Level', value: 92, display_type: 'number' },
          { trait_type: 'Verified By', value: 'SkillFlow' },
          { trait_type: 'Framework Version', value: 'React 18+' },
        ],
        viewCount: 1247,
        shareCount: 89,
        verificationCount: 34,
        blockchainData: {
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          tokenId: '0x1a2b3c4d5e6f7g8h9i0j',
          tokenStandard: 'ERC-1155',
          network: Network.Polygon,
          blockNumber: 45123456,
          transactionHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
          mintedAt: new Date('2025-10-15T10:30:00'),
          mintedBy: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          ownerAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          ipfsMetadataUrl: 'ipfs://QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3',
          ipfsImageUrl: 'ipfs://QmT3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P',
          verificationHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          chainId: 137,
        },
        relatedCredentials: [
          {
            tokenId: '0x2b3c4d5e6f7g8h9i0j1k',
            name: 'TypeScript Advanced',
            category: CredentialCategory.Certification,
            skillLevel: 88,
            imageUrl: '/tokens/typescript-advanced.png',
            issuer: 'Microsoft Learn',
            issuedAt: new Date('2025-09-20'),
          },
          {
            tokenId: '0x3c4d5e6f7g8h9i0j1k2l',
            name: 'Node.js Backend Development',
            category: CredentialCategory.CourseCompletion,
            skillLevel: 85,
            imageUrl: '/tokens/nodejs-backend.png',
            issuer: 'Udemy',
            issuedAt: new Date('2025-08-10'),
          },
          {
            tokenId: '0x7g8h9i0j1k2l3m4n5o6p',
            name: 'JavaScript ES6+',
            category: CredentialCategory.SkillMastery,
            skillLevel: 90,
            imageUrl: '/tokens/javascript-es6.png',
            issuer: 'SkillFlow Platform',
            issuedAt: new Date('2025-07-05'),
          },
        ],
        achievementPath: [
          {
            id: '1',
            title: 'React Fundamentals',
            description: 'Completed React basics course with 95% score',
            completedAt: new Date('2025-06-01'),
            evidenceUrl: 'https://skillflow.io/courses/react-fundamentals/certificate',
            xpEarned: 500,
          },
          {
            id: '2',
            title: 'Advanced Hooks Mastery',
            description: 'Built 10 projects using advanced React hooks patterns',
            completedAt: new Date('2025-07-15'),
            evidenceUrl: 'https://github.com/user/react-hooks-projects',
            xpEarned: 1000,
          },
          {
            id: '3',
            title: 'Performance Optimization',
            description: 'Achieved 95+ Lighthouse scores on 5 production apps',
            completedAt: new Date('2025-08-20'),
            evidenceUrl: 'https://skillflow.io/projects/performance-showcase',
            xpEarned: 1500,
          },
          {
            id: '4',
            title: 'Community Contribution',
            description: 'Contributed to React open-source ecosystem',
            completedAt: new Date('2025-09-10'),
            evidenceUrl: 'https://github.com/facebook/react/pulls?q=author',
            xpEarned: 2000,
          },
          {
            id: '5',
            title: 'Expert Certification',
            description: 'Passed comprehensive React.js expert assessment',
            completedAt: new Date('2025-10-15'),
            xpEarned: 3000,
          },
        ],
        displaySettings: {
          showInPublicProfile: true,
          allowVerification: true,
          showIssuerSignature: true,
          displaySize: 'large',
          backgroundColor: '#1E293B',
          borderColor: '#6366F1',
        },
      };

      setCredential(mockCredential);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load credential');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request verification
   */
  const requestVerification = useCallback(async (
    request: VerificationRequest
  ): Promise<VerificationResponse> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate verification request
      await new Promise(resolve => setTimeout(resolve, 1000));

      const verificationHash = credential?.blockchainData.verificationHash || '0xabc123';
      const verificationUrl = generateVerificationUrl(request.tokenId, verificationHash);
      const qrCodeUrl = generateQRCodeUrl(verificationUrl);

      const response: VerificationResponse = {
        verified: true,
        proof: {
          tokenId: request.tokenId,
          verificationHash,
          verifier: {
            name: 'SkillFlow Verification Service',
            address: '0x9876543210fedcba9876543210fedcba98765432',
            verified: true,
          },
          verifiedAt: new Date(),
          proofUrl: verificationUrl,
          signature: `0x${Math.random().toString(16).substring(2)}`,
        },
        qrCodeUrl,
        verificationUrl,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      setVerification(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [credential]);

  /**
   * Share credential
   */
  const shareCredential = useCallback(async (
    request: ShareRequest
  ): Promise<ShareResponse> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate share
      await new Promise(resolve => setTimeout(resolve, 500));

      const shareUrl = `https://skillflow.io/credentials/${request.tokenId}`;
      const response: ShareResponse = {
        shareUrl,
        platform: request.platform,
        shareId: `share_${Date.now()}`,
      };

      // Update share count
      if (credential) {
        setCredential({
          ...credential,
          shareCount: credential.shareCount + 1,
        });
      }

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Share failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [credential]);

  /**
   * Download credential
   */
  const downloadCredential = useCallback(async (
    format: 'pdf' | 'png' | 'json'
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, generate actual file
      console.log(`Downloading credential as ${format}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update display settings
   */
  const updateDisplaySettings = useCallback(async (
    settings: Partial<DisplaySettings>
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate update
      await new Promise(resolve => setTimeout(resolve, 500));

      if (credential) {
        setCredential({
          ...credential,
          displaySettings: {
            ...credential.displaySettings,
            ...settings,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [credential]);

  /**
   * Refresh metadata
   */
  const refreshMetadata = useCallback(async (): Promise<void> => {
    if (!credential) return;
    
    try {
      setLoading(true);
      await loadCredential(credential.tokenId);
    } finally {
      setLoading(false);
    }
  }, [credential, loadCredential]);

  const value: CredentialDetailContextState = {
    credential,
    activeTab,
    verification,
    loading,
    error,
    loadCredential,
    setActiveTab,
    requestVerification,
    shareCredential,
    downloadCredential,
    updateDisplaySettings,
    refreshMetadata,
  };

  return (
    <CredentialDetailContext.Provider value={value}>
      {children}
    </CredentialDetailContext.Provider>
  );
};

/**
 * Hook to use credential detail context
 */
export const useCredentialDetail = (): CredentialDetailContextState => {
  const context = useContext(CredentialDetailContext);
  if (!context) {
    throw new Error('useCredentialDetail must be used within a CredentialDetailProvider');
  }
  return context;
};
