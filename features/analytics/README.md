# 📊 Enterprise Analytics Feature

A comprehensive HR analytics dashboard providing managers with a bird's-eye view of organizational skills and learning health.

## Overview

The Enterprise Analytics Dashboard is designed to give HR managers, department heads, and organizational leaders powerful insights into workforce skills, engagement, retention, and learning activities.

## Features

### 🎯 Key Performance Indicators (KPIs)
- **Employee Engagement**: Track active participation in learning and skill development
- **Skill Retention Rate**: Monitor employees maintaining and applying learned skills
- **Critical Skill Gaps**: Identify and quantify skill deficiencies across the organization
- **Learning Hours**: Track total hours invested in skill development

### 📈 Department Analytics
- **Bar Charts**: Visual comparison of metrics across departments
- **Donut Charts**: Department distribution by employee count
- **Skill Distribution**: Average skills per department
- **Engagement Rates**: Department-level engagement metrics
- **Skill Gaps**: Identify departments with critical skill deficiencies

### 🏆 Team Leaderboard
- **Ranked Teams**: Top-performing teams based on multiple metrics
- **Skills Acquired**: Total skills learned by each team
- **Engagement Rate**: Team-level engagement tracking
- **Skill Strength**: Average proficiency levels
- **Growth Rate**: Month-over-month improvement
- **Top Performers**: Highlight individual contributors

### 🔍 Advanced Filtering
- **Time Period**: Last 7/30/90 days, last year, or custom range
- **Department Filter**: View all or specific departments
- **Export Options**: PDF, Excel, CSV, JSON formats

## Architecture

### File Structure

```
features/analytics/
├── types/
│   └── enterprise-analytics.types.ts   # Type definitions
├── context/
│   └── EnterpriseAnalyticsContext.tsx  # State management
└── presentation/
    └── components/
        └── enterprise/
            ├── KPIOverviewCards.tsx    # KPI metrics
            ├── DepartmentCharts.tsx    # Bar & donut charts
            ├── TeamLeaderboard.tsx     # Team rankings
            ├── FilterSidebar.tsx       # Filters & export
            └── index.ts                # Component exports

app/(dashboard)/
└── analytics/
    └── page.tsx                        # Main dashboard page
```

### Component Hierarchy

```
EnterpriseAnalyticsPage
└── EnterpriseAnalyticsProvider
    └── DashboardContent
        ├── Header (with quick stats)
        ├── FilterSidebar
        └── Main Content
            ├── KPIOverviewCards
            ├── DepartmentCharts
            └── TeamLeaderboard
```

## Design System

### Color Palette
- **Indigo (#6366F1)**: Primary actions, engagement metrics
- **Cyan (#22D3EE)**: Secondary highlights, skill metrics
- **Emerald (#10B981)**: Positive trends, retention
- **Amber (#F59E0B)**: Warnings, skill gaps
- **Red (#EF4444)**: Critical issues, down trends

### Layout Style
- **White-on-Gray**: Clean professional background
- **Accent Gradients**: Subtle gradient overlays on hover
- **Card-Based**: Modular rounded cards with borders
- **Responsive**: Mobile-first, desktop-optimized

### Typography
- **Headers**: 3xl-lg, bold to semibold
- **Body**: sm-base, regular to medium
- **Metrics**: 4xl-lg, bold with colored units

## Mock Data

### KPI Metrics
- **Engagement**: 87.5% (up 6.3%)
- **Retention**: 92.8% (down 1.5%)
- **Skill Gaps**: 23 gaps (down 25.8%)
- **Learning Hours**: 12,450 hrs (up 10.9%)

### Departments (6)
- Engineering: 245 employees, 91.2% engagement
- Design: 87 employees, 88.4% engagement
- Product: 62 employees, 85.7% engagement
- Marketing: 118 employees, 82.1% engagement
- Sales: 156 employees, 79.6% engagement
- HR: 45 employees, 90.3% engagement

### Teams (8)
1. Platform Engineering (28 members, 94.5% engagement, 18.3% growth)
2. Product Design (22 members, 92.1% engagement, 16.7% growth)
3. Data Science (18 members, 91.8% engagement, 15.4% growth)
4. Product Analytics (16 members, 90.3% engagement, 14.2% growth)
5. Growth Marketing (24 members, 88.7% engagement, 13.1% growth)
6. Enterprise Sales (32 members, 85.4% engagement, 11.8% growth)
7. Talent Acquisition (14 members, 92.6% engagement, 10.5% growth)
8. Mobile Development (20 members, 87.2% engagement, 9.7% growth)

## Usage

### Basic Implementation

```tsx
import EnterpriseAnalyticsPage from '@/app/(dashboard)/analytics/page';

// The page is self-contained with provider
<EnterpriseAnalyticsPage />
```

### Using Context in Custom Components

```tsx
import { useEnterpriseAnalytics } from '@/features/analytics/context/EnterpriseAnalyticsContext';

function CustomAnalyticsComponent() {
  const {
    kpis,
    departments,
    teamLeaderboard,
    filters,
    setFilters,
    refreshData,
    exportData,
  } = useEnterpriseAnalytics();

  return (
    <div>
      <button onClick={refreshData}>Refresh</button>
      <button onClick={() => exportData('pdf')}>Export PDF</button>
    </div>
  );
}
```

### Filtering

```tsx
// Set time period
setFilters({ timePeriod: TimePeriod.Last30Days });

// Filter by departments
setFilters({ departments: [Department.Engineering, Department.Design] });

// View all departments
setFilters({ departments: [Department.All] });
```

### Exporting Data

```tsx
// Export as PDF
exportData(ExportFormat.PDF);

// Export as Excel
exportData(ExportFormat.Excel);

// Export as CSV
exportData(ExportFormat.CSV);

// Export as JSON
exportData(ExportFormat.JSON);
```

## Key Components

### KPIOverviewCards

Large metric cards with:
- Icon and colored accent
- Current value with unit
- Trend indicator (up/down/stable)
- Percentage change
- Previous period comparison
- Hover glow effect

```tsx
<KPIOverviewCards kpis={kpis} />
```

### DepartmentCharts

Dual chart view:
- **Bar Chart**: Department comparison with progress bars
- **Donut Chart**: Distribution visualization
- **Toggle Views**: Engagement, Skills, or Gaps
- Color-coded departments

```tsx
<DepartmentCharts departments={departments} />
```

### TeamLeaderboard

Ranked team list with:
- Medal badges for top 3 teams
- Department affiliation
- Member count
- Skills acquired count
- Engagement rate
- Skill strength average
- Growth rate trend
- Top 3 performers

```tsx
<TeamLeaderboard teams={teamLeaderboard} limit={8} />
```

### FilterSidebar

Interactive filters:
- Time period selector
- Department checkboxes
- Export dropdown
- Refresh button
- Active filters summary

```tsx
<FilterSidebar
  filters={filters}
  onFiltersChange={setFilters}
  onRefresh={refreshData}
  onExport={exportData}
/>
```

## Type Definitions

### Core Types

- `KPIMetric`: Individual KPI with value, trend, change
- `DepartmentData`: Department info with skills and engagement
- `TeamLeaderboardEntry`: Team ranking with metrics
- `SkillGap`: Identified skill deficiency
- `AnalyticsFilters`: Filter state
- `EnterpriseAnalyticsState`: Complete dashboard state

### Enums

- `TimePeriod`: Last7Days, Last30Days, Last90Days, LastYear, Custom
- `Department`: All, Engineering, Design, Product, Marketing, Sales, HR, Finance, Operations
- `TrendDirection`: Up, Down, Stable
- `KPIType`: Engagement, Retention, SkillGaps, LearningHours
- `ExportFormat`: CSV, Excel, PDF, JSON

## Helper Functions

```tsx
// Format percentage
formatPercentage(87.5, 1) // "87.5%"

// Format numbers with K/M
formatNumber(12450) // "12.5K"

// Format hours
formatHours(12450) // "12.5K hrs"

// Get department color
getDepartmentColor(Department.Engineering) // "#6366F1"

// Get trend color class
getTrendColorClass(TrendDirection.Up) // "text-emerald-400"

// Calculate percentage change
calculatePercentageChange(87.5, 82.3) // 6.32...
```

## Future Enhancements

- [ ] Real-time data updates with WebSocket
- [ ] Advanced filtering (skills, teams, roles)
- [ ] Custom date range picker
- [ ] Skill gap recommendations
- [ ] Retention risk predictions
- [ ] Learning path analytics
- [ ] Department benchmarking
- [ ] Export scheduling
- [ ] Email reports
- [ ] Mobile app view
- [ ] AI-powered insights
- [ ] Predictive analytics
- [ ] Custom KPI builder

## Dependencies

- React 18+
- Next.js 14+
- TypeScript 5+
- Tailwind CSS 3+
- Lucide React (icons)

## Performance

- Lazy loading for charts
- Optimized re-renders with React.memo
- Efficient state management
- Virtualized lists for large datasets
- Debounced filter updates

## Accessibility

- Semantic HTML structure
- ARIA labels for icons
- Keyboard navigation
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**Built with ❤️ for SkillFlow Nexus**
