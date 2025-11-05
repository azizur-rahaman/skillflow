/**
 * Credential Detail Feature - Type Definitions
 * 
 * NFT-style credential detail page with metadata display, verification QR,
 * and issuer signature. Elegant futuristic blockchain aesthetic.
 */

import {
  SkillToken,
  TokenMetadata,
  TokenAttribute,
  TokenIssuer,
  VerificationProof,
  CredentialCategory,
  VerificationStatus,
  Network,
} from '@/features/wallet/types/wallet.types';

// ============================================================================
// Enums
// ============================================================================

/**
 * Detail view tab
 */
export enum DetailTab {
  Overview = 'Overview',
  Metadata = 'Metadata',
  Attributes = 'Attributes',
  Verification = 'Verification',
  History = 'History',
}

/**
 * Verification method
 */
export enum VerificationMethod {
  QRCode = 'QR Code',
  Link = 'Link',
  Blockchain = 'Blockchain',
  API = 'API',
}

/**
 * Share platform
 */
export enum SharePlatform {
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter',
  Email = 'Email',
  Copy = 'Copy Link',
}

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Extended credential detail with full metadata
 */
export interface CredentialDetail extends SkillToken {
  viewCount: number;
  shareCount: number;
  verificationCount: number;
  blockchainData: BlockchainData;
  relatedCredentials: RelatedCredential[];
  achievementPath: AchievementMilestone[];
  displaySettings: DisplaySettings;
}

/**
 * Blockchain data
 */
export interface BlockchainData {
  contractAddress: string;
  tokenId: string;
  tokenStandard: string;
  network: Network;
  blockNumber: number;
  transactionHash: string;
  mintedAt: Date;
  mintedBy: string;
  ownerAddress: string;
  ipfsMetadataUrl: string;
  ipfsImageUrl: string;
  verificationHash: string;
  chainId: number;
}

/**
 * Related credential
 */
export interface RelatedCredential {
  tokenId: string;
  name: string;
  category: CredentialCategory;
  skillLevel: number;
  imageUrl: string;
  issuer: string;
  issuedAt: Date;
}

/**
 * Achievement milestone
 */
export interface AchievementMilestone {
  id: string;
  title: string;
  description: string;
  completedAt: Date;
  evidenceUrl?: string;
  xpEarned: number;
}

/**
 * Display settings
 */
export interface DisplaySettings {
  showInPublicProfile: boolean;
  allowVerification: boolean;
  showIssuerSignature: boolean;
  displaySize: 'small' | 'medium' | 'large';
  backgroundColor: string;
  borderColor: string;
}

/**
 * Verification request
 */
export interface VerificationRequest {
  tokenId: string;
  method: VerificationMethod;
  verifierAddress?: string;
  verifierEmail?: string;
}

/**
 * Verification response
 */
export interface VerificationResponse {
  verified: boolean;
  proof: VerificationProof;
  qrCodeUrl: string;
  verificationUrl: string;
  expiresAt: Date;
}

/**
 * Share request
 */
export interface ShareRequest {
  tokenId: string;
  platform: SharePlatform;
  message?: string;
}

/**
 * Share response
 */
export interface ShareResponse {
  shareUrl: string;
  platform: SharePlatform;
  shareId: string;
}

/**
 * Issuer signature
 */
export interface IssuerSignatureData {
  issuer: TokenIssuer;
  signerName: string;
  signerTitle: string;
  signedAt: Date;
  signature: string;
  signatureImageUrl: string;
  certificateNumber: string;
  validUntil: Date | null;
}

/**
 * Metadata field
 */
export interface MetadataField {
  label: string;
  value: string | number | Date;
  type: 'text' | 'number' | 'date' | 'link' | 'address';
  copyable?: boolean;
  clickable?: boolean;
  href?: string;
}

/**
 * Credential action
 */
export interface CredentialAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

// ============================================================================
// Context State
// ============================================================================

/**
 * Credential detail context state
 */
export interface CredentialDetailContextState {
  credential: CredentialDetail | null;
  activeTab: DetailTab;
  verification: VerificationResponse | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadCredential: (tokenId: string) => Promise<void>;
  setActiveTab: (tab: DetailTab) => void;
  requestVerification: (request: VerificationRequest) => Promise<VerificationResponse>;
  shareCredential: (request: ShareRequest) => Promise<ShareResponse>;
  downloadCredential: (format: 'pdf' | 'png' | 'json') => Promise<void>;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => Promise<void>;
  refreshMetadata: () => Promise<void>;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * CredentialCard component props
 */
export interface CredentialCardProps {
  credential: CredentialDetail;
  size?: 'small' | 'medium' | 'large';
  showActions?: boolean;
  onAction?: (action: string) => void;
  onShare?: () => void;
  onDownload?: () => void;
  onViewBlockchain?: () => void;
}

/**
 * MetadataTable component props
 */
export interface MetadataTableProps {
  metadata: TokenMetadata;
  blockchainData: BlockchainData;
  compact?: boolean;
}

/**
 * VerificationQR component props
 */
export interface VerificationQRProps {
  credential: CredentialDetail;
  verification: VerificationResponse | null;
  onVerify: (method: VerificationMethod) => Promise<void>;
  loading?: boolean;
}

/**
 * IssuerSignature component props
 */
export interface IssuerSignatureProps {
  signature: IssuerSignatureData;
  compact?: boolean;
}

/**
 * AttributesGrid component props
 */
export interface AttributesGridProps {
  attributes: TokenAttribute[];
  category: CredentialCategory;
}

/**
 * BlockchainInfo component props
 */
export interface BlockchainInfoProps {
  blockchainData: BlockchainData;
  showExplorerLink?: boolean;
}

/**
 * RelatedCredentials component props
 */
export interface RelatedCredentialsProps {
  credentials: RelatedCredential[];
  onCredentialClick?: (tokenId: string) => void;
}

/**
 * AchievementTimeline component props
 */
export interface AchievementTimelineProps {
  milestones: AchievementMilestone[];
}

/**
 * CredentialActions component props
 */
export interface CredentialActionsProps {
  actions: CredentialAction[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate verification QR code URL
 */
export const generateQRCodeUrl = (verificationUrl: string): string => {
  const encodedUrl = encodeURIComponent(verificationUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`;
};

/**
 * Generate public verification URL
 */
export const generateVerificationUrl = (tokenId: string, verificationHash: string): string => {
  return `https://skillflow.io/verify/${tokenId}?hash=${verificationHash}`;
};

/**
 * Format certificate number
 */
export const formatCertificateNumber = (tokenId: string, issuedAt: Date): string => {
  const year = issuedAt.getFullYear();
  const month = String(issuedAt.getMonth() + 1).padStart(2, '0');
  const id = tokenId.slice(-8).toUpperCase();
  return `SF-${year}${month}-${id}`;
};

/**
 * Get attribute display type
 */
export const getAttributeDisplayType = (trait: string): string => {
  const percentageTraits = ['Level', 'Progress', 'Completion', 'Mastery'];
  const dateTraits = ['Issued', 'Expires', 'Verified'];
  const numberTraits = ['Score', 'Points', 'XP', 'Rank'];

  if (percentageTraits.some(t => trait.includes(t))) return 'percentage';
  if (dateTraits.some(t => trait.includes(t))) return 'date';
  if (numberTraits.some(t => trait.includes(t))) return 'number';
  return 'text';
};

/**
 * Format attribute value
 */
export const formatAttributeValue = (
  value: string | number,
  displayType?: string
): string => {
  if (displayType === 'percentage') {
    return `${value}%`;
  }
  if (displayType === 'date') {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  if (displayType === 'number') {
    return value.toLocaleString();
  }
  return String(value);
};

/**
 * Get share URL for platform
 */
export const getShareUrl = (
  platform: SharePlatform,
  credentialUrl: string,
  message: string
): string => {
  const encodedUrl = encodeURIComponent(credentialUrl);
  const encodedMessage = encodeURIComponent(message);

  switch (platform) {
    case SharePlatform.LinkedIn:
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case SharePlatform.Twitter:
      return `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
    case SharePlatform.Email:
      return `mailto:?subject=${encodedMessage}&body=${encodedUrl}`;
    case SharePlatform.Copy:
      return credentialUrl;
    default:
      return credentialUrl;
  }
};

/**
 * Calculate credential rarity tier
 */
export const getRarityTier = (rarityScore: number): string => {
  if (rarityScore >= 90) return 'Legendary';
  if (rarityScore >= 75) return 'Epic';
  if (rarityScore >= 60) return 'Rare';
  if (rarityScore >= 40) return 'Uncommon';
  return 'Common';
};

/**
 * Get rarity color
 */
export const getRarityColor = (tier: string): string => {
  switch (tier) {
    case 'Legendary':
      return '#F59E0B'; // Gold
    case 'Epic':
      return '#A855F7'; // Purple
    case 'Rare':
      return '#22D3EE'; // Cyan
    case 'Uncommon':
      return '#10B981'; // Green
    case 'Common':
      return '#94A3B8'; // Slate
    default:
      return '#94A3B8';
  }
};

/**
 * Validate verification hash
 */
export const validateVerificationHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
};

/**
 * Format blockchain explorer URL
 */
export const formatBlockchainExplorerUrl = (
  network: Network,
  type: 'tx' | 'address' | 'token',
  value: string
): string => {
  const baseUrls: Record<Network, string> = {
    Polygon: 'https://polygonscan.com',
    'Polygon Mumbai': 'https://mumbai.polygonscan.com',
    Ethereum: 'https://etherscan.io',
    'Ethereum Goerli': 'https://goerli.etherscan.io',
  };

  const paths: Record<typeof type, string> = {
    tx: 'tx',
    address: 'address',
    token: 'token',
  };

  return `${baseUrls[network]}/${paths[type]}/${value}`;
};

/**
 * Generate credential embed code
 */
export const generateEmbedCode = (tokenId: string, size: 'small' | 'medium' | 'large'): string => {
  const sizes = {
    small: '200x300',
    medium: '300x450',
    large: '400x600',
  };

  return `<iframe src="https://skillflow.io/embed/credential/${tokenId}" width="${sizes[size].split('x')[0]}" height="${sizes[size].split('x')[1]}" frameborder="0"></iframe>`;
};

/**
 * Get metadata fields for display
 */
export const getMetadataFields = (
  credential: CredentialDetail
): MetadataField[] => {
  return [
    {
      label: 'Token ID',
      value: credential.tokenId,
      type: 'text',
      copyable: true,
    },
    {
      label: 'Certificate Number',
      value: formatCertificateNumber(credential.tokenId, credential.issuedAt),
      type: 'text',
      copyable: true,
    },
    {
      label: 'Issued Date',
      value: credential.issuedAt,
      type: 'date',
    },
    {
      label: 'Expiry Date',
      value: credential.expiresAt || 'Never',
      type: credential.expiresAt ? 'date' : 'text',
    },
    {
      label: 'Skill Level',
      value: `${credential.skillLevel}%`,
      type: 'text',
    },
    {
      label: 'Category',
      value: credential.category,
      type: 'text',
    },
    {
      label: 'Verification Status',
      value: credential.verificationStatus,
      type: 'text',
    },
    {
      label: 'Issuer',
      value: credential.issuer.name,
      type: 'text',
    },
    {
      label: 'Contract Address',
      value: credential.contractAddress,
      type: 'address',
      copyable: true,
      clickable: true,
      href: formatBlockchainExplorerUrl(
        credential.blockchainData.network,
        'address',
        credential.contractAddress
      ),
    },
    {
      label: 'Network',
      value: credential.blockchainData.network,
      type: 'text',
    },
    {
      label: 'Block Number',
      value: credential.blockchainData.blockNumber,
      type: 'number',
    },
    {
      label: 'Transaction Hash',
      value: credential.blockchainData.transactionHash,
      type: 'address',
      copyable: true,
      clickable: true,
      href: formatBlockchainExplorerUrl(
        credential.blockchainData.network,
        'tx',
        credential.blockchainData.transactionHash
      ),
    },
  ];
};

/**
 * Calculate credential score
 */
export const calculateCredentialScore = (credential: CredentialDetail): number => {
  let score = 0;

  // Skill level contributes 40%
  score += (credential.skillLevel / 100) * 40;

  // Verification adds 30%
  if (credential.verificationStatus === 'Verified') {
    score += 30;
  } else if (credential.verificationStatus === 'Pending') {
    score += 15;
  }

  // Issuer verification adds 20%
  if (credential.issuer.verified) {
    score += 20;
  }

  // Category importance adds 10%
  const categoryScores: Record<CredentialCategory, number> = {
    'Skill Mastery': 10,
    Certification: 8,
    Achievement: 6,
    Assessment: 5,
    'Course Completion': 4,
    Endorsement: 3,
  };
  score += categoryScores[credential.category] || 0;

  return Math.min(100, score);
};
