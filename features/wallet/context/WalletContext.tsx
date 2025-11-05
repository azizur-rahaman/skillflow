'use client';

/**
 * Wallet Context
 * 
 * Global state management for Web3 wallet, ERC-1155 tokens, and transactions.
 * Provides wallet connection, credential minting, and blockchain interactions.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  WalletContextState,
  UserWallet,
  SkillToken,
  Transaction,
  WalletStats,
  MintCredentialRequest,
  MintCredentialResponse,
  TransferTokenRequest,
  VerificationProof,
  GasEstimate,
  TokenFilters,
  TransactionFilters,
  WalletConnectionStatus,
  Network,
  TokenStandard,
  CredentialCategory,
  VerificationStatus,
  TransactionType,
  TransactionStatus,
} from '../types/wallet.types';

// Create context
const WalletContext = createContext<WalletContextState | undefined>(undefined);

/**
 * Wallet Provider Component
 */
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [tokens, setTokens] = useState<SkillToken[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [selectedToken, setSelectedToken] = useState<SkillToken | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Connect wallet (MetaMask/WalletConnect)
   */
  const connectWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate Web3 wallet connection
      // In production: use ethers.js or web3.js
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockWallet: UserWallet = {
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        network: Network.Polygon,
        connectionStatus: WalletConnectionStatus.Connected,
        balance: {
          totalTokens: 12,
          totalCredentials: 12,
          verifiedCredentials: 8,
          nativeBalance: '2.5',
          nativeBalanceUSD: 2.15,
        },
        connectedAt: new Date(),
        lastSyncedAt: new Date(),
      };

      setWallet(mockWallet);
      await loadWalletData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setTokens([]);
    setTransactions([]);
    setStats(null);
    setSelectedToken(null);
    setError(null);
  }, []);

  /**
   * Load wallet data (tokens, transactions, stats)
   */
  const loadWalletData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock tokens
      const mockTokens: SkillToken[] = [
        {
          tokenId: '0x1a2b3c4d5e6f7g8h9i0j',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          standard: TokenStandard.ERC1155,
          name: 'React.js Expert',
          description: 'Advanced mastery in React.js framework including hooks, context, and performance optimization',
          category: CredentialCategory.SkillMastery,
          skillName: 'React.js',
          skillLevel: 92,
          imageUrl: '/tokens/react-expert.png',
          metadata: {
            name: 'React.js Expert',
            description: 'Advanced mastery in React.js framework',
            image: 'ipfs://QmX1Y2Z3...',
            external_url: 'https://skillflow.io/credentials/0x1a2b3c4d',
            attributes: [
              { trait_type: 'Skill', value: 'React.js' },
              { trait_type: 'Level', value: 92, display_type: 'number' },
              { trait_type: 'Category', value: 'Frontend Development' },
            ],
            properties: {
              skill_id: 'react-js',
              skill_name: 'React.js',
              skill_level: 92,
              issued_by: 'SkillFlow Platform',
              issued_at: '2025-10-15T10:30:00Z',
              expires_at: null,
              verification_hash: '0xabcdef1234567890...',
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
          ],
        },
        {
          tokenId: '0x2b3c4d5e6f7g8h9i0j1k',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          standard: TokenStandard.ERC1155,
          name: 'TypeScript Advanced',
          description: 'Advanced TypeScript skills with generics, decorators, and type system mastery',
          category: CredentialCategory.Certification,
          skillName: 'TypeScript',
          skillLevel: 88,
          imageUrl: '/tokens/typescript-advanced.png',
          metadata: {} as any,
          amount: 1,
          verificationStatus: VerificationStatus.Verified,
          issuer: {
            id: 'microsoft',
            name: 'Microsoft Learn',
            logo: '/issuers/microsoft.png',
            verified: true,
            walletAddress: '0x8765432109876543210987654321098765432109',
          },
          issuedAt: new Date('2025-09-20'),
          expiresAt: new Date('2027-09-20'),
          attributes: [
            { trait_type: 'Skill', value: 'TypeScript' },
            { trait_type: 'Level', value: 88, display_type: 'number' },
            { trait_type: 'Expires', value: 1758355200, display_type: 'date' },
          ],
        },
        {
          tokenId: '0x3c4d5e6f7g8h9i0j1k2l',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          standard: TokenStandard.ERC1155,
          name: 'Node.js Backend Development',
          description: 'Proficient in Node.js backend development with Express, NestJS, and microservices',
          category: CredentialCategory.CourseCompletion,
          skillName: 'Node.js',
          skillLevel: 85,
          imageUrl: '/tokens/nodejs-backend.png',
          metadata: {} as any,
          amount: 1,
          verificationStatus: VerificationStatus.Verified,
          issuer: {
            id: 'udemy',
            name: 'Udemy',
            logo: '/issuers/udemy.png',
            verified: true,
            walletAddress: '0x7654321098765432109876543210987654321098',
          },
          issuedAt: new Date('2025-08-10'),
          expiresAt: null,
          attributes: [
            { trait_type: 'Skill', value: 'Node.js' },
            { trait_type: 'Level', value: 85, display_type: 'number' },
            { trait_type: 'Course', value: 'Complete Node.js Developer' },
          ],
        },
        {
          tokenId: '0x4d5e6f7g8h9i0j1k2l3m',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          standard: TokenStandard.ERC1155,
          name: 'Blockchain Development',
          description: 'Smart contract development with Solidity and Web3 integration',
          category: CredentialCategory.SkillMastery,
          skillName: 'Blockchain',
          skillLevel: 78,
          imageUrl: '/tokens/blockchain-dev.png',
          metadata: {} as any,
          amount: 1,
          verificationStatus: VerificationStatus.Pending,
          issuer: {
            id: 'consensys',
            name: 'ConsenSys Academy',
            logo: '/issuers/consensys.png',
            verified: true,
            walletAddress: '0x6543210987654321098765432109876543210987',
          },
          issuedAt: new Date('2025-11-01'),
          expiresAt: null,
          attributes: [
            { trait_type: 'Skill', value: 'Blockchain' },
            { trait_type: 'Level', value: 78, display_type: 'number' },
            { trait_type: 'Specialization', value: 'Ethereum' },
          ],
        },
        {
          tokenId: '0x5e6f7g8h9i0j1k2l3m4n',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          standard: TokenStandard.ERC1155,
          name: 'AWS Cloud Architect',
          description: 'AWS Solutions Architect certification with cloud infrastructure expertise',
          category: CredentialCategory.Certification,
          skillName: 'AWS',
          skillLevel: 90,
          imageUrl: '/tokens/aws-architect.png',
          metadata: {} as any,
          amount: 1,
          verificationStatus: VerificationStatus.Verified,
          issuer: {
            id: 'aws',
            name: 'Amazon Web Services',
            logo: '/issuers/aws.png',
            verified: true,
            walletAddress: '0x5432109876543210987654321098765432109876',
          },
          issuedAt: new Date('2025-07-15'),
          expiresAt: new Date('2028-07-15'),
          attributes: [
            { trait_type: 'Skill', value: 'AWS' },
            { trait_type: 'Level', value: 90, display_type: 'number' },
            { trait_type: 'Certification', value: 'Solutions Architect - Professional' },
          ],
        },
        {
          tokenId: '0x6f7g8h9i0j1k2l3m4n5o',
          contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
          standard: TokenStandard.ERC1155,
          name: 'Python Data Science',
          description: 'Data science and machine learning with Python, pandas, and scikit-learn',
          category: CredentialCategory.Assessment,
          skillName: 'Python',
          skillLevel: 82,
          imageUrl: '/tokens/python-datascience.png',
          metadata: {} as any,
          amount: 1,
          verificationStatus: VerificationStatus.Verified,
          issuer: {
            id: 'datacamp',
            name: 'DataCamp',
            logo: '/issuers/datacamp.png',
            verified: true,
            walletAddress: '0x4321098765432109876543210987654321098765',
          },
          issuedAt: new Date('2025-06-20'),
          expiresAt: null,
          attributes: [
            { trait_type: 'Skill', value: 'Python' },
            { trait_type: 'Level', value: 82, display_type: 'number' },
            { trait_type: 'Focus', value: 'Data Science' },
          ],
        },
      ];

      // Mock transactions
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          transactionHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
          blockNumber: 45123456,
          type: TransactionType.Mint,
          status: TransactionStatus.Confirmed,
          tokenId: '0x1a2b3c4d5e6f7g8h9i0j',
          tokenName: 'React.js Expert',
          from: '0x0000000000000000000000000000000000000000',
          to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          amount: 1,
          gasUsed: '142580',
          gasFee: '0.00142580',
          network: Network.Polygon,
          timestamp: new Date('2025-10-15T10:30:00'),
          explorerUrl: 'https://polygonscan.com/tx/0xabc123...',
          metadata: {
            skillName: 'React.js',
            category: CredentialCategory.SkillMastery,
            notes: 'Minted for achieving 92% mastery',
          },
        },
        {
          id: '2',
          transactionHash: '0xdef456ghi789jkl012mno345pqr678stu901vwx234yzabc123',
          blockNumber: 45098234,
          type: TransactionType.Mint,
          status: TransactionStatus.Confirmed,
          tokenId: '0x2b3c4d5e6f7g8h9i0j1k',
          tokenName: 'TypeScript Advanced',
          from: '0x0000000000000000000000000000000000000000',
          to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          amount: 1,
          gasUsed: '138920',
          gasFee: '0.00138920',
          network: Network.Polygon,
          timestamp: new Date('2025-09-20T14:20:00'),
          explorerUrl: 'https://polygonscan.com/tx/0xdef456...',
          metadata: {
            skillName: 'TypeScript',
            category: CredentialCategory.Certification,
          },
        },
        {
          id: '3',
          transactionHash: '0xghi789jkl012mno345pqr678stu901vwx234yzabc123def456',
          blockNumber: 45234567,
          type: TransactionType.Receive,
          status: TransactionStatus.Confirmed,
          tokenId: '0x6f7g8h9i0j1k2l3m4n5o',
          tokenName: 'Python Data Science',
          from: '0x4321098765432109876543210987654321098765',
          to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          amount: 1,
          gasUsed: '125340',
          gasFee: '0.00125340',
          network: Network.Polygon,
          timestamp: new Date('2025-06-20T09:15:00'),
          explorerUrl: 'https://polygonscan.com/tx/0xghi789...',
          metadata: {
            skillName: 'Python',
            category: CredentialCategory.Assessment,
            notes: 'Received from DataCamp',
          },
        },
        {
          id: '4',
          transactionHash: '0xjkl012mno345pqr678stu901vwx234yzabc123def456ghi789',
          blockNumber: 45345678,
          type: TransactionType.Mint,
          status: TransactionStatus.Pending,
          tokenId: '0x4d5e6f7g8h9i0j1k2l3m',
          tokenName: 'Blockchain Development',
          from: '0x0000000000000000000000000000000000000000',
          to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          amount: 1,
          gasUsed: '0',
          gasFee: '0',
          network: Network.Polygon,
          timestamp: new Date(),
          explorerUrl: 'https://polygonscan.com/tx/0xjkl012...',
          metadata: {
            skillName: 'Blockchain',
            category: CredentialCategory.SkillMastery,
          },
        },
      ];

      // Mock stats
      const mockStats: WalletStats = {
        totalTokens: 12,
        totalCredentials: 12,
        verifiedCredentials: 8,
        totalTransactions: 15,
        totalMinted: 10,
        totalReceived: 4,
        totalTransferred: 1,
        categoriesCount: {
          [CredentialCategory.SkillMastery]: 4,
          [CredentialCategory.Certification]: 3,
          [CredentialCategory.CourseCompletion]: 2,
          [CredentialCategory.Assessment]: 2,
          [CredentialCategory.Achievement]: 1,
          [CredentialCategory.Endorsement]: 0,
        },
        recentActivity: {
          last7Days: 2,
          last30Days: 6,
        },
      };

      setTokens(mockTokens);
      setTransactions(mockTransactions);
      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wallet data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Mint new credential
   */
  const mintCredential = useCallback(async (
    request: MintCredentialRequest
  ): Promise<MintCredentialResponse> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate minting transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response: MintCredentialResponse = {
        tokenId: `0x${Math.random().toString(16).substring(2, 22)}`,
        transactionHash: `0x${Math.random().toString(16).substring(2)}`,
        contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
        metadataUrl: 'ipfs://QmXYZ123...',
        imageUrl: `/tokens/${request.skillName.toLowerCase()}.png`,
        estimatedConfirmationTime: 15,
      };

      // Refresh wallet data after minting
      await loadWalletData();

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint credential');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadWalletData]);

  /**
   * Transfer token
   */
  const transferToken = useCallback(async (
    request: TransferTokenRequest
  ): Promise<Transaction> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate transfer transaction
      await new Promise(resolve => setTimeout(resolve, 1500));

      const transaction: Transaction = {
        id: `${Date.now()}`,
        transactionHash: `0x${Math.random().toString(16).substring(2)}`,
        blockNumber: 45000000 + Math.floor(Math.random() * 100000),
        type: TransactionType.Transfer,
        status: TransactionStatus.Pending,
        tokenId: request.tokenId,
        tokenName: tokens.find(t => t.tokenId === request.tokenId)?.name || null,
        from: wallet?.walletAddress || '',
        to: request.toAddress,
        amount: request.amount,
        gasUsed: '0',
        gasFee: '0',
        network: Network.Polygon,
        timestamp: new Date(),
        explorerUrl: `https://polygonscan.com/tx/0x...`,
        metadata: {
          notes: request.notes,
        },
      };

      // Refresh wallet data
      await loadWalletData();

      return transaction;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer token');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [wallet, tokens, loadWalletData]);

  /**
   * Verify credential
   */
  const verifyCredential = useCallback(async (
    tokenId: string
  ): Promise<VerificationProof> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      const proof: VerificationProof = {
        tokenId,
        verificationHash: `0x${Math.random().toString(16).substring(2)}`,
        verifier: {
          name: 'SkillFlow Verification',
          address: '0x9876543210fedcba9876543210fedcba98765432',
          verified: true,
        },
        verifiedAt: new Date(),
        proofUrl: `https://skillflow.io/verify/${tokenId}`,
        signature: `0x${Math.random().toString(16).substring(2)}`,
      };

      return proof;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify credential');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get gas estimate
   */
  const getGasEstimate = useCallback(async (
    type: TransactionType
  ): Promise<GasEstimate> => {
    // Simulate gas estimation
    await new Promise(resolve => setTimeout(resolve, 300));

    const estimates: Record<TransactionType, GasEstimate> = {
      [TransactionType.Mint]: {
        gasLimit: '150000',
        maxFeePerGas: '35',
        maxPriorityFeePerGas: '2',
        estimatedCost: '0.00525',
        estimatedCostUSD: 0.0045,
        estimatedTime: 15,
      },
      [TransactionType.Transfer]: {
        gasLimit: '65000',
        maxFeePerGas: '35',
        maxPriorityFeePerGas: '2',
        estimatedCost: '0.002275',
        estimatedCostUSD: 0.0019,
        estimatedTime: 12,
      },
      [TransactionType.Burn]: {
        gasLimit: '45000',
        maxFeePerGas: '35',
        maxPriorityFeePerGas: '2',
        estimatedCost: '0.001575',
        estimatedCostUSD: 0.0013,
        estimatedTime: 10,
      },
      [TransactionType.Receive]: {
        gasLimit: '0',
        maxFeePerGas: '0',
        maxPriorityFeePerGas: '0',
        estimatedCost: '0',
        estimatedCostUSD: 0,
        estimatedTime: 0,
      },
    };

    return estimates[type];
  }, []);

  /**
   * Select token
   */
  const selectToken = useCallback((tokenId: string) => {
    const token = tokens.find(t => t.tokenId === tokenId);
    setSelectedToken(token || null);
  }, [tokens]);

  /**
   * Refresh balance
   */
  const refreshBalance = useCallback(async () => {
    if (!wallet) return;
    
    try {
      setLoading(true);
      await loadWalletData();
    } finally {
      setLoading(false);
    }
  }, [wallet, loadWalletData]);

  /**
   * Filter tokens
   */
  const filterTokens = useCallback((filters: TokenFilters): SkillToken[] => {
    return tokens.filter(token => {
      if (filters.category && token.category !== filters.category) return false;
      if (filters.verificationStatus && token.verificationStatus !== filters.verificationStatus) return false;
      if (filters.skillName && !token.skillName.toLowerCase().includes(filters.skillName.toLowerCase())) return false;
      if (filters.minLevel && token.skillLevel < filters.minLevel) return false;
      if (filters.maxLevel && token.skillLevel > filters.maxLevel) return false;
      if (filters.issuer && token.issuer.id !== filters.issuer) return false;
      return true;
    });
  }, [tokens]);

  /**
   * Filter transactions
   */
  const filterTransactions = useCallback((filters: TransactionFilters): Transaction[] => {
    return transactions.filter(tx => {
      if (filters.type && tx.type !== filters.type) return false;
      if (filters.status && tx.status !== filters.status) return false;
      if (filters.network && tx.network !== filters.network) return false;
      if (filters.startDate && tx.timestamp < filters.startDate) return false;
      if (filters.endDate && tx.timestamp > filters.endDate) return false;
      return true;
    });
  }, [transactions]);

  // Context value
  const value: WalletContextState = {
    wallet,
    tokens,
    transactions,
    stats,
    selectedToken,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    loadWalletData,
    mintCredential,
    transferToken,
    verifyCredential,
    getGasEstimate,
    selectToken,
    refreshBalance,
    filterTokens,
    filterTransactions,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

/**
 * Hook to use wallet context
 */
export const useWallet = (): WalletContextState => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
