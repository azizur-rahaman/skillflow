'use client';

/**
 * Status Badge Component
 * 
 * Displays transaction status with color-coded badge.
 */

import React from 'react';
import {
  StatusBadgeProps,
  getTransactionStatusColor,
  getTransactionStatusIcon,
} from '../../types/transaction-history.types';

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, compact = false }) => {
  const color = getTransactionStatusColor(status);
  const icon = getTransactionStatusIcon(status);

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        font-medium backdrop-blur-sm
        ${compact ? 'text-xs' : 'text-sm'}
      `}
      style={{
        backgroundColor: `${color}20`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `${color}40`,
        color: color,
      }}
    >
      <span className={compact ? 'text-xs' : 'text-sm'}>{icon}</span>
      {!compact && <span>{status}</span>}
    </div>
  );
};
