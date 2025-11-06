'use client';

/**
 * Hash Copy Component
 * 
 * Displays transaction hash with hover reveal and copy functionality.
 */

import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { HashCopyProps, formatTransactionHash } from '../../types/transaction-history.types';

export const HashCopy: React.FC<HashCopyProps> = ({ hash, explorerUrl, compact = false }) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplorerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(explorerUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="inline-flex items-center gap-2 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hash Display */}
      <code
        className={`
          font-mono text-xs transition-all duration-300
          ${isHovered && !compact ? 'text-indigo-400' : 'text-slate-300'}
        `}
      >
        {compact || !isHovered ? formatTransactionHash(hash) : hash}
      </code>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`
            p-1 rounded-md transition-all duration-200
            ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-slate-700/50 text-slate-400 hover:text-white'}
          `}
          title={copied ? 'Copied!' : 'Copy hash'}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>

        {/* Explorer Link */}
        {explorerUrl && (
          <button
            onClick={handleExplorerClick}
            className="p-1 rounded-md transition-all duration-200 hover:bg-slate-700/50 text-slate-400 hover:text-white"
            title="View on explorer"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Copied Tooltip */}
      {copied && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-md whitespace-nowrap">
          Copied!
        </div>
      )}
    </div>
  );
};
