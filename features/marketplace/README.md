# Skill Marketplace Feature

## Overview

The Skill Marketplace is a beautiful, futuristic marketplace for buying and selling tokenized skills. Users can explore verified skill credentials, filter by category, search for specific skills, and make instant purchases using FLOW tokens.

## Features

### 🎯 Core Functionality

- **Skill Discovery**: Browse hundreds of tokenized skill credentials
- **Advanced Filtering**: Filter by category, price range, rating, and verified sellers
- **Real-time Search**: Search skills by title, description, tags, or seller name
- **Multi-sort Options**: Sort by price, rating, popularity, or date
- **Shopping Cart**: Add multiple skills before checkout
- **Instant Purchase**: Buy skills immediately with Buy Now
- **Seller Verification**: Badge system for verified sellers

### 🎨 UI/UX Design

#### Floating Skill Cards
- **Sleek futuristic theme** with neon gradient accents
- **Hover animations** with subtle scale and glow effects
- **Category badges** with dynamic colors
- **Price display** in FLOW tokens + USD
- **Seller information** with avatar, rating, and verification badge
- **Action buttons** for Add to Cart and Buy Now
- **Level indicators** (Beginner, Intermediate, Advanced, Expert)

#### Category Filter
- **Icon-based chips** with emoji icons
- **Active state** with gradient backgrounds and neon glow
- **Item counts** for each category
- **Responsive layout** with wrapping

#### Search Bar
- **Autocomplete** with suggestions
- **Keyboard navigation** (arrow keys, enter, escape)
- **Clear button** for quick reset
- **Focus states** with indigo glow

#### Sort Dropdown
- **Multiple sort options**: Price, Rating, Popularity, Date
- **Checkmark** for selected option
- **Click outside** to close

## Architecture

### File Structure

```
features/marketplace/
├── types/
│   └── marketplace.types.ts          # Type definitions
├── context/
│   └── MarketplaceContext.tsx        # State management
└── presentation/
    └── components/
        ├── SkillCard.tsx              # Floating skill card
        ├── CategoryFilter.tsx         # Category chips
        ├── SearchBar.tsx              # Search with autocomplete
        ├── SortDropdown.tsx           # Sort options
        └── index.ts                   # Component exports

app/(dashboard)/marketplace/
└── page.tsx                           # Main marketplace page
```

### Type System

#### Core Enums

```typescript
// 11 skill categories
enum SkillCategory {
  Development, Design, DataScience, Marketing, Business,
  Finance, Education, Engineering, Healthcare, Creative, All
}

// Listing status
enum ListingStatus {
  Active, Sold, Inactive, Pending
}

// Sort options
enum SortOption {
  PriceLowToHigh, PriceHighToLow, RatingHighToLow,
  PopularityHighToLow, Newest, Oldest
}

// Price ranges
enum PriceRange {
  All, Free, Under10, Under50, Under100, Above100
}
```

#### Key Interfaces

**SkillListing**
```typescript
interface SkillListing {
  id: string;
  tokenId: string;
  title: string;
  description: string;
  category: SkillCategory;
  image: string;
  price: number;                    // FLOW tokens
  priceUSD: number;
  seller: Seller;
  rating: number;                   // 0-5
  totalReviews: number;
  totalPurchases: number;
  createdAt: Date;
  status: ListingStatus;
  tags: string[];
  level?: string;                   // Beginner/Intermediate/Advanced/Expert
  duration?: string;                // Time to master
}
```

**Seller**
```typescript
interface Seller {
  id: string;
  name: string;
  avatar?: string;
  walletAddress: string;
  rating: number;                   // 0-5
  totalSales: number;
  memberSince: Date;
  verified: boolean;                // Verification badge
}
```

**MarketplaceFilter**
```typescript
interface MarketplaceFilter {
  category: SkillCategory;
  priceRange: PriceRange;
  minRating: number;
  verified: boolean;                // Verified sellers only
  searchQuery: string;
  tags: string[];
}
```

### Helper Functions

#### Formatters
- `formatPrice(price, decimals)`: Format FLOW token price
- `formatUSDPrice(price)`: Format USD price with $
- `formatRating(rating)`: Format rating to 1 decimal
- `getRatingStars(rating)`: Get star emoji string (⭐⭐⭐⭐⭐)
- `formatNumber(num)`: Format with K/M suffix

#### Utilities
- `getCategoryIcon(category)`: Get emoji icon for category
- `getCategoryColor(category)`: Get hex color for category
- `applyFilters(listings, filter)`: Filter listings by all criteria
- `applySort(listings, option)`: Sort listings
- `calculateSummary(listings)`: Generate marketplace statistics

## Usage

### Basic Implementation

```tsx
import { MarketplaceProvider } from '@/features/marketplace/context/MarketplaceContext';

export default function MarketplacePage() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}
```

### Using the Context

```tsx
import { useMarketplace } from '@/features/marketplace/context/MarketplaceContext';

function Component() {
  const {
    listings,           // Filtered & sorted listings
    summary,           // Marketplace statistics
    cart,              // Shopping cart
    filter,            // Active filters
    loading,           // Loading state
    updateFilter,      // Update filters
    addToCart,         // Add to cart
    buyNow,            // Instant purchase
  } = useMarketplace();

  return (
    <div>
      {listings.map(listing => (
        <SkillCard
          key={listing.id}
          listing={listing}
          onAddToCart={addToCart}
          onBuyNow={buyNow}
        />
      ))}
    </div>
  );
}
```

### Filtering Examples

```tsx
// Filter by category
updateFilter({ category: SkillCategory.Development });

// Search
updateFilter({ searchQuery: 'React.js' });

// Filter by price range
updateFilter({ priceRange: PriceRange.Under50 });

// Verified sellers only
updateFilter({ verified: true });

// Reset all filters
resetFilters();
```

### Sorting

```tsx
// Sort by price (low to high)
updateSort(SortOption.PriceLowToHigh);

// Sort by rating
updateSort(SortOption.RatingHighToLow);

// Sort by popularity
updateSort(SortOption.PopularityHighToLow);
```

### Shopping Cart

```tsx
// Add to cart
addToCart(listing);

// Remove from cart
removeFromCart(listing.id);

// Clear cart
clearCart();

// Checkout all items
await checkout();
```

## Design System

### Color Palette

**Category Colors**
- Development: `#6366F1` (Indigo)
- Design: `#A855F7` (Purple)
- Data Science: `#22D3EE` (Cyan)
- Marketing: `#EC4899` (Pink)
- Business: `#F59E0B` (Amber)
- Finance: `#10B981` (Emerald)
- Education: `#3B82F6` (Blue)
- Engineering: `#8B5CF6` (Violet)
- Healthcare: `#EF4444` (Red)
- Creative: `#F97316` (Orange)

**UI Colors**
- Background: `#0F172A` (slate-950)
- Card: `#1E293B` (slate-900)
- Border: `#334155` (slate-800)
- Text Primary: `#FFFFFF`
- Text Secondary: `#94A3B8` (slate-400)
- Accent: `#6366F1` (indigo-500)

### Component Styles

**Skill Card**
- Border radius: `16px` (rounded-2xl)
- Hover scale: `1.02`
- Hover shadow: Neon glow with category color
- Image aspect ratio: `4:3`
- Gradient overlay on image
- Backdrop blur on badges

**Category Chips**
- Border radius: `12px` (rounded-xl)
- Active state: Gradient background + neon border
- Icon size: `text-lg` (18px)
- Hover effect: Brightness increase

**Search Bar**
- Border radius: `12px` (rounded-xl)
- Focus ring: Indigo glow
- Dropdown: Rounded with shadow
- Keyboard navigation support

**Sort Dropdown**
- Border radius: `12px` (rounded-xl)
- Checkmark for selected
- Smooth transitions

### Animations

- **Card Hover**: Scale(1.02) + Shadow + Glow (300ms)
- **Button Hover**: TranslateY(-1px) + Shadow (200ms)
- **Dropdown**: Fade in (150ms)
- **Suggestions**: Slide down (200ms)

## Mock Data

The feature includes 8 sample skill listings:

1. **React.js Expert Certification** - Development - $45 FLOW
2. **UI/UX Design Mastery** - Design - $35 FLOW
3. **Machine Learning Fundamentals** - Data Science - $85 FLOW
4. **Digital Marketing Strategy** - Marketing - $25 FLOW
5. **Blockchain Development** - Development - $95 FLOW
6. **Financial Analysis & Modeling** - Finance - $55 FLOW
7. **Data Visualization with D3.js** - Data Science - $40 FLOW
8. **Business Strategy & Operations** - Business - $50 FLOW

Each listing includes:
- Category, rating, reviews, purchases
- Verified seller with rating and sales count
- Tags, level, duration
- Mock pricing in FLOW and USD

## Future Enhancements

- [ ] Skill detail modal with full information
- [ ] Reviews and ratings system
- [ ] Wishlist functionality
- [ ] Price history charts
- [ ] Seller profile pages
- [ ] Purchase history
- [ ] Refund/dispute system
- [ ] Advanced filters (price range slider, date range)
- [ ] Saved searches
- [ ] Email notifications for wishlisted items
- [ ] Bulk purchase discounts
- [ ] Marketplace analytics dashboard
- [ ] Featured/promoted listings
- [ ] Similar skills recommendations
- [ ] Integration with wallet for real blockchain transactions

## Integration Guide

### Connecting to Real Data

Replace mock data in `MarketplaceContext.tsx`:

```tsx
const fetchListings = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    // Call your API
    const response = await fetch('/api/marketplace/listings');
    const data = await response.json();

    // Apply filters and sorting
    let filtered = applyFilters(data.listings, filter);
    filtered = applySort(filtered, sortOption);

    setListings(filtered);
    setSummary(calculateSummary(data.listings));
  } catch (err) {
    setError('Failed to fetch listings');
  } finally {
    setLoading(false);
  }
}, [filter, sortOption]);
```

### Blockchain Integration

```tsx
const buyNow = useCallback(async (listing: SkillListing) => {
  try {
    setLoading(true);
    
    // Connect wallet
    const wallet = await connectWallet();
    
    // Execute blockchain transaction
    const tx = await purchaseSkillToken({
      tokenId: listing.tokenId,
      price: listing.price,
      seller: listing.seller.walletAddress,
    });
    
    // Wait for confirmation
    await tx.wait();
    
    // Record purchase
    await fetch('/api/marketplace/purchase', {
      method: 'POST',
      body: JSON.stringify({
        listingId: listing.id,
        transactionHash: tx.hash,
      }),
    });
    
    console.log('Purchase successful');
  } catch (err) {
    setError('Purchase failed');
  } finally {
    setLoading(false);
  }
}, []);
```

## License

Part of the SkillFlow application.
