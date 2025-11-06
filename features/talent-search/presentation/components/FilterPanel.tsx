/**
 * Filter Panel Component
 * 
 * Advanced filter sidebar for talent search with domain, experience,
 * region, availability, and other filter criteria.
 */

'use client';

import { useTalentSearch } from '../../context/TalentSearchContext';
import {
  FILTER_OPTIONS,
  getExperienceLevelLabel,
  getAvailabilityLabel,
  ExperienceLevel,
  AvailabilityStatus
} from '../../types/talent-search.types';
import { 
  SlidersHorizontal, 
  Briefcase, 
  MapPin, 
  CheckCircle, 
  TrendingUp,
  Award,
  Clock,
  X
} from 'lucide-react';

export const FilterPanel = () => {
  const { state, actions } = useTalentSearch();
  const { filters, results } = state;
  
  const activeFilterCount = 
    filters.domains.length +
    filters.experienceLevels.length +
    filters.regions.length +
    filters.availability.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.trending ? 1 : 0) +
    (filters.certified ? 1 : 0) +
    (filters.endorsed ? 1 : 0) +
    (filters.recentlyActive ? 1 : 0);
  
  const toggleDomain = (domain: string) => {
    const newDomains = filters.domains.includes(domain)
      ? filters.domains.filter(d => d !== domain)
      : [...filters.domains, domain];
    actions.applyFilters({ domains: newDomains });
  };
  
  const toggleExperienceLevel = (level: ExperienceLevel) => {
    const newLevels = filters.experienceLevels.includes(level)
      ? filters.experienceLevels.filter(l => l !== level)
      : [...filters.experienceLevels, level];
    actions.applyFilters({ experienceLevels: newLevels });
  };
  
  const toggleRegion = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter(r => r !== region)
      : [...filters.regions, region];
    actions.applyFilters({ regions: newRegions });
  };
  
  const toggleAvailability = (availability: AvailabilityStatus) => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter(a => a !== availability)
      : [...filters.availability, availability];
    actions.applyFilters({ availability: newAvailability });
  };
  
  return (
    <aside className="w-80 flex-shrink-0 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            Filters
          </h2>
          {activeFilterCount > 0 && (
            <div className="px-2 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/30">
              <span className="text-xs font-bold text-indigo-400">
                {activeFilterCount}
              </span>
            </div>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <button
            onClick={actions.resetFilters}
            className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 hover:border-indigo-700 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Domains */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-400" />
          Domain
        </h3>
        
        <div className="space-y-2">
          {FILTER_OPTIONS.domains.map((domain) => {
            const count = results?.aggregations.domainCounts[domain] || 0;
            const isSelected = filters.domains.includes(domain);
            
            return (
              <label
                key={domain}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleDomain(domain)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className={`text-sm transition-colors ${
                    isSelected ? 'text-white font-medium' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {domain}
                  </span>
                </div>
                {count > 0 && (
                  <span className="text-xs text-slate-400">
                    {count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
      
      {/* Experience Level */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          Experience Level
        </h3>
        
        <div className="space-y-2">
          {FILTER_OPTIONS.experienceLevels.map((level) => {
            const count = results?.aggregations.experienceLevelCounts[level] || 0;
            const isSelected = filters.experienceLevels.includes(level);
            
            return (
              <label
                key={level}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleExperienceLevel(level)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className={`text-sm transition-colors ${
                    isSelected ? 'text-white font-medium' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {getExperienceLevelLabel(level)}
                  </span>
                </div>
                {count > 0 && (
                  <span className="text-xs text-slate-400">
                    {count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
      
      {/* Region */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-400" />
          Region
        </h3>
        
        <div className="space-y-2">
          {FILTER_OPTIONS.regions.map((region) => {
            const count = results?.aggregations.regionCounts[region] || 0;
            const isSelected = filters.regions.includes(region);
            
            return (
              <label
                key={region}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRegion(region)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className={`text-sm transition-colors ${
                    isSelected ? 'text-white font-medium' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {region}
                  </span>
                </div>
                {count > 0 && (
                  <span className="text-xs text-slate-400">
                    {count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
      
      {/* Availability */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          Availability
        </h3>
        
        <div className="space-y-2">
          {FILTER_OPTIONS.availability.map((availability) => {
            const count = results?.aggregations.availabilityCounts[availability] || 0;
            const isSelected = filters.availability.includes(availability);
            
            return (
              <label
                key={availability}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleAvailability(availability)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className={`text-sm transition-colors ${
                    isSelected ? 'text-white font-medium' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {getAvailabilityLabel(availability)}
                  </span>
                </div>
                {count > 0 && (
                  <span className="text-xs text-slate-400">
                    {count}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
      
      {/* Quick Filters */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">
          Quick Filters
        </h3>
        
        <div className="space-y-2">
          <label className="flex items-center p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors">
            <input
              type="checkbox"
              checked={filters.trending}
              onChange={(e) => actions.applyFilters({ trending: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <TrendingUp className="w-4 h-4 ml-2 mr-2 text-emerald-400" />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Has trending skills
            </span>
          </label>
          
          <label className="flex items-center p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors">
            <input
              type="checkbox"
              checked={filters.certified}
              onChange={(e) => actions.applyFilters({ certified: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <Award className="w-4 h-4 ml-2 mr-2 text-purple-400" />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Has certifications
            </span>
          </label>
          
          <label className="flex items-center p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors">
            <input
              type="checkbox"
              checked={filters.endorsed}
              onChange={(e) => actions.applyFilters({ endorsed: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <CheckCircle className="w-4 h-4 ml-2 mr-2 text-cyan-400" />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Has endorsements
            </span>
          </label>
          
          <label className="flex items-center p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-colors">
            <input
              type="checkbox"
              checked={filters.recentlyActive}
              onChange={(e) => actions.applyFilters({ recentlyActive: e.target.checked })}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <Clock className="w-4 h-4 ml-2 mr-2 text-amber-400" />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Active in last 7 days
            </span>
          </label>
        </div>
      </div>
      
      {/* Confidence Range */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">
          Minimum Confidence
        </h3>
        
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minConfidence}
            onChange={(e) => actions.applyFilters({ minConfidence: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">0%</span>
            <span className="text-indigo-400 font-bold">
              {filters.minConfidence}%+
            </span>
            <span className="text-slate-400">100%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
