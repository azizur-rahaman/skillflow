/**
 * Marketplace Types
 * 
 * Type definitions for the skill token marketplace.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Skill categories
 */
export enum SkillCategory {
  Development = 'Development',
  Design = 'Design',
  DataScience = 'Data Science',
  Marketing = 'Marketing',
  Business = 'Business',
  Finance = 'Finance',
  Education = 'Education',
  Engineering = 'Engineering',
  Healthcare = 'Healthcare',
  Creative = 'Creative',
  All = 'All',
}

/**
 * Listing status
 */
export enum ListingStatus {
  Active = 'Active',
  Sold = 'Sold',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

/**
 * Purchase status
 */
export enum PurchaseStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded',
}

/**
 * Sort options
 */
export enum SortOption {
  PriceLowToHigh = 'Price: Low to High',
  PriceHighToLow = 'Price: High to Low',
  RatingHighToLow = 'Rating: High to Low',
  PopularityHighToLow = 'Most Popular',
  Newest = 'Newest First',
  Oldest = 'Oldest First',
}

/**
 * Price range
 */
export enum PriceRange {
  All = 'All Prices',
  Free = 'Free',
  Under10 = 'Under 10 FLOW',
  Under50 = 'Under 50 FLOW',
  Under100 = 'Under 100 FLOW',
  Above100 = 'Above 100 FLOW',
}

// ============================================================================
// Core Interfaces
// ============================================================================

/**
 * Seller information
 */
export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  walletAddress: string;
  rating: number; // 0-5
  totalSales: number;
  memberSince: Date;
  verified: boolean;
}

/**
 * Skill listing
 */
export interface SkillListing {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  category: SkillCategory;
  image: string;
  price: number; // In FLOW tokens
  priceUSD: number;
  seller: Seller;
  rating: number; // 0-5
  totalReviews: number;
  totalPurchases: number;
  createdAt: Date;
  updatedAt: Date;
  status: ListingStatus;
  tags: string[];
  level?: string; // Beginner, Intermediate, Advanced, Expert
  duration?: string; // Time to master
  metadata?: ListingMetadata;
}

/**
 * Listing metadata
 */
export interface ListingMetadata {
  skillDomain?: string;
  prerequisites?: string[];
  outcomes?: string[];
  certificationType?: string;
  validityPeriod?: string;
  [key: string]: any;
}

/**
 * Purchase record
 */
export interface Purchase {
  id: string;
  listingId: string;
  listing: SkillListing;
  buyerId: string;
  sellerId: string;
  price: number;
  priceUSD: number;
  transactionHash: string;
  status: PurchaseStatus;
  purchasedAt: Date;
  completedAt?: Date;
}

/**
 * Review
 */
export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  helpful: number; // Helpful count
}

/**
 * Shopping cart item
 */
export interface CartItem {
  listing: SkillListing;
  quantity: number; // Usually 1 for NFTs
  addedAt: Date;
}

/**
 * Marketplace filter
 */
export interface MarketplaceFilter {
  category: SkillCategory;
  priceRange: PriceRange;
  minRating: number;
  verified: boolean;
  searchQuery: string;
  tags: string[];
}

/**
 * Marketplace summary
 */
export interface MarketplaceSummary {
  totalListings: number;
  activeListings: number;
  totalVolume: number; // Total FLOW
  totalVolumeUSD: number;
  averagePrice: number;
  topCategories: Array<{
    category: SkillCategory;
    count: number;
  }>;
  featuredListings: SkillListing[];
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * SkillCard component props
 */
export interface SkillCardProps {
  listing: SkillListing;
  onCardClick?: (listing: SkillListing) => void;
  onAddToCart?: (listing: SkillListing) => void;
  onBuyNow?: (listing: SkillListing) => void;
  inCart?: boolean;
}

/**
 * CategoryFilter component props
 */
export interface CategoryFilterProps {
  categories: SkillCategory[];
  selectedCategory: SkillCategory;
  onChange: (category: SkillCategory) => void;
  counts?: Record<SkillCategory, number>;
}

/**
 * SearchBar component props
 */
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

/**
 * SortDropdown component props
 */
export interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
  options?: SortOption[];
}

/**
 * PriceFilter component props
 */
export interface PriceFilterProps {
  selectedRange: PriceRange;
  onChange: (range: PriceRange) => void;
}

/**
 * SkillGrid component props
 */
export interface SkillGridProps {
  listings: SkillListing[];
  loading?: boolean;
  onCardClick?: (listing: SkillListing) => void;
  onAddToCart?: (listing: SkillListing) => void;
  onBuyNow?: (listing: SkillListing) => void;
  cartItems?: string[]; // Array of listing IDs
}

/**
 * Cart component props
 */
export interface CartProps {
  items: CartItem[];
  onRemove: (listingId: string) => void;
  onCheckout: () => void;
  onClear: () => void;
}

// ============================================================================
// Context State
// ============================================================================

/**
 * MarketplaceContext state
 */
export interface MarketplaceContextState {
  // Data
  listings: SkillListing[];
  summary: MarketplaceSummary | null;
  cart: CartItem[];
  purchases: Purchase[];
  
  // Filters & Sort
  filter: MarketplaceFilter;
  sortOption: SortOption;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Methods
  fetchListings: () => Promise<void>;
  updateFilter: (filter: Partial<MarketplaceFilter>) => void;
  updateSort: (option: SortOption) => void;
  resetFilters: () => void;
  
  // Cart operations
  addToCart: (listing: SkillListing) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  
  // Purchase operations
  buyNow: (listing: SkillListing) => Promise<void>;
  checkout: () => Promise<void>;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get category icon
 */
export function getCategoryIcon(category: SkillCategory): string {
  const icons: Record<SkillCategory, string> = {
    [SkillCategory.Development]: '💻',
    [SkillCategory.Design]: '🎨',
    [SkillCategory.DataScience]: '📊',
    [SkillCategory.Marketing]: '📱',
    [SkillCategory.Business]: '💼',
    [SkillCategory.Finance]: '💰',
    [SkillCategory.Education]: '📚',
    [SkillCategory.Engineering]: '⚙️',
    [SkillCategory.Healthcare]: '🏥',
    [SkillCategory.Creative]: '✨',
    [SkillCategory.All]: '🌐',
  };
  return icons[category] || '📦';
}

/**
 * Get category color
 */
export function getCategoryColor(category: SkillCategory): string {
  const colors: Record<SkillCategory, string> = {
    [SkillCategory.Development]: '#6366F1', // Indigo
    [SkillCategory.Design]: '#A855F7', // Purple
    [SkillCategory.DataScience]: '#22D3EE', // Cyan
    [SkillCategory.Marketing]: '#EC4899', // Pink
    [SkillCategory.Business]: '#F59E0B', // Amber
    [SkillCategory.Finance]: '#10B981', // Emerald
    [SkillCategory.Education]: '#3B82F6', // Blue
    [SkillCategory.Engineering]: '#8B5CF6', // Violet
    [SkillCategory.Healthcare]: '#EF4444', // Red
    [SkillCategory.Creative]: '#F97316', // Orange
    [SkillCategory.All]: '#64748B', // Slate
  };
  return colors[category] || '#6366F1';
}

/**
 * Format price
 */
export function formatPrice(price: number, decimals: number = 2): string {
  return price.toFixed(decimals);
}

/**
 * Format USD price
 */
export function formatUSDPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

/**
 * Format rating
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Get rating stars
 */
export function getRatingStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    '⭐'.repeat(fullStars) +
    (hasHalfStar ? '⭐' : '') +
    '☆'.repeat(emptyStars)
  );
}

/**
 * Format number with K/M suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Get default filter
 */
export function getDefaultFilter(): MarketplaceFilter {
  return {
    category: SkillCategory.All,
    priceRange: PriceRange.All,
    minRating: 0,
    verified: false,
    searchQuery: '',
    tags: [],
  };
}

/**
 * Get default sort option
 */
export function getDefaultSortOption(): SortOption {
  return SortOption.PopularityHighToLow;
}

/**
 * Apply filters to listings
 */
export function applyFilters(
  listings: SkillListing[],
  filter: MarketplaceFilter
): SkillListing[] {
  return listings.filter((listing) => {
    // Category filter
    if (filter.category !== SkillCategory.All && listing.category !== filter.category) {
      return false;
    }
    
    // Price range filter
    if (filter.priceRange !== PriceRange.All) {
      const price = listing.price;
      switch (filter.priceRange) {
        case PriceRange.Free:
          if (price !== 0) return false;
          break;
        case PriceRange.Under10:
          if (price >= 10) return false;
          break;
        case PriceRange.Under50:
          if (price >= 50) return false;
          break;
        case PriceRange.Under100:
          if (price >= 100) return false;
          break;
        case PriceRange.Above100:
          if (price < 100) return false;
          break;
      }
    }
    
    // Rating filter
    if (listing.rating < filter.minRating) {
      return false;
    }
    
    // Verified seller filter
    if (filter.verified && !listing.seller.verified) {
      return false;
    }
    
    // Search query filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesTitle = listing.title.toLowerCase().includes(query);
      const matchesDescription = listing.description.toLowerCase().includes(query);
      const matchesTags = listing.tags.some(tag => tag.toLowerCase().includes(query));
      const matchesSeller = listing.seller.name.toLowerCase().includes(query);
      
      if (!matchesTitle && !matchesDescription && !matchesTags && !matchesSeller) {
        return false;
      }
    }
    
    // Tags filter
    if (filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some(tag =>
        listing.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }
    
    return true;
  });
}

/**
 * Apply sort to listings
 */
export function applySort(
  listings: SkillListing[],
  sortOption: SortOption
): SkillListing[] {
  const sorted = [...listings];
  
  switch (sortOption) {
    case SortOption.PriceLowToHigh:
      return sorted.sort((a, b) => a.price - b.price);
    
    case SortOption.PriceHighToLow:
      return sorted.sort((a, b) => b.price - a.price);
    
    case SortOption.RatingHighToLow:
      return sorted.sort((a, b) => b.rating - a.rating);
    
    case SortOption.PopularityHighToLow:
      return sorted.sort((a, b) => b.totalPurchases - a.totalPurchases);
    
    case SortOption.Newest:
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    case SortOption.Oldest:
      return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    default:
      return sorted;
  }
}

/**
 * Calculate marketplace summary
 */
export function calculateSummary(listings: SkillListing[]): MarketplaceSummary {
  const activeListings = listings.filter(l => l.status === ListingStatus.Active);
  
  const totalVolume = activeListings.reduce((sum, l) => sum + (l.price * l.totalPurchases), 0);
  const totalVolumeUSD = activeListings.reduce((sum, l) => sum + (l.priceUSD * l.totalPurchases), 0);
  const averagePrice = activeListings.length > 0
    ? activeListings.reduce((sum, l) => sum + l.price, 0) / activeListings.length
    : 0;
  
  // Category counts
  const categoryCounts = new Map<SkillCategory, number>();
  activeListings.forEach(listing => {
    const count = categoryCounts.get(listing.category) || 0;
    categoryCounts.set(listing.category, count + 1);
  });
  
  const topCategories = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Featured listings (highest rated with most purchases)
  const featuredListings = [...activeListings]
    .sort((a, b) => {
      const scoreA = a.rating * 0.6 + (a.totalPurchases / 100) * 0.4;
      const scoreB = b.rating * 0.6 + (b.totalPurchases / 100) * 0.4;
      return scoreB - scoreA;
    })
    .slice(0, 6);
  
  return {
    totalListings: listings.length,
    activeListings: activeListings.length,
    totalVolume,
    totalVolumeUSD,
    averagePrice,
    topCategories,
    featuredListings,
  };
}
