'use client';

import { HeatmapCellComponent } from './HeatmapCellComponent';
import { useHeatmap } from '../../context/HeatmapContext';

interface HeatmapGridProps {
  cellSize?: number;
  gap?: number;
  showRowLabels?: boolean;
  showColumnLabels?: boolean;
}

export const HeatmapGrid = ({
  cellSize = 48,
  gap = 4,
  showRowLabels = true,
  showColumnLabels = true,
}: HeatmapGridProps) => {
  const { state, actions } = useHeatmap();
  const { matrix, selectedCell, filters } = state;

  if (!matrix) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  // Apply filters
  let filteredRows = matrix.rows;
  
  if (filters.searchQuery) {
    filteredRows = filteredRows.filter((row) =>
      row.label.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );
  }

  if (filters.minValue > 0 || filters.maxValue < 100) {
    filteredRows = filteredRows.filter((row) =>
      row.averageValue >= filters.minValue && row.averageValue <= filters.maxValue
    );
  }

  if (filters.domains.length > 0) {
    filteredRows = filteredRows.filter((row) =>
      filters.domains.includes(row.domain!)
    );
  }

  const labelWidth = showRowLabels ? 120 : 0;
  const labelHeight = showColumnLabels ? 80 : 0;

  return (
    <div className="relative">
      {/* Column labels */}
      {showColumnLabels && (
        <div
          className="flex items-end mb-2"
          style={{ marginLeft: labelWidth + gap }}
        >
          {matrix.columns.map((column, index) => (
            <div
              key={column.id}
              className="flex-shrink-0 flex flex-col items-center justify-end"
              style={{
                width: cellSize,
                marginLeft: index === 0 ? 0 : gap,
                height: labelHeight,
              }}
            >
              {/* Column label rotated */}
              <div className="transform -rotate-45 origin-bottom-left mb-2">
                <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
                  {column.label}
                </span>
              </div>
              {/* Average indicator */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-red-500"
                  style={{ width: `${column.averageValue}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid with row labels */}
      <div className="space-y-1" style={{ gap: `${gap}px` }}>
        {filteredRows.map((row, rowIndex) => (
          <div key={row.id} className="flex items-center animate-domain-fade">
            {/* Row label */}
            {showRowLabels && (
              <div
                className="flex-shrink-0 pr-3 flex items-center justify-between"
                style={{ width: labelWidth }}
              >
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-300 truncate">
                    {row.label}
                  </p>
                  <p className="text-xs text-slate-500">{row.averageValue}%</p>
                </div>
                {/* Trend indicator */}
                <div className="ml-2">
                  {row.trend === 'up' && (
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-intensity-pulse" />
                  )}
                  {row.trend === 'down' && (
                    <div className="w-2 h-2 bg-red-400 rounded-full" />
                  )}
                  {row.trend === 'stable' && (
                    <div className="w-2 h-2 bg-slate-500 rounded-full" />
                  )}
                </div>
              </div>
            )}

            {/* Row cells */}
            <div className="flex" style={{ gap: `${gap}px` }}>
              {row.cells.map((cell, cellIndex) => (
                <HeatmapCellComponent
                  key={cell.id}
                  cell={cell}
                  size={cellSize}
                  onHover={actions.hoverCell}
                  onClick={actions.selectCell}
                  isSelected={selectedCell?.id === cell.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredRows.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-slate-400 mb-2">No skills match your filters</p>
            <button
              onClick={actions.resetFilters}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Reset filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
