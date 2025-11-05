'use client';

/**
 * Trending Skills Context
 * Manages state for the trending skills leaderboard
 * Follows vertical slice architecture pattern
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  TrendingSkill,
  TrendingSkillsFilters,
  TrendingSkillsContextValue,
} from '../types/trending-skills.types';

const TrendingSkillsContext = createContext<TrendingSkillsContextValue | null>(null);

interface TrendingSkillsProviderProps {
  children: React.ReactNode;
  initialSkills?: TrendingSkill[];
}

export function TrendingSkillsProvider({ 
  children, 
  initialSkills = [] 
}: TrendingSkillsProviderProps) {
  const [skills, setSkills] = useState<TrendingSkill[]>(initialSkills);
  const [filters, setFilters] = useState<TrendingSkillsFilters>({
    timeRange: '30d',
    category: 'all',
    industry: 'all',
    sortBy: 'rank',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [totalSkillsTracked, setTotalSkillsTracked] = useState(0);

  /**
   * Fetch trending skills from API
   */
  const fetchTrendingSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        timeRange: filters.timeRange,
        category: filters.category,
        industry: filters.industry,
        sortBy: filters.sortBy || 'rank',
      });

      if (filters.searchQuery) {
        params.append('search', filters.searchQuery);
      }

      const response = await fetch(`/api/skills/trending?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending skills');
      }

      const data = await response.json();
      
      setSkills(data.skills);
      setLastUpdated(data.lastUpdated);
      setTotalSkillsTracked(data.totalSkillsTracked);
      setHasMore(data.hasMore ?? false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching trending skills:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Update filters and trigger data refresh
   */
  const updateFilters = useCallback((newFilters: Partial<TrendingSkillsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Refresh data manually
   */
  const refreshData = useCallback(async () => {
    await fetchTrendingSkills();
  }, [fetchTrendingSkills]);

  /**
   * Load more skills (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    // Implementation would append to existing skills
    // For now, just a placeholder
    console.log('Load more skills...');
  }, [hasMore, isLoading]);

  // Fetch data when filters change
  useEffect(() => {
    fetchTrendingSkills();
  }, [fetchTrendingSkills]);

  const value: TrendingSkillsContextValue = {
    skills,
    filters,
    isLoading,
    error,
    updateFilters,
    refreshData,
    loadMore,
    hasMore,
    lastUpdated,
    totalSkillsTracked,
  };

  return (
    <TrendingSkillsContext.Provider value={value}>
      {children}
    </TrendingSkillsContext.Provider>
  );
}

/**
 * Hook to access trending skills context
 */
export function useTrendingSkills() {
  const context = useContext(TrendingSkillsContext);
  
  if (!context) {
    throw new Error('useTrendingSkills must be used within TrendingSkillsProvider');
  }
  
  return context;
}
