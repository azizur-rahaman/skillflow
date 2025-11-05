'use client';

/**
 * Wallet Dashboard Page
 * 
 * Web3-style wallet dashboard for managing ERC-1155 skill credentials and tokens.
 * Minimalist cards, gradient glow buttons, clean typography, blockchain aesthetic.
 */

import React from 'react';
import { Wallet, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { WalletProvider, useWallet } from '@/features/wallet/context/WalletContext';
import {
  WalletBalance,
  TokenList,
  TransactionHistory,
  MintCredentialButton,
} from '@/features/wallet/presentation/components';

/**
 * Wallet Dashboard (Wrapped with Provider)
 */
export default function WalletDashboardPage() {
  return (
    <WalletProvider>
      <WalletDashboard />
    </WalletProvider>
  );
}

/**
 * Main Wallet Dashboard Component
 */
function WalletDashboard() {
  const {
    wallet,
    tokens,
    transactions,
    stats,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    mintCredential,
  } = useWallet();

  // Not connected state
  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Wallet className="w-8 h-8" />
              Wallet Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your skill credentials and blockchain tokens
            </p>
          </div>

          {/* Connect wallet prompt */}
          <div className="max-w-lg mx-auto mt-20">
            <div className="relative">
              {/* Glow background */}
              <div
                className="absolute inset-0 rounded-2xl opacity-20 blur-2xl"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #6366F1, transparent 70%)',
                }}
              />

              {/* Card */}
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-12 text-center shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                  <Wallet className="w-10 h-10" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">
                  Connect Your Wallet
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Connect your Web3 wallet to view and manage your skill credentials, mint new tokens, and track transactions on-chain.
                </p>

                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                    boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      <span>Connect Wallet</span>
                    </div>
                  )}
                </button>

                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-xs">
                      ⬡
                    </div>
                    <span>Polygon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-xs">
                      🦊
                    </div>
                    <span>MetaMask</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-xs">
                      🔗
                    </div>
                    <span>WalletConnect</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-500 mb-1">Error</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Connected state
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Wallet className="w-8 h-8" />
              Wallet Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your skill credentials and blockchain tokens
            </p>
          </div>

          <MintCredentialButton 
            onMint={async (request) => {
              await mintCredential(request);
            }} 
            loading={loading} 
          />
        </div>

        {/* Wallet Balance Card */}
        <WalletBalance
          wallet={wallet}
          stats={stats!}
          onDisconnect={disconnectWallet}
          showDetails
        />

        {/* Quick Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Skill Mastery */}
            <StatCard
              label="Skill Mastery"
              value={stats.categoriesCount['Skill Mastery']}
              color="#6366F1"
              icon="🏆"
            />

            {/* Certifications */}
            <StatCard
              label="Certifications"
              value={stats.categoriesCount['Certification']}
              color="#10B981"
              icon="🎓"
            />

            {/* Recent Activity */}
            <StatCard
              label="Last 7 Days"
              value={stats.recentActivity.last7Days}
              subtitle="transactions"
              color="#22D3EE"
              icon="📊"
            />

            {/* Total Transactions */}
            <StatCard
              label="Total Transactions"
              value={stats.totalTransactions}
              color="#A855F7"
              icon="⚡"
            />
          </div>
        )}

        {/* Token List */}
        <TokenList tokens={tokens} loading={loading} />

        {/* Transaction History */}
        <TransactionHistory transactions={transactions} loading={loading} />
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  label: string;
  value: number;
  subtitle?: string;
  color: string;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtitle, color, icon }) => {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        }}
      />

      {/* Card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-primary transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="text-2xl">{icon}</div>
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
          />
        </div>

        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">
          {label}
          {subtitle && ` ${subtitle}`}
        </div>
      </div>
    </div>
  );
};
