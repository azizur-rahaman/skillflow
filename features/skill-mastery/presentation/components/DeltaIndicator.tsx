'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import {
  DeltaType,
  getDeltaColor,
  getDeltaLabel,
  getDeltaMessage,
  formatPercentage,
} from '../../types/skill-mastery.types';

/**
 * Props for DeltaIndicator component
 */
interface DeltaIndicatorProps {
  aiMastery: number;
  selfConfidence: number;
  delta: number;
  deltaType: DeltaType;
  skillName?: string;
  showMessage?: boolean;
  compact?: boolean;
}

/**
 * Delta indicator showing gap between AI mastery and self-confidence
 * Features: color coding, visual icons, personalized messages
 */
export const DeltaIndicator: React.FC<DeltaIndicatorProps> = ({
  aiMastery,
  selfConfidence,
  delta,
  deltaType,
  skillName,
  showMessage = true,
  compact = false,
}) => {
  const color = getDeltaColor(deltaType);
  const label = getDeltaLabel(deltaType);
  const message = getDeltaMessage(deltaType, delta);

  // Icon based on delta type
  const getIcon = () => {
    if (deltaType === DeltaType.OVERCONFIDENT) {
      return <AlertTriangle className="w-5 h-5" />;
    } else if (deltaType === DeltaType.UNDERCONFIDENT) {
      return <Info className="w-5 h-5" />;
    } else {
      return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  // Arrow icon based on delta direction
  const getArrowIcon = () => {
    if (delta > 5) {
      return <TrendingUp className="w-4 h-4" />;
    } else if (delta < -5) {
      return <TrendingDown className="w-4 h-4" />;
    } else {
      return <Minus className="w-4 h-4" />;
    }
  };

  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
        style={{
          backgroundColor: `${color}20`,
          color: color,
          border: `1px solid ${color}40`,
        }}
      >
        {getArrowIcon()}
        <span>{delta > 0 ? '+' : ''}{Math.round(delta)}%</span>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border-2 p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/30"
      style={{ borderColor: `${color}40` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {getIcon()}
          </div>
          <div>
            <div className="text-sm text-slate-400">Calibration Status</div>
            <div className="text-lg font-semibold" style={{ color }}>
              {label}
            </div>
          </div>
        </div>

        {/* Delta value with arrow */}
        <div className="flex items-center gap-2">
          {getArrowIcon()}
          <div className="text-3xl font-bold" style={{ color }}>
            {delta > 0 ? '+' : ''}{Math.round(delta)}%
          </div>
        </div>
      </div>

      {/* Score comparison bars */}
      <div className="space-y-3 mb-4">
        {/* AI Mastery bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-sm text-slate-400">AI Mastery</div>
            <div className="text-sm font-semibold text-indigo-400">
              {formatPercentage(aiMastery)}
            </div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
              style={{ width: `${aiMastery}%` }}
            />
          </div>
        </div>

        {/* Self-Confidence bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-sm text-slate-400">Self-Confidence</div>
            <div className="text-sm font-semibold text-cyan-400">
              {formatPercentage(selfConfidence)}
            </div>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all duration-700"
              style={{ width: `${selfConfidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Message */}
      {showMessage && (
        <div
          className="p-4 rounded-lg text-sm leading-relaxed"
          style={{
            backgroundColor: `${color}10`,
            borderLeft: `3px solid ${color}`,
          }}
        >
          {message}
        </div>
      )}

      {/* Additional insights for specific delta types */}
      {deltaType === DeltaType.OVERCONFIDENT && (
        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="text-xs font-medium text-orange-400 mb-1">💡 Recommendation</div>
          <div className="text-sm text-slate-300">
            Focus on hands-on practice and real-world projects to align your skills with your confidence.
          </div>
        </div>
      )}

      {deltaType === DeltaType.UNDERCONFIDENT && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-xs font-medium text-blue-400 mb-1">🚀 Opportunity</div>
          <div className="text-sm text-slate-300">
            You&apos;re ready for bigger challenges! Take on complex projects to boost your confidence.
          </div>
        </div>
      )}

      {deltaType === DeltaType.ALIGNED && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="text-xs font-medium text-green-400 mb-1">✓ Well-Calibrated</div>
          <div className="text-sm text-slate-300">
            Excellent self-awareness! Continue maintaining this balance through regular practice.
          </div>
        </div>
      )}
    </div>
  );
};
