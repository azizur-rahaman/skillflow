# Wallet Connection Feature

Secure blockchain wallet connection screen with glassmorphism design, MetaMask and WalletConnect support, step-by-step safety guidance, and success animations.

## Overview

The wallet connection feature provides a beautiful, secure interface for users to link their blockchain wallets to SkillFlow. It features glassmorphic design with soft neon glows, real-time connection status, safety tips sidebar, and success animations with confetti effects.

## Architecture

### Feature Structure
```
features/wallet-connection/
├── types/
│   └── wallet-connection.types.ts  # Type definitions and helper functions
├── context/
│   └── WalletConnectionContext.tsx # State management
└── presentation/
    └── components/
        ├── WalletProviderButton.tsx    # Glassmorphic provider selection
        ├── SafetySidebar.tsx           # Safety tips and guidance
        ├── ConnectionStatus.tsx        # Live connection indicator
        └── SuccessAnimation.tsx        # Success checkmark with confetti

app/(onboarding)/connect-wallet/
└── page.tsx                        # Main wallet connection page
```

## Core Components

### 1. Wallet Provider Button
**File:** `WalletProviderButton.tsx`

Glassmorphic button with soft neon glow for wallet provider selection.

Features:
- **Glassmorphism design** - Frosted glass effect with blur
- **Neon glow states** - Soft glow on hover, bright glow on active
- **Provider detection** - Shows "Installed" or "Download" status
- **Recommended badge** - Highlights recommended providers
- **Feature list** - Displays provider capabilities
- **Disabled state** - Grayed out when connection in progress

Supported Providers:
- **MetaMask** - Browser extension wallet (recommended for beginners)
- **WalletConnect** - Multi-wallet connection protocol
- **Coinbase Wallet** - Coinbase's mobile/extension wallet
- **Trust Wallet** - Mobile-first wallet

### 2. Safety Sidebar
**File:** `SafetySidebar.tsx`

Step-by-step safety guidance with security best practices.

Features:
- **Step-based tips** - Contextual advice based on connection step
- **Priority levels** - High, medium, low priority indicators
- **Category icons** - Visual icons for Security, Privacy, Verification, Best Practice
- **Expandable details** - Click to see full tip description
- **Sticky positioning** - Stays visible during scroll
- **Compact mode** - Mobile-friendly collapsed view

Safety Categories:
- **Security** - Protect your wallet and private keys
- **Privacy** - Data protection and anonymity tips
- **Verification** - How to verify legitimacy
- **Best Practice** - General recommendations

### 3. Connection Status
**File:** `ConnectionStatus.tsx`

Live connection status indicator with real-time progress tracking.

Features:
- **Status states** - Disconnected, Connecting, Connected, Error, Rejected
- **Progress bar** - 0-100% completion with smooth animations
- **Step tracking** - Shows current connection step
- **Wallet address** - Displays connected address with copy button
- **Animated icons** - Pulsing/spinning animations for active states
- **Color coding** - Green (connected), Blue (connecting), Red (error)

Connection Steps:
1. **Idle** - Ready to connect
2. **SelectingProvider** - Choosing wallet type
3. **RequestingPermission** - Awaiting user approval
4. **VerifyingSignature** - Validating cryptographic signature
5. **Connecting** - Establishing connection
6. **Connected** - Successfully linked

### 4. Success Animation
**File:** `SuccessAnimation.tsx`

Celebratory animation shown after successful connection.

Features:
- **Checkmark animation** - Smooth scale-in and path drawing
- **Confetti effect** - 20 colorful particles with physics
- **Glow effect** - Radial emerald gradient background
- **Wallet details** - Shows connected address and network
- **Auto-complete** - Automatically continues after 3 seconds
- **Backdrop blur** - Frosted glass overlay

Animation Sequence:
1. Backdrop fade-in (0.3s)
2. Card scale-in (0.4s)
3. Checkmark draw (0.6s)
4. Confetti burst (1s)
5. Auto-complete (3s total)

## Connection Flow

### User Journey

1. **Landing**
   - User arrives at wallet connection page
   - Sees available wallet providers
   - Reads safety tips in sidebar

2. **Provider Selection**
   - User clicks MetaMask or WalletConnect button
   - Button shows neon glow on hover
   - Safety sidebar shows relevant tips

3. **Permission Request**
   - Provider popup appears (external)
   - User approves connection in wallet
   - Connection status shows "Connecting..."

4. **Signature Verification**
   - System verifies cryptographic signature
   - Progress bar updates in real-time
   - Status shows validation step

5. **Success**
   - Connection established
   - Success animation plays with confetti
   - Wallet details displayed
   - User redirected to dashboard

### Error Handling

**Common Errors:**
- **User Rejected** - User declined connection in wallet
- **Provider Not Found** - Wallet extension not installed
- **Network Error** - Connection timeout or network issue
- **Invalid Signature** - Signature verification failed

**Error Display:**
- Red error banner with clear message
- Suggestion for resolution
- Try again option
- Help link for support

## State Management

**Context:** `WalletConnectionContext.tsx`

### State Variables

- `connectionStatus`: Current connection state (Disconnected/Connecting/Connected/Error/Rejected)
- `connectionProgress`: Current step and progress percentage
- `connectedWallet`: Wallet info (address, provider, network, balance)
- `availableProviders`: List of detected wallet providers
- `safetyTips`: Contextual safety guidance
- `loading`: Loading state for async operations
- `error`: Error object with message and suggestion

### Methods

- `connectWallet(provider)`: Initiate wallet connection
- `disconnectWallet()`: Remove wallet connection
- `switchNetwork(chainId)`: Change blockchain network
- `requestSignature(message)`: Request message signing
- `getBalance()`: Fetch wallet balance

## Design System

### Glassmorphism

**Background:**
- `bg-slate-900/90` - Semi-transparent dark background
- `backdrop-blur-xl` - Frosted glass blur effect
- `border border-slate-700/50` - Subtle border

**Hover State:**
- `hover:bg-slate-800/90` - Slightly lighter on hover
- `hover:border-indigo-500/50` - Neon border glow
- `hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]` - Soft neon shadow

**Active/Selected:**
- `ring-2 ring-indigo-500/50` - Bright neon ring
- `shadow-[0_0_40px_rgba(99,102,241,0.5)]` - Strong neon glow

### Colors

**Connection States:**
- Disconnected: `#64748B` (slate-500)
- Connecting: `#3B82F6` (blue-500)
- Connected: `#10B981` (emerald-500)
- Error: `#EF4444` (red-500)
- Rejected: `#F59E0B` (amber-500)

**Neon Glows:**
- Indigo: `rgba(99, 102, 241, 0.3)` - MetaMask
- Purple: `rgba(168, 85, 247, 0.3)` - WalletConnect
- Emerald: `rgba(16, 185, 129, 0.3)` - Success

### Animations

**Pulse (Connecting):**
```css
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

**Scale In (Success):**
```css
@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
animation: scale-in 0.4s ease-out;
```

**Confetti:**
```css
@keyframes confetti {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) rotate(720deg);
    opacity: 0;
  }
}
animation: confetti 1s linear forwards;
```

## Safety & Security

### Best Practices

1. **Never share private keys** - SkillFlow will never ask for your seed phrase
2. **Verify URLs** - Ensure you're on the official SkillFlow domain
3. **Use hardware wallets** - For large holdings, use Ledger or Trezor
4. **Check permissions** - Review what access you're granting
5. **Enable 2FA** - Add extra security to your wallet

### Safety Tip System

Tips are categorized and prioritized based on connection step:

**High Priority:**
- "Never share your private key or seed phrase"
- "Always verify the URL before connecting"
- "Check wallet permissions before approving"

**Medium Priority:**
- "Enable 2FA on your wallet for extra security"
- "Use a strong, unique password"
- "Keep your wallet software up to date"

**Low Priority:**
- "Consider using a hardware wallet for large amounts"
- "Bookmark SkillFlow to avoid phishing sites"
- "Review transaction history regularly"

### Network Detection

Supported networks with automatic detection:

- **Ethereum Mainnet** (chainId: 1)
- **Polygon** (chainId: 137)
- **Binance Smart Chain** (chainId: 56)
- **Goerli Testnet** (chainId: 5)
- **Mumbai Testnet** (chainId: 80001)

## Usage Examples

### Basic Connection

```typescript
import { WalletConnectionProvider, useWalletConnection } from '@/features/wallet-connection/context/WalletConnectionContext';

function MyComponent() {
  const { connectWallet, connectedWallet } = useWalletConnection();

  const handleConnect = async () => {
    await connectWallet(WalletProvider.MetaMask);
  };

  return (
    <button onClick={handleConnect}>
      {connectedWallet ? `Connected: ${connectedWallet.address}` : 'Connect Wallet'}
    </button>
  );
}
```

### Check Connection Status

```typescript
const { connectionStatus, connectionProgress } = useWalletConnection();

if (connectionStatus === ConnectionStatus.Connecting) {
  return <p>Connecting... {connectionProgress?.progress}%</p>;
}

if (connectionStatus === ConnectionStatus.Connected) {
  return <p>✓ Connected</p>;
}
```

### Handle Errors

```typescript
const { error, connectWallet } = useWalletConnection();

const handleConnect = async () => {
  try {
    await connectWallet(WalletProvider.MetaMask);
  } catch (err) {
    console.error('Connection failed:', error?.message);
    // error.suggestion provides user-friendly resolution steps
  }
};
```

### Request Signature

```typescript
const { requestSignature } = useWalletConnection();

const signMessage = async () => {
  const signature = await requestSignature('Welcome to SkillFlow!');
  console.log('Signature:', signature);
};
```

## Helper Functions

### Provider Detection
- `getAvailableProviders()`: Detect installed wallet extensions
- `isProviderInstalled(provider)`: Check if specific provider exists
- `getRecommendedProvider()`: Get recommended provider for user

### Formatting
- `formatWalletAddress(address, chars)`: Shorten address (0x1234...5678)
- `getNetworkByChainId(chainId)`: Get network info from chain ID
- `getNetworkIcon(chainId)`: Get network icon URL

### Error Handling
- `getErrorMessage(code)`: User-friendly error messages
- `getErrorSuggestion(code)`: Resolution suggestions
- `isUserRejection(error)`: Check if user declined

### Progress Tracking
- `getConnectionStepProgress(step)`: Get progress percentage for step
- `getNextStep(currentStep)`: Get next step in flow

## Accessibility

### Keyboard Navigation
- All buttons focusable with Tab
- Enter/Space to activate buttons
- Escape to close modals

### Screen Readers
- ARIA labels on all interactive elements
- Live regions for status updates
- Semantic HTML structure

### Color Contrast
- WCAG AA compliant color ratios
- Non-color indicators (icons, text)
- High contrast mode support

## Performance

### Optimizations
- Lazy load wallet provider SDKs
- Debounced connection attempts
- Memoized provider detection
- Optimistic UI updates

### Bundle Size
- Total feature size: ~45KB gzipped
- WalletConnect SDK: Loaded on demand
- Animations: CSS-based (no JS libraries)

## Future Enhancements

- QR code scanning for mobile wallets
- Multi-wallet support (connect multiple wallets)
- Wallet activity feed
- Transaction history
- ENS name resolution
- NFT avatar display
- Gas fee estimation
- Network switching UI
- Wallet balance chart
- Export connection data
