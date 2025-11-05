# Profile Management Feature

## Overview
Modern profile screen with circular avatar upload, inline editable fields, skill tag management, and real-time profile completion tracking. Built following futuristic minimal design system with glassmorphism, neon accents, and dark-first aesthetic.

## Components Architecture

### Core Context
- **ProfileContext.tsx**: State management for profile editing, completion tracking, skill management
- **profile.types.ts**: TypeScript interfaces for UserProfile, ProfileCompletion, EditState

### UI Components

#### 1. AvatarUpload
Circular avatar with drag-and-drop upload functionality:
- **Upload States**: Empty (User icon), Preview, Uploading (progress), Error
- **Interactions**: Click to select, drag-and-drop, hover overlay
- **Validation**: 
  - Accepted formats: JPG, PNG, WebP
  - Max size: 5MB
  - Visual error messages
- **Design Features**:
  - 128px circular container
  - Indigo gradient border on upload
  - Pulsing glow effect (animate-avatar-glow)
  - Camera icon overlay on hover
  - Remove button (top-right, appears on hover)
  - Upload progress bar below avatar
- **Accessibility**: ARIA labels, keyboard support

#### 2. EditableField
Inline editable text field with save/cancel actions:
- **Modes**: View mode (clickable), Edit mode (input/textarea)
- **Props**:
  - `field`: ProfileSection type
  - `label`: Field label with optional icon
  - `placeholder`: Empty state text
  - `multiline`: Toggle between input/textarea
  - `maxLength`: Character limit
  - `required`: Required field indicator
- **Features**:
  - Pencil icon (appears on hover in view mode)
  - Character counter
  - Save/Cancel buttons in edit mode
  - Loading state during save (Loader2 spinner)
  - "Saved" indicator with checkmark
  - Auto-focus on edit
  - Keyboard shortcuts: Enter to save, Escape to cancel
- **Animations**: field-focus animation on edit mode entry

#### 3. SkillTagInput
Skill tag management with suggestions:
- **Current Skills Section**:
  - Skill chips with gradient background (indigo → purple)
  - Remove button (X icon, appears on hover)
  - Empty state placeholder
  - Skill count display
- **Add Skill Input**:
  - Text input with placeholder
  - Add button (Plus icon)
  - Enter key support
- **Suggested Skills Section** (AI-powered):
  - Cyan-themed suggestion chips
  - Source indicators (LinkedIn, GitHub, Resume, AI)
  - Accept (checkmark) and Dismiss (X) buttons
  - Hover to reveal action buttons
  - Sparkles icon for AI suggestions
- **Animations**: tag-pop animation when adding skills
- **Validation**: Minimum 3 skills for profile completion

#### 4. ProfileCompletionMeter
Circular progress meter with milestones:
- **Circular Progress**:
  - SVG circle with gradient stroke (Indigo → Purple → Cyan)
  - 48px diameter
  - Percentage display in center
  - Completion checkmark when 100%
  - Glow effect (blur background gradient)
- **Section Breakdown**:
  - 7 horizontal bars representing sections
  - Gradient fill for completed sections
  - Staggered animation (100ms delay per bar)
- **Milestones** (3 levels):
  - **Profile Started** (25%): 10 XP, UserPlus icon
  - **Half Way There** (50%): 25 XP, TrendingUp icon
  - **Profile Master** (100%): 50 XP + Badge, Award icon
- **Milestone Cards**:
  - Green gradient background when achieved
  - Gray when pending
  - Checkmark icon on completion
  - Reward badge display
- **Incomplete Sections List**:
  - Indigo info box
  - Bulleted list of missing sections
- **Animations**: 
  - completion-fill (1s SVG stroke animation)
  - save-pulse on 100% completion

## Profile Sections (7 Total)

| Section | Required | Completion Criteria |
|---------|----------|-------------------|
| Avatar | No | Avatar uploaded |
| Basic Info | Yes | First name + Last name |
| Title | Yes | Job title entered |
| Location | No | Location entered |
| Bio | Yes | Min 50 characters |
| Skills | Yes | Min 3 skills added |
| Social Links | No | Min 1 link added |

## Profile Completion Calculation

```typescript
percentage = (completedSections / totalSections) * 100
status = percentage === 100 ? 'complete' : percentage > 0 ? 'partial' : 'incomplete'
```

## State Management

### ProfileState
```typescript
{
  profile: UserProfile | null,
  editState: {
    isEditing: boolean,
    editingField: ProfileSection | null,
    hasUnsavedChanges: boolean,
    isSaving: boolean,
    lastSaved?: Date
  },
  validations: ProfileValidation[],
  isLoading: boolean,
  error: string | null
}
```

### Context Methods
- **updateAvatar(file)**: Upload and preview avatar (1.5s delay)
- **removeAvatar()**: Clear avatar
- **updateField(field, value)**: Update local field value
- **saveField(field)**: Persist field to backend (800ms delay)
- **cancelEdit(field)**: Revert unsaved changes
- **addSkill(skill)**: Add skill to list
- **removeSkill(skill)**: Remove skill from list
- **acceptSuggestedSkill(skill)**: Move from suggestions to skills
- **dismissSuggestedSkill(skill)**: Remove from suggestions
- **addSocialLink(platform, url)**: Add social media link
- **removeSocialLink(id)**: Remove social link
- **validateField(field)**: Check field requirements
- **refreshProfile()**: Reload profile data
- **calculateCompletion()**: Recalculate progress

## Design System Compliance

### Color Palette
```css
Navy Background:    #0F172A
Indigo Primary:     #4F46E5
Purple Secondary:   #A855F7
Cyan Highlight:     #22D3EE
Success Green:      #10B981
Warning Yellow:     #F59E0B
Error Red:          #EF4444
White Text:         #F8FAFC (90% opacity)
Muted Text:         #F8FAFC (60% opacity)
```

### Glassmorphism Cards
```css
background: linear-gradient(135deg, #1E293B 0%, #1E293B80 100%)
border: 1px solid rgba(255,255,255,0.1)
backdrop-filter: blur(10px)
border-radius: 24px
padding: 24px
```

### Typography
- **Page Title**: 3xl (30px), bold, white/90
- **Section Titles**: lg (18px), semibold, white/90
- **Field Labels**: sm (14px), medium, white/80
- **Body Text**: sm (14px), regular, white/90
- **Muted Text**: xs (12px), regular, white/40

### Iconography (Lucide)
- User, Camera, Pencil, Check, X, Plus, Sparkles
- Briefcase (Title), MapPin (Location), FileText (Bio)
- Award, TrendingUp, UserPlus (Milestones)
- Loader2 (Loading states)

## Page Layout

### Grid Structure (3-column on desktop)
```
┌─────────────────────────────────────────────┐
│  Header: "Your Profile" + Description      │
├──────────────┬──────────────────────────────┤
│              │                              │
│  Avatar      │  Basic Info Card             │
│  Card        │  - Job Title                 │
│  (col-1)     │  - Location                  │
│              │                              │
├──────────────┤  Bio Card (col-2 span-2)     │
│              │  - Professional Summary       │
│  Completion  │                              │
│  Meter       │  Skills Card                 │
│  Card        │  - Current Skills (chips)    │
│  (col-1)     │  - Add Skill Input           │
│              │  - Suggested Skills          │
└──────────────┴──────────────────────────────┘
│  Footer: Last Updated + Auto-saved Status  │
└─────────────────────────────────────────────┘
```

### Responsive Breakpoints
- **Desktop (lg)**: 3-column grid (1 + 2 span)
- **Tablet/Mobile**: Single column stack

## Animations (5 New)

### 1. avatar-glow
```css
@keyframes avatar-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(79,70,229,0.3), 0 0 40px rgba(168,85,247,0.2); }
  50% { box-shadow: 0 0 30px rgba(79,70,229,0.5), 0 0 60px rgba(168,85,247,0.3); }
}
Duration: 3s, infinite, ease-in-out
```

### 2. field-focus
```css
@keyframes field-focus {
  from { transform: scale(0.98); opacity: 0.8; }
  to { transform: scale(1); opacity: 1; }
}
Duration: 0.2s, ease-out
```

### 3. tag-pop
```css
@keyframes tag-pop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}
Duration: 0.3s, cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### 4. completion-fill
```css
@keyframes completion-fill {
  from { stroke-dashoffset: calc(2 * 3.14159 * 45); }
  to { stroke-dashoffset: 0; }
}
Duration: 1s, ease-out
```

### 5. save-pulse
```css
@keyframes save-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); transform: scale(1); }
  50% { box-shadow: 0 0 0 10px rgba(34,197,94,0); transform: scale(1.05); }
}
Duration: 1.5s, ease-out
```

## User Interaction Flow

```
1. User lands on /profile
2. Sees 30% completion (basic info only)
3. Clicks avatar → Upload photo → Preview + glow effect
4. Hovers over "Job Title" → Pencil icon appears
5. Clicks to edit → Field expands, input focused
6. Types title → Character counter updates
7. Clicks Save → Loading spinner → "Saved" indicator
8. Adds skills → Types "React" → Clicks Add
   → Skill chip appears with tag-pop animation
9. Sees suggested skill "TypeScript" → Hovers → Accept/Dismiss buttons
10. Clicks Accept → Skill moves to main list with animation
11. Completion meter updates → 50% achieved → Milestone unlocked
12. Continues filling bio (50+ chars required)
13. Profile reaches 100% → Checkmark in completion circle
    → "Profile Master" milestone achieved with save-pulse animation
14. Auto-save indicator shows "Last saved: 2 minutes ago"
```

## Accessibility Features

- **Keyboard Navigation**: Tab through all editable fields
- **ARIA Labels**: All buttons and inputs labeled
- **Focus Management**: Auto-focus on edit mode
- **Screen Reader**: Announces completion percentage
- **Color Contrast**: WCAG 2.1 AA compliant
- **Semantic HTML**: Proper heading hierarchy (h1 → h3)
- **Error Messages**: Clear validation feedback

## Usage Example

```tsx
import { ProfileProvider } from '@/features/profile/context/ProfileContext';
import ProfilePage from '@/app/(dashboard)/profile/page';

function App() {
  return (
    <ProfileProvider>
      <ProfilePage />
    </ProfileProvider>
  );
}
```

## Routes
- `/profile` - Main profile management screen

## File Structure
```
features/profile/
├── context/
│   └── ProfileContext.tsx (450 lines)
├── types/
│   └── profile.types.ts (120 lines)
└── presentation/components/
    ├── AvatarUpload.tsx (180 lines)
    ├── EditableField.tsx (200 lines)
    ├── SkillTagInput.tsx (180 lines)
    └── ProfileCompletionMeter.tsx (200 lines)

app/(dashboard)/profile/
└── page.tsx (180 lines)

app/
└── globals.css (+65 lines for animations)
```

## Integration Points

### Backend API Endpoints (To Implement)
```
GET    /api/profile           - Retrieve user profile
PATCH  /api/profile/avatar    - Upload avatar image
PATCH  /api/profile/field     - Update single field
POST   /api/profile/skills    - Add skill
DELETE /api/profile/skills/:id - Remove skill
GET    /api/profile/suggestions - Get AI skill suggestions
```

### Avatar Upload Flow
```typescript
1. User selects file → Validate (type, size)
2. Create object URL for preview
3. Upload to S3/Cloudinary → Get URL
4. Save URL to database
5. Update ProfileContext state
```

### Skill Suggestions (AI Integration)
```typescript
Sources:
- LinkedIn profile analysis
- GitHub repository scanning
- Resume parsing (NLP)
- AI clustering (related skills)

Algorithm:
1. Extract skills from connected accounts
2. Run TF-IDF on job descriptions
3. Apply collaborative filtering
4. Return top 6 suggestions with confidence scores
```

## Future Enhancements

- [ ] Social links management (LinkedIn, GitHub, Portfolio)
- [ ] Profile visibility settings (Public, Private, Contacts Only)
- [ ] Custom profile URL (skillflow.com/u/{username})
- [ ] Profile preview mode
- [ ] Export profile as PDF
- [ ] QR code for profile sharing
- [ ] Profile analytics (views, skill impressions)
- [ ] Verified badge system
- [ ] Multi-language bio support
- [ ] Video introduction upload
- [ ] Portfolio project attachments

## Testing Strategy

- **Unit Tests**: Context methods, completion calculation, validation logic
- **Component Tests**: EditableField save/cancel, SkillTagInput add/remove
- **Integration Tests**: Avatar upload flow, auto-save functionality
- **E2E Tests**: Complete profile from 0% to 100%
- **Accessibility Tests**: Keyboard navigation, screen reader support
- **Performance Tests**: Large skill lists, image upload optimization

## Performance Optimizations

- **Debounced Auto-save**: 800ms delay on field edits
- **Image Compression**: Client-side resize before upload
- **Lazy Loading**: Avatar preview on demand
- **Memoization**: useCallback for all context methods
- **Virtual Scrolling**: For 50+ skill tags (future)
- **Optimistic Updates**: Instant UI feedback before API response

## Known Limitations

- Avatar upload currently simulated (1.5s delay)
- Skill suggestions are static mock data
- Social links not yet implemented
- No backend integration (all state is local)
- Profile completion calculation client-side only
- No real-time collaboration features

## Design Inspiration

Following SkillFlow design principles:
- **Futuristic Minimal**: Clean layout, strong data focus
- **Dark First**: Navy background, neon accents
- **Glassmorphism**: Frosted glass card aesthetic
- **Modular Cards**: Reusable component blocks
- **Smooth Animations**: 200-300ms transitions
- **High Contrast**: White/90 on Navy for readability

Inspired by:
- Dribbble: "AI Dashboard", "Profile Management UI"
- Apple: macOS Big Sur transparency effects
- Stripe: Clean form design patterns
- Linear: Keyboard-first interactions
