'use client';

/**
 * Wallet Connection Context
 * 
 * State management for secure wallet connection with MetaMask and WalletConnect.
 * Handles provider detection, connection flow, and safety validations.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  WalletConnectionContextState,
  WalletProvider,
  ConnectionStatus,
  ConnectionStep,
  ConnectionRequest,
  ConnectionResult,
  ConnectionProgress,
  ConnectedWallet,
  WalletProviderInfo,
  SafetyTip,
  ConnectionError,
  getAvailableProviders,
  getSafetyTips,
  getConnectionStepProgress,
  getNetworkByChainId,
  getErrorMessage,
  getErrorSuggestion,
} from '../types/wallet-connection.types';

// Create context
const WalletConnectionContext = createContext<WalletConnectionContextState | undefined>(undefined);

/**
 * Wallet Connection Provider
 */
export const WalletConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Disconnected);
  const [connectionProgress, setConnectionProgress] = useState<ConnectionProgress | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null);
  const [availableProviders] = useState<WalletProviderInfo[]>(getAvailableProviders());
  const [safetyTips] = useState<SafetyTip[]>(getSafetyTips());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ConnectionError | null>(null);

  /**
   * Update connection progress
   */
  const updateProgress = (step: ConnectionStep, message: string) => {
    const progress = getConnectionStepProgress(step);
    setConnectionProgress({
      currentStep: step,
      progress,
      message,
    });
  };

  /**
   * Connect wallet
   */
  const connectWallet = useCallback(async (
    provider: WalletProvider
  ): Promise<ConnectionResult> => {
    try {
      setLoading(true);
      setError(null);
      setConnectionStatus(ConnectionStatus.Connecting);

      // Step 1: Selecting provider
      updateProgress(ConnectionStep.SelectingProvider, `Connecting to ${provider}...`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Requesting permission
      updateProgress(ConnectionStep.RequestingPermission, 'Requesting wallet permission...');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Check provider availability
      const providerInfo = availableProviders.find(p => p.name === provider);
      if (!providerInfo?.installed && provider !== WalletProvider.WalletConnect) {
        throw {
          code: 'provider_not_found',
          message: `${provider} not found`,
        };
      }

      // Step 3: Verifying signature (optional for some providers)
      if (provider === WalletProvider.MetaMask) {
        updateProgress(ConnectionStep.VerifyingSignature, 'Verifying wallet signature...');
        await new Promise(resolve => setTimeout(resolve, 700));
      }

      // Step 4: Connecting
      updateProgress(ConnectionStep.Connecting, 'Establishing secure connection...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock wallet connection (in production: use ethers.js or wagmi)
      const mockWallet: ConnectedWallet = {
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        provider,
        network: getNetworkByChainId(137)!, // Polygon
        balance: '2.5',
        balanceUSD: 2.15,
        connectedAt: new Date(),
      };

      // Step 5: Connected
      updateProgress(ConnectionStep.Connected, 'Wallet connected successfully!');
      await new Promise(resolve => setTimeout(resolve, 500));

      setConnectedWallet(mockWallet);
      setConnectionStatus(ConnectionStatus.Connected);
      setConnectionProgress(null);

      return {
        success: true,
        walletAddress: mockWallet.address,
        chainId: mockWallet.network.chainId,
        chainName: mockWallet.network.name,
        provider,
        connectedAt: mockWallet.connectedAt,
      };
    } catch (err: any) {
      const connectionError: ConnectionError = {
        code: err.code || 'unknown_error',
        message: err.message || getErrorMessage(err.code || 'unknown_error'),
        details: err.details,
        suggestion: getErrorSuggestion(err.code || 'unknown_error'),
      };

      setError(connectionError);
      setConnectionStatus(err.code === 'user_rejected' ? ConnectionStatus.Rejected : ConnectionStatus.Error);
      setConnectionProgress(null);

      return {
        success: false,
        error: connectionError,
      };
    } finally {
      setLoading(false);
    }
  }, [availableProviders]);

  /**
   * Disconnect wallet
   */
  const disconnectWallet = useCallback(() => {
    setConnectedWallet(null);
    setConnectionStatus(ConnectionStatus.Disconnected);
    setConnectionProgress(null);
    setError(null);
  }, []);

  /**
   * Switch network
   */
  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      setLoading(true);
      setError(null);

      const network = getNetworkByChainId(chainId);
      if (!network) {
        throw {
          code: 'chain_not_supported',
          message: 'Network not supported',
        };
      }

      // Simulate network switch
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (connectedWallet) {
        setConnectedWallet({
          ...connectedWallet,
          network,
        });
      }
    } catch (err: any) {
      const connectionError: ConnectionError = {
        code: err.code || 'network_error',
        message: err.message || getErrorMessage(err.code || 'network_error'),
        suggestion: getErrorSuggestion(err.code || 'network_error'),
      };
      setError(connectionError);
    } finally {
      setLoading(false);
    }
  }, [connectedWallet]);

  /**
   * Refresh balance
   */
  const refreshBalance = useCallback(async () => {
    if (!connectedWallet) return;

    try {
      setLoading(true);

      // Simulate balance refresh
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedBalance = (parseFloat(connectedWallet.balance) + Math.random() * 0.1).toFixed(4);
      const updatedUSD = parseFloat(updatedBalance) * 0.86; // Mock conversion rate

      setConnectedWallet({
        ...connectedWallet,
        balance: updatedBalance,
        balanceUSD: parseFloat(updatedUSD.toFixed(2)),
      });
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    } finally {
      setLoading(false);
    }
  }, [connectedWallet]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setConnectionStatus(ConnectionStatus.Disconnected);
    setConnectionProgress(null);
    setConnectedWallet(null);
    setError(null);
  }, []);

  const value: WalletConnectionContextState = {
    connectionStatus,
    connectionProgress,
    connectedWallet,
    availableProviders,
    safetyTips,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
    reset,
  };

  return (
    <WalletConnectionContext.Provider value={value}>
      {children}
    </WalletConnectionContext.Provider>
  );
};

/**
 * Hook to use wallet connection context
 */
export const useWalletConnection = (): WalletConnectionContextState => {
  const context = useContext(WalletConnectionContext);
  if (!context) {
    throw new Error('useWalletConnection must be used within a WalletConnectionProvider');
  }
  return context;
};
