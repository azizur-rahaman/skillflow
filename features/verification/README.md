# Credential Verification Feature

Public-facing credential verification system that allows third parties to verify the authenticity of SkillFlow credentials on the blockchain.

## Overview

The verification feature provides a clean, secure interface for anyone to verify credential authenticity without requiring authentication. It validates credentials through a multi-step blockchain verification process and displays results with trust indicators.

## Architecture

### Feature Structure
```
features/verification/
├── types/
│   └── verification.types.ts       # Type definitions and helper functions
├── context/
│   └── VerificationContext.tsx     # State management
└── presentation/
    └── components/
        ├── TokenInput.tsx          # Input field with validation
        ├── BlockchainValidation.tsx # Animated verification process
        ├── VerifiedCard.tsx        # Success result display
        ├── InvalidCard.tsx         # Error result display
        └── IssuerDetails.tsx       # Issuer information

app/(public)/verify/
└── page.tsx                        # Public verification page
```

## Core Components

### 1. Token Input
**File:** `TokenInput.tsx`

Input field that accepts three verification methods:
- **Token ID**: Hex format (e.g., `0x1a2b3c...`)
- **Verification URL**: Direct verification links
- **QR Code**: Scanned credential data

Features:
- Auto-detection of input type
- Real-time validation feedback
- Paste support
- Clean/clear functionality
- Visual state indicators (valid/invalid)

### 2. Blockchain Validation
**File:** `BlockchainValidation.tsx`

Animated visualization of the 6-step verification process:

1. **Parse Input** - Validate and extract token ID
2. **Fetch Metadata** - Retrieve credential data from blockchain
3. **Verify Contract** - Validate smart contract authenticity
4. **Check Ownership** - Confirm current credential owner
5. **Validate Signature** - Verify cryptographic signature
6. **Complete** - Finalize verification

Features:
- Concentric animated rings
- Progress bar with percentage
- Step-by-step status indicators
- Smooth transitions and animations
- Gradient progress visualization

### 3. Verified Card
**File:** `VerifiedCard.tsx`

Success card displayed when verification passes:

Features:
- Large green checkmark animation
- Credential details (name, description, image)
- Skill level visualization
- Issuer information with verification badge
- Owner information
- Trust score badge
- Metadata grid (category, issued date, network, status)
- Share functionality
- Blockchain explorer link

### 4. Invalid Card
**File:** `InvalidCard.tsx`

Error card shown when verification fails:

Features:
- Red X icon with shake animation
- Error type and message
- Detailed error information
- Troubleshooting tips
- Try again functionality
- Security notice
- Help button

### 5. Issuer Details
**File:** `IssuerDetails.tsx`

Comprehensive issuer information display:

Features:
- Issuer logo and name
- Verified badge for trusted issuers
- Trust score (0-100) with level indicator
- Contact information (website, email)
- Blockchain verification data
- Certificate number
- Wallet address with copy function
- Compact and full display modes

## Verification Flow

### User Journey

1. **Input Stage**
   - User enters token ID, verification URL, or scans QR
   - Input is validated in real-time
   - User submits for verification

2. **Validation Stage**
   - 6-step blockchain validation process
   - Animated visual feedback
   - Progress updates with messages

3. **Result Stage**
   - **Success**: Green verified card with credential details
   - **Failure**: Red invalid card with error information

### State Management

**Context:** `VerificationContext.tsx`

Provides:
- `verificationState`: Current verification state (Idle, Validating, Verified, Invalid, Error)
- `verificationResult`: Result object with credential or error
- `validationProgress`: Current step and progress percentage
- `verifyCredential()`: Initiate verification
- `reset()`: Start new verification
- `shareVerification()`: Generate shareable link

## Trust Scoring

Issuer trust is calculated based on multiple factors:

### Algorithm
```typescript
Base Score = 0

+ Verified Issuer: 30 points
+ Website Present: 10 points
+ Email Present: 5 points
+ Recent Verification (<7 days): 25 points
+ Recent Verification (7-30 days): 15 points
+ IPFS Metadata: 15 points
+ Mainnet Network: 15 points
+ Testnet Network: 5 points

Total: 0-100 points
```

### Trust Levels
- **Excellent** (90-100): Highly trusted credential
- **Good** (75-89): Trusted credential
- **Fair** (60-74): Moderately trusted
- **Low** (<60): Limited trust indicators

## Verification Types

### Input Methods

1. **Token ID**
   - Format: `0x` + 40-64 hex characters
   - Example: `0x1a2b3c4d5e6f7g8h9i0j`

2. **Verification URL**
   - Format: `https://skillflow.io/verify?token=...`
   - Auto-extracted from URL

3. **QR Code**
   - Scanned data containing token ID or URL

## Error Handling

### Error Types

1. **Invalid Format**: Malformed input
2. **Not Found**: Credential doesn't exist
3. **Expired**: Credential past expiration date
4. **Revoked**: Issuer has revoked credential
5. **Network Error**: Connection issues
6. **Contract Error**: Blockchain verification failed

### User Guidance

Each error provides:
- Clear error message
- Error type and code
- Troubleshooting tips
- Try again option
- Security warnings

## Design System

### Colors

**Success (Verified)**
- Primary: `#10B981` (emerald-500)
- Background: `emerald-500/10`
- Border: `emerald-500/30`

**Error (Invalid)**
- Primary: `#EF4444` (red-500)
- Background: `red-500/10`
- Border: `red-500/30`

**Validating**
- Primary: `#3B82F6` (blue-500)
- Secondary: `#A855F7` (purple-500)

**Trust Levels**
- Excellent: `#10B981` (emerald)
- Good: `#22D3EE` (cyan)
- Fair: `#F59E0B` (amber)
- Low: `#EF4444` (red)

### Animations

- **Scale In**: Success checkmark (0.3s ease-out)
- **Shake**: Error icon (0.5s ease-in-out)
- **Spin**: Blockchain rings (4s-8s linear infinite)
- **Progress**: Smooth transitions (0.5s ease-out)

## Security Features

### Blockchain Validation
- Smart contract verification
- Ownership confirmation
- Cryptographic signature validation
- IPFS metadata integrity

### Trust Indicators
- Issuer verification status
- Trust score calculation
- Network verification (mainnet vs testnet)
- Recent verification timestamp

### Privacy
- No authentication required
- Public verification
- No personal data collection
- Shareable verification links

## Usage Examples

### Basic Verification

```typescript
import { VerificationProvider } from '@/features/verification/context/VerificationContext';

<VerificationProvider>
  <VerificationPage />
</VerificationProvider>
```

### Manual Verification

```typescript
const { verifyCredential } = useVerification();

const request: VerificationRequest = {
  input: '0x1a2b3c4d...',
  method: VerificationInputMethod.TokenID,
  timestamp: new Date(),
};

await verifyCredential(request);
```

### Share Verification

```typescript
const { shareVerification } = useVerification();

const shareUrl = await shareVerification();
// Copies URL to clipboard
// Returns: https://skillflow.io/verify?token=0x1a2b3c...
```

## Helper Functions

### Input Validation
- `parseVerificationInput()`: Detect input type
- `validateInputFormat()`: Validate format
- `getVerificationStateColor()`: State colors

### Trust Calculation
- `calculateTrustScore()`: Score 0-100
- `getTrustLevel()`: Level with color

### Formatting
- `formatVerificationId()`: VRF-XXXXXXXX
- `formatExplorerUrl()`: Blockchain explorer link
- `generateVerificationUrl()`: Shareable URL

### Error Handling
- `getErrorMessage()`: User-friendly messages
- `isCredentialExpired()`: Check expiration
- `getTimeUntilExpiration()`: Time remaining

## Public Access

The verification page is publicly accessible at `/verify` and does not require authentication. This allows third parties (employers, collaborators, clients) to independently verify credential authenticity.

### URL Parameters

- `token`: Auto-fill and verify token ID
- Example: `/verify?token=0x1a2b3c4d5e6f7g8h9i0j`

## Future Enhancements

- QR code scanner integration
- Batch verification support
- Verification history
- PDF export of verified credentials
- Email notification for verification
- Multi-language support
- Offline verification mode
