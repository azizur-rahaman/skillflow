/**
 * Transaction History Feature - Type Definitions
 * 
 * Dark data-table UI for tracking blockchain and in-app transactions.
 * Web3 token tracking with filter capabilities and export functionality.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Transaction type
 */
export enum TransactionType {
  Mint = 'Mint',
  Transfer = 'Transfer',
  Burn = 'Burn',
  Verification = 'Verification',
  Stake = 'Stake',
  Unstake = 'Unstake',
  Reward = 'Reward',
  Purchase = 'Purchase',
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
}

/**
 * Token type
 */
export enum TokenType {
  SkillCredential = 'Skill Credential',
  NFT = 'NFT',
  Token = 'Token',
  Governance = 'Governance',
}

/**
 * Filter period
 */
export enum FilterPeriod {
  AllTime = 'All Time',
  Today = 'Today',
  Week = 'This Week',
  Month = 'This Month',
  Quarter = 'This Quarter',
  Year = 'This Year',
  Custom = 'Custom',
}

/**
 * Export format
 */
export enum ExportFormat {
  CSV = 'CSV',
  JSON = 'JSON',
  Excel = 'Excel',
}

/**
 * Sort direction
 */
export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Token info
 */
export interface TokenInfo {
  id: string;
  name: string;
  symbol: string;
  type: TokenType;
  icon: string;
  contractAddress: string;
  decimals: number;
  chainId: number;
}

/**
 * Transaction record
 */
export interface Transaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: Date;
  type: TransactionType;
  status: TransactionStatus;
  from: string;
  to: string;
  token: TokenInfo;
  amount: string;
  amountUSD: number;
  gasUsed: string;
  gasFee: string;
  gasFeeUSD: number;
  network: string;
  explorerUrl: string;
  metadata?: TransactionMetadata;
}

/**
 * Transaction metadata
 */
export interface TransactionMetadata {
  credentialId?: string;
  credentialName?: string;
  skillName?: string;
  skillLevel?: number;
  message?: string;
  [key: string]: any;
}

/**
 * Transaction filter
 */
export interface TransactionFilter {
  period: FilterPeriod;
  startDate?: Date;
  endDate?: Date;
  types: TransactionType[];
  statuses: TransactionStatus[];
  tokens: string[];
  networks: string[];
  searchQuery?: string;
}

/**
 * Transaction summary
 */
export interface TransactionSummary {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalVolume: number;
  totalVolumeUSD: number;
  totalGasFees: number;
  totalGasFeesUSD: number;
  byType: Record<TransactionType, number>;
  byStatus: Record<TransactionStatus, number>;
  byToken: Record<string, number>;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Sort config
 */
export interface SortConfig {
  field: keyof Transaction;
  direction: SortDirection;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat;
  includeMetadata: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  columns?: (keyof Transaction)[];
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * TransactionTable component props
 */
export interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  sortConfig?: SortConfig;
  onSort?: (config: SortConfig) => void;
  onRowClick?: (transaction: Transaction) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

/**
 * FilterBar component props
 */
export interface FilterBarProps {
  filter: TransactionFilter;
  onChange: (filter: TransactionFilter) => void;
  availableTokens: TokenInfo[];
  availableNetworks: string[];
  onReset: () => void;
}

/**
 * HashCopy component props
 */
export interface HashCopyProps {
  hash: string;
  explorerUrl: string;
  compact?: boolean;
}

/**
 * ExportButton component props
 */
export interface ExportButtonProps {
  transactions: Transaction[];
  onExport?: (options: ExportOptions) => void | Promise<void>;
  disabled?: boolean;
}

/**
 * TransactionRow component props
 */
export interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
}

/**
 * StatusBadge component props
 */
export interface StatusBadgeProps {
  status: TransactionStatus;
  compact?: boolean;
}

/**
 * TokenIcon component props
 */
export interface TokenIconProps {
  token: TokenInfo;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Pagination component props
 */
export interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// ============================================================================
// Context State
// ============================================================================

/**
 * TransactionHistoryContext state
 */
export interface TransactionHistoryContextState {
  // Data
  transactions: Transaction[];
  summary: TransactionSummary | null;
  pagination: PaginationInfo;
  
  // Filters & Sort
  filter: TransactionFilter;
  sortConfig: SortConfig;
  
  // UI State
  loading: boolean;
  error: string | null;
  selectedIds: string[];
  
  // Available options
  availableTokens: TokenInfo[];
  availableNetworks: string[];
  
  // Methods
  fetchTransactions: (page?: number) => Promise<void>;
  updateFilter: (filter: Partial<TransactionFilter>) => void;
  updateSort: (config: SortConfig) => void;
  resetFilter: () => void;
  selectTransaction: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  exportTransactions: (options: ExportOptions) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get transaction status color
 */
export const getTransactionStatusColor = (status: TransactionStatus): string => {
  const colors: Record<TransactionStatus, string> = {
    [TransactionStatus.Pending]: '#F59E0B', // Amber
    [TransactionStatus.Confirmed]: '#10B981', // Emerald
    [TransactionStatus.Failed]: '#EF4444', // Red
    [TransactionStatus.Cancelled]: '#6B7280', // Gray
  };
  return colors[status];
};

/**
 * Get transaction status icon
 */
export const getTransactionStatusIcon = (status: TransactionStatus): string => {
  const icons: Record<TransactionStatus, string> = {
    [TransactionStatus.Pending]: '⏳',
    [TransactionStatus.Confirmed]: '✓',
    [TransactionStatus.Failed]: '✕',
    [TransactionStatus.Cancelled]: '○',
  };
  return icons[status];
};

/**
 * Get transaction type color
 */
export const getTransactionTypeColor = (type: TransactionType): string => {
  const colors: Record<TransactionType, string> = {
    [TransactionType.Mint]: '#10B981', // Emerald
    [TransactionType.Transfer]: '#3B82F6', // Blue
    [TransactionType.Burn]: '#EF4444', // Red
    [TransactionType.Verification]: '#A855F7', // Purple
    [TransactionType.Stake]: '#22D3EE', // Cyan
    [TransactionType.Unstake]: '#F59E0B', // Amber
    [TransactionType.Reward]: '#10B981', // Emerald
    [TransactionType.Purchase]: '#6366F1', // Indigo
  };
  return colors[type];
};

/**
 * Get transaction type icon
 */
export const getTransactionTypeIcon = (type: TransactionType): string => {
  const icons: Record<TransactionType, string> = {
    [TransactionType.Mint]: '🎨',
    [TransactionType.Transfer]: '↔',
    [TransactionType.Burn]: '🔥',
    [TransactionType.Verification]: '✓',
    [TransactionType.Stake]: '🔒',
    [TransactionType.Unstake]: '🔓',
    [TransactionType.Reward]: '🎁',
    [TransactionType.Purchase]: '💳',
  };
  return icons[type];
};

/**
 * Format transaction hash
 */
export const formatTransactionHash = (hash: string, chars: number = 6): string => {
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
};

/**
 * Format wallet address
 */
export const formatWalletAddress = (address: string, chars: number = 4): string => {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Format token amount with appropriate decimals and notation
 */
export function formatTokenAmount(amount: string | number, decimals: number = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (num === 0) return '0';
  if (num < 0.01) return '<0.01';
  if (num >= 1000000) return `${(num / 1000000).toFixed(decimals)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(decimals)}K`;
  return num.toFixed(decimals);
}

/**
 * Format USD amount
 */
export const formatUSDAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date
 */
export const formatTransactionDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Format timestamp
 */
export const formatTimestamp = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get default filter
 */
export const getDefaultFilter = (): TransactionFilter => ({
  period: FilterPeriod.AllTime,
  types: [],
  statuses: [],
  tokens: [],
  networks: [],
});

/**
 * Get default sort config
 */
export const getDefaultSortConfig = (): SortConfig => ({
  field: 'timestamp',
  direction: SortDirection.Desc,
});

/**
 * Apply filter to transactions
 */
export const applyFilter = (
  transactions: Transaction[],
  filter: TransactionFilter
): Transaction[] => {
  let filtered = [...transactions];
  
  // Period filter
  if (filter.period !== FilterPeriod.AllTime) {
    const now = new Date();
    let startDate: Date;
    
    switch (filter.period) {
      case FilterPeriod.Today:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case FilterPeriod.Week:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case FilterPeriod.Month:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case FilterPeriod.Quarter:
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case FilterPeriod.Year:
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case FilterPeriod.Custom:
        startDate = filter.startDate || new Date(0);
        break;
      default:
        startDate = new Date(0);
    }
    
    const endDate = filter.endDate || now;
    filtered = filtered.filter(t => t.timestamp >= startDate && t.timestamp <= endDate);
  }
  
  // Type filter
  if (filter.types.length > 0) {
    filtered = filtered.filter(t => filter.types.includes(t.type));
  }
  
  // Status filter
  if (filter.statuses.length > 0) {
    filtered = filtered.filter(t => filter.statuses.includes(t.status));
  }
  
  // Token filter
  if (filter.tokens.length > 0) {
    filtered = filtered.filter(t => filter.tokens.includes(t.token.id));
  }
  
  // Network filter
  if (filter.networks.length > 0) {
    filtered = filtered.filter(t => filter.networks.includes(t.network));
  }
  
  // Search query
  if (filter.searchQuery && filter.searchQuery.trim()) {
    const query = filter.searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.hash.toLowerCase().includes(query) ||
      t.token.name.toLowerCase().includes(query) ||
      t.token.symbol.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query)
    );
  }
  
  return filtered;
};

/**
 * Apply sort to transactions
 */
export const applySort = (
  transactions: Transaction[],
  config: SortConfig
): Transaction[] => {
  const sorted = [...transactions];
  
  sorted.sort((a, b) => {
    const aValue = a[config.field];
    const bValue = b[config.field];
    
    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue === bValue) return 0;
    
    let comparison = 0;
    if (aValue < bValue) comparison = -1;
    if (aValue > bValue) comparison = 1;
    
    return config.direction === SortDirection.Asc ? comparison : -comparison;
  });
  
  return sorted;
};

/**
 * Calculate transaction summary
 */
export const calculateSummary = (transactions: Transaction[]): TransactionSummary => {
  const summary: TransactionSummary = {
    totalTransactions: transactions.length,
    successfulTransactions: 0,
    failedTransactions: 0,
    pendingTransactions: 0,
    totalVolume: 0,
    totalVolumeUSD: 0,
    totalGasFees: 0,
    totalGasFeesUSD: 0,
    byType: {} as Record<TransactionType, number>,
    byStatus: {} as Record<TransactionStatus, number>,
    byToken: {},
  };
  
  transactions.forEach(tx => {
    // Status counts
    summary.byStatus[tx.status] = (summary.byStatus[tx.status] || 0) + 1;
    
    if (tx.status === TransactionStatus.Confirmed) {
      summary.successfulTransactions++;
    } else if (tx.status === TransactionStatus.Failed) {
      summary.failedTransactions++;
    } else if (tx.status === TransactionStatus.Pending) {
      summary.pendingTransactions++;
    }
    
    // Type counts
    summary.byType[tx.type] = (summary.byType[tx.type] || 0) + 1;
    
    // Token counts
    summary.byToken[tx.token.symbol] = (summary.byToken[tx.token.symbol] || 0) + 1;
    
    // Volume
    summary.totalVolumeUSD += tx.amountUSD;
    
    // Gas fees
    summary.totalGasFeesUSD += tx.gasFeeUSD;
  });
  
  return summary;
};

/**
 * Export transactions to CSV
 */
export const exportToCSV = (transactions: Transaction[]): string => {
  const headers = [
    'Date',
    'Hash',
    'Type',
    'Status',
    'Token',
    'Amount',
    'USD Value',
    'From',
    'To',
    'Gas Fee',
    'Network',
  ];
  
  const rows = transactions.map(tx => [
    formatTimestamp(tx.timestamp),
    tx.hash,
    tx.type,
    tx.status,
    `${tx.token.name} (${tx.token.symbol})`,
    tx.amount,
    formatUSDAmount(tx.amountUSD),
    tx.from,
    tx.to,
    `${tx.gasFee} (${formatUSDAmount(tx.gasFeeUSD)})`,
    tx.network,
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
};

/**
 * Export transactions to JSON
 */
export const exportToJSON = (transactions: Transaction[]): string => {
  return JSON.stringify(transactions, null, 2);
};

/**
 * Download file
 */
export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
