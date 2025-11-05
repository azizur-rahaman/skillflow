'use client';

import { useState } from 'react';
import { Permission } from '../../types/consent.types';
import { useConsent } from '../../context/ConsentContext';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface PermissionCardProps {
  permission: Permission;
}

export default function PermissionCard({ permission }: PermissionCardProps) {
  const { togglePermission } = useConsent();
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamically get icon component
  const IconComponent = (LucideIcons as any)[permission.icon] || LucideIcons.Shield;

  const isEnabled = permission.status === 'granted';

  const getCategoryColor = () => {
    switch (permission.category) {
      case 'essential':
        return '#10B981'; // Green
      case 'functional':
        return '#4F46E5'; // Indigo
      case 'analytics':
        return '#A855F7'; // Purple
      case 'marketing':
        return '#22D3EE'; // Cyan
      default:
        return '#6B7280'; // Gray
    }
  };

  const getCategoryLabel = () => {
    switch (permission.category) {
      case 'essential':
        return 'Essential';
      case 'functional':
        return 'Functional';
      case 'analytics':
        return 'Analytics';
      case 'marketing':
        return 'Marketing';
      default:
        return '';
    }
  };

  const categoryColor = getCategoryColor();

  return (
    <div
      className={`
        group relative
        p-6 rounded-2xl
        bg-white/5 backdrop-blur-sm
        border-2 transition-all duration-300
        ${
          isEnabled
            ? 'border-white/30 bg-white/10'
            : 'border-white/10 hover:border-white/20'
        }
      `}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Icon */}
            <div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                border-2 transition-all duration-300
              `}
              style={{
                backgroundColor: `${categoryColor}15`,
                borderColor: `${categoryColor}60`,
              }}
            >
              <IconComponent
                className="w-6 h-6"
                style={{ color: categoryColor }}
              />
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-semibold text-lg">
                  {permission.title}
                </h3>
                
                {/* Required Badge */}
                {permission.isRequired && (
                  <span className="px-2 py-0.5 bg-[#10B981]/20 border border-[#10B981]/40 rounded text-xs text-[#10B981] font-medium">
                    Required
                  </span>
                )}

                {/* Category Badge */}
                <span
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${categoryColor}20`,
                    border: `1px solid ${categoryColor}40`,
                    color: categoryColor,
                  }}
                >
                  {getCategoryLabel()}
                </span>
              </div>

              <p className="text-white/70 text-sm leading-relaxed">
                {permission.description}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="ml-4">
            <button
              onClick={() => !permission.isRequired && togglePermission(permission.id)}
              disabled={permission.isRequired}
              className={`
                relative inline-flex h-7 w-12 items-center rounded-full
                transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F172A]
                ${permission.isRequired ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                ${
                  isEnabled
                    ? 'bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]'
                    : 'bg-white/20'
                }
              `}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                  ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            flex items-center gap-2 w-full
            text-white/50 hover:text-white/70
            text-sm font-medium
            transition-colors
          "
        >
          <Info className="w-4 h-4" />
          <span>{isExpanded ? 'Hide' : 'View'} Details</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 ml-auto" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-auto" />
          )}
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-slide-down">
            {/* Detailed Description */}
            <div>
              <h4 className="text-white/80 text-sm font-semibold mb-2">
                What This Means
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                {permission.detailedDescription}
              </p>
            </div>

            {/* Data Types */}
            {permission.dataTypes && permission.dataTypes.length > 0 && (
              <div>
                <h4 className="text-white/80 text-sm font-semibold mb-2">
                  Data We Collect
                </h4>
                <div className="flex flex-wrap gap-2">
                  {permission.dataTypes.map((dataType, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white/70"
                    >
                      {dataType}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            {permission.examples && permission.examples.length > 0 && (
              <div>
                <h4 className="text-white/80 text-sm font-semibold mb-2">
                  How We Use It
                </h4>
                <ul className="space-y-2">
                  {permission.examples.map((example, index) => (
                    <li key={index} className="flex items-start text-sm text-white/60">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0"
                        style={{ backgroundColor: categoryColor }}
                      />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Retention Period */}
            {permission.retentionPeriod && (
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Data Retention</span>
                  <span className="text-white/70 font-medium">
                    {permission.retentionPeriod}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
