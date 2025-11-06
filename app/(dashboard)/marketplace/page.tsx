'use client';

/**
 * Marketplace Page
 * 
 * Skill token marketplace with grid layout, filters, search, and sort.
 */

import React from 'react';
import { ShoppingBag, TrendingUp, Filter, X } from 'lucide-react';
import { MarketplaceProvider, useMarketplace } from '@/features/marketplace/context/MarketplaceContext';
import {
  SkillCard,
  CategoryFilter,
  SearchBar,
  SortDropdown,
} from '@/features/marketplace/presentation/components';
import { SkillCategory, formatUSDPrice, formatNumber } from '@/features/marketplace/types/marketplace.types';

/**
 * Marketplace Content
 */
const MarketplaceContent: React.FC = () => {
  const {
    listings,
    summary,
    cart,
    filter,
    sortOption,
    loading,
    error,
    updateFilter,
    updateSort,
    resetFilters,
    addToCart,
    buyNow,
  } = useMarketplace();

  const cartItemIds = cart.map(item => item.listing.id);
  const totalCartValue = cart.reduce((sum, item) => sum + item.listing.price, 0);

  // Get category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Partial<Record<SkillCategory, number>> = {};
    
    if (summary) {
      summary.topCategories.forEach(({ category, count }) => {
        counts[category] = count;
      });
    }
    
    // Add "All" count
    counts[SkillCategory.All] = summary?.activeListings || 0;
    
    return counts as Record<SkillCategory, number>;
  }, [summary]);

  const hasActiveFilters = filter.category !== SkillCategory.All || filter.searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <div className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-indigo-400" />
                Skill Marketplace
              </h1>
              <p className="text-slate-400">
                Explore and purchase tokenized skills from verified experts
              </p>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="flex items-center gap-4 px-6 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                <div>
                  <div className="text-sm text-indigo-400 font-medium">Cart</div>
                  <div className="text-lg font-bold text-white">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
                <div className="h-10 w-px bg-indigo-500/30" />
                <div>
                  <div className="text-sm text-indigo-400 font-medium">Total</div>
                  <div className="text-lg font-bold text-white">
                    {totalCartValue.toFixed(2)} FLOW
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <SearchBar
            value={filter.searchQuery}
            onChange={(value) => updateFilter({ searchQuery: value })}
            placeholder="Search skills, sellers, or categories..."
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Stats Bar */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800/50 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-slate-400">Active Listings</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatNumber(summary.activeListings)}</div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800/50 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm font-medium text-slate-400">Total Volume</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatUSDPrice(summary.totalVolumeUSD)}</div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800/50 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                  <span className="text-lg">💰</span>
                </div>
                <span className="text-sm font-medium text-slate-400">Average Price</span>
              </div>
              <div className="text-2xl font-bold text-white">{summary.averagePrice.toFixed(0)} FLOW</div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800/50 p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                  <span className="text-lg">🎓</span>
                </div>
                <span className="text-sm font-medium text-slate-400">Total Listings</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatNumber(summary.totalListings)}</div>
            </div>
          </div>
        )}

        {/* Filters & Sort */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Categories</h2>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                )}
              </div>
              <CategoryFilter
                categories={Object.values(SkillCategory)}
                selectedCategory={filter.category}
                onChange={(category) => updateFilter({ category })}
                counts={categoryCounts}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex-shrink-0">
              <div className="text-sm font-medium text-slate-400 mb-3">Sort by</div>
              <SortDropdown value={sortOption} onChange={updateSort} />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-400">
            Showing <span className="font-semibold text-white">{listings.length}</span> skill{listings.length !== 1 ? 's' : ''}
            {filter.searchQuery && (
              <span> matching "<span className="text-indigo-400">{filter.searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Skill Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-800/50 rounded-2xl h-96"></div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <SkillCard
                key={listing.id}
                listing={listing}
                onCardClick={(listing) => {
                  console.log('Card clicked:', listing);
                }}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
                inCart={cartItemIds.includes(listing.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-slate-800/50 border border-slate-700/50">
              <ShoppingBag className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No skills found</h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your filters or search query
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/30 transition-all font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Marketplace Page (with Provider)
 */
export default function MarketplacePage() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}
