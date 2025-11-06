'use client';

/**
 * Marketplace Context
 * 
 * State management for the skill token marketplace.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  MarketplaceContextState,
  SkillListing,
  MarketplaceSummary,
  MarketplaceFilter,
  CartItem,
  Purchase,
  SortOption,
  SkillCategory,
  ListingStatus,
  PurchaseStatus,
  getDefaultFilter,
  getDefaultSortOption,
  applyFilters,
  applySort,
  calculateSummary,
} from '../types/marketplace.types';

// Create context
const MarketplaceContext = createContext<MarketplaceContextState | undefined>(undefined);

/**
 * Marketplace Provider
 */
export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allListings] = useState<SkillListing[]>(getMockListings());
  const [listings, setListings] = useState<SkillListing[]>([]);
  const [summary, setSummary] = useState<MarketplaceSummary | null>(null);
  const [filter, setFilter] = useState<MarketplaceFilter>(getDefaultFilter());
  const [sortOption, setSortOption] = useState<SortOption>(getDefaultSortOption());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch and filter listings
   */
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Apply filters
      let filtered = applyFilters(allListings, filter);

      // Apply sorting
      filtered = applySort(filtered, sortOption);

      setListings(filtered);
      setSummary(calculateSummary(allListings));
    } catch (err) {
      setError('Failed to fetch listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [allListings, filter, sortOption]);

  /**
   * Update filter
   */
  const updateFilter = useCallback((newFilter: Partial<MarketplaceFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  /**
   * Update sort option
   */
  const updateSort = useCallback((option: SortOption) => {
    setSortOption(option);
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setFilter(getDefaultFilter());
    setSortOption(getDefaultSortOption());
  }, []);

  /**
   * Add to cart
   */
  const addToCart = useCallback((listing: SkillListing) => {
    setCart(prev => {
      // Check if already in cart
      const existing = prev.find(item => item.listing.id === listing.id);
      if (existing) {
        return prev; // NFTs are unique, can't add multiple
      }
      return [...prev, { listing, quantity: 1, addedAt: new Date() }];
    });
  }, []);

  /**
   * Remove from cart
   */
  const removeFromCart = useCallback((listingId: string) => {
    setCart(prev => prev.filter(item => item.listing.id !== listingId));
  }, []);

  /**
   * Clear cart
   */
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  /**
   * Buy now (instant purchase)
   */
  const buyNow = useCallback(async (listing: SkillListing) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create purchase record
      const purchase: Purchase = {
        id: `purchase-${Date.now()}`,
        listingId: listing.id,
        listing,
        buyerId: 'current-user-id',
        sellerId: listing.seller.id,
        price: listing.price,
        priceUSD: listing.priceUSD,
        transactionHash: `0x${Math.random().toString(16).slice(2)}`,
        status: PurchaseStatus.Completed,
        purchasedAt: new Date(),
        completedAt: new Date(),
      };

      setPurchases(prev => [purchase, ...prev]);
      
      // Remove from cart if present
      removeFromCart(listing.id);
      
      console.log('Purchase successful:', purchase);
    } catch (err) {
      setError('Purchase failed. Please try again.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [removeFromCart]);

  /**
   * Checkout (purchase all cart items)
   */
  const checkout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate batch purchase
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create purchase records for all cart items
      const newPurchases: Purchase[] = cart.map(item => ({
        id: `purchase-${Date.now()}-${item.listing.id}`,
        listingId: item.listing.id,
        listing: item.listing,
        buyerId: 'current-user-id',
        sellerId: item.listing.seller.id,
        price: item.listing.price,
        priceUSD: item.listing.priceUSD,
        transactionHash: `0x${Math.random().toString(16).slice(2)}`,
        status: PurchaseStatus.Completed,
        purchasedAt: new Date(),
        completedAt: new Date(),
      }));

      setPurchases(prev => [...newPurchases, ...prev]);
      clearCart();
      
      console.log('Checkout successful:', newPurchases);
    } catch (err) {
      setError('Checkout failed. Please try again.');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart, clearCart]);

  // Fetch listings on filter/sort change
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const value: MarketplaceContextState = {
    listings,
    summary,
    cart,
    purchases,
    filter,
    sortOption,
    loading,
    error,
    fetchListings,
    updateFilter,
    updateSort,
    resetFilters,
    addToCart,
    removeFromCart,
    clearCart,
    buyNow,
    checkout,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
};

/**
 * Hook to use marketplace context
 */
export const useMarketplace = (): MarketplaceContextState => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

// ============================================================================
// Mock Data
// ============================================================================

/**
 * Get mock skill listings
 */
function getMockListings(): SkillListing[] {
  const now = new Date();

  return [
    {
      id: '1',
      tokenId: 'token-001',
      title: 'React.js Expert Certification',
      description: 'Master React.js with hooks, context, and advanced patterns. Build production-ready applications.',
      category: SkillCategory.Development,
      image: '/marketplace/react-expert.jpg',
      price: 45.00,
      priceUSD: 67.50,
      seller: {
        id: 'seller-1',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        walletAddress: '0x1234567890abcdef',
        rating: 4.9,
        totalSales: 156,
        memberSince: new Date('2023-01-15'),
        verified: true,
      },
      rating: 4.8,
      totalReviews: 89,
      totalPurchases: 234,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      status: ListingStatus.Active,
      tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
      level: 'Advanced',
      duration: '3-4 months',
    },
    {
      id: '2',
      tokenId: 'token-002',
      title: 'UI/UX Design Mastery',
      description: 'Learn design thinking, prototyping, and user research. Create stunning user experiences.',
      category: SkillCategory.Design,
      image: '/marketplace/ux-design.jpg',
      price: 35.00,
      priceUSD: 52.50,
      seller: {
        id: 'seller-2',
        name: 'Marcus Kim',
        avatar: '/avatars/marcus.jpg',
        walletAddress: '0xabcdef1234567890',
        rating: 4.7,
        totalSales: 98,
        memberSince: new Date('2023-03-20'),
        verified: true,
      },
      rating: 4.9,
      totalReviews: 145,
      totalPurchases: 189,
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      status: ListingStatus.Active,
      tags: ['Figma', 'Design', 'UX', 'Prototyping'],
      level: 'Intermediate',
      duration: '2-3 months',
    },
    {
      id: '3',
      tokenId: 'token-003',
      title: 'Machine Learning Fundamentals',
      description: 'Build ML models with Python, TensorFlow, and scikit-learn. Real-world projects included.',
      category: SkillCategory.DataScience,
      image: '/marketplace/ml-fundamentals.jpg',
      price: 85.00,
      priceUSD: 127.50,
      seller: {
        id: 'seller-3',
        name: 'Dr. Aisha Patel',
        avatar: '/avatars/aisha.jpg',
        walletAddress: '0x9876543210fedcba',
        rating: 5.0,
        totalSales: 234,
        memberSince: new Date('2022-11-10'),
        verified: true,
      },
      rating: 4.95,
      totalReviews: 210,
      totalPurchases: 345,
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      status: ListingStatus.Active,
      tags: ['Python', 'TensorFlow', 'ML', 'AI'],
      level: 'Advanced',
      duration: '4-6 months',
    },
    {
      id: '4',
      tokenId: 'token-004',
      title: 'Digital Marketing Strategy',
      description: 'Master SEO, social media, content marketing, and analytics. Grow your online presence.',
      category: SkillCategory.Marketing,
      image: '/marketplace/digital-marketing.jpg',
      price: 25.00,
      priceUSD: 37.50,
      seller: {
        id: 'seller-4',
        name: 'Jessica Torres',
        avatar: '/avatars/jessica.jpg',
        walletAddress: '0xfedcba9876543210',
        rating: 4.6,
        totalSales: 67,
        memberSince: new Date('2023-05-15'),
        verified: false,
      },
      rating: 4.5,
      totalReviews: 78,
      totalPurchases: 156,
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      status: ListingStatus.Active,
      tags: ['SEO', 'Marketing', 'Social Media', 'Analytics'],
      level: 'Beginner',
      duration: '1-2 months',
    },
    {
      id: '5',
      tokenId: 'token-005',
      title: 'Blockchain Development',
      description: 'Build decentralized apps with Solidity and Web3.js. Deploy smart contracts on Ethereum.',
      category: SkillCategory.Development,
      image: '/marketplace/blockchain-dev.jpg',
      price: 95.00,
      priceUSD: 142.50,
      seller: {
        id: 'seller-1',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        walletAddress: '0x1234567890abcdef',
        rating: 4.9,
        totalSales: 156,
        memberSince: new Date('2023-01-15'),
        verified: true,
      },
      rating: 4.85,
      totalReviews: 134,
      totalPurchases: 298,
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      status: ListingStatus.Active,
      tags: ['Blockchain', 'Solidity', 'Web3', 'Ethereum'],
      level: 'Expert',
      duration: '5-6 months',
    },
    {
      id: '6',
      tokenId: 'token-006',
      title: 'Financial Analysis & Modeling',
      description: 'Excel in financial modeling, valuation, and investment analysis. CFA-aligned curriculum.',
      category: SkillCategory.Finance,
      image: '/marketplace/financial-analysis.jpg',
      price: 55.00,
      priceUSD: 82.50,
      seller: {
        id: 'seller-5',
        name: 'David Zhang',
        avatar: '/avatars/david.jpg',
        walletAddress: '0x567890abcdef1234',
        rating: 4.8,
        totalSales: 112,
        memberSince: new Date('2023-02-28'),
        verified: true,
      },
      rating: 4.75,
      totalReviews: 95,
      totalPurchases: 178,
      createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      status: ListingStatus.Active,
      tags: ['Finance', 'Excel', 'Valuation', 'Analysis'],
      level: 'Advanced',
      duration: '3-4 months',
    },
    {
      id: '7',
      tokenId: 'token-007',
      title: 'Data Visualization with D3.js',
      description: 'Create stunning interactive visualizations. Master D3.js from basics to advanced techniques.',
      category: SkillCategory.DataScience,
      image: '/marketplace/d3-visualization.jpg',
      price: 40.00,
      priceUSD: 60.00,
      seller: {
        id: 'seller-2',
        name: 'Marcus Kim',
        avatar: '/avatars/marcus.jpg',
        walletAddress: '0xabcdef1234567890',
        rating: 4.7,
        totalSales: 98,
        memberSince: new Date('2023-03-20'),
        verified: true,
      },
      rating: 4.7,
      totalReviews: 67,
      totalPurchases: 123,
      createdAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      status: ListingStatus.Active,
      tags: ['D3.js', 'Visualization', 'JavaScript', 'Charts'],
      level: 'Intermediate',
      duration: '2-3 months',
    },
    {
      id: '8',
      tokenId: 'token-008',
      title: 'Business Strategy & Operations',
      description: 'Learn strategic planning, operations management, and business process optimization.',
      category: SkillCategory.Business,
      image: '/marketplace/business-strategy.jpg',
      price: 50.00,
      priceUSD: 75.00,
      seller: {
        id: 'seller-6',
        name: 'Emma Wilson',
        avatar: '/avatars/emma.jpg',
        walletAddress: '0xabcd1234567890ef',
        rating: 4.85,
        totalSales: 145,
        memberSince: new Date('2023-01-05'),
        verified: true,
      },
      rating: 4.8,
      totalReviews: 102,
      totalPurchases: 201,
      createdAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      status: ListingStatus.Active,
      tags: ['Strategy', 'Business', 'Operations', 'Management'],
      level: 'Advanced',
      duration: '3-4 months',
    },
  ];
}
