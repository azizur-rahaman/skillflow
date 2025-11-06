'use client';

/**
 * Token Icon Component
 * 
 * Displays token icon with fallback.
 */

import React from 'react';
import Image from 'next/image';
import { TokenIconProps } from '../../types/transaction-history.types';

export const TokenIcon: React.FC<TokenIconProps> = ({ token, size = 'md' }) => {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48,
  };

  const pixelSize = sizeMap[size];

  return (
    <div
      className="relative rounded-full overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-slate-700/50 flex items-center justify-center"
      style={{
        width: pixelSize,
        height: pixelSize,
      }}
    >
      {token.icon ? (
        <Image
          src={token.icon}
          alt={token.name}
          width={pixelSize}
          height={pixelSize}
          className="object-cover"
          onError={(e) => {
            // Hide image on error and show fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span className="text-xs font-bold text-white">
          {token.symbol.substring(0, 2)}
        </span>
      )}
    </div>
  );
};
