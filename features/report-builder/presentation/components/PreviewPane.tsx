/**
 * Report Preview Pane
 * 
 * Right panel showing real-time data preview with chart/table toggle
 */

'use client';

import { ReportResult, ChartType } from '@/features/report-builder/types/report.types';
import { BarChart3, Table as TableIcon, Download, RefreshCw } from 'lucide-react';

interface PreviewPaneProps {
  result: ReportResult | null;
  isLoading: boolean;
  chartType: ChartType;
  onRefresh: () => void;
  onExport: (format: 'pdf' | 'csv' | 'excel') => void;
}

export const PreviewPane = ({ result, isLoading, chartType, onRefresh, onExport }: PreviewPaneProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-l border-slate-700">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Generating preview...</p>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-l border-slate-700">
        <div className="text-center text-slate-400">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p>Add fields to see preview</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-l border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-white">Preview</h2>
          <p className="text-xs text-slate-400 mt-1">
            {result.rowCount.toLocaleString()} rows • {result.columnCount} columns
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onExport('csv')}
            className="px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-sm font-medium text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {chartType === 'table' ? (
          <DataTable data={result.data} />
        ) : (
          <ChartPreview chartType={chartType} data={result.data} />
        )}
      </div>
      
      {/* Stats Footer */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="text-xs text-slate-400">
          Generated in {result.executionTime}ms
        </div>
      </div>
    </div>
  );
};

const DataTable = ({ data }: { data: any[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-700">
          {data[0] && Object.keys(data[0]).map(key => (
            <th key={key} className="text-left p-2 font-medium text-slate-300">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 100).map((row, i) => (
          <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30">
            {Object.values(row).map((val: any, j) => (
              <td key={j} className="p-2 text-slate-400">
                {String(val)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ChartPreview = ({ chartType, data }: { chartType: ChartType; data: any[] }) => (
  <div className="h-full flex items-center justify-center text-slate-400">
    <div className="text-center">
      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
      <p>{chartType} chart preview</p>
      <p className="text-xs text-slate-500 mt-1">{data.length} data points</p>
    </div>
  </div>
);
