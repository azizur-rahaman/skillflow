/**
 * Marketplace Skill Detail Types
 * 
 * Type definitions for the marketplace skill token detail page
 * with purchase flow and crypto checkout.
 */

import { SkillCategory, SkillListing, Seller } from '@/features/marketplace/types/marketplace.types';

// ============================================================================
// Enums
// ============================================================================

/**
 * Transaction step in crypto checkout flow
 */
export enum TransactionStep {
  Idle = 'Idle',
  ConnectingWallet = 'Connecting Wallet',
  WalletConnected = 'Wallet Connected',
  SigningTransaction = 'Signing Transaction',
  ProcessingTransaction = 'Processing Transaction',
  Confirming = 'Confirming on Blockchain',
  Success = 'Transaction Successful',
  Failed = 'Transaction Failed',
}

/**
 * Tab options for marketplace skill detail page
 */
export enum MarketplaceDetailTab {
  Description = 'Description',
  Reviews = 'Reviews',
  Issuer = 'Issuer',
}

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Extended skill detail with full marketplace information
 */
export interface MarketplaceSkillDetail extends SkillListing {
  // Additional detail fields
  fullDescription: string;
  learningOutcomes: string[];
  prerequisites: string[];
  skillDomain: string;
  certificationType: string;
  validityPeriod?: string; // e.g., "Lifetime" or "2 years"
  
  // Issuer information
  issuer: IssuerCredential;
  
  // Reviews
  reviews: Review[];
  reviewStats: ReviewStats;
  
  // Token information
  tokenStandard: string; // e.g., "ERC-1155"
  contractAddress: string;
  mintedDate: Date;
  totalSupply: number;
  circulatingSupply: number;
  
  // Additional metadata
  videoUrl?: string;
  sampleCertificate?: string;
  relatedSkills: RelatedSkill[];
}

/**
 * Related skill reference
 */
export interface RelatedSkill {
  id: string;
  title: string;
  category: SkillCategory;
  price: number;
  image: string;
  rating: number;
}

/**
 * Issuer credential information
 */
export interface IssuerCredential {
  id: string;
  organizationName: string;
  logo: string;
  website: string;
  description: string;
  establishedYear: number;
  totalCredentialsIssued: number;
  verificationLevel: 'Basic' | 'Verified' | 'Premium' | 'Enterprise';
  
  // Credentials
  accreditations: Accreditation[];
  
  // Contact
  email?: string;
  location?: string;
  
  // Social proof
  followers: number;
  rating: number; // 0-5
  
  // Blockchain
  walletAddress: string;
  verified: boolean;
}

/**
 * Accreditation for issuer
 */
export interface Accreditation {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  verificationUrl?: string;
  logo?: string;
}

/**
 * Review for skill
 */
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userWallet: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: Date;
  helpful: number; // Number of helpful votes
  verified: boolean; // Verified purchase
  
  // User info
  userLevel?: string;
  userBadge?: string;
}

/**
 * Review statistics
 */
export interface ReviewStats {
  averageRating: number; // 0-5
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedPurchaseCount: number;
}

/**
 * Transaction state for crypto checkout
 */
export interface TransactionState {
  step: TransactionStep;
  transactionHash?: string;
  walletAddress?: string;
  error?: string;
  estimatedGas?: string;
  networkFee?: number;
  totalCost?: number; // Price + network fee
}

/**
 * Wallet connection info
 */
export interface WalletInfo {
  address: string;
  balance: number; // FLOW balance
  balanceUSD: number;
  connected: boolean;
  provider?: 'MetaMask' | 'WalletConnect' | 'Coinbase' | 'Phantom';
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * SkillBanner component props
 */
export interface SkillBannerProps {
  skill: MarketplaceSkillDetail;
  onBack?: () => void;
}

/**
 * PurchasePanel component props
 */
export interface PurchasePanelProps {
  skill: MarketplaceSkillDetail;
  onBuyNow: () => void;
  onAddToCart: () => void;
  inCart: boolean;
  isPurchasing: boolean;
}

/**
 * TabsSection component props
 */
export interface TabsSectionProps {
  skill: MarketplaceSkillDetail;
  activeTab: MarketplaceDetailTab;
  onTabChange: (tab: MarketplaceDetailTab) => void;
}

/**
 * CryptoCheckoutModal component props
 */
export interface CryptoCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: MarketplaceSkillDetail;
  transactionState: TransactionState;
  onConfirm: () => Promise<void>;
}

/**
 * ReviewCard component props
 */
export interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

/**
 * IssuerCard component props
 */
export interface IssuerCardProps {
  issuer: IssuerCredential;
  onViewProfile?: () => void;
}

/**
 * ReviewStars component props
 */
export interface ReviewStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  editable?: boolean;
  onChange?: (rating: number) => void;
}

/**
 * RatingDistribution component props
 */
export interface RatingDistributionProps {
  stats: ReviewStats;
}

// ============================================================================
// Context State
// ============================================================================

/**
 * MarketplaceSkillDetail context state
 */
export interface MarketplaceSkillDetailContextState {
  // Data
  skill: MarketplaceSkillDetail | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  activeTab: MarketplaceDetailTab;
  
  // Purchase flow
  isPurchasing: boolean;
  showCheckoutModal: boolean;
  transactionState: TransactionState;
  
  // Wallet
  wallet: WalletInfo | null;
  
  // Cart
  inCart: boolean;
  
  // Methods
  fetchSkillDetail: (id: string) => Promise<void>;
  setActiveTab: (tab: MarketplaceDetailTab) => void;
  
  // Purchase actions
  buyNow: () => Promise<void>;
  addToCart: () => void;
  
  // Checkout actions
  openCheckout: () => void;
  closeCheckout: () => void;
  confirmPurchase: () => Promise<void>;
  
  // Wallet actions
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  
  // Review actions
  submitReview: (rating: number, title: string, comment: string) => Promise<void>;
  markReviewHelpful: (reviewId: string) => Promise<void>;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get transaction step color
 */
export const getTransactionStepColor = (step: TransactionStep): string => {
  switch (step) {
    case TransactionStep.Idle:
      return '#64748B'; // slate-500
    case TransactionStep.ConnectingWallet:
    case TransactionStep.SigningTransaction:
    case TransactionStep.ProcessingTransaction:
    case TransactionStep.Confirming:
      return '#6366F1'; // indigo-500
    case TransactionStep.WalletConnected:
      return '#22D3EE'; // cyan-400
    case TransactionStep.Success:
      return '#10B981'; // emerald-500
    case TransactionStep.Failed:
      return '#EF4444'; // red-500
    default:
      return '#64748B';
  }
};

/**
 * Get transaction step icon
 */
export const getTransactionStepIcon = (step: TransactionStep): string => {
  switch (step) {
    case TransactionStep.Idle:
      return '⏸️';
    case TransactionStep.ConnectingWallet:
      return '🔗';
    case TransactionStep.WalletConnected:
      return '✅';
    case TransactionStep.SigningTransaction:
      return '✍️';
    case TransactionStep.ProcessingTransaction:
      return '⚙️';
    case TransactionStep.Confirming:
      return '⏳';
    case TransactionStep.Success:
      return '🎉';
    case TransactionStep.Failed:
      return '❌';
    default:
      return '❓';
  }
};

/**
 * Format rating percentage
 */
export const formatRatingPercentage = (count: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (count / total) * 100;
  return `${Math.round(percentage)}%`;
};

/**
 * Calculate review score percentage
 */
export const calculateReviewScorePercentage = (rating: number): number => {
  return (rating / 5) * 100;
};

/**
 * Get verification level badge color
 */
export const getVerificationLevelColor = (level: IssuerCredential['verificationLevel']): string => {
  switch (level) {
    case 'Basic':
      return '#64748B'; // slate-500
    case 'Verified':
      return '#22D3EE'; // cyan-400
    case 'Premium':
      return '#A855F7'; // purple-500
    case 'Enterprise':
      return '#F59E0B'; // amber-500
    default:
      return '#64748B';
  }
};

/**
 * Format date to relative time
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

/**
 * Format transaction hash for display
 */
export const formatTransactionHash = (hash: string, chars: number = 6): string => {
  if (!hash || hash.length < chars * 2) return hash;
  return `${hash.substring(0, chars)}...${hash.substring(hash.length - chars)}`;
};

/**
 * Format wallet address for display
 */
export const formatWalletAddress = (address: string, chars: number = 6): string => {
  if (!address || address.length < chars * 2) return address;
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};

/**
 * Check if skill is purchasable
 */
export const isSkillPurchasable = (skill: MarketplaceSkillDetail): boolean => {
  return (
    skill.status === 'Active' &&
    skill.circulatingSupply < skill.totalSupply
  );
};

/**
 * Calculate remaining supply
 */
export const getRemainingSupply = (skill: MarketplaceSkillDetail): number => {
  return skill.totalSupply - skill.circulatingSupply;
};

/**
 * Get supply percentage
 */
export const getSupplyPercentage = (skill: MarketplaceSkillDetail): number => {
  if (skill.totalSupply === 0) return 0;
  return (skill.circulatingSupply / skill.totalSupply) * 100;
};

/**
 * Check if review is recent (within 30 days)
 */
export const isRecentReview = (review: Review): boolean => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return review.createdAt >= thirtyDaysAgo;
};

/**
 * Format number with K/M suffix
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format price in FLOW
 */
export const formatFlowPrice = (price: number): string => {
  return `${price.toFixed(2)} FLOW`;
};

/**
 * Format price in USD
 */
export const formatUSDPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};
