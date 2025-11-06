/**
 * Search Bar Component
 * 
 * Search input with autocomplete and clear functionality.
 */

'use client';

import { useState, useCallback } from 'react';
import { useTalentSearch } from '../../context/TalentSearchContext';
import { Search, X, Grid, List, Download, RefreshCw, SortAsc } from 'lucide-react';
import { SortField } from '../../types/talent-search.types';

export const SearchBar = () => {
  const { state, actions } = useTalentSearch();
  const { filters, isSearching, viewMode, sortBy, results } = state;
  const [localQuery, setLocalQuery] = useState(filters.searchQuery);
  
  const handleSearchChange = useCallback((value: string) => {
    setLocalQuery(value);
    // Debounced search
    const timeoutId = setTimeout(() => {
      actions.search(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [actions]);
  
  const handleClear = () => {
    setLocalQuery('');
    actions.search('');
  };
  
  const sortOptions = [
    { field: SortField.RELEVANCE, label: 'Relevance' },
    { field: SortField.CONFIDENCE, label: 'Confidence' },
    { field: SortField.EXPERIENCE, label: 'Experience' },
    { field: SortField.RECENT_ACTIVITY, label: 'Recent Activity' },
    { field: SortField.PROFILE_COMPLETENESS, label: 'Profile Completeness' }
  ];
  
  return (
    <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-4">
        {/* Search Row */}
        <div className="flex items-center gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, skills, role, or keywords..."
              value={localQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            
            {localQuery && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {isSearching && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={actions.refreshResults}
            className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white hover:border-indigo-700 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Refresh</span>
          </button>
          
          {/* Export Button */}
          <div className="relative group">
            <button className="px-4 py-3 rounded-xl bg-indigo-500 text-white hover:brightness-110 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Export</span>
            </button>
            
            {/* Export Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-2">
                <button
                  onClick={() => actions.exportResults('json')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-white"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => actions.exportResults('csv')}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-white"
                >
                  Export as CSV
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Results Count */}
          <div className="text-sm text-slate-400">
            Showing <span className="text-white font-medium">{results?.talents.length || 0}</span> of{' '}
            <span className="text-white font-medium">{results?.filteredCount || 0}</span> talents
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy.field}
                onChange={(e) => actions.setSortBy({ field: e.target.value as SortField, direction: sortBy.direction })}
                className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.field} value={option.field}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-800/50 border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => actions.setViewMode('grid')}
                className={`p-1.5 rounded transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => actions.setViewMode('list')}
                className={`p-1.5 rounded transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
