/**
 * Wallet Feature - Type Definitions
 * 
 * Web3-style wallet for managing ERC-1155 skill credentials and tokens.
 * Minimalist blockchain aesthetic with clean typography.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Token standard type
 */
export enum TokenStandard {
  ERC1155 = 'ERC1155',
  ERC721 = 'ERC721',
  ERC20 = 'ERC20',
}

/**
 * Blockchain network
 */
export enum Network {
  Polygon = 'Polygon',
  PolygonMumbai = 'Polygon Mumbai',
  Ethereum = 'Ethereum',
  EthereumGoerli = 'Ethereum Goerli',
}

/**
 * Transaction type
 */
export enum TransactionType {
  Mint = 'Mint',
  Transfer = 'Transfer',
  Burn = 'Burn',
  Receive = 'Receive',
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Failed = 'Failed',
}

/**
 * Credential category
 */
export enum CredentialCategory {
  SkillMastery = 'Skill Mastery',
  CourseCompletion = 'Course Completion',
  Assessment = 'Assessment',
  Certification = 'Certification',
  Achievement = 'Achievement',
  Endorsement = 'Endorsement',
}

/**
 * Verification status
 */
export enum VerificationStatus {
  Verified = 'Verified',
  Pending = 'Pending',
  Unverified = 'Unverified',
}

/**
 * Wallet connection status
 */
export enum WalletConnectionStatus {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Error = 'Error',
}

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * User wallet
 */
export interface UserWallet {
  walletAddress: string;
  network: Network;
  connectionStatus: WalletConnectionStatus;
  balance: WalletBalance;
  connectedAt: Date;
  lastSyncedAt: Date;
}

/**
 * Wallet balance summary
 */
export interface WalletBalance {
  totalTokens: number;
  totalCredentials: number;
  verifiedCredentials: number;
  nativeBalance: string; // MATIC or ETH
  nativeBalanceUSD: number;
}

/**
 * ERC-1155 Token (Skill Credential)
 */
export interface SkillToken {
  tokenId: string;
  contractAddress: string;
  standard: TokenStandard;
  name: string;
  description: string;
  category: CredentialCategory;
  skillName: string;
  skillLevel: number; // 1-100
  imageUrl: string;
  metadata: TokenMetadata;
  amount: number; // ERC-1155 supports multiple copies
  verificationStatus: VerificationStatus;
  issuer: TokenIssuer;
  issuedAt: Date;
  expiresAt: Date | null;
  attributes: TokenAttribute[];
}

/**
 * Token metadata (IPFS/blockchain)
 */
export interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: TokenAttribute[];
  properties: {
    skill_id: string;
    skill_name: string;
    skill_level: number;
    issued_by: string;
    issued_at: string;
    expires_at: string | null;
    verification_hash: string;
  };
}

/**
 * Token attribute (OpenSea standard)
 */
export interface TokenAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date';
}

/**
 * Token issuer (organization/platform)
 */
export interface TokenIssuer {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  walletAddress: string;
}

/**
 * Blockchain transaction
 */
export interface Transaction {
  id: string;
  transactionHash: string;
  blockNumber: number;
  type: TransactionType;
  status: TransactionStatus;
  tokenId: string | null;
  tokenName: string | null;
  from: string;
  to: string;
  amount: number;
  gasUsed: string;
  gasFee: string;
  network: Network;
  timestamp: Date;
  explorerUrl: string;
  metadata: {
    skillName?: string;
    category?: CredentialCategory;
    notes?: string;
  };
}

/**
 * Mint credential request
 */
export interface MintCredentialRequest {
  skillId: string;
  skillName: string;
  skillLevel: number;
  category: CredentialCategory;
  evidenceUrl?: string;
  description?: string;
  attributes?: TokenAttribute[];
}

/**
 * Mint credential response
 */
export interface MintCredentialResponse {
  tokenId: string;
  transactionHash: string;
  contractAddress: string;
  metadataUrl: string;
  imageUrl: string;
  estimatedConfirmationTime: number; // seconds
}

/**
 * Transfer token request
 */
export interface TransferTokenRequest {
  tokenId: string;
  toAddress: string;
  amount: number;
  notes?: string;
}

/**
 * Verification proof
 */
export interface VerificationProof {
  tokenId: string;
  verificationHash: string;
  verifier: {
    name: string;
    address: string;
    verified: boolean;
  };
  verifiedAt: Date;
  proofUrl: string;
  signature: string;
}

/**
 * Wallet statistics
 */
export interface WalletStats {
  totalTokens: number;
  totalCredentials: number;
  verifiedCredentials: number;
  totalTransactions: number;
  totalMinted: number;
  totalReceived: number;
  totalTransferred: number;
  categoriesCount: Record<CredentialCategory, number>;
  recentActivity: {
    last7Days: number;
    last30Days: number;
  };
}

/**
 * Gas estimation
 */
export interface GasEstimate {
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  estimatedCost: string;
  estimatedCostUSD: number;
  estimatedTime: number; // seconds
}

// ============================================================================
// Context State
// ============================================================================

/**
 * Wallet context state
 */
export interface WalletContextState {
  wallet: UserWallet | null;
  tokens: SkillToken[];
  transactions: Transaction[];
  stats: WalletStats | null;
  selectedToken: SkillToken | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loadWalletData: () => Promise<void>;
  mintCredential: (request: MintCredentialRequest) => Promise<MintCredentialResponse>;
  transferToken: (request: TransferTokenRequest) => Promise<Transaction>;
  verifyCredential: (tokenId: string) => Promise<VerificationProof>;
  getGasEstimate: (type: TransactionType) => Promise<GasEstimate>;
  selectToken: (tokenId: string) => void;
  refreshBalance: () => Promise<void>;
  filterTokens: (filters: TokenFilters) => SkillToken[];
  filterTransactions: (filters: TransactionFilters) => Transaction[];
}

/**
 * Token filters
 */
export interface TokenFilters {
  category?: CredentialCategory;
  verificationStatus?: VerificationStatus;
  skillName?: string;
  minLevel?: number;
  maxLevel?: number;
  issuer?: string;
}

/**
 * Transaction filters
 */
export interface TransactionFilters {
  type?: TransactionType;
  status?: TransactionStatus;
  network?: Network;
  startDate?: Date;
  endDate?: Date;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * WalletBalance component props
 */
export interface WalletBalanceProps {
  wallet: UserWallet;
  stats: WalletStats;
  onConnect?: () => void;
  onDisconnect?: () => void;
  showDetails?: boolean;
}

/**
 * TokenList component props
 */
export interface TokenListProps {
  tokens: SkillToken[];
  loading?: boolean;
  onTokenClick?: (token: SkillToken) => void;
  onMintClick?: () => void;
  filters?: TokenFilters;
  onFilterChange?: (filters: TokenFilters) => void;
}

/**
 * TokenCard component props
 */
export interface TokenCardProps {
  token: SkillToken;
  onClick?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

/**
 * TransactionHistory component props
 */
export interface TransactionHistoryProps {
  transactions: Transaction[];
  loading?: boolean;
  filters?: TransactionFilters;
  onFilterChange?: (filters: TransactionFilters) => void;
  onTransactionClick?: (transaction: Transaction) => void;
}

/**
 * TransactionItem component props
 */
export interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
  showNetwork?: boolean;
}

/**
 * MintCredentialButton component props
 */
export interface MintCredentialButtonProps {
  onMint: (request: MintCredentialRequest) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * MintCredentialModal component props
 */
export interface MintCredentialModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (request: MintCredentialRequest) => Promise<void>;
  gasEstimate?: GasEstimate;
  loading?: boolean;
}

/**
 * VerificationBadge component props
 */
export interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

/**
 * NetworkBadge component props
 */
export interface NetworkBadgeProps {
  network: Network;
  showIcon?: boolean;
}

/**
 * WalletConnectButton component props
 */
export interface WalletConnectButtonProps {
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  connectionStatus: WalletConnectionStatus;
  walletAddress?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format wallet address (0x1234...5678)
 */
export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Format token ID
 */
export const formatTokenId = (tokenId: string): string => {
  if (!tokenId || tokenId.length <= 8) return tokenId;
  return `#${tokenId.slice(-8)}`;
};

/**
 * Get network color
 */
export const getNetworkColor = (network: Network): string => {
  switch (network) {
    case Network.Polygon:
      return '#A855F7'; // Purple
    case Network.PolygonMumbai:
      return '#A855F7'; // Purple
    case Network.Ethereum:
      return '#6366F1'; // Indigo
    case Network.EthereumGoerli:
      return '#6366F1'; // Indigo
    default:
      return '#94A3B8'; // Slate
  }
};

/**
 * Get network icon
 */
export const getNetworkIcon = (network: Network): string => {
  switch (network) {
    case Network.Polygon:
    case Network.PolygonMumbai:
      return '⬡'; // Polygon logo
    case Network.Ethereum:
    case Network.EthereumGoerli:
      return '◆'; // Ethereum logo
    default:
      return '◆';
  }
};

/**
 * Get transaction type color
 */
export const getTransactionTypeColor = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.Mint:
      return '#10B981'; // Green
    case TransactionType.Transfer:
      return '#F59E0B'; // Orange
    case TransactionType.Receive:
      return '#22D3EE'; // Cyan
    case TransactionType.Burn:
      return '#EF4444'; // Red
    default:
      return '#94A3B8'; // Slate
  }
};

/**
 * Get transaction type icon
 */
export const getTransactionTypeIcon = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.Mint:
      return 'Sparkles';
    case TransactionType.Transfer:
      return 'Send';
    case TransactionType.Receive:
      return 'Download';
    case TransactionType.Burn:
      return 'Flame';
    default:
      return 'Activity';
  }
};

/**
 * Get transaction status color
 */
export const getTransactionStatusColor = (status: TransactionStatus): string => {
  switch (status) {
    case TransactionStatus.Confirmed:
      return '#10B981'; // Green
    case TransactionStatus.Pending:
      return '#F59E0B'; // Orange
    case TransactionStatus.Failed:
      return '#EF4444'; // Red
    default:
      return '#94A3B8'; // Slate
  }
};

/**
 * Get verification status color
 */
export const getVerificationStatusColor = (status: VerificationStatus): string => {
  switch (status) {
    case VerificationStatus.Verified:
      return '#10B981'; // Green
    case VerificationStatus.Pending:
      return '#F59E0B'; // Orange
    case VerificationStatus.Unverified:
      return '#94A3B8'; // Slate
    default:
      return '#94A3B8';
  }
};

/**
 * Get category color
 */
export const getCategoryColor = (category: CredentialCategory): string => {
  switch (category) {
    case CredentialCategory.SkillMastery:
      return '#6366F1'; // Indigo
    case CredentialCategory.CourseCompletion:
      return '#10B981'; // Green
    case CredentialCategory.Assessment:
      return '#22D3EE'; // Cyan
    case CredentialCategory.Certification:
      return '#A855F7'; // Purple
    case CredentialCategory.Achievement:
      return '#F59E0B'; // Orange
    case CredentialCategory.Endorsement:
      return '#EC4899'; // Pink
    default:
      return '#94A3B8'; // Slate
  }
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category: CredentialCategory): string => {
  switch (category) {
    case CredentialCategory.SkillMastery:
      return 'Trophy';
    case CredentialCategory.CourseCompletion:
      return 'GraduationCap';
    case CredentialCategory.Assessment:
      return 'CheckCircle';
    case CredentialCategory.Certification:
      return 'Award';
    case CredentialCategory.Achievement:
      return 'Star';
    case CredentialCategory.Endorsement:
      return 'ThumbsUp';
    default:
      return 'FileText';
  }
};

/**
 * Format gas fee (Wei to MATIC/ETH)
 */
export const formatGasFee = (wei: string, decimals: number = 18): string => {
  const value = parseFloat(wei) / Math.pow(10, decimals);
  if (value < 0.000001) return '<0.000001';
  if (value < 0.001) return value.toFixed(6);
  if (value < 1) return value.toFixed(4);
  return value.toFixed(2);
};

/**
 * Format USD amount
 */
export const formatUSD = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format timestamp
 */
export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Get explorer URL
 */
export const getExplorerUrl = (
  network: Network,
  transactionHash: string
): string => {
  const baseUrls: Record<Network, string> = {
    [Network.Polygon]: 'https://polygonscan.com',
    [Network.PolygonMumbai]: 'https://mumbai.polygonscan.com',
    [Network.Ethereum]: 'https://etherscan.io',
    [Network.EthereumGoerli]: 'https://goerli.etherscan.io',
  };

  return `${baseUrls[network]}/tx/${transactionHash}`;
};

/**
 * Validate wallet address
 */
export const isValidWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Calculate token rarity score (0-100)
 */
export const calculateRarityScore = (token: SkillToken): number => {
  let score = 0;
  
  // Verification adds 30 points
  if (token.verificationStatus === VerificationStatus.Verified) {
    score += 30;
  }
  
  // High skill level adds up to 30 points
  score += (token.skillLevel / 100) * 30;
  
  // Category rarity
  const categoryScores: Record<CredentialCategory, number> = {
    [CredentialCategory.SkillMastery]: 25,
    [CredentialCategory.Certification]: 20,
    [CredentialCategory.Achievement]: 15,
    [CredentialCategory.Assessment]: 10,
    [CredentialCategory.CourseCompletion]: 5,
    [CredentialCategory.Endorsement]: 5,
  };
  score += categoryScores[token.category] || 0;
  
  // Scarcity (lower amount = higher rarity)
  if (token.amount === 1) score += 15;
  else if (token.amount <= 5) score += 10;
  else if (token.amount <= 10) score += 5;
  
  return Math.min(100, score);
};
