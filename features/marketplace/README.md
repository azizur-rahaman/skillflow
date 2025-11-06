# Skill Marketplace Feature

## Overview

The Skill Marketplace is a comprehensive, futuristic marketplace for buying and selling tokenized skills. Users can explore verified skill credentials, filter by category, search for specific skills, view detailed information, and make instant purchases using FLOW tokens with blockchain verification.

## Features

### 🎯 Core Functionality

- **Skill Discovery**: Browse hundreds of tokenized skill credentials
- **Skill Detail Page**: Comprehensive detail view with large banner, tabs, and purchase panel
- **Advanced Filtering**: Filter by category, price range, rating, and verified sellers
- **Real-time Search**: Search skills by title, description, tags, or seller name
- **Multi-sort Options**: Sort by price, rating, popularity, or date
- **Shopping Cart**: Add multiple skills before checkout
- **Instant Purchase**: Buy skills immediately with Buy Now
- **Crypto Checkout**: Animated blockchain transaction flow with wallet connect, signing, and confirmation
- **Seller Verification**: Badge system for verified sellers
- **Reviews & Ratings**: Comprehensive review system with verified purchases
- **Issuer Credentials**: Detailed issuer profiles with accreditations

### 🎨 UI/UX Design

#### Marketplace Grid
- **Sleek futuristic theme** with neon gradient accents
- **Hover animations** with subtle scale and glow effects
- **Category badges** with dynamic colors
- **Price display** in FLOW tokens + USD
- **Seller information** with avatar, rating, and verification badge
- **Action buttons** for Add to Cart and Buy Now
- **Level indicators** (Beginner, Intermediate, Advanced, Expert)

#### Skill Detail Page
- **Large Hero Banner** (400-500px) with skill graphic, gradient overlay, and floating category badge
- **Interactive Elements**: Back button, play preview, token ID badge
- **Sticky Purchase Panel**: Price info, buy/cart buttons, supply tracker, trust indicators, token information
- **Tabbed Content**: Description (learning outcomes, prerequisites, related skills), Reviews (rating distribution, verified reviews), Issuer (organization info, accreditations)
- **Responsive Layout**: 2-column grid on desktop, single column on mobile

#### Crypto Checkout Modal
- **Animated Transaction Steps**: Idle → Connecting Wallet → Wallet Connected → Signing → Processing → Confirming → Success/Failed
- **Visual Progress**: Progress bar with 4 steps (Connect, Sign, Process, Confirm)
- **Transaction Details**: Skill info, price breakdown, network fees, wallet address, transaction hash
- **Real-time Status**: Animated loader with step-specific colors and icons
- **Success Animation**: Celebration with action buttons (View in Wallet, Close)
- **Error Handling**: Retry button with error message display
- **Security Notice**: Wallet confirmation prompts

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
│   ├── marketplace.types.ts              # Core marketplace types
│   └── marketplace-detail.types.ts       # Detail page specific types
├── context/
│   ├── MarketplaceContext.tsx           # Marketplace grid state
│   └── MarketplaceSkillDetailContext.tsx # Detail page state
└── presentation/
    └── components/
        ├── SkillCard.tsx                 # Marketplace grid card
        ├── CategoryFilter.tsx            # Category filter chips
        ├── SearchBar.tsx                 # Search with autocomplete
        ├── SortDropdown.tsx              # Sort options dropdown
        ├── index.ts                      # Marketplace component exports
        └── detail/
            ├── SkillBanner.tsx           # Hero banner with image
            ├── PurchasePanel.tsx         # Right sidebar purchase panel
            ├── TabsSection.tsx           # Tabs for description/reviews/issuer
            ├── CryptoCheckoutModal.tsx   # Animated checkout modal
            └── index.ts                  # Detail component exports

app/(dashboard)/marketplace/
├── page.tsx                              # Marketplace grid page
└── [id]/
    └── page.tsx                          # Skill detail page
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

- [ ] Skill detail modal with full information → ✅ COMPLETED (Dynamic route page)
- [ ] Reviews and ratings system → ✅ COMPLETED (Full review tab with stats)
- [ ] Crypto checkout flow → ✅ COMPLETED (Animated modal with transaction steps)
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

## Skill Detail Page

### Components

#### SkillBanner
Large hero section (400-500px height) with:
- Full-width skill image with hover scale effect
- Gradient overlay (from-slate-950 to transparent)
- Animated neon glow on hover with category color
- Back button (top-left) with hover effects
- Category badge (top-right) with neon border and shadow
- Floating token ID badge (top-center) with copy functionality
- Title (3xl-5xl responsive) at bottom
- Description (lg-xl) line-clamped to 2 lines
- Tags (first 5) as chips
- Meta info bar: Issuer avatar/name, Rating with stars, Total purchases, Level badge, Video preview button

#### PurchasePanel
Sticky sidebar (top-6) with:
- **Price Section**: Large FLOW price, USD equivalent, trending indicator
- **Action Buttons**: 
  - Buy Now: Category gradient background with glow hover
  - Add to Cart: Slate gray, disabled if already in cart
- **Supply Tracker**: Progress bar showing circulating/total supply, warning if >80% sold
- **Trust Indicators**: Blockchain verified, Lifetime access, Global recognition
- **Token Information**: Standard (ERC-1155), Contract address, Minted date, Certification type
- **Money-back Guarantee**: 30-day guarantee notice

#### TabsSection
Tabbed content with 3 tabs:
- **Description Tab**:
  - Full description (whitespace-pre-line for formatting)
  - Learning outcomes (grid with checkmark icons)
  - Prerequisites (numbered list)
  - Related skills (3-column grid with cards)
- **Reviews Tab**:
  - Rating summary (overall score + distribution bars)
  - Review cards with: User avatar, name, verified badge, rating stars, title, comment, helpful count
  - Verified purchase indicator
- **Issuer Tab**:
  - Organization header: Logo, name, verified badge, verification level
  - Description and stats: Credentials issued, rating, followers, years in business
  - Contact links: Website, email, location
  - Accreditations grid: Logo, name, issuer, dates, verification link

#### CryptoCheckoutModal
Animated modal (max-w-md) with:
- **Header**: Animated icon based on transaction step, step title, error message
- **Transaction Details**: 
  - Skill thumbnail + title + seller
  - Price breakdown: Skill price, network fee, total
  - Wallet address with copy button
  - Transaction hash with copy and explorer link
- **Progress Indicator**: 
  - Progress bar (25% → 50% → 75% → 90%)
  - Step dots: Connect (25%), Sign (50%), Process (75%), Confirm (90%)
- **Transaction Steps**:
  1. **Idle**: Show "Confirm Purchase" button
  2. **Connecting Wallet**: Spinning loader with indigo color
  3. **Wallet Connected**: Checkmark with cyan color
  4. **Signing Transaction**: Spinning loader + "Please confirm in wallet"
  5. **Processing Transaction**: Spinning loader with progress
  6. **Confirming**: Spinning loader + transaction hash display
  7. **Success**: Celebration with "View in Wallet" + "Close" buttons
  8. **Failed**: Error icon + "Try Again" + "Cancel" buttons
- **Animations**:
  - Background gradient pulse with step color
  - Spinning loader for processing steps
  - Progress bar smooth transitions
  - Step dot scaling and color changes

### Crypto Checkout Flow

```typescript
// Transaction flow with delays
async function confirmPurchase() {
  // Step 1: Connect Wallet (1.5s)
  setStep(TransactionStep.ConnectingWallet);
  await connectWallet(); // Mock: 1500ms
  setStep(TransactionStep.WalletConnected); // Cyan checkmark
  
  // Step 2: Sign Transaction (2s)
  setStep(TransactionStep.SigningTransaction); // Show wallet prompt
  await signTransaction(); // Mock: 2000ms
  
  // Step 3: Process Transaction (1.5s)
  setStep(TransactionStep.ProcessingTransaction);
  await processTransaction(); // Mock: 1500ms
  
  // Step 4: Confirm on Blockchain (3s)
  setStep(TransactionStep.Confirming); // Show tx hash
  await confirmOnChain(); // Mock: 3000ms
  
  // Step 5: Success
  setStep(TransactionStep.Success); // Show celebration
}
```

### Visual Design Highlights

- **Banner Gradient**: `from-slate-950 via-slate-950/80 to-transparent`
- **Neon Glow**: `radial-gradient(circle at 50% 0%, {categoryColor}20, transparent 70%)`
- **Category Colors**: Development (#6366F1), Design (#A855F7), Data Science (#22D3EE), etc.
- **Purchase Panel**: `from-slate-900 to-slate-950` gradient background
- **Modal Backdrop**: `bg-slate-950/90 backdrop-blur-sm`
- **Progress Bar**: `from-indigo-500 to-cyan-400` gradient with animate-pulse
- **Success State**: `bg-emerald-500/10 border-emerald-500/30`

### Mock Data Structure

```typescript
MarketplaceSkillDetail {
  // Basic info (from SkillListing)
  id, tokenId, title, description, category, image, price, priceUSD, seller, rating, totalReviews, totalPurchases, status, tags, level, duration
  
  // Extended fields
  fullDescription: "Long-form description with line breaks"
  learningOutcomes: ["Outcome 1", "Outcome 2", ...]
  prerequisites: ["Prereq 1", "Prereq 2", ...]
  skillDomain: "Web Development / Frontend Engineering"
  certificationType: "Professional Certification"
  validityPeriod: "Lifetime"
  
  // Issuer
  issuer: {
    organizationName, logo, website, description, establishedYear, totalCredentialsIssued, verificationLevel (Basic/Verified/Premium/Enterprise), accreditations: [], email, location, followers, rating, walletAddress, verified
  }
  
  // Reviews
  reviews: [{
    userName, userAvatar, userWallet, rating (1-5), title, comment, createdAt, helpful, verified, userLevel, userBadge
  }]
  reviewStats: {
    averageRating, totalReviews, distribution: {5, 4, 3, 2, 1}, verifiedPurchaseCount
  }
  
  // Token info
  tokenStandard: "ERC-1155"
  contractAddress: "0x..."
  mintedDate, totalSupply, circulatingSupply
  
  // Additional
  videoUrl, sampleCertificate, relatedSkills: []
}
```

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
