# Credential Minting Feature

Multi-step wizard for minting verified credentials with blockchain integration, evidence verification, and soft futuristic animations.

## Overview

The Credential Minting feature provides a complete flow for users to mint blockchain-based skill credentials after completing milestones, with step-by-step guidance, evidence verification, and smooth animations.

## Features

### 🎯 Multi-Step Wizard
- **5-Step Flow**: Skill Selection → Evidence Verification → Confirmation → Minting → Success
- **Visual Stepper**: Progress indicator with completed/active/upcoming states
- **Step Validation**: Prevent progression without required data
- **Navigation**: Forward/backward navigation with state preservation

### 🔍 Evidence Verification
- **Multiple Evidence Types**: Certificate, Project, Assessment, Portfolio, GitHub, Video, Document
- **Upload System**: URL submission with title and description
- **AI Verification**: Automated evidence verification (simulated)
- **Requirements Tracking**: Real-time validation against skill requirements
- **Progress Indicator**: Visual completion percentage

### ⛓️ Blockchain Integration
- **IPFS Upload**: Metadata storage on IPFS
- **Multi-Network**: Polygon, Ethereum support
- **Transaction Tracking**: Real-time transaction status
- **Gas Estimation**: Cost and time estimates
- **Smart Contract**: ERC-1155 token minting

### 🎨 Soft Futuristic Design
- **Gradient Glows**: Radial gradients on active elements
- **Smooth Animations**: CSS transitions and keyframe animations
- **Blockchain Visuals**: Spinning rings, pulse effects
- **Success Celebration**: Bounce animations, confetti-style effects
- **Progress Bars**: Animated progress with gradient fills

### ✨ Animations
- **Stepper Animations**: Pulsing rings, glow effects on active step
- **Blockchain Minting**: Spinning circles with status colors
- **Success Animation**: Bouncing check icon with gradient glow
- **Loading States**: Smooth spinners and skeleton screens
- **Transitions**: Fade-ins, slide-ups, scale animations

## Architecture

### File Structure
```
features/credential-minting/
├── types/
│   └── minting.types.ts              # 500+ lines of types and helpers
├── context/
│   └── MintingContext.tsx            # State management
└── presentation/
    └── components/
        ├── StepperWizard.tsx          # Step navigation
        ├── SkillSelection.tsx         # Step 1: Select skill
        ├── EvidenceVerification.tsx   # Step 2: Upload evidence
        ├── MintingSteps.tsx           # Steps 3-5: Confirm, mint, success
        └── index.ts                   # Barrel exports

app/(dashboard)/mint/
└── page.tsx                           # Main minting page
```

### Type System

#### Enums (5)
- **`MintingStep`**: SkillSelection, EvidenceVerification, Confirmation, Minting, Success
- **`EvidenceType`**: Certificate, Project, Assessment, Portfolio, GitHub, Video, Document
- **`EvidenceStatus`**: Pending, Verifying, Verified, Rejected
- **`MintingStatus`**: Idle, Preparing, UploadingMetadata, WaitingApproval, Minting, Confirming, Success, Failed
- **`BlockchainAnimationState`**: Idle, Connecting, Processing, Confirming, Complete, Error

#### Core Interfaces (10+)
- **`MintableSkill`**: Completed skill eligible for minting
- **`SkillMilestone`**: Individual achievement milestone
- **`EvidenceSubmission`**: Uploaded evidence with verification status
- **`CredentialMetadata`**: Full metadata for blockchain token
- **`MintingTransaction`**: Blockchain transaction details
- **`MintingConfirmation`**: Summary before minting
- **`MintingResult`**: Result of minting operation

### State Management

Context provides:
```typescript
interface CredentialMintingContextState {
  currentStep: MintingStep;
  selectedSkill: MintableSkill | null;
  evidence: EvidenceSubmission[];
  metadata: CredentialMetadata | null;
  transaction: MintingTransaction | null;
  mintingStatus: MintingStatus;
  animationState: BlockchainAnimationState;
  
  loadMintableSkills: () => Promise<void>;
  selectSkill: (skillId: string) => void;
  addEvidence: (evidence) => Promise<void>;
  verifyEvidence: (evidenceId: string) => Promise<void>;
  mintCredential: () => Promise<MintingResult>;
  // ... more actions
}
```

## Components

### StepperWizard
Visual progress indicator with:
- Numbered step circles
- Check icons for completed steps
- Gradient progress bar
- Animated glow on active step
- Pulsing ring animation
- Click navigation (accessible steps only)

### SkillSelection
Skill selection cards with:
- Skill image and details
- Eligibility badges (Eligible/Not Eligible)
- Stats grid (Level, Milestones, Value)
- Milestones preview
- Selection indicator
- Hover effects

### EvidenceVerification
Evidence upload interface with:
- Evidence type selector (7 types with icons/colors)
- Title, description, URL inputs
- Upload progress
- Evidence cards with status badges
- Verify/Remove actions
- Requirements checklist
- Completion percentage
- Validation warnings

### ConfirmationSummary
Review screen with:
- Credential preview card
- Network and cost details
- Evidence count
- Edit/Confirm buttons
- Estimated time and gas

### MintingProgress
Blockchain animation with:
- Spinning concentric circles
- Status-colored borders and glows
- Central status icon
- Animated progress bar
- Transaction hash display
- Dynamic status messages

### SuccessAnimation
Celebration screen with:
- Bouncing success icon
- Gradient glow pulse effect
- Credential summary card
- Token ID and network info
- View/Mint Another actions

## Minting Flow

### Step 1: Skill Selection
1. Load eligible skills from completed milestones
2. Display skill cards with eligibility status
3. Select skill (must be eligible with level ≥ 50)
4. Proceed to evidence upload

### Step 2: Evidence Verification
1. View skill requirements (required/optional evidence types)
2. Select evidence type (Certificate, Project, etc.)
3. Fill title, description, URL
4. Submit evidence
5. Verify evidence (AI verification simulation)
6. Repeat until all requirements satisfied
7. Proceed to confirmation

### Step 3: Confirmation
1. Review credential details
2. Check network, cost, time estimates
3. Confirm or edit
4. Initiate minting process

### Step 4: Minting (Automated)
1. **Preparing**: Generate credential data
2. **Uploading Metadata**: Upload to IPFS (1.5s animation)
3. **Waiting Approval**: Wallet approval request (2s)
4. **Minting**: Execute blockchain transaction (2.5s)
5. **Confirming**: Wait for block confirmation (2s)
6. **Success**: Token minted, transition to success

### Step 5: Success
1. Display success animation
2. Show minted credential details
3. Options: View Credential or Mint Another

## Design System

### Colors
- **Background**: `#0F172A` (slate-950), `#1E293B` (slate-900)
- **Borders**: `#334155` (slate-700)
- **Primary**: `#6366F1` (indigo-500), `#A855F7` (purple-500)
- **Success**: `#10B981` (emerald-400)
- **Warning**: `#F59E0B` (amber-400)
- **Error**: `#EF4444` (red-400)

### Evidence Type Colors
- Certificate: `#6366F1` (Indigo)
- Project: `#8B5CF6` (Purple)
- Assessment: `#10B981` (Emerald)
- Portfolio: `#F59E0B` (Amber)
- GitHub: `#6B7280` (Gray)
- Video: `#EF4444` (Red)
- Document: `#3B82F6` (Blue)

### Animations
```css
/* Stepper Glow */
.step-glow {
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
  animation: pulse 2s infinite;
}

/* Blockchain Spinner */
.blockchain-ring {
  border: 4px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366F1;
  animation: spin 2s linear infinite;
}

/* Success Bounce */
.success-icon {
  animation: bounce 1s ease-in-out infinite;
}
```

## Helper Functions

### Validation
```typescript
validateSkillEligibility(skill): boolean
validateEvidenceRequirements(evidence, requirements): { valid, missing }
calculateEvidenceCompletion(evidence, requirements): number
```

### Formatting
```typescript
formatFileSize(bytes): string
getEvidenceTypeIcon(type): string
getEvidenceTypeColor(type): string
getMintingStatusColor(status): string
getMintingStatusMessage(status): string
```

### Estimation
```typescript
estimateMintingCost(network): string  // "$0.01 - $0.05"
estimateMintingTime(network): string  // "2-5 minutes"
```

### Generation
```typescript
generateCredentialName(skill, level): string  // "React.js Expert"
generateCredentialDescription(skill): string
generateMetadataAttributes(skill): CredentialAttribute[]
```

## Mock Data

Context provides 3 mock skills:
1. **React.js Expert** (Level 92, 3 milestones, eligible)
2. **TypeScript Advanced** (Level 88, 2 milestones, eligible)
3. **Node.js Backend** (Level 75, 1 milestone, eligible)

Each with:
- Completed milestones with XP
- Evidence requirements
- Estimated value
- Completion dates

## Usage

### Basic Implementation
```tsx
import MintCredentialPage from '@/app/(dashboard)/mint/page';

// Route: /mint
// Automatically handles full minting flow
```

### With Context
```tsx
import { useCredentialMinting } from '@/features/credential-minting/context/MintingContext';

function CustomComponent() {
  const {
    currentStep,
    selectedSkill,
    mintCredential,
    nextStep
  } = useCredentialMinting();
  
  // Use minting state and actions
}
```

### Individual Components
```tsx
import {
  StepperWizard,
  SkillSelection,
  EvidenceVerification,
} from '@/features/credential-minting/presentation/components';

<StepperWizard
  currentStep={currentStep}
  steps={steps}
  completedSteps={completedSteps}
/>
```

## API Integration (Future)

### Endpoints to Implement
```typescript
// Load eligible skills
GET /api/minting/eligible-skills

// Upload evidence
POST /api/minting/evidence
{
  skillId: string,
  type: EvidenceType,
  title: string,
  description: string,
  url?: string,
  file?: File
}

// Verify evidence
POST /api/minting/evidence/:id/verify

// Mint credential
POST /api/minting/mint
{
  skillId: string,
  evidenceIds: string[],
  metadata: CredentialMetadata
}
```

## Performance

### Optimizations
- Lazy loading of evidence images
- Debounced form inputs
- Memoized validation calculations
- Optimistic UI updates
- Animation performance (CSS transforms)

### Bundle Size
- Tree-shakable exports
- Shared type system
- Minimal dependencies
- Optimized animations

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in wizard
- Screen reader friendly status messages
- Color contrast compliance (WCAG AA)

## Future Enhancements

- [ ] File upload with drag-and-drop
- [ ] Batch minting multiple credentials
- [ ] Custom credential templates
- [ ] Evidence preview/lightbox
- [ ] Shareable verification links
- [ ] Minting history dashboard
- [ ] NFT marketplace integration
- [ ] Advanced evidence types (video, audio)
- [ ] Multi-signature credentials
- [ ] Credential expiration settings

## Dependencies

- **React 18+**: Component framework
- **Next.js 14+**: App router and navigation
- **Lucide Icons**: Icon library
- **Wallet Types**: Shared type system

## Related Features

- **Wallet**: View and manage minted credentials
- **Credential Detail**: View full credential details
- **Profile**: Display credentials in profile
- **Skills**: Track skill progress and milestones

## License

Part of the SkillFlow platform. See main project LICENSE.
