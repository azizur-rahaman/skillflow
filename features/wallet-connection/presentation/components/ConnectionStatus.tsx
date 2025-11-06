'use client';

/**
 * Connection Status Component
 * 
 * Live connection status indicator with animated progress and status messages.
 * Shows current step in the connection flow.
 */

import React from 'react';
import { 
  ConnectionStatusProps,
  ConnectionStatus as Status,
  ConnectionStep,
  getConnectionStatusColor,
  getConnectionStatusIcon,
  formatWalletAddress,
} from '../../types/wallet-connection.types';

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  progress,
  walletAddress,
  animated = true,
}) => {
  const statusColor = getConnectionStatusColor(status);
  const statusIcon = getConnectionStatusIcon(status);

  // Get status message
  const getStatusMessage = () => {
    if (progress) {
      return progress.message;
    }

    switch (status) {
      case Status.Disconnected:
        return 'Ready to connect';
      case Status.Connecting:
        return 'Connecting to wallet...';
      case Status.Connected:
        return walletAddress ? `Connected to ${formatWalletAddress(walletAddress)}` : 'Wallet connected';
      case Status.Error:
        return 'Connection failed';
      case Status.Rejected:
        return 'Connection rejected';
      default:
        return 'Unknown status';
    }
  };

  return (
    <div className="w-full">
      {/* Status indicator */}
      <div className="flex items-center gap-3 mb-4">
        {/* Status icon */}
        <div 
          className={`
            w-10 h-10 rounded-full flex items-center justify-center
            transition-all duration-300
            ${animated && status === Status.Connecting ? 'animate-pulse' : ''}
          `}
          style={{ 
            backgroundColor: `${statusColor}20`,
            border: `2px solid ${statusColor}40`,
          }}
        >
          <span className="text-xl">{statusIcon}</span>
        </div>

        {/* Status text */}
        <div className="flex-1">
          <div 
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: statusColor }}
          >
            {status}
          </div>
          <div className="text-xs text-slate-400">
            {getStatusMessage()}
          </div>
        </div>

        {/* Connecting spinner */}
        {status === Status.Connecting && animated && (
          <div className="relative w-6 h-6">
            <svg 
              className="w-6 h-6 animate-spin"
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke={statusColor}
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill={statusColor}
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {progress && progress.progress > 0 && (
        <div className="space-y-2">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`
                h-full rounded-full transition-all duration-500 ease-out
                ${animated && 'animate-pulse-slow'}
              `}
              style={{ 
                width: `${progress.progress}%`,
                background: `linear-gradient(90deg, ${statusColor}, ${statusColor}CC)`,
              }}
            />
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {progress.currentStep.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="font-mono font-semibold" style={{ color: statusColor }}>
              {Math.round(progress.progress)}%
            </span>
          </div>
        </div>
      )}

      {/* Connected wallet info */}
      {status === Status.Connected && walletAddress && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-300">
              Connected
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-mono text-emerald-100">
              {formatWalletAddress(walletAddress, 6)}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(walletAddress)}
              className="p-1 rounded hover:bg-emerald-500/20 transition-colors"
              aria-label="Copy address"
            >
              <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};
