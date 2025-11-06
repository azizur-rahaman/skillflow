'use client';

/**
 * Transaction Table Component
 * 
 * Dark data-table UI with rounded rows, token icons, and sortable columns.
 */

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  TransactionTableProps,
  SortDirection,
  formatTransactionDate,
  formatTokenAmount,
  formatUSDAmount,
  formatWalletAddress,
  getTransactionTypeColor,
  getTransactionTypeIcon,
} from '../../types/transaction-history.types';

// Import child components
import { HashCopy } from './HashCopy';
import { StatusBadge } from './StatusBadge';
import { TokenIcon } from './TokenIcon';

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  sortConfig,
  onSort,
  onRowClick,
  selectedIds = [],
  onSelectionChange,
}) => {
  /**
   * Handle column sort
   */
  const handleSort = (field: string) => {
    if (onSort && sortConfig) {
      const direction =
        sortConfig.field === field && sortConfig.direction === SortDirection.Asc
          ? SortDirection.Desc
          : SortDirection.Asc;
      onSort({ field: field as any, direction });
    }
  };

  /**
   * Render sort icon
   */
  const renderSortIcon = (field: string) => {
    if (!sortConfig || sortConfig.field !== field) return null;
    return sortConfig.direction === SortDirection.Asc ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  /**
   * Handle row selection
   */
  const handleRowSelect = (id: string) => {
    if (onSelectionChange) {
      const newSelected = selectedIds.includes(id)
        ? selectedIds.filter(i => i !== id)
        : [...selectedIds, id];
      onSelectionChange(newSelected);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
        <div className="animate-pulse">
          {/* Table header skeleton */}
          <div className="px-6 py-4 border-b border-slate-800/50">
            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
          </div>
          {/* Table rows skeleton */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 border-b border-slate-800/50">
              <div className="flex gap-4">
                <div className="h-4 bg-slate-800 rounded w-1/6"></div>
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/6"></div>
                <div className="h-4 bg-slate-800 rounded w-1/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-800/50">
          <span className="text-3xl">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Transactions Found</h3>
        <p className="text-sm text-slate-400">
          No transactions match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50">
              {onSelectionChange && (
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === transactions.length && transactions.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectionChange(transactions.map(t => t.id));
                      } else {
                        onSelectionChange([]);
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </th>
              )}
              <th
                className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-2">
                  Date {renderSortIcon('timestamp')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Hash
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-2">
                  Type {renderSortIcon('type')}
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status {renderSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Token
              </th>
              <th
                className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('amountUSD')}
              >
                <div className="flex items-center justify-end gap-2">
                  Amount {renderSortIcon('amountUSD')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                To
              </th>
              <th
                className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('gasFeeUSD')}
              >
                <div className="flex items-center justify-end gap-2">
                  Gas Fee {renderSortIcon('gasFeeUSD')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Network
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => {
              const isSelected = selectedIds.includes(transaction.id);
              const typeColor = getTransactionTypeColor(transaction.type);
              const typeIcon = getTransactionTypeIcon(transaction.type);

              return (
                <tr
                  key={transaction.id}
                  className={`
                    border-b border-slate-800/30 last:border-0
                    hover:bg-slate-800/30 transition-all duration-200
                    cursor-pointer
                    ${isSelected ? 'bg-indigo-500/10' : ''}
                    ${index % 2 === 0 ? 'bg-slate-800/10' : ''}
                  `}
                  onClick={() => onRowClick?.(transaction)}
                >
                  {onSelectionChange && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(transaction.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white font-medium">
                      {formatTransactionDate(transaction.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <HashCopy
                      hash={transaction.hash}
                      explorerUrl={transaction.explorerUrl}
                      compact={true}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeIcon}</span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: typeColor }}
                      >
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={transaction.status} compact={false} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <TokenIcon token={transaction.token} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {transaction.token.symbol}
                        </div>
                        <div className="text-xs text-slate-400">
                          {transaction.token.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-white">
                      {formatTokenAmount(transaction.amount)} {transaction.token.symbol}
                    </div>
                    {transaction.amountUSD > 0 && (
                      <div className="text-xs text-slate-400">
                        {formatUSDAmount(transaction.amountUSD)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs text-slate-300 font-mono">
                      {formatWalletAddress(transaction.from)}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs text-slate-300 font-mono">
                      {formatWalletAddress(transaction.to)}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-white">
                      {formatTokenAmount(transaction.gasFee)} MATIC
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatUSDAmount(transaction.gasFeeUSD)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                      {transaction.network}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
