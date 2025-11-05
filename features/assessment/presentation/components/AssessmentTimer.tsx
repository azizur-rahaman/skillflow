'use client';

/**
 * Assessment Timer Component
 * Countdown timer with visual warnings and auto-submit
 */

import React from 'react';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';
import { useAssessment } from '../../context/AssessmentContext';
import { formatTime, getTimeWarning } from '../../types/assessment.types';

export function AssessmentTimer() {
  const { state, actions } = useAssessment();
  const { assessment, attempt, isTimerRunning } = state;

  if (!assessment || !attempt) return null;

  const timeRemaining = attempt.timeRemaining;
  const totalTime = assessment.timeLimit;
  const { level, color } = getTimeWarning(timeRemaining, totalTime);
  const percentage = (timeRemaining / totalTime) * 100;

  return (
    <div className="flex items-center gap-4">
      {/* Timer Display */}
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 ${
          level === 'danger'
            ? 'bg-[#EF4444]/10 border-[#EF4444] animate-pulse'
            : level === 'warning'
            ? 'bg-[#F59E0B]/10 border-[#F59E0B]'
            : 'bg-[#22D3EE]/10 border-[#22D3EE]'
        }`}
      >
        <div className="relative w-10 h-10">
          {/* Background Circle */}
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="#334155"
              strokeWidth="3"
            />
            {/* Progress Circle */}
            <circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - percentage / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Clock className="w-5 h-5" style={{ color }} />
          </div>
        </div>

        <div>
          <div className="text-xl font-bold font-mono" style={{ color }}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xs text-[#94A3B8]">
            {Math.floor(timeRemaining / 60)} min left
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      {level === 'danger' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          <span className="text-sm text-[#EF4444] font-medium">Time running out!</span>
        </div>
      )}

      {level === 'warning' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-sm text-[#F59E0B] font-medium">Less than 5 minutes</span>
        </div>
      )}

      {/* Pause/Resume Button */}
      <button
        onClick={isTimerRunning ? actions.pauseTimer : actions.resumeTimer}
        className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#94A3B8] hover:text-[#6366F1] hover:border-[#6366F1] transition-all duration-200"
        aria-label={isTimerRunning ? 'Pause timer' : 'Resume timer'}
      >
        {isTimerRunning ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}
      </button>
    </div>
  );
}
