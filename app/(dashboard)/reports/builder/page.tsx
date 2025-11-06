/**
 * Report Builder Page
 * 
 * Main page for building custom data reports
 */

'use client';

import { useState } from 'react';
import { ReportBuilderProvider, useReportBuilder } from '@/features/report-builder/context/ReportBuilderContext';
import { FieldSelector } from '@/features/report-builder/presentation/components/FieldSelector';
import { ReportCanvas } from '@/features/report-builder/presentation/components/ReportCanvas';
import { FilterBuilder } from '@/features/report-builder/presentation/components/FilterBuilder';
import { PreviewPane } from '@/features/report-builder/presentation/components/PreviewPane';
import { SchemaField } from '@/features/report-builder/types/report.types';
import { Save, Download, Settings } from 'lucide-react';

function ReportBuilderContent() {
  const { dataSource, currentReport, previewResult, isLoading, actions } = useReportBuilder();
  const [showFilters, setShowFilters] = useState(false);
  
  const handleFieldDragStart = (field: SchemaField) => {
    // Field drag started - handled by native drag events
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fieldData = e.dataTransfer.getData('application/json');
    if (fieldData) {
      const field: SchemaField = JSON.parse(fieldData);
      actions.addField(field);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">Report Builder</h1>
            <input
              type="text"
              placeholder="Untitled Report"
              className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm text-white transition flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Filters {currentReport.filters && currentReport.filters.length > 0 && `(${currentReport.filters.length})`}
            </button>
            
            <button
              onClick={() => actions.exportReport('csv')}
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-sm text-white transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <button
              onClick={() => actions.saveReport('My Report')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg text-sm font-medium text-white transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Report
            </button>
          </div>
        </div>
        
        {/* Filter Builder Panel */}
        {showFilters && (
          <div className="border-t border-slate-700 px-6 py-4">
            <FilterBuilder
              filters={currentReport.filters || []}
              availableFields={dataSource.schema.fields}
              onChange={actions.updateFilters}
            />
          </div>
        )}
      </div>
      
      {/* 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Field Selector */}
        <div className="w-80 border-r border-slate-700 bg-slate-900/30 overflow-y-auto">
          <FieldSelector
            fields={dataSource.schema.fields}
            dataSourceName={dataSource.name}
            onFieldDragStart={handleFieldDragStart}
            onFieldDragEnd={() => {}}
          />
        </div>
        
        {/* Center: Report Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <ReportCanvas
            fields={currentReport.fields || []}
            availableFields={dataSource.schema.fields}
            chartType={currentReport.chartType || 'table'}
            onFieldAdd={(field: SchemaField) => actions.addField(field)}
            onFieldRemove={actions.removeField}
            onChartTypeChange={actions.setChartType}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        </div>
        
        {/* Right: Preview Pane */}
        <div className="w-96 border-l border-slate-700 bg-slate-900/30">
          <PreviewPane
            result={previewResult}
            isLoading={isLoading}
            chartType={currentReport.chartType || 'table'}
            onRefresh={actions.refreshPreview}
            onExport={() => actions.exportReport('csv')}
          />
        </div>
      </div>
    </div>
  );
}

export default function ReportBuilderPage() {
  return (
    <ReportBuilderProvider>
      <ReportBuilderContent />
    </ReportBuilderProvider>
  );
}
