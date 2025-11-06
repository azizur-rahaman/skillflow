'use client';

/**
 * Filter Bar Component
 * 
 * Comprehensive filtering UI with date range, type, status, token, network, and search.
 */

import React, { useState } from 'react';
import { Filter, X, Calendar, Search } from 'lucide-react';
import {
  FilterBarProps,
  FilterPeriod,
  TransactionType,
  TransactionStatus,
  getTransactionTypeIcon,
  getTransactionTypeColor,
  getTransactionStatusColor,
} from '../../types/transaction-history.types';

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onChange,
  availableTokens,
  availableNetworks,
  onReset,
}) => {
  const [showFilters, setShowFilters] = useState(true);

  /**
   * Handle filter change
   */
  const handleChange = (key: string, value: any) => {
    onChange({ ...filter, [key]: value });
  };

  /**
   * Toggle array value
   */
  const toggleArrayValue = (key: string, value: any) => {
    const array = filter[key as keyof typeof filter] as any[];
    const newArray = array.includes(value)
      ? array.filter((v: any) => v !== value)
      : [...array, value];
    handleChange(key, newArray);
  };

  /**
   * Get active filter count
   */
  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.period !== FilterPeriod.AllTime) count++;
    if (filter.types.length > 0) count++;
    if (filter.statuses.length > 0) count++;
    if (filter.tokens.length > 0) count++;
    if (filter.networks.length > 0) count++;
    if (filter.searchQuery) count++;
    return count;
  };

  const activeCount = getActiveFilterCount();

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Reset all
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-1.5 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all"
          >
            {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {showFilters && (
        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filter.searchQuery || ''}
                onChange={(e) => handleChange('searchQuery', e.target.value)}
                placeholder="Search by hash, token, or type..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Time Period
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(FilterPeriod).map((period) => (
                <button
                  key={period}
                  onClick={() => handleChange('period', period)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      filter.period === period
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                        : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-800/50 hover:text-white'
                    }
                  `}
                >
                  {period === FilterPeriod.AllTime ? 'All Time' : period}
                </button>
              ))}
            </div>
            {filter.period === FilterPeriod.Custom && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">From</label>
                  <input
                    type="date"
                    value={filter.startDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => handleChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">To</label>
                  <input
                    type="date"
                    value={filter.endDate?.toISOString().split('T')[0] || ''}
                    onChange={(e) => handleChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Transaction Types */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(TransactionType).map((type) => {
                const icon = getTransactionTypeIcon(type);
                const color = getTransactionTypeColor(type);
                const isSelected = filter.types.includes(type);

                return (
                  <button
                    key={type}
                    onClick={() => toggleArrayValue('types', type)}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                      ${
                        isSelected
                          ? 'border'
                          : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-800/50 hover:text-white'
                      }
                    `}
                    style={
                      isSelected
                        ? {
                            backgroundColor: `${color}20`,
                            borderColor: `${color}50`,
                            color: color,
                          }
                        : undefined
                    }
                  >
                    <span>{icon}</span>
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Status
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(TransactionStatus).map((status) => {
                const color = getTransactionStatusColor(status);
                const isSelected = filter.statuses.includes(status);

                return (
                  <button
                    key={status}
                    onClick={() => toggleArrayValue('statuses', status)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        isSelected
                          ? 'border'
                          : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-800/50 hover:text-white'
                      }
                    `}
                    style={
                      isSelected
                        ? {
                            backgroundColor: `${color}20`,
                            borderColor: `${color}50`,
                            color: color,
                          }
                        : undefined
                    }
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tokens */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tokens
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableTokens.map((token) => {
                const isSelected = filter.tokens.includes(token.id);

                return (
                  <button
                    key={token.id}
                    onClick={() => toggleArrayValue('tokens', token.id)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                      ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                          : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-800/50 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-xs">{token.symbol}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Networks */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Networks
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableNetworks.map((network) => {
                const isSelected = filter.networks.includes(network);

                return (
                  <button
                    key={network}
                    onClick={() => toggleArrayValue('networks', network)}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                          : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-800/50 hover:text-white'
                      }
                    `}
                  >
                    {network}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
