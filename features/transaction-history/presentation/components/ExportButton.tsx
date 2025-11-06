'use client';

/**
 * Export Button Component
 * 
 * Exports transactions to CSV, JSON, or Excel format.
 */

import React, { useState } from 'react';
import { Download, FileText, FileJson, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { ExportButtonProps, ExportFormat, ExportOptions } from '../../types/transaction-history.types';

export const ExportButton: React.FC<ExportButtonProps> = ({
  transactions,
  onExport,
  disabled = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  /**
   * Handle export
   */
  const handleExport = async (format: ExportFormat) => {
    try {
      setExporting(true);
      setShowMenu(false);

      const options: ExportOptions = {
        format,
        includeMetadata: true,
      };

      if (onExport) {
        await onExport(options);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled || exporting || transactions.length === 0}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg
          font-medium text-sm transition-all
          ${
            disabled || exporting || transactions.length === 0
              ? 'bg-slate-800/30 text-slate-500 cursor-not-allowed'
              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/30'
          }
        `}
      >
        <Download className="w-4 h-4" />
        {exporting ? 'Exporting...' : 'Export'}
        <ChevronDown className="w-3 h-3" />
      </button>

      {/* Export Menu */}
      {showMenu && !disabled && !exporting && transactions.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-10">
          <div className="p-2 border-b border-slate-700">
            <p className="text-xs text-slate-400">
              Export {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={() => handleExport(ExportFormat.CSV)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-700/50 transition-colors text-left"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-sm font-medium text-white">CSV</div>
                <div className="text-xs text-slate-400">Comma-separated values</div>
              </div>
            </button>
            <button
              onClick={() => handleExport(ExportFormat.JSON)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-700/50 transition-colors text-left"
            >
              <FileJson className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-sm font-medium text-white">JSON</div>
                <div className="text-xs text-slate-400">JavaScript object notation</div>
              </div>
            </button>
            <button
              onClick={() => handleExport(ExportFormat.Excel)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-700/50 transition-colors text-left"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-sm font-medium text-white">Excel</div>
                <div className="text-xs text-slate-400">Microsoft Excel format</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};
