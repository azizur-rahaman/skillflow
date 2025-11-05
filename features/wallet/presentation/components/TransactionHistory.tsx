'use client';

/**
 * TransactionHistory Component
 * 
 * Displays transaction history with mint/transfer events, timestamps,
 * blockchain explorer links. Clean Web3 design.
 */

import React, { useState } from 'react';
import { Sparkles, Send, Download, Flame, Activity, ExternalLink, Clock, ChevronDown } from 'lucide-react';
import {
  TransactionHistoryProps,
  Transaction,
  TransactionType,
  TransactionStatus,
  getTransactionTypeColor,
  getTransactionTypeIcon,
  getTransactionStatusColor,
  formatWalletAddress,
  formatGasFee,
  formatTimestamp,
  getNetworkIcon,
} from '../../types/wallet.types';

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  loading = false,
  filters,
  onFilterChange,
  onTransactionClick,
}) => {
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<TransactionStatus | 'all'>('all');
  const [showCount, setShowCount] = useState(10);

  // Filter transactions
  const filteredTransactions = transactions
    .filter(tx => {
      if (selectedType !== 'all' && tx.type !== selectedType) return false;
      if (selectedStatus !== 'all' && tx.status !== selectedStatus) return false;
      return true;
    })
    .slice(0, showCount);

  // Get icon component
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Sparkles,
      Send,
      Download,
      Flame,
      Activity,
    };
    return icons[iconName] || Activity;
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Transaction History</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            {Object.values(TransactionType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            {Object.values(TransactionStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-700">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-700 rounded w-1/3" />
                    <div className="h-3 bg-slate-700 rounded w-1/4" />
                  </div>
                  <div className="h-4 bg-slate-700 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">No transactions found</h4>
            <p className="text-sm text-muted-foreground">
              {selectedType !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Your transaction history will appear here'}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-700">
              {filteredTransactions.map(tx => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  onClick={() => onTransactionClick?.(tx)}
                />
              ))}
            </div>

            {/* Load more button */}
            {filteredTransactions.length < transactions.length && (
              <div className="p-4 border-t border-slate-700">
                <button
                  onClick={() => setShowCount(prev => prev + 10)}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-primary rounded-xl text-sm font-medium text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Load More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Individual Transaction Item
 */
interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  const typeColor = getTransactionTypeColor(transaction.type);
  const statusColor = getTransactionStatusColor(transaction.status);
  const iconName = getTransactionTypeIcon(transaction.type);
  
  const IconComponent = {
    Sparkles,
    Send,
    Download,
    Flame,
    Activity,
  }[iconName] || Activity;

  return (
    <div
      onClick={onClick}
      className="group p-4 hover:bg-slate-800/50 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {/* Type icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{
            backgroundColor: `${typeColor}22`,
            border: `1px solid ${typeColor}44`,
          }}
        >
          <IconComponent className="w-5 h-5" style={{ color: typeColor }} />
        </div>

        {/* Transaction details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="min-w-0">
              {/* Type and token name */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white">
                  {transaction.type}
                </span>
                {transaction.tokenName && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground line-clamp-1">
                      {transaction.tokenName}
                    </span>
                  </>
                )}
              </div>

              {/* Addresses */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <span>{formatWalletAddress(transaction.from)}</span>
                <Send className="w-3 h-3" />
                <span>{formatWalletAddress(transaction.to)}</span>
              </div>
            </div>

            {/* Amount */}
            {transaction.amount > 0 && (
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-semibold text-white">
                  x{transaction.amount}
                </div>
              </div>
            )}
          </div>

          {/* Bottom row: Status, time, gas, explorer link */}
          <div className="flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              {/* Status */}
              <div className="flex items-center gap-1.5">
                {transaction.status === TransactionStatus.Pending ? (
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: statusColor }}
                  />
                ) : transaction.status === TransactionStatus.Confirmed ? (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColor }}
                  />
                ) : (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColor }}
                  />
                )}
                <span style={{ color: statusColor }}>{transaction.status}</span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{formatTimestamp(transaction.timestamp)}</span>
              </div>

              {/* Gas fee */}
              {transaction.gasUsed !== '0' && (
                <div className="text-muted-foreground">
                  Gas: {formatGasFee(transaction.gasFee)} MATIC
                </div>
              )}

              {/* Network */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">{getNetworkIcon(transaction.network)}</span>
                <span>{transaction.network}</span>
              </div>
            </div>

            {/* Explorer link */}
            <a
              href={transaction.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            >
              <span className="hidden sm:inline">View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Metadata notes */}
          {transaction.metadata?.notes && (
            <div className="mt-2 text-xs text-muted-foreground italic">
              {transaction.metadata.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
