/**
 * Field Selector Panel
 * 
 * Left sidebar with draggable fields organized by category.
 * Inspired by Tableau's field list with search and categorization.
 */

'use client';

import { useState } from 'react';
import { SchemaField, FieldCategory, getFieldIcon } from '@/features/report-builder/types/report.types';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Database,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  List,
  Layers,
  Package,
  GripVertical
} from 'lucide-react';

interface FieldSelectorProps {
  fields: SchemaField[];
  dataSourceName: string;
  onFieldDragStart: (field: SchemaField) => void;
  onFieldDragEnd: () => void;
}

export const FieldSelector = ({ 
  fields, 
  dataSourceName,
  onFieldDragStart, 
  onFieldDragEnd 
}: FieldSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['dimension', 'measure'])
  );
  
  // Group fields by category
  const fieldsByCategory = fields.reduce((acc, field) => {
    const category = field.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(field);
    return acc;
  }, {} as Record<FieldCategory, SchemaField[]>);
  
  // Filter fields by search
  const filteredFields = searchQuery
    ? fields.filter(field =>
        field.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : fields;
  
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };
  
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Type, Hash, Calendar, ToggleLeft, List, Layers, Package,
    };
    return icons[iconName] || Type;
  };
  
  const getCategoryColor = (category: FieldCategory): string => {
    const colors = {
      dimension: '#22D3EE',
      measure: '#6366F1',
      attribute: '#A855F7',
      timestamp: '#F59E0B',
      identifier: '#64748B',
    };
    return colors[category];
  };
  
  const getCategoryLabel = (category: FieldCategory): string => {
    const labels = {
      dimension: 'Dimensions',
      measure: 'Measures',
      attribute: 'Attributes',
      timestamp: 'Timestamps',
      identifier: 'Identifiers',
    };
    return labels[category];
  };
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-r border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-white">Fields</h2>
        </div>
        <p className="text-xs text-slate-400 mb-3">{dataSourceName}</p>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Field List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {searchQuery ? (
          // Flat list when searching
          <div className="space-y-1">
            {filteredFields.map((field) => (
              <FieldItem
                key={field.id}
                field={field}
                onDragStart={() => onFieldDragStart(field)}
                onDragEnd={onFieldDragEnd}
                categoryColor={getCategoryColor(field.category)}
              />
            ))}
            {filteredFields.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No fields found matching "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          // Categorized list
          Object.entries(fieldsByCategory).map(([category, categoryFields]) => {
            const isExpanded = expandedCategories.has(category);
            const color = getCategoryColor(category as FieldCategory);
            
            return (
              <div key={category} className="mb-2">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-800/50 transition-colors group"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-white flex-1 text-left">
                    {getCategoryLabel(category as FieldCategory)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {categoryFields.length}
                  </span>
                </button>
                
                {/* Category Fields */}
                {isExpanded && (
                  <div className="mt-1 ml-6 space-y-1">
                    {categoryFields.map((field) => (
                      <FieldItem
                        key={field.id}
                        field={field}
                        onDragStart={() => onFieldDragStart(field)}
                        onDragEnd={onFieldDragEnd}
                        categoryColor={color}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{fields.length} fields available</span>
          <span className="text-indigo-400">{filteredFields.length} shown</span>
        </div>
      </div>
    </div>
  );
};

// Individual Field Item Component
interface FieldItemProps {
  field: SchemaField;
  onDragStart: () => void;
  onDragEnd: () => void;
  categoryColor: string;
}

const FieldItem = ({ field, onDragStart, onDragEnd, categoryColor }: FieldItemProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart();
    
    // Set drag data
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify(field));
    
    // Create custom drag image (optional)
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };
  
  const getTypeIcon = () => {
    const IconComponent = getIconComponent(getFieldIcon(field));
    return <IconComponent className="w-4 h-4" />;
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing transition-all ${
        isDragging
          ? 'opacity-50 scale-95'
          : 'hover:bg-slate-800/50 hover:scale-[1.02]'
      }`}
    >
      <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
      
      <div
        className="w-1 h-8 rounded-full flex-shrink-0"
        style={{ backgroundColor: categoryColor }}
      />
      
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: `${categoryColor}15`,
          color: categoryColor,
        }}
      >
        {getTypeIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">
          {field.displayName}
        </div>
        {field.description && (
          <div className="text-xs text-slate-400 truncate">
            {field.description}
          </div>
        )}
      </div>
      
      {/* Aggregation Badge */}
      {field.aggregations && field.aggregations.length > 0 && (
        <div className="px-2 py-0.5 rounded bg-slate-800/50 text-xs text-slate-400 flex-shrink-0">
          Σ
        </div>
      )}
      
      {/* Required Badge */}
      {field.isRequired && (
        <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Required field" />
      )}
    </div>
  );
};

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Type, Hash, Calendar, ToggleLeft, List, Layers, Package,
  };
  return icons[iconName] || Type;
};
