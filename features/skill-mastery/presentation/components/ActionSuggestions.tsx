'use client';

import React from 'react';
import {
  Lightbulb,
  Target,
  BookOpen,
  Code,
  Users,
  X,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ActionSuggestion } from '../../types/skill-mastery.types';

/**
 * Props for ActionSuggestions component
 */
interface ActionSuggestionsProps {
  suggestions: ActionSuggestion[];
  onDismiss?: (suggestionId: string) => void;
  onAction?: (suggestion: ActionSuggestion) => void;
  maxSuggestions?: number;
}

/**
 * Action suggestions panel with personalized recommendations
 * Features: priority-based ordering, actionable CTAs, dismissible cards
 */
export const ActionSuggestions: React.FC<ActionSuggestionsProps> = ({
  suggestions,
  onDismiss,
  onAction,
  maxSuggestions = 6,
}) => {
  const displayedSuggestions = suggestions.slice(0, maxSuggestions);

  // Get icon based on suggestion type
  const getTypeIcon = (type: ActionSuggestion['type']) => {
    const icons = {
      practice: Code,
      learn: BookOpen,
      assess: Target,
      validate: Sparkles,
      mentor: Users,
    };
    const Icon = icons[type] || Lightbulb;
    return <Icon className="w-5 h-5" />;
  };

  // Get color based on priority
  const getPriorityColor = (priority: ActionSuggestion['priority']) => {
    const colors = {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#22D3EE',
    };
    return colors[priority];
  };

  // Get type label
  const getTypeLabel = (type: ActionSuggestion['type']) => {
    const labels = {
      practice: 'Practice',
      learn: 'Learn',
      assess: 'Assess',
      validate: 'Validate',
      mentor: 'Mentor',
    };
    return labels[type];
  };

  if (displayedSuggestions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-8">
        <div className="text-center text-slate-400">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-2">All Caught Up!</p>
          <p className="text-sm">
            No new suggestions at the moment. Keep up the great work!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Personalized Actions</h3>
            <p className="text-sm text-slate-400">
              {displayedSuggestions.length} recommendation{displayedSuggestions.length !== 1 ? 's' : ''} to improve your skills
            </p>
          </div>
        </div>
      </div>

      {/* Suggestions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedSuggestions.map((suggestion) => {
          const priorityColor = getPriorityColor(suggestion.priority);

          return (
            <div
              key={suggestion.id}
              className="group bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Type icon */}
                  <div
                    className="p-2 rounded-lg shrink-0"
                    style={{
                      backgroundColor: `${priorityColor}20`,
                      color: priorityColor,
                    }}
                  >
                    {getTypeIcon(suggestion.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Type and priority badges */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${priorityColor}20`,
                          color: priorityColor,
                          border: `1px solid ${priorityColor}40`,
                        }}
                      >
                        {getTypeLabel(suggestion.type)}
                      </span>
                      {suggestion.priority === 'high' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
                          High Priority
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-semibold text-white mb-1.5 line-clamp-2">
                      {suggestion.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {suggestion.description}
                    </p>
                  </div>
                </div>

                {/* Dismiss button */}
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(suggestion.id)}
                    className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
                    aria-label="Dismiss suggestion"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                {/* Time estimate */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{suggestion.estimatedTime}</span>
                </div>

                {/* Action button */}
                <button
                  onClick={() => onAction?.(suggestion)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-lg text-sm font-medium transition-all group-hover:gap-2"
                >
                  <span>Take Action</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Resources (if available) */}
              {suggestion.resources && suggestion.resources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2">Recommended Resources:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.resources.slice(0, 2).map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 hover:bg-slate-800 rounded text-xs text-slate-400 hover:text-slate-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {resource.type === 'course' && <BookOpen className="w-3 h-3" />}
                        {resource.type === 'practice' && <Code className="w-3 h-3" />}
                        {resource.type === 'video' && <span className="w-3 h-3">🎥</span>}
                        {resource.type === 'article' && <span className="w-3 h-3">📄</span>}
                        <span className="truncate max-w-[120px]">{resource.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {suggestions.length > maxSuggestions && (
        <div className="text-center">
          <button className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
            +{suggestions.length - maxSuggestions} more suggestions
          </button>
        </div>
      )}
    </div>
  );
};
