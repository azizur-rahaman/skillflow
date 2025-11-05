# 📈 Trending Skills Feature

A leaderboard-style interface displaying the fastest-rising skills globally or by industry, following SkillFlow's vertical slice architecture.

---

## 🎯 UX Objective

Display fastest-rising skills with:
- **Leaderboard-style ranking** (1st, 2nd, 3rd with visual distinction)
- **Trend indicators** (up/down/stable arrows)
- **Sparkline mini-charts** showing growth trajectory
- **Category & industry filters** for segmentation
- **Professional yet energetic feel** using the design system

---

## 🏗️ Architecture

Following the **vertical slice architecture** pattern:

```
features/trending-skills/
├── types/
│   └── trending-skills.types.ts      # Type definitions
├── context/
│   └── TrendingSkillsContext.tsx     # State management
├── presentation/
│   └── components/
│       ├── TrendingSkillCard.tsx     # Individual skill card
│       ├── TrendingSkillsFilters.tsx # Filter controls
│       └── TrendingSkillsLeaderboard.tsx # Main component
└── index.ts                          # Public API
```

---

## 🎨 Design System Compliance

### Colors
- **Primary**: `#4F46E5` (Indigo) - Rankings & accents
- **Accent**: `#A855F7` (Purple) - Hover states
- **Highlight**: `#22D3EE` (Cyan) - Trend indicators
- **Success**: `#10B981` - Upward trends
- **Danger**: `#EF4444` - Downward trends

### Components
- **Cards**: Rounded 2xl, hover effects with border-accent
- **Badges**: Top 3 ranks get gradient backgrounds (gold, silver, bronze)
- **Sparklines**: SVG polyline charts with trend-based coloring
- **Filters**: Dropdown selects with icon prefixes

### Typography
- **Headings**: Inter font, bold weights
- **Body**: 15px, readable spacing
- **Mono**: JetBrains Mono for data points

---

## 📦 Components

### `TrendingSkillCard`
Displays individual skill with:
- Rank badge (top 3 get special styling)
- Skill name & category
- Growth percentage with trend arrow
- Demand score progress bar
- Sparkline chart
- Job postings & learning resources count

**Props:**
```typescript
interface TrendingSkillCardProps {
  skill: TrendingSkill;
  showSparkline?: boolean;
  showSalaryImpact?: boolean;
  compact?: boolean;
  onClick?: (skill: TrendingSkill) => void;
}
```

### `TrendingSkillsFilters`
Filter controls with:
- Search input
- Time range selector (7d, 30d, 90d, 1y)
- Category dropdown
- Industry dropdown
- Active filter badges

**Props:**
```typescript
interface TrendingSkillsFiltersProps {
  filters: TrendingSkillsFilters;
  onFilterChange: (filters: Partial<TrendingSkillsFilters>) => void;
  totalResults?: number;
}
```

### `TrendingSkillsLeaderboard`
Main component combining:
- Header with stats
- Filter controls
- Skill cards list
- Loading/error states
- Export functionality

**Props:**
```typescript
interface TrendingSkillsLeaderboardProps {
  showSparklines?: boolean;
  showSalaryImpact?: boolean;
  compact?: boolean;
  onSkillClick?: (skill: TrendingSkill) => void;
}
```

---

## 🎣 Hook Usage

### `useTrendingSkills`
Access trending skills state and actions:

```typescript
const {
  skills,           // TrendingSkill[]
  filters,          // Current filter state
  isLoading,        // Loading state
  error,            // Error message
  updateFilters,    // Update filter function
  refreshData,      // Manual refresh
  loadMore,         // Pagination
  hasMore,          // More data available
  lastUpdated,      // Last update timestamp
  totalSkillsTracked, // Total skills in database
} = useTrendingSkills();
```

---

## 🚀 Usage Example

```tsx
import { 
  TrendingSkillsProvider, 
  TrendingSkillsLeaderboard 
} from '@/features/trending-skills';

export default function TrendingSkillsPage() {
  return (
    <TrendingSkillsProvider>
      <TrendingSkillsLeaderboard
        showSparklines={true}
        showSalaryImpact={true}
        onSkillClick={(skill) => {
          router.push(`/skills/${skill.id}`);
        }}
      />
    </TrendingSkillsProvider>
  );
}
```

---

## 📊 Data Structure

### TrendingSkill
```typescript
interface TrendingSkill {
  id: string;
  name: string;
  category: SkillCategory;
  rank: number;
  previousRank?: number;
  growthPercentage: number;
  trendDirection: 'up' | 'down' | 'stable';
  demandScore: number;       // 0-100
  sparklineData: SparklineDataPoint[];
  relatedSkills: string[];
  averageSalaryImpact?: number;
  jobPostings: number;
  learningResources: number;
}
```

---

## 🔌 API Integration

The feature expects a backend endpoint:

```
GET /api/skills/trending?timeRange=30d&category=all&industry=all&sortBy=rank
```

**Response:**
```json
{
  "skills": [/* TrendingSkill[] */],
  "timeRange": "30d",
  "category": "all",
  "industry": "all",
  "lastUpdated": "2024-11-05T12:00:00Z",
  "totalSkillsTracked": 15000,
  "hasMore": false
}
```

---

## 🎯 Key Features

✅ **Leaderboard-style ranking** with visual distinction for top 3  
✅ **Trend indicators** (arrows + colors)  
✅ **Sparkline mini-charts** showing growth trajectory  
✅ **Multi-dimensional filtering** (time, category, industry)  
✅ **Search functionality**  
✅ **Export to JSON**  
✅ **Responsive design**  
✅ **Loading & error states**  
✅ **Professional + energetic aesthetics**  

---

## 🎨 Visual Design

- **Dark-first theme** with neon accents
- **Card-based layout** with hover animations
- **Gradient badges** for top 3 ranks
- **Sparkline charts** with trend-based coloring
- **Progress bars** for demand scores
- **Clean iconography** from Lucide

---

## 🔧 Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Personalized skill recommendations
- [ ] Skill comparison tool
- [ ] Historical trend analysis
- [ ] Share trending skills on social media
- [ ] Email alerts for skill trends
- [ ] Mobile app version

---

## 📝 Notes

This feature follows SkillFlow's:
- **Vertical slice architecture**
- **Design system** (shadcn/ui based)
- **TypeScript best practices**
- **Accessibility standards**
- **Performance optimizations**

---

**Created by**: SkillFlow Design Team  
**Last Updated**: November 5, 2025
