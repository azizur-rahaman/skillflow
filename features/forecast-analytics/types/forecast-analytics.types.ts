/**
 * Forecast Analytics - Domain Types
 * 
 * AI-powered skill demand and salary predictions with
 * time-series analysis and geographic distribution
 */

/**
 * Forecast time horizons
 */
export enum ForecastHorizon {
  SIX_MONTHS = '6M',
  TWELVE_MONTHS = '12M',
  EIGHTEEN_MONTHS = '18M',
}

/**
 * Trend direction for predictions
 */
export enum TrendDirection {
  RISING = 'RISING',           // Strong growth
  GROWING = 'GROWING',         // Moderate growth
  STABLE = 'STABLE',           // Flat
  DECLINING = 'DECLINING',     // Moderate decline
  FALLING = 'FALLING',         // Strong decline
}

/**
 * Confidence level for AI predictions
 */
export enum ConfidenceLevel {
  VERY_LOW = 'VERY_LOW',       // < 60%
  LOW = 'LOW',                 // 60-70%
  MEDIUM = 'MEDIUM',           // 71-80%
  HIGH = 'HIGH',               // 81-90%
  VERY_HIGH = 'VERY_HIGH',     // > 90%
}

/**
 * Geographic regions for demand analysis
 */
export enum Region {
  NORTH_AMERICA = 'NORTH_AMERICA',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
  EUROPE = 'EUROPE',
  ASIA_PACIFIC = 'ASIA_PACIFIC',
  MIDDLE_EAST = 'MIDDLE_EAST',
  AFRICA = 'AFRICA',
}

/**
 * Job market indicators
 */
export enum MarketIndicator {
  JOB_POSTINGS = 'JOB_POSTINGS',
  SALARY_RANGE = 'SALARY_RANGE',
  HIRING_VELOCITY = 'HIRING_VELOCITY',
  SKILL_DEMAND = 'SKILL_DEMAND',
  COMPETITION_INDEX = 'COMPETITION_INDEX',
}

/**
 * Data point in time series
 */
export interface TimeSeriesPoint {
  date: Date;
  value: number;
  confidence?: number;         // 0-100
  isPrediction?: boolean;      // true for future data
  event?: string;              // Notable event label
}

/**
 * Demand forecast for a specific skill
 */
export interface SkillDemandForecast {
  skillId: string;
  skillName: string;
  category: string;
  
  // Current state
  currentDemand: number;       // 0-100 demand index
  currentJobs: number;         // Number of job postings
  
  // Trend analysis
  trend: {
    direction: TrendDirection;
    changePercentage: number;  // +/- percentage
    velocity: number;          // Rate of change
  };
  
  // Time series data
  historical: TimeSeriesPoint[]; // Past 12 months
  predicted: TimeSeriesPoint[];  // Next 6-18 months
  
  // Confidence metrics
  confidence: {
    level: ConfidenceLevel;
    score: number;             // 0-100
    factors: {
      name: string;
      impact: number;          // 0-100
      description: string;
    }[];
  };
  
  // Geographic distribution
  geographic: {
    region: Region;
    demand: number;            // 0-100
    growth: number;            // +/- percentage
    averageSalary: number;     // USD
    jobCount: number;
  }[];
  
  // Related insights
  insights: {
    type: 'opportunity' | 'warning' | 'info';
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
  }[];
}

/**
 * Salary forecast data
 */
export interface SalaryForecast {
  skillId: string;
  skillName: string;
  
  // Current salary data
  current: {
    min: number;
    max: number;
    median: number;
    currency: string;
  };
  
  // Historical salary trends
  historical: {
    date: Date;
    min: number;
    max: number;
    median: number;
  }[];
  
  // Predicted salary ranges
  predicted: {
    date: Date;
    min: number;
    max: number;
    median: number;
    confidence: number;        // 0-100
  }[];
  
  // Growth metrics
  growth: {
    percentage: number;        // +/- percentage over period
    yearOverYear: number;      // YoY growth
    outlook: TrendDirection;
  };
}

/**
 * Global demand heat map data
 */
export interface GlobalDemandMap {
  regions: {
    region: Region;
    coordinates: {
      lat: number;
      lng: number;
    };
    metrics: {
      demand: number;          // 0-100 intensity
      growth: number;          // +/- percentage
      jobCount: number;
      topSkills: {
        skillId: string;
        skillName: string;
        demand: number;
      }[];
    };
  }[];
}

/**
 * Forecast summary card data
 */
export interface ForecastSummary {
  skillId: string;
  skillName: string;
  icon?: string;
  
  // Key metrics
  metrics: {
    demandChange: number;      // +/- percentage
    salaryGrowth: number;      // +/- percentage
    jobGrowth: number;         // +/- number of jobs
    competitionIndex: number;  // 0-100
  };
  
  // Predictions
  prediction: {
    horizon: ForecastHorizon;
    outlook: TrendDirection;
    confidence: number;        // 0-100
    summary: string;           // AI-generated summary
  };
  
  // Regional highlights
  topRegions: {
    region: Region;
    demand: number;
    salary: number;
  }[];
  
  // Recommendations
  recommendation?: {
    action: 'learn' | 'upskill' | 'specialize' | 'monitor';
    reason: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
}

/**
 * Emerging skill prediction
 */
export interface EmergingSkill {
  skillId: string;
  skillName: string;
  category: string;
  
  // Growth metrics
  growthRate: number;          // Percentage growth
  momentum: number;            // 0-100 velocity score
  
  // Market data
  currentJobs: number;
  projectedJobs: number;
  demandIncrease: number;      // +/- percentage
  
  // Adoption metrics
  adoptionRate: number;        // 0-100
  companiesAdopting: string[]; // Top companies
  
  // Confidence
  confidence: number;          // 0-100
  emergenceDate: Date;         // When it started trending
}

/**
 * Skill comparison data
 */
export interface SkillComparison {
  skills: {
    skillId: string;
    skillName: string;
    color: string;             // For chart differentiation
  }[];
  
  // Comparative metrics
  metrics: {
    demand: { [skillId: string]: number };
    growth: { [skillId: string]: number };
    salary: { [skillId: string]: number };
    jobs: { [skillId: string]: number };
  };
  
  // Time series comparison
  timeSeries: {
    date: Date;
    values: { [skillId: string]: number };
  }[];
}

/**
 * AI model metadata
 */
export interface AIModelMetadata {
  modelName: string;
  version: string;
  algorithm: 'Prophet' | 'LSTM' | 'ARIMA' | 'Ensemble';
  trainedOn: Date;
  dataPoints: number;
  accuracy: number;            // 0-100
  lastUpdate: Date;
}

/**
 * Dashboard filters
 */
export interface ForecastFilter {
  skills: string[];            // Selected skill IDs
  horizon: ForecastHorizon;
  regions: Region[];
  trendDirections: TrendDirection[];
  minConfidence: number;       // 0-100
  showPredictionsOnly: boolean;
}

/**
 * Analytics state
 */
export interface ForecastAnalyticsState {
  forecasts: SkillDemandForecast[];
  salaryForecasts: SalaryForecast[];
  globalMap: GlobalDemandMap;
  summaries: ForecastSummary[];
  emergingSkills: EmergingSkill[];
  comparison: SkillComparison | null;
  filter: ForecastFilter;
  aiModel: AIModelMetadata;
  isLoading: boolean;
  error: string | null;
}

/**
 * Analytics actions
 */
export interface ForecastAnalyticsActions {
  selectSkills: (skillIds: string[]) => void;
  setHorizon: (horizon: ForecastHorizon) => void;
  updateFilter: (filter: Partial<ForecastFilter>) => void;
  compareSkills: (skillIds: string[]) => void;
  refreshForecasts: () => Promise<void>;
  exportData: (format: 'csv' | 'json' | 'pdf') => void;
}

/**
 * Helper: Get trend color
 */
export const getTrendColor = (direction: TrendDirection): string => {
  switch (direction) {
    case TrendDirection.RISING:
      return '#10B981'; // Emerald
    case TrendDirection.GROWING:
      return '#22D3EE'; // Cyan
    case TrendDirection.STABLE:
      return '#F59E0B'; // Amber
    case TrendDirection.DECLINING:
      return '#F97316'; // Orange
    case TrendDirection.FALLING:
      return '#EF4444'; // Red
    default:
      return '#64748B'; // Slate
  }
};

/**
 * Helper: Get trend icon
 */
export const getTrendIcon = (direction: TrendDirection): string => {
  switch (direction) {
    case TrendDirection.RISING:
      return 'trending-up-double';
    case TrendDirection.GROWING:
      return 'trending-up';
    case TrendDirection.STABLE:
      return 'minus';
    case TrendDirection.DECLINING:
      return 'trending-down';
    case TrendDirection.FALLING:
      return 'trending-down-double';
    default:
      return 'minus';
  }
};

/**
 * Helper: Get confidence level from score
 */
export const getConfidenceLevel = (score: number): ConfidenceLevel => {
  if (score < 60) return ConfidenceLevel.VERY_LOW;
  if (score < 71) return ConfidenceLevel.LOW;
  if (score < 81) return ConfidenceLevel.MEDIUM;
  if (score < 91) return ConfidenceLevel.HIGH;
  return ConfidenceLevel.VERY_HIGH;
};

/**
 * Helper: Get confidence color
 */
export const getConfidenceColor = (level: ConfidenceLevel): string => {
  switch (level) {
    case ConfidenceLevel.VERY_HIGH:
      return '#10B981'; // Emerald
    case ConfidenceLevel.HIGH:
      return '#22D3EE'; // Cyan
    case ConfidenceLevel.MEDIUM:
      return '#F59E0B'; // Amber
    case ConfidenceLevel.LOW:
      return '#F97316'; // Orange
    case ConfidenceLevel.VERY_LOW:
      return '#EF4444'; // Red
    default:
      return '#64748B'; // Slate
  }
};

/**
 * Helper: Get region name
 */
export const getRegionName = (region: Region): string => {
  switch (region) {
    case Region.NORTH_AMERICA:
      return 'North America';
    case Region.SOUTH_AMERICA:
      return 'South America';
    case Region.EUROPE:
      return 'Europe';
    case Region.ASIA_PACIFIC:
      return 'Asia Pacific';
    case Region.MIDDLE_EAST:
      return 'Middle East';
    case Region.AFRICA:
      return 'Africa';
    default:
      return 'Unknown';
  }
};

/**
 * Helper: Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Helper: Format percentage
 */
export const formatPercentage = (value: number, showSign: boolean = true): string => {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

/**
 * Helper: Format number with K/M suffix
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
