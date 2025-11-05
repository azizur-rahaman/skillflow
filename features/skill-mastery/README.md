# Skill Mastery Feature

**AI-Evaluated Mastery vs Self-Assessed Confidence Dashboard**

A dual-score visualization system that compares AI-evaluated skill mastery with self-assessed confidence levels, providing personalized insights and actionable recommendations.

## Overview

The Skill Mastery feature displays two key metrics for each skill:
- **AI Mastery Score** (0-100%): Evaluated based on assessments, projects, code reviews, and peer feedback
- **Self-Confidence Score** (0-100%): User's self-assessment of their skill confidence

The delta (difference) between these scores reveals:
- **Overconfident** (+20% or more): Confidence exceeds evaluated mastery → Need more practice
- **Well-Calibrated** (±20%): Aligned confidence and mastery → Good self-awareness
- **Underconfident** (-20% or more): Mastery exceeds confidence → Hidden strengths, ready for challenges

## Features

### 1. Dual Circular Gauges
```
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│      AI Mastery Gauge           │  │   Self-Confidence Gauge         │
│   ╭───────────────────╮         │  │   ╭───────────────────╮         │
│  ╱                     ╲        │  │  ╱                     ╲        │
│ │    🧠 Brain Icon      │       │  │ │    👤 User Icon       │       │
│ │         78%           │       │  │ │         85%           │       │
│ │      AI Mastery       │       │  │ │   Self-Confidence     │       │
│  ╲                     ╱        │  │  ╲                     ╱        │
│   ╰───────────────────╯         │  │   ╰───────────────────╯         │
│  [  Advanced  ]  Badge          │  │  [ Very Confident ]  Badge      │
└─────────────────────────────────┘  └─────────────────────────────────┘
```

**Visual Differences:**
- AI Gauge: Solid gradient (Indigo/Purple), sharp glow effect
- Confidence Gauge: Dotted pattern overlay, softer glow, warm colors

**Color Coding:**
- **AI Mastery:**
  - Expert (≥80%): Purple (#A855F7)
  - Advanced (60-79%): Indigo (#6366F1)
  - Intermediate (40-59%): Cyan (#22D3EE)
  - Beginner (<40%): Slate (#94A3B8)

- **Confidence:**
  - Very Confident (≥80%): Green (#10B981)
  - Confident (60-79%): Cyan (#22D3EE)
  - Somewhat Confident (40-59%): Orange (#F59E0B)
  - Not Confident (<40%): Slate (#94A3B8)

### 2. Delta Indicator
```
┌──────────────────────────────────────────────────────────────┐
│  ⚠️  Calibration Status: Overconfident         [↗] +7%       │
├──────────────────────────────────────────────────────────────┤
│  AI Mastery        ████████████████░░░░░░░░  78%             │
│  Self-Confidence   ██████████████████░░░░░░  85%             │
├──────────────────────────────────────────────────────────────┤
│  💡 Your confidence is 7% higher than your evaluated         │
│     mastery. Consider more practice to close the gap.        │
├──────────────────────────────────────────────────────────────┤
│  💡 Recommendation                                            │
│  Focus on hands-on practice and real-world projects to      │
│  align your skills with your confidence.                     │
└──────────────────────────────────────────────────────────────┘
```

**Delta Types:**
- **Overconfident** (Yellow/Orange border): Shows practice recommendations
- **Well-Calibrated** (Green border): Shows maintenance tips
- **Underconfident** (Blue border): Shows opportunity messages

### 3. Comparison Chart
```
┌────────────────────────────────────────────────────────────────┐
│  Progress Over Time - React                    [↗ +13%] [↗ +15%] │
├────────────────────────────────────────────────────────────────┤
│ 100%│                                            ●              │
│     │                                       ● ╱                 │
│  75%│                                  ● ╱                      │
│     │                             ● ╱   (Confidence - dashed)  │
│  50%│                        ● ╱                               │
│     │                   ● ╱      (Mastery - solid line)        │
│  25%│              ● ╱                                          │
│     │         ● ╱                                               │
│   0%└────────────────────────────────────────────────────────  │
│      Aug 1    Sep 1    Oct 1    Nov 1                          │
├────────────────────────────────────────────────────────────────┤
│  Legend: ━━ ● AI Mastery   ┈┈ ● Self-Confidence               │
└────────────────────────────────────────────────────────────────┘
```

**Features:**
- Dual-line chart with area fills
- Trend indicators with percentage change
- Hoverable data points with tooltips
- Responsive SVG visualization
- Grid lines at 25% intervals

### 4. Action Suggestions
```
┌──────────────────────────────────────────────────────────────┐
│  💡 Personalized Actions                    6 recommendations │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ 💻 Practice          │  │ 📚 Learn             │         │
│  │ [High Priority]      │  │ [High Priority]      │         │
│  │                      │  │                      │         │
│  │ Practice Next.js     │  │ Deepen PostgreSQL    │         │
│  │ Your confidence...   │  │ Focus on fund...     │         │
│  │                      │  │                      │         │
│  │ ⏱ 2-3 weeks          │  │ ⏱ 4-6 weeks          │         │
│  │ [Take Action →]      │  │ [Take Action →]      │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                               │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │ ✨ Validate          │  │ 🎯 Assess            │         │
│  │ [Medium Priority]    │  │ [Medium Priority]    │         │
│  │ ...                  │  │ ...                  │         │
└──────────────────────────────────────────────────────────────┘
```

**Suggestion Types:**
- 💻 **Practice**: Hands-on coding challenges
- 📚 **Learn**: Courses and tutorials
- 🎯 **Assess**: Take skill assessments
- ✨ **Validate**: Prove your skills with projects
- 👥 **Mentor**: Teaching opportunities

**Priority Levels:**
- High: Red badge (#EF4444)
- Medium: Orange badge (#F59E0B)
- Low: Cyan badge (#22D3EE)

### 5. Skill Breakdown Grid
```
┌──────────────────────────────────────────────────────────────┐
│  [Search: ___________] [Category: All ▼] [Sort: Mastery ▼]  │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │ React    [↗]   │  │ TypeScript [↗] │  │ Next.js  [→]   │ │
│  │ [frameworks]   │  │ [programming]  │  │ [frameworks]   │ │
│  │                │  │                │  │                │ │
│  │  🧠      👤    │  │  🧠      👤    │  │  🧠      👤    │ │
│  │ [78%]  [85%]   │  │ [85%]  [65%]   │  │ [72%]  [90%]   │ │
│  │ AI     Self    │  │ AI     Self    │  │ AI     Self    │ │
│  │                │  │                │  │                │ │
│  │ Delta: +7% →   │  │ Delta: -20% →  │  │ Delta: +18% →  │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Features:**
- Mini dual gauges (100px) per skill
- Category badges with color coding
- Trend indicators (↗ improving, → stable, ↘ declining)
- Search and filter capabilities
- Click to expand detailed modal view

### 6. Dashboard Summary Stats
```
┌──────────────────────────────────────────────────────────────┐
│  🏆 Mastered Skills    ✓ Well-Calibrated    ⚠️ Overconfident │
│        2                     4                    1          │
│    ≥80% mastery          Delta ≤20%          Need practice   │
├──────────────────────────────────────────────────────────────┤
│  💡 Underconfident                                            │
│        1                                                      │
│  Hidden strengths                                             │
└──────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Type Definitions (`skill-mastery.types.ts`)
- **Enums**: SkillCategory, MasteryLevel, ConfidenceLevel, DeltaType
- **Interfaces**: 
  - `SkillMastery`: Individual skill with dual scores
  - `MasterySummary`: Overall statistics
  - `ActionSuggestion`: Personalized recommendations
  - `MasteryHistoryPoint`: Historical data for charting
- **Helper Functions**: 
  - `getMasteryLevel()`, `getConfidenceLevel()`, `getDeltaType()`
  - `getDeltaColor()`, `getDeltaLabel()`, `getDeltaMessage()`
  - `generateSuggestions()`, `calculateOverallDelta()`

### Context (`SkillMasteryContext.tsx`)
- **State**: skills, summary, selectedSkill, suggestions, loading, error
- **Actions**:
  - `loadMasteryData()`: Fetch initial data
  - `selectSkill(skillId)`: View skill details
  - `updateSelfConfidence(skillId, score)`: Update confidence rating
  - `dismissSuggestion(suggestionId)`: Remove suggestion
  - `filterByCategory(category)`: Filter skills
  - `sortBy(field)`: Sort skills by mastery/confidence/delta

### Components

1. **MasteryGauge** (`MasteryGauge.tsx`)
   - Circular SVG gauge with gradient fill
   - Brain icon, percentage display
   - Color-coded by mastery level (purple→indigo→cyan→slate)
   - Props: score, label, size, strokeWidth, showLabel, animated

2. **ConfidenceGauge** (`ConfidenceGauge.tsx`)
   - Circular SVG gauge with dotted pattern overlay
   - User icon, percentage display
   - Warm color palette (green→cyan→orange→slate)
   - Softer visual style to distinguish from mastery
   - Props: score, label, size, strokeWidth, showLabel, animated

3. **DeltaIndicator** (`DeltaIndicator.tsx`)
   - Comparison bars for AI mastery vs confidence
   - Color-coded delta value and arrow icon
   - Personalized message and recommendations
   - Compact mode for inline display
   - Props: aiMastery, selfConfidence, delta, deltaType, skillName, showMessage, compact

4. **ComparisonChart** (`ComparisonChart.tsx`)
   - SVG line chart with dual lines (mastery + confidence)
   - Area fills under each line
   - Trend indicators showing percentage change
   - Hoverable data points with tooltips
   - Props: history, skillName, height

5. **ActionSuggestions** (`ActionSuggestions.tsx`)
   - Grid of suggestion cards
   - Priority badges, time estimates
   - Dismissible cards with action buttons
   - Resource links (courses, practice, videos)
   - Props: suggestions, onDismiss, onAction, maxSuggestions

6. **SkillBreakdown** (`SkillBreakdown.tsx`)
   - Grid of skill cards with mini gauges
   - Search, filter, and sort controls
   - Modal detail view for selected skill
   - Category badges and trend indicators
   - Props: skills, onSelectSkill, selectedSkillId

## Mock Data

The system includes 6 sample skills:

1. **React** (Advanced)
   - AI Mastery: 78%
   - Self-Confidence: 85%
   - Delta: +7% (Aligned)
   - Trend: Improving

2. **TypeScript** (Expert)
   - AI Mastery: 85%
   - Self-Confidence: 65%
   - Delta: -20% (Underconfident)
   - Trend: Improving

3. **Next.js** (Advanced)
   - AI Mastery: 72%
   - Self-Confidence: 90%
   - Delta: +18% (Aligned, close to overconfident)
   - Trend: Stable

4. **Node.js** (Expert)
   - AI Mastery: 80%
   - Self-Confidence: 78%
   - Delta: -2% (Aligned)
   - Trend: Improving

5. **PostgreSQL** (Intermediate)
   - AI Mastery: 55%
   - Self-Confidence: 40%
   - Delta: -15% (Aligned)
   - Trend: Stable

6. **Docker** (Intermediate)
   - AI Mastery: 45%
   - Self-Confidence: 70%
   - Delta: +25% (Overconfident)
   - Trend: Declining

Each skill includes 4 historical data points (Aug-Nov 2025).

## Design System Compliance

### Colors
- **Background**: #0F172A (slate-950)
- **Cards**: #1E293B (slate-900/slate-800 gradients)
- **Borders**: #334155 (slate-700)
- **Primary**: #6366F1 (indigo-500) - AI mastery
- **Secondary**: #22D3EE (cyan-500) - Confidence
- **Success**: #10B981 (green-500) - Aligned/positive
- **Warning**: #F59E0B (orange-500) - Overconfident
- **Error**: #EF4444 (red-500) - Critical issues
- **Info**: #6366F1 (indigo-500) - Underconfident opportunities

### Typography
- **Font**: Inter for UI text
- **Weights**: 
  - Bold (700) for headings and scores
  - Semibold (600) for labels
  - Medium (500) for descriptions
  - Regular (400) for body text

### Spacing & Layout
- **Container**: max-w-7xl (centered)
- **Card padding**: p-6 to p-8
- **Grid gaps**: gap-4 to gap-8
- **Border radius**: rounded-xl (12px) for cards

### Interactive Elements
- **Hover states**: border-indigo-500/50, scale transformations
- **Transitions**: duration-300 for smooth animations
- **Focus states**: focus:outline-none, focus:border-indigo-500

## Route

**Path**: `/app/(dashboard)/mastery/page.tsx`

**Layout**: Uses dashboard layout group with navigation sidebar

## Usage

```tsx
import MasteryDashboard from '@/app/(dashboard)/mastery/page';

// The dashboard is self-contained with SkillMasteryProvider
<MasteryDashboard />
```

## Production Readiness

### Completed
- ✅ Comprehensive type system with enums and interfaces
- ✅ Context provider with state management
- ✅ All 6 visualization components
- ✅ Main dashboard page with responsive layout
- ✅ Mock data with 6 skills and historical tracking
- ✅ Error handling and loading states
- ✅ Design system compliance
- ✅ Zero TypeScript compilation errors
- ✅ Accessible color contrasts
- ✅ Smooth animations and transitions

### Next Steps for Production
- [ ] Replace mock data with real API integration
- [ ] Add backend for AI evaluation (assessments, code analysis)
- [ ] Implement confidence rating update API
- [ ] Add data persistence (save user confidence ratings)
- [ ] Integrate with assessment system for mastery scores
- [ ] Add authentication and user-specific data
- [ ] Implement suggestion action handlers (navigate to courses/practice)
- [ ] Add analytics tracking (view skill details, dismiss suggestions)
- [ ] Create onboarding flow explaining dual scores
- [ ] Add export functionality (PDF report of skills)
- [ ] Implement skill comparison (compare 2+ skills)
- [ ] Add timeline view (monthly/yearly progress)
- [ ] Create mobile-optimized layouts
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)

## File Structure

```
features/skill-mastery/
├── types/
│   └── skill-mastery.types.ts      (400+ lines)
├── context/
│   └── SkillMasteryContext.tsx     (350+ lines)
└── presentation/
    └── components/
        ├── MasteryGauge.tsx        (140+ lines)
        ├── ConfidenceGauge.tsx     (150+ lines)
        ├── DeltaIndicator.tsx      (200+ lines)
        ├── ComparisonChart.tsx     (250+ lines)
        ├── ActionSuggestions.tsx   (200+ lines)
        ├── SkillBreakdown.tsx      (250+ lines)
        └── index.ts                (barrel export)

app/(dashboard)/
└── mastery/
    └── page.tsx                    (280+ lines)
```

**Total**: 10 files, ~2,220 lines of code

## Key Insights

The dual-score system provides unique value:

1. **Self-Awareness**: Reveals how users perceive their skills vs reality
2. **Targeted Growth**: Different recommendations based on delta type
3. **Confidence Building**: Highlights hidden strengths (underconfident skills)
4. **Risk Mitigation**: Identifies overconfidence before it causes issues
5. **Progress Tracking**: Historical data shows calibration improvements over time

This creates a feedback loop where users become more accurate in self-assessment while simultaneously improving their actual skills.
