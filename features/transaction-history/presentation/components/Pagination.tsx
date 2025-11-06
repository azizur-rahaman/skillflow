'use client';

/**
 * Pagination Component
 * 
 * Page navigation with size control.
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationProps } from '../../types/transaction-history.types';

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const { currentPage, totalPages, totalItems, hasNext, hasPrevious, pageSize } = pagination;

  const pageSizeOptions = [10, 20, 50, 100];

  /**
   * Generate page numbers
   */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and nearby pages
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/50 rounded-b-2xl">
      {/* Info */}
      <div className="text-sm text-slate-400">
        Showing{' '}
        <span className="font-medium text-white">
          {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
        </span>{' '}
        to{' '}
        <span className="font-medium text-white">
          {Math.min(currentPage * pageSize, totalItems)}
        </span>{' '}
        of <span className="font-medium text-white">{totalItems}</span> results
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevious}
            className={`
              p-2 rounded-lg transition-all
              ${
                hasPrevious
                  ? 'hover:bg-slate-800/50 text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPageNumbers().map((page, index) =>
            typeof page === 'number' ? (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`
                  min-w-[2.5rem] px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${
                    page === currentPage
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                      : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
                  }
                `}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="px-2 text-slate-600">
                {page}
              </span>
            )
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className={`
              p-2 rounded-lg transition-all
              ${
                hasNext
                  ? 'hover:bg-slate-800/50 text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }
            `}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
