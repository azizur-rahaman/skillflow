/**
 * Wallet Connection Feature - Type Definitions
 * 
 * Secure wallet connection screen with MetaMask and WalletConnect support.
 * Glassmorphism design with safety tips and connection animations.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Wallet provider type
 */
export enum WalletProvider {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
  Coinbase = 'Coinbase Wallet',
  TrustWallet = 'Trust Wallet',
}

/**
 * Connection step
 */
export enum ConnectionStep {
  Idle = 'Idle',
  SelectingProvider = 'SelectingProvider',
  RequestingPermission = 'RequestingPermission',
  VerifyingSignature = 'VerifyingSignature',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Failed = 'Failed',
}

/**
 * Connection status
 */
export enum ConnectionStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Error = 'Error',
  Rejected = 'Rejected',
}

/**
 * Safety tip category
 */
export enum SafetyTipCategory {
  Security = 'Security',
  Privacy = 'Privacy',
  Verification = 'Verification',
  BestPractice = 'Best Practice',
}

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Wallet provider info
 */
export interface WalletProviderInfo {
  id: string;
  name: WalletProvider;
  description: string;
  icon: string;
  downloadUrl: string;
  installed: boolean;
  recommended: boolean;
  features: string[];
}

/**
 * Connection request
 */
export interface ConnectionRequest {
  provider: WalletProvider;
  chainId?: number;
  timestamp: Date;
}

/**
 * Connection result
 */
export interface ConnectionResult {
  success: boolean;
  walletAddress?: string;
  chainId?: number;
  chainName?: string;
  provider?: WalletProvider;
  error?: ConnectionError;
  connectedAt?: Date;
}

/**
 * Connection error
 */
export interface ConnectionError {
  code: string;
  message: string;
  details?: string;
  suggestion?: string;
}

/**
 * Safety tip
 */
export interface SafetyTip {
  id: string;
  category: SafetyTipCategory;
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Connection progress
 */
export interface ConnectionProgress {
  currentStep: ConnectionStep;
  progress: number; // 0-100
  message: string;
}

/**
 * Network info
 */
export interface NetworkInfo {
  chainId: number;
  name: string;
  currency: string;
  rpcUrl: string;
  explorerUrl: string;
  icon: string;
}

/**
 * Connected wallet info
 */
export interface ConnectedWallet {
  address: string;
  provider: WalletProvider;
  network: NetworkInfo;
  balance: string;
  balanceUSD: number;
  connectedAt: Date;
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * WalletProviderButton component props
 */
export interface WalletProviderButtonProps {
  provider: WalletProviderInfo;
  onConnect: (provider: WalletProvider) => void;
  disabled?: boolean;
  selected?: boolean;
}

/**
 * SafetySidebar component props
 */
export interface SafetySidebarProps {
  currentStep: ConnectionStep;
  tips: SafetyTip[];
  compact?: boolean;
}

/**
 * ConnectionStatus component props
 */
export interface ConnectionStatusProps {
  status: ConnectionStatus;
  progress?: ConnectionProgress;
  walletAddress?: string;
  animated?: boolean;
}

/**
 * SuccessAnimation component props
 */
export interface SuccessAnimationProps {
  visible: boolean;
  walletAddress: string;
  network: string;
  onComplete?: () => void;
}

/**
 * WalletConnectionContext state
 */
export interface WalletConnectionContextState {
  // State
  connectionStatus: ConnectionStatus;
  connectionProgress: ConnectionProgress | null;
  connectedWallet: ConnectedWallet | null;
  availableProviders: WalletProviderInfo[];
  safetyTips: SafetyTip[];
  loading: boolean;
  error: ConnectionError | null;

  // Actions
  connectWallet: (provider: WalletProvider) => Promise<ConnectionResult>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  refreshBalance: () => Promise<void>;
  reset: () => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get provider detection status
 */
export const getProviderDetection = (): {
  metamask: boolean;
  walletconnect: boolean;
  coinbase: boolean;
  trustwallet: boolean;
} => {
  if (typeof window === 'undefined') {
    return { metamask: false, walletconnect: false, coinbase: false, trustwallet: false };
  }

  return {
    metamask: typeof (window as any).ethereum !== 'undefined' && (window as any).ethereum.isMetaMask,
    walletconnect: true, // Always available via QR code
    coinbase: typeof (window as any).ethereum !== 'undefined' && (window as any).ethereum.isCoinbaseWallet,
    trustwallet: typeof (window as any).ethereum !== 'undefined' && (window as any).ethereum.isTrust,
  };
};

/**
 * Get connection step progress percentage
 */
export const getConnectionStepProgress = (step: ConnectionStep): number => {
  const progressMap: Record<ConnectionStep, number> = {
    [ConnectionStep.Idle]: 0,
    [ConnectionStep.SelectingProvider]: 20,
    [ConnectionStep.RequestingPermission]: 40,
    [ConnectionStep.VerifyingSignature]: 60,
    [ConnectionStep.Connecting]: 80,
    [ConnectionStep.Connected]: 100,
    [ConnectionStep.Failed]: 0,
  };
  return progressMap[step];
};

/**
 * Get connection status color
 */
export const getConnectionStatusColor = (status: ConnectionStatus): string => {
  const colorMap: Record<ConnectionStatus, string> = {
    [ConnectionStatus.Disconnected]: '#64748B', // Slate
    [ConnectionStatus.Connecting]: '#3B82F6', // Blue
    [ConnectionStatus.Connected]: '#10B981', // Emerald
    [ConnectionStatus.Error]: '#EF4444', // Red
    [ConnectionStatus.Rejected]: '#F59E0B', // Amber
  };
  return colorMap[status];
};

/**
 * Get connection status icon
 */
export const getConnectionStatusIcon = (status: ConnectionStatus): string => {
  const iconMap: Record<ConnectionStatus, string> = {
    [ConnectionStatus.Disconnected]: '🔌',
    [ConnectionStatus.Connecting]: '⏳',
    [ConnectionStatus.Connected]: '✅',
    [ConnectionStatus.Error]: '❌',
    [ConnectionStatus.Rejected]: '⚠️',
  };
  return iconMap[status];
};

/**
 * Format wallet address
 */
export const formatWalletAddress = (address: string, chars: number = 4): string => {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Get network by chain ID
 */
export const getNetworkByChainId = (chainId: number): NetworkInfo | null => {
  const networks: Record<number, NetworkInfo> = {
    1: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      currency: 'ETH',
      rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
      explorerUrl: 'https://etherscan.io',
      icon: '⟠',
    },
    137: {
      chainId: 137,
      name: 'Polygon',
      currency: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com',
      icon: '⬡',
    },
    80001: {
      chainId: 80001,
      name: 'Polygon Mumbai',
      currency: 'MATIC',
      rpcUrl: 'https://rpc-mumbai.maticvigil.com',
      explorerUrl: 'https://mumbai.polygonscan.com',
      icon: '⬡',
    },
  };
  return networks[chainId] || null;
};

/**
 * Get safety tips
 */
export const getSafetyTips = (): SafetyTip[] => {
  return [
    {
      id: '1',
      category: SafetyTipCategory.Security,
      title: 'Verify the URL',
      description: 'Always check that you are on the official SkillFlow website before connecting your wallet.',
      icon: '🔒',
      priority: 'high',
    },
    {
      id: '2',
      category: SafetyTipCategory.Security,
      title: 'Never Share Seed Phrase',
      description: 'We will never ask for your seed phrase or private keys. Anyone asking for these is a scammer.',
      icon: '🚫',
      priority: 'high',
    },
    {
      id: '3',
      category: SafetyTipCategory.Verification,
      title: 'Check Transaction Details',
      description: 'Review all transaction details carefully before signing. Verify the recipient address and amounts.',
      icon: '👁️',
      priority: 'high',
    },
    {
      id: '4',
      category: SafetyTipCategory.Privacy,
      title: 'Your Wallet, Your Data',
      description: 'Connecting your wallet only shares your public address. We cannot access your funds or private information.',
      icon: '🔐',
      priority: 'medium',
    },
    {
      id: '5',
      category: SafetyTipCategory.BestPractice,
      title: 'Use Hardware Wallet',
      description: 'For added security, consider using a hardware wallet like Ledger or Trezor for valuable assets.',
      icon: '🔑',
      priority: 'medium',
    },
    {
      id: '6',
      category: SafetyTipCategory.BestPractice,
      title: 'Start with Testnet',
      description: 'If you\'re new to blockchain, practice on testnets (Mumbai) before using mainnet (Polygon).',
      icon: '🎓',
      priority: 'low',
    },
  ];
};

/**
 * Get available providers
 */
export const getAvailableProviders = (): WalletProviderInfo[] => {
  const detection = getProviderDetection();

  return [
    {
      id: 'metamask',
      name: WalletProvider.MetaMask,
      description: 'The most popular Web3 wallet with 30M+ users',
      icon: '🦊',
      downloadUrl: 'https://metamask.io/download/',
      installed: detection.metamask,
      recommended: true,
      features: ['Browser Extension', 'Mobile App', 'Hardware Wallet Support', 'Swap'],
    },
    {
      id: 'walletconnect',
      name: WalletProvider.WalletConnect,
      description: 'Connect any mobile wallet via QR code scanning',
      icon: '🔗',
      downloadUrl: 'https://walletconnect.com/',
      installed: true, // Always available
      recommended: true,
      features: ['200+ Wallets', 'Mobile-First', 'QR Code', 'Multi-Chain'],
    },
    {
      id: 'coinbase',
      name: WalletProvider.Coinbase,
      description: 'Coinbase\'s self-custody wallet for DeFi',
      icon: '🅒',
      downloadUrl: 'https://www.coinbase.com/wallet',
      installed: detection.coinbase,
      recommended: false,
      features: ['Browser Extension', 'Mobile App', 'NFT Gallery', 'DApp Browser'],
    },
    {
      id: 'trustwallet',
      name: WalletProvider.TrustWallet,
      description: 'Trusted by millions, mobile-first wallet',
      icon: '🛡️',
      downloadUrl: 'https://trustwallet.com/',
      installed: detection.trustwallet,
      recommended: false,
      features: ['Mobile App', 'Multi-Chain', 'Staking', 'DApp Browser'],
    },
  ];
};

/**
 * Get error message
 */
export const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    'user_rejected': 'You rejected the connection request. Please try again.',
    'chain_not_supported': 'This network is not supported. Please switch to Polygon or Ethereum.',
    'provider_not_found': 'Wallet not installed. Please install it from the official website.',
    'already_connected': 'A wallet is already connected. Disconnect first to switch wallets.',
    'network_error': 'Network error. Please check your connection and try again.',
    'timeout': 'Connection timeout. Please try again.',
  };
  return messages[code] || 'An unknown error occurred. Please try again.';
};

/**
 * Get error suggestion
 */
export const getErrorSuggestion = (code: string): string => {
  const suggestions: Record<string, string> = {
    'user_rejected': 'To connect your wallet, approve the request in your wallet app.',
    'chain_not_supported': 'Switch to Polygon network in your wallet settings.',
    'provider_not_found': 'Download and install the wallet extension from the official website.',
    'already_connected': 'Disconnect your current wallet from the wallet icon in the header.',
    'network_error': 'Check your internet connection and try again.',
    'timeout': 'Ensure your wallet is unlocked and responsive.',
  };
  return suggestions[code] || 'Contact support if the problem persists.';
};
