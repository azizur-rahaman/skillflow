/**
 * Filter Builder Component
 * 
 * Dynamic filter UI with operators, value inputs, and logical connectors.
 * Supports text, number, date, and array filters with smart operator selection.
 */

'use client';

import { useState } from 'react';
import { 
  Filter, 
  SchemaField, 
  FilterOperator, 
  FilterValue,
  getOperatorsForFieldType,
  getOperatorLabel
} from '@/features/report-builder/types/report.types';
import { Plus, X, Trash2, Check } from 'lucide-react';

interface FilterBuilderProps {
  filters: Filter[];
  availableFields: SchemaField[];
  onChange: (filters: Filter[]) => void;
}

export const FilterBuilder = ({ filters, availableFields, onChange }: FilterBuilderProps) => {
  const [isAddingFilter, setIsAddingFilter] = useState(false);
  
  const addFilter = () => {
    const newFilter: Filter = {
      id: `filter-${Date.now()}`,
      fieldId: availableFields[0]?.id || '',
      operator: 'equals',
      value: '',
      logicalOperator: filters.length > 0 ? 'AND' : undefined,
      isEnabled: true,
    };
    onChange([...filters, newFilter]);
    setIsAddingFilter(false);
  };
  
  const updateFilter = (id: string, updates: Partial<Filter>) => {
    onChange(filters.map(f => f.id === id ? { ...f, ...updates } : f));
  };
  
  const removeFilter = (id: string) => {
    onChange(filters.filter(f => f.id !== id));
  };
  
  const toggleFilter = (id: string) => {
    updateFilter(id, { isEnabled: !filters.find(f => f.id === id)?.isEnabled });
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Filters
        </h3>
        <button
          onClick={() => setIsAddingFilter(true)}
          className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-sm font-medium text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Filter
        </button>
      </div>
      
      {/* Filter List */}
      {filters.length > 0 ? (
        <div className="space-y-3">
          {filters.map((filter, index) => {
            const field = availableFields.find(f => f.id === filter.fieldId);
            if (!field) return null;
            
            return (
              <div key={filter.id} className="space-y-2">
                {/* Logical Operator (AND/OR) */}
                {index > 0 && filter.logicalOperator && (
                  <div className="flex items-center gap-2 pl-4">
                    <div className="flex rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden">
                      <button
                        onClick={() => updateFilter(filter.id, { logicalOperator: 'AND' })}
                        className={`px-3 py-1 text-xs font-medium transition-colors ${
                          filter.logicalOperator === 'AND'
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        AND
                      </button>
                      <button
                        onClick={() => updateFilter(filter.id, { logicalOperator: 'OR' })}
                        className={`px-3 py-1 text-xs font-medium transition-colors ${
                          filter.logicalOperator === 'OR'
                            ? 'bg-indigo-500 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        OR
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Filter Row */}
                <div
                  className={`p-4 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border transition-all ${
                    filter.isEnabled
                      ? 'border-slate-700'
                      : 'border-slate-800 opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Enable Toggle */}
                    <button
                      onClick={() => toggleFilter(filter.id)}
                      className={`mt-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        filter.isEnabled
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-slate-600 bg-transparent'
                      }`}
                    >
                      {filter.isEnabled && <Check className="w-3 h-3 text-white" />}
                    </button>
                    
                    {/* Filter Configuration */}
                    <div className="flex-1 space-y-3">
                      {/* Field Selection */}
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Field
                        </label>
                        <select
                          value={filter.fieldId}
                          onChange={(e) => updateFilter(filter.id, { 
                            fieldId: e.target.value,
                            operator: 'equals',
                            value: ''
                          })}
                          disabled={!filter.isEnabled}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {availableFields.map(f => (
                            <option key={f.id} value={f.id}>
                              {f.displayName}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Operator Selection */}
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Operator
                        </label>
                        <select
                          value={filter.operator}
                          onChange={(e) => updateFilter(filter.id, { 
                            operator: e.target.value as FilterOperator,
                            value: ''
                          })}
                          disabled={!filter.isEnabled}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {getOperatorsForFieldType(field.type).map(op => (
                            <option key={op} value={op}>
                              {getOperatorLabel(op)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Value Input */}
                      {!['is-empty', 'is-not-empty', 'is-today', 'is-yesterday', 'is-this-week', 'is-this-month', 'is-this-year'].includes(filter.operator) && (
                        <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Value
                          </label>
                          <FilterValueInput
                            field={field}
                            operator={filter.operator}
                            value={filter.value}
                            onChange={(value) => updateFilter(filter.id, { value })}
                            disabled={!filter.isEnabled}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => removeFilter(filter.id)}
                      className="mt-2 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400 text-sm">
          No filters applied. Click "Add Filter" to start.
        </div>
      )}
      
      {/* Quick Add */}
      {isAddingFilter && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-white">Add New Filter</h4>
            <button
              onClick={() => setIsAddingFilter(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={addFilter}
            className="w-full px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:brightness-110 transition-all"
          >
            Create Filter
          </button>
        </div>
      )}
    </div>
  );
};

// Value Input Component
interface FilterValueInputProps {
  field: SchemaField;
  operator: FilterOperator;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  disabled?: boolean;
}

const FilterValueInput = ({ field, operator, value, onChange, disabled }: FilterValueInputProps) => {
  // Between operators need two inputs
  if (operator === 'between' || operator === 'not-between' || operator === 'is-between') {
    const rangeValue = value as { min: number; max: number } | { start: Date; end: Date } | null;
    
    if (field.type === 'number') {
      return (
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={(rangeValue as any)?.min || ''}
            onChange={(e) => onChange({ 
              ...(rangeValue || {}),
              min: parseFloat(e.target.value) 
            } as any)}
            disabled={disabled}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <span className="flex items-center text-slate-400">to</span>
          <input
            type="number"
            placeholder="Max"
            value={(rangeValue as any)?.max || ''}
            onChange={(e) => onChange({ 
              ...(rangeValue || {}),
              max: parseFloat(e.target.value) 
            } as any)}
            disabled={disabled}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>
      );
    } else if (field.type === 'date') {
      return (
        <div className="flex gap-2">
          <input
            type="date"
            value={(rangeValue as any)?.start || ''}
            onChange={(e) => onChange({ 
              ...(rangeValue || {}),
              start: new Date(e.target.value) 
            } as any)}
            disabled={disabled}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <span className="flex items-center text-slate-400">to</span>
          <input
            type="date"
            value={(rangeValue as any)?.end || ''}
            onChange={(e) => onChange({ 
              ...(rangeValue || {}),
              end: new Date(e.target.value) 
            } as any)}
            disabled={disabled}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>
      );
    }
  }
  
  // Multi-select for IN/NOT IN operators
  if (operator === 'in' || operator === 'not-in') {
    return (
      <textarea
        placeholder="Enter values, one per line"
        value={Array.isArray(value) ? (value as any[]).join('\n') : ''}
        onChange={(e) => onChange(e.target.value.split('\n').filter(v => v.trim()))}
        disabled={disabled}
        rows={3}
        className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 resize-none"
      />
    );
  }
  
  // Last N days/months input
  if (operator === 'is-last-n-days' || operator === 'is-last-n-months') {
    return (
      <div className="flex gap-2">
        <input
          type="number"
          placeholder={operator === 'is-last-n-days' ? 'Number of days' : 'Number of months'}
          value={value as number || ''}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          min="1"
          className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>
    );
  }
  
  // Standard input based on field type
  switch (field.type) {
    case 'number':
      return (
        <input
          type="number"
          value={value as number || ''}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      );
      
    case 'date':
      return (
        <input
          type="date"
          value={value as string || ''}
          onChange={(e) => onChange(new Date(e.target.value))}
          disabled={disabled}
          className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      );
      
    case 'boolean':
      return (
        <select
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value === 'true')}
          disabled={disabled}
          className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
      
    case 'enum':
      // Would need enum options from field metadata
      return (
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter value"
          className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      );
      
    default:
      return (
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Enter value"
          className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      );
  }
};
