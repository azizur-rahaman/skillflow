# Data Connection Wizard Feature

## Overview
Multi-step wizard for connecting professional data sources (LinkedIn, GitHub, Resume, Upwork) with OAuth flows, progress tracking, and animated success states.

## Components Architecture

### Core Context
- **DataConnectionContext.tsx**: State management for wizard flow and connector status
- **connector.types.ts**: TypeScript interfaces for connectors, OAuth config, wizard steps

### UI Components

#### 1. ConnectorCard
Interactive card for each data source with:
- **Status Indicators**: idle → connecting → connected → error
- **Dynamic Icons**: Lucide icons with color coding
- **Connection Stats**: Data points extracted, last sync timestamp
- **Action Buttons**: Connect/Disconnect with gradient styling
- **Success Glow**: Radial gradient effect on successful connection
- **Required Badge**: Visual indicator for mandatory connectors

#### 2. ProgressSteps
Step-by-step progress indicator with:
- **Gradient Progress Bar**: Animated width transition (4F46E5 → A855F7 → 22D3EE)
- **Active Highlights**: Scaled circle with glow effect
- **Completed Checkmarks**: Filled circles with check icons
- **Step Labels**: Title and description with color states
- **Optional Badges**: Visual indicator for skippable steps

#### 3. ResumeUpload
Drag-and-drop file upload with:
- **Drop Zone**: Dashed border with hover states
- **File Input**: Hidden input with styled label button
- **Upload Progress**: Animated progress bar (0-100%)
- **Success State**: Green card with extracted data count
- **Info Cards**: AI extraction, privacy, processing speed

#### 4. SuccessAnimation
Celebration overlay with:
- **Confetti Effect**: 30 colored particles with physics animation
- **Pulse Ring**: Expanding circle behind checkmark
- **Check Icon**: Animated stroke drawing effect
- **Sparkles**: Rotating star icons with delayed appearance
- **Auto-hide**: 3-second display with fade-out

## Wizard Flow (3 Steps)

### Step 1: Professional Profiles (Required)
- **LinkedIn**: Import experience, skills, endorsements
- **GitHub**: Analyze repos, contributions, coding skills
- **Status**: Must connect at least LinkedIn OR GitHub

### Step 2: Resume Upload (Optional)
- **File Types**: PDF, DOCX (Max 10MB)
- **AI Processing**: GPT-4 skill extraction
- **Progress**: Real-time upload percentage
- **Status**: Can skip if profiles connected

### Step 3: Additional Sources (Optional)
- **Upwork**: Freelance projects and reviews
- **Status**: Fully optional, can skip

## Design Features

### Color Palette
- **LinkedIn**: `#0A66C2` (Official blue)
- **GitHub**: `#4F46E5` (Indigo)
- **Resume**: `#A855F7` (Purple)
- **Upwork**: `#22D3EE` (Cyan)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)

### Connection States
```typescript
type ConnectionStatus = 
  | 'idle'       // Not connected, default state
  | 'connecting' // OAuth flow in progress
  | 'connected'  // Successfully linked
  | 'error'      // Connection failed
  | 'syncing'    // Background data sync
```

### Animations
- `success-pop`: Success card entrance (0.5s ease-out)
- `check-draw`: SVG checkmark stroke animation (0.5s)
- `sparkle`: Rotating star appearance (1s)
- `confetti`: Particle explosion physics (1.5s)

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Color-blind friendly status indicators
- Skip options for optional steps
- Progress announcements for screen readers

## OAuth Flow Simulation

```typescript
const connectProvider = async (provider: ConnectorType) => {
  // 1. Set status to 'connecting'
  // 2. Simulate OAuth popup/redirect (2s delay)
  // 3. Extract random data points (50-150)
  // 4. Set status to 'connected'
  // 5. Trigger success animation
};
```

## State Management

### Context API
```typescript
interface DataConnectionContextType {
  state: WizardState;
  connectProvider: (provider: ConnectorType) => Promise<void>;
  disconnectProvider: (provider: ConnectorType) => void;
  uploadResume: (file: File) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  completeWizard: () => void;
}
```

### Wizard State
```typescript
interface WizardState {
  currentStep: number;        // 0-2
  totalSteps: number;         // 3
  connectors: Connector[];    // Array of 4 connectors
  isComplete: boolean;        // Wizard finished
}
```

## Usage Example

```tsx
import { DataConnectionProvider } from '@/features/connectors/context/DataConnectionContext';
import ConnectorCard from '@/features/connectors/presentation/components/ConnectorCard';

function App() {
  const handleComplete = () => {
    router.push('/dashboard');
  };

  return (
    <DataConnectionProvider onComplete={handleComplete}>
      <ConnectDataContent />
    </DataConnectionProvider>
  );
}
```

## Routes
- `/connect-data` - Main data connection wizard page

## File Structure
```
features/connectors/
├── context/
│   └── DataConnectionContext.tsx (State + wizard logic)
├── types/
│   └── connector.types.ts (TypeScript interfaces)
└── presentation/
    └── components/
        ├── ConnectorCard.tsx (Individual connector)
        ├── ProgressSteps.tsx (Wizard progress bar)
        ├── ResumeUpload.tsx (File upload zone)
        └── SuccessAnimation.tsx (Celebration overlay)

app/(onboarding)/
└── connect-data/
    └── page.tsx (Main wizard page)
```

## Integration Points

### Future Enhancements
- [ ] Real OAuth integration (LinkedIn, GitHub APIs)
- [ ] Backend API for resume processing
- [ ] WebSocket for real-time sync status
- [ ] Error retry logic with exponential backoff
- [ ] Connection health monitoring
- [ ] Data refresh scheduler
- [ ] Multi-account support per connector
- [ ] Connection history logs
- [ ] Privacy controls per connector
- [ ] Export connected data

### API Endpoints (To Implement)
```
POST /api/connectors/linkedin/connect
POST /api/connectors/github/connect
POST /api/connectors/upwork/connect
POST /api/connectors/resume/upload
GET  /api/connectors/status
DELETE /api/connectors/{provider}/disconnect
```

## Security Considerations
- OAuth tokens stored in secure HTTP-only cookies
- Resume files encrypted at rest (AES-256)
- CSRF protection on all endpoints
- Rate limiting on connection attempts
- Webhook signature validation
- PII data anonymization option

## Performance
- Lazy load connector cards
- Debounced file upload
- Optimistic UI updates
- Progressive enhancement
- Code splitting by step
- Image/icon sprite optimization

## Testing Strategy
- Unit tests for context logic
- Integration tests for OAuth flows
- E2E tests for complete wizard
- Visual regression tests for animations
- Accessibility audits (WCAG 2.1 AA)
