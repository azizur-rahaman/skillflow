/**
 * Credential Minting Feature - Type Definitions
 * 
 * Multi-step wizard for minting verified credentials with blockchain integration,
 * evidence verification, and soft futuristic animations.
 */

import {
  SkillToken,
  TokenMetadata,
  Network,
  TransactionStatus,
  CredentialCategory,
} from '@/features/wallet/types/wallet.types';

// ============================================================================
// Enums
// ============================================================================

/**
 * Minting wizard steps
 */
export enum MintingStep {
  SkillSelection = 'Skill Selection',
  EvidenceVerification = 'Evidence Verification',
  Confirmation = 'Confirmation',
  Minting = 'Minting',
  Success = 'Success',
}

/**
 * Evidence type for verification
 */
export enum EvidenceType {
  Certificate = 'Certificate',
  Project = 'Project',
  Assessment = 'Assessment',
  Portfolio = 'Portfolio',
  GitHub = 'GitHub Repository',
  Video = 'Video Demo',
  Document = 'Document',
}

/**
 * Evidence verification status
 */
export enum EvidenceStatus {
  Pending = 'Pending',
  Verifying = 'Verifying',
  Verified = 'Verified',
  Rejected = 'Rejected',
}

/**
 * Minting transaction status
 */
export enum MintingStatus {
  Idle = 'Idle',
  Preparing = 'Preparing',
  UploadingMetadata = 'Uploading Metadata',
  WaitingApproval = 'Waiting for Approval',
  Minting = 'Minting',
  Confirming = 'Confirming',
  Success = 'Success',
  Failed = 'Failed',
}

/**
 * Blockchain animation state
 */
export enum BlockchainAnimationState {
  Idle = 'Idle',
  Connecting = 'Connecting',
  Processing = 'Processing',
  Confirming = 'Confirming',
  Complete = 'Complete',
  Error = 'Error',
}

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Skill milestone eligible for credential minting
 */
export interface MintableSkill {
  id: string;
  name: string;
  category: CredentialCategory;
  level: number;
  description: string;
  imageUrl: string;
  completedAt: Date;
  milestones: SkillMilestone[];
  requiredEvidence: EvidenceRequirement[];
  estimatedValue: number;
  eligible: boolean;
  reason?: string;
}

/**
 * Skill milestone
 */
export interface SkillMilestone {
  id: string;
  title: string;
  description: string;
  completedAt: Date;
  xpEarned: number;
  verified: boolean;
}

/**
 * Evidence requirement for credential
 */
export interface EvidenceRequirement {
  type: EvidenceType;
  required: boolean;
  description: string;
  minCount?: number;
  maxCount?: number;
}

/**
 * Evidence submission
 */
export interface EvidenceSubmission {
  id: string;
  type: EvidenceType;
  title: string;
  description: string;
  url?: string;
  file?: File;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  uploadedAt: Date;
  status: EvidenceStatus;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
}

/**
 * Credential metadata for minting
 */
export interface CredentialMetadata {
  name: string;
  description: string;
  skillName: string;
  skillLevel: number;
  category: CredentialCategory;
  attributes: CredentialAttribute[];
  evidence: EvidenceSubmission[];
  issuer: string;
  validUntil?: Date;
}

/**
 * Credential attribute
 */
export interface CredentialAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

/**
 * Minting transaction
 */
export interface MintingTransaction {
  id: string;
  status: MintingStatus;
  network: Network;
  walletAddress: string;
  metadata: CredentialMetadata;
  ipfsHash?: string;
  ipfsUrl?: string;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  tokenId?: string;
  contractAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
}

/**
 * Minting confirmation summary
 */
export interface MintingConfirmation {
  skill: MintableSkill;
  metadata: CredentialMetadata;
  evidence: EvidenceSubmission[];
  network: Network;
  estimatedGas: string;
  estimatedCost: string;
  estimatedTime: string;
}

/**
 * Minting result
 */
export interface MintingResult {
  success: boolean;
  transaction: MintingTransaction;
  credential?: SkillToken;
  message: string;
}

// ============================================================================
// Context State
// ============================================================================

/**
 * Credential minting context state
 */
export interface CredentialMintingContextState {
  // Current state
  currentStep: MintingStep;
  selectedSkill: MintableSkill | null;
  evidence: EvidenceSubmission[];
  metadata: CredentialMetadata | null;
  transaction: MintingTransaction | null;
  mintingStatus: MintingStatus;
  animationState: BlockchainAnimationState;
  loading: boolean;
  error: string | null;

  // Available skills
  mintableSkills: MintableSkill[];

  // Actions
  loadMintableSkills: () => Promise<void>;
  selectSkill: (skillId: string) => void;
  addEvidence: (evidence: Omit<EvidenceSubmission, 'id' | 'uploadedAt' | 'status'>) => Promise<void>;
  removeEvidence: (evidenceId: string) => void;
  updateEvidence: (evidenceId: string, updates: Partial<EvidenceSubmission>) => void;
  verifyEvidence: (evidenceId: string) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: MintingStep) => void;
  generateMetadata: () => Promise<void>;
  mintCredential: () => Promise<MintingResult>;
  reset: () => void;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * StepperWizard component props
 */
export interface StepperWizardProps {
  currentStep: MintingStep;
  steps: MintingStep[];
  onStepClick?: (step: MintingStep) => void;
  completedSteps?: MintingStep[];
}

/**
 * SkillSelection component props
 */
export interface SkillSelectionProps {
  skills: MintableSkill[];
  selectedSkill: MintableSkill | null;
  onSelect: (skillId: string) => void;
  loading?: boolean;
}

/**
 * EvidenceVerification component props
 */
export interface EvidenceVerificationProps {
  skill: MintableSkill;
  evidence: EvidenceSubmission[];
  requirements: EvidenceRequirement[];
  onAddEvidence: (evidence: Omit<EvidenceSubmission, 'id' | 'uploadedAt' | 'status'>) => Promise<void>;
  onRemoveEvidence: (evidenceId: string) => void;
  onVerifyEvidence: (evidenceId: string) => Promise<void>;
  loading?: boolean;
}

/**
 * ConfirmationSummary component props
 */
export interface ConfirmationSummaryProps {
  confirmation: MintingConfirmation;
  onConfirm: () => void;
  onEdit: () => void;
  loading?: boolean;
}

/**
 * MintingProgress component props
 */
export interface MintingProgressProps {
  status: MintingStatus;
  animationState: BlockchainAnimationState;
  transaction: MintingTransaction | null;
  progress: number;
}

/**
 * SuccessAnimation component props
 */
export interface SuccessAnimationProps {
  credential: SkillToken;
  transaction: MintingTransaction;
  onViewCredential: () => void;
  onMintAnother: () => void;
}

/**
 * BlockchainAnimation component props
 */
export interface BlockchainAnimationProps {
  state: BlockchainAnimationState;
  message?: string;
}

/**
 * ProgressBar component props
 */
export interface ProgressBarProps {
  progress: number;
  status?: MintingStatus;
  animated?: boolean;
}

/**
 * EvidenceUpload component props
 */
export interface EvidenceUploadProps {
  type: EvidenceType;
  onUpload: (evidence: Omit<EvidenceSubmission, 'id' | 'uploadedAt' | 'status'>) => Promise<void>;
  loading?: boolean;
}

/**
 * EvidenceCard component props
 */
export interface EvidenceCardProps {
  evidence: EvidenceSubmission;
  onRemove: (id: string) => void;
  onVerify: (id: string) => Promise<void>;
  compact?: boolean;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get step index
 */
export const getStepIndex = (step: MintingStep): number => {
  const steps = Object.values(MintingStep);
  return steps.indexOf(step);
};

/**
 * Get step progress percentage
 */
export const getStepProgress = (currentStep: MintingStep): number => {
  const steps = Object.values(MintingStep);
  const currentIndex = steps.indexOf(currentStep);
  return ((currentIndex + 1) / steps.length) * 100;
};

/**
 * Check if step is completed
 */
export const isStepCompleted = (step: MintingStep, currentStep: MintingStep): boolean => {
  return getStepIndex(step) < getStepIndex(currentStep);
};

/**
 * Check if step is accessible
 */
export const isStepAccessible = (step: MintingStep, currentStep: MintingStep): boolean => {
  return getStepIndex(step) <= getStepIndex(currentStep);
};

/**
 * Validate skill eligibility
 */
export const validateSkillEligibility = (skill: MintableSkill): boolean => {
  if (!skill.eligible) return false;
  if (skill.milestones.length === 0) return false;
  if (skill.level < 50) return false;
  return true;
};

/**
 * Validate evidence requirements
 */
export const validateEvidenceRequirements = (
  evidence: EvidenceSubmission[],
  requirements: EvidenceRequirement[]
): { valid: boolean; missing: EvidenceRequirement[] } => {
  const missing: EvidenceRequirement[] = [];

  for (const requirement of requirements) {
    if (!requirement.required) continue;

    const submittedCount = evidence.filter(e => e.type === requirement.type).length;
    const minCount = requirement.minCount || 1;

    if (submittedCount < minCount) {
      missing.push(requirement);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
};

/**
 * Calculate evidence completion percentage
 */
export const calculateEvidenceCompletion = (
  evidence: EvidenceSubmission[],
  requirements: EvidenceRequirement[]
): number => {
  const requiredCount = requirements.filter(r => r.required).length;
  if (requiredCount === 0) return 100;

  const verifiedCount = evidence.filter(e => e.status === EvidenceStatus.Verified).length;
  return Math.min((verifiedCount / requiredCount) * 100, 100);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get evidence type icon
 */
export const getEvidenceTypeIcon = (type: EvidenceType): string => {
  const icons: Record<EvidenceType, string> = {
    [EvidenceType.Certificate]: '📜',
    [EvidenceType.Project]: '🚀',
    [EvidenceType.Assessment]: '✅',
    [EvidenceType.Portfolio]: '💼',
    [EvidenceType.GitHub]: '🐙',
    [EvidenceType.Video]: '🎥',
    [EvidenceType.Document]: '📄',
  };
  return icons[type];
};

/**
 * Get evidence type color
 */
export const getEvidenceTypeColor = (type: EvidenceType): string => {
  const colors: Record<EvidenceType, string> = {
    [EvidenceType.Certificate]: '#6366F1', // Indigo
    [EvidenceType.Project]: '#8B5CF6', // Purple
    [EvidenceType.Assessment]: '#10B981', // Emerald
    [EvidenceType.Portfolio]: '#F59E0B', // Amber
    [EvidenceType.GitHub]: '#6B7280', // Gray
    [EvidenceType.Video]: '#EF4444', // Red
    [EvidenceType.Document]: '#3B82F6', // Blue
  };
  return colors[type];
};

/**
 * Get minting status color
 */
export const getMintingStatusColor = (status: MintingStatus): string => {
  const colors: Record<MintingStatus, string> = {
    [MintingStatus.Idle]: '#64748B', // Slate
    [MintingStatus.Preparing]: '#3B82F6', // Blue
    [MintingStatus.UploadingMetadata]: '#8B5CF6', // Purple
    [MintingStatus.WaitingApproval]: '#F59E0B', // Amber
    [MintingStatus.Minting]: '#6366F1', // Indigo
    [MintingStatus.Confirming]: '#A855F7', // Purple
    [MintingStatus.Success]: '#10B981', // Emerald
    [MintingStatus.Failed]: '#EF4444', // Red
  };
  return colors[status];
};

/**
 * Get minting status message
 */
export const getMintingStatusMessage = (status: MintingStatus): string => {
  const messages: Record<MintingStatus, string> = {
    [MintingStatus.Idle]: 'Ready to mint',
    [MintingStatus.Preparing]: 'Preparing credential data...',
    [MintingStatus.UploadingMetadata]: 'Uploading metadata to IPFS...',
    [MintingStatus.WaitingApproval]: 'Waiting for wallet approval...',
    [MintingStatus.Minting]: 'Minting credential on blockchain...',
    [MintingStatus.Confirming]: 'Confirming transaction...',
    [MintingStatus.Success]: 'Credential minted successfully!',
    [MintingStatus.Failed]: 'Minting failed. Please try again.',
  };
  return messages[status];
};

/**
 * Estimate minting cost
 */
export const estimateMintingCost = (network: Network): string => {
  const costs: Record<Network, string> = {
    [Network.Polygon]: '$0.01 - $0.05',
    [Network.PolygonMumbai]: 'Free (Testnet)',
    [Network.Ethereum]: '$5 - $20',
    [Network.EthereumGoerli]: 'Free (Testnet)',
  };
  return costs[network];
};

/**
 * Estimate minting time
 */
export const estimateMintingTime = (network: Network): string => {
  const times: Record<Network, string> = {
    [Network.Polygon]: '2-5 minutes',
    [Network.PolygonMumbai]: '2-5 minutes',
    [Network.Ethereum]: '1-3 minutes',
    [Network.EthereumGoerli]: '1-3 minutes',
  };
  return times[network];
};

/**
 * Generate credential name
 */
export const generateCredentialName = (skillName: string, level: number): string => {
  if (level >= 90) return `${skillName} Master`;
  if (level >= 75) return `${skillName} Expert`;
  if (level >= 60) return `${skillName} Advanced`;
  if (level >= 40) return `${skillName} Intermediate`;
  return `${skillName} Beginner`;
};

/**
 * Generate credential description
 */
export const generateCredentialDescription = (skill: MintableSkill): string => {
  return `Verified credential demonstrating ${skill.level}% mastery of ${skill.name}. Earned through completing ${skill.milestones.length} verified milestones and providing comprehensive evidence of skill proficiency.`;
};

/**
 * Generate metadata attributes
 */
export const generateMetadataAttributes = (skill: MintableSkill): CredentialAttribute[] => {
  return [
    { trait_type: 'Skill', value: skill.name },
    { trait_type: 'Level', value: skill.level, display_type: 'number' },
    { trait_type: 'Category', value: skill.category },
    { trait_type: 'Milestones Completed', value: skill.milestones.length, display_type: 'number' },
    { trait_type: 'Total XP Earned', value: skill.milestones.reduce((sum, m) => sum + m.xpEarned, 0), display_type: 'number' },
    { trait_type: 'Completion Date', value: skill.completedAt.toISOString().split('T')[0], display_type: 'date' },
  ];
};
