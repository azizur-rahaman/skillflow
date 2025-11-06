/**
 * Talent Search Page
 * 
 * Main recruitment dashboard for searching and filtering talent profiles
 * based on skills, experience, location, and confidence scores.
 */

'use client';

import { TalentSearchProvider, useTalentSearch } from '@/features/talent-search/context/TalentSearchContext';
import { FilterPanel } from '@/features/talent-search/presentation/components/FilterPanel';
import { SearchBar } from '@/features/talent-search/presentation/components/SearchBar';
import { TalentCard } from '@/features/talent-search/presentation/components/TalentCard';
import { Users, Search as SearchIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const TalentSearchContent = () => {
  const { state, actions } = useTalentSearch();
  const { results, isLoading, showFilters, currentPage, viewMode } = state;
  
  const totalPages = results ? Math.ceil(results.filteredCount / results.pageSize) : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Talent Search
              </h1>
              <p className="text-sm text-slate-400">
                Find the perfect candidates based on live Skill DNA and confidence scores
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <SearchBar />
      
      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filter Panel */}
          {showFilters && (
            <div className="animate-fade-in">
              <FilterPanel />
            </div>
          )}
          
          {/* Results */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              // Loading State
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400">Loading talents...</p>
                </div>
              </div>
            ) : results && results.talents.length > 0 ? (
              // Results Grid/List
              <>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {results.talents.map((talent, index) => (
                    <div
                      key={talent.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TalentCard
                        talent={talent}
                        onViewProfile={actions.viewTalentProfile}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      onClick={actions.previousPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:border-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => actions.goToPage(page)}
                            className={`w-10 h-10 rounded-lg transition-all ${
                              currentPage === page
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-indigo-700 hover:text-white'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="text-slate-500">...</span>
                          <button
                            onClick={() => actions.goToPage(totalPages)}
                            className={`w-10 h-10 rounded-lg transition-all ${
                              currentPage === totalPages
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-indigo-700 hover:text-white'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={actions.nextPage}
                      disabled={!results.hasMore}
                      className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:border-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <SearchIcon className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No talents found
                </h3>
                <p className="text-slate-400 mb-6 max-w-md">
                  Try adjusting your filters or search criteria to find more candidates.
                </p>
                <button
                  onClick={actions.resetFilters}
                  className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-medium hover:brightness-110 transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default function TalentSearchPage() {
  return (
    <TalentSearchProvider>
      <TalentSearchContent />
    </TalentSearchProvider>
  );
}
