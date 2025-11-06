/**
 * Filter Panel Component
 * 
 * Time range selector, filters, and export controls for analytics dashboard
 */

'use client';

import { useState } from 'react';
import { TimeRange, getTimeRangePresets, AnalyticsFilters } from '../../types/analytics.types';
import { 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw, 
  X,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  Image
} from 'lucide-react';

interface FilterPanelProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  onExport?: (format: 'pdf' | 'csv' | 'excel' | 'png') => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onExport,
  onRefresh,
  isLoading = false 
}: FilterPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const timeRangePresets = getTimeRangePresets();
  
  const handleTimeRangeChange = (preset: TimeRange) => {
    onFiltersChange({
      ...filters,
      timeRange: preset,
    });
  };
  
  const handleComparisonToggle = () => {
    onFiltersChange({
      ...filters,
      comparisonEnabled: !filters.comparisonEnabled,
    });
  };
  
  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Filter className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Filters & Controls</h3>
            <p className="text-xs text-slate-400">Customize your analytics view</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`p-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg text-sm font-medium text-white transition"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10">
                {[
                  { format: 'pdf' as const, label: 'PDF Report', icon: FileText },
                  { format: 'csv' as const, label: 'CSV Data', icon: FileSpreadsheet },
                  { format: 'excel' as const, label: 'Excel Workbook', icon: FileSpreadsheet },
                  { format: 'png' as const, label: 'PNG Image', icon: Image },
                ].map(({ format, label, icon: Icon }) => (
                  <button
                    key={format}
                    onClick={() => {
                      onExport?.(format);
                      setShowExportMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 text-sm text-white transition first:rounded-t-lg last:rounded-b-lg"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Time Range Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-300 mb-3 block">Time Range</label>
        <div className="grid grid-cols-5 gap-2">
          {timeRangePresets.map((preset) => (
            <button
              key={preset.preset}
              onClick={() => handleTimeRangeChange(preset)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filters.timeRange.preset === preset.preset
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Custom Date Range (shown when preset is 'custom') */}
      {filters.timeRange.preset === 'custom' && (
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Start Date</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={filters.timeRange.startDate.split('T')[0]}
                onChange={(e) => {
                  const newRange = { ...filters.timeRange, startDate: e.target.value };
                  onFiltersChange({ ...filters, timeRange: newRange });
                }}
                className="flex-1 bg-transparent text-sm text-white outline-none"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm text-slate-400 mb-2 block">End Date</label>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={filters.timeRange.endDate.split('T')[0]}
                onChange={(e) => {
                  const newRange = { ...filters.timeRange, endDate: e.target.value };
                  onFiltersChange({ ...filters, timeRange: newRange });
                }}
                className="flex-1 bg-transparent text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Comparison Toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.comparisonEnabled}
            onChange={handleComparisonToggle}
            className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
          />
          <span className="text-sm font-medium text-slate-300">
            Compare with previous period
          </span>
        </label>
      </div>
      
      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition mb-4"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        Advanced Filters
      </button>
      
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-slate-700">
          {/* Skill Categories */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Skill Categories</label>
            <div className="flex flex-wrap gap-2">
              {['Frontend', 'Backend', 'DevOps', 'Data Science', 'Design', 'Management'].map((category) => {
                const isSelected = filters.skillCategories?.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => {
                      const current = filters.skillCategories || [];
                      const updated = isSelected
                        ? current.filter(c => c !== category)
                        : [...current, category];
                      onFiltersChange({ ...filters, skillCategories: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {category}
                    {isSelected && <X className="inline-block w-3 h-3 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* User Segments */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">User Segments</label>
            <div className="flex flex-wrap gap-2">
              {['New Users', 'Active Users', 'Power Users', 'At Risk'].map((segment) => {
                const isSelected = filters.userSegments?.includes(segment);
                return (
                  <button
                    key={segment}
                    onClick={() => {
                      const current = filters.userSegments || [];
                      const updated = isSelected
                        ? current.filter(s => s !== segment)
                        : [...current, segment];
                      onFiltersChange({ ...filters, userSegments: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {segment}
                    {isSelected && <X className="inline-block w-3 h-3 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Credential Types */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Credential Types</label>
            <div className="flex flex-wrap gap-2">
              {['Verified Skills', 'Certifications', 'Achievements', 'NFT Credentials'].map((type) => {
                const isSelected = filters.credentialTypes?.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => {
                      const current = filters.credentialTypes || [];
                      const updated = isSelected
                        ? current.filter(t => t !== type)
                        : [...current, type];
                      onFiltersChange({ ...filters, credentialTypes: updated });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {type}
                    {isSelected && <X className="inline-block w-3 h-3 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Active Filters Summary */}
      {(filters.skillCategories?.length || filters.userSegments?.length || filters.credentialTypes?.length) ? (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {[
              ...(filters.skillCategories || []).map(c => ({ type: 'category', value: c })),
              ...(filters.userSegments || []).map(s => ({ type: 'segment', value: s })),
              ...(filters.credentialTypes || []).map(t => ({ type: 'credential', value: t })),
            ].map((filter, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2 py-1 bg-slate-800/50 border border-slate-700 rounded text-xs text-slate-300"
              >
                {filter.value}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
