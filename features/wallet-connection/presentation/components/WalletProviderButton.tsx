'use client';

/**
 * Wallet Provider Button Component
 * 
 * Glassmorphic button for selecting wallet provider (MetaMask, WalletConnect).
 * Features soft neon glow on hover/active states.
 */

import React from 'react';
import { WalletProviderButtonProps } from '../../types/wallet-connection.types';

export const WalletProviderButton: React.FC<WalletProviderButtonProps> = ({
  provider,
  onConnect,
  disabled = false,
  selected = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onConnect(provider.name);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative group w-full
        transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${selected ? 'scale-105' : 'hover:scale-102'}
      `}
    >
      {/* Glow effect */}
      <div 
        className={`
          absolute inset-0 rounded-2xl blur-xl opacity-0 
          transition-opacity duration-300
          ${!disabled && 'group-hover:opacity-30'}
          ${selected && 'opacity-40'}
        `}
        style={{
          background: provider.recommended 
            ? 'linear-gradient(135deg, #6366F1, #A855F7)'
            : 'linear-gradient(135deg, #22D3EE, #3B82F6)',
        }}
      />

      {/* Glass card */}
      <div
        className={`
          relative p-6 rounded-2xl border
          backdrop-blur-md
          transition-all duration-300
          ${!disabled && 'group-hover:border-indigo-400/50'}
          ${selected ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700/50 bg-slate-900/40'}
        `}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div 
            className={`
              w-14 h-14 rounded-xl flex items-center justify-center text-3xl
              transition-all duration-300
              ${provider.installed ? 'bg-slate-800/50' : 'bg-slate-800/30'}
              ${!disabled && 'group-hover:bg-slate-700/50'}
              ${selected && 'ring-2 ring-indigo-500 bg-indigo-500/20'}
            `}
          >
            {provider.icon}
          </div>

          {/* Content */}
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-100">
                {provider.name}
              </h3>
              {provider.recommended && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-xs font-medium text-indigo-300">
                  Recommended
                </span>
              )}
              {!provider.installed && provider.name !== 'WalletConnect' && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-xs font-medium text-amber-300">
                  Not Installed
                </span>
              )}
            </div>

            <p className="text-sm text-slate-400 mb-3 leading-relaxed">
              {provider.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {provider.features.slice(0, 3).map((feature, index) => (
                <div 
                  key={index}
                  className="px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400"
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* Download link for non-installed providers */}
            {!provider.installed && provider.name !== 'WalletConnect' && (
              <a
                href={provider.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download {provider.name}</span>
              </a>
            )}
          </div>

          {/* Arrow icon */}
          <div 
            className={`
              flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
              transition-all duration-300
              ${!disabled && 'group-hover:bg-slate-700/30'}
              ${selected && 'bg-indigo-500/20'}
            `}
          >
            <svg 
              className={`
                w-6 h-6 transition-all duration-300
                ${selected ? 'text-indigo-400' : 'text-slate-500'}
                ${!disabled && 'group-hover:text-slate-300 group-hover:translate-x-1'}
              `}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Selected indicator */}
        {selected && (
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center animate-scale-in">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </button>
  );
};
