# Onboarding Walkthrough Feature

## Overview
Interactive step-by-step onboarding experience with overlay tooltips and dashboard previews following the SkillFlow design system.

## Components

### Core Context
- **OnboardingContext.tsx**: State management for tour progression
- **onboarding.types.ts**: TypeScript interfaces for steps and state

### UI Components
- **OnboardingOverlay.tsx**: Main wrapper combining backdrop and tooltip
- **OnboardingBackdrop.tsx**: Dark blur overlay (90% opacity)
- **OnboardingTooltip.tsx**: Interactive tooltip card with:
  - Step progress indicator
  - Icon illustrations
  - Feature bullet points
  - Next/Back/Skip navigation

### Dashboard Previews
- **SkillDNAPreview.tsx**: Animated DNA helix rings with skill labels
- **ForecastPreview.tsx**: Trend chart with emerging skills list
- **MarketplacePreview.tsx**: Token cards with ratings and prices

## Tour Flow (5 Steps)

1. **Welcome** - Introduction to SkillFlow features
2. **Skill DNA** - Explain skill fingerprint visualization
3. **Forecast** - Show demand prediction capabilities
4. **Marketplace** - Demonstrate blockchain credentials
5. **Complete** - Call-to-action to get started

## Design Features

### Colors (Brand Palette)
- **Navy Background**: `#0F172A`
- **Indigo Primary**: `#4F46E5`
- **Purple Secondary**: `#A855F7`
- **Cyan Highlight**: `#22D3EE`

### Animations
- `fade-in`: Backdrop entrance (0.5s)
- `slide-up`: Tooltip appearance (0.5s)
- `pulse-ring`: DNA helix rings (2.5s loop)
- `particle-float`: Background particles (5s loop)

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Skip tour option on every step
- Progress indicator for screen readers

## Usage

```tsx
import { OnboardingProvider } from '@/features/onboarding/context/OnboardingContext';
import OnboardingOverlay from '@/features/onboarding/presentation/components/OnboardingOverlay';

const steps = [/* your steps */];

function App() {
  return (
    <OnboardingProvider steps={steps} onComplete={handleComplete}>
      <YourContent />
      <OnboardingOverlay />
    </OnboardingProvider>
  );
}
```

## Routes
- `/tour` - Main onboarding walkthrough page

## State Management
- Current step tracking
- Completion status
- Active/inactive toggle
- Step navigation (next, previous, skip, goto)

## Future Enhancements
- [ ] Spotlight effect on target elements
- [ ] Animated step transitions
- [ ] Progress persistence (localStorage)
- [ ] Mobile responsive positioning
- [ ] Video/GIF illustrations option
- [ ] Multi-language support
