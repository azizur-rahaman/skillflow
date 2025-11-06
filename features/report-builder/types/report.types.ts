/**
 * Report Builder Types
 * 
 * Comprehensive type system for drag-and-drop report builder
 * with real-time preview and export capabilities.
 */

// ============================================================================
// Core Report Types
// ============================================================================

export interface Report {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  
  // Configuration
  dataSource: DataSource;
  fields: ReportField[];
  filters: Filter[];
  groupBy: string[];
  sortBy: SortConfig[];
  
  // Visualization
  chartType: ChartType;
  chartConfig: ChartConfig;
  
  // Export & Sharing
  schedule?: ScheduleConfig;
  permissions: ReportPermissions;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  isFavorite: boolean;
  tags: string[];
}

export type ReportCategory = 
  | 'skills-analytics'
  | 'talent-insights'
  | 'learning-progress'
  | 'credential-audit'
  | 'marketplace-metrics'
  | 'custom';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  description: string;
  schema: DataSchema;
  recordCount: number;
  lastUpdated: string;
  refreshRate?: string; // e.g., "real-time", "hourly", "daily"
}

export type DataSourceType = 
  | 'skills'
  | 'users'
  | 'credentials'
  | 'projects'
  | 'endorsements'
  | 'transactions'
  | 'learning-activities'
  | 'assessments';

export interface DataSchema {
  fields: SchemaField[];
  relationships: SchemaRelationship[];
}

export interface SchemaField {
  id: string;
  name: string;
  displayName: string;
  type: FieldType;
  category: FieldCategory;
  description: string;
  isRequired: boolean;
  isFilterable: boolean;
  isSortable: boolean;
  isGroupable: boolean;
  icon?: string;
  aggregations?: AggregationType[];
  format?: FieldFormat;
}

export type FieldType = 
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'enum'
  | 'array'
  | 'object';

export type FieldCategory = 
  | 'dimension' // For grouping (name, category, region)
  | 'measure'   // For aggregation (count, sum, average)
  | 'attribute' // For display only (description, url)
  | 'timestamp' // For time-based analysis
  | 'identifier'; // For unique keys (id, uuid)

export type AggregationType = 
  | 'count'
  | 'count-distinct'
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'median'
  | 'percentile';

export interface FieldFormat {
  type: 'currency' | 'percentage' | 'decimal' | 'date' | 'duration' | 'custom';
  pattern?: string; // e.g., "$#,##0.00", "0.0%"
  locale?: string;
}

export interface SchemaRelationship {
  fromField: string;
  toDataSource: string;
  toField: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

// ============================================================================
// Report Fields & Columns
// ============================================================================

export interface ReportField {
  id: string;
  schemaFieldId: string;
  displayName: string;
  aggregation?: AggregationType;
  format?: FieldFormat;
  order: number;
  isVisible: boolean;
  width?: number; // For table columns
  alignment?: 'left' | 'center' | 'right';
}

// ============================================================================
// Filters
// ============================================================================

export interface Filter {
  id: string;
  fieldId: string;
  operator: FilterOperator;
  value: FilterValue;
  logicalOperator?: 'AND' | 'OR';
  isEnabled: boolean;
}

export type FilterOperator = 
  // Text operators
  | 'equals'
  | 'not-equals'
  | 'contains'
  | 'not-contains'
  | 'starts-with'
  | 'ends-with'
  | 'is-empty'
  | 'is-not-empty'
  // Numeric operators
  | 'greater-than'
  | 'greater-than-or-equal'
  | 'less-than'
  | 'less-than-or-equal'
  | 'between'
  | 'not-between'
  // Array operators
  | 'in'
  | 'not-in'
  // Date operators
  | 'is-before'
  | 'is-after'
  | 'is-between'
  | 'is-today'
  | 'is-yesterday'
  | 'is-this-week'
  | 'is-this-month'
  | 'is-this-year'
  | 'is-last-n-days'
  | 'is-last-n-months';

export type FilterValue = 
  | string
  | number
  | boolean
  | Date
  | string[]
  | number[]
  | { min: number; max: number }
  | { start: Date; end: Date }
  | null;

// ============================================================================
// Sorting & Grouping
// ============================================================================

export interface SortConfig {
  fieldId: string;
  direction: 'asc' | 'desc';
  order: number;
}

// ============================================================================
// Chart Configuration
// ============================================================================

export type ChartType = 
  | 'table'
  | 'bar'
  | 'column'
  | 'line'
  | 'area'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'treemap'
  | 'funnel'
  | 'gauge'
  | 'kpi';

export interface ChartConfig {
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  legend?: LegendConfig;
  colors?: string[];
  colorScheme?: ColorScheme;
  showDataLabels?: boolean;
  showGrid?: boolean;
  isStacked?: boolean;
  orientation?: 'vertical' | 'horizontal';
  animation?: boolean;
}

export interface AxisConfig {
  fieldId?: string;
  label?: string;
  min?: number;
  max?: number;
  format?: FieldFormat;
  gridLines?: boolean;
  scale?: 'linear' | 'logarithmic' | 'time';
}

export interface LegendConfig {
  show: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  alignment: 'start' | 'center' | 'end';
}

export type ColorScheme = 
  | 'default'
  | 'gradient'
  | 'monochrome'
  | 'categorical'
  | 'sequential'
  | 'diverging'
  | 'custom';

// ============================================================================
// Export Configuration
// ============================================================================

export interface ExportConfig {
  format: ExportFormat;
  options: ExportOptions;
}

export type ExportFormat = 
  | 'pdf'
  | 'csv'
  | 'excel'
  | 'json'
  | 'png'
  | 'svg';

export interface ExportOptions {
  fileName?: string;
  includeCharts?: boolean;
  includeData?: boolean;
  includeFilters?: boolean;
  paperSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  compression?: boolean;
}

// ============================================================================
// Scheduling
// ============================================================================

export interface ScheduleConfig {
  isEnabled: boolean;
  frequency: ScheduleFrequency;
  time?: string; // HH:MM format
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  timezone: string;
  recipients: string[];
  exportFormat: ExportFormat;
}

export type ScheduleFrequency = 
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly';

// ============================================================================
// Permissions
// ============================================================================

export interface ReportPermissions {
  owner: string;
  visibility: 'private' | 'team' | 'organization' | 'public';
  canView: string[];
  canEdit: string[];
  canExport: string[];
  canSchedule: string[];
}

// ============================================================================
// Report Data & Results
// ============================================================================

export interface ReportResult {
  reportId: string;
  data: ReportDataRow[];
  summary: ReportSummary;
  executionTime: number; // milliseconds
  rowCount: number;
  columnCount: number;
  generatedAt: string;
}

export interface ReportDataRow {
  [fieldId: string]: any;
}

export interface ReportSummary {
  totals: Record<string, number>;
  averages: Record<string, number>;
  min: Record<string, number>;
  max: Record<string, number>;
  count: number;
  distinctCount: Record<string, number>;
}

// ============================================================================
// Drag & Drop Types
// ============================================================================

export interface DraggableField {
  field: SchemaField;
  sourceZone: 'fieldList' | 'reportCanvas';
}

export interface DropZone {
  id: string;
  type: DropZoneType;
  accepts: FieldCategory[];
  currentFields: ReportField[];
  maxFields?: number;
}

export type DropZoneType = 
  | 'rows'      // Dimensions for grouping
  | 'columns'   // Dimensions for cross-tab
  | 'values'    // Measures for aggregation
  | 'filters'   // Additional filters
  | 'x-axis'    // Chart X axis
  | 'y-axis'    // Chart Y axis
  | 'color'     // Chart color dimension
  | 'size';     // Chart size dimension

// ============================================================================
// Builder State
// ============================================================================

export interface ReportBuilderState {
  currentReport: Report | null;
  selectedDataSource: DataSource | null;
  availableFields: SchemaField[];
  previewData: ReportResult | null;
  isPreviewLoading: boolean;
  isDirty: boolean;
  validationErrors: ValidationError[];
  dragState: DragState;
}

export interface DragState {
  isDragging: boolean;
  draggedField: SchemaField | null;
  sourceZone: string | null;
  dropZone: string | null;
  canDrop: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

// ============================================================================
// Saved Reports & Templates
// ============================================================================

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  thumbnail?: string;
  config: Partial<Report>;
  isBuiltIn: boolean;
  usageCount: number;
}

export interface SavedReport {
  report: Report;
  lastResult?: ReportResult;
  runHistory: ReportRun[];
}

export interface ReportRun {
  id: string;
  executedAt: string;
  executedBy: string;
  rowCount: number;
  executionTime: number;
  exportedAs?: ExportFormat;
  success: boolean;
  error?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

export const getFieldIcon = (field: SchemaField): string => {
  const icons = {
    string: 'Type',
    number: 'Hash',
    date: 'Calendar',
    boolean: 'ToggleLeft',
    enum: 'List',
    array: 'Layers',
    object: 'Package',
  };
  return icons[field.type] || 'Circle';
};

export const getOperatorLabel = (operator: FilterOperator): string => {
  const labels: Record<FilterOperator, string> = {
    'equals': 'Equals',
    'not-equals': 'Not Equals',
    'contains': 'Contains',
    'not-contains': 'Does Not Contain',
    'starts-with': 'Starts With',
    'ends-with': 'Ends With',
    'is-empty': 'Is Empty',
    'is-not-empty': 'Is Not Empty',
    'greater-than': 'Greater Than',
    'greater-than-or-equal': 'Greater Than or Equal',
    'less-than': 'Less Than',
    'less-than-or-equal': 'Less Than or Equal',
    'between': 'Between',
    'not-between': 'Not Between',
    'in': 'In List',
    'not-in': 'Not In List',
    'is-before': 'Is Before',
    'is-after': 'Is After',
    'is-between': 'Is Between',
    'is-today': 'Is Today',
    'is-yesterday': 'Is Yesterday',
    'is-this-week': 'Is This Week',
    'is-this-month': 'Is This Month',
    'is-this-year': 'Is This Year',
    'is-last-n-days': 'Is Last N Days',
    'is-last-n-months': 'Is Last N Months',
  };
  return labels[operator];
};

export const getOperatorsForFieldType = (type: FieldType): FilterOperator[] => {
  const operators: Record<FieldType, FilterOperator[]> = {
    string: ['equals', 'not-equals', 'contains', 'not-contains', 'starts-with', 'ends-with', 'is-empty', 'is-not-empty'],
    number: ['equals', 'not-equals', 'greater-than', 'greater-than-or-equal', 'less-than', 'less-than-or-equal', 'between', 'not-between'],
    date: ['is-before', 'is-after', 'is-between', 'is-today', 'is-yesterday', 'is-this-week', 'is-this-month', 'is-this-year', 'is-last-n-days', 'is-last-n-months'],
    boolean: ['equals', 'not-equals'],
    enum: ['equals', 'not-equals', 'in', 'not-in'],
    array: ['contains', 'not-contains', 'is-empty', 'is-not-empty'],
    object: ['is-empty', 'is-not-empty'],
  };
  return operators[type] || [];
};

export const getAggregationLabel = (aggregation: AggregationType): string => {
  const labels: Record<AggregationType, string> = {
    'count': 'Count',
    'count-distinct': 'Count Distinct',
    'sum': 'Sum',
    'average': 'Average',
    'min': 'Minimum',
    'max': 'Maximum',
    'median': 'Median',
    'percentile': 'Percentile',
  };
  return labels[aggregation];
};

export const getChartTypeIcon = (chartType: ChartType): string => {
  const icons: Record<ChartType, string> = {
    'table': 'Table',
    'bar': 'BarChart3',
    'column': 'BarChart2',
    'line': 'TrendingUp',
    'area': 'AreaChart',
    'pie': 'PieChart',
    'donut': 'Circle',
    'scatter': 'ScatterChart',
    'bubble': 'Circle',
    'heatmap': 'Grid3x3',
    'treemap': 'TreePine',
    'funnel': 'Filter',
    'gauge': 'Gauge',
    'kpi': 'Activity',
  };
  return icons[chartType];
};

export const formatFieldValue = (value: any, format?: FieldFormat): string => {
  if (value === null || value === undefined) return '-';
  
  if (!format) return String(value);
  
  switch (format.type) {
    case 'currency':
      return new Intl.NumberFormat(format.locale || 'en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(Number(value));
      
    case 'percentage':
      return `${(Number(value) * 100).toFixed(1)}%`;
      
    case 'decimal':
      return Number(value).toFixed(2);
      
    case 'date':
      return new Date(value).toLocaleDateString(format.locale || 'en-US');
      
    case 'duration':
      const hours = Math.floor(Number(value) / 3600);
      const minutes = Math.floor((Number(value) % 3600) / 60);
      return `${hours}h ${minutes}m`;
      
    default:
      return String(value);
  }
};

export const validateReport = (report: Partial<Report>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!report.name || report.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Report name is required',
      severity: 'error',
    });
  }
  
  if (!report.dataSource) {
    errors.push({
      field: 'dataSource',
      message: 'Data source must be selected',
      severity: 'error',
    });
  }
  
  if (!report.fields || report.fields.length === 0) {
    errors.push({
      field: 'fields',
      message: 'At least one field must be added',
      severity: 'error',
    });
  }
  
  if (report.chartType && report.chartType !== 'table') {
    if (!report.chartConfig?.xAxis?.fieldId) {
      errors.push({
        field: 'chartConfig.xAxis',
        message: 'X-axis field is required for charts',
        severity: 'warning',
      });
    }
  }
  
  return errors;
};
