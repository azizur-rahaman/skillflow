'use client';

/**
 * Category Filter Component
 * 
 * Category chips with icons and active states.
 */

import React from 'react';
import { CategoryFilterProps, getCategoryIcon, getCategoryColor } from '../../types/marketplace.types';

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onChange,
  counts,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const icon = getCategoryIcon(category);
        const color = getCategoryColor(category);
        const isSelected = selectedCategory === category;
        const count = counts?.[category];

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`
              inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
              font-medium text-sm transition-all duration-200
              ${
                isSelected
                  ? 'shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
              }
            `}
            style={
              isSelected
                ? {
                    background: `linear-gradient(135deg, ${color}30, ${color}20)`,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: `${color}60`,
                    color: color,
                    boxShadow: `0 8px 20px -8px ${color}40`,
                  }
                : undefined
            }
          >
            <span className="text-lg">{icon}</span>
            <span>{category}</span>
            {count !== undefined && (
              <span
                className={`
                  ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${isSelected ? 'opacity-90' : 'bg-slate-700/50 text-slate-400'}
                `}
                style={
                  isSelected
                    ? {
                        backgroundColor: `${color}40`,
                        color: color,
                      }
                    : undefined
                }
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
