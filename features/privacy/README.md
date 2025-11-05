# Privacy & Consent Management Feature

## Overview
Privacy-focused consent screen with granular permission controls, trust indicators, and GDPR-compliant design following transparency and legal clarity principles.

## Components Architecture

### Core Context
- **ConsentContext.tsx**: State management for permission grants/denials
- **consent.types.ts**: TypeScript interfaces for permissions, consent states, privacy sections

### UI Components

#### 1. PermissionCard
Expandable card for each permission type with:
- **Icon & Title**: Category-colored icon with permission name
- **Description**: Short summary of permission purpose
- **Toggle Switch**: Gradient switch (disabled for required permissions)
- **Required Badge**: Green badge for essential permissions
- **Category Badge**: Color-coded type (Essential, Functional, Analytics, Marketing)
- **Expandable Details**:
  - Detailed description (what it means)
  - Data types collected (tags)
  - Usage examples (bullet list)
  - Retention period (data storage duration)
- **Slide-down Animation**: Smooth expansion (0.3s)

#### 2. TrustIndicators
6-column grid of trust badges:
- **SSL Encrypted** (Green): Data transmission security
- **GDPR Compliant** (Indigo): EU data protection
- **SOC 2 Certified** (Purple): Security audit compliance
- **Transparent** (Cyan): Clear policies
- **Data Control** (Orange): User data ownership
- **Privacy First** (Pink): Privacy-by-design architecture

#### 3. ConsentSummary
3-column overview cards:
- **What We Collect**: Profile, resume, skills, activity
- **How We Use It**: Skill DNA, forecasts, recommendations, matching
- **Who We Share With**: Only with consent, verified partners, anonymized data

## Permission System (7 Types)

### Essential Permissions (Auto-granted, Required)

**1. Profile Data Collection**
- **Icon**: User (Green)
- **Data**: Name, email, photo, job title, company
- **Retention**: Until account deletion
- **Examples**: Display profile, send emails, personalize dashboard

**2. AI Skill Analysis**
- **Icon**: Brain (Green)
- **Data**: Resume, work history, projects, code repos
- **Retention**: 5 years or until deletion
- **Examples**: Extract skills, analyze GitHub, generate scores

### Optional Permissions (User-controlled)

**3. Activity Tracking**
- **Icon**: Activity (Indigo)
- **Category**: Functional
- **Data**: Page views, learning progress, feature usage, time spent
- **Retention**: 2 years
- **Examples**: Track completion, show streaks, provide insights

**4. Data Sharing with Partners**
- **Icon**: Share2 (Indigo)
- **Category**: Functional
- **Data**: Anonymized skills, learning preferences, career goals
- **Retention**: 1 year
- **Examples**: Job matching, course recommendations, algorithm improvement

**5. Email Notifications**
- **Icon**: Mail (Cyan)
- **Category**: Marketing
- **Data**: Email address, communication preferences
- **Retention**: Until unsubscribe
- **Examples**: Weekly forecasts, course suggestions, feature announcements

**6. Performance Analytics**
- **Icon**: BarChart3 (Purple)
- **Category**: Analytics
- **Data**: Device type, browser, session duration, click events
- **Retention**: 90 days
- **Examples**: Identify popular features, detect issues, optimize UX

**7. Third-Party Integrations**
- **Icon**: Plug (Indigo)
- **Category**: Functional
- **Data**: API tokens, integration settings, sync preferences
- **Retention**: Until disconnected
- **Examples**: Calendar sync, Slack notifications, Zoom meetings

## Design System Compliance

### Color Palette (Category-based)
```typescript
Essential:  #10B981 (Green)   - Required for core functionality
Functional: #4F46E5 (Indigo)  - Enhanced features
Analytics:  #A855F7 (Purple)  - Usage tracking
Marketing:  #22D3EE (Cyan)    - Communications
```

### Typography & Microcopy
- **Soft Neutral Tones**: White/60 for body text, White/80 for headings
- **Legal Clarity**: Plain language explanations, no jargon
- **Trust-focused**: Emphasize user control, data ownership
- **Scannable**: Bullet points, short sentences, visual hierarchy

### Iconography
- **Category Icons**: User, Brain, Activity, Share2, Mail, BarChart3, Plug
- **Trust Icons**: Shield, Lock, UserCheck, Eye, Database, Globe
- **Action Icons**: Check (accept), X (deny), Info (details), ExternalLink (legal docs)

## Consent Flow

```
1. User navigates to /consent
2. Sees trust indicators (SSL, GDPR, etc.)
3. Reviews "What/How/Who" summary cards
4. Expands "Essential Permissions" section
   → Auto-granted, cannot toggle
   → Can view details by expanding cards
5. Reviews "Optional Permissions" section
   → Each has toggle switch
   → Can "Accept All" or "Deny All"
   → Individual toggles override bulk actions
6. Clicks permission card to expand details
   → Slide-down animation reveals:
     - Detailed description
     - Data types collected
     - Usage examples
     - Retention period
7. Reviews legal document links
   → Privacy Policy (opens in new tab)
   → Terms of Service (opens in new tab)
   → Data Processing Agreement (opens in new tab)
8. Clicks "Continue to SkillFlow"
   → Required permissions must be accepted
   → Optional permissions saved as-is
   → Consent state persisted to backend
   → Redirects to /dashboard
```

## State Management

### ConsentState Interface
```typescript
interface ConsentState {
  permissions: Permission[];        // Array of 7 permissions
  lastUpdated?: Date;              // Timestamp of last change
  acceptedTermsVersion?: string;   // e.g., "1.0.0"
  isComplete: boolean;             // Consent flow finished
}
```

### Permission Interface
```typescript
interface Permission {
  id: PermissionType;
  title: string;
  description: string;
  detailedDescription: string;
  icon: string;                    // Lucide icon name
  isRequired: boolean;
  status: ConsentStatus;           // granted | denied | pending
  examples?: string[];
  dataTypes?: string[];
  retentionPeriod?: string;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
}
```

### Context Methods
```typescript
togglePermission(id): void          // Switch permission on/off
grantAllPermissions(): void         // Accept all
denyAllOptionalPermissions(): void  // Deny non-required
saveConsent(): Promise<void>        // Persist to backend
resetConsent(): void                // Reset to defaults
```

## GDPR Compliance Features

✅ **Granular Consent**: Individual toggle for each permission  
✅ **Purpose Limitation**: Clear explanation of data usage  
✅ **Data Minimization**: Only collect necessary data  
✅ **Storage Limitation**: Defined retention periods  
✅ **Transparency**: Plain language explanations  
✅ **User Control**: Accept/Deny/Customize options  
✅ **Withdrawal**: Can change anytime in Settings  
✅ **Legal Basis**: Documented in Privacy Policy  
✅ **Data Portability**: Export feature (future)  
✅ **Right to Erasure**: Account deletion option (future)  

## Accessibility

- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Tab through cards, Enter to toggle
- **Screen Reader**: Permission count announcements
- **Focus States**: Visible focus rings on all controls
- **Color Contrast**: WCAG 2.1 AA compliant
- **Semantic HTML**: Proper heading hierarchy
- **Toggle States**: Clear on/off indicators

## Trust-Building Elements

### Visual Trust Signals
- **Security Badges**: SSL, GDPR, SOC2 certifications
- **Data Control Icons**: Emphasize user ownership
- **Privacy-First Messaging**: "Your Data, Your Control"
- **Transparent Layout**: No hidden permissions
- **Legal Links**: Easy access to full policies

### Microcopy Strategy
- **What It Means**: Plain language explanations
- **Data We Collect**: Specific data types listed
- **How We Use It**: Concrete usage examples
- **Retention Period**: Clear storage duration
- **Consent Required**: Visual distinction (green badge)

## Usage Example

```tsx
import { ConsentProvider } from '@/features/privacy/context/ConsentContext';
import PermissionCard from '@/features/privacy/presentation/components/PermissionCard';

function App() {
  const handleComplete = (state) => {
    // Save consent to backend
    await fetch('/api/consent', {
      method: 'POST',
      body: JSON.stringify(state),
    });
    router.push('/dashboard');
  };

  return (
    <ConsentProvider onComplete={handleComplete}>
      <ConsentScreen />
    </ConsentProvider>
  );
}
```

## Routes
- `/consent` - Main consent management screen

## File Structure
```
features/privacy/
├── context/
│   └── ConsentContext.tsx (217 lines)
├── types/
│   └── consent.types.ts (42 lines)
└── presentation/components/
    ├── PermissionCard.tsx (231 lines)
    ├── TrustIndicators.tsx (81 lines)
    └── ConsentSummary.tsx (98 lines)

app/(auth)/consent/
└── page.tsx (283 lines)
```

## Integration Points

### Backend API Endpoints
```
POST /api/consent             - Save user consent preferences
GET  /api/consent             - Retrieve current consent state
PATCH /api/consent/{id}       - Update specific permission
DELETE /api/consent           - Withdraw all consent
GET  /api/consent/history     - Audit log of consent changes
```

### Consent Change Tracking
```typescript
interface ConsentAuditLog {
  userId: string;
  timestamp: Date;
  permissionId: PermissionType;
  previousStatus: ConsentStatus;
  newStatus: ConsentStatus;
  ipAddress: string;
  userAgent: string;
}
```

## Analytics & Monitoring

### Tracked Events
- `consent_screen_viewed` - User lands on page
- `permission_toggled` - Individual permission changed
- `accept_all_clicked` - Bulk accept action
- `deny_all_clicked` - Bulk deny action
- `permission_details_expanded` - User views details
- `legal_doc_opened` - User clicks Privacy Policy/Terms
- `consent_saved` - Final submission
- `consent_cancelled` - User abandons flow

### Key Metrics
- Consent completion rate
- Average time on consent screen
- Permission grant rates by type
- Most expanded permissions (curiosity indicator)
- Legal document open rate

## Future Enhancements

- [ ] Cookie consent banner integration
- [ ] Consent version migration system
- [ ] Email notification on consent changes
- [ ] Consent export (PDF download)
- [ ] Consent comparison view (what changed)
- [ ] Granular sub-permissions (e.g., email types)
- [ ] Third-party consent passthrough
- [ ] Consent expiry/renewal reminders
- [ ] Multi-language consent forms
- [ ] Accessibility audit (WCAG 2.1 AAA)

## Legal Compliance

### Required Legal Pages (To Create)
- `/legal/privacy-policy` - Full privacy policy
- `/legal/terms-of-service` - Terms and conditions
- `/legal/data-processing` - DPA for enterprise
- `/legal/cookie-policy` - Cookie usage details
- `/legal/ccpa` - California privacy rights
- `/legal/subprocessors` - Third-party services list

### Consent Record Requirements
- User ID
- Timestamp (ISO 8601)
- IP address
- User agent
- Consent version
- Permission states (JSON)
- Signature/checksum

## Security Considerations

- Consent data encrypted at rest (AES-256)
- HTTPS-only transmission
- No PII in analytics tracking
- Rate limiting on consent API
- CSRF protection on form submission
- Audit log immutability
- Role-based access to consent records
- Data breach notification procedures

## Testing Strategy

- **Unit Tests**: Permission toggle logic, state management
- **Integration Tests**: Consent save/load, API integration
- **E2E Tests**: Complete consent flow, legal link clicks
- **Accessibility Tests**: Screen reader, keyboard navigation
- **Legal Review**: Compliance with GDPR, CCPA, PIPEDA
- **Security Audit**: Penetration testing, data leak prevention
