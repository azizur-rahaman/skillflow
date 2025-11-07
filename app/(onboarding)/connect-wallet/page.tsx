'use client';

/**
 * Wallet Connection Page
 * 
 * Secure wallet connection screen with glassmorphism design, WalletConnect and MetaMask options,
 * safety tips sidebar, and step-by-step connection flow.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WalletConnectionProvider, useWalletConnection } from '@/features/wallet-connection/context/WalletConnectionContext';
import { WalletProviderButton } from '@/features/wallet-connection/presentation/components/WalletProviderButton';
import { SafetySidebar } from '@/features/wallet-connection/presentation/components/SafetySidebar';
import { ConnectionStatus } from '@/features/wallet-connection/presentation/components/ConnectionStatus';
import { SuccessAnimation } from '@/features/wallet-connection/presentation/components/SuccessAnimation';
import { 
  WalletProvider, 
  ConnectionStatus as Status,
  ConnectionStep,
} from '@/features/wallet-connection/types/wallet-connection.types';

/**
 * Wallet Connection Page Content
 */
const WalletConnectionPageContent: React.FC = () => {
  const router = useRouter();
  const {
    connectionStatus,
    connectionProgress,
    connectedWallet,
    availableProviders,
    safetyTips,
    loading,
    error,
    connectWallet,
    disconnectWallet,
  } = useWalletConnection();

  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Handle provider selection
   */
  const handleProviderSelect = async (provider: WalletProvider) => {
    try {
      await connectWallet(provider);
      // Show success animation
      setShowSuccess(true);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  /**
   * Handle success completion
   */
  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // Redirect to dashboard or onboarding
    router.push('/dashboard');
  };

  /**
   * Handle disconnect
   */
  const handleDisconnect = async () => {
    await disconnectWallet();
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30">
        <div
          className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent 70%)",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-100">
                    Wallet Connection
                  </h1>
                  <p className="text-xs text-slate-500">
                    Secure blockchain authentication
                  </p>
                </div>
              </div>

              {connectionStatus === Status.Connected && (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 transition-colors text-sm font-medium"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Connection interface */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-100 mb-3">
                  Connect Your Wallet
                </h2>
                <p className="text-slate-400 leading-relaxed max-w-2xl">
                  Link your blockchain wallet to access your skill credentials,
                  mint new achievements, and manage your decentralized identity
                  on SkillFlow.
                </p>
              </div>

              {/* Connection Status */}
              {connectionStatus !== Status.Disconnected && (
                <ConnectionStatus
                  status={connectionStatus}
                  progress={connectionProgress || undefined}
                  walletAddress={connectedWallet?.address}
                  animated
                />
              )}

              {/* Error message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-300 mb-1">
                        Connection Error
                      </h4>
                      <p className="text-sm text-red-200/80">{error.message}</p>
                      {error.suggestion && (
                        <p className="text-xs text-red-300/70 mt-1">
                          {error.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Provider selection - Only show when disconnected */}
              {connectionStatus === Status.Disconnected &&
                availableProviders && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200">
                      Choose Your Wallet Provider
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {availableProviders
                        .filter(
                          (p) =>
                            p.name === WalletProvider.MetaMask ||
                            p.name === WalletProvider.WalletConnect
                        )
                        .map((provider) => (
                          <WalletProviderButton
                            key={provider.id}
                            provider={provider}
                            onConnect={handleProviderSelect}
                            disabled={
                              loading ||
                              connectionStatus !== Status.Disconnected
                            }
                          />
                        ))}
                    </div>

                    {/* Additional info */}
                    <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-blue-300 mb-1">
                            First time connecting?
                          </h4>
                          <p className="text-sm text-blue-200/80 leading-relaxed">
                            Don&apos;t have a wallet yet? We recommend{" "}
                            <a
                              href="https://metamask.io"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline"
                            >
                              MetaMask
                            </a>{" "}
                            for beginners. It&apos;s free, secure, and easy to
                            set up.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Connected state - Show wallet details */}
              {connectionStatus === Status.Connected && connectedWallet && (
                <div className="space-y-6">
                  {/* Wallet info card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/50 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-emerald-400 mb-1">
                          Wallet Connected Successfully
                        </h3>
                        <p className="text-sm text-slate-400">
                          Your wallet is now linked to your SkillFlow account
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-1">Provider</p>
                        <p className="text-sm font-semibold text-slate-200">
                          {connectedWallet.provider}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-1">Network</p>
                        <p className="text-sm font-semibold text-slate-200">
                          {connectedWallet.network.name}
                        </p>
                      </div>
                      <div className="col-span-full p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-xs text-slate-500 mb-1">
                          Wallet Address
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono text-slate-200 truncate flex-1">
                            {connectedWallet.address}
                          </p>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                connectedWallet.address
                              )
                            }
                            className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors flex-shrink-0"
                            aria-label="Copy address"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSuccessComplete}
                      className="mt-4 w-full px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                        boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)",
                      }}
                    >
                      Continue to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Safety sidebar */}
            <div className="lg:col-span-1">
              <SafetySidebar
                currentStep={
                  connectionProgress?.currentStep || ConnectionStep.Idle
                }
                tips={safetyTips}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Success animation overlay */}
      <SuccessAnimation
        visible={showSuccess}
        walletAddress={connectedWallet?.address || ""}
        network={connectedWallet?.network.name || "Ethereum Mainnet"}
        onComplete={handleSuccessComplete}
      />

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * Wallet Connection Page with Provider
 */
export default function WalletConnectionPage() {
  return (
    <WalletConnectionProvider>
      <WalletConnectionPageContent />
    </WalletConnectionProvider>
  );
}
