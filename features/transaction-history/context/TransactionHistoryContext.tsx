'use client';

/**
 * Transaction History Context
 * 
 * State management for transaction history with filtering, sorting, and export.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  TransactionHistoryContextState,
  Transaction,
  TransactionFilter,
  TransactionSummary,
  SortConfig,
  PaginationInfo,
  TokenInfo,
  ExportOptions,
  ExportFormat,
  TransactionType,
  TransactionStatus,
  TokenType,
  getDefaultFilter,
  getDefaultSortConfig,
  applyFilter,
  applySort,
  calculateSummary,
  exportToCSV,
  exportToJSON,
  downloadFile,
} from '../types/transaction-history.types';
import { Network } from '@/features/wallet/types/wallet.types';

// Create context
const TransactionHistoryContext = createContext<TransactionHistoryContextState | undefined>(undefined);

/**
 * Transaction History Provider
 */
export const TransactionHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTransactions] = useState<Transaction[]>(getMockTransactions());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [filter, setFilter] = useState<TransactionFilter>(getDefaultFilter());
  const [sortConfig, setSortConfig] = useState<SortConfig>(getDefaultSortConfig());
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 20,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [availableTokens] = useState<TokenInfo[]>(getMockTokens());
  const [availableNetworks] = useState<string[]>([Network.Polygon, Network.Ethereum, 'BSC', 'Goerli']);

  /**
   * Fetch transactions with filters and pagination
   */
  const fetchTransactions = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Apply filters
      let filtered = applyFilter(allTransactions, filter);

      // Apply sorting
      filtered = applySort(filtered, sortConfig);

      // Calculate pagination
      const totalItems = filtered.length;
      const totalPages = Math.ceil(totalItems / pagination.pageSize);
      const startIndex = (page - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      const paginatedData = filtered.slice(startIndex, endIndex);

      setTransactions(paginatedData);
      setSummary(calculateSummary(filtered));
      setPagination({
        currentPage: page,
        pageSize: pagination.pageSize,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      });
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [allTransactions, filter, sortConfig, pagination.pageSize]);

  /**
   * Update filter
   */
  const updateFilter = useCallback((newFilter: Partial<TransactionFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  /**
   * Update sort
   */
  const updateSort = useCallback((config: SortConfig) => {
    setSortConfig(config);
  }, []);

  /**
   * Reset filter
   */
  const resetFilter = useCallback(() => {
    setFilter(getDefaultFilter());
  }, []);

  /**
   * Select transaction
   */
  const selectTransaction = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  /**
   * Select all
   */
  const selectAll = useCallback(() => {
    setSelectedIds(transactions.map(t => t.id));
  }, [transactions]);

  /**
   * Deselect all
   */
  const deselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  /**
   * Export transactions
   */
  const exportTransactions = useCallback(async (options: ExportOptions) => {
    try {
      setLoading(true);

      // Get transactions to export (either filtered or all)
      let filtered = applyFilter(allTransactions, filter);
      filtered = applySort(filtered, sortConfig);

      // Apply date range if specified
      if (options.dateRange) {
        filtered = filtered.filter(t =>
          t.timestamp >= options.dateRange!.start &&
          t.timestamp <= options.dateRange!.end
        );
      }

      // Generate export content
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (options.format) {
        case ExportFormat.CSV:
          content = exportToCSV(filtered);
          filename = `transactions_${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case ExportFormat.JSON:
          content = exportToJSON(filtered);
          filename = `transactions_${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case ExportFormat.Excel:
          // For Excel, we'll export as CSV (can be opened in Excel)
          content = exportToCSV(filtered);
          filename = `transactions_${Date.now()}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Download file
      downloadFile(content, filename, mimeType);
    } catch (err) {
      setError('Failed to export transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [allTransactions, filter, sortConfig]);

  /**
   * Refresh transactions
   */
  const refreshTransactions = useCallback(async () => {
    await fetchTransactions(pagination.currentPage);
  }, [fetchTransactions, pagination.currentPage]);

  // Initial fetch and refetch on filter/sort change
  useEffect(() => {
    fetchTransactions(1);
  }, [filter, sortConfig]);

  const value: TransactionHistoryContextState = {
    transactions,
    summary,
    pagination,
    filter,
    sortConfig,
    loading,
    error,
    selectedIds,
    availableTokens,
    availableNetworks,
    fetchTransactions,
    updateFilter,
    updateSort,
    resetFilter,
    selectTransaction,
    selectAll,
    deselectAll,
    exportTransactions,
    refreshTransactions,
  };

  return (
    <TransactionHistoryContext.Provider value={value}>
      {children}
    </TransactionHistoryContext.Provider>
  );
};

/**
 * Hook to use transaction history context
 */
export const useTransactionHistory = (): TransactionHistoryContextState => {
  const context = useContext(TransactionHistoryContext);
  if (!context) {
    throw new Error('useTransactionHistory must be used within a TransactionHistoryProvider');
  }
  return context;
};

// ============================================================================
// Mock Data
// ============================================================================

/**
 * Get mock tokens
 */
function getMockTokens(): TokenInfo[] {
  return [
    {
      id: 'skill-cred',
      name: 'Skill Credential',
      symbol: 'SKILL',
      type: TokenType.SkillCredential,
      icon: '/tokens/skill-cred.png',
      contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
      decimals: 0,
      chainId: 137,
    },
    {
      id: 'nft',
      name: 'Achievement NFT',
      symbol: 'ANFT',
      type: TokenType.NFT,
      icon: '/tokens/achievement-nft.png',
      contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      decimals: 0,
      chainId: 137,
    },
    {
      id: 'flow',
      name: 'SkillFlow Token',
      symbol: 'FLOW',
      type: TokenType.Token,
      icon: '/tokens/flow.png',
      contractAddress: '0x9876543210fedcba9876543210fedcba98765432',
      decimals: 18,
      chainId: 137,
    },
  ];
}

/**
 * Get mock transactions
 */
function getMockTransactions(): Transaction[] {
  const tokens = getMockTokens();
  const now = new Date();

  return [
    {
      id: '1',
      hash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc890def123',
      blockNumber: 45123456,
      timestamp: new Date(now.getTime() - 2 * 60 * 1000), // 2 minutes ago
      type: TransactionType.Mint,
      status: TransactionStatus.Confirmed,
      from: '0x0000000000000000000000000000000000000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      token: tokens[0],
      amount: '1',
      amountUSD: 0,
      gasUsed: '125000',
      gasFee: '0.0025',
      gasFeeUSD: 3.75,
      network: Network.Polygon,
      explorerUrl: 'https://polygonscan.com/tx/0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567abc890def123',
      metadata: {
        credentialName: 'React.js Expert',
        skillName: 'React.js',
        skillLevel: 92,
      },
    },
    {
      id: '2',
      hash: '0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abc123def',
      blockNumber: 45123450,
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
      type: TransactionType.Transfer,
      status: TransactionStatus.Confirmed,
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0x9876543210fedcba9876543210fedcba98765432',
      token: tokens[2],
      amount: '150',
      amountUSD: 225.50,
      gasUsed: '80000',
      gasFee: '0.0016',
      gasFeeUSD: 2.40,
      network: Network.Polygon,
      explorerUrl: 'https://polygonscan.com/tx/0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abc123def',
    },
    {
      id: '3',
      hash: '0xdef789abc123ghi456jkl012mno345pqr678stu901vwx234yz567abc890def123',
      blockNumber: 45123440,
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      type: TransactionType.Stake,
      status: TransactionStatus.Confirmed,
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0x1234567890abcdef1234567890abcdef12345678',
      token: tokens[2],
      amount: '500',
      amountUSD: 750.00,
      gasUsed: '150000',
      gasFee: '0.003',
      gasFeeUSD: 4.50,
      network: Network.Polygon,
      explorerUrl: 'https://polygonscan.com/tx/0xdef789abc123ghi456jkl012mno345pqr678stu901vwx234yz567abc890def123',
    },
    {
      id: '4',
      hash: '0x456def123abc789ghi012jkl345mno678pqr901stu234vwx567yz890abc123def',
      blockNumber: 45123430,
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      type: TransactionType.Verification,
      status: TransactionStatus.Pending,
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0xabcdef1234567890abcdef1234567890abcdef12',
      token: tokens[0],
      amount: '1',
      amountUSD: 0,
      gasUsed: '100000',
      gasFee: '0.002',
      gasFeeUSD: 3.00,
      network: Network.Polygon,
      explorerUrl: 'https://polygonscan.com/tx/0x456def123abc789ghi012jkl345mno678pqr901stu234vwx567yz890abc123def',
      metadata: {
        credentialName: 'TypeScript Advanced',
        skillName: 'TypeScript',
        skillLevel: 88,
      },
    },
    {
      id: '5',
      hash: '0x789ghi456abc123def012jkl345mno678pqr901stu234vwx567yz890abc123def',
      blockNumber: 45123420,
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      type: TransactionType.Reward,
      status: TransactionStatus.Confirmed,
      from: '0x1234567890abcdef1234567890abcdef12345678',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      token: tokens[2],
      amount: '25',
      amountUSD: 37.50,
      gasUsed: '65000',
      gasFee: '0.0013',
      gasFeeUSD: 1.95,
      network: Network.Polygon,
      explorerUrl: 'https://polygonscan.com/tx/0x789ghi456abc123def012jkl345mno678pqr901stu234vwx567yz890abc123def',
    },
    {
      id: '6',
      hash: '0x012jkl789abc456def123ghi345mno678pqr901stu234vwx567yz890abc123def',
      blockNumber: 45123410,
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      type: TransactionType.Purchase,
      status: TransactionStatus.Failed,
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0x9876543210fedcba9876543210fedcba98765432',
      token: tokens[2],
      amount: '0',
      amountUSD: 0,
      gasUsed: '0',
      gasFee: '0',
      gasFeeUSD: 0,
      network: Network.Polygon,
      explorerUrl: 'https://polygonscan.com/tx/0x012jkl789abc456def123ghi345mno678pqr901stu234vwx567yz890abc123def',
    },
    {
      id: '7',
      hash: '0x345mno012jkl789abc456def123ghi678pqr901stu234vwx567yz890abc123def',
      blockNumber: 45123400,
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      type: TransactionType.Mint,
      status: TransactionStatus.Confirmed,
      from: '0x0000000000000000000000000000000000000000',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      token: tokens[1],
      amount: '1',
      amountUSD: 0,
      gasUsed: '130000',
      gasFee: '0.0026',
      gasFeeUSD: 3.90,
      network: Network.Polygon,
      explorerUrl: 'https://polygonscan.com/tx/0x345mno012jkl789abc456def123ghi678pqr901stu234vwx567yz890abc123def',
      metadata: {
        credentialName: 'Achievement Badge',
      },
    },
  ];
}
