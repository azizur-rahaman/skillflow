/**
 * Credential Verification Feature - Type Definitions
 * 
 * Public verification page for third-party credential authentication with
 * blockchain validation, QR scanning, and secure aesthetic design.
 */

import {
  SkillToken,
  TokenMetadata,
  Network,
  VerificationStatus,
  CredentialCategory,
} from '@/features/wallet/types/wallet.types';

// ============================================================================
// Enums
// ============================================================================

/**
 * Verification input method
 */
export enum VerificationInputMethod {
  TokenID = 'Token ID',
  QRCode = 'QR Code',
  VerificationURL = 'Verification URL',
}

/**
 * Verification state
 */
export enum VerificationState {
  Idle = 'Idle',
  Validating = 'Validating',
  Verified = 'Verified',
  Invalid = 'Invalid',
  Error = 'Error',
}

/**
 * Blockchain validation step
 */
export enum ValidationStep {
  ParseInput = 'Parsing Input',
  FetchMetadata = 'Fetching Metadata',
  VerifyContract = 'Verifying Contract',
  CheckOwnership = 'Checking Ownership',
  ValidateSignature = 'Validating Signature',
  Complete = 'Complete',
}

/**
 * Verification error type
 */
export enum VerificationErrorType {
  InvalidFormat = 'Invalid Format',
  NotFound = 'Not Found',
  Expired = 'Expired',
  Revoked = 'Revoked',
  NetworkError = 'Network Error',
  ContractError = 'Contract Error',
}

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Verification request
 */
export interface VerificationRequest {
  input: string;
  method: VerificationInputMethod;
  timestamp: Date;
}

/**
 * Verification result
 */
export interface VerificationResult {
  valid: boolean;
  state: VerificationState;
  credential?: VerifiedCredential;
  error?: VerificationError;
  verifiedAt: Date;
  verificationId: string;
}

/**
 * Verified credential details
 */
export interface VerifiedCredential {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  category: CredentialCategory;
  skillName: string;
  skillLevel: number;
  imageUrl: string;
  issuer: IssuerInfo;
  owner: OwnerInfo;
  blockchain: BlockchainVerificationData;
  metadata: TokenMetadata;
  issuedAt: Date;
  expiresAt: Date | null;
  status: VerificationStatus;
  attributes: CredentialAttributeDisplay[];
}

/**
 * Issuer information
 */
export interface IssuerInfo {
  id: string;
  name: string;
  logo?: string;
  verified: boolean;
  walletAddress: string;
  website?: string;
  email?: string;
  description?: string;
  certificateNumber?: string;
  trustScore?: number;
}

/**
 * Owner information
 */
export interface OwnerInfo {
  walletAddress: string;
  displayName?: string;
  verifiedIdentity?: boolean;
}

/**
 * Blockchain verification data
 */
export interface BlockchainVerificationData {
  network: Network;
  contractAddress: string;
  tokenId: string;
  blockNumber: number;
  transactionHash: string;
  mintedAt: Date;
  verificationHash: string;
  ipfsMetadataUrl?: string;
  ipfsImageUrl?: string;
  explorerUrl: string;
  lastVerified: Date;
}

/**
 * Credential attribute for display
 */
export interface CredentialAttributeDisplay {
  label: string;
  value: string | number;
  icon?: string;
  highlighted?: boolean;
}

/**
 * Verification error
 */
export interface VerificationError {
  type: VerificationErrorType;
  message: string;
  details?: string;
  code?: string;
}

/**
 * Validation progress
 */
export interface ValidationProgress {
  currentStep: ValidationStep;
  progress: number;
  message: string;
}

// ============================================================================
// Context State
// ============================================================================

/**
 * Verification context state
 */
export interface VerificationContextState {
  // Current state
  verificationState: VerificationState;
  verificationResult: VerificationResult | null;
  validationProgress: ValidationProgress | null;
  loading: boolean;
  error: string | null;

  // Actions
  verifyCredential: (request: VerificationRequest) => Promise<VerificationResult>;
  reset: () => void;
  shareVerification: () => Promise<string>;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * TokenInput component props
 */
export interface TokenInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onVerify?: (request: VerificationRequest) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * BlockchainValidation component props
 */
export interface BlockchainValidationProps {
  progress: ValidationProgress;
  animated?: boolean;
}

/**
 * VerifiedCard component props
 */
export interface VerifiedCardProps {
  credential: VerifiedCredential;
  verificationId: string;
  onShare?: () => void;
  onViewDetails?: () => void;
}

/**
 * InvalidCard component props
 */
export interface InvalidCardProps {
  error: VerificationError;
  onTryAgain?: () => void;
}

/**
 * IssuerDetails component props
 */
export interface IssuerDetailsProps {
  issuer: IssuerInfo;
  blockchain: BlockchainVerificationData;
  compact?: boolean;
}

/**
 * VerificationBadge component props
 */
export interface VerificationBadgeProps {
  status: VerificationState;
  size?: 'small' | 'medium' | 'large';
}

/**
 * QRScanner component props
 */
export interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse verification input
 */
export const parseVerificationInput = (input: string): {
  method: VerificationInputMethod;
  tokenId: string;
} => {
  // Check if URL
  if (input.startsWith('http://') || input.startsWith('https://')) {
    const url = new URL(input);
    const tokenId = url.searchParams.get('token') || url.pathname.split('/').pop() || '';
    return {
      method: VerificationInputMethod.VerificationURL,
      tokenId,
    };
  }

  // Check if token ID (0x prefix)
  if (input.startsWith('0x') || /^[a-fA-F0-9]{40,64}$/.test(input)) {
    return {
      method: VerificationInputMethod.TokenID,
      tokenId: input,
    };
  }

  // Assume QR code data
  return {
    method: VerificationInputMethod.QRCode,
    tokenId: input,
  };
};

/**
 * Validate input format
 */
export const validateInputFormat = (input: string): boolean => {
  if (!input || input.trim().length === 0) return false;

  // URL format
  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  }

  // Token ID format (hex with 0x or without)
  if (/^(0x)?[a-fA-F0-9]{40,64}$/.test(input)) {
    return true;
  }

  // Any other string (could be QR data)
  return input.length > 10;
};

/**
 * Get verification state color
 */
export const getVerificationStateColor = (state: VerificationState): string => {
  const colors: Record<VerificationState, string> = {
    [VerificationState.Idle]: '#64748B', // Slate
    [VerificationState.Validating]: '#3B82F6', // Blue
    [VerificationState.Verified]: '#10B981', // Emerald
    [VerificationState.Invalid]: '#EF4444', // Red
    [VerificationState.Error]: '#F59E0B', // Amber
  };
  return colors[state];
};

/**
 * Get verification state icon
 */
export const getVerificationStateIcon = (state: VerificationState): string => {
  const icons: Record<VerificationState, string> = {
    [VerificationState.Idle]: '🔍',
    [VerificationState.Validating]: '⏳',
    [VerificationState.Verified]: '✅',
    [VerificationState.Invalid]: '❌',
    [VerificationState.Error]: '⚠️',
  };
  return icons[state];
};

/**
 * Get validation step progress
 */
export const getValidationStepProgress = (step: ValidationStep): number => {
  const steps = Object.values(ValidationStep);
  const currentIndex = steps.indexOf(step);
  return ((currentIndex + 1) / steps.length) * 100;
};

/**
 * Format blockchain explorer URL
 */
export const formatExplorerUrl = (
  network: Network,
  tokenId: string,
  contractAddress: string
): string => {
  const baseUrls: Record<Network, string> = {
    [Network.Polygon]: 'https://polygonscan.com',
    [Network.PolygonMumbai]: 'https://mumbai.polygonscan.com',
    [Network.Ethereum]: 'https://etherscan.io',
    [Network.EthereumGoerli]: 'https://goerli.etherscan.io',
  };

  const baseUrl = baseUrls[network] || baseUrls[Network.Polygon];
  return `${baseUrl}/token/${contractAddress}?a=${tokenId}`;
};

/**
 * Calculate trust score
 */
export const calculateTrustScore = (issuer: IssuerInfo, blockchain: BlockchainVerificationData): number => {
  let score = 0;

  // Issuer verified
  if (issuer.verified) score += 30;

  // Has website
  if (issuer.website) score += 10;

  // Has email
  if (issuer.email) score += 5;

  // Recent verification (within 24 hours)
  const hoursSinceVerification = (Date.now() - blockchain.lastVerified.getTime()) / (1000 * 60 * 60);
  if (hoursSinceVerification < 24) score += 25;
  else if (hoursSinceVerification < 168) score += 15; // 1 week
  else if (hoursSinceVerification < 720) score += 10; // 30 days

  // Has IPFS metadata
  if (blockchain.ipfsMetadataUrl) score += 15;

  // Network reliability (Ethereum > Polygon > Testnets)
  if (blockchain.network === Network.Ethereum) score += 15;
  else if (blockchain.network === Network.Polygon) score += 10;
  else score += 5;

  return Math.min(score, 100);
};

/**
 * Get trust level from score
 */
export const getTrustLevel = (score: number): {
  level: string;
  color: string;
  description: string;
} => {
  if (score >= 90) {
    return {
      level: 'Excellent',
      color: '#10B981',
      description: 'Highly trusted credential',
    };
  } else if (score >= 75) {
    return {
      level: 'Good',
      color: '#22D3EE',
      description: 'Trusted credential',
    };
  } else if (score >= 60) {
    return {
      level: 'Fair',
      color: '#F59E0B',
      description: 'Moderately trusted',
    };
  } else {
    return {
      level: 'Low',
      color: '#EF4444',
      description: 'Limited trust indicators',
    };
  }
};

/**
 * Format verification ID
 */
export const formatVerificationId = (id: string): string => {
  return `VRF-${id.slice(0, 8).toUpperCase()}`;
};

/**
 * Generate shareable verification URL
 */
export const generateVerificationUrl = (tokenId: string, verificationHash: string): string => {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'https://skillflow.io'}/verify?token=${tokenId}&hash=${verificationHash}`;
};

/**
 * Get error message for type
 */
export const getErrorMessage = (type: VerificationErrorType): string => {
  const messages: Record<VerificationErrorType, string> = {
    [VerificationErrorType.InvalidFormat]: 'The input format is invalid. Please check and try again.',
    [VerificationErrorType.NotFound]: 'No credential found with this identifier.',
    [VerificationErrorType.Expired]: 'This credential has expired and is no longer valid.',
    [VerificationErrorType.Revoked]: 'This credential has been revoked by the issuer.',
    [VerificationErrorType.NetworkError]: 'Network error. Please check your connection and try again.',
    [VerificationErrorType.ContractError]: 'Unable to verify on blockchain. Please try again later.',
  };
  return messages[type];
};

/**
 * Format attribute for display
 */
export const formatAttributeForDisplay = (
  traitType: string,
  value: string | number,
  displayType?: string
): CredentialAttributeDisplay => {
  let formattedValue: string | number = value;
  let icon: string | undefined;
  let highlighted = false;

  if (displayType === 'boost_percentage') {
    formattedValue = `+${value}%`;
    icon = '📈';
  } else if (displayType === 'number') {
    formattedValue = Number(value).toLocaleString();
  } else if (displayType === 'date') {
    formattedValue = new Date(value).toLocaleDateString();
    icon = '📅';
  }

  // Highlight important attributes
  if (traitType === 'Level' || traitType === 'Skill') {
    highlighted = true;
  }

  return {
    label: traitType,
    value: formattedValue,
    icon,
    highlighted,
  };
};

/**
 * Check if credential is expired
 */
export const isCredentialExpired = (expiresAt: Date | null): boolean => {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
};

/**
 * Get time until expiration
 */
export const getTimeUntilExpiration = (expiresAt: Date | null): string | null => {
  if (!expiresAt) return null;

  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours} hour${hours > 1 ? 's' : ''}`;
};
