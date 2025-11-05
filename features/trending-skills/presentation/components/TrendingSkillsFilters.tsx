'use client';

/**
 * TrendingSkillsFilters Component
 * Category dropdowns, time range selector, industry filters
 * Professional feel with energetic accents
 */

import React from 'react';
import { Search, Filter, Clock, Briefcase, Grid3x3 } from 'lucide-react';
import type { 
  TrendTimeRange, 
  SkillCategory, 
  Industry,
  TrendingSkillsFilters as FilterType
} from '../../types/trending-skills.types';

interface TrendingSkillsFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
  totalResults?: number;
}

export function TrendingSkillsFilters({
  filters,
  onFilterChange,
  totalResults,
}: TrendingSkillsFiltersProps) {
  const timeRangeOptions: Array<{ value: TrendTimeRange; label: string }> = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  const categoryOptions: Array<{ value: SkillCategory; label: string }> = [
    { value: 'all', label: 'All Skills' },
    { value: 'programming', label: 'Programming' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ai-ml', label: 'AI & ML' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'devops', label: 'DevOps' },
    { value: 'design', label: 'Design' },
    { value: 'product', label: 'Product' },
    { value: 'business', label: 'Business' },
    { value: 'soft-skills', label: 'Soft Skills' },
  ];

  const industryOptions: Array<{ value: Industry; label: string }> = [
    { value: 'all', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail' },
    { value: 'consulting', label: 'Consulting' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search trending skills..."
          value={filters.searchQuery || ''}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className="
            w-full pl-12 pr-4 py-3 rounded-xl
            bg-[#1E293B] border border-[#334155]
            text-[#F8FAFC] placeholder:text-[#94A3B8]
            focus:outline-none focus:ring-2 focus:ring-[#6366F1]
            transition-all duration-200
          "
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Time Range */}
        <FilterSelect
          icon={<Clock className="w-4 h-4" />}
          value={filters.timeRange}
          onChange={(value) => onFilterChange({ timeRange: value as TrendTimeRange })}
          options={timeRangeOptions}
          label="Time Range"
        />

        {/* Category */}
        <FilterSelect
          icon={<Grid3x3 className="w-4 h-4" />}
          value={filters.category}
          onChange={(value) => onFilterChange({ category: value as SkillCategory })}
          options={categoryOptions}
          label="Category"
        />

        {/* Industry */}
        <FilterSelect
          icon={<Briefcase className="w-4 h-4" />}
          value={filters.industry}
          onChange={(value) => onFilterChange({ industry: value as Industry })}
          options={industryOptions}
          label="Industry"
        />

        {/* Results Count */}
        {totalResults !== undefined && (
          <div className="ml-auto text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalResults}</span> trending skills
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(filters.category !== 'all' || filters.industry !== 'all' || filters.searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Active filters:
          </span>
          {filters.category !== 'all' && (
            <FilterBadge
              label={categoryOptions.find(c => c.value === filters.category)?.label || ''}
              onRemove={() => onFilterChange({ category: 'all' })}
            />
          )}
          {filters.industry !== 'all' && (
            <FilterBadge
              label={industryOptions.find(i => i.value === filters.industry)?.label || ''}
              onRemove={() => onFilterChange({ industry: 'all' })}
            />
          )}
          {filters.searchQuery && (
            <FilterBadge
              label={`"${filters.searchQuery}"`}
              onRemove={() => onFilterChange({ searchQuery: '' })}
            />
          )}
          <button
            onClick={() => onFilterChange({ 
              category: 'all', 
              industry: 'all', 
              searchQuery: '' 
            })}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Filter Select Component
 */
interface FilterSelectProps<T extends string> {
  icon: React.ReactNode;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  label: string;
}

function FilterSelect<T extends string>({
  icon,
  value,
  onChange,
  options,
  label,
}: FilterSelectProps<T>) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="
          appearance-none pl-10 pr-8 py-2.5 rounded-xl
          bg-[#1E293B] border border-[#334155]
          text-sm font-medium text-[#F8FAFC]
          hover:border-[#6366F1]
          focus:outline-none focus:ring-2 focus:ring-[#6366F1]
          transition-all duration-200
          cursor-pointer
        "
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
        {icon}
      </div>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Active Filter Badge
 */
interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
}

function FilterBadge({ label, onRemove }: FilterBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#6366F1]/20 text-[#6366F1] text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-[#F8FAFC] transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  );
}
