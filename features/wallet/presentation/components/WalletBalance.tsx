'use client';

/**
 * WalletBalance Component
 * 
 * Displays wallet balance card with gradient glow, connection status,
 * and key metrics. Web3-style design with clean typography.
 */

import React from 'react';
import { Wallet, Copy, CheckCircle2, ExternalLink, RefreshCw, Power } from 'lucide-react';
import { WalletBalanceProps, formatWalletAddress, formatUSD, getNetworkColor, getNetworkIcon } from '../../types/wallet.types';

export const WalletBalance: React.FC<WalletBalanceProps> = ({
  wallet,
  stats,
  onConnect,
  onDisconnect,
  showDetails = true,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Trigger refresh animation
    setTimeout(() => setRefreshing(false), 1000);
  };

  const networkColor = getNetworkColor(wallet.network);
  const networkIcon = getNetworkIcon(wallet.network);

  return (
    <div className="relative">
      {/* Gradient glow background */}
      <div
        className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${networkColor}, transparent 70%)`,
        }}
      />

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-mono shadow-lg"
              style={{ background: `linear-gradient(135deg, ${networkColor}, ${networkColor}CC)` }}
            >
              {networkIcon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Wallet Balance</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-muted-foreground font-mono">
                  {formatWalletAddress(wallet.walletAddress)}
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  {copied ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={`https://polygonscan.com/address/${wallet.walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg border border-slate-700 hover:border-primary hover:bg-slate-800/50 transition-all"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            {onDisconnect && (
              <button
                onClick={onDisconnect}
                className="p-2 rounded-lg border border-slate-700 hover:border-red-500 hover:bg-red-500/10 transition-all group"
              >
                <Power className="w-4 h-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Network badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-white">{wallet.network}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Connected {new Date(wallet.connectedAt).toLocaleTimeString()}
          </div>
        </div>

        {/* Balance display */}
        <div className="space-y-6">
          {/* Native balance */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Native Balance</div>
            <div className="flex items-baseline gap-3">
              <div className="text-3xl font-bold text-white font-mono">
                {wallet.balance.nativeBalance}
              </div>
              <div className="text-lg text-muted-foreground">MATIC</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              ≈ {formatUSD(wallet.balance.nativeBalanceUSD)}
            </div>
          </div>

          {showDetails && (
            <>
              {/* Divider */}
              <div className="border-t border-slate-700" />

              {/* Token stats grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Total Tokens */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {wallet.balance.totalTokens}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Tokens</div>
                </div>

                {/* Credentials */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {wallet.balance.totalCredentials}
                  </div>
                  <div className="text-xs text-muted-foreground">Credentials</div>
                </div>

                {/* Verified */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <div className="text-2xl font-bold text-green-500">
                      {wallet.balance.verifiedCredentials}
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-xs text-muted-foreground">Verified</div>
                </div>
              </div>

              {/* Activity stats */}
              {stats && (
                <>
                  <div className="border-t border-slate-700" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Minted</div>
                      <div className="text-white font-semibold">{stats.totalMinted}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Received</div>
                      <div className="text-white font-semibold">{stats.totalReceived}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Transferred</div>
                      <div className="text-white font-semibold">{stats.totalTransferred}</div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Connection indicator */}
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
