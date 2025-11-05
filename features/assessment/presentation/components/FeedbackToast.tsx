'use client';

/**
 * Feedback Toast Component
 * Instant feedback with success/failure animations
 */

import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAssessment } from '../../context/AssessmentContext';
import type { FeedbackToast as ToastType } from '../../types/assessment.types';

export function FeedbackToast() {
  const { state, actions } = useAssessment();
  const { feedbackToast } = state;

  if (!feedbackToast) return null;

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: { bg: '#10B981', border: '#10B981', icon: '#10B981' },
    error: { bg: '#EF4444', border: '#EF4444', icon: '#EF4444' },
    info: { bg: '#6366F1', border: '#6366F1', icon: '#6366F1' },
    warning: { bg: '#F59E0B', border: '#F59E0B', icon: '#F59E0B' },
  };

  const Icon = icons[feedbackToast.type];
  const color = colors[feedbackToast.type];

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div
        className="min-w-[400px] bg-[#1E293B] border-2 rounded-2xl shadow-2xl overflow-hidden"
        style={{ borderColor: color.border }}
      >
        {/* Progress Bar */}
        {feedbackToast.duration && (
          <div className="h-1 bg-[#0F172A]">
            <div
              className="h-full transition-all ease-linear"
              style={{
                backgroundColor: color.bg,
                width: '100%',
                animation: `shrink ${feedbackToast.duration}ms linear`,
              }}
            />
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color.bg}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: color.icon }} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4
                className="text-base font-semibold mb-1"
                style={{ color: color.icon }}
              >
                {feedbackToast.title}
              </h4>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {feedbackToast.message}
              </p>

              {/* Action Button */}
              {feedbackToast.action && (
                <button
                  onClick={feedbackToast.action.onClick}
                  className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: `${color.bg}20`,
                    color: color.icon,
                    border: `1px solid ${color.border}40`,
                  }}
                >
                  {feedbackToast.action.label}
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={actions.hideToast}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative Gradient */}
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${color.bg}, transparent)`,
            opacity: 0.3,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
