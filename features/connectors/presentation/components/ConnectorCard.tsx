'use client';

import { Connector, ConnectorType } from '../../types/connector.types';
import { useDataConnection } from '../../context/DataConnectionContext';
import { Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ConnectorCardProps {
  connector: Connector;
}

export default function ConnectorCard({ connector }: ConnectorCardProps) {
  const { connectProvider, disconnectProvider } = useDataConnection();

  const handleConnect = async () => {
    if (connector.status === 'connected') {
      disconnectProvider(connector.id);
    } else {
      await connectProvider(connector.id);
    }
  };

  // Dynamically get icon component
  const IconComponent = (LucideIcons as any)[connector.icon] || LucideIcons.Link;

  const getStatusIcon = () => {
    switch (connector.status) {
      case 'connected':
        return <Check className="w-5 h-5 text-[#10B981]" />;
      case 'connecting':
        return <Loader2 className="w-5 h-5 text-[#22D3EE] animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-[#22D3EE] animate-spin" />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    switch (connector.status) {
      case 'connected':
        return 'Disconnect';
      case 'connecting':
        return 'Connecting...';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Retry';
      default:
        return 'Connect';
    }
  };

  const isDisabled = connector.status === 'connecting' || connector.status === 'syncing';

  return (
    <div
      className={`
        group relative
        p-6 rounded-2xl
        bg-white/5 backdrop-blur-sm
        border-2 transition-all duration-300
        ${
          connector.status === 'connected'
            ? 'border-[#10B981]/40 bg-[#10B981]/5'
            : 'border-white/10 hover:border-white/30'
        }
      `}
      style={{
        boxShadow:
          connector.status === 'connected'
            ? `0 0 30px ${connector.color}20`
            : undefined,
      }}
    >
      {/* Success Glow Effect */}
      {connector.status === 'connected' && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
          style={{
            background: `radial-gradient(circle at center, ${connector.color}30, transparent)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-300"
              style={{
                backgroundColor: `${connector.color}15`,
                borderColor:
                  connector.status === 'connected'
                    ? '#10B981'
                    : `${connector.color}40`,
              }}
            >
              <IconComponent
                className="w-7 h-7"
                style={{ color: connector.status === 'connected' ? '#10B981' : connector.color }}
              />
            </div>

            {/* Name & Description */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold text-lg">
                  {connector.name}
                </h3>
                {connector.isRequired && (
                  <span className="px-2 py-0.5 bg-[#EF4444]/20 border border-[#EF4444]/40 rounded text-xs text-[#EF4444] font-medium">
                    Required
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm">
                {connector.description}
              </p>
            </div>
          </div>

          {/* Status Icon */}
          <div className="ml-4">
            {getStatusIcon()}
          </div>
        </div>

        {/* Connection Stats */}
        {connector.status === 'connected' && connector.dataPoints && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Data Points Extracted</span>
              <span className="text-[#22D3EE] font-semibold">
                {connector.dataPoints}
              </span>
            </div>
            {connector.lastSync && (
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-white/40">Last Synced</span>
                <span className="text-white/50">
                  {new Date(connector.lastSync).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {connector.status === 'error' && connector.error && (
          <div className="mb-4 p-3 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/30">
            <p className="text-[#EF4444] text-sm">{connector.error}</p>
          </div>
        )}

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isDisabled}
          className={`
            w-full py-3 px-4 rounded-xl font-semibold
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F172A]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              connector.status === 'connected'
                ? 'bg-white/10 border-2 border-white/20 text-white/80 hover:bg-white/15'
                : `bg-gradient-to-r text-white shadow-lg`
            }
          `}
          style={{
            backgroundImage:
              connector.status !== 'connected'
                ? `linear-gradient(135deg, ${connector.color}, ${connector.color}CC)`
                : undefined,
            boxShadow:
              connector.status !== 'connected'
                ? `0 4px 15px ${connector.color}40`
                : undefined,
          }}
        >
          <span className="flex items-center justify-center gap-2">
            {connector.status === 'connecting' && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {getButtonText()}
          </span>
        </button>
      </div>
    </div>
  );
}
