/**
 * Report Builder Context
 * 
 * State management for report builder with sample data
 */

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  Report,
  ReportResult,
  DataSource,
  SchemaField,
  Filter,
  ReportField,
  ChartType
} from '../types/report.types';

interface ReportBuilderContextType {
  dataSource: DataSource;
  currentReport: Partial<Report>;
  previewResult: ReportResult | null;
  isLoading: boolean;
  actions: {
    addField: (field: SchemaField) => void;
    removeField: (fieldId: string) => void;
    updateFilters: (filters: Filter[]) => void;
    setChartType: (type: ChartType) => void;
    refreshPreview: () => void;
    exportReport: (format: 'pdf' | 'csv' | 'excel') => void;
    saveReport: (name: string) => void;
  };
}

const ReportBuilderContext = createContext<ReportBuilderContextType | undefined>(undefined);

export const useReportBuilder = () => {
  const context = useContext(ReportBuilderContext);
  if (!context) throw new Error('useReportBuilder must be used within provider');
  return context;
};

// Mock data source
const mockDataSource: DataSource = {
  id: 'ds-skills',
  name: 'Skills Analytics',
  type: 'skills',
  description: 'Comprehensive skill data across all users',
  recordCount: 15420,
  lastUpdated: '2025-11-06T10:00:00Z',
  refreshRate: 'real-time',
  schema: {
    fields: [
      {
        id: 'skill_name',
        name: 'skill_name',
        displayName: 'Skill Name',
        type: 'string',
        category: 'dimension',
        description: 'Name of the skill',
        isRequired: true,
        isFilterable: true,
        isSortable: true,
        isGroupable: true,
        aggregations: ['count', 'count-distinct'],
      },
      {
        id: 'confidence',
        name: 'confidence',
        displayName: 'Confidence Score',
        type: 'number',
        category: 'measure',
        description: 'Skill confidence score (0-100)',
        isRequired: false,
        isFilterable: true,
        isSortable: true,
        isGroupable: false,
        aggregations: ['average', 'min', 'max', 'sum'],
      },
      {
        id: 'user_count',
        name: 'user_count',
        displayName: 'User Count',
        type: 'number',
        category: 'measure',
        description: 'Number of users with this skill',
        isRequired: false,
        isFilterable: true,
        isSortable: true,
        isGroupable: false,
        aggregations: ['count', 'sum'],
      },
      {
        id: 'category',
        name: 'category',
        displayName: 'Category',
        type: 'enum',
        category: 'dimension',
        description: 'Skill category',
        isRequired: true,
        isFilterable: true,
        isSortable: true,
        isGroupable: true,
      },
      {
        id: 'is_trending',
        name: 'is_trending',
        displayName: 'Is Trending',
        type: 'boolean',
        category: 'dimension',
        description: 'Whether skill is currently trending',
        isRequired: false,
        isFilterable: true,
        isSortable: false,
        isGroupable: true,
      },
      {
        id: 'last_updated',
        name: 'last_updated',
        displayName: 'Last Updated',
        type: 'date',
        category: 'timestamp',
        description: 'Last update timestamp',
        isRequired: false,
        isFilterable: true,
        isSortable: true,
        isGroupable: false,
      },
    ],
    relationships: [],
  },
};

// Mock preview data
const mockPreviewData: ReportResult = {
  reportId: 'preview',
  data: [
    { skill_name: 'React', confidence: 92, user_count: 1250, category: 'Frontend', is_trending: true },
    { skill_name: 'Python', confidence: 88, user_count: 980, category: 'Backend', is_trending: true },
    { skill_name: 'TypeScript', confidence: 90, user_count: 1100, category: 'Frontend', is_trending: true },
    { skill_name: 'Node.js', confidence: 85, user_count: 890, category: 'Backend', is_trending: false },
    { skill_name: 'AWS', confidence: 82, user_count: 750, category: 'DevOps', is_trending: true },
  ],
  summary: { totals: {}, averages: {}, min: {}, max: {}, count: 5, distinctCount: {} },
  executionTime: 45,
  rowCount: 5,
  columnCount: 5,
  generatedAt: new Date().toISOString(),
};

export const ReportBuilderProvider = ({ children }: { children: ReactNode }) => {
  const [currentReport, setCurrentReport] = useState<Partial<Report>>({
    fields: [],
    filters: [],
    chartType: 'table',
  });
  const [previewResult, setPreviewResult] = useState<ReportResult | null>(mockPreviewData);
  const [isLoading, setIsLoading] = useState(false);
  
  const actions = {
    addField: (field: SchemaField) => {
      const newField: ReportField = {
        id: `field-${Date.now()}`,
        schemaFieldId: field.id,
        displayName: field.displayName,
        aggregation: field.category === 'measure' ? 'sum' : undefined,
        order: currentReport.fields?.length || 0,
        isVisible: true,
      };
      setCurrentReport(prev => ({
        ...prev,
        fields: [...(prev.fields || []), newField],
      }));
    },
    
    removeField: (fieldId: string) => {
      setCurrentReport(prev => ({
        ...prev,
        fields: prev.fields?.filter(f => f.id !== fieldId),
      }));
    },
    
    updateFilters: (filters: Filter[]) => {
      setCurrentReport(prev => ({ ...prev, filters }));
    },
    
    setChartType: (type: ChartType) => {
      setCurrentReport(prev => ({ ...prev, chartType: type }));
    },
    
    refreshPreview: () => {
      setIsLoading(true);
      setTimeout(() => {
        setPreviewResult(mockPreviewData);
        setIsLoading(false);
      }, 500);
    },
    
    exportReport: (format: 'pdf' | 'csv' | 'excel') => {
      console.log(`Exporting report as ${format}`);
    },
    
    saveReport: (name: string) => {
      console.log(`Saving report: ${name}`);
    },
  };
  
  return (
    <ReportBuilderContext.Provider value={{
      dataSource: mockDataSource,
      currentReport,
      previewResult,
      isLoading,
      actions,
    }}>
      {children}
    </ReportBuilderContext.Provider>
  );
};
