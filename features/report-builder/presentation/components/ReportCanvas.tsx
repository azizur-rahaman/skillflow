/**
 * Report Canvas
 * 
 * Center drag-drop zone with field slots and chart type selector
 */

'use client';

import { ReportField, ChartType, SchemaField, getChartTypeIcon } from '@/features/report-builder/types/report.types';
import { X, GripVertical, Sigma, BarChart3, Table, PieChart, TrendingUp } from 'lucide-react';

interface ReportCanvasProps {
  fields: ReportField[];
  chartType: ChartType;
  availableFields: SchemaField[];
  onFieldAdd: (field: SchemaField) => void;
  onFieldRemove: (fieldId: string) => void;
  onChartTypeChange: (type: ChartType) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const ReportCanvas = ({
  fields,
  chartType,
  availableFields,
  onFieldAdd,
  onFieldRemove,
  onChartTypeChange,
  onDrop,
  onDragOver
}: ReportCanvasProps) => {
  
  const chartTypes: { type: ChartType; label: string; icon: any }[] = [
    { type: 'table', label: 'Table', icon: Table },
    { type: 'bar', label: 'Bar', icon: BarChart3 },
    { type: 'line', label: 'Line', icon: TrendingUp },
    { type: 'pie', label: 'Pie', icon: PieChart },
  ];
  
  return (
    <div className="h-full flex flex-col bg-slate-900/30">
      {/* Chart Type Selector */}
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Visualization
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {chartTypes.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => onChartTypeChange(type)}
              className={`p-3 rounded-lg border transition-all ${
                chartType === type
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                  : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-indigo-500/50'
              }`}
            >
              <Icon className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Drop Zone */}
      <div className="flex-1 p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Selected Fields
        </h3>
        
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="min-h-[200px] p-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 hover:border-indigo-500/50 transition-all"
        >
          {fields.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              Drag fields here to build your report
            </div>
          ) : (
            <div className="space-y-2">
              {fields.map(field => {
                const schemaField = availableFields.find(f => f.id === field.schemaFieldId);
                return (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 group hover:border-indigo-500/50 transition-all"
                  >
                    <GripVertical className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{field.displayName}</div>
                      {field.aggregation && (
                        <div className="text-xs text-indigo-400 flex items-center gap-1 mt-0.5">
                          <Sigma className="w-3 h-3" />
                          {field.aggregation}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onFieldRemove(field.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
