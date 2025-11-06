'use client';

/**
 * Transaction History Page
 * 
 * Main dashboard for tracking blockchain and in-app transactions.
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { TransactionHistoryProvider, useTransactionHistory } from '@/features/transaction-history/context/TransactionHistoryContext';
import {
  TransactionTable,
  FilterBar,
  ExportButton,
  Pagination,
} from '@/features/transaction-history/presentation/components';
import {
  TransactionStatus,
  formatUSDAmount,
} from '@/features/transaction-history/types/transaction-history.types';

/**
 * Transaction History Content
 */
const TransactionHistoryContent: React.FC = () => {
  const {
    transactions,
    summary,
    pagination,
    filter,
    sortConfig,
    loading,
    error,
    availableTokens,
    availableNetworks,
    fetchTransactions,
    updateFilter,
    updateSort,
    resetFilter,
    exportTransactions,
  } = useTransactionHistory();

  return (
    <div className="min-h-screen bg-[#0F172A] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
            <p className="text-slate-400">
              Track and analyze your blockchain transactions
            </p>
          </div>
          <ExportButton
            transactions={transactions}
            onExport={exportTransactions}
            disabled={loading}
          />
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Transactions */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/50">
                  <ArrowUpRight className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase">All Time</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{summary.totalTransactions}</div>
                <div className="text-sm text-slate-400">Total Transactions</div>
              </div>
            </div>

            {/* Successful */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs font-medium text-emerald-400">
                  {summary.totalTransactions > 0
                    ? Math.round((summary.successfulTransactions / summary.totalTransactions) * 100)
                    : 0}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{summary.successfulTransactions}</div>
                <div className="text-sm text-slate-400">Successful</div>
              </div>
            </div>

            {/* Failed */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-xs font-medium text-red-400">
                  {summary.totalTransactions > 0
                    ? Math.round((summary.failedTransactions / summary.totalTransactions) * 100)
                    : 0}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{summary.failedTransactions}</div>
                <div className="text-sm text-slate-400">Failed</div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/50">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase">Processing</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-white">{summary.pendingTransactions}</div>
                <div className="text-sm text-slate-400">Pending</div>
              </div>
            </div>
          </div>
        )}

        {/* Volume & Gas Stats */}
        {summary && summary.totalVolumeUSD > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total Volume */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <ArrowDownRight className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-medium text-slate-400">Total Volume</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {formatUSDAmount(summary.totalVolumeUSD)}
              </div>
            </div>

            {/* Total Gas Fees */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <ArrowUpRight className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium text-slate-400">Total Gas Fees</span>
              </div>
              <div className="text-3xl font-bold text-white">
                {formatUSDAmount(summary.totalGasFeesUSD)}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <FilterBar
          filter={filter}
          onChange={updateFilter}
          availableTokens={availableTokens}
          availableNetworks={availableNetworks}
          onReset={resetFilter}
        />

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          loading={loading}
          sortConfig={sortConfig}
          onSort={updateSort}
          onRowClick={(transaction) => {
            console.log('Transaction clicked:', transaction);
          }}
        />

        {/* Pagination */}
        <Pagination
          pagination={pagination}
          onPageChange={(page) => fetchTransactions(page)}
          onPageSizeChange={(size) => {
            // Update page size and refetch
            fetchTransactions(1);
          }}
        />
      </div>
    </div>
  );
};

/**
 * Transaction History Page (with Provider)
 */
export default function TransactionHistoryPage() {
  return (
    <TransactionHistoryProvider>
      <TransactionHistoryContent />
    </TransactionHistoryProvider>
  );
}
