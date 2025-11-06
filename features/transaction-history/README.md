# Transaction History Feature

## Overview

The Transaction History feature provides a comprehensive dashboard for tracking and analyzing blockchain and in-app transactions. Users can view detailed transaction information, filter by multiple criteria, sort data, and export results.

## Features

### 🎯 Core Functionality

- **Transaction Tracking**: View all blockchain transactions with complete details
- **Advanced Filtering**: Filter by date range, type, status, token, network, and search
- **Multi-column Sorting**: Sort by any field (date, amount, gas fee, etc.)
- **Data Export**: Export filtered data to CSV, JSON, or Excel
- **Pagination**: Navigate large datasets efficiently
- **Transaction Summary**: Real-time analytics and statistics

### 📊 Dashboard Components

#### Summary Cards
- **Total Transactions**: Count of all transactions
- **Successful**: Confirmed transactions with success rate
- **Failed**: Failed transactions with failure rate
- **Pending**: Transactions awaiting confirmation
- **Total Volume**: Aggregate USD value of all transactions
- **Total Gas Fees**: Cumulative gas fees paid

#### Transaction Table
- Dark data-table UI with rounded rows
- Token icons for visual identification
- Sortable columns (Date, Type, Status, Amount, Gas Fee)
- Hover animations revealing full hash strings
- Status badges with color coding
- Compact wallet address display
- Network tags

#### Filter Bar
- **Time Period**: All Time, Today, Week, Month, Quarter, Year, Custom
- **Transaction Type**: Mint, Transfer, Burn, Verification, Stake, Unstake, Reward, Purchase
- **Status**: Pending, Confirmed, Failed, Cancelled
- **Tokens**: Filter by specific token types
- **Networks**: Filter by blockchain network
- **Search**: Find transactions by hash, token name, or type

## Architecture

### File Structure

```
features/transaction-history/
├── types/
│   └── transaction-history.types.ts    # Type definitions & helpers
├── context/
│   └── TransactionHistoryContext.tsx   # State management
└── presentation/
    └── components/
        ├── TransactionTable.tsx        # Main table component
        ├── FilterBar.tsx               # Filter UI
        ├── HashCopy.tsx                # Hash display with copy
        ├── StatusBadge.tsx             # Status indicator
        ├── TokenIcon.tsx               # Token icon display
        ├── ExportButton.tsx            # Export dropdown
        ├── Pagination.tsx              # Page navigation
        └── index.ts                    # Component exports

app/(dashboard)/transactions/
└── page.tsx                            # Main dashboard page
```

### Type System

#### Core Enums

```typescript
// Transaction Types (8 types)
enum TransactionType {
  Mint        // Credential/NFT creation
  Transfer    // Token transfers
  Burn        // Token burning
  Verification // Credential verification
  Stake       // Token staking
  Unstake     // Unstaking
  Reward      // Reward distribution
  Purchase    // Token purchases
}

// Transaction Status (4 states)
enum TransactionStatus {
  Pending     // Awaiting confirmation
  Confirmed   // Successfully confirmed
  Failed      // Transaction failed
  Cancelled   // User cancelled
}

// Token Types (4 categories)
enum TokenType {
  SkillCredential  // Skill-based NFTs
  NFT             // Standard NFTs
  Token           // Fungible tokens
  Governance      // Governance tokens
}

// Filter Periods (7 options)
enum FilterPeriod {
  AllTime, Today, Week, Month, Quarter, Year, Custom
}
```

#### Key Interfaces

**Transaction**
```typescript
interface Transaction {
  id: string;
  hash: string;                    // Full transaction hash
  blockNumber: number;
  timestamp: Date;
  type: TransactionType;
  status: TransactionStatus;
  from: string;                    // Sender wallet address
  to: string;                      // Recipient wallet address
  token: TokenInfo;
  amount: string;                  // Token amount (as string for precision)
  amountUSD: number;               // USD value
  gasUsed: string;
  gasFee: string;                  // Gas fee in native token
  gasFeeUSD: number;               // Gas fee in USD
  network: string;                 // Blockchain network
  explorerUrl: string;             // Block explorer link
  metadata?: TransactionMetadata;  // Optional contextual data
}
```

**TransactionFilter**
```typescript
interface TransactionFilter {
  period: FilterPeriod;
  startDate?: Date;
  endDate?: Date;
  types: TransactionType[];
  statuses: TransactionStatus[];
  tokens: string[];                // Token IDs
  networks: string[];
  searchQuery?: string;
}
```

**TransactionSummary**
```typescript
interface TransactionSummary {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalVolume: string;
  totalVolumeUSD: number;
  totalGasFees: string;
  totalGasFeesUSD: number;
  byType: Record<TransactionType, number>;
  byStatus: Record<TransactionStatus, number>;
  byToken: Record<string, number>;
}
```

### Helper Functions

#### Formatters
- `formatTransactionHash(hash, chars)`: Shorten hash to "0x1234...5678"
- `formatWalletAddress(address, chars)`: Shorten wallet address
- `formatTokenAmount(amount, decimals)`: Format with K/M notation
- `formatUSDAmount(amount)`: Currency formatting ($1,234.56)
- `formatTransactionDate(date)`: Relative time ("5m ago", "3h ago")
- `formatTimestamp(date)`: Full datetime string

#### Color Mappers
- `getTransactionStatusColor(status)`: Returns hex color for status
- `getTransactionTypeColor(type)`: Returns hex color for type
- `getTransactionStatusIcon(status)`: Returns emoji icon for status
- `getTransactionTypeIcon(type)`: Returns emoji icon for type

#### Data Processing
- `applyFilter(transactions, filter)`: Filter transactions by all criteria
- `applySort(transactions, config)`: Sort by any field with direction
- `calculateSummary(transactions)`: Generate analytics summary
- `exportToCSV(transactions)`: Convert to CSV format
- `exportToJSON(transactions)`: Convert to JSON format

## Usage

### Basic Implementation

```tsx
import { TransactionHistoryProvider } from '@/features/transaction-history/context/TransactionHistoryContext';
import { TransactionTable, FilterBar } from '@/features/transaction-history/presentation/components';

export default function TransactionsPage() {
  return (
    <TransactionHistoryProvider>
      <TransactionHistoryContent />
    </TransactionHistoryProvider>
  );
}
```

### Using the Context

```tsx
import { useTransactionHistory } from '@/features/transaction-history/context/TransactionHistoryContext';

function Component() {
  const {
    transactions,        // Current page transactions
    summary,            // Analytics summary
    pagination,         // Page info
    filter,             // Active filters
    loading,            // Loading state
    updateFilter,       // Update filter function
    exportTransactions, // Export function
  } = useTransactionHistory();

  return (
    <div>
      <FilterBar
        filter={filter}
        onChange={updateFilter}
        availableTokens={availableTokens}
        availableNetworks={availableNetworks}
        onReset={resetFilter}
      />
      <TransactionTable
        transactions={transactions}
        loading={loading}
        onSort={updateSort}
      />
    </div>
  );
}
```

### Filtering Examples

```tsx
// Filter by period
updateFilter({ period: FilterPeriod.Week });

// Filter by transaction type
updateFilter({ types: [TransactionType.Mint, TransactionType.Transfer] });

// Filter by status
updateFilter({ statuses: [TransactionStatus.Confirmed] });

// Filter by custom date range
updateFilter({
  period: FilterPeriod.Custom,
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
});

// Search by hash or token
updateFilter({ searchQuery: '0xabc123' });

// Reset all filters
resetFilter();
```

### Exporting Data

```tsx
// Export to CSV
await exportTransactions({
  format: ExportFormat.CSV,
  includeMetadata: true,
});

// Export to JSON
await exportTransactions({
  format: ExportFormat.JSON,
  includeMetadata: true,
});

// Export with custom date range
await exportTransactions({
  format: ExportFormat.CSV,
  includeMetadata: true,
  dateRange: {
    start: new Date('2025-01-01'),
    end: new Date('2025-01-31'),
  },
});
```

## Design System

### Color Palette

**Status Colors**
- Pending: `#F59E0B` (amber-500)
- Confirmed: `#10B981` (emerald-500)
- Failed: `#EF4444` (red-500)
- Cancelled: `#6B7280` (gray-500)

**Transaction Type Colors**
- Mint/Reward: `#10B981` (emerald-500)
- Transfer: `#3B82F6` (blue-500)
- Burn: `#EF4444` (red-500)
- Verification: `#A855F7` (purple-500)
- Stake: `#06B6D4` (cyan-500)
- Unstake: `#F59E0B` (amber-500)
- Purchase: `#6366F1` (indigo-500)

**UI Colors**
- Background: `#0F172A` (slate-950)
- Card: `#1E293B` (slate-900/50)
- Border: `#334155` (slate-800/50)
- Text Primary: `#FFFFFF`
- Text Secondary: `#94A3B8` (slate-400)

### Typography
- UI Font: Inter
- Monospace (hashes/addresses): JetBrains Mono

### Components

**Rounded Rows**
- Border radius: 12px
- Hover: `bg-slate-800/30`
- Alternating backgrounds for better readability

**Token Icons**
- Size: 24px (small), 32px (medium), 48px (large)
- Circular with gradient fallback
- Border: `border-slate-700/50`

**Status Badges**
- Rounded full with color-coded background
- Semi-transparent with border
- Includes icon + text

**Hash Copy**
- Compact view: "0x1234...5678" (6 chars each side)
- Hover: Reveals full hash
- Copy button with success feedback
- Explorer link icon

## Mock Data

The feature includes mock transaction data for development:
- 7 sample transactions
- Various types (Mint, Transfer, Stake, Verification, Reward, Purchase, Failed)
- Different statuses (Confirmed, Pending, Failed)
- Multiple tokens (SKILL, ANFT, FLOW)
- Polygon network
- Timestamps from 2 minutes to 7 days ago

## Future Enhancements

- [ ] Real-time transaction updates via WebSocket
- [ ] Transaction detail modal with full information
- [ ] Advanced charting (volume over time, gas trends)
- [ ] Transaction grouping by date
- [ ] Batch operations (bulk export, multi-select actions)
- [ ] Custom column visibility
- [ ] Saved filter presets
- [ ] Email/webhook notifications for new transactions
- [ ] Integration with wallet providers
- [ ] Multi-chain support with chain selector

## Integration Guide

### Connecting to Real Data

Replace mock data in `TransactionHistoryContext.tsx`:

```tsx
const fetchTransactions = useCallback(async (page: number = 1) => {
  try {
    setLoading(true);
    setError(null);

    // Replace with your API call
    const response = await fetch(`/api/transactions?page=${page}&pageSize=${pagination.pageSize}`);
    const data = await response.json();

    // Apply client-side filters and sorting
    let filtered = applyFilter(data.transactions, filter);
    filtered = applySort(filtered, sortConfig);

    setTransactions(filtered);
    setSummary(calculateSummary(filtered));
    // ... update pagination
  } catch (err) {
    setError('Failed to fetch transactions');
  } finally {
    setLoading(false);
  }
}, [filter, sortConfig, pagination.pageSize]);
```

## License

Part of the SkillFlow application.
