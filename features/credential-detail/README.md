# Credential Detail Feature

NFT-inspired digital credential detail page for viewing skill tokens with blockchain verification, QR codes, and issuer signatures in an elegant futuristic layout.

## Overview

The Credential Detail feature provides a comprehensive view of individual skill credentials with NFT-style presentation, blockchain metadata, verification capabilities, and digital signatures.

## Features

### 🎨 NFT-Inspired Design
- **Large Token Display**: Aspect-square credential card with gradient glow effects
- **Rarity System**: Visual indicators for credential rarity (Legendary, Epic, Rare, Uncommon, Common)
- **Elegant Typography**: Clean sans-serif for UI, monospace for blockchain data
- **Gradient Effects**: Radial gradients with opacity transitions for depth

### 🔗 Blockchain Integration
- **Full Metadata Display**: 12 comprehensive metadata fields
- **Blockchain Explorer Links**: Direct links to PolygonScan/Etherscan
- **IPFS Support**: View metadata and images on IPFS
- **Contract Information**: Token ID, contract address, block number, transaction hash

### ✅ Verification System
- **QR Code Generation**: Public verification via QR codes
- **Multiple Verification Methods**: QR Code, Blockchain, Link, API
- **Verification Proof**: Cryptographic proof with signatures
- **Expiration Tracking**: Verification validity periods

### 📜 Digital Signatures
- **Issuer Certification**: Official signatures from issuing authorities
- **Signer Details**: Name, title, and signature image
- **Certificate Numbers**: Standardized format (SF-YYYYMM-TOKENID)
- **Validity Tracking**: Issue date and expiration tracking

### 📊 Comprehensive Data
- **Token Attributes**: Skill level, category, framework version, experience
- **Achievement Timeline**: Historical milestones with XP earned
- **Related Credentials**: Linked credentials from same domain
- **Social Stats**: View count, share count, verification count

### 🔄 Sharing & Export
- **Social Sharing**: LinkedIn, Twitter, Email integration
- **Download Options**: PDF, PNG, JSON formats
- **Embed Codes**: iframe embeds for external sites
- **Copy Links**: Quick link copying

## Architecture

### File Structure
```
features/credential-detail/
├── types/
│   └── credential-detail.types.ts    # Type definitions and helpers
├── context/
│   └── CredentialDetailContext.tsx   # State management
└── presentation/
    └── components/
        ├── CredentialCard.tsx         # NFT-style token card
        ├── MetadataTable.tsx          # Blockchain metadata display
        ├── VerificationQR.tsx         # QR verification component
        ├── IssuerSignature.tsx        # Digital signature display
        └── index.ts                   # Barrel exports

app/(dashboard)/credentials/[id]/
└── page.tsx                           # Main credential detail page
```

### Type System

#### Core Types
- **`CredentialDetail`**: Extended credential with full metadata, blockchain data, verification
- **`BlockchainData`**: Contract, token, network, block, transaction details
- **`IssuerSignatureData`**: Issuer info, signer details, signature, certificate number
- **`VerificationRequest/Response`**: Verification flow types
- **`ShareRequest/Response`**: Social sharing types

#### Enums
- **`DetailTab`**: Overview, Metadata, Attributes, Verification, History
- **`VerificationMethod`**: QRCode, Link, Blockchain, API
- **`SharePlatform`**: LinkedIn, Twitter, Email, Copy

### State Management

The `CredentialDetailContext` provides:

```typescript
interface CredentialDetailContextState {
  credential: CredentialDetail | null;
  activeTab: DetailTab;
  verification: VerificationResponse | null;
  loading: boolean;
  error: string | null;
  
  loadCredential: (tokenId: string) => Promise<void>;
  setActiveTab: (tab: DetailTab) => void;
  requestVerification: (request: VerificationRequest) => Promise<VerificationResponse>;
  shareCredential: (request: ShareRequest) => Promise<ShareResponse>;
  downloadCredential: (format: 'pdf' | 'png' | 'json') => Promise<void>;
  updateDisplaySettings: (settings: Partial<DisplaySettings>) => Promise<void>;
  refreshMetadata: () => Promise<void>;
}
```

## Components

### CredentialCard
Large NFT-style token display with:
- Gradient backgrounds and glow effects
- Rarity tier indicators with color coding
- Skill level badge
- Verification status
- Social stats (views, shares, verifications)
- Issuer information
- Action buttons (share, download, blockchain)

### MetadataTable
Blockchain and credential metadata with:
- 12 comprehensive metadata fields
- Copyable addresses and hashes
- Clickable blockchain explorer links
- IPFS metadata and image links
- Clean table layout with monospace fonts

### VerificationQR
QR code verification system with:
- QR code generation via api.qrserver.com
- Verification method selection
- Public verification URLs
- Verification proof display
- Signature validation
- Expiration tracking

### IssuerSignature
Digital signature certification with:
- Issuer logo and verified badge
- Signature image display
- Signer name and title
- Certificate number
- Signed date and validity
- Digital signature hash
- Blockchain verification badge

## Helper Functions

### Metadata & Formatting
```typescript
getMetadataFields(credential): MetadataField[]
formatCertificateNumber(tokenId, issuedAt): string
formatAttributeValue(value, type): string
formatBlockchainExplorerUrl(network, type, value): string
```

### Verification & QR
```typescript
generateQRCodeUrl(verificationUrl): string
generateVerificationUrl(tokenId, hash): string
validateVerificationHash(hash): boolean
```

### Rarity & Scoring
```typescript
calculateCredentialScore(credential): number
getRarityTier(score): string
getRarityColor(tier): string
```

### Sharing & Export
```typescript
getShareUrl(platform, url, message): string
generateEmbedCode(tokenId, size): string
```

## Design System

### Colors
- **Background**: `#0F172A` (slate-950)
- **Cards**: `#1E293B` (slate-900), `#334155` (slate-800)
- **Borders**: `#475569` (slate-700)
- **Primary**: `#6366F1` (indigo-500)
- **Success**: `#10B981` (emerald-400)
- **Rarity Colors**:
  - Legendary: `#F59E0B` (Gold)
  - Epic: `#A855F7` (Purple)
  - Rare: `#22D3EE` (Cyan)
  - Uncommon: `#84CC16` (Lime)
  - Common: `#9CA3AF` (Gray)

### Typography
- **UI Text**: Inter font family
- **Blockchain Data**: JetBrains Mono (monospace)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight

### Gradients
```css
/* Card Background */
background: linear-gradient(135deg, #1E293B 0%, #334155 100%);

/* Rarity Glow */
radial-gradient(circle, ${rarityColor}80, transparent);

/* Button Gradient */
background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
```

## Usage

### Basic Implementation
```tsx
import CredentialDetailPage from '@/app/(dashboard)/credentials/[id]/page';

// Route: /credentials/[id]
// Automatically loads credential and displays NFT-style detail view
```

### With Context
```tsx
import { useCredentialDetail } from '@/features/credential-detail/context/CredentialDetailContext';

function CustomComponent() {
  const { credential, verification, requestVerification } = useCredentialDetail();
  
  // Use credential data and actions
}
```

### Individual Components
```tsx
import {
  CredentialCard,
  MetadataTable,
  VerificationQR,
  IssuerSignature
} from '@/features/credential-detail/presentation/components';

<CredentialCard
  credential={credential}
  onShare={() => handleShare()}
  onDownload={() => handleDownload()}
  onViewBlockchain={() => handleViewBlockchain()}
/>
```

## Mock Data

The context provides comprehensive mock data including:
- **Credential**: React.js Expert skill token
- **Blockchain Data**: Polygon network, contract, transaction
- **Issuer Signature**: Director certification with signature
- **Related Credentials**: TypeScript, Node.js, JavaScript credentials
- **Achievement Path**: 5 milestones from fundamentals to expert
- **Attributes**: 8 token attributes with display types

## API Integration

### Endpoints (To Implement)
```typescript
// Load credential detail
GET /api/credentials/:tokenId

// Request verification
POST /api/credentials/:tokenId/verify

// Share credential
POST /api/credentials/:tokenId/share

// Download credential
GET /api/credentials/:tokenId/download?format=pdf|png|json

// Update display settings
PATCH /api/credentials/:tokenId/settings
```

## Testing

### Unit Tests
- Type definitions and helper functions
- Component rendering and interactions
- Context state management
- Verification flow

### Integration Tests
- Full page workflow
- Tab navigation
- Verification generation
- Social sharing
- Download functionality

## Performance

### Optimizations
- Image lazy loading with Next.js Image
- Tab-based content loading
- Debounced copy actions
- Memoized calculations

### Bundle Size
- Tree-shakable component exports
- Shared type system with wallet feature
- Minimal external dependencies

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance

## Future Enhancements

- [ ] Real-time blockchain verification
- [ ] Video credential support
- [ ] Multi-language metadata
- [ ] Advanced sharing analytics
- [ ] Credential comparison view
- [ ] NFT marketplace integration
- [ ] Animated achievement timeline
- [ ] 3D credential previews

## Dependencies

- **React 18+**: Component framework
- **Next.js 14+**: App router and image optimization
- **Lucide Icons**: Icon library
- **Wallet Types**: Shared type system

## Related Features

- **Wallet**: Token management and display
- **Profile**: User credential showcase
- **Skills**: Skill tracking and growth

## License

Part of the SkillFlow platform. See main project LICENSE.
