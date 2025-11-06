/**
 * Talent Search Context
 * 
 * Global state management for talent search including filters,
 * results, pagination, and search actions.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  TalentSearchState,
  TalentSearchActions,
  TalentSearchFilters,
  TalentSearchResults,
  TalentProfile,
  SortOption,
  SortField,
  DEFAULT_FILTERS,
  VerificationStatus,
  AvailabilityStatus,
  ExperienceLevel,
  getExperienceLevel
} from '../types/talent-search.types';

// ============================================================================
// Context Definition
// ============================================================================

interface TalentSearchContextValue {
  state: TalentSearchState;
  actions: TalentSearchActions;
}

const TalentSearchContext = createContext<TalentSearchContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

export const useTalentSearch = () => {
  const context = useContext(TalentSearchContext);
  if (!context) {
    throw new Error('useTalentSearch must be used within TalentSearchProvider');
  }
  return context;
};

// ============================================================================
// Provider Component
// ============================================================================

interface TalentSearchProviderProps {
  children: ReactNode;
}

export const TalentSearchProvider = ({ children }: TalentSearchProviderProps) => {
  // Initialize mock data
  const mockTalents = useMemo(() => generateMockTalents(), []);
  
  // State
  const [filters, setFilters] = useState<TalentSearchFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>({
    field: SortField.RELEVANCE,
    direction: 'desc'
  });
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Apply filters and get results
  const getFilteredResults = useCallback((): TalentSearchResults => {
    let filtered = [...mockTalents];
    
    // Text search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.title.toLowerCase().includes(query) ||
        t.skills.some(s => s.name.toLowerCase().includes(query)) ||
        t.domains.some(d => d.toLowerCase().includes(query))
      );
    }
    
    // Domain filter
    if (filters.domains.length > 0) {
      filtered = filtered.filter(t =>
        filters.domains.some(d => t.domains.includes(d))
      );
    }
    
    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(t =>
        filters.skills.some(s => t.skills.some(ts => ts.name === s))
      );
    }
    
    // Experience level filter
    if (filters.experienceLevels.length > 0) {
      filtered = filtered.filter(t => {
        const level = getExperienceLevel(t.experience.totalYears);
        return filters.experienceLevels.includes(level);
      });
    }
    
    // Region filter
    if (filters.regions.length > 0) {
      filtered = filtered.filter(t =>
        filters.regions.some(r => t.location.region === r)
      );
    }
    
    // Country filter
    if (filters.countries.length > 0) {
      filtered = filtered.filter(t =>
        filters.countries.includes(t.location.country)
      );
    }
    
    // Experience range
    filtered = filtered.filter(t =>
      t.experience.totalYears >= filters.minExperience &&
      t.experience.totalYears <= filters.maxExperience
    );
    
    // Confidence range
    filtered = filtered.filter(t =>
      t.confidenceScore >= filters.minConfidence
    );
    
    // Availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(t =>
        filters.availability.includes(t.availability)
      );
    }
    
    // Verification status filter
    if (filters.verificationStatus.length > 0) {
      filtered = filtered.filter(t =>
        filters.verificationStatus.includes(t.verificationStatus)
      );
    }
    
    // Remote filter
    if (filters.remote !== null) {
      filtered = filtered.filter(t => t.location.remote === filters.remote);
    }
    
    // Open to opportunities filter
    if (filters.openToOpportunities !== null) {
      filtered = filtered.filter(t => t.openToOpportunities === filters.openToOpportunities);
    }
    
    // Hourly rate filter
    if (filters.hourlyRateRange) {
      filtered = filtered.filter(t =>
        t.hourlyRate &&
        t.hourlyRate >= filters.hourlyRateRange!.min &&
        t.hourlyRate <= filters.hourlyRateRange!.max
      );
    }
    
    // Special filters
    if (filters.trending) {
      filtered = filtered.filter(t => t.skills.some(s => s.trending));
    }
    if (filters.certified) {
      filtered = filtered.filter(t => t.certificationsCount > 0);
    }
    if (filters.endorsed) {
      filtered = filtered.filter(t => t.endorsementCount > 0);
    }
    if (filters.recentlyActive) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(t => new Date(t.lastActive) > sevenDaysAgo);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      const direction = sortBy.direction === 'asc' ? 1 : -1;
      
      switch (sortBy.field) {
        case SortField.CONFIDENCE:
          return (a.confidenceScore - b.confidenceScore) * direction;
        case SortField.EXPERIENCE:
          return (a.experience.totalYears - b.experience.totalYears) * direction;
        case SortField.RECENT_ACTIVITY:
          return (new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()) * direction;
        case SortField.PROFILE_COMPLETENESS:
          return (a.profileCompleteness - b.profileCompleteness) * direction;
        case SortField.HOURLY_RATE:
          return ((a.hourlyRate || 0) - (b.hourlyRate || 0)) * direction;
        case SortField.RELEVANCE:
        default:
          // Relevance: weighted combination of confidence, verification, completeness
          const scoreA = a.confidenceScore * 0.4 + a.profileCompleteness * 0.3 + (a.verified ? 30 : 0);
          const scoreB = b.confidenceScore * 0.4 + b.profileCompleteness * 0.3 + (b.verified ? 30 : 0);
          return (scoreA - scoreB) * direction;
      }
    });
    
    // Calculate aggregations
    const aggregations = {
      domainCounts: {} as Record<string, number>,
      skillCounts: {} as Record<string, number>,
      experienceLevelCounts: {} as Record<ExperienceLevel, number>,
      regionCounts: {} as Record<string, number>,
      availabilityCounts: {} as Record<AvailabilityStatus, number>
    };
    
    filtered.forEach(t => {
      // Domains
      t.domains.forEach(d => {
        aggregations.domainCounts[d] = (aggregations.domainCounts[d] || 0) + 1;
      });
      
      // Skills
      t.skills.forEach(s => {
        aggregations.skillCounts[s.name] = (aggregations.skillCounts[s.name] || 0) + 1;
      });
      
      // Experience levels
      const level = getExperienceLevel(t.experience.totalYears);
      aggregations.experienceLevelCounts[level] = (aggregations.experienceLevelCounts[level] || 0) + 1;
      
      // Regions
      aggregations.regionCounts[t.location.region] = (aggregations.regionCounts[t.location.region] || 0) + 1;
      
      // Availability
      aggregations.availabilityCounts[t.availability] = (aggregations.availabilityCounts[t.availability] || 0) + 1;
    });
    
    // Pagination
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedTalents = filtered.slice(start, end);
    
    return {
      talents: paginatedTalents,
      totalCount: mockTalents.length,
      filteredCount: filtered.length,
      page: currentPage,
      pageSize,
      hasMore: end < filtered.length,
      aggregations
    };
  }, [mockTalents, filters, sortBy, currentPage, pageSize]);
  
  const results = useMemo(() => getFilteredResults(), [getFilteredResults]);
  
  // Actions
  const search = useCallback((query: string) => {
    setIsSearching(true);
    setFilters(prev => ({ ...prev, searchQuery: query }));
    setCurrentPage(1);
    setTimeout(() => setIsSearching(false), 300);
  }, []);
  
  const applyFilters = useCallback((newFilters: Partial<TalentSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);
  
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, []);
  
  const setSortByAction = useCallback((sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  }, []);
  
  const nextPage = useCallback(() => {
    if (results.hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [results.hasMore]);
  
  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);
  
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const selectTalent = useCallback((talent: TalentProfile | null) => {
    setSelectedTalent(talent);
  }, []);
  
  const viewTalentProfile = useCallback((talentId: string) => {
    const talent = mockTalents.find(t => t.id === talentId);
    if (talent) {
      setSelectedTalent(talent);
      // Navigate to profile page (implement later)
      console.log('Navigate to profile:', talentId);
    }
  }, [mockTalents]);
  
  const setViewModeAction = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);
  
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);
  
  const refreshResults = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  const exportResults = useCallback((format: 'json' | 'csv') => {
    const data = results.talents;
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `talent-search-${Date.now()}.json`;
      a.click();
    } else {
      // CSV export
      const headers = ['Name', 'Title', 'Experience', 'Confidence', 'Location', 'Availability'];
      const rows = data.map(t => [
        t.name,
        t.title,
        `${t.experience.totalYears} years`,
        `${t.confidenceScore}%`,
        `${t.location.city}, ${t.location.country}`,
        t.availability
      ]);
      
      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `talent-search-${Date.now()}.csv`;
      a.click();
    }
  }, [results.talents]);
  
  // Context value
  const value: TalentSearchContextValue = {
    state: {
      results,
      selectedTalent,
      filters,
      sortBy,
      isLoading,
      isSearching,
      error,
      currentPage,
      pageSize,
      viewMode,
      showFilters
    },
    actions: {
      search,
      applyFilters,
      resetFilters,
      setSortBy: setSortByAction,
      nextPage,
      previousPage,
      goToPage,
      selectTalent,
      viewTalentProfile,
      setViewMode: setViewModeAction,
      toggleFilters,
      refreshResults,
      exportResults
    }
  };
  
  return (
    <TalentSearchContext.Provider value={value}>
      {children}
    </TalentSearchContext.Provider>
  );
};

// ============================================================================
// Mock Data Generator
// ============================================================================

function generateMockTalents(): TalentProfile[] {
  const talents: TalentProfile[] = [];
  
  const names = [
    'Sarah Chen', 'Marcus Johnson', 'Priya Patel', 'Alex Rodriguez', 'Emma Wilson',
    'David Kim', 'Sofia Garcia', 'James Anderson', 'Olivia Martinez', 'Michael Brown',
    'Isabella Lee', 'Daniel Taylor', 'Ava Thomas', 'Christopher White', 'Mia Harris',
    'Andrew Clark', 'Charlotte Lewis', 'Joshua Walker', 'Amelia Hall', 'Ryan Allen'
  ];
  
  const titles = [
    'Senior Frontend Developer', 'Full Stack Engineer', 'Backend Developer', 
    'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer',
    'UI/UX Designer', 'Cloud Architect', 'Mobile Developer', 'Product Engineer'
  ];
  
  const cities = ['San Francisco', 'New York', 'London', 'Singapore', 'Berlin', 'Tokyo', 'Toronto', 'Sydney'];
  const countries = ['USA', 'UK', 'Singapore', 'Germany', 'Japan', 'Canada', 'Australia'];
  const regions = ['North America', 'Europe', 'Asia', 'Oceania'];
  
  const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Stripe', 'Shopify'];
  
  for (let i = 0; i < 50; i++) {
    const yearsExperience = Math.floor(Math.random() * 15) + 1;
    const verified = Math.random() > 0.3;
    const endorsementCount = Math.floor(Math.random() * 50);
    const certificationsCount = Math.floor(Math.random() * 8);
    
    talents.push({
      id: `talent-${i + 1}`,
      userId: `user-${i + 1}`,
      name: names[i % names.length],
      title: titles[Math.floor(Math.random() * titles.length)],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      location: {
        city: cities[Math.floor(Math.random() * cities.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        remote: Math.random() > 0.5
      },
      experience: {
        totalYears: yearsExperience,
        currentRole: titles[Math.floor(Math.random() * titles.length)],
        currentCompany: companies[Math.floor(Math.random() * companies.length)],
        previousRoles: [
          {
            title: 'Software Engineer',
            company: companies[Math.floor(Math.random() * companies.length)],
            duration: 24
          }
        ]
      },
      skills: generateMockSkills(),
      topSkills: generateMockSkills().slice(0, 6),
      domains: selectRandomDomains(),
      confidenceScore: Math.floor(Math.random() * 40) + 60, // 60-100
      verificationStatus: verified ? VerificationStatus.FULLY_VERIFIED : VerificationStatus.PENDING,
      endorsementCount,
      certificationsCount,
      availability: Object.values(AvailabilityStatus)[Math.floor(Math.random() * 4)],
      hourlyRate: Math.floor(Math.random() * 100) + 50,
      openToOpportunities: Math.random() > 0.4,
      preferredRoles: [titles[0], titles[1]],
      profileCompleteness: Math.floor(Math.random() * 30) + 70,
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      verified
    });
  }
  
  return talents;
}

function generateMockSkills() {
  const allSkills = [
    { name: 'React', category: 'Frontend', domain: 'Frontend Development' },
    { name: 'TypeScript', category: 'Language', domain: 'Frontend Development' },
    { name: 'Node.js', category: 'Backend', domain: 'Backend Development' },
    { name: 'Python', category: 'Language', domain: 'Backend Development' },
    { name: 'AWS', category: 'Cloud', domain: 'Cloud Platforms' },
    { name: 'Docker', category: 'DevOps', domain: 'DevOps & Infrastructure' },
    { name: 'Kubernetes', category: 'DevOps', domain: 'DevOps & Infrastructure' },
    { name: 'PostgreSQL', category: 'Database', domain: 'Backend Development' },
    { name: 'MongoDB', category: 'Database', domain: 'Backend Development' },
    { name: 'GraphQL', category: 'API', domain: 'Backend Development' },
    { name: 'TensorFlow', category: 'ML', domain: 'AI & Machine Learning' },
    { name: 'PyTorch', category: 'ML', domain: 'AI & Machine Learning' }
  ];
  
  const count = Math.floor(Math.random() * 6) + 6; // 6-12 skills
  const selected = [];
  
  for (let i = 0; i < count; i++) {
    const skill = allSkills[Math.floor(Math.random() * allSkills.length)];
    const proficiency = Math.floor(Math.random() * 40) + 60;
    
    selected.push({
      id: `skill-${i}`,
      skillId: `skill-${i}`,
      name: skill.name,
      category: skill.category,
      domain: skill.domain,
      proficiency,
      proficiencyLevel: getProficiencyLevel(proficiency),
      yearsExperience: Math.floor(Math.random() * 10) + 1,
      projectsUsed: Math.floor(Math.random() * 20) + 5,
      verified: Math.random() > 0.4,
      endorsements: Math.floor(Math.random() * 15),
      certifications: Math.random() > 0.7 ? 1 : 0,
      trending: Math.random() > 0.8
    });
  }
  
  return selected;
}

function selectRandomDomains(): string[] {
  const domains = [
    'Frontend Development',
    'Backend Development',
    'DevOps & Infrastructure',
    'Cloud Platforms',
    'AI & Machine Learning',
    'Mobile Development'
  ];
  
  const count = Math.floor(Math.random() * 3) + 2; // 2-4 domains
  const selected: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    if (!selected.includes(domain)) {
      selected.push(domain);
    }
  }
  
  return selected;
}

function getProficiencyLevel(proficiency: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (proficiency < 25) return 'beginner';
  if (proficiency < 50) return 'intermediate';
  if (proficiency < 75) return 'advanced';
  return 'expert';
}
